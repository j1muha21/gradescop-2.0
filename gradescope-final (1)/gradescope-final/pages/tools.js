import Layout from '../components/Layout';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

// ─────────────────────────────────────────────────────────────────
// COUNTRIES — rendered by React so <option>s survive every re-render
// ─────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { name:'Argentina',            flag:'🇦🇷' },
  { name:'Canada',               flag:'🇨🇦' },
  { name:'China',                flag:'🇨🇳' },
  { name:'Ethiopia',             flag:'🇪🇹' },
  { name:'Finland',              flag:'🇫🇮' },
  { name:'France',               flag:'🇫🇷' },
  { name:'Germany',              flag:'🇩🇪' },
  { name:'Ghana',                flag:'🇬🇭' },
  { name:'India',                flag:'🇮🇳' },
  { name:'Iran',                 flag:'🇮🇷' },
  { name:'Ireland',              flag:'🇮🇪' },
  { name:'Italy',                flag:'🇮🇹' },
  { name:'Kenya',                flag:'🇰🇪' },
  { name:'Malaysia',             flag:'🇲🇾' },
  { name:'Netherlands',          flag:'🇳🇱' },
  { name:'New Zealand',          flag:'🇳🇿' },
  { name:'Nigeria',              flag:'🇳🇬' },
  { name:'Pakistan',             flag:'🇵🇰' },
  { name:'Philippines',          flag:'🇵🇭' },
  { name:'Poland',               flag:'🇵🇱' },
  { name:'Portugal',             flag:'🇵🇹' },
  { name:'South Africa',         flag:'🇿🇦' },
  { name:'South Korea',          flag:'🇰🇷' },
  { name:'Spain',                flag:'🇪🇸' },
  { name:'Sweden',               flag:'🇸🇪' },
  { name:'Taiwan',               flag:'🇹🇼' },
  { name:'Turkey',               flag:'🇹🇷' },
  { name:'United Arab Emirates', flag:'🇦🇪' },
  { name:'United Kingdom',       flag:'🇬🇧' },
  { name:'United States',        flag:'🇺🇸' },
  { name:'Vietnam',              flag:'🇻🇳' },
];

// ─────────────────────────────────────────────────────────────────
// SM-2 SPACED REPETITION ENGINE
// Identical to the algorithm used by Anki / SuperMemo-2.
//
// Per card: interval (days), repetitions, ef (easiness factor ≥1.3)
// Quality q: Again→0  Hard→2  Good→4  Easy→5
// On q < 3 : reset to interval=1, reps=0
// On q ≥ 3 : interval = 1 → 6 → interval*ef; ef updated each review
// ─────────────────────────────────────────────────────────────────
const RATING_Q = [0, 2, 4, 5]; // [Again, Hard, Good, Easy]
const RATING_LABELS = ['Again', 'Hard', 'Good', 'Easy'];
const RATING_EMOJI  = ['😓', '😰', '🙂', '😄'];
const RATING_SUBS   = ["Didn't know", 'Very difficult', 'With effort', 'Instant recall'];

function sm2(card, ratingIdx) {
  const q = RATING_Q[ratingIdx];
  let { interval, repetitions, ef } = card;

  if (q < 3) {
    repetitions = 0;
    interval    = 1;
  } else {
    if      (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else                        interval = Math.round(interval * ef);
    repetitions += 1;
  }

  ef = Math.max(1.3, parseFloat((ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)).toFixed(2)));

  const next = new Date();
  next.setDate(next.getDate() + interval);

  return { ...card, interval, repetitions, ef, nextReview: next.toISOString().slice(0,10) };
}

function todayStr() { return new Date().toISOString().slice(0,10); }
function isDue(card) { return !card.nextReview || card.nextReview <= todayStr(); }
function isMastered(card) { return card.interval >= 21; }
function daysUntil(card) { return Math.max(1, Math.ceil((new Date(card.nextReview) - new Date()) / 86400000)); }

function makeCard(front, back) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, front: front.trim(), back: back.trim(), interval: 1, repetitions: 0, ef: 2.5, nextReview: todayStr() };
}
function storeSave(cards) { try { localStorage.setItem('gs_study_v2', JSON.stringify(cards)); } catch {} }
function storeLoad()       { try { return JSON.parse(localStorage.getItem('gs_study_v2') || '[]'); } catch { return []; } }

// ─────────────────────────────────────────────────────────────────
// STUDY TOOL — fully self-contained React component
// ─────────────────────────────────────────────────────────────────
function StudyTool() {
  const [cards,    setCardsRaw] = useState(() => storeLoad());
  const [screen,   setScreen]   = useState('home');   // home | session | done
  const [newF,     setNewF]     = useState('');
  const [newB,     setNewB]     = useState('');
  const [bulk,     setBulk]     = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [editF,    setEditF]    = useState('');
  const [editB,    setEditB]    = useState('');
  const [queue,    setQueue]    = useState([]);
  const [qIdx,     setQIdx]     = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [results,  setResults]  = useState([]);

  const setCards = useCallback(fn => {
    setCardsRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      storeSave(next);
      return next;
    });
  }, []);

  // ── card ops ──
  function addCard() {
    if (!newF.trim() || !newB.trim()) return;
    setCards(p => [...p, makeCard(newF, newB)]);
    setNewF(''); setNewB('');
  }
  function addBulk() {
    const created = bulk.split('\n').filter(l => l.includes('::')).map(l => {
      const [f, ...rest] = l.split('::');
      return makeCard(f, rest.join('::'));
    }).filter(c => c.front && c.back);
    if (!created.length) return;
    setCards(p => [...p, ...created]);
    setBulk(''); setBulkMode(false);
  }
  function deleteCard(id) { setCards(p => p.filter(c => c.id !== id)); }
  function startEdit(card) { setEditId(card.id); setEditF(card.front); setEditB(card.back); }
  function saveEdit() {
    if (!editF.trim() || !editB.trim()) return;
    setCards(p => p.map(c => c.id === editId ? { ...c, front: editF.trim(), back: editB.trim() } : c));
    setEditId(null);
  }
  function resetProgress() {
    if (!confirm('Reset all SM-2 progress? Card content stays intact.')) return;
    setCards(p => p.map(c => ({ ...c, interval: 1, repetitions: 0, ef: 2.5, nextReview: todayStr() })));
  }

  // ── session ops ──
  function startSession() {
    const due = cards.filter(isDue);
    if (!due.length) return;
    setQueue([...due].sort(() => Math.random() - 0.5));
    setQIdx(0); setFlipped(false); setResults([]); setScreen('session');
  }
  function flipCard() { setFlipped(f => !f); }
  function rateCard(idx) {
    const card = queue[qIdx];
    const updated = sm2(card, idx);
    setCards(p => p.map(c => c.id === card.id ? updated : c));
    setResults(p => [...p, { id: card.id, rating: idx }]);
    const next = qIdx + 1;
    if (next >= queue.length) { setScreen('done'); }
    else { setQIdx(next); setFlipped(false); }
  }

  // ── derived stats ──
  const due      = cards.filter(isDue).length;
  const newCount = cards.filter(c => c.repetitions === 0).length;
  const learning = cards.filter(c => c.repetitions > 0 && !isMastered(c)).length;
  const mastered = cards.filter(isMastered).length;
  const avgEF    = cards.length ? (cards.reduce((s,c) => s + c.ef, 0) / cards.length).toFixed(2) : '—';
  const bulkCount = bulk.split('\n').filter(l => l.includes('::')).length;

  // ─── DONE SCREEN ───
  if (screen === 'done') {
    const total  = results.length;
    const passed = results.filter(r => r.rating >= 2).length;
    const pct    = total ? Math.round((passed / total) * 100) : 0;
    const tally  = [0,1,2,3].map(i => results.filter(r => r.rating === i).length);
    return (
      <div className="st-wrap">
        <div className="st-done-card">
          <div style={{fontSize:'3.5rem',marginBottom:'0.75rem'}}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
          <h2 className="st-done-title">Session Complete!</h2>
          <p className="st-done-sub">You reviewed <strong>{total}</strong> card{total !== 1 ? 's' : ''}</p>
          <div className="st-done-bar-bg"><div className="st-done-bar-fill" style={{width:`${pct}%`}} /></div>
          <p className="st-done-pct"><strong>{pct}%</strong> retention</p>
          <div className="st-tally-row">
            {RATING_LABELS.map((l,i) => (
              <div key={l} className={`st-tally st-tally-${l.toLowerCase()}`}><span>{tally[i]}</span>{l}</div>
            ))}
          </div>
          <p className="st-done-next">📅 {cards.filter(isDue).length} card{cards.filter(isDue).length !== 1 ? 's' : ''} ready for review now</p>
          <button className="st-done-back" onClick={() => setScreen('home')}>← Back to Cards</button>
        </div>
      </div>
    );
  }

  // ─── SESSION SCREEN ───
  if (screen === 'session') {
    const card = queue[qIdx];
    const pct  = (qIdx / queue.length) * 100;
    return (
      <div className="st-wrap">
        <div className="st-session-bar">
          <button className="st-end-btn" onClick={() => setScreen('home')}>← End</button>
          <div className="st-prog-bg"><div className="st-prog-fill" style={{width:`${pct}%`}} /></div>
          <span className="st-counter">{qIdx+1}/{queue.length}</span>
        </div>
        <div className={`st-scene${flipped ? ' flipped' : ''}`} onClick={flipCard}>
          <div className="st-inner">
            <div className="st-face st-front">
              <span className="st-face-label">Term / Question</span>
              <p className="st-face-text">{card.front}</p>
              <span className="st-flip-hint">Click to reveal →</span>
            </div>
            <div className="st-face st-back">
              <span className="st-face-label">Answer / Definition</span>
              <p className="st-face-text">{card.back}</p>
            </div>
          </div>
        </div>
        {flipped ? (
          <div className="st-rate-wrap">
            <p className="st-rate-prompt">How well did you recall this?</p>
            <div className="st-rate-row">
              {RATING_LABELS.map((l,i) => (
                <button key={l} className={`st-rate-btn st-rate-${l.toLowerCase()}`} onClick={() => rateCard(i)}>
                  <span className="st-rate-emoji">{RATING_EMOJI[i]}</span>
                  <span className="st-rate-label">{l}</span>
                  <span className="st-rate-sub">{RATING_SUBS[i]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="st-flip-cta">
            <button className="st-flip-btn" onClick={flipCard}>Flip Card</button>
            <p className="st-flip-sub">or click the card above</p>
          </div>
        )}
        <div className="st-card-meta">
          <span>Interval <strong>{card.interval}d</strong></span>
          <span>Reviews <strong>{card.repetitions}</strong></span>
          <span>Ease <strong>{card.ef.toFixed(2)}</strong></span>
        </div>
      </div>
    );
  }

  // ─── HOME SCREEN ───
  return (
    <div className="st-wrap">
      {/* Header */}
      <div className="st-top">
        <div>
          <p className="section-label">Tools / Study Tool</p>
          <h2 className="section-title" style={{marginBottom:'0.2rem'}}>Spaced Repetition Study Tool</h2>
          <p className="section-desc" style={{marginBottom:0}}>SM-2 algorithm schedules reviews at the exact right moment — so you study less and remember more.</p>
        </div>
        <button className={`st-study-btn${!due ? ' st-disabled' : ''}`} onClick={startSession} disabled={!due}>
          {due ? `▶ Study Now — ${due} Due` : 'No cards due today'}
        </button>
      </div>

      {/* Stats */}
      <div className="st-stats">
        {[
          { num: due,      label: 'Due Today',  cls: 'due'      },
          { num: newCount, label: 'New',         cls: 'new'      },
          { num: learning, label: 'Learning',    cls: 'learning' },
          { num: mastered, label: 'Mastered',    cls: 'mastered' },
          { num: cards.length, label: 'Total',   cls: ''         },
          { num: avgEF,    label: 'Avg Ease',    cls: 'ef'       },
        ].map(s => (
          <div key={s.label} className="st-stat-box">
            <div className={`st-stat-num${s.cls ? ' '+s.cls : ''}`}>{s.num}</div>
            <div className="st-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="st-layout">
        {/* ── Add Panel ── */}
        <div className="st-add-panel">
          <div className="st-panel-head">
            <h3 className="st-panel-title">Add Cards</h3>
            <div className="st-toggle">
              <button className={!bulkMode ? 'active' : ''} onClick={() => setBulkMode(false)}>Single</button>
              <button className={bulkMode  ? 'active' : ''} onClick={() => setBulkMode(true)}>Bulk</button>
            </div>
          </div>

          {!bulkMode ? (
            <div className="st-add-form">
              <div className="st-field">
                <label>Front — Term / Question</label>
                <textarea rows={3} placeholder="e.g. What does GPA stand for?" value={newF} onChange={e => setNewF(e.target.value)} />
              </div>
              <div className="st-field">
                <label>Back — Answer / Definition</label>
                <textarea rows={3} placeholder="e.g. Grade Point Average" value={newB} onChange={e => setNewB(e.target.value)} />
              </div>
              <button className="st-add-btn" onClick={addCard} disabled={!newF.trim() || !newB.trim()}>＋ Add Card</button>
            </div>
          ) : (
            <div className="st-add-form">
              <div className="st-field">
                <label>One card per line: <code>Term :: Definition</code></label>
                <textarea rows={9} placeholder={"Photosynthesis :: Plants convert sunlight to glucose\nMitosis :: Cell division producing 2 identical cells\nGPA :: Grade Point Average"} value={bulk} onChange={e => setBulk(e.target.value)} />
              </div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <button className="st-add-btn" style={{flex:1}} onClick={addBulk} disabled={!bulkCount}>Import {bulkCount} Cards</button>
                <button className="st-cancel-btn" onClick={() => { setBulk(''); setBulkMode(false); }}>Cancel</button>
              </div>
            </div>
          )}

          {cards.length > 0 && (
            <button className="st-reset-btn" onClick={resetProgress}>↺ Reset All Progress</button>
          )}

          <div className="st-algo-box">
            <strong>🔬 SM-2 Algorithm</strong>
            <p>Rate each card after flipping. Cards you know well get reviewed less often; harder cards come back sooner. 21+ days between reviews = Mastered.</p>
          </div>
        </div>

        {/* ── Card List ── */}
        <div className="st-list-panel">
          <div className="st-panel-head">
            <h3 className="st-panel-title">{cards.length} Card{cards.length !== 1 ? 's' : ''}</h3>
            {cards.length > 0 && (
              <div className="st-legend">
                <span><span className="st-dot due" />Due</span>
                <span><span className="st-dot learning" />Learning</span>
                <span><span className="st-dot mastered" />Mastered</span>
              </div>
            )}
          </div>

          {cards.length === 0 ? (
            <div className="st-empty">
              <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🧠</div>
              <p>No cards yet — add your first card to begin.</p>
              <p style={{fontSize:'0.8rem',color:'var(--slate-light)',marginTop:'0.5rem'}}>Use the Single form for one card at a time, or Bulk to import many at once.</p>
            </div>
          ) : (
            <div className="st-card-list">
              {cards.map(card => {
                const due_  = isDue(card);
                const mast_ = isMastered(card);
                const cls   = mast_ ? 'mastered' : due_ ? 'due' : 'learning';
                const badge = mast_ ? 'Mastered' : due_ ? 'Due' : `In ${daysUntil(card)}d`;

                if (editId === card.id) return (
                  <div key={card.id} className="st-card-item editing">
                    <textarea className="st-edit-ta" rows={2} value={editF} onChange={e => setEditF(e.target.value)} placeholder="Front" />
                    <textarea className="st-edit-ta" rows={2} value={editB} onChange={e => setEditB(e.target.value)} placeholder="Back" style={{marginTop:'0.4rem'}} />
                    <div style={{display:'flex',gap:'0.4rem',marginTop:'0.4rem'}}>
                      <button className="st-save-btn" onClick={saveEdit}>Save</button>
                      <button className="st-cancel-small" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </div>
                );

                return (
                  <div key={card.id} className={`st-card-item ${cls}`}>
                    <div className="st-ci-content">
                      <div className="st-ci-front">{card.front}</div>
                      <div className="st-ci-back">{card.back}</div>
                    </div>
                    <div className="st-ci-meta">
                      <span className={`st-badge ${cls}`}>{badge}</span>
                      <span className="st-ci-stats">{card.repetitions}× · EF {card.ef.toFixed(1)}</span>
                      <div className="st-ci-btns">
                        <button onClick={() => startEdit(card)} title="Edit">✏️</button>
                        <button onClick={() => deleteCard(card.id)} title="Delete">🗑</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'tool',  label: '🎓 Grade Converter' },
  { id: 'gpa',   label: '📊 GPA Calculator'  },
  { id: 'study', label: '🧠 Study Tool'       },
];

export default function Tools() {
  const router = useRouter();
  const [activeTab,   setActiveTab]   = useState('tool');
  const [dstCountry,  setDstCountry]  = useState('Germany');
  const engineReady = useRef(false);

  // URL-driven tab switching
  useEffect(() => {
    const tab = router.query.tab;
    if (tab && TABS.some(t => t.id === tab)) setActiveTab(tab);
  }, [router.query.tab]);

  // Wire engine.js after it loads — poll until ready
  useEffect(() => {
    if (engineReady.current) return;
    let attempts = 0;
    function tryInit() {
      const src = document.getElementById('srcCountry');
      const dst = document.getElementById('dstCountry');
      if (!window.updateHint || !src || !dst || src.options.length === 0) {
        if (attempts++ < 100) { setTimeout(tryInit, 100); return; }
        return;
      }
      if (engineReady.current) return;
      engineReady.current = true;
      try {
        src.addEventListener('change', window.updateHint);
        dst.addEventListener('change', window.updateHint);
        document.getElementById('swapBtn').addEventListener('click', window.swapCountries);
        window.updateHint();
        if (window.initGPA) window.initGPA();
        const lang = typeof localStorage !== 'undefined' && localStorage.getItem('gs_lang');
        if (lang && window.GS_setLanguage) window.GS_setLanguage(lang, null);
      } catch (e) { console.error('Engine init error:', e); }
    }
    tryInit();
    return () => {
      const src = document.getElementById('srcCountry');
      const dst = document.getElementById('dstCountry');
      if (src && window.updateHint) src.removeEventListener('change', window.updateHint);
      if (dst && window.updateHint) dst.removeEventListener('change', window.updateHint);
    };
  }, []);

  // Re-init GPA when switching to that tab
  useEffect(() => {
    if (activeTab === 'gpa') setTimeout(() => window.initGPA && window.initGPA(), 60);
  }, [activeTab]);

  function switchTab(id) {
    setActiveTab(id);
    router.replace({ pathname: '/tools', query: id !== 'tool' ? { tab: id } : {} }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Layout title="GradeScope — Tools" activePage="tools">

      {/* ── TAB BAR ── */}
      <div className="tools-tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tools-tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => switchTab(t.id)}>
            {t.label}
            <span className="dropdown-badge" style={{marginLeft:'0.4rem'}}>LIVE</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════
          GRADE CONVERTER
      ════════════════════════════════════════ */}
      <div style={{display: activeTab === 'tool' ? 'block' : 'none'}}>
        <div className="tool-wrap">
          <div className="tool-header">
            <p className="section-label" data-i18n="tool.label">Tools / Grade Converter</p>
            <h2 className="section-title" data-i18n="tool.title">International Grade Converter</h2>
            <p className="section-desc" data-i18n="tool.desc">Select source and destination countries, enter your grade, and receive a fully transparent conversion with formula breakdown.</p>
          </div>
          <div className="converter-card fade-in">
            <div className="converter-top">
              <h2 data-i18n="tool.cardTitle">Grade Conversion Tool</h2>
              <span className="converter-badge" data-i18n="tool.badge">FORMULA TRANSPARENT</span>
            </div>
            <div className="converter-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" data-i18n="tool.sourceCountry">Source Country</label>
                  <select className="form-select" id="srcCountry">
                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
                <button className="swap-btn" id="swapBtn" title="Swap countries">⇄</button>
                <div className="form-group">
                  <label className="form-label" data-i18n="tool.destCountry">Destination Country</label>
                  <select
                    className="form-select"
                    id="dstCountry"
                    value={dstCountry}
                    onChange={e => { setDstCountry(e.target.value); setTimeout(() => window.updateHint && window.updateHint(), 10); }}
                  >
                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grade-row">
                <div className="form-group">
                  <label className="form-label" data-i18n="tool.yourGrade">Your Grade</label>
                  <input type="number" className="form-input" id="gradeInput" placeholder="e.g. 85" step="0.01" />
                </div>
                <div className="form-group">
                  <label className="form-label" data-i18n="tool.gradeHint">Grade Format Hint</label>
                  <input type="text" className="form-input" id="gradeHint" readOnly placeholder="Select a country first" />
                </div>
              </div>
              <button className="convert-btn" onClick={() => window.convertGrade && window.convertGrade()} data-i18n="tool.convertBtn">Convert Grade →</button>
              <div className="result-area" id="resultArea">
                <div className="result-main">
                  <div className="result-grade-box">
                    <div className="result-label-sm" data-i18n="tool.convertedGrade">Converted Grade</div>
                    <div className="result-value" id="resultValue">—</div>
                    <div className="result-scale" id="resultScale"></div>
                  </div>
                  <div className="result-info">
                    <h3 id="resultTitle">Conversion Result</h3>
                    <p id="resultDesc"></p>
                  </div>
                </div>
                <div id="verdictPanel" className="verdict-panel pass-verdict">
                  <span className="verdict-badge" id="verdictBadge">PASS</span>
                  <div className="verdict-details">
                    <div className="verdict-classification" id="verdictClassification">—</div>
                    <div className="verdict-explanation" id="verdictExplanation">—</div>
                  </div>
                </div>
                <div className="formula-block">
                  <h4 data-i18n="tool.formulaUsed">📐 Formula Used</h4>
                  <div className="formula-eq" id="formulaEq"></div>
                  <ul className="formula-vars" id="formulaVars"></ul>
                </div>
                <div className="steps-block">
                  <h4 data-i18n="tool.stepByStep">🔢 Step-by-Step Calculation</h4>
                  <div id="stepsContent"></div>
                </div>
                <table className="scale-table" id="scaleTable">
                  <thead><tr>
                    <th data-i18n="tool.th.gradeLevel">Grade Level</th>
                    <th data-i18n="tool.th.sourceScale">Source Scale</th>
                    <th data-i18n="tool.th.destScale">Destination Scale</th>
                    <th data-i18n="tool.th.classification">Classification</th>
                  </tr></thead>
                  <tbody id="scaleBody"></tbody>
                </table>
                <div className="disclaimer">
                  <strong data-i18n="tool.disclaimerTitle">⚠ Academic Disclaimer:</strong>{' '}
                  <span data-i18n="tool.disclaimerText">This conversion is provided for informational purposes only. Final grade recognition and admission decisions rest solely with the receiving institution.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          GPA CALCULATOR
      ════════════════════════════════════════ */}
      <div style={{display: activeTab === 'gpa' ? 'block' : 'none'}}>
        <div className="gpa-wrap">
          <div className="tool-header">
            <p className="section-label" data-i18n="gpa.label">Tools / GPA Calculator</p>
            <h2 className="section-title" data-i18n="gpa.title">GPA Calculator</h2>
            <p className="section-desc" data-i18n="gpa.desc">Calculate your GPA across multiple grading scales — 4.0, 4.3, 4.5, or 5.0. Add courses, assign grades and credits, get a full weighted breakdown.</p>
          </div>
          <div className="gpa-layout">
            <div>
              <div className="gpa-card fade-in">
                <div className="gpa-card-top">
                  <h2 data-i18n="gpa.courseEntry">Course Grade Entry</h2>
                  <div className="gpa-scale-switcher">
                    {['4.0','4.3','4.5','5.0'].map((s,i) => (
                      <button key={s} className={`scale-pill${i===0?' active':''}`} data-scale={s}
                        onClick={e => window.setGPAScale && window.setGPAScale(s, e.currentTarget)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="gpa-body">
                  <div className="courses-header">
                    <span data-i18n="gpa.courseName">Course Name</span>
                    <span data-i18n="gpa.credits">Credits</span>
                    <span data-i18n="gpa.grade">Grade</span>
                    <span></span>
                  </div>
                  <div id="courseRows"></div>
                  <div className="gpa-actions">
                    <button className="add-course-btn" onClick={() => window.addCourseRow && window.addCourseRow()} data-i18n="gpa.addCourse">＋ Add Course</button>
                    <button className="calc-gpa-btn"   onClick={() => window.calculateGPA  && window.calculateGPA()}  data-i18n="gpa.calcBtn">Calculate GPA →</button>
                    <button className="clear-btn"      onClick={() => window.clearAll       && window.clearAll()}       data-i18n="gpa.clearAll">✕ Clear All</button>
                  </div>
                </div>
              </div>

              {/* Cumulative */}
              <div className="cumulative-section">
                <h3 data-i18n="gpa.cumulativeTitle">📈 Cumulative GPA (Optional)</h3>
                <p style={{fontSize:'0.85rem',color:'var(--slate-light)',marginBottom:'1rem'}} data-i18n="gpa.cumulativeDesc">Enter your existing GPA and credit hours to include them in the total.</p>
                <div className="cumulative-inputs">
                  <div className="form-group">
                    <label className="form-label" data-i18n="gpa.prevGPA">Previous GPA</label>
                    <input type="number" className="form-input" id="prevGPA" placeholder="e.g. 3.45" step="0.01" min="0" max="5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" data-i18n="gpa.prevCredits">Previous Credit Hours</label>
                    <input type="number" className="form-input" id="prevCredits" placeholder="e.g. 60" step="1" min="0" />
                  </div>
                  <button className="calc-gpa-btn" style={{height:'44px',whiteSpace:'nowrap'}}
                    onClick={() => window.calculateGPA && window.calculateGPA()} data-i18n="gpa.recalc">Recalculate</button>
                </div>
                <div id="cumulativeResult" style={{display:'none',marginTop:'1rem',padding:'1rem',background:'var(--white)',borderRadius:'8px',border:'1px solid var(--border)'}}></div>
              </div>

              {/* Reference table */}
              <div style={{marginTop:'1.5rem',background:'var(--white)',border:'1px solid var(--border)',borderRadius:'10px',overflow:'hidden'}}>
                <div style={{background:'var(--ink)',padding:'1rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontFamily:"'Playfair Display',serif",color:'var(--white)',fontSize:'1rem',fontWeight:700}} data-i18n="gpa.scaleRef">Grade Scale Reference</span>
                  <span id="refScaleLabel" style={{fontFamily:"'DM Mono',monospace",fontSize:'0.72rem',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold)'}}>4.0 SCALE</span>
                </div>
                <table className="scale-table" id="gradeReferenceTable">
                  <thead><tr>
                    <th data-i18n="gpa.th.letter">Letter Grade</th>
                    <th data-i18n="gpa.th.percent">Percentage</th>
                    <th data-i18n="gpa.th.points">Grade Points</th>
                    <th data-i18n="gpa.th.class">Classification</th>
                  </tr></thead>
                  <tbody id="gradeReferenceBody"></tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="gpa-result-panel">
                <div className="gpa-result-top"><h3 data-i18n="gpa.resultTitle">📊 Your GPA Result</h3></div>
                <div className="gpa-result-body">
                  <div id="gpaEmptyState" className="gpa-empty-state">
                    <div className="big-icon">🎓</div>
                    <p data-i18n="gpa.emptyState">Add your courses and click <strong>Calculate GPA</strong> to see your result.</p>
                  </div>
                  <div id="gpaResultContent" style={{display:'none'}}>
                    <div className="gpa-meter">
                      <div className="gpa-big-num" id="gpaDisplayNum">0.00</div>
                      <div className="gpa-scale-label" id="gpaScaleLabel">out of 4.0</div>
                      <div className="gpa-classification" id="gpaClassLabel">—</div>
                    </div>
                    <div className="gpa-bar-wrap"><div className="gpa-bar-fill" id="gpaBarFill"></div></div>
                    <div className="gpa-breakdown">
                      <div className="gpa-breakdown-row"><span className="label" data-i18n="gpa.totalCredits">Total Credits</span><span className="val" id="res_totalCredits">—</span></div>
                      <div className="gpa-breakdown-row"><span className="label" data-i18n="gpa.totalPoints">Total Quality Points</span><span className="val" id="res_totalPoints">—</span></div>
                      <div className="gpa-breakdown-row"><span className="label" data-i18n="gpa.coursesEntered">Courses Entered</span><span className="val" id="res_courseCount">—</span></div>
                      <div className="gpa-breakdown-row"><span className="label" data-i18n="gpa.gpaScale">GPA Scale</span><span className="val" id="res_scale">—</span></div>
                      <div className="gpa-breakdown-row"><span className="label" data-i18n="gpa.pctEquiv">Percentage Equivalent</span><span className="val" id="res_pct">—</span></div>
                    </div>
                    <div className="gpa-course-list">
                      <h4 data-i18n="gpa.courseBreakdown">Course Breakdown</h4>
                      <div id="res_courseList"></div>
                    </div>
                    <div className="gpa-formula-note">
                      <strong data-i18n="gpa.formula">Formula:</strong> <code>GPA = Σ(Grade Points × Credit Hours) / Σ(Credit Hours)</code><br />
                      <span data-i18n="gpa.formulaNote">Quality points per course = Grade Points × Credits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          STUDY TOOL — pure React, no engine.js
      ════════════════════════════════════════ */}
      {activeTab === 'study' && <StudyTool />}

      <Script src="/engine.js" strategy="afterInteractive" />

      <style jsx global>{`
        /* ── TAB BAR ── */
        .tools-tab-bar{display:flex;gap:.5rem;padding:1rem 2rem;background:var(--ink);border-bottom:2px solid var(--gold);overflow-x:auto;position:sticky;top:62px;z-index:90;}
        .tools-tab-btn{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);padding:.5rem 1.1rem;border-radius:6px;font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap;display:flex;align-items:center;}
        .tools-tab-btn:hover{color:#fff;border-color:rgba(255,255,255,.4);}
        .tools-tab-btn.active{background:var(--gold);color:var(--ink);border-color:var(--gold);font-weight:700;}

        /* ── STUDY WRAP ── */
        .st-wrap{max-width:1200px;margin:0 auto;padding:2.5rem 2rem 4rem;}
        .st-top{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;margin-bottom:1.75rem;flex-wrap:wrap;}
        .st-study-btn{background:var(--gold);color:var(--ink);border:none;border-radius:8px;padding:.85rem 1.75rem;font-size:.95rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .18s,transform .15s;flex-shrink:0;}
        .st-study-btn:hover:not(.st-disabled){background:#d4a83a;transform:translateY(-1px);}
        .st-disabled{opacity:.5;cursor:not-allowed;}

        /* stats */
        .st-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:.85rem;margin-bottom:2rem;}
        @media(max-width:900px){.st-stats{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:480px){.st-stats{grid-template-columns:repeat(2,1fr);}}
        .st-stat-box{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:.85rem;text-align:center;}
        .st-stat-num{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:700;color:var(--ink);}
        .st-stat-num.due{color:#e74c3c;} .st-stat-num.new{color:var(--gold);} .st-stat-num.learning{color:#3498db;} .st-stat-num.mastered{color:#27ae60;}
        .st-stat-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--slate-light);margin-top:.2rem;}

        /* layout */
        .st-layout{display:grid;grid-template-columns:340px 1fr;gap:1.5rem;align-items:start;}
        @media(max-width:860px){.st-layout{grid-template-columns:1fr;}}

        /* add panel */
        .st-add-panel{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.4rem;position:sticky;top:130px;}
        .st-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem;}
        .st-panel-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;margin:0;}
        .st-toggle{display:flex;background:var(--parchment);border-radius:6px;padding:2px;gap:2px;}
        .st-toggle button{background:transparent;border:none;border-radius:4px;padding:.28rem .7rem;font-size:.78rem;cursor:pointer;color:var(--slate-light);font-family:'DM Sans',sans-serif;transition:all .18s;}
        .st-toggle button.active{background:var(--ink);color:#fff;font-weight:600;}
        .st-add-form{display:flex;flex-direction:column;gap:.8rem;}
        .st-field{display:flex;flex-direction:column;gap:.25rem;}
        .st-field label{font-size:.75rem;font-weight:600;color:var(--slate);text-transform:uppercase;letter-spacing:.05em;}
        .st-field textarea{border:1px solid var(--border);border-radius:7px;padding:.6rem .8rem;font-family:'DM Sans',sans-serif;font-size:.87rem;resize:vertical;background:var(--parchment);color:var(--ink);transition:border-color .18s;min-height:66px;}
        .st-field textarea:focus{outline:none;border-color:var(--gold);background:#fff;}
        .st-field code{background:var(--parchment);padding:1px 5px;border-radius:3px;font-size:.8em;}
        .st-add-btn{background:var(--ink);color:var(--gold);border:1.5px solid var(--gold);border-radius:7px;padding:.65rem 1.2rem;font-size:.875rem;font-weight:600;cursor:pointer;transition:background .18s,color .18s;font-family:'DM Sans',sans-serif;}
        .st-add-btn:hover:not(:disabled){background:var(--gold);color:var(--ink);}
        .st-add-btn:disabled{opacity:.45;cursor:not-allowed;}
        .st-cancel-btn{background:transparent;border:1px solid var(--border);border-radius:7px;padding:.65rem 1rem;font-size:.875rem;cursor:pointer;color:var(--slate-light);font-family:'DM Sans',sans-serif;}
        .st-reset-btn{margin-top:.85rem;width:100%;background:transparent;border:1px dashed #e74c3c;color:#e74c3c;border-radius:6px;padding:.45rem;font-size:.78rem;cursor:pointer;transition:background .18s;}
        .st-reset-btn:hover{background:rgba(231,76,60,.08);}
        .st-algo-box{margin-top:1rem;padding:.85rem 1rem;background:var(--parchment);border-left:3px solid var(--gold);border-radius:0 6px 6px 0;font-size:.79rem;color:var(--slate);line-height:1.6;}
        .st-algo-box strong{display:block;margin-bottom:.3rem;}

        /* list panel */
        .st-list-panel{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:1.4rem;}
        .st-legend{display:flex;gap:.75rem;font-size:.76rem;color:var(--slate-light);}
        .st-legend span{display:flex;align-items:center;gap:.3rem;}
        .st-dot{width:8px;height:8px;border-radius:50%;display:inline-block;}
        .st-dot.due{background:#e74c3c;} .st-dot.learning{background:#3498db;} .st-dot.mastered{background:#27ae60;}
        .st-empty{text-align:center;padding:3rem 1rem;color:var(--slate-light);}
        .st-card-list{display:flex;flex-direction:column;gap:.55rem;max-height:560px;overflow-y:auto;}
        .st-card-item{border:1px solid var(--border);border-left:3px solid var(--border);border-radius:8px;padding:.8rem .95rem;transition:border-color .2s;}
        .st-card-item.due{border-left-color:#e74c3c;} .st-card-item.learning{border-left-color:#3498db;} .st-card-item.mastered{border-left-color:#27ae60;} .st-card-item.editing{border-color:var(--gold);}
        .st-ci-content{margin-bottom:.4rem;}
        .st-ci-front{font-size:.87rem;font-weight:600;color:var(--ink);margin-bottom:.15rem;}
        .st-ci-back{font-size:.79rem;color:var(--slate-light);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .st-ci-meta{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap;}
        .st-badge{font-size:.66rem;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.06em;}
        .st-badge.due{background:rgba(231,76,60,.1);color:#e74c3c;} .st-badge.learning{background:rgba(52,152,219,.1);color:#3498db;} .st-badge.mastered{background:rgba(39,174,96,.1);color:#27ae60;}
        .st-ci-stats{font-size:.74rem;color:var(--slate-light);margin-left:auto;}
        .st-ci-btns{display:flex;gap:.25rem;}
        .st-ci-btns button{background:none;border:none;cursor:pointer;font-size:.82rem;padding:2px 4px;border-radius:4px;opacity:.6;transition:opacity .15s,background .15s;}
        .st-ci-btns button:hover{opacity:1;background:rgba(0,0,0,.06);}
        .st-edit-ta{width:100%;border:1px solid var(--border);border-radius:6px;padding:.45rem .7rem;font-family:'DM Sans',sans-serif;font-size:.84rem;background:var(--parchment);box-sizing:border-box;}
        .st-edit-ta:focus{outline:none;border-color:var(--gold);}
        .st-save-btn{background:var(--gold);color:var(--ink);border:none;border-radius:5px;padding:.35rem .8rem;font-size:.79rem;font-weight:600;cursor:pointer;}
        .st-cancel-small{background:transparent;border:1px solid var(--border);border-radius:5px;padding:.35rem .8rem;font-size:.79rem;cursor:pointer;color:var(--slate-light);}

        /* ── SESSION ── */
        .st-session-bar{display:flex;align-items:center;gap:1rem;margin-bottom:2rem;}
        .st-end-btn{background:transparent;border:1px solid var(--border);border-radius:6px;padding:.45rem .9rem;font-size:.84rem;cursor:pointer;color:var(--slate);white-space:nowrap;transition:border-color .18s;}
        .st-end-btn:hover{border-color:var(--slate);}
        .st-prog-bg{flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;}
        .st-prog-fill{height:100%;background:var(--gold);transition:width .4s ease;}
        .st-counter{font-family:'DM Mono',monospace;font-size:.78rem;color:var(--slate-light);white-space:nowrap;}

        /* card flip */
        .st-scene{perspective:1200px;cursor:pointer;margin-bottom:1.5rem;min-height:220px;user-select:none;}
        .st-inner{position:relative;width:100%;min-height:220px;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,0,.2,1);}
        .st-scene.flipped .st-inner{transform:rotateY(180deg);}
        .st-face{position:absolute;width:100%;min-height:220px;backface-visibility:hidden;border:1px solid var(--border);border-radius:14px;padding:2.5rem 2rem;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:var(--white);box-shadow:0 4px 20px rgba(0,0,0,.06);}
        .st-front{border-top:4px solid var(--gold);}
        .st-back{transform:rotateY(180deg);border-top:4px solid #27ae60;background:var(--parchment);}
        .st-face-label{font-family:'DM Mono',monospace;font-size:.63rem;letter-spacing:.12em;text-transform:uppercase;color:var(--slate-light);margin-bottom:.85rem;}
        .st-face-text{font-size:1.2rem;line-height:1.6;color:var(--ink);font-weight:500;max-width:600px;}
        .st-flip-hint{margin-top:1.5rem;font-size:.76rem;color:var(--slate-light);font-style:italic;}

        /* rating */
        .st-rate-wrap{text-align:center;margin-bottom:1rem;}
        .st-rate-prompt{font-size:.84rem;color:var(--slate-light);margin-bottom:.85rem;font-style:italic;}
        .st-rate-row{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;}
        .st-rate-btn{display:flex;flex-direction:column;align-items:center;gap:.25rem;padding:.8rem 1.3rem;border-radius:10px;border:2px solid transparent;cursor:pointer;transition:all .18s;min-width:86px;font-family:'DM Sans',sans-serif;}
        .st-rate-emoji{font-size:1.35rem;} .st-rate-label{font-size:.86rem;font-weight:700;} .st-rate-sub{font-size:.7rem;opacity:.75;}
        .st-rate-again{background:rgba(231,76,60,.08);color:#c0392b;border-color:rgba(231,76,60,.3);}
        .st-rate-again:hover{background:rgba(231,76,60,.18);border-color:#e74c3c;}
        .st-rate-hard{background:rgba(243,156,18,.08);color:#b7770d;border-color:rgba(243,156,18,.3);}
        .st-rate-hard:hover{background:rgba(243,156,18,.18);border-color:#f39c12;}
        .st-rate-good{background:rgba(52,152,219,.08);color:#1a6fa3;border-color:rgba(52,152,219,.3);}
        .st-rate-good:hover{background:rgba(52,152,219,.18);border-color:#3498db;}
        .st-rate-easy{background:rgba(39,174,96,.08);color:#1e8449;border-color:rgba(39,174,96,.3);}
        .st-rate-easy:hover{background:rgba(39,174,96,.18);border-color:#27ae60;}
        .st-flip-cta{text-align:center;margin-bottom:1.5rem;}
        .st-flip-btn{background:var(--ink);color:var(--gold);border:2px solid var(--gold);border-radius:8px;padding:.7rem 2rem;font-size:.93rem;font-weight:600;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;}
        .st-flip-btn:hover{background:var(--gold);color:var(--ink);}
        .st-flip-sub{font-size:.76rem;color:var(--slate-light);margin-top:.45rem;}
        .st-card-meta{display:flex;gap:1.5rem;justify-content:center;margin-top:1rem;font-size:.76rem;color:var(--slate-light);font-family:'DM Mono',monospace;}

        /* done */
        .st-done-card{max-width:480px;margin:2rem auto;text-align:center;background:var(--white);border:1px solid var(--border);border-radius:16px;padding:3rem 2rem;box-shadow:0 8px 32px rgba(0,0,0,.07);}
        .st-done-title{font-family:'Playfair Display',serif;font-size:1.7rem;font-weight:900;margin-bottom:.4rem;}
        .st-done-sub{color:var(--slate-light);font-size:.88rem;margin-bottom:1.4rem;}
        .st-done-bar-bg{background:var(--border);border-radius:999px;height:9px;overflow:hidden;margin-bottom:.45rem;}
        .st-done-bar-fill{height:100%;background:linear-gradient(90deg,var(--gold),#27ae60);border-radius:999px;transition:width .6s ease;}
        .st-done-pct{font-size:1.05rem;font-weight:700;margin-bottom:1.3rem;}
        .st-tally-row{display:flex;gap:.65rem;justify-content:center;margin-bottom:1.3rem;flex-wrap:wrap;}
        .st-tally{display:flex;flex-direction:column;align-items:center;padding:.45rem .8rem;border-radius:8px;font-size:.78rem;font-weight:600;}
        .st-tally span{font-size:1.25rem;font-weight:700;margin-bottom:.15rem;}
        .st-tally-again{background:rgba(231,76,60,.1);color:#c0392b;} .st-tally-hard{background:rgba(243,156,18,.1);color:#b7770d;} .st-tally-good{background:rgba(52,152,219,.1);color:#1a6fa3;} .st-tally-easy{background:rgba(39,174,96,.1);color:#1e8449;}
        .st-done-next{font-size:.83rem;color:var(--slate-light);margin-bottom:1.3rem;}
        .st-done-back{background:var(--ink);color:var(--gold);border:2px solid var(--gold);border-radius:8px;padding:.7rem 1.8rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .18s;font-family:'DM Sans',sans-serif;}
        .st-done-back:hover{background:var(--gold);color:var(--ink);}
      `}</style>
    </Layout>
  );
}
