import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

const TABS = [
  { id: 'tool', label: '🎓 Grade Converter' },
  { id: 'gpa',  label: '📊 GPA Calculator' },
];

export default function Tools() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tool');

  // Set tab from URL query param
  useEffect(() => {
    const tab = router.query.tab;
    if (tab && ['tool', 'gpa'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [router.query.tab]);

  // On mount: poll until engine.js functions exist AND DOM is ready, then init.
  // Polling avoids reliance on Script onLoad which can silently skip in React
  // Strict Mode and on client-side navigations when the script is already cached.
  useEffect(() => {
    let attempts = 0;
    function tryInit() {
      const src = document.getElementById('srcCountry');
      if (!window.init || !src) {
        if (attempts++ < 60) { setTimeout(tryInit, 100); return; }
      }
      try {
        if (window.init) window.init();
        if (window.initGPA) window.initGPA();
        // Re-apply saved language so tool labels render translated
        const lang = typeof localStorage !== 'undefined' && localStorage.getItem('gs_lang');
        if (lang && window.GS_setLanguage) window.GS_setLanguage(lang, null);
      } catch (e) {
        console.error('Engine init error:', e);
      }
    }
    tryInit();
  }, []);

  // Re-run initGPA when switching to GPA tab
  useEffect(() => {
    if (activeTab === 'gpa') {
      setTimeout(() => window.initGPA && window.initGPA(), 50);
    }
  }, [activeTab]);

  function switchTab(id) {
    setActiveTab(id);
    router.replace({ pathname: '/tools', query: id !== 'tool' ? { tab: id } : {} }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <Layout title="GradeScope — Tools" activePage="tools">

      {/* Tab bar */}
      <div className="tools-tab-bar">
        {TABS.map(t => (
          <button key={t.id} className={`tools-tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => switchTab(t.id)}>
            {t.label}
            <span className="dropdown-badge" style={{ marginLeft: '0.4rem' }}>LIVE</span>
          </button>
        ))}
      </div>

      {/* ── GRADE CONVERTER ── */}
      <div style={{ display: activeTab === 'tool' ? 'block' : 'none' }}>
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
                  <select className="form-select" id="srcCountry"></select>
                </div>
                <button className="swap-btn" id="swapBtn" title="Swap countries">⇄</button>
                <div className="form-group">
                  <label className="form-label" data-i18n="tool.destCountry">Destination Country</label>
                  <select className="form-select" id="dstCountry"></select>
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

      {/* ── GPA CALCULATOR ── */}
      <div style={{ display: activeTab === 'gpa' ? 'block' : 'none' }}>
        <div className="gpa-wrap">
          <div className="tool-header">
            <p className="section-label" data-i18n="gpa.label">Tools / GPA Calculator</p>
            <h2 className="section-title" data-i18n="gpa.title">GPA Calculator</h2>
            <p className="section-desc" data-i18n="gpa.desc">Calculate your GPA across multiple grading scales — 4.0, 4.3, 4.5, or 5.0.</p>
          </div>
          <div className="gpa-layout">
            <div>
              <div className="gpa-card fade-in">
                <div className="gpa-card-top">
                  <h2 data-i18n="gpa.courseEntry">Course Grade Entry</h2>
                  <div className="gpa-scale-switcher">
                    {['4.0','4.3','4.5','5.0'].map((s,i) => (
                      <button key={s} className={`scale-pill ${i===0?'active':''}`} data-scale={s} onClick={e => window.setGPAScale && window.setGPAScale(s, e.currentTarget)}>{s}</button>
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
                    <button className="calc-gpa-btn" onClick={() => window.calculateGPA && window.calculateGPA()} data-i18n="gpa.calcBtn">Calculate GPA →</button>
                    <button className="clear-btn" onClick={() => window.clearAll && window.clearAll()} data-i18n="gpa.clearAll">✕ Clear All</button>
                  </div>
                </div>
              </div>
              <div className="cumulative-section">
                <h3 data-i18n="gpa.cumulativeTitle">📈 Cumulative GPA (Optional)</h3>
                <p style={{fontSize:'0.85rem',color:'var(--slate-light)',marginBottom:'1rem'}} data-i18n="gpa.cumulativeDesc">Enter your existing GPA and credit hours to calculate your new cumulative GPA.</p>
                <div className="cumulative-inputs">
                  <div className="form-group">
                    <label className="form-label" data-i18n="gpa.prevGPA">Previous GPA</label>
                    <input type="number" className="form-input" id="prevGPA" placeholder="e.g. 3.45" step="0.01" min="0" max="5" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" data-i18n="gpa.prevCredits">Previous Credit Hours</label>
                    <input type="number" className="form-input" id="prevCredits" placeholder="e.g. 60" step="1" min="0" />
                  </div>
                  <button className="calc-gpa-btn" style={{height:'44px',whiteSpace:'nowrap'}} onClick={() => window.calculateGPA && window.calculateGPA()} data-i18n="gpa.recalc">Recalculate</button>
                </div>
                <div id="cumulativeResult" style={{display:'none',marginTop:'1rem',padding:'1rem',background:'var(--white)',borderRadius:'8px',border:'1px solid var(--border)'}}></div>
              </div>
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
                <div className="gpa-result-top">
                  <h3 data-i18n="gpa.resultTitle">📊 Your GPA Result</h3>
                </div>
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

      {/* Engine — polling in useEffect handles load timing, no onLoad needed */}
      <Script src="/engine.js" strategy="afterInteractive" />

      <style jsx>{`
        .tools-tab-bar {
          display: flex; gap: 0.5rem; padding: 1rem 2rem;
          background: var(--ink); border-bottom: 2px solid var(--gold);
          overflow-x: auto; position: sticky; top: 62px; z-index: 90;
        }
        .tools-tab-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6); padding: 0.5rem 1.1rem; border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          display: flex; align-items: center;
        }
        .tools-tab-btn:hover { color: #fff; border-color: rgba(255,255,255,0.4); }
        .tools-tab-btn.active { background: var(--gold); color: var(--ink); border-color: var(--gold); font-weight: 700; }
      `}</style>
    </Layout>
  );
}
