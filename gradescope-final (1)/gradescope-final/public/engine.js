
// ── ROUTING STUBS (Next.js handles routing) ──
function showSection(id) {
  // In the multi-page version, use window.location for cross-page navigation
  const routes = { home:'/', tool:'/tools', gpa:'/tools?tab=gpa', flashcard:'/tools?tab=flashcard', about:'/about', contact:'/contact', privacy:'/privacy-policy' };
  if (routes[id]) window.location.href = routes[id];
}

// ── COUNTRY DATABASE (v2 — corrected scales) ──
// Fields: name, iso, flag, min, max, pass, dir (asc/desc), type, scale (display)
// Germany: 1.0 best → 4.0 pass → 5.0 fail (desc). Bavarian formula uses Nmax=best=1, Nmin=pass=4.
// Philippines: 1.0 best → 3.0 pass → 5.0 fail (desc). Linear reverse.
// Nigeria: 5.0 GPA (5-point scale, ascending). Pass = 1.5 (D).
// South Korea: 4.5 GPA. Pass = 2.0.
// China: 100-point. Pass = 60.
// India: 10-point CGPA. Pass = 5.0.
// Pakistan: 4.0 GPA. Pass = 2.0.
// Kenya/Ghana/Ethiopia: 4.0 GPA. Pass = 2.0.
// New Zealand: 4.0 GPA. Pass = 2.0.
// Malaysia/Canada/US/UAE-GPA: 4.0 GPA. Pass = 2.0.
// Turkey: 4.0 GPA. Pass = 2.0.
// Sweden: numeric 0-5 internally. Pass = 3.
// Finland: 0-5. Pass = 1 (some use 1 as lowest pass).
// Iran: 0-20. Pass = 10.
// France/Portugal: 0-20. Pass = 10.
// Spain/Argentina/Vietnam: 0-10. Pass = 5.
// Italy: 18-30. Pass = 18.
// Netherlands: 1-10. Pass = 5.5.
// South Africa: 0-100 percentage. Pass = 50.
// UAE: 4.0 GPA with percentage option. Using GPA internally.
const COUNTRIES = [
  { name:"Argentina",            iso:"AR", flag:"🇦🇷", min:0,   max:10,  pass:6,   dir:"asc",  type:"linear",         scale:"0–10",          scaleNote:"10-point scale" },
  { name:"Canada",               iso:"CA", flag:"🇨🇦", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA scale" },
  { name:"China",                iso:"CN", flag:"🇨🇳", min:0,   max:100, pass:60,  dir:"asc",  type:"linear",         scale:"0–100 (百分制)", scaleNote:"100-point scale; 60 = pass" },
  { name:"Ethiopia",             iso:"ET", flag:"🇪🇹", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA scale; 2.0 = pass" },
  { name:"Finland",              iso:"FI", flag:"🇫🇮", min:0,   max:5,   pass:1,   dir:"asc",  type:"linear",         scale:"0–5",            scaleNote:"0–5 numeric; 1 = minimum pass" },
  { name:"France",               iso:"FR", flag:"🇫🇷", min:0,   max:20,  pass:10,  dir:"asc",  type:"linear",         scale:"0–20",           scaleNote:"20-point scale; 10/20 = pass" },
  { name:"Germany",              iso:"DE", flag:"🇩🇪", min:1.0, max:5.0, pass:4.0, dir:"desc", type:"bavarian",       scale:"1.0–5.0 (1=best)",scaleNote:"Reverse: 1.0 = excellent, 4.0 = pass, 5.0 = fail" },
  { name:"Ghana",                iso:"GH", flag:"🇬🇭", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA (WASSCE & tertiary)" },
  { name:"India",                iso:"IN", flag:"🇮🇳", min:0,   max:10,  pass:5.0, dir:"asc",  type:"linear",         scale:"10-point CGPA",  scaleNote:"10-point CGPA; 5.0 = pass" },
  { name:"Iran",                 iso:"IR", flag:"🇮🇷", min:0,   max:20,  pass:10,  dir:"asc",  type:"linear",         scale:"0–20",           scaleNote:"20-point scale; 10/20 = pass" },
  { name:"Ireland",              iso:"IE", flag:"🇮🇪", min:0,   max:100, pass:40,  dir:"asc",  type:"classification", scale:"0–100%",         scaleNote:"Percentage → Honours classification" },
  { name:"Italy",                iso:"IT", flag:"🇮🇹", min:18,  max:30,  pass:18,  dir:"asc",  type:"linear",         scale:"18–30 (30L)",    scaleNote:"30-point; 18 = pass; 30 con lode = distinction" },
  { name:"Kenya",                iso:"KE", flag:"🇰🇪", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA system" },
  { name:"Malaysia",             iso:"MY", flag:"🇲🇾", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA (CGPA)" },
  { name:"Netherlands",          iso:"NL", flag:"🇳🇱", min:1,   max:10,  pass:5.5, dir:"asc",  type:"linear",         scale:"1–10",           scaleNote:"10-point scale; 5.5 = pass" },
  { name:"New Zealand",          iso:"NZ", flag:"🇳🇿", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA (NZQA framework)" },
  { name:"Nigeria",              iso:"NG", flag:"🇳🇬", min:0,   max:5.0, pass:1.5, dir:"asc",  type:"linear",         scale:"5.0 GPA (CGPA)", scaleNote:"5.0 CGPA; D (1.5) = pass minimum" },
  { name:"Pakistan",             iso:"PK", flag:"🇵🇰", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA / percentage (50% = pass)" },
  { name:"Philippines",          iso:"PH", flag:"🇵🇭", min:1.0, max:5.0, pass:3.0, dir:"desc", type:"linear",         scale:"1.0 (best)–5.0", scaleNote:"Reverse: 1.0 = excellent, 3.0 = pass, 5.0 = fail" },
  { name:"Poland",               iso:"PL", flag:"🇵🇱", min:2.0, max:5.0, pass:3.0, dir:"asc",  type:"linear",         scale:"2.0–5.0",        scaleNote:"5-point scale; 3.0 = pass, 2.0 = fail" },
  { name:"Portugal",             iso:"PT", flag:"🇵🇹", min:0,   max:20,  pass:10,  dir:"asc",  type:"linear",         scale:"0–20",           scaleNote:"20-point scale; 10/20 = pass" },
  { name:"South Africa",         iso:"ZA", flag:"🇿🇦", min:0,   max:100, pass:50,  dir:"asc",  type:"linear",         scale:"0–100%",         scaleNote:"Percentage system; 50% = pass" },
  { name:"South Korea",          iso:"KR", flag:"🇰🇷", min:0,   max:4.5, pass:2.0, dir:"asc",  type:"linear",         scale:"4.5 GPA",        scaleNote:"4.5 GPA (some universities use 4.3)" },
  { name:"Spain",                iso:"ES", flag:"🇪🇸", min:0,   max:10,  pass:5,   dir:"asc",  type:"linear",         scale:"0–10",           scaleNote:"10-point scale; 5 = pass (Aprobado)" },
  { name:"Sweden",               iso:"SE", flag:"🇸🇪", min:0,   max:5,   pass:3,   dir:"asc",  type:"linear",         scale:"A–F / 5-point",  scaleNote:"Letter grades A–F; numeric equiv 5–0; E/3 = pass" },
  { name:"Taiwan",               iso:"TW", flag:"🇹🇼", min:0,   max:100, pass:60,  dir:"asc",  type:"linear",         scale:"0–100",          scaleNote:"100-point scale; 60 = pass (UG), 70 = pass (PG)" },
  { name:"Turkey",               iso:"TR", flag:"🇹🇷", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA; 2.0 = pass (CC grade)" },
  { name:"United Arab Emirates", iso:"AE", flag:"🇦🇪", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA; also percentage used (60% = pass)" },
  { name:"United Kingdom",       iso:"GB", flag:"🇬🇧", min:0,   max:100, pass:40,  dir:"asc",  type:"classification", scale:"0–100%",         scaleNote:"Percentage → degree classification" },
  { name:"United States",        iso:"US", flag:"🇺🇸", min:0,   max:4.0, pass:2.0, dir:"asc",  type:"linear",         scale:"4.0 GPA",        scaleNote:"4.0 GPA; C/2.0 = pass" },
  { name:"Vietnam",              iso:"VN", flag:"🇻🇳", min:0,   max:10,  pass:5.0, dir:"asc",  type:"linear",         scale:"0–10 / 4.0 GPA", scaleNote:"10-point scale; also mapped to 4.0 GPA" },
];

const UK_CLASSES = [
  { label:"First Class Honours",       min:70,  max:100  },
  { label:"Upper Second Class (2:1)",  min:60,  max:69.9 },
  { label:"Lower Second Class (2:2)",  min:50,  max:59.9 },
  { label:"Third Class Honours",       min:40,  max:49.9 },
  { label:"Pass / Ordinary Degree",    min:35,  max:39.9 },
  { label:"Fail",                      min:0,   max:34.9 },
];

const IE_CLASSES = [
  { label:"First Class Honours (H1)",  min:70,  max:100  },
  { label:"Second Class Honours (H2)", min:60,  max:69.9 },
  { label:"Third Class Honours (H3)",  min:50,  max:59.9 },
  { label:"Pass (H4)",                 min:40,  max:49.9 },
  { label:"Fail",                      min:0,   max:39.9 },
];

// ── INIT ──
function init() {
  const src = document.getElementById('srcCountry');
  const dst = document.getElementById('dstCountry');
  // Only add options if React hasn't already rendered them
  if (src.options.length === 0) {
    COUNTRIES.forEach(c => {
      src.add(new Option(`${c.flag} ${c.name}`, c.name));
      dst.add(new Option(`${c.flag} ${c.name}`, c.name));
    });
  }
  if (!dst.value || dst.value === '') dst.value = 'Germany';
  updateHint();
  // Remove old listeners before adding new ones (safe re-init)
  const newSrc = src.cloneNode(true);
  const newDst = dst.cloneNode(true);
  src.parentNode.replaceChild(newSrc, src);
  dst.parentNode.replaceChild(newDst, dst);
  newSrc.value = src.value;
  newDst.value = dst.value || 'Germany';
  newSrc.addEventListener('change', updateHint);
  newDst.addEventListener('change', updateHint);
  document.getElementById('swapBtn').addEventListener('click', swapCountries);
  buildCountryCards();
}

function updateHint() {
  const c = getCountry(document.getElementById('srcCountry').value);
  if (!c) return;
  document.getElementById('gradeHint').value = `${c.scaleNote} · Pass: ${c.pass}`;
}

function swapCountries() {
  const src = document.getElementById('srcCountry');
  const dst = document.getElementById('dstCountry');
  [src.value, dst.value] = [dst.value, src.value];
  updateHint();
}

function getCountry(name) { return COUNTRIES.find(c => c.name === name); }

// Normalize any grade to 0–100% equivalent
// For desc scales (Germany: 1=best,5=fail; Philippines: 1=best,5=fail):
//   pct = ((bestGrade − grade) / (bestGrade − passGrade)) × 60 + 40
//   This maps: bestGrade→100%, passGrade→40%, worstGrade→0%
function normalizeToPercent(grade, c) {
  if (c.dir === 'desc') {
    // bestGrade = c.min (1.0 for Germany/Philippines), passGrade = c.pass, worstGrade = c.max
    const best  = c.min;   // 1.0
    const worst = c.max;   // 5.0
    const pass  = c.pass;  // 4.0 Germany, 3.0 Philippines
    if (grade <= best)  return 100;
    if (grade >= worst) return 0;
    // Map: best→100, pass→40, worst→0
    if (grade <= pass) {
      return 40 + ((pass - grade) / (pass - best)) * 60;
    } else {
      return ((worst - grade) / (worst - pass)) * 40;
    }
  }
  return Math.min(100, Math.max(0, ((grade - c.min) / (c.max - c.min)) * 100));
}

// Reverse: convert percentage back to a desc-scale grade
function percentToDescScale(pct, c) {
  const best  = c.min;
  const worst = c.max;
  const pass  = c.pass;
  if (pct >= 100) return best;
  if (pct <= 0)   return worst;
  if (pct >= 40) {
    return pass - ((pct - 40) / 60) * (pass - best);
  } else {
    return worst - (pct / 40) * (worst - pass);
  }
}

function convertGrade() {
  const srcName  = document.getElementById('srcCountry').value;
  const dstName  = document.getElementById('dstCountry').value;
  const gradeRaw = parseFloat(document.getElementById('gradeInput').value);

  if (!srcName || !dstName || isNaN(gradeRaw)) {
    alert('Please select both countries and enter a valid grade.');
    return;
  }

  const src = getCountry(srcName);
  const dst = getCountry(dstName);

  // Validate grade range
  const lo = Math.min(src.min, src.max);
  const hi = Math.max(src.min, src.max);
  if (gradeRaw < lo || gradeRaw > hi) {
    alert(`Grade out of range. ${srcName} grades must be between ${lo} and ${hi}.`);
    return;
  }

  let result, formulaEq, formulaVars, steps, converted;

  // Step 1: normalise source to 0–100%
  const pct = normalizeToPercent(gradeRaw, src);

  if (dst.type === 'bavarian') {
    // Modified Bavarian Formula applied directly from source scale to German scale.
    // Formula: Xd = 1 + 3 × ((Nmax − Nd) / (Nmax − Nmin))
    // Nmax = highest achievable grade on SOURCE scale
    // Nmin = minimum passing grade on SOURCE scale
    // For ascending src: Nmax = src.max, Nmin = src.pass
    // For descending src (e.g. Philippines): Nmax = src.min (best), Nmin = src.pass
    let Nmax, Nmin, Nd;
    Nd = gradeRaw;
    if (src.dir === 'desc') {
      Nmax = src.min;   // best grade (lowest number in desc scale)
      Nmin = src.pass;  // passing grade
      // For desc src, formula uses: ((Nd - Nmax) / (Nmin - Nmax))
      const ratio = (Nd - Nmax) / (Nmin - Nmax);
      const Xd = 1 + 3 * ratio;
      converted = Math.min(5.0, Math.max(1.0, Math.round(Xd * 10) / 10));
      result = converted.toFixed(1);
      const ratioVal = ratio.toFixed(4);
      formulaEq = `Xd = 1 + 3 × ((Nd − Nmax) / (Nmin − Nmax))   [adjusted for reverse source scale]`;
      formulaVars = [
        ['Xd',   'German grade (result; 1.0=best, 4.0=pass, 5.0=fail)'],
        ['Nd',   `Your input grade on ${srcName} scale (${Nd})`],
        ['Nmax', `Best grade on ${srcName} scale (${Nmax})`],
        ['Nmin', `Passing grade on ${srcName} scale (${Nmin})`],
      ];
      steps = [
        `Source country (${srcName}) uses a <strong>descending</strong> scale: ${src.min} is best, ${src.max} is fail.`,
        `Bavarian formula parameters: <code>Nmax (best) = ${Nmax}</code>, <code>Nmin (pass) = ${Nmin}</code>`,
        `Substitute: <code>Xd = 1 + 3 × ((${Nd} − ${Nmax}) / (${Nmin} − ${Nmax}))</code>`,
        `Numerator: <code>${Nd} − ${Nmax} = ${(Nd - Nmax).toFixed(4)}</code>`,
        `Denominator: <code>${Nmin} − ${Nmax} = ${(Nmin - Nmax).toFixed(4)}</code>`,
        `Ratio: <code>${ratioVal}</code>`,
        `<code>Xd = 1 + 3 × ${ratioVal} = ${(1 + 3*ratio).toFixed(4)}</code>`,
        `Round to 1 decimal, clamp to 1.0–5.0: <code>Xd = ${converted.toFixed(1)}</code>`,
      ];
    } else {
      Nmax = src.max;
      Nmin = src.pass;
      const Xd = 1 + 3 * ((Nmax - Nd) / (Nmax - Nmin));
      converted = Math.min(5.0, Math.max(1.0, Math.round(Xd * 10) / 10));
      result = converted.toFixed(1);
      formulaEq = `Xd = 1 + 3 × ((Nmax − Nd) / (Nmax − Nmin))`;
      formulaVars = [
        ['Xd',   'German grade result (1.0=Sehr gut, 4.0=Ausreichend/pass, 5.0=fail)'],
        ['Nd',   `Your input grade on ${srcName} scale (${Nd})`],
        ['Nmax', `Highest achievable grade on ${srcName} scale (${Nmax})`],
        ['Nmin', `Minimum passing grade on ${srcName} scale (${Nmin})`],
      ];
      steps = [
        `Identify source scale parameters: <code>Nmax = ${Nmax}</code>, <code>Nmin = ${Nmin}</code>`,
        `Substitute into formula: <code>Xd = 1 + 3 × ((${Nmax} − ${Nd}) / (${Nmax} − ${Nmin}))</code>`,
        `Numerator: <code>${Nmax} − ${Nd} = ${(Nmax - Nd).toFixed(4)}</code>`,
        `Denominator: <code>${Nmax} − ${Nmin} = ${(Nmax - Nmin).toFixed(4)}</code>`,
        `Ratio: <code>${((Nmax - Nd)/(Nmax - Nmin)).toFixed(4)}</code>`,
        `Multiply: <code>3 × ${((Nmax - Nd)/(Nmax - Nmin)).toFixed(4)} = ${(3*(Nmax-Nd)/(Nmax-Nmin)).toFixed(4)}</code>`,
        `Add 1: <code>1 + ${(3*(Nmax-Nd)/(Nmax-Nmin)).toFixed(4)} = ${Xd.toFixed(4)}</code>`,
        `Round to 1 decimal, clamp to 1.0–5.0: <code>Xd = ${converted.toFixed(1)}</code>`,
      ];
    }
  } else if (dst.type === 'classification') {
    const classes = dstName === 'Ireland' ? IE_CLASSES : UK_CLASSES;
    const match = classes.find(c => pct >= c.min && pct <= c.max) || classes[classes.length - 1];
    result = match.label;
    formulaEq = `Classification = Lookup(percentile(grade) → classification table)`;
    formulaVars = [
      ['src_grade', `Your input (${gradeRaw}) on ${srcName} scale (${src.scale})`],
      ['percentile', `Normalized percentage = ${pct.toFixed(1)}%`],
      ['classification', `${dstName} degree classification band`],
    ];
    steps = [
      `Normalize ${srcName} grade to percentage: <code>${gradeRaw} → ${pct.toFixed(1)}%</code>`,
      `Map percentage to ${dstName} classification table`,
      `${pct.toFixed(1)}% falls in range ${match.min}%–${match.max}%`,
      `Classification: <code>${match.label}</code>`,
    ];
  } else {
    // Linear conversion via percentage
    let dstGrade;
    if (dst.dir === 'desc') {
      dstGrade = percentToDescScale(pct, dst);
    } else {
      dstGrade = dst.min + ((pct / 100) * (dst.max - dst.min));
    }
    dstGrade = Math.round(dstGrade * 100) / 100;
    result = dstGrade.toString();
    const srcPctFormula = src.dir === 'desc'
      ? `[reverse-scale normalization]`
      : `((${gradeRaw} − ${src.min}) / (${src.max} − ${src.min})) × 100`;
    if (dst.dir === 'desc') {
      formulaEq = `Step 1: pct = ${srcPctFormula}  →  Step 2: Dst = reverse_map(pct, DstBest=${dst.min}, DstPass=${dst.pass}, DstFail=${dst.max})`;
    } else {
      formulaEq = `Step 1: pct = ${srcPctFormula}  →  Step 2: Dst = DstMin + (pct/100) × (DstMax − DstMin)`;
    }
    formulaVars = [
      ['pct',    `Normalized percentage = ${pct.toFixed(2)}%`],
      ['DstMin', `Destination scale minimum (${dst.min})`],
      ['DstMax', `Destination scale maximum (${dst.max})`],
      ['DstPass',`Destination passing grade (${dst.pass})`],
    ];
    if (src.dir === 'desc') {
      steps = [
        `Source (${srcName}) uses a <strong>descending</strong> scale: ${src.min}=best, ${src.max}=fail.`,
        `Normalize via reverse mapping: <code>${gradeRaw} → ${pct.toFixed(2)}%</code>`,
      ];
    } else {
      steps = [
        `Normalize source grade: <code>(${gradeRaw} − ${src.min}) / (${src.max} − ${src.min}) × 100 = ${pct.toFixed(2)}%</code>`,
      ];
    }
    if (dst.dir === 'desc') {
      steps.push(`Destination (${dstName}) uses a <strong>descending</strong> scale: ${dst.min}=best, ${dst.pass}=pass, ${dst.max}=fail.`);
      steps.push(`Map ${pct.toFixed(2)}% back to ${dstName} reverse scale: <code>${dstGrade}</code>`);
    } else {
      steps.push(`Apply to destination scale: <code>${dst.min} + (${pct.toFixed(2)} / 100) × (${dst.max} − ${dst.min})</code>`);
      steps.push(`= <code>${dst.min} + ${(pct / 100 * (dst.max - dst.min)).toFixed(4)}</code>`);
      steps.push(`= <code>${dstGrade}</code> on ${dstName} scale (${dst.scale})`);
    }
  }

  // ── Populate result ──
  document.getElementById('resultValue').textContent = result;
  document.getElementById('resultScale').textContent = dst.scaleNote || dst.scale;
  document.getElementById('resultTitle').textContent = `${srcName} → ${dstName}`;
  document.getElementById('resultDesc').textContent = `Input grade: ${gradeRaw} on ${srcName} scale (${src.scaleNote}). Method: ${dst.type === 'bavarian' ? 'Modified Bavarian Formula (DAAD)' : dst.type === 'classification' ? 'Classification Mapping' : 'Linear Scale Conversion via percentage normalization'}.`;

  // ── Verdict Panel: Pass/Fail + Classification ──
  const verdictPanel = document.getElementById('verdictPanel');
  const verdictBadge = document.getElementById('verdictBadge');
  const verdictClass = document.getElementById('verdictClassification');
  const verdictExpl  = document.getElementById('verdictExplanation');

  // Determine pass/fail and classification based on destination rules
  let isPassed = false;
  let classification = '';
  let explanation = '';

  if (dst.type === 'classification') {
    const classes = dstName === 'Ireland' ? IE_CLASSES : UK_CLASSES;
    const match = classes.find(c => pct >= c.min && pct <= c.max) || classes[classes.length-1];
    isPassed = pct >= dst.pass;
    classification = match.label;
    if (isPassed) {
      explanation = `A grade of ${pct.toFixed(1)}% on the ${dstName} system corresponds to "${match.label}". ${pct >= 70 ? 'This is the highest academic classification, demonstrating outstanding performance.' : pct >= 60 ? 'This is a strong result, meeting the standard for most postgraduate admissions.' : pct >= 50 ? 'A solid passing grade, accepted by most graduate programs.' : 'Minimum passing classification.'}`;
    } else {
      explanation = `A percentage equivalent of ${pct.toFixed(1)}% falls below the ${dstName} pass threshold of ${dst.pass}%. This result would not achieve a passing classification under ${dstName} degree regulations.`;
    }
  } else if (dst.type === 'bavarian') {
    const numResult = parseFloat(result);
    isPassed = numResult <= dst.pass; // German scale: lower = better; pass = 4.0
    if (numResult <= 1.5) { classification = 'Sehr gut — Excellent (1.0–1.5)'; explanation = `A German grade of ${result} is the highest distinction range. Equivalent to summa cum laude performance. Demonstrates outstanding academic mastery.`; }
    else if (numResult <= 2.5) { classification = 'Gut — Good (1.6–2.5)'; explanation = `A German grade of ${result} is in the "gut" (good) range. Represents strong performance well above the pass threshold. Competitive for graduate admissions in Germany.`; }
    else if (numResult <= 3.5) { classification = 'Befriedigend — Satisfactory (2.6–3.5)'; explanation = `A German grade of ${result} is satisfactory. Performance is adequate and meets academic requirements. Accepted for most programs.`; }
    else if (numResult <= 4.0) { classification = 'Ausreichend — Sufficient/Pass (3.6–4.0)'; explanation = `A German grade of ${result} represents the minimum passing threshold (Ausreichend). The student has met the basic requirements to pass.`; }
    else { classification = 'Nicht Ausreichend — Fail (4.1–5.0)'; explanation = `A German grade of ${result} falls below the pass mark of 4.0. This would result in failure under German academic regulations.`; }
  } else {
    // Linear scale — determine pass from numeric result vs destination pass threshold
    const numResult = dst.dir === 'desc' ? parseFloat(result) : parseFloat(result);
    if (dst.dir === 'desc') {
      isPassed = numResult <= dst.pass; // lower = better, pass = e.g. 3.0 for Philippines
    } else {
      isPassed = numResult >= dst.pass;
    }
    // Performance classification based on pct
    if (pct >= 90)      { classification = 'Distinction / Excellent'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% places this grade in the top performance band on the ${dstName} scale. This represents outstanding academic achievement, typically qualifying for distinction or highest honours.`; }
    else if (pct >= 75) { classification = 'Very Good / Merit'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% is a strong result on the ${dstName} scale. This typically corresponds to a merit classification and is competitive for postgraduate study.`; }
    else if (pct >= 60) { classification = 'Good / Above Average'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% is a good, solid passing result on the ${dstName} scale. Above average performance that meets admission requirements for most programs.`; }
    else if (pct >= 50) { classification = 'Pass / Satisfactory'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% is a clear pass on the ${dstName} system. Performance meets the minimum requirements, though further study may be needed for competitive opportunities.`; }
    else if (pct >= 40) { classification = 'Marginal Pass / Near Threshold'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% is near the passing boundary on the ${dstName} scale. Whether this passes depends on the specific program — the destination pass threshold is ${dst.pass}.`; }
    else { classification = 'Fail / Below Pass Threshold'; explanation = `A percentage equivalent of ${pct.toFixed(1)}% falls below the passing threshold. This grade would not be considered passing under ${dstName} academic standards.`; }
  }

  verdictPanel.className = `verdict-panel ${isPassed ? 'pass-verdict' : 'fail-verdict'}`;
  verdictBadge.textContent = isPassed ? (currentLang === 'en' ? 'PASS' : T('verdict.pass')) : (currentLang === 'en' ? 'FAIL' : T('verdict.fail'));
  verdictClass.textContent = classification;
  verdictExpl.textContent  = explanation;

  document.getElementById('formulaEq').textContent = formulaEq;
  const varsList = document.getElementById('formulaVars');
  varsList.innerHTML = formulaVars.map(([v, desc]) =>
    `<li><code>${v}</code> — ${desc}</li>`).join('');

  const stepsEl = document.getElementById('stepsContent');
  stepsEl.innerHTML = steps.map((s, i) =>
    `<div class="step-item"><div class="step-num">${i+1}</div><p>${s}</p></div>`).join('');

  // Scale comparison table — show representative grade levels at benchmark percentiles
  const benchmarks = [
    ['Distinction / Excellent', 92],
    ['Very Good',               80],
    ['Good',                    67],
    ['Pass',                    50],
    ['Near Pass / Marginal',    42],
    ['Fail',                    25],
  ];
  const tbody = document.getElementById('scaleBody');
  tbody.innerHTML = benchmarks.map(([label, bPct]) => {
    let srcVal, dstVal;
    if (src.dir === 'desc') {
      srcVal = percentToDescScale(bPct, src).toFixed(2);
    } else {
      srcVal = (src.min + (bPct/100) * (src.max - src.min)).toFixed(2);
    }
    if (dst.type === 'bavarian') {
      // Bavarian from normalized pct: approximate reverse Xd (for table display only)
      const ratio = (100 - bPct) / 60; // rough inverse
      dstVal = (1 + 3 * ratio).toFixed(1);
    } else if (dst.type === 'classification') {
      const cls = (dstName === 'Ireland' ? IE_CLASSES : UK_CLASSES);
      const m = cls.find(c => bPct >= c.min && bPct <= c.max) || cls[cls.length-1];
      dstVal = m.label;
    } else if (dst.dir === 'desc') {
      dstVal = percentToDescScale(bPct, dst).toFixed(2);
    } else {
      dstVal = (dst.min + (bPct/100) * (dst.max - dst.min)).toFixed(2);
    }
    const isActive = Math.abs(pct - bPct) < 14;
    return `<tr class="${isActive ? 'highlight' : ''}">
      <td>${label}</td>
      <td>${srcVal} <span style="opacity:.5;font-size:.8em">(≈${bPct}%)</span></td>
      <td>${dstVal}</td>
      <td>${label}</td>
    </tr>`;
  }).join('');

  document.getElementById('resultArea').classList.add('visible');
  document.getElementById('resultArea').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── BLOG: COUNTRY DETAILS (all 29 countries) ──
const COUNTRY_DETAILS = {
  "Argentina": {
    overview:"Argentina's higher education is largely public and free, overseen by the Ministry of Education. The system is highly decentralized across national and provincial universities. Argentina has one of the highest tertiary enrollment rates in Latin America.",
    structure:"Primary education (primaria) runs 6–7 years, secondary (secundaria) 5–6 years, and tertiary begins at age 18. Tertiary institutions include national universities (universidades nacionales), private universities, and non-university institutes (institutos superiores).",
    degrees:[["Licenciatura/Bachelor","4–6 years","Undergraduate degree"],["Especialización/Maestría","1–2 years","Postgraduate specialization or Master's"],["Doctorado","3–5 years","Research doctorate"]],
    creditSystem:"Argentina uses annual credit hours or subject completion units rather than a standardized ECTS-style credit system, though Bologna-aligned universities are beginning to adopt ECTS.",
    scale:[["9–10","Sobresaliente (Outstanding)","Distinction"],["7–8","Muy Bueno (Very Good)","Merit"],["4–6","Aprobado (Pass)","Pass"],["<4","Reprobado (Fail)","Fail"]],
    passing:"4 out of 10",
    distinction:"9–10 (Sobresaliente)",
    gpa:"Argentina does not formally use GPA. Final average (promedio) on the 0–10 scale is used for academic records.",
    special:"The 0–10 scale is standard, with 4 as the minimum pass mark at most national universities. Some institutions use 0–7 or 0–5 scales for coursework. A 'libre' (free-student) path allows students to sit exams directly without class attendance.",
    recognition:"Argentine degrees are recognized across Latin America and increasingly in Europe under bilateral agreements. The Licenciatura is typically equated to a Bachelor's degree internationally.",
    admission:"International students generally need secondary school completion, Spanish proficiency, and university-specific entry requirements. Some programs require entrance exams (exámenes de ingreso).",
  },
  "Canada": {
    overview:"Canada's post-secondary education is provincially regulated, meaning there is no single national system. Quality is consistently high across provinces, and Canadian degrees carry strong international recognition from employment and graduate admissions perspectives.",
    structure:"Primary (Grades 1–6/8) and secondary (Grades 7/9–12) education precedes post-secondary. Universities, colleges, and CEGEPs (Quebec) offer degree and diploma programs. Quebec has a unique CEGEP bridge system between secondary school and university.",
    degrees:[["Bachelor's","3–4 years","120+ credits"],["Master's","1–2 years","Research or coursework-based"],["Doctoral (Ph.D.)","4–6 years","Original research required"]],
    creditSystem:"Credit-hour system aligned with US standards. Full-time = 30 credit hours/year. 120 credits = standard Bachelor's degree.",
    scale:[["A / 4.0 (90–100%)","Excellent","Distinction"],["B / 3.0 (75–89%)","Good","Merit"],["C / 2.0 (60–74%)","Satisfactory","Pass"],["D / 1.0 (50–59%)","Marginal Pass","Conditional pass at some institutions"],["F / 0.0 (<50%)","Fail","Fail"]],
    passing:"2.0 GPA (C grade; approximately 60%)",
    distinction:"Dean's List / Honours typically at 3.7–4.0 GPA",
    gpa:"GPA calculated as weighted average: (Grade Points × Credit Hours) / Total Credit Hours. Some provinces use 4.3-point scales (Ontario) or letter-grade variations.",
    special:"Canadian transcripts include cumulative GPA (CGPA) and sessional GPA. Quebec uses a 100-point system alongside a 4-point scale at CEGEPs. Professional programs (medicine, law) have separate admission standards.",
    recognition:"Widely recognized globally. Canadian degrees are typically equated with UK/Australian degrees and US degrees for immigration and employment.",
    admission:"Language proficiency (IELTS/TOEFL), academic transcripts, letters of recommendation, and statement of purpose. Competitive programs have additional requirements.",
  },
  "China": {
    overview:"China's higher education system is one of the largest in the world, administered by the Ministry of Education. Top-tier 'Project 985' and 'Project 211' universities are internationally recognized. The gaokao (高考) national college entrance exam determines university placement.",
    structure:"9 years of compulsory education (6 primary + 3 junior secondary), 3 years senior secondary, then 4-year undergraduate. China produces more STEM graduates annually than any other country.",
    degrees:[["Bachelor (本科)","4 years","240 credits typical"],["Master (硕士)","2–3 years","Coursework + thesis"],["Doctorate (博士)","3–5 years","Original research"]],
    creditSystem:"Chinese universities use a credit-hour system. 1 credit = 16–18 hours of instruction. Standard Bachelor's requires 150–190 credits. Some universities also maintain a 4.0 GPA scale alongside the 100-point system.",
    scale:[["90–100","A / 优 (Excellent)","Distinction"],["80–89","B / 良 (Good)","Merit"],["70–79","C / 中 (Average)","Pass"],["60–69","D / 及格 (Passing)","Minimum pass"],["<60","F / 不及格 (Fail)","Fail"]],
    passing:"60 out of 100",
    distinction:"85–90+ (varies by institution; Grade Point Average ≥ 3.5/4.0)",
    gpa:"Many universities use 4.0 GPA conversion: A=4.0, B=3.0, C=2.0, D=1.0. Some use weighted GPA formulas specific to their institution.",
    special:"China uses the 百分制 (100-point system) predominantly. The gaokao score determines university tier. Professional exams are required for fields like medicine and law. English-medium programs are growing rapidly.",
    recognition:"Degrees from Project 985 universities (Tsinghua, Peking, Fudan, etc.) are highly regarded. Recognition varies by institution tier internationally.",
    admission:"HSK Chinese language certificate for Chinese-medium programs, or IELTS/TOEFL for English programs. Academic transcripts and recommendation letters required.",
  },
  "Ethiopia": {
    overview:"Ethiopia's higher education has expanded dramatically since the 1990s, now comprising over 50 public universities. The system is overseen by the Ministry of Education and uses the American-style semester system.",
    structure:"8 years primary (Grades 1–8), 4 years secondary (Grades 9–12), then higher education. University entrance requires the Ethiopian University Entrance Examination (EUEE).",
    degrees:[["Bachelor's","3–4 years","120–160 credit hours"],["Master's","2 years","Coursework + thesis"],["Doctorate","3–5 years","Research-based"]],
    creditSystem:"Semester-based credit-hour system. 1 credit hour = 1 hour lecture/week per semester. Standard Bachelor's = 120–160 credit hours.",
    scale:[["4.0 (90–100%)","A – Excellent","Distinction"],["3.0–3.9 (80–89%)","B – Good","Merit"],["2.0–2.9 (70–79%)","C – Satisfactory","Pass"],["1.0–1.9 (60–69%)","D – Poor","Marginal pass"],["<1.0 (<60%)","F – Fail","Fail"]],
    passing:"2.0 CGPA",
    distinction:"3.75 CGPA and above (First Class Honours equivalent)",
    gpa:"CGPA = Sum(Grade Points × Credit Hours) / Total Credit Hours. Ethiopian universities apply a 4.0 GPA scale with letter-grade mapping.",
    special:"Ethiopian universities typically use American-style academic structures. Students on academic probation if CGPA falls below 2.0. Exit exams are increasingly being introduced for professional programs.",
    recognition:"Ethiopian degrees are recognized in African regional bodies and increasingly in the US and Europe, though individual verification is often required.",
    admission:"EUEE score required. International students need equivalent secondary credentials and English proficiency.",
  },
  "Finland": {
    overview:"Finland's education system is globally celebrated for its equity, quality, and student-centred approach. Higher education is divided between universities (research-focused) and universities of applied sciences (UAS / ammattikorkeakoulu), both free for EU/EEA students.",
    structure:"9 years of compulsory comprehensive school (peruskoulu), 3 years upper secondary or vocational, then higher education. The system emphasizes no standardized testing until university entrance.",
    degrees:[["Bachelor (kandidaatti/bachelor)","3 years","180 ECTS"],["Master (maisteri/Master's)","2 years","120 ECTS"],["Doctorate (tohtori)","4 years","240 ECTS"]],
    creditSystem:"ECTS (European Credit Transfer and Accumulation System). 1 ECTS = 27 hours student workload. Full-time = 60 ECTS/year.",
    scale:[["5 – Erinomainen (Excellent)","Outstanding performance","Distinction"],["4 – Kiitettävä (Very Good)","Strong performance","Merit"],["3 – Hyvä (Good)","Good performance","Pass"],["2 – Tyydyttävä (Satisfactory)","Adequate","Pass"],["1 – Välttävä (Passable)","Minimum pass","Pass"],["0 – Hylätty (Fail)","Fail","Fail"]],
    passing:"1 out of 5 (minimum passing grade)",
    distinction:"5 (Erinomainen) — Excellent",
    gpa:"Finland does not use GPA. Academic transcripts show individual course grades on the 0–5 scale.",
    special:"Finnish universities also use a Pass/Fail (hyväksytty/hylätty) system for some courses. The Matriculation Examination (ylioppilastutkinto) is crucial for university entry. Doctoral programs emphasize independent research with minimal coursework.",
    recognition:"Finnish degrees are fully recognized across the EU/EEA under Bologna Process standards. Highly regarded internationally.",
    admission:"Entrance exams specific to faculties, matriculation examination results, and portfolio/interview where applicable. English-medium programs require IELTS/TOEFL.",
  },
  "France": {
    overview:"France has one of the oldest and most structured higher education systems in the world, with a distinctive dual track of grandes écoles (elite professional schools) and public universities. The system is largely state-funded and regulated by the Ministry of Higher Education.",
    structure:"5 years primary (CP–CM2), 4 years collège, 3 years lycée leading to the Baccalauréat, then higher education. The grandes écoles track involves competitive preparatory classes (classes préparatoires).",
    degrees:[["Licence (Bachelor)","3 years","180 ECTS"],["Master","2 years","120 ECTS"],["Doctorat","3 years minimum","Research-based"]],
    creditSystem:"ECTS system. The LMD (Licence-Master-Doctorat) reform aligned French degrees with the Bologna Process in 2002.",
    scale:[["16–20","Très Bien (Very Good)","Distinction / Mention Très Bien"],["14–15.9","Bien (Good)","Merit / Mention Bien"],["12–13.9","Assez Bien (Fairly Good)","Satisfactory / Mention Assez Bien"],["10–11.9","Passable (Satisfactory)","Pass"],["<10","Insuffisant (Fail)","Fail"]],
    passing:"10 out of 20",
    distinction:"16/20 and above (Mention Très Bien); 14/20 = Mention Bien",
    gpa:"France does not use GPA. The 20-point scale (note sur vingt) is standard. A score of 20/20 is extremely rare and considered perfect.",
    special:"The grade of 10/20 is the pass threshold in most institutions. Juries can award collective compensation (compensation) to students who fail individual modules but pass overall. Grandes écoles maintain internal ranking systems.",
    recognition:"French Licence = Bachelor's, Master = Master's under Bologna. Degrees from elite Grandes Écoles (HEC, Sciences Po, Polytechnique) are globally prestigious.",
    admission:"Baccalauréat or equivalent required. Parcoursup national platform for university admissions. Grandes écoles require entrance examination (concours). French proficiency typically required; English-medium programs growing.",
  },
  "Germany": {
    overview:"Germany's higher education combines rigorous academic universities (Universitäten), universities of applied sciences (Fachhochschulen), and arts/music colleges. Most public universities charge no tuition fees for all students. Germany is the leading destination for international students in continental Europe.",
    structure:"4 years primary (Grundschule), then differentiated secondary (Hauptschule, Realschule, or Gymnasium), with the Abitur qualification from Gymnasium granting university entry. The dual apprenticeship system provides strong vocational pathways.",
    degrees:[["Bachelor","3–4 years","180–240 ECTS"],["Master","1–2 years","60–120 ECTS"],["Promotion (Doctorate)","3–5 years","Independent research"]],
    creditSystem:"ECTS system. Full-time study = 60 ECTS/year. Bologna Process adopted fully since 2010.",
    scale:[["1.0 – Sehr gut (Very Good)","Best possible grade","Summa Cum Laude / Distinction"],["1.1–2.0 – Gut (Good)","Above average","Good"],["2.1–3.0 – Befriedigend (Satisfactory)","Average","Satisfactory"],["3.1–4.0 – Ausreichend (Sufficient)","Minimum pass","Pass"],["4.1–5.0 – Nicht Ausreichend (Fail)","Fail","Fail"]],
    passing:"4.0 (Ausreichend — 'Sufficient')",
    distinction:"1.0 (Sehr gut). Doctoral distinction: summa cum laude (1.0), magna cum laude, cum laude",
    gpa:"Germany uses a 1.0–5.0 scale where LOWER numbers are BETTER. 1.0 is the highest achievable grade. International conversions use the Modified Bavarian Formula: Xd = 1 + 3 × ((Nmax − Nd) / (Nmax − Nmin))",
    special:"Critical distinction: the German scale is REVERSE to most world systems. 1.0 = excellent, 5.0 = fail. The Modified Bavarian Formula (used by DAAD) converts foreign grades to the German scale. Intermediate grades (1.3, 1.7, 2.3, etc.) reflect plus/minus variations. The Numerus Clausus (NC) restricts admission to competitive programs based on Abitur grade.",
    recognition:"German degrees are fully recognized across the EU and globally. The Diplom-Ingenieur (engineering) and Staatsexamen (law/medicine) are long-established professional qualifications. DAAD is the primary authority for international grade conversion.",
    admission:"Abitur or equivalent Hochschulzugangsberechtigung (HZB). Non-EU students may require a foundation year (Studienkolleg). TestDaF or DSH German language exam required. Some programs require GRE/GMAT.",
  },
  "Ghana": {
    overview:"Ghana's higher education is regulated by the Ghana Tertiary Education Commission (GTEC). The system has British colonial roots but has evolved a distinct structure. Ghana is a leading education hub in West Africa.",
    structure:"6 years primary (P1–P6), 3 years Junior High School (JHS), 3 years Senior High School (SHS), then tertiary. The West African Senior School Certificate Examination (WASSCE) is the gateway to university.",
    degrees:[["Bachelor's (Hons)","4 years","Credit-hour system"],["Master's","1–2 years","Coursework + dissertation"],["Doctorate","3–5 years","Research-based"]],
    creditSystem:"Credit-hour system modeled on US/UK hybrid. 3 credit hours = 1 course. Typical Bachelor's = 120–132 credit hours.",
    scale:[["4.0 (80–100%)","A – First Class","Distinction"],["3.0–3.9 (70–79%)","B – Second Class Upper","Merit"],["2.0–2.9 (60–69%)","C – Second Class Lower","Pass"],["1.0–1.9 (50–59%)","D – Third Class / Pass","Low pass"],["<1.0 (<50%)","F – Fail","Fail"]],
    passing:"2.0 CGPA (approximately 60%)",
    distinction:"3.6–4.0 CGPA (First Class Honours)",
    gpa:"CGPA on 4.0 scale. Classification: First Class (3.6+), Second Upper (3.0–3.59), Second Lower (2.0–2.99), Third Class (1.5–1.99), Pass (1.0–1.49).",
    special:"Ghanaian universities award classified honours degrees similar to the UK system but mapped to GPA. WASSCE grades (A1–F9) determine university eligibility. Direct entry to Year 2 possible for students with HND qualifications.",
    recognition:"Recognised within West Africa (ECOWAS), UK, and increasingly globally. Association of African Universities promotes mutual recognition.",
    admission:"WASSCE with strong grades, English proficiency (native-language country, so usually waived), and program-specific requirements.",
  },
  "India": {
    overview:"India's higher education is one of the largest systems globally, governed by the University Grants Commission (UGC) and various regulatory bodies (AICTE, MCI, BCI). The National Education Policy 2020 (NEP 2020) is transforming the system toward a 10-point CGPA, multidisciplinary learning, and flexible degree structures.",
    structure:"5 years primary (Classes 1–5), 3 years upper primary (6–8), 2 years secondary (9–10), 2 years senior secondary (11–12), then higher education. The All India Senior School Certificate or State Board determines university entry.",
    degrees:[["Bachelor's (3-year/4-year under NEP)","3–4 years","Credit-based (NEP: 120–160 credits)"],["Master's (MA/MSc/MCom/MTech)","1–2 years","Coursework + dissertation"],["Doctorate (Ph.D.)","3–6 years","Research + thesis defense"]],
    creditSystem:"Transitioning to 10-point CGPA under NEP 2020. Pre-NEP: percentage-based. 1 credit = 1 hour/week instruction per semester. Choice-Based Credit System (CBCS) being phased out in favour of NEP framework.",
    scale:[["9.0–10.0 (90–100%)","O – Outstanding","Distinction / Summa Cum Laude"],["8.0–8.9 (80–89%)","A+ – Excellent","Distinction"],["7.0–7.9 (70–79%)","A – Very Good","First Class"],["6.0–6.9 (60–69%)","B+ – Good","Second Class Upper"],["5.0–5.9 (50–59%)","B – Average","Second Class Lower"],["4.0–4.9 (40–49%)","C – Pass","Pass"],["<4.0 (<40%)","F – Fail","Fail"]],
    passing:"5.0 CGPA (equivalent to approximately 50%; some programs require 40%)",
    distinction:"8.0+ CGPA / 75%+ marks",
    gpa:"CGPA = Sum of (Credit Points × Grade Obtained) / Total Credits. Conversion to percentage: Multiply CGPA by 9.5 (UGC formula) or use institution-specific multiplier.",
    special:"India has historically used percentage marks but is transitioning to CGPA. Engineering (AICTE-regulated), Medical (NMC-regulated), and Law (BCI-regulated) programs have stricter passing criteria (50–60%). IITs and IIMs use their own grading standards. JEE (engineering) and NEET (medical) are high-stakes national entrance exams.",
    recognition:"Indian degrees are recognized in Commonwealth countries, the US, and EU under bilateral agreements. IIT/IIM degrees have strong global brand recognition.",
    admission:"10+2 secondary completion, JEE Main/Advanced or NEET for professional programs, CUET for central universities. IELTS/TOEFL for international students in English-medium programs.",
  },
  "Iran": {
    overview:"Iran's higher education is overseen by the Ministry of Science, Research and Technology, and separately by the Ministry of Health for medical programs. The Konkur national university entrance examination determines admission to public universities.",
    structure:"6 years primary (Dabestan), 3 years middle school (Rahnama'ee), 3 years high school (Dabirestan), then higher education. The pre-university year (pish-daneshgahi) was replaced by the fourth year of high school under recent reforms.",
    degrees:[["Karshenasi (Bachelor's)","4 years","~130 credit hours"],["Karshenasi Arshad (Master's)","2 years","~32 credit hours"],["Doktora (Doctorate)","4 years","Research-based"]],
    creditSystem:"Semester credit-hour system. 1 credit = 16 hours of instruction. Bachelor's typically requires 130–140 credit hours.",
    scale:[["17–20","Excellent (Akali)","Distinction"],["14–16.9","Good (Khub)","Merit"],["12–13.9","Average (متوسط)","Pass"],["10–11.9","Pass (Qabul)","Minimum pass"],["<10","Fail (Rad)","Fail"]],
    passing:"10 out of 20",
    distinction:"17/20 and above",
    gpa:"Iran uses a 4-point GPA scale alongside the 20-point numeric scale. Typical mapping: 18–20=A(4.0), 15–17.9=B(3.0), 12–14.9=C(2.0), 10–11.9=D(1.0), <10=F(0).",
    special:"The 20-point scale (نمره از بیست) mirrors the French system due to historical influence. A score of 20/20 is exceptional. The Konkur exam score is the primary determinant of university and program placement. Iranian academic credentials may require official evaluation for international recognition.",
    recognition:"Iranian degrees are recognized in Middle Eastern countries and have bilateral agreements with some European and Asian nations. NARIC evaluations are commonly requested.",
    admission:"Konkur score, secondary school diploma (Diplom Motevassete), and program-specific prerequisites. International students need Iranian language proficiency for Persian-medium programs.",
  },
  "Ireland": {
    overview:"Ireland's higher education is recognized for quality and strong ties to the EU and global academic community. The Higher Education Authority (HEA) oversees universities, institutes of technology, and other bodies. Ireland uses the European Qualifications Framework (EQF) and National Framework of Qualifications (NFQ).",
    structure:"8 years primary (Junior Infants to 6th Class), 5–6 years secondary (Junior Cert + Leaving Certificate), then higher education. The Leaving Certificate results determine Central Applications Office (CAO) points for university entry.",
    degrees:[["Bachelor's (Honours)","3–4 years","180–240 ECTS / NFQ Level 8"],["Master's","1–2 years","60–120 ECTS / NFQ Level 9"],["Doctorate","3–4 years","NFQ Level 10"]],
    creditSystem:"ECTS system. Full-time = 60 ECTS/year. Ireland fully participates in the Bologna Process.",
    scale:[["70–100%","First Class Honours (H1)","Highest classification"],["60–69%","Second Class Honours Grade 1 (H2:1)","Upper Second"],["50–59%","Second Class Honours Grade 2 (H2:2)","Lower Second"],["40–49%","Third Class Honours (H3) / Pass","Pass"],["<40%","Fail","Fail"]],
    passing:"40% (H3/Pass grade)",
    distinction:"First Class Honours: 70%+",
    gpa:"Ireland does not use GPA. Percentage and Honours classification are used on official transcripts.",
    special:"Ireland's NFQ provides a national qualifications framework from Level 1 (basic) to Level 10 (Doctorate). Honours Bachelor's degrees are at Level 8. The distinction between 'Ordinary Bachelor's' (Level 7) and 'Honours Bachelor's' (Level 8) is important for international recognition.",
    recognition:"Irish degrees are recognized across the EU, UK, US, Canada, and Australia. QQI (Quality and Qualifications Ireland) oversees national standards.",
    admission:"Leaving Certificate points, IELTS/TOEFL for international students, portfolio for arts programs. Graduate entry: Bachelor's degree plus program-specific requirements.",
  },
  "Italy": {
    overview:"Italy has one of the oldest university traditions in the world — the University of Bologna (1088) is the world's oldest university. Italian higher education is overseen by the Ministry of University and Research (MUR) and is free for EU students with income-based fees.",
    structure:"5 years primary (Scuola Primaria), 3 years lower secondary (Scuola Media), 5 years upper secondary (Liceo/Istituto Tecnico), then university. The Maturità exam concludes secondary school.",
    degrees:[["Laurea Triennale (Bachelor's)","3 years","180 ECTS"],["Laurea Magistrale (Master's)","2 years","120 ECTS"],["Dottorato di Ricerca (PhD)","3 years","Research-based"]],
    creditSystem:"CFU (Crediti Formativi Universitari) — equivalent to ECTS. 1 CFU = 25 hours student workload. Bachelor's = 180 CFU, Master's = 120 CFU.",
    scale:[["30 con lode (30L)","Outstanding (Summa Cum Laude)","Highest distinction"],["27–30","Ottimo (Excellent)","Distinction"],["24–26","Buono (Good)","Merit"],["21–23","Discreto (Satisfactory)","Pass"],["18–20","Sufficiente (Sufficient)","Minimum pass"],["<18","Insufficiente (Fail)","Fail"]],
    passing:"18 out of 30",
    distinction:"30 cum lode (30L) — awarded for exceptional performance, above the normal maximum",
    gpa:"Italy does not use GPA. Final degree grade (voto di laurea) is calculated from individual exam averages, weighted by CFU, plus dissertation score. Final grade is out of 110 (voto finale).",
    special:"Italian exams are often oral (esame orale). The final degree grade (110/110 or 110L for cum laude) is the primary credential. The 30-point scale applies to individual courses, while the final diploma uses 110. Only passing grades (18+) appear on transcripts.",
    recognition:"Italian degrees are recognized across the EU and under bilateral agreements globally. Bologna compliance ensures European portability.",
    admission:"Maturità or equivalent, Italian language proficiency (B2 minimum for Italian-medium programs), and program-specific entrance tests (Test di ammissione for medicine, engineering, architecture).",
  },
  "Kenya": {
    overview:"Kenya's higher education is overseen by the Kenya National Qualifications Authority (KNQA) and the Commission for University Education (CUE). Kenya is a regional academic hub in East Africa, with top universities including the University of Nairobi.",
    structure:"8 years primary (Standard 1–8), 4 years secondary (Form 1–4), then university. Kenya Certificate of Secondary Education (KCSE) determines university placement. The new CBC (Competency-Based Curriculum) is replacing the 8-4-4 system.",
    degrees:[["Bachelor's","4 years","Credit-based"],["Master's","2 years","Coursework + thesis"],["Doctorate","3–5 years","Research-based"]],
    creditSystem:"Credit-unit system. 1 credit unit ≈ 15 contact hours. Bachelor's typically = 120–160 credit units.",
    scale:[["4.0 (70–100%)","A – First Class Honours","Distinction"],["3.0–3.9 (60–69%)","B – Second Class Upper","Merit"],["2.0–2.9 (50–59%)","C – Second Class Lower","Pass"],["1.0–1.9 (40–49%)","D – Pass","Marginal pass"],["<1.0 (<40%)","E – Fail","Fail"]],
    passing:"2.0 CGPA (approximately 50%)",
    distinction:"3.6–4.0 CGPA (First Class Honours)",
    gpa:"Kenyan universities use a 4.0 CGPA scale. Classification: First Class (3.6–4.0), Second Upper (3.0–3.59), Second Lower (2.0–2.99), Pass (1.5–1.99).",
    special:"Kenya's universities use both percentage marks and GPA. The KCSE grade (A–E) determines university entry. Medical programs require stricter pass marks. Diploma holders can access degree programs via bridging courses.",
    recognition:"Kenyan degrees are recognized across East Africa, UK, and Commonwealth nations. Inter-University Council for East Africa (IUCEA) promotes regional recognition.",
    admission:"KCSE mean grade C+ (plus), university-specific cutoff points, and English proficiency (usually waived as English is the medium of instruction).",
  },
  "Malaysia": {
    overview:"Malaysia's higher education is regulated by the Ministry of Higher Education (MOHE). The system offers a mix of public universities (IPTA), private universities (IPTS), and branch campuses of foreign universities. Malaysia is positioning itself as a regional education hub in Southeast Asia.",
    structure:"6 years primary (KSSR), 5 years secondary (SPM examination), then pre-university (STPM/Matriculation/Foundation) followed by degree programs.",
    degrees:[["Bachelor's","3–4 years","Credit-hour system"],["Master's","1–2 years","Coursework or research"],["Doctorate","3–5 years","Research-based"]],
    creditSystem:"Credit-hour system. 1 credit = 1 hour/week per semester. Standard Bachelor's = 120–130 credit hours.",
    scale:[["4.0 (80–100%)","A / A+ – Excellent","Distinction"],["3.0–3.9 (65–79%)","B – Good","Merit"],["2.0–2.9 (50–64%)","C – Satisfactory","Pass"],["1.0–1.9 (40–49%)","D – Poor","Marginal pass"],["0 (<40%)","F – Fail","Fail"]],
    passing:"2.0 CGPA (approximately 50%)",
    distinction:"3.5–4.0 CGPA (Dean's List / First Class Honours)",
    gpa:"CGPA on 4.0 scale used universally. Malaysian Qualifications Agency (MQA) oversees standards. Dean's List typically requires CGPA ≥ 3.5 per semester.",
    special:"Malaysian universities grant both Honours and non-Honours Bachelor's degrees. Diploma holders can transfer to Year 2 of degree programs. STPM (Form 6 examination) is equivalent to A-levels for university entry.",
    recognition:"MQA-accredited degrees are recognized by professional bodies and foreign universities. Malaysia's top universities (UM, USM, UTM) rank regionally.",
    admission:"SPM results, STPM/Matriculation/Foundation certification, English proficiency (IELTS 5.5–6.5+ for English-medium programs), and program-specific requirements.",
  },
  "Netherlands": {
    overview:"The Netherlands has a strong higher education tradition, with universities including Leiden (1575), one of Europe's oldest. Dutch universities are internationally oriented — over half of Master's programs are in English. The system distinguishes between research universities (WO) and universities of applied sciences (HBO).",
    structure:"8 years primary (Basisschool), differentiated secondary (VMBO, HAVO, or VWO), then higher education. VWO diploma (gymnasium/atheneum) is the standard university entry route.",
    degrees:[["Bachelor (WO/HBO)","3–4 years","180–240 ECTS"],["Master","1–2 years","60–120 ECTS"],["Doctorate (Promotie)","4 years","Research + dissertation"]],
    creditSystem:"ECTS. Full-time = 60 ECTS/year.",
    scale:[["9–10","Uitstekend (Excellent)","Distinction — rarely awarded"],["8–8.9","Zeer goed (Very Good)","Merit"],["7–7.9","Goed (Good)","Good"],["6–6.9","Ruim voldoende (More than sufficient)","Pass"],["5.5–5.9","Voldoende (Sufficient)","Minimum pass"],["<5.5","Onvoldoende (Insufficient)","Fail"]],
    passing:"5.5 out of 10",
    distinction:"8.0 and above; 9–10 is rarely awarded",
    gpa:"Dutch universities do not use GPA. The 10-point scale is standard. A 10/10 is virtually never given — the practical ceiling is around 9.5.",
    special:"Dutch grading culture is known for grade deflation. A 7 is considered good; 8 is excellent by local standards. The number 5 or lower is a fail; 5.5 is the threshold for passing. Cum Laude distinction requires an average above 8.0 with no fails.",
    recognition:"Dutch degrees are fully recognized across the EU and widely internationally. HBO (applied science) degrees are increasingly recognized as equivalent to research university degrees abroad.",
    admission:"VWO/HAVO diploma, Dutch or English language proficiency, numerus fixus lottery for competitive programs (medicine, psychology). APS certificate for international students.",
  },
  "New Zealand": {
    overview:"New Zealand's tertiary education system includes universities, wānanga (Māori institutions), polytechnics, and private training establishments. The New Zealand Qualifications Authority (NZQA) maintains the New Zealand Qualifications Framework (NZQF). New Zealand universities consistently rank in global top 500.",
    structure:"8 years primary (Years 1–8), 5 years secondary (Years 9–13 with NCEA qualifications), then tertiary. NCEA Level 3 is the standard university entry requirement.",
    degrees:[["Bachelor's","3 years","360 credits / 120 points/year"],["Honours / Postgraduate","1 year","120 credits"],["Master's","1–2 years","120–240 credits"],["Doctorate","3–4 years","Research-based"]],
    creditSystem:"NZQA credit system. 120 credits = one full-time year of study. Bachelor's = 360 credits. Each credit = 10 notional hours of learning.",
    scale:[["4.0 (85–100%)","A / A+ – Excellent","Distinction"],["3.0–3.9 (70–84%)","B – Good","Merit"],["2.0–2.9 (55–69%)","C – Average","Pass"],["1.0–1.9 (50–54%)","D – Marginal Pass","Pass"],["0 (<50%)","F – Fail","Fail"]],
    passing:"50% (2.0 GPA equivalent)",
    distinction:"Distinction (85%+), Merit (75–84%), Pass",
    gpa:"NZ universities use 4.0 GPA alongside percentage marks. Distinction = 85%+, Merit = 75–84%, Pass = 50–74%.",
    special:"New Zealand undergraduate programs are 3 years (unlike Australia's 4). An Honours degree is an additional 1-year postgraduate qualification. NCEA (National Certificate of Educational Achievement) uses credits rather than marks.",
    recognition:"New Zealand degrees are fully recognized in Australia, UK, and widely globally through NZQF and AQF mutual recognition.",
    admission:"NCEA Level 3 (University Entrance), English language (IELTS 6.0+ or equivalent), and program-specific prerequisites.",
  },
  "Nigeria": {
    overview:"Nigeria operates the largest higher education system in Africa by enrollment, overseen by the National Universities Commission (NUC). The Unified Tertiary Matriculation Examination (UTME) administered by JAMB is the primary university entry gateway.",
    structure:"6 years primary (P1–P6), 3 years junior secondary (JSS1–3), 3 years senior secondary (SSS1–3 with WAEC/NECO exams), then tertiary. Pre-degree/remedial programs supplement UTME entry.",
    degrees:[["Bachelor's (B.Sc./B.A./B.Eng.)","4–5 years","Credit-unit system"],["Master's (M.Sc./MBA)","1.5–2 years","Coursework + thesis"],["Doctorate (Ph.D.)","3–5 years","Research + defense"]],
    creditSystem:"Credit-unit system. 1 credit unit = 1 hour/week per semester. Minimum credit load: 15 units/semester; maximum: 24 units. Standard Bachelor's = 120–160 credit units.",
    scale:[["5.0 (70–100%)","A – Excellent / First Class","First Class Honours"],["4.0–4.9 (60–69%)","B – Second Class Upper","2nd Class Upper (2:1)"],["3.0–3.9 (50–59%)","C – Second Class Lower","2nd Class Lower (2:2)"],["2.0–2.9 (45–49%)","D – Third Class","Third Class / Pass"],["1.5–1.9 (40–44%)","D – Pass","Pass"],["<1.5 (<40%)","F – Fail","Fail"]],
    passing:"1.5 CGPA (D grade, approximately 40%)",
    distinction:"4.5–5.0 CGPA (First Class Honours)",
    gpa:"CGPA on a 5.0 scale. Classification: First Class (4.50–5.00), Second Class Upper (3.50–4.49), Second Class Lower (2.40–3.49), Third Class (1.50–2.39), Pass (1.00–1.49).",
    special:"Nigeria uses a 5.0 CGPA scale — not the common 4.0 scale. This is critically important for international conversion. The 5-point scale is unique among African nations. WAEC/NECO O-level results are required alongside UTME. 'Direct Entry' allows HND or ND holders to enter at Year 2 or Year 3.",
    recognition:"Nigerian degrees are recognized within ECOWAS, Commonwealth, and increasingly internationally, though some institutions request NUC verification. NUC-accredited programs carry the most international weight.",
    admission:"UTME score (minimum 180–200+ for competitive programs), 5 O-level credits including English and Mathematics, post-UTME screening, and English proficiency.",
  },
  "Pakistan": {
    overview:"Pakistan's higher education is overseen by the Higher Education Commission (HEC), which has driven significant quality reforms since 2002. Pakistan has both public and private universities, with the GPA system increasingly replacing percentage-based evaluation.",
    structure:"5 years primary (Grades 1–5), 3 years middle (6–8), 2 years secondary (Matric/SSC), 2 years higher secondary (HSSC/Intermediate), then degree programs. The SSC and HSSC examinations are national benchmarks.",
    degrees:[["Bachelor's (BS)","4 years","130+ credit hours"],["Master's (MS/M.Phil.)","2 years","30–36 credit hours"],["Doctorate (Ph.D.)","3–5 years","Comprehensive exams + dissertation"]],
    creditSystem:"Semester credit-hour system. 1 credit hour = 1 lecture/week per semester. Bachelor's (BS-4 year) = 124–136 credit hours.",
    scale:[["4.0 (85–100%)","A+ – Excellent","Distinction"],["3.5–3.9 (75–84%)","A – Very Good","Merit"],["3.0–3.4 (65–74%)","B+ – Good","Good"],["2.5–2.9 (55–64%)","B – Above Average","Pass"],["2.0–2.4 (50–54%)","C – Average","Pass"],["<2.0 (<50%)","D/F – Fail","Fail"]],
    passing:"2.0 CGPA (approximately 50%); individual course pass = 40%+",
    distinction:"3.75+ CGPA (Gold Medal / Distinction)",
    gpa:"CGPA on 4.0 scale (HEC-standardized). Gold Medal awarded for highest CGPA in graduating batch (minimum 3.75).",
    special:"Pakistan's 2-year BS and 4-year BS coexist, though HEC now primarily promotes the 4-year BS. Percentage marks still widely used in secondary and on older transcripts. HEC Attestation and equivalency service required for foreign recognition.",
    recognition:"HEC-recognized degrees carry international weight. Pakistan has bilateral agreements with several countries. Some professional bodies (engineers, doctors) require additional recognition.",
    admission:"Matric/HSSC marks, university entrance tests (ECAT for engineering, MDCAT for medicine), and IELTS/TOEFL for English-medium programs.",
  },
  "Philippines": {
    overview:"The Philippines has one of Southeast Asia's largest higher education systems, supervised by the Commission on Higher Education (CHED). The country uses English as its primary medium of instruction, making it accessible to international students.",
    structure:"6 years primary (K–6), 4 years junior high school (Grades 7–10), 2 years senior high school (Grades 11–12 under K–12 reform), then college/university. The K–12 reform was fully implemented in 2018.",
    degrees:[["Bachelor's","4 years","Standard tertiary"],["Master's","2 years","Coursework + thesis"],["Doctorate","3–5 years","Research + defense"]],
    creditSystem:"Credit-unit system. 1 unit = 1 hour/week per semester. Bachelor's typically = 120–150 units.",
    scale:[["1.0 – Excellent","Equivalent to 99–100% / A+","Best possible grade"],["1.25–1.5 – Very Good","Equivalent to 92–98%","Distinction"],["1.75–2.0 – Good","Equivalent to 85–91%","Merit"],["2.25–2.5 – Satisfactory","Equivalent to 80–84%","Pass"],["2.75–3.0 – Passing","Equivalent to 75–79%","Minimum pass"],["4.0 – Conditional Failure","Eligible for re-examination","Near fail"],["5.0 – Failed","Below 75%","Fail"]],
    passing:"3.0 (equivalent to approximately 75%)",
    distinction:"1.0 (Excellent) — equivalent to 99–100%",
    gpa:"The Philippine system uses a unique REVERSE scale where 1.0 is BEST and 5.0 is FAIL. This is the opposite of most world grading systems. Weighted average is used for QPI (Quality Point Index).",
    special:"CRITICAL: The Philippine grading scale is inverted — 1.0 is the highest possible grade and 5.0 is failure. The passing grade of 3.0 corresponds to approximately 75%. This creates major confusion in international conversions and must be handled with explicit reverse-mapping. Some universities use a 4.0 GPA system alongside the traditional numeric scale.",
    recognition:"Philippine degrees are recognized in ASEAN, Middle East, and increasingly globally. CHED Certificate of Recognition is required for international recognition of private institutions.",
    admission:"Senior High School completion (under K–12) or 2-year pre-university, NSAT or university entrance examination, English language (usually waived as English is the medium of instruction).",
  },
  "Portugal": {
    overview:"Portugal's higher education has been significantly reformed under the Bologna Process, aligning it with European standards. Universities (Universidades) and polytechnics (Institutos Politécnicos) are the two main institutional types, both public and private.",
    structure:"9 years compulsory basic education, 3 years secondary (Ensino Secundário leading to Exames Nacionais), then higher education. The Concurso Nacional de Acesso determines public university placement based on national exam scores.",
    degrees:[["Licenciatura (Bachelor's)","3–4 years","180–240 ECTS"],["Mestrado (Master's)","1–2 years","60–120 ECTS"],["Doutoramento (Doctorate)","3 years","Research-based"]],
    creditSystem:"ECTS. Portugal was an early adopter of the Bologna Process. Full-time = 60 ECTS/year.",
    scale:[["18–20","Excelente (Excellent)","Distinction"],["16–17.9","Muito Bom (Very Good)","Merit"],["14–15.9","Bom (Good)","Good"],["10–13.9","Suficiente (Sufficient)","Pass"],["<10","Reprovado (Fail)","Fail"]],
    passing:"10 out of 20",
    distinction:"18–20 (Excelente), often with honor distinction (Louvor) at 19–20",
    gpa:"Portugal does not use GPA. The 20-point scale is universal. Average calculation (média) uses arithmetic mean weighted by ECTS credits.",
    special:"The 20-point scale is shared with France and Iran. Portuguese grade culture tends toward lower averages — a 16 is typically considered excellent in practice. Louvor (honor mention) may be awarded for exceptional dissertations at 19–20.",
    recognition:"Portuguese degrees are fully recognized across the EU and globally under Bologna. Portugal participates in Europass and European credit transfer programs.",
    admission:"National exam results (ECTS), secondary school average, Portuguese proficiency (CAPLE test), or IELTS/TOEFL for English programs.",
  },
  "South Africa": {
    overview:"South Africa has a diverse higher education landscape comprising 26 public universities, categorized as traditional universities, universities of technology, and comprehensive universities. The system is overseen by the Department of Higher Education and Training (DHET).",
    structure:"7 years primary (Grades 1–7), 5 years secondary (Grades 8–12), with the National Senior Certificate (NSC/Matric) exam as the university gateway. The National Benchmark Tests (NBTs) assess readiness for degree study.",
    degrees:[["Bachelor's (3–4 year)","3–4 years","Credit-based"],["Honours","1 year postgraduate","Additional specialization"],["Master's","1–2 years","Coursework + dissertation or research only"],["Doctorate","2–5 years","Research + thesis"]],
    creditSystem:"Credits aligned with HEQSF (Higher Education Qualifications Sub-Framework). 1 credit = 10 notional learning hours. Bachelor's = 360 credits (3-year) or 480 credits (4-year professional).",
    scale:[["75–100%","Distinction","First Class / Pass with Distinction"],["70–74%","Merit","High Pass"],["60–69%","Credit","Second Class Upper"],["50–59%","Pass","Second Class Lower"],["<50%","Fail","Fail"]],
    passing:"50% (varies by module; some require 40–45%)",
    distinction:"75%+ (Distinction / Cum Laude)",
    gpa:"South African universities primarily use percentage marks. Some institutions provide GPA equivalents. Cumulative average calculated from course marks weighted by credits.",
    special:"South Africa's 11 official languages create linguistic diversity in education. Medium of instruction is predominantly English and Afrikaans at universities. The NSC Matric exam includes bachelor's, diploma, and higher certificate pass levels with different implications for tertiary access.",
    recognition:"SAQA (South African Qualifications Authority) oversees national qualifications. Degrees are recognized in Commonwealth nations and increasingly globally.",
    admission:"NSC with Bachelor's pass, Admission Point Score (APS), and program-specific requirements. Language proficiency requirements vary by institution and medium.",
  },
  "South Korea": {
    overview:"South Korea's higher education is globally recognized for high participation rates and rigorous academic culture. The College Scholastic Ability Test (수능, Suneung) determines university placement. Korean universities are increasingly English-friendly, with significant numbers of international student programs.",
    structure:"6 years primary (초등학교), 3 years middle school (중학교), 3 years high school (고등학교), then higher education. The Suneung exam is one of the most high-stakes entrance exams in the world.",
    degrees:[["Bachelor's (학사)","4 years","140 credit hours typical"],["Master's (석사)","2 years","24 credit hours + thesis"],["Doctorate (박사)","3–4 years","Research-based"]],
    creditSystem:"Credit-hour system. 1 credit = 1 hour/week per semester. Standard Bachelor's = 130–140 credits.",
    scale:[["4.0–4.5 (95–100%)","A+","Excellent / Distinction"],["3.5–3.9 (90–94%)","A","Excellent"],["3.0–3.4 (85–89%)","B+","Good"],["2.5–2.9 (80–84%)","B","Good"],["2.0–2.4 (75–79%)","C+","Satisfactory"],["1.5–1.9 (70–74%)","C","Satisfactory"],["1.0–1.4 (65–69%)","D+","Pass"],["0.5–0.9 (60–64%)","D","Marginal Pass"],["0 (<60%)","F","Fail"]],
    passing:"2.0 GPA (approximately 75%)",
    distinction:"4.0+ GPA",
    gpa:"Korean universities use a 4.5-point GPA scale (some use 4.3). GPA = Sum(Grade Points × Credits) / Total Credits. A+ = 4.5, A = 4.0, B+ = 3.5, B = 3.0, C+ = 2.5, C = 2.0, D+ = 1.5, D = 1.0, F = 0.",
    special:"South Korea uses a 4.5-point GPA scale (not the US 4.0). Some universities use 4.3. The Suneung is administered once per year and scores determine access to prestigious SKY universities (Seoul National, Yonsei, Korea). Academic competition is intense; Korea has one of the highest proportions of doctorate holders globally.",
    recognition:"Korean degrees from top institutions are highly regarded globally. Korean universities participate in QS and Times rankings. Degrees are recognized in ASEAN, US, Europe, and Australia.",
    admission:"Suneung score, high school transcript, university-specific essays and interviews. International students: TOPIK Korean language certification or IELTS/TOEFL for English-medium programs.",
  },
  "Spain": {
    overview:"Spain's higher education (Sistema Universitario Español) is overseen by the Ministry of Universities. The Bologna Process restructured Spanish degrees in 2010, replacing the traditional Licenciatura with 4-year Grados. Spain has over 80 universities and is a top Erasmus destination.",
    structure:"6 years primary (Educación Primaria), 4 years ESO (secondary), 2 years Bachillerato, then university. Access requires passing the Prueba de Acceso a la Universidad (PAU/EBAU/Selectividad).",
    degrees:[["Grado (Bachelor's)","4 years","240 ECTS"],["Máster Universitario","1–2 years","60–120 ECTS"],["Doctorado","3 years","Research-based"]],
    creditSystem:"ECTS. Full-time = 60 ECTS/year. Spain was an early participant in the European Higher Education Area.",
    scale:[["9–10","Sobresaliente (Outstanding)","Matrícula de Honor / Distinction"],["7–8.9","Notable (Notable)","Merit"],["5–6.9","Aprobado (Pass)","Pass"],["<5","Suspenso (Fail)","Fail"]],
    passing:"5 out of 10 (Aprobado)",
    distinction:"9–10 (Sobresaliente); top students receive Matrícula de Honor (limited to 5% of class)",
    gpa:"Spain uses the 0–10 numeric scale. Cum Laude in doctoral theses requires unanimous jury approval for highest recognition.",
    special:"Spanish universities limit Matrícula de Honor (equivalent to A+/4.0+) to a maximum of 5% of students per course — making it highly competitive. The Selectividad score determines access to competitive degree programs.",
    recognition:"Spanish degrees are fully recognized across the EU. RUCT (Registro de Universidades, Centros y Títulos) is the official register. EU Blue Card and academic equivalency processes are well-established.",
    admission:"Bachillerato and EBAU/PAU score, specific subject requirements per degree, and Spanish language proficiency for Spanish-medium programs (DELE B2 or higher).",
  },
  "Sweden": {
    overview:"Sweden's higher education is free for EU/EEA students and delivered by universities (Universitet) and university colleges (Högskola). Sweden emphasizes academic freedom, student autonomy, and research excellence. Swedish universities rank consistently in global top 200.",
    structure:"9 years compulsory primary-lower secondary, 3 years upper secondary (Gymnasieskolan with Slutbetyg), then higher education. University admissions use the Högskoleprovet (national entrance test) and/or upper secondary grades.",
    degrees:[["Kandidatexamen (Bachelor's)","3 years","180 ECTS"],["Masterexamen","2 years","120 ECTS"],["Doktorsexamen (Doctorate)","4 years","240 ECTS"]],
    creditSystem:"ECTS. Swedish credits (Högskolepoäng, hp) = ECTS credits. 60 hp = one full-time year.",
    scale:[["A (Excellent)","≥90% equivalent","Distinction — outstanding"],["B (Very Good)","≥80%","Merit — very good"],["C (Good)","≥70%","Good — above average"],["D (Satisfactory)","≥60%","Satisfactory"],["E (Sufficient/Pass)","≥50%","Minimum pass"],["Fx (Fail, resit allowed)","<50%","Near fail — allowed one resit"],["F (Fail)","<40%","Fail — must retake course"]],
    passing:"E (Sufficient) — approximately 50% equivalent",
    distinction:"A (Excellent) — approximately 90%+ equivalent",
    gpa:"Sweden uses A–F letter grades (adopted from 2007; previously VG/G/U). No GPA is calculated. Academic transcripts list letter grades per course with ECTS credits.",
    special:"Sweden replaced its older VG/G/U (Väl Godkänd/Godkänd/Underkänd) system with the A–F scale to align with international standards. The Fx grade allows a near-passing student one supplementary assessment. Swedish academic culture strongly values independent thinking and critical discourse.",
    recognition:"Swedish degrees are fully recognized across the EU and globally. Sweden participates fully in the Bologna Process and ECTS.",
    admission:"Upper secondary completion, Högskoleprovet results, Swedish (SAS) or English proficiency (IELTS 6.5+ for English programs). Some programs require portfolio or audition.",
  },
  "Turkey": {
    overview:"Turkey's higher education is overseen by the Council of Higher Education (YÖK). Turkey has the largest higher education system in the Middle East and one of the largest in Europe. The Student Selection and Placement System (ÖSYM) administers the YKS national university entrance exam.",
    structure:"8 years primary and middle school (İlköğretim), 4 years secondary (Lise leading to Lise Diploması), then university. YKS exam scores determine placement in public universities through ÖSYM.",
    degrees:[["Lisans (Bachelor's)","4 years","240 ECTS"],["Yüksek Lisans (Master's)","2 years","60–120 ECTS"],["Doktora (Doctorate)","4 years","Research-based"]],
    creditSystem:"ECTS-aligned system. Turkish credit (Ulusal Kredi) coexists with ECTS. Full-time = 60 ECTS/year.",
    scale:[["4.0 (90–100%)","AA – Exceptional","Distinction"],["3.5–3.9 (85–89%)","BA – Very Good","Merit"],["3.0–3.4 (75–84%)","BB – Good","Good"],["2.5–2.9 (65–74%)","CB – Satisfactory","Pass"],["2.0–2.4 (55–64%)","CC – Pass","Pass"],["1.5–1.9 (50–54%)","DC – Conditional Pass","Conditional"],["<1.5 (<50%)","DD / FF – Fail","Fail"]],
    passing:"2.0 CGPA (CC grade)",
    distinction:"3.5–4.0 CGPA (High Honours / Şeref Öğrencisi)",
    gpa:"CGPA on 4.0 scale. Turkish higher education increasingly aligns with European standards. Diploma Supplement issued alongside degree.",
    special:"Turkey uses a 4.0 GPA scale. YÖK sets national academic standards. Turkey has recently reformed its higher education to improve quality alignment with the EU. Erasmus participation is extensive — Turkey is one of the largest Erasmus sending/receiving countries.",
    recognition:"YÖK-accredited degrees are internationally recognized. European Diploma Supplement is issued. NARIC/ENIC verification process for international recognition.",
    admission:"YKS-TYT (basic ability) and YKS-AYT (subject-based) scores, high school diploma (Lise Diploması). International students: SAT/ACT or YÖS exam, plus IELTS/TOEFL for English-medium programs.",
  },
  "United Arab Emirates": {
    overview:"The UAE's higher education has grown rapidly since the 1970s, with a mix of public institutions (UAE University, Zayed University, HBMSU) and an extraordinary concentration of international branch campuses (NYU Abu Dhabi, Sorbonne Abu Dhabi, Heriot-Watt Dubai). The Ministry of Education and CAA (Commission for Academic Accreditation) oversee quality.",
    structure:"6 years primary (KG1 to Grade 5), 3 years preparatory (Grades 6–8), 3 years secondary (Grades 9–12 with EmSAT exams), then higher education. EmSAT (Emirates Standardized Test) scores are used for university entry.",
    degrees:[["Bachelor's","4 years","120+ credit hours"],["Master's","1.5–2 years","30–36 credit hours"],["Doctorate","3–4 years","Research-based"]],
    creditSystem:"US-style credit-hour system. Full-time = 30 credit hours/year. Most universities follow American academic structures.",
    scale:[["4.0 (90–100%)","A / A+ – Excellent","Distinction"],["3.0–3.9 (80–89%)","B – Good","Merit"],["2.0–2.9 (70–79%)","C – Satisfactory","Pass"],["1.0–1.9 (60–69%)","D – Poor","Marginal pass"],["0 (<60%)","F – Fail","Fail"]],
    passing:"2.0 CGPA (approximately 70%)",
    distinction:"3.7–4.0 CGPA (President's / Dean's List)",
    gpa:"4.0 GPA scale standard across CAA-accredited institutions. Some institutions also report percentage equivalents. 60% minimum typically required for individual course pass.",
    special:"The UAE's higher education landscape is uniquely international. Many institutions offer both Arabic and English medium programs. Branch campuses maintain their home country standards (e.g., NYU Abu Dhabi follows US standards). The CAA ensures quality equivalency across all institutions.",
    recognition:"CAA-accredited degrees are recognized internationally and by UAE professional bodies. Branch campus degrees carry the prestige of the parent institution.",
    admission:"EmSAT scores (English, Mathematics, Arabic), secondary school certificate (Thanawiyya Amma or equivalent), and English proficiency (IELTS/TOEFL for English-medium programs).",
  },
  "United Kingdom": {
    overview:"The United Kingdom has one of the world's most prestigious higher education systems, home to Oxford, Cambridge, Imperial, UCL, and Edinburgh — institutions consistently ranked in the global top 30. The system is characterized by focused single-honors degrees, intensive 3-year programs (4 in Scotland), and degree classification rather than GPA.",
    structure:"Primary (Key Stages 1–2, ages 5–11), Secondary (Key Stages 3–4 with GCSEs, ages 11–16), Sixth Form/College (A-levels, ages 16–18), then higher education. Scotland has a distinct 4-year Honours degree system.",
    degrees:[["Bachelor's Honours (England/Wales/NI)","3 years","360 CATS / 180 ECTS"],["Bachelor's Honours (Scotland)","4 years","480 CATS / 240 ECTS"],["Integrated Master's (MEng/MSci)","4 years","Undergraduate + graduate"],["Postgraduate Master's","1 year","180 CATS"],["Doctorate (PhD)","3–4 years","Original research"]],
    creditSystem:"CATS (Credit Accumulation and Transfer Scheme). 1 CATS = 0.5 ECTS. Undergraduate level: Level 4 (Year 1), Level 5 (Year 2), Level 6 (Year 3), Level 7 (Masters).",
    scale:[["70–100%","First Class Honours (1st)","Highest classification"],["60–69%","Upper Second Class Honours (2:1)","Most common grade; strong employment indicator"],["50–59%","Lower Second Class Honours (2:2)","Widely accepted for graduate entry"],["40–49%","Third Class Honours (3rd)","Minimum Honours classification"],["35–39%","Pass / Ordinary Degree","No honours classification awarded"],["<35%","Fail","Does not pass"]],
    passing:"40% (Third Class / Pass threshold for Honours degree modules)",
    distinction:"First Class Honours (70%+). Starred First / Distinction with specific grade requirements at postgraduate level.",
    gpa:"The UK does not use GPA. Degree classification (First, 2:1, 2:2, Third) is the standard qualification descriptor. Some institutions report numerical degree average (e.g., 65.4%).",
    special:"The UK 2:1 (Upper Second Class) is the de facto standard for postgraduate admission and competitive graduate employment. Scottish Honours degrees are 4 years with different classification norms (First typically requires 70%+, same threshold). The Research Excellence Framework (REF) drives research quality across universities. Professional accreditation bodies (BPS, BMA, ICE, etc.) have additional requirements.",
    recognition:"UK degrees are among the most internationally recognized in the world. NARIC/UK ENIC provides official equivalency statements. Widely accepted for professional registration and graduate study globally.",
    admission:"A-levels (typically ABB–AAA for Russell Group universities), UCAS application system, English language IELTS 6.0–7.0+ for non-native speakers, personal statement, reference letters. Some programs: admissions tests (BMAT, LNAT, TMUA, Oxford/Cambridge interviews).",
  },
  "United States": {
    overview:"The United States has the world's largest and most diverse higher education system, encompassing over 4,000 degree-granting institutions. The system ranges from Ivy League research universities (Harvard, Yale, Princeton) to state flagship universities, liberal arts colleges, community colleges, and HBCUs (Historically Black Colleges and Universities). Accreditation by regional bodies ensures quality.",
    structure:"K–12 education (Grades K–5 Elementary, 6–8 Middle School, 9–12 High School), then higher education. The SAT/ACT standardized tests, GPA, and extracurricular activities form the holistic admissions package.",
    degrees:[["Associate's","2 years","60 credit hours"],["Bachelor's","4 years","120 credit hours"],["Master's","1–2 years","30–60 credit hours"],["Doctorate (Ph.D./M.D./J.D.)","4–7 years","Research + comprehensive exams"]],
    creditSystem:"Semester credit-hour system. 1 credit hour = 1 lecture hour/week per semester. Full-time = 15 credit hours/semester. Bachelor's = 120 credit hours standard.",
    scale:[["A / 4.0 (90–100%)","Excellent","Summa Cum Laude range"],["B / 3.0 (80–89%)","Good","Magna Cum Laude range"],["C / 2.0 (70–79%)","Average","Cum Laude range"],["D / 1.0 (60–69%)","Below Average","Marginal Pass (varies by institution)"],["F / 0.0 (<60%)","Fail","Fail"]],
    passing:"2.0 GPA (C average) for most institutions",
    distinction:"Summa Cum Laude (3.9–4.0), Magna Cum Laude (3.7–3.89), Cum Laude (3.5–3.69) — thresholds vary by institution",
    gpa:"GPA = Sum(Grade Points × Credit Hours) / Total Credit Hours. Plus/minus grades (A+, A, A–, B+...) affect GPA: A+=4.0 (some schools 4.3), A=4.0, A–=3.7, B+=3.3, B=3.0, B–=2.7, etc.",
    special:"The US is one of the few countries maintaining a primarily holistic undergraduate admissions process (SAT/ACT + GPA + extracurriculars + essays). Many US schools use weighted and unweighted GPA systems at high school level. Liberal arts education requires breadth across disciplines before specialization. Community college transfer pathways are a major feature of the system.",
    recognition:"US degrees are among the most globally recognized. WES (World Education Services) and ECE (Educational Credential Evaluators) provide equivalency reports for international students. Accreditation (regional > national) determines degree quality.",
    admission:"SAT/ACT scores (test-optional growing post-COVID), high school GPA and transcript, personal essays, letters of recommendation. IELTS/TOEFL 80–100+ iBT for international applicants.",
  },
  "Vietnam": {
    overview:"Vietnam's higher education has undergone significant reforms since the Doi Moi economic opening. The Ministry of Education and Training (MOET) oversees the system. Vietnam is a rapidly growing destination for international partnerships, and many programs now have global accreditation.",
    structure:"5 years primary (Lớp 1–5), 4 years lower secondary (Lớp 6–9), 3 years upper secondary (Lớp 10–12 leading to Tot Nghiep THPT national exam), then higher education.",
    degrees:[["Đại học (Bachelor's)","4 years","120–130 credits"],["Thạc sĩ (Master's)","1.5–2 years","60 credits"],["Tiến sĩ (Doctorate)","3–4 years","Research-based"]],
    creditSystem:"Credit-based system (tín chỉ). 1 credit = 15 lecture hours. Bachelor's = 120–130 credits. Vietnam transitioned from an annual (niên chế) to credit-based system (tín chỉ) around 2006.",
    scale:[["8.5–10 (A)","Xuất sắc (Excellent)","Distinction"],["7.0–8.4 (B)","Giỏi (Good)","Merit"],["5.5–6.9 (C)","Khá (Fairly Good)","Pass"],["4.0–5.4 (D)","Trung bình (Average)","Marginal pass"],["<4.0 (F)","Yếu/Kém (Fail)","Fail"]],
    passing:"5.0 out of 10 (some programs use 4.0 as pass threshold)",
    distinction:"8.5–10 (Xuất sắc / Excellent) — awarded on diploma",
    gpa:"Vietnam uses a 10-point scale (thang điểm 10). Also mapped to 4.0 GPA: A (8.5–10)=4.0, B (7.0–8.4)=3.0, C (5.5–6.9)=2.0, D (4.0–5.4)=1.0, F(<4.0)=0. Some universities use ECTS alongside the national system.",
    special:"Vietnamese academic transcripts show cumulative GPA (điểm trung bình tích lũy) on both 10-point and 4.0 scales. Classification on diploma: Xuất sắc (Excellent: 8.5+), Giỏi (Good: 7.0–8.4), Khá (Fair: 6.0–6.9), Trung bình (Average: 5.0–5.9). English-medium programs are growing rapidly, especially in technical fields.",
    recognition:"Vietnamese degrees are gaining recognition as Vietnam joins global ranking systems. Top universities (VNU, HUST) are internationally recognized. Ministry-level equivalency required for some professional fields.",
    admission:"Tot Nghiep THPT exam and university-specific entrance exams, high school transcript, language proficiency for foreign-medium programs.",
  },
  "Taiwan": {
    overview:"Taiwan's higher education system is internationally competitive, overseen by the Ministry of Education (MOE). Taiwan is home to world-class research universities including National Taiwan University (NTU), NTHU, and NCKU, which rank consistently in global top 200–500. The system combines deep East Asian academic rigour with increasing internationalization.",
    structure:"6 years elementary (Grades 1–6), 3 years junior high school (Grades 7–9), 3 years senior high school (Grades 10–12) leading to the Joint University Entrance Examination (Gaokao-equivalent: GSAT/AST), then higher education. The 12-year basic education policy became mandatory in 2014.",
    degrees:[["Bachelor (學士)","4 years","128 credit hours typical"],["Master (碩士)","2 years","24+ credit hours + thesis"],["Doctorate (博士)","3–7 years","Research + dissertation defense"]],
    creditSystem:"Credit-hour system. 1 credit = 1 lecture hour/week per semester (16 weeks). Bachelor's = 128 credit hours standard. Graduate programs use thesis credits.",
    scale:[["90–100","A+ (Excellent)","Distinction — 4.3 GPA equivalent at shifting universities"],["80–89","A (Very Good)","Merit — 4.0 GPA"],["70–79","B (Good)","Pass (graduate: minimum pass)"],["60–69","C (Pass/Undergraduate)","Minimum undergraduate pass"],["<60","D / F (Fail)","Fail for undergraduate; <70 fails for graduate programs"]],
    passing:"60/100 for undergraduate programs; 70/100 for graduate (Master's and Doctoral) programs",
    distinction:"90+ (A+) — Distinction. Many universities are transitioning to a 4.3 GPA scale where A+ = 4.3.",
    gpa:"Taiwan is transitioning from pure 100-point numeric scores to a 4.3 GPA system. Traditional mapping: A+=4.3 (90–100), A=4.0 (80–89), B+=3.3 (75–79), B=3.0 (70–74), C+=2.3 (65–69), C=2.0 (60–64), F=0 (<60). Individual university conversions may vary.",
    special:"A critical distinction: the pass threshold in Taiwan is 60% for undergraduate study but rises to 70% for graduate (Master's and Doctoral) programs. This dual-pass threshold is unique and must be applied correctly in international conversions. Taiwan's top universities are increasingly adopting English-medium instruction for graduate programs.",
    recognition:"Taiwanese degrees are recognized in the US, Europe, Japan, and throughout Asia. Taiwan participates in bilateral credential recognition agreements with over 30 countries. NTU and NTHU are particularly well-regarded for STEM fields.",
    admission:"GSAT (General Scholastic Ability Test) and AST (Advanced Subjects Test) for domestic students. International students: high school diploma, academic transcripts, IELTS/TOEFL, and Mandarin proficiency (TOCFL) for Chinese-medium programs. MOE scholarship programs are available for international students.",
  },
  "Poland": {
    overview:"Poland's higher education system has undergone significant modernization under the Bologna Process and European Higher Education Area (EHEA) reforms. Poland participates fully in the EU Erasmus+ programme and is a growing destination for international students, particularly from Ukraine, Belarus, and other European countries. Quality is regulated by the Polish Accreditation Committee (PKA).",
    structure:"8 years primary school, 4 years secondary school (liceum/technikum leading to Matura examination), then higher education. The Matura exam is the standard university entry qualification. Since 2019, the education system was reformed back from a 3+3 to a 4-year secondary structure.",
    degrees:[["Licencjat/Inżynier (Bachelor's)","3–3.5 years","180–210 ECTS"],["Magister (Master's)","2 years","120 ECTS"],["Doktorat (Doctorate)","3–4 years","Doctoral school-based, research"]],
    creditSystem:"ECTS system. Full-time = 60 ECTS/year. Poland was an early adopter of the Bologna Process (1999). Diploma Supplement is issued alongside degrees.",
    scale:[["5.0 (bdb — bardzo dobry)","Very Good — highest passing grade","Distinction"],["4.5 (db+ — dobry plus)","Good Plus","Merit"],["4.0 (db — dobry)","Good","Good"],["3.5 (dst+ — dostateczny plus)","Satisfactory Plus","Pass"],["3.0 (dst — dostateczny)","Satisfactory — minimum pass","Minimum Pass"],["2.0 (ndst — niedostateczny)","Unsatisfactory — Fail","Fail"]],
    passing:"3.0 (dostateczny — Satisfactory). Grades below 3.0 are failing grades. The grade 2.0 is the only failing grade on the scale.",
    distinction:"5.0 (bardzo dobry — Very Good). Some institutions award 5.0 z wyróżnieniem (with distinction) or Celujący (6.0 at secondary, not used at university level) for exceptional performance.",
    gpa:"Poland does not use a GPA system. The final degree grade is the weighted arithmetic mean of all course grades, typically calculated and printed on the diploma supplement. Grades of 2.0 are excluded from the final average as they represent course failures that must be retaken.",
    special:"The Polish grading scale runs from 2.0 to 5.0, with 3.0 as the minimum pass mark. This is counter-intuitive for students from countries using 0-based scales — a 2.0 in Poland is the only failing grade, not a low pass. The 'zaliczenie' (Zal.) notation is used for pass/fail courses without a numeric grade. Erasmus students frequently use the ECTS grading table for international recognition.",
    recognition:"Polish degrees are fully recognized across the EU/EEA. ENIC-NARIC Poland handles international equivalency. PKA accreditation is the quality benchmark. Polish engineering degrees (Inżynier) are recognized by European Engineering Council FEANI.",
    admission:"Matura examination results, high school diploma (świadectwo maturalne), Polish language proficiency (B2 for Polish-medium programs), or IELTS/TOEFL for English-medium programs. NAWA (National Agency for Academic Exchange) facilitates international admissions.",
  },
};

// ── BLOG RENDERER ──
function buildCountryCards() {
  const grid = document.getElementById('countryCards');
  const homeGrid = document.getElementById('homeCountryCards');
  const featured = ['Germany','United Kingdom','United States','France','India','China','Canada','South Korea','Nigeria','Poland','Taiwan','Vietnam'].filter(n => COUNTRIES.find(c=>c.name===n));
  const sorted = [...COUNTRIES].sort((a,b) => a.name.localeCompare(b.name));
  sorted.forEach(c => {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `<span class="country-flag">${c.flag}</span><div><div class="country-name">${c.name}</div><div class="country-scale">${c.scaleNote}</div></div>`;
    card.addEventListener('click', () => { showSection('guides'); setTimeout(()=>showCountryPage(c.name), 50); });
    if (grid) grid.appendChild(card);

    if (featured.includes(c.name) && homeGrid) {
      const hCard = document.createElement('div');
      hCard.className = 'country-card';
      hCard.style.cursor = 'pointer';
      hCard.innerHTML = `<span class="country-flag">${c.flag}</span><div><div class="country-name">${c.name}</div><div class="country-scale">${c.scaleNote}</div></div>`;
      hCard.addEventListener('click', () => { showSection('guides'); setTimeout(()=>showCountryPage(c.name), 50); });
      homeGrid.appendChild(hCard);
    }
  });
}

function showCountryPage(countryName) {
  const wrap = document.getElementById('countryDetailWrap');
  const grid = document.getElementById('countryGrid');
  const c = getCountry(countryName);
  const d = COUNTRY_DETAILS[countryName];
  grid.style.display = 'none';
  wrap.style.display = 'block';

  const formulaLabel = c.type === 'bavarian' ? 'Modified Bavarian Formula (DAAD)' :
                       c.type === 'classification' ? 'Classification Mapping' : 'Linear Scale Conversion';

  if (!d) {
    wrap.innerHTML = `
      <button class="back-btn" onclick="showCountryGrid()">← Back to Countries</button>
      <div class="country-hero" data-flag="${c.flag}">
        <div class="eyebrow">Education System Guide</div>
        <h2>${c.flag} ${c.name}</h2>
        <p>${c.scaleNote}. Conversion method: ${formulaLabel}.</p>
      </div>
      <div class="blog-grid">
        <div class="blog-card"><h3>Grading Scale</h3><div class="scale-highlight">
          <div class="row"><span>Best Grade</span><strong>${c.dir==='desc' ? c.min : c.max}</strong></div>
          <div class="row"><span>Passing Grade</span><strong>${c.pass}</strong></div>
          <div class="row"><span>Fail Threshold</span><strong>${c.dir==='desc' ? c.max : c.min}</strong></div>
          <div class="row"><span>Direction</span><strong>${c.dir === 'asc' ? '↑ Higher is better' : '↓ Lower is better (reverse scale)'}</strong></div>
        </div></div>
        <div class="blog-card"><h3>Conversion Method</h3><p><strong>${formulaLabel}</strong> — this is the primary method used when converting grades to or from ${c.name}.</p></div>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <button class="back-btn" onclick="showCountryGrid()">← Back to Countries</button>
    <div class="country-hero" data-flag="${c.flag}">
      <div class="eyebrow">Education System Guide · ${c.scaleNote}</div>
      <h2>${c.flag} ${c.name}</h2>
      <p>${d.overview}</p>
    </div>

    <div class="blog-grid">
      <div class="blog-card">
        <h3>Education Structure</h3>
        <p>${d.structure}</p>
      </div>
      <div class="blog-card">
        <h3>Degree Hierarchy</h3>
        <ul>${d.degrees.map(([deg,dur,cred])=>`<li><span><strong>${deg}</strong> — ${dur}</span><span class="tag">${cred}</span></li>`).join('')}</ul>
      </div>
      <div class="blog-card">
        <h3>Grading Scale</h3>
        <ul>${d.scale.map(([g,l,cls])=>`<li><span>${g} — <em>${l}</em></span><span class="tag">${cls}</span></li>`).join('')}</ul>
        <div class="scale-highlight" style="margin-top:1rem">
          <div class="row"><span>Passing Mark</span><strong>${d.passing}</strong></div>
          <div class="row"><span>Distinction</span><strong>${d.distinction}</strong></div>
          <div class="row"><span>Scale Direction</span><strong>${c.dir === 'asc' ? '↑ Higher = Better' : '↓ Lower = Better (Reverse Scale)'}</strong></div>
          <div class="row"><span>Conversion Method</span><strong>${formulaLabel}</strong></div>
        </div>
      </div>
      <div class="blog-card">
        <h3>Credit System</h3>
        <p>${d.creditSystem}</p>
      </div>
      <div class="blog-card">
        <h3>GPA Calculation</h3>
        <p>${d.gpa}</p>
      </div>
      <div class="blog-card">
        <h3>Unique Characteristics</h3>
        <p>${d.special}</p>
      </div>
      <div class="blog-card">
        <h3>International Recognition</h3>
        <p>${d.recognition}</p>
      </div>
      <div class="blog-card">
        <h3>Admission Requirements</h3>
        <p>${d.admission}</p>
      </div>
    </div>

    <div style="margin-top:1.5rem;padding:1.25rem;background:var(--parchment);border-radius:10px;border-left:4px solid var(--gold);">
      <p style="font-family:'DM Mono',monospace;font-size:0.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;">🔗 Use This System in the Grade Converter</p>
      <p style="font-size:.88rem;color:var(--slate);">Convert your ${c.name} grade to any of 29 countries using the formula-transparent Grade Converter tool.</p>
      <button onclick="showSection('tool')" style="margin-top:.75rem;padding:.5rem 1.25rem;background:var(--ink);color:var(--gold);border:1.5px solid var(--gold);border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;">Open Converter with ${c.name} →</button>
    </div>`;
}

function showCountryGrid() {
  document.getElementById('countryGrid').style.display = 'block';
  document.getElementById('countryDetailWrap').style.display = 'none';
}

// ── NAVIGATION ──

function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    const tabs = ['db','logic','folder','frontend'];
    b.classList.toggle('active', tabs[i] === id);
  });
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
}


// ── GPA CALCULATOR ──

// Grade scales: each entry is { letter, plus?, pctLow, pctHigh, points:{4.0, 4.3, 4.5, 5.0}, class }
const GRADE_SCALES = {
  '4.0': [
    { letter:'A+',  pct:'97–100', points:4.0, pctVal:98.5, cls:'Excellent'        },
    { letter:'A',   pct:'93–96',  points:4.0, pctVal:94.5, cls:'Excellent'        },
    { letter:'A−',  pct:'90–92',  points:3.7, pctVal:91.0, cls:'Excellent'        },
    { letter:'B+',  pct:'87–89',  points:3.3, pctVal:88.0, cls:'Good'             },
    { letter:'B',   pct:'83–86',  points:3.0, pctVal:84.5, cls:'Good'             },
    { letter:'B−',  pct:'80–82',  points:2.7, pctVal:81.0, cls:'Good'             },
    { letter:'C+',  pct:'77–79',  points:2.3, pctVal:78.0, cls:'Satisfactory'     },
    { letter:'C',   pct:'73–76',  points:2.0, pctVal:74.5, cls:'Satisfactory'     },
    { letter:'C−',  pct:'70–72',  points:1.7, pctVal:71.0, cls:'Satisfactory'     },
    { letter:'D+',  pct:'67–69',  points:1.3, pctVal:68.0, cls:'Below Average'    },
    { letter:'D',   pct:'63–66',  points:1.0, pctVal:64.5, cls:'Below Average'    },
    { letter:'D−',  pct:'60–62',  points:0.7, pctVal:61.0, cls:'Below Average'    },
    { letter:'F',   pct:'0–59',   points:0.0, pctVal:30.0, cls:'Fail'             },
  ],
  '4.3': [
    { letter:'A+',  pct:'90–100', points:4.3, pctVal:95.0, cls:'Exceptional'      },
    { letter:'A',   pct:'85–89',  points:4.0, pctVal:87.0, cls:'Excellent'        },
    { letter:'A−',  pct:'80–84',  points:3.7, pctVal:82.0, cls:'Excellent'        },
    { letter:'B+',  pct:'77–79',  points:3.3, pctVal:78.0, cls:'Good'             },
    { letter:'B',   pct:'73–76',  points:3.0, pctVal:74.5, cls:'Good'             },
    { letter:'B−',  pct:'70–72',  points:2.7, pctVal:71.0, cls:'Good'             },
    { letter:'C+',  pct:'67–69',  points:2.3, pctVal:68.0, cls:'Satisfactory'     },
    { letter:'C',   pct:'63–66',  points:2.0, pctVal:64.5, cls:'Satisfactory'     },
    { letter:'C−',  pct:'60–62',  points:1.7, pctVal:61.0, cls:'Satisfactory'     },
    { letter:'D+',  pct:'57–59',  points:1.3, pctVal:58.0, cls:'Marginal Pass'    },
    { letter:'D',   pct:'53–56',  points:1.0, pctVal:54.5, cls:'Marginal Pass'    },
    { letter:'D−',  pct:'50–52',  points:0.7, pctVal:51.0, cls:'Marginal Pass'    },
    { letter:'F',   pct:'0–49',   points:0.0, pctVal:25.0, cls:'Fail'             },
  ],
  '4.5': [
    { letter:'A+',  pct:'95–100', points:4.5, pctVal:97.5, cls:'Exceptional'      },
    { letter:'A',   pct:'90–94',  points:4.0, pctVal:92.0, cls:'Excellent'        },
    { letter:'B+',  pct:'85–89',  points:3.5, pctVal:87.0, cls:'Very Good'        },
    { letter:'B',   pct:'80–84',  points:3.0, pctVal:82.0, cls:'Good'             },
    { letter:'C+',  pct:'75–79',  points:2.5, pctVal:77.0, cls:'Satisfactory'     },
    { letter:'C',   pct:'70–74',  points:2.0, pctVal:72.0, cls:'Satisfactory'     },
    { letter:'D+',  pct:'65–69',  points:1.5, pctVal:67.0, cls:'Pass'             },
    { letter:'D',   pct:'60–64',  points:1.0, pctVal:62.0, cls:'Marginal Pass'    },
    { letter:'F',   pct:'0–59',   points:0.0, pctVal:30.0, cls:'Fail'             },
  ],
  '5.0': [
    { letter:'A',   pct:'90–100', points:5.0, pctVal:95.0, cls:'First Class / Excellent' },
    { letter:'B',   pct:'80–89',  points:4.0, pctVal:84.5, cls:'Second Upper / Good'     },
    { letter:'C',   pct:'70–79',  points:3.0, pctVal:74.5, cls:'Second Lower / Satisfactory' },
    { letter:'D',   pct:'60–69',  points:2.0, pctVal:64.5, cls:'Third Class / Pass'      },
    { letter:'E',   pct:'50–59',  points:1.0, pctVal:54.5, cls:'Marginal Pass'            },
    { letter:'F',   pct:'0–49',   points:0.0, pctVal:25.0, cls:'Fail'                     },
  ],
};

const GPA_CLASSIFICATIONS = {
  '4.0': [
    { label:'Summa Cum Laude',  min:3.9  },
    { label:'Magna Cum Laude',  min:3.7  },
    { label:'Cum Laude',        min:3.5  },
    { label:'Dean\'s List',     min:3.3  },
    { label:'Good Standing',    min:2.0  },
    { label:'Academic Warning', min:1.0  },
    { label:'Academic Failure', min:0    },
  ],
  '4.3': [
    { label:'Summa Cum Laude',  min:4.1  },
    { label:'Magna Cum Laude',  min:3.8  },
    { label:'Cum Laude',        min:3.5  },
    { label:'Good Standing',    min:2.0  },
    { label:'Academic Warning', min:1.0  },
    { label:'Academic Failure', min:0    },
  ],
  '4.5': [
    { label:'Summa Cum Laude (A+)', min:4.3  },
    { label:'Magna Cum Laude',      min:4.0  },
    { label:'Cum Laude',            min:3.5  },
    { label:'Good Standing',        min:2.0  },
    { label:'Academic Warning',     min:1.0  },
    { label:'Academic Failure',     min:0    },
  ],
  '5.0': [
    { label:'First Class Honours',    min:4.5  },
    { label:'Second Class Upper',     min:3.5  },
    { label:'Second Class Lower',     min:2.5  },
    { label:'Third Class / Pass',     min:1.5  },
    { label:'Fail',                   min:0    },
  ],
};

let currentScale = '4.0';
let courseCounter = 0;

function setGPAScale(scale, btn) {
  currentScale = scale;
  document.querySelectorAll('.scale-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  // Update all grade selects in existing rows
  document.querySelectorAll('.course-grade-select').forEach(sel => {
    const currentVal = sel.value;
    populateGradeSelect(sel, scale);
    // Try to keep same letter
    const opt = Array.from(sel.options).find(o => o.value === currentVal);
    if (opt) sel.value = currentVal;
    updateSelectColor(sel);
  });
  updateGradeReferenceTable(scale);
  document.getElementById('refScaleLabel').textContent = scale + ' SCALE';
}

function populateGradeSelect(sel, scale) {
  const grades = GRADE_SCALES[scale];
  sel.innerHTML = grades.map(g =>
    `<option value="${g.letter}">${g.letter} (${g.points.toFixed(1)})</option>`
  ).join('');
}

function updateSelectColor(sel) {
  sel.className = 'course-grade-select';
  const v = sel.value;
  if (!v) return;
  if (v.startsWith('A'))      sel.classList.add('grade-a');
  else if (v.startsWith('B')) sel.classList.add('grade-b');
  else if (v.startsWith('C')) sel.classList.add('grade-c');
  else if (v.startsWith('D') || v.startsWith('E')) sel.classList.add('grade-d');
  else if (v === 'F')         sel.classList.add('grade-f');
}

function addCourseRow(name='', credits=3, grade='') {
  courseCounter++;
  const id = courseCounter;
  const row = document.createElement('div');
  row.className = 'course-row';
  row.id = `row-${id}`;

  const gradeOptions = GRADE_SCALES[currentScale].map(g =>
    `<option value="${g.letter}" ${g.letter === grade ? 'selected' : ''}>${g.letter} (${g.points.toFixed(1)})</option>`
  ).join('');

  row.innerHTML = `
    <input type="text" class="course-input" placeholder="Course name (optional)" value="${name}">
    <input type="number" class="course-input" placeholder="Cr" value="${credits}" min="0.5" max="20" step="0.5">
    <select class="course-grade-select" onchange="updateSelectColor(this)">${gradeOptions}</select>
    <button class="remove-btn" onclick="removeCourseRow(${id})" title="Remove course">×</button>`;

  document.getElementById('courseRows').appendChild(row);
  const sel = row.querySelector('.course-grade-select');
  if (grade) { sel.value = grade; }
  else { sel.selectedIndex = 4; } // Default to B
  updateSelectColor(sel);
}

function removeCourseRow(id) {
  const row = document.getElementById(`row-${id}`);
  if (row) row.remove();
  // If no rows left, reset result
  if (document.getElementById('courseRows').children.length === 0) {
    document.getElementById('gpaEmptyState').style.display = 'block';
    document.getElementById('gpaResultContent').style.display = 'none';
  }
}

function clearAll() {
  document.getElementById('courseRows').innerHTML = '';
  courseCounter = 0;
  document.getElementById('gpaEmptyState').style.display = 'block';
  document.getElementById('gpaResultContent').style.display = 'none';
  document.getElementById('cumulativeResult').style.display = 'none';
  document.getElementById('prevGPA').value = '';
  document.getElementById('prevCredits').value = '';
  // Add a fresh row
  addCourseRow();
}

function getGradePoints(letter, scale) {
  const g = GRADE_SCALES[scale].find(g => g.letter === letter);
  return g ? g.points : 0;
}

function getClassification(gpa, scale) {
  const classes = GPA_CLASSIFICATIONS[scale];
  for (const c of classes) {
    if (gpa >= c.min) return c.label;
  }
  return 'Academic Failure';
}

function getGPAColor(gpa, scale) {
  const maxScale = parseFloat(scale);
  const pct = gpa / maxScale;
  if (pct >= 0.9)  return 'excellent';
  if (pct >= 0.75) return 'good';
  if (pct >= 0.55) return 'average';
  if (pct >= 0.3)  return 'low';
  return 'fail';
}

function getPctEquiv(gpa, scale) {
  // Approximate percentage from GPA
  const max = parseFloat(scale);
  const frac = gpa / max;
  // Map 0→40%, 0.5→55%, 1→65%, etc. rough linear
  return Math.round(40 + frac * 60);
}

function calculateGPA() {
  const rows = document.getElementById('courseRows').querySelectorAll('.course-row');
  if (rows.length === 0) {
    alert('Please add at least one course.');
    return;
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;
  const courseData = [];
  let hasError = false;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const nameVal = inputs[0].value.trim() || `Course ${courseData.length + 1}`;
    const credVal  = parseFloat(inputs[1].value);
    const gradeEl  = row.querySelector('.course-grade-select');
    const gradeVal = gradeEl.value;

    if (isNaN(credVal) || credVal <= 0) {
      inputs[1].style.borderColor = 'var(--rust)';
      hasError = true;
      return;
    }
    inputs[1].style.borderColor = '';

    const pts = getGradePoints(gradeVal, currentScale);
    const quality = pts * credVal;
    totalQualityPoints += quality;
    totalCredits += credVal;
    courseData.push({ name: nameVal, credits: credVal, grade: gradeVal, pts, quality });
  });

  if (hasError) { alert('Please check credit hours — all must be greater than 0.'); return; }
  if (totalCredits === 0) { alert('Total credits cannot be zero.'); return; }

  const gpa = totalQualityPoints / totalCredits;
  const gpaStr = gpa.toFixed(3);
  const classification = getClassification(gpa, currentScale);
  const colorClass = getGPAColor(gpa, currentScale);
  const maxScale = parseFloat(currentScale);
  const barPct = Math.min(100, (gpa / maxScale) * 100);
  const pctEquiv = getPctEquiv(gpa, currentScale);

  // Show results
  document.getElementById('gpaEmptyState').style.display = 'none';
  document.getElementById('gpaResultContent').style.display = 'block';

  const numEl = document.getElementById('gpaDisplayNum');
  numEl.textContent = gpaStr;
  numEl.className = `gpa-big-num ${colorClass}`;
  document.getElementById('gpaScaleLabel').textContent = `out of ${currentScale}`;
  document.getElementById('gpaClassLabel').textContent = classification;
  document.getElementById('gpaBarFill').style.width = barPct + '%';

  document.getElementById('res_totalCredits').textContent = totalCredits.toFixed(1);
  document.getElementById('res_totalPoints').textContent = totalQualityPoints.toFixed(2);
  document.getElementById('res_courseCount').textContent = courseData.length;
  document.getElementById('res_scale').textContent = currentScale + ' GPA Scale';
  document.getElementById('res_pct').textContent = `~${pctEquiv}%`;

  // Course list
  document.getElementById('res_courseList').innerHTML = courseData.map(c => `
    <div class="gpa-course-item">
      <span class="cname">${c.name}</span>
      <span class="cgrade">${c.grade}</span>
      <span class="cpoints">${c.credits}cr × ${c.pts} = <strong>${c.quality.toFixed(2)}</strong></span>
    </div>`).join('');

  // Cumulative GPA
  const prevGPA = parseFloat(document.getElementById('prevGPA').value);
  const prevCred = parseFloat(document.getElementById('prevCredits').value);
  const cumDiv = document.getElementById('cumulativeResult');
  if (!isNaN(prevGPA) && !isNaN(prevCred) && prevCred > 0) {
    const prevQP = prevGPA * prevCred;
    const cumGPA = (prevQP + totalQualityPoints) / (prevCred + totalCredits);
    const cumClass = getClassification(cumGPA, currentScale);
    const cumColor = getGPAColor(cumGPA, currentScale);
    cumDiv.style.display = 'block';
    cumDiv.innerHTML = `
      <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
        <div style="text-align:center">
          <div style="font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:900;color:var(--ink);line-height:1" class="gpa-big-num ${cumColor}">${cumGPA.toFixed(3)}</div>
          <div style="font-family:'DM Mono',monospace;font-size:0.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--slate-light);margin-top:0.3rem">Cumulative GPA</div>
        </div>
        <div style="flex:1;min-width:200px">
          <div style="font-weight:700;margin-bottom:0.4rem">${cumClass}</div>
          <div style="font-size:0.83rem;color:var(--slate-light);line-height:1.6">
            Previous: ${prevGPA.toFixed(3)} GPA over ${prevCred} credits<br>
            New term: ${gpaStr} GPA over ${totalCredits.toFixed(1)} credits<br>
            Combined: ${(prevCred + totalCredits).toFixed(1)} total credit hours
          </div>
        </div>
      </div>`;
  } else {
    cumDiv.style.display = 'none';
  }
}

function updateGradeReferenceTable(scale) {
  const grades = GRADE_SCALES[scale];
  document.getElementById('gradeReferenceBody').innerHTML = grades.map(g => `
    <tr>
      <td><strong>${g.letter}</strong></td>
      <td>${g.pct}%</td>
      <td style="font-family:'DM Mono',monospace;color:var(--gold);font-weight:600">${g.points.toFixed(1)}</td>
      <td>${g.cls}</td>
    </tr>`).join('');
}

function initGPA() {
  // Seed with 5 default rows
  const defaults = [
    ['Mathematics', 3, 'A'],
    ['English Literature', 3, 'B+'],
    ['Physics', 4, 'A−'],
    ['History', 3, 'B'],
    ['Computer Science', 3, 'A+'],
  ];
  defaults.forEach(([name, credits, grade]) => addCourseRow(name, credits, grade));
  updateGradeReferenceTable('4.0');
}

// ── i18n TRANSLATION SYSTEM ──
// ── i18n: delegated to /i18n.js (loaded by Layout on every page) ──
// These shims keep engine.js working when i18n.js is already loaded.
var currentLang = 'en';
function T(key) {
  if (window.GS_T) { currentLang = localStorage.getItem('gs_lang') || 'en'; return window.GS_T(key); }
  return key;
}
function setLanguage(lang, btn) {
  currentLang = lang;
  if (window.GS_setLanguage) window.GS_setLanguage(lang, btn);
}


// ══════════════════════════════════════════════════════
// EMAIL GATE — Lead Capture & Tool Access Control
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// FLASHCARD ENGINE — Pure deterministic parser, no AI
// ══════════════════════════════════════════════════════

let fcDeck    = [];   // [{front, back}, …]
let fcCurrent = 0;
let fcFlipped = false;
let fcMode    = 'text'; // 'text' | 'file'

function fcSetMode(mode, btn) {
  fcMode = mode;
  document.querySelectorAll('.fc-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('fcTextMode').style.display = mode === 'text' ? 'block' : 'none';
  document.getElementById('fcFileMode').style.display = mode === 'file' ? 'block' : 'none';
}

// ── Drag and drop file handling ──
document.addEventListener('DOMContentLoaded', () => {
  const dz = document.getElementById('fcDropZone');
  const fi = document.getElementById('fcFileInput');
  if (!dz || !fi) return;

  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) fcHandleFile(file);
  });
  fi.addEventListener('change', () => { if (fi.files[0]) fcHandleFile(fi.files[0]); });
});

function fcHandleFile(file) {
  const MAX = 5 * 1024 * 1024;
  if (file.size > MAX) { alert('File too large. Please use a file under 5MB.'); return; }

  const nameEl = document.getElementById('fcFileName');
  nameEl.textContent = '📎 ' + file.name;
  nameEl.style.display = 'block';

  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'txt') {
    const reader = new FileReader();
    reader.onload = e => fcParseAndRender(e.target.result);
    reader.readAsText(file);
  } else if (ext === 'pdf') {
    // For PDF in plain HTML context: read as text fallback
    // Real PDF parsing requires pdf.js; we inform user and read what we can
    const reader = new FileReader();
    reader.onload = e => {
      // Extract any readable ASCII text from the PDF binary
      const raw = e.target.result;
      const text = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
                      .replace(/\s{3,}/g, '\n')
                      .split('\n')
                      .filter(l => l.trim().length > 20)
                      .join('\n');
      if (text.length < 50) {
        alert('Could not extract readable text from this PDF. For best results, paste your notes directly using the "Paste Text" tab, or use a plain .txt file.');
        return;
      }
      fcParseAndRender(text);
    };
    reader.readAsBinaryString(file);
  } else {
    alert('Unsupported file type. Please upload a .txt or .pdf file.');
  }
}

// ── Core parser — deterministic, no AI ──
function fcParseText(rawText, splitMode) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/);

  // Colon-pair mode: "Term: Definition" → clean Q&A pairs
  if (splitMode === 'colon') {
    const pairs = [];
    const colonLines = lines.filter(l => l.includes(':') && l.trim().length > 4);
    colonLines.forEach(line => {
      const idx = line.indexOf(':');
      const front = line.slice(0, idx).trim().replace(/^[\s\-\*\•\d\.\)]+/, '');
      const back  = line.slice(idx + 1).trim();
      if (front.length > 1 && back.length > 1) pairs.push({ front, back });
    });
    return pairs;
  }

  // Bullet / numbered list mode
  if (splitMode === 'bullet') {
    const bulletRe = /^[\s]*[\-\*\•\◦\▸\▪\–\—][\s]+|^[\s]*\d+[\.\)]\s+/;
    const bullets = lines.filter(l => bulletRe.test(l));
    if (bullets.length >= 2) {
      return bullets.map(l => {
        const text = l.replace(bulletRe, '').trim();
        const colonIdx = text.indexOf(':');
        if (colonIdx > 2 && colonIdx < 60) {
          return { front: text.slice(0, colonIdx).trim(), back: text.slice(colonIdx+1).trim() };
        }
        // Split long bullets: first clause = front, rest = back
        const mid = Math.floor(text.length / 2);
        const splitAt = text.indexOf(' ', mid);
        return splitAt > 0 && text.length > 40
          ? { front: text.slice(0, splitAt).trim(), back: text.slice(splitAt).trim() }
          : { front: `Card ${bullets.indexOf(l)+1}`, back: text };
      }).filter(p => p.back.length > 0);
    }
  }

  // Sentence mode
  if (splitMode === 'sentence') {
    const sentenceRe = /(?<=[.?!])\s+/;
    const allText = rawText.replace(/\r?\n/g, ' ').trim();
    const sentences = allText.split(sentenceRe).filter(s => s.trim().length > 15);
    return sentences.map((s, i) => ({ front: `Point ${i+1}`, back: s.trim() }));
  }

  // Paragraph mode
  if (splitMode === 'paragraph') {
    const paras = rawText.split(/\r?\n\s*\r?\n/).map(p => p.trim()).filter(p => p.length > 15);
    return paras.map((p, i) => {
      const firstLine = p.split(/\r?\n/)[0].trim();
      const rest = p.slice(firstLine.length).trim();
      return { front: firstLine || `Paragraph ${i+1}`, back: rest || p };
    });
  }

  // AUTO-DETECT: inspect content to choose best strategy
  const hasBullets = lines.some(l => /^[\s]*[\-\*\•\◦][\s]+/.test(l));
  const hasNumbers = lines.some(l => /^[\s]*\d+[\.\)]\s+/.test(l));
  const hasColons  = lines.filter(l => /^[^:\n]{3,60}:/.test(l)).length >= 2;
  const paraBlocks = rawText.split(/\r?\n\s*\r?\n/).filter(p => p.trim().length > 15);

  if (hasColons)                    return fcParseText(rawText, 'colon');
  if (hasBullets || hasNumbers)     return fcParseText(rawText, 'bullet');
  if (paraBlocks.length >= 2)       return fcParseText(rawText, 'paragraph');
  return fcParseText(rawText, 'sentence');
}

function fcGenerate() {
  let rawText = '';
  const splitMode = document.getElementById('fcSplitMode').value;

  if (fcMode === 'text') {
    rawText = document.getElementById('fcTextarea').value;
  } else {
    // File mode: check if text was loaded
    rawText = document.getElementById('fcTextarea').dataset.fileContent || '';
  }

  // Also accept file content stored on textarea dataset
  if (!rawText.trim()) {
    // Try textarea regardless of mode
    rawText = document.getElementById('fcTextarea').value;
  }
  if (!rawText.trim()) {
    alert('Please paste some notes or upload a file first.');
    return;
  }

  const deck = fcParseText(rawText, splitMode);
  if (deck.length === 0) {
    alert('Could not extract any flashcard content from the provided text. Try a different split mode or add more content.');
    return;
  }

  fcDeck    = deck;
  fcCurrent = 0;
  fcFlipped = false;
  fcRenderCard();
  fcBuildDeckList();

  document.getElementById('fcEmptyState').style.display  = 'none';
  document.getElementById('fcActiveState').style.display = 'flex';
  document.getElementById('fcDeckTray').style.display    = 'block';
}

// Store file content on textarea dataset for access from fcGenerate
document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('fcTextarea');
  if (ta) {
    // When file is loaded, populate textarea dataset
    // (this is set in fcHandleFile → fcParseAndRender)
  }
});

function fcParseAndRender(text) {
  // Store text so fcGenerate can access it regardless of mode
  const ta = document.getElementById('fcTextarea');
  if (ta) ta.dataset.fileContent = text;
  // Also populate textarea so user can see / edit content
  if (ta && !ta.value) ta.value = text;
  // Auto-generate immediately after file load
  const splitMode = document.getElementById('fcSplitMode').value;
  const deck = fcParseText(text, splitMode);
  if (deck.length > 0) {
    fcDeck    = deck;
    fcCurrent = 0;
    fcFlipped = false;
    fcRenderCard();
    fcBuildDeckList();
    document.getElementById('fcEmptyState').style.display  = 'none';
    document.getElementById('fcActiveState').style.display = 'flex';
    document.getElementById('fcDeckTray').style.display    = 'block';
  }
}

function fcRenderCard() {
  if (fcDeck.length === 0) return;
  const card = fcDeck[fcCurrent];
  const inner = document.getElementById('fcCardInner');

  // Reset flip state without animation jank
  inner.style.transition = 'none';
  inner.classList.remove('flipped');
  void inner.offsetHeight; // force reflow
  inner.style.transition = '';
  fcFlipped = false;

  document.getElementById('fcFrontText').textContent = card.front;
  document.getElementById('fcBackText').textContent  = card.back;

  // Counter
  document.getElementById('fcCounter').textContent = `${fcCurrent + 1} / ${fcDeck.length}`;

  // Nav buttons
  document.getElementById('fcPrevBtn').disabled = fcCurrent === 0;
  document.getElementById('fcNextBtn').disabled = fcCurrent === fcDeck.length - 1;

  // Progress
  const pct = ((fcCurrent + 1) / fcDeck.length) * 100;
  document.getElementById('fcProgressFill').style.width  = pct + '%';
  document.getElementById('fcProgressLabel').textContent = `Card ${fcCurrent + 1} of ${fcDeck.length}`;

  // Highlight in deck tray
  document.querySelectorAll('.fc-deck-row').forEach((r, i) => {
    r.classList.toggle('current', i === fcCurrent);
  });
}

function fcFlip() {
  const inner = document.getElementById('fcCardInner');
  fcFlipped = !fcFlipped;
  inner.classList.toggle('flipped', fcFlipped);
}

function fcNav(dir) {
  const next = fcCurrent + dir;
  if (next < 0 || next >= fcDeck.length) return;
  fcCurrent = next;
  fcRenderCard();
}

function fcBuildDeckList() {
  const list = document.getElementById('fcDeckList');
  list.innerHTML = fcDeck.map((card, i) => `
    <div class="fc-deck-row ${i === fcCurrent ? 'current' : ''}" onclick="fcJumpTo(${i})">
      <span class="fc-deck-num">${i + 1}.</span>
      <span>${card.front.slice(0, 60)}${card.front.length > 60 ? '…' : ''}</span>
    </div>`).join('');
}

function fcJumpTo(idx) {
  fcCurrent = idx;
  fcRenderCard();
  document.querySelectorAll('.fc-deck-row').forEach((r, i) => r.classList.toggle('current', i === idx));
}

// Keyboard navigation for flashcards
document.addEventListener('keydown', e => {
  const flashSection = document.getElementById('flashcard');
  if (!flashSection || !flashSection.classList.contains('active')) return;
  if (fcDeck.length === 0) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); fcFlip(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); fcNav(1); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); fcNav(-1); }
});

// ══════════════════════════════════════════════════════
// BLOG ARTICLES — Static seed content
// ══════════════════════════════════════════════════════
const ARTICLES = [
  {
    slug: 'bavarian-formula',
    tag: 'Grade Conversion',
    title: 'How the Modified Bavarian Formula Works',
    excerpt: 'A deep dive into the DAAD-approved formula used to convert international grades into the German 1.0–5.0 grading system, with worked examples.',
    date: 'Feb 2025',
    content: `<h3>What Is the Modified Bavarian Formula?</h3>
<p>The Modified Bavarian Formula (MBF) is the official method recommended by the DAAD (German Academic Exchange Service) for converting international grades into the German grading system. It is used by universities throughout Germany to assess international applicants’ academic credentials.</p>
<h3>The Formula</h3>
<p><strong>X = X<sub>min</sub> + (X<sub>max</sub> − X<sub>min</sub>) × (N<sub>max</sub> − N) / (N<sub>max</sub> − N<sub>min</sub>)</strong></p>
<ul>
<li><strong>X</strong> = German grade result (1.0 = best, 4.0 = minimum pass)</li>
<li><strong>N</strong> = The applicant’s grade in their home system</li>
<li><strong>N<sub>max</sub></strong> = Maximum possible grade in home system</li>
<li><strong>N<sub>min</sub></strong> = Minimum passing grade in home system</li>
</ul>
<h3>Worked Example</h3>
<p>A US student with a 3.5 GPA (4.0 scale, pass = 2.0):<br>X = 1.0 + (4.0 − 1.0) × (4.0 − 3.5) / (4.0 − 2.0) = 1.0 + 3.0 × 0.25 = <strong>1.75</strong> (German: Gut)</p>
<h3>Why This Formula?</h3>
<p>The formula ensures proportional mapping between grading scales, accounting for different passing thresholds and maximum grades across countries. It is accepted by German universities and the DAAD itself as the standard conversion method.</p>`
  },
  {
    slug: 'uk-degree-classifications',
    tag: 'Study Abroad',
    title: 'Understanding UK Degree Classifications for International Students',
    excerpt: 'First Class, 2:1, 2:2 — what do they mean? How do UK degree classifications compare to GPA systems around the world?',
    date: 'Jan 2025',
    content: `<h3>The UK Degree Classification System</h3>
<p>The United Kingdom uses a classification system for undergraduate degrees that differs significantly from the GPA systems used in North America and Asia.</p>
<h3>The Four Main Classifications</h3>
<ul>
<li><strong>First Class Honours (1st)</strong>: 70%+. Equivalent to roughly a 3.7–4.0 GPA.</li>
<li><strong>Upper Second Class Honours (2:1)</strong>: 60–69%. The most common classification. Equivalent to approximately 3.0–3.7 GPA. Required for most postgraduate programs.</li>
<li><strong>Lower Second Class Honours (2:2)</strong>: 50–59%. Equivalent to roughly 2.3–3.0 GPA.</li>
<li><strong>Third Class Honours (3rd)</strong>: 40–49%. Minimum honours pass. Equivalent to approximately 1.7–2.3 GPA.</li>
</ul>
<h3>International Equivalencies</h3>
<p>A UK First is broadly equivalent to an American 3.7+ GPA, a German 1.0–1.5, a French 16+/20, or an Australian High Distinction. A 2:1 is typically required for entry to UK Master’s programs.</p>`
  },
  {
    slug: 'applying-german-university',
    tag: 'Academic Mobility',
    title: 'Top 10 Things to Know Before Applying to a German University',
    excerpt: 'From Numerus Clausus to Studienbewerbung — everything international students need to know before submitting their application.',
    date: 'Dec 2024',
    content: `<h3>Applying to a German University as an International Student</h3>
<p>Germany offers tuition-free public university education and is one of the most popular study destinations globally. But the application process has unique requirements.</p>
<ol>
<li><strong>Hochschulzugangsberechtigung (HZB)</strong>: You need a recognized university entrance qualification. Check the anabin database.</li>
<li><strong>Numerus Clausus (NC)</strong>: Many programs have restricted admission based on grade average. The NC threshold changes each year.</li>
<li><strong>Grade Conversion</strong>: German universities use the Modified Bavarian Formula. A GPA of 3.5/4.0 typically converts to approximately 1.7–2.0.</li>
<li><strong>German Language</strong>: Most programs require TestDaF level 4 or DSH-2. Some are taught in English.</li>
<li><strong>uni-assist</strong>: Many universities use uni-assist to process international applications. Apply early — processing takes 6–8 weeks.</li>
<li><strong>Blocked Account</strong>: You’ll need a Sperrkonto with €11,208+ for your visa application.</li>
<li><strong>Deadlines</strong>: Summer semester: January 15. Winter semester: July 15.</li>
<li><strong>ECTS Credits</strong>: Germany accepts ECTS credits from Bologna countries directly.</li>
<li><strong>Health Insurance</strong>: Mandatory. Public health insurance available to students under 30.</li>
<li><strong>Enrollment Fee</strong>: Typically €250–350 per semester (covers public transport).</li>
</ol>`
  },
  {
    slug: 'gpa-scales-explained',
    tag: 'GPA Guide',
    title: 'The Difference Between 4.0, 4.3, 4.5 and 5.0 GPA Scales Explained',
    excerpt: 'Canada, South Korea, Nigeria, and the US all use different GPA scales. This guide breaks down each system and when to use which.',
    date: 'Nov 2024',
    content: `<h3>Why Do GPA Scales Differ?</h3>
<p>GPA (Grade Point Average) scales vary by country and institution. The most common scales are 4.0, 4.3, 4.5, and 5.0. Never compare raw numbers across different scales.</p>
<h3>The 4.0 Scale (United States, most of Canada)</h3>
<p>The most widely recognized scale globally. A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0. Many US universities cap A+ at 4.0, making 4.0 the maximum possible.</p>
<h3>The 4.3 Scale (Some Canadian Universities)</h3>
<p>Adds a 4.3 for A+. Used at universities like University of Toronto and UBC. An A = 4.0, A+ = 4.3. Important distinction when comparing Canadian transcripts.</p>
<h3>The 4.5 Scale (South Korea)</h3>
<p>South Korean universities predominantly use a 4.5 scale: A+ = 4.5, A = 4.0, B+ = 3.5, B = 3.0. A Korean 4.0/4.5 is roughly equivalent to a US 3.7/4.0.</p>
<h3>The 5.0 Scale (Nigeria and parts of Africa)</h3>
<p>Nigeria uses a 5.0 CGPA scale. A Nigerian 4.5/5.0 represents First Class Honours — equivalent to a US 3.6+/4.0. A raw score comparison across scales is always misleading.</p>`
  },
  {
    slug: 'poland-grading-scale',
    tag: 'Poland',
    title: "Poland’s 2.0–5.0 Grading Scale: A Guide for International Students",
    excerpt: "Why is 2.0 the only failing grade in Poland? How does the Polish system compare to ECTS grades? Everything explained clearly.",
    date: 'Oct 2024',
    content: `<h3>Overview of the Polish Grading System</h3>
<p>Poland uses a numeric scale from 2.0 to 5.0. The critical rule: <strong>2.0 is the ONLY failing grade.</strong> Everything from 3.0 upward is a pass.</p>
<h3>The Grade Scale</h3>
<ul>
<li><strong>5.0</strong> — bardzo dobry (very good) — Equivalent to A/Distinction</li>
<li><strong>4.5</strong> — dobry plus (good plus) — Equivalent to B+</li>
<li><strong>4.0</strong> — dobry (good) — Equivalent to B</li>
<li><strong>3.5</strong> — dostateczny plus (satisfactory plus) — Equivalent to C+</li>
<li><strong>3.0</strong> — dostateczny (satisfactory) — Minimum pass, equivalent to C</li>
<li><strong>2.0</strong> — niedostateczny (unsatisfactory) — The only failing grade. Course must be retaken.</li>
</ul>
<h3>ECTS Equivalency</h3>
<p>5.0 → A (Excellent), 4.0–4.5 → B (Very Good), 3.5 → C (Good), 3.0 → D (Satisfactory), 2.0 → F (Fail).</p>`
  },
  {
    slug: 'taiwan-pass-thresholds',
    tag: 'Taiwan',
    title: "Taiwan’s Dual Pass Threshold: 60 for Undergrad, 70 for Graduate",
    excerpt: "Taiwan is unique in applying different pass thresholds depending on your study level. This article explains the implications for international applicants.",
    date: 'Oct 2024',
    content: `<h3>Taiwan’s Unique Dual-Threshold System</h3>
<p>Taiwan applies two distinct minimum passing grades depending on level of study — a system unique among major academic nations.</p>
<h3>Undergraduate Level (60% minimum)</h3>
<p>At the bachelor’s level, the minimum passing grade is 60/100. The scale runs 0–100, with 90–100 = A (Excellent), 80–89 = B (Good), 70–79 = C (Satisfactory), 60–69 = D (Minimum pass).</p>
<h3>Graduate Level (70% minimum)</h3>
<p>At master’s and doctoral level, the minimum pass rises to 70/100. A grade of 65/100 that passes at undergraduate level is a <strong>failure</strong> at graduate level.</p>
<h3>Implications for International Students</h3>
<p>When converting Taiwanese grades to foreign systems, the threshold applied must match the student’s study level. GradeScope handles this dual threshold automatically when Taiwan is selected as source country.</p>`
  },
];

let currentArticleSlug = null;

function buildArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  grid.innerHTML = ARTICLES.map(a => `
    <div class="blog-article-card" style="cursor:pointer;" onclick="showArticle('${a.slug}')">
      <div class="blog-article-img"></div>
      <div class="blog-article-body">
        <div class="blog-article-tag">${a.tag}</div>
        <div class="blog-article-title">${a.title}</div>
        <div class="blog-article-excerpt">${a.excerpt}</div>
        <div class="blog-article-meta">${a.date} · GradeScope Editorial</div>
      </div>
    </div>`).join('');
}

function showArticle(slug) {
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return;
  currentArticleSlug = slug;
  const section = document.getElementById('articles');
  const grid = document.getElementById('articlesGrid');
  let detail = document.getElementById('articleDetail');
  if (!detail) {
    detail = document.createElement('div');
    detail.id = 'articleDetail';
    section.querySelector('.blog-articles-wrap').appendChild(detail);
  }
  grid.style.display = 'none';
  const sectionDesc = section.querySelector('.section-desc');
  if (sectionDesc) sectionDesc.style.display = 'none';
  detail.style.display = 'block';
  detail.innerHTML = `
    <button class="back-btn" onclick="closeArticle()" style="margin-bottom:1.5rem;">← Back to Articles</button>
    <div class="country-hero">
      <div class="eyebrow">${article.tag} · ${article.date}</div>
      <h2>${article.title}</h2>
      <p>${article.excerpt}</p>
    </div>
    <div class="blog-grid" style="margin-top:2rem;">
      <div class="blog-card" style="grid-column:1/-1;">
        ${article.content}
      </div>
    </div>
    <div style="margin-top:1.5rem;padding:1.25rem;background:var(--parchment);border-radius:10px;border-left:4px solid var(--gold);">
      <p style="font-family:'DM Mono',monospace;font-size:0.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;">🔗 Try the Grade Converter</p>
      <button onclick="showSection('tool')" style="margin-top:.5rem;padding:.5rem 1.25rem;background:var(--ink);color:var(--gold);border:1.5px solid var(--gold);border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer;">Open Grade Converter →</button>
    </div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeArticle() {
  currentArticleSlug = null;
  const grid = document.getElementById('articlesGrid');
  const detail = document.getElementById('articleDetail');
  const sectionDesc = document.querySelector('#articles .section-desc');
  if (grid) grid.style.display = '';
  if (detail) detail.style.display = 'none';
  if (sectionDesc) sectionDesc.style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── MOBILE MENU ──
function toggleMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    btn.classList.add('open');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  btn.classList.remove('open');
  menu.classList.remove('open');
  document.body.style.overflow = '';
}


// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburgerBtn');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeMobileMenu();
  }
});









function mobileNav(section) {
  if (typeof closeMobileMenu === 'function') closeMobileMenu();
  showSection(section);
}

// ── Expose all tool functions on window for Next.js React components ──
window.init            = init;
window.updateHint      = updateHint;
window.swapCountries   = swapCountries;
window.convertGrade    = convertGrade;
window.initGPA         = initGPA;
window.addCourseRow    = addCourseRow;
window.clearAll        = clearAll;
window.calculateGPA    = calculateGPA;
window.setGPAScale     = setGPAScale;
