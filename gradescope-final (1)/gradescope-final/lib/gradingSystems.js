/**
 * gradingSystems.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every grading system used in this platform.
 *
 * Each country entry defines:
 *   iso          — ISO 3166-1 alpha-2 code
 *   flag         — emoji flag
 *   scaleType    — category of scale (see SCALE_TYPES)
 *   min          — lowest possible grade value
 *   max          — highest possible grade value
 *   pass         — minimum passing grade
 *   direction    — 'asc'  = higher is better (most countries)
 *                  'desc' = lower is better  (Germany, Philippines)
 *   scaleLabel   — human-readable scale description
 *   scaleNote    — extra context shown to users
 *   gradeMap     — ordered array of named grade bands used for
 *                  letter-to-value and value-to-label lookups.
 *                  Each band: { label, min, max, gpa4 }
 *                    label  — local letter/classification label
 *                    min    — inclusive lower bound (in this country's scale)
 *                    max    — inclusive upper bound
 *                    gpa4   — approximate US 4.0 equivalent (used for
 *                              normalisation when no formula applies)
 *
 * SCALE_TYPES (reference):
 *   'gpa4'           — 4.0-point GPA  (US, Canada, Ethiopia …)
 *   'gpa4_3'         — 4.3-point GPA  (variation used by some CA unis)
 *   'gpa4_5'         — 4.5-point GPA  (South Korea)
 *   'gpa5'           — 5.0-point CGPA (Nigeria)
 *   'tenPoint'       — 0–10 numeric   (India, Argentina, Spain, Vietnam …)
 *   'twentyPoint'    — 0–20 numeric   (France, Iran, Portugal)
 *   'fivePoint'      — 0–5 numeric    (Finland, Sweden)
 *   'fivePointDesc'  — 1–5 descending (Poland: 2–5, Philippines: 1–5)
 *   'percentage'     — 0–100%         (China, UK, Ireland, South Africa, Taiwan)
 *   'italyScale'     — 18–30 (Italian university points)
 *   'bavarian'       — 1–5 descending (Germany: 1 = excellent, 5 = fail)
 *   'nlScale'        — 1–10 Dutch scale (pass = 5.5)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Shared grade-map helpers ─────────────────────────────────────────────────

/** Standard US/Canada 4.0 letter-grade bands */
const US_GRADE_MAP = [
  { label: 'A+', min: 4.0,  max: 4.0,  gpa4: 4.0  },
  { label: 'A',  min: 3.7,  max: 3.99, gpa4: 4.0  },
  { label: 'A−', min: 3.5,  max: 3.69, gpa4: 3.7  },
  { label: 'B+', min: 3.3,  max: 3.49, gpa4: 3.3  },
  { label: 'B',  min: 3.0,  max: 3.29, gpa4: 3.0  },
  { label: 'B−', min: 2.7,  max: 2.99, gpa4: 2.7  },
  { label: 'C+', min: 2.3,  max: 2.69, gpa4: 2.3  },
  { label: 'C',  min: 2.0,  max: 2.29, gpa4: 2.0  },
  { label: 'C−', min: 1.7,  max: 1.99, gpa4: 1.7  },
  { label: 'D+', min: 1.3,  max: 1.69, gpa4: 1.3  },
  { label: 'D',  min: 1.0,  max: 1.29, gpa4: 1.0  },
  { label: 'F',  min: 0,    max: 0.99, gpa4: 0.0  },
];

/** UK degree classification bands (percentage-based) */
const UK_GRADE_MAP = [
  { label: 'First Class Honours',      min: 70,  max: 100,  gpa4: 4.0  },
  { label: 'Upper Second Class (2:1)', min: 60,  max: 69.9, gpa4: 3.3  },
  { label: 'Lower Second Class (2:2)', min: 50,  max: 59.9, gpa4: 3.0  },
  { label: 'Third Class Honours',      min: 40,  max: 49.9, gpa4: 2.0  },
  { label: 'Pass / Ordinary Degree',   min: 35,  max: 39.9, gpa4: 1.0  },
  { label: 'Fail',                     min: 0,   max: 34.9, gpa4: 0.0  },
];

/** Irish Honours classification bands */
const IE_GRADE_MAP = [
  { label: 'First Class Honours (H1)',  min: 70, max: 100,  gpa4: 4.0  },
  { label: 'Second Class Honours (H2)', min: 60, max: 69.9, gpa4: 3.3  },
  { label: 'Third Class Honours (H3)',  min: 50, max: 59.9, gpa4: 3.0  },
  { label: 'Pass (H4)',                 min: 40, max: 49.9, gpa4: 2.0  },
  { label: 'Fail',                      min: 0,  max: 39.9, gpa4: 0.0  },
];

// ── Country definitions ──────────────────────────────────────────────────────

/**
 * GRADING_SYSTEMS
 * Key = country name (matches COUNTRIES array in tools.js exactly)
 */
export const GRADING_SYSTEMS = {

  Argentina: {
    iso: 'AR', flag: '🇦🇷',
    scaleType: 'tenPoint',
    min: 0, max: 10, pass: 6,
    direction: 'asc',
    scaleLabel: '0–10',
    scaleNote: '10-point scale; 6 = minimum pass',
    gradeMap: [
      { label: 'Sobresaliente', min: 9,  max: 10, gpa4: 4.0 },
      { label: 'Distinguido',   min: 7,  max: 8.9, gpa4: 3.3 },
      { label: 'Bueno',         min: 6,  max: 6.9, gpa4: 2.0 },
      { label: 'Aprobado',      min: 4,  max: 5.9, gpa4: 1.0 },
      { label: 'Reprobado',     min: 0,  max: 3.9, gpa4: 0.0 },
    ],
  },

  Canada: {
    iso: 'CA', flag: '🇨🇦',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA scale; 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  China: {
    iso: 'CN', flag: '🇨🇳',
    scaleType: 'percentage',
    min: 0, max: 100, pass: 60,
    direction: 'asc',
    scaleLabel: '0–100 (百分制)',
    scaleNote: '100-point scale; 60 = pass',
    gradeMap: [
      { label: '优秀 (Excellent)',  min: 90, max: 100, gpa4: 4.0 },
      { label: '良好 (Good)',       min: 75, max: 89,  gpa4: 3.0 },
      { label: '中等 (Average)',    min: 60, max: 74,  gpa4: 2.0 },
      { label: '及格 (Pass)',       min: 50, max: 59,  gpa4: 1.0 },
      { label: '不及格 (Fail)',     min: 0,  max: 49,  gpa4: 0.0 },
    ],
  },

  Ethiopia: {
    iso: 'ET', flag: '🇪🇹',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA scale; 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  Finland: {
    iso: 'FI', flag: '🇫🇮',
    scaleType: 'fivePoint',
    min: 0, max: 5, pass: 1,
    direction: 'asc',
    scaleLabel: '0–5',
    scaleNote: '0–5 numeric; 1 = minimum pass',
    gradeMap: [
      { label: '5 (Erinomainen)', min: 5,   max: 5,   gpa4: 4.0 },
      { label: '4',               min: 4,   max: 4.9, gpa4: 3.3 },
      { label: '3',               min: 3,   max: 3.9, gpa4: 2.7 },
      { label: '2',               min: 2,   max: 2.9, gpa4: 2.0 },
      { label: '1 (Pass)',        min: 1,   max: 1.9, gpa4: 1.0 },
      { label: '0 (Fail)',        min: 0,   max: 0.9, gpa4: 0.0 },
    ],
  },

  France: {
    iso: 'FR', flag: '🇫🇷',
    scaleType: 'twentyPoint',
    min: 0, max: 20, pass: 10,
    direction: 'asc',
    scaleLabel: '0–20',
    scaleNote: '20-point scale; 10/20 = pass',
    gradeMap: [
      { label: 'Très Bien',  min: 16, max: 20,  gpa4: 4.0 },
      { label: 'Bien',       min: 14, max: 15.9, gpa4: 3.3 },
      { label: 'Assez Bien', min: 12, max: 13.9, gpa4: 3.0 },
      { label: 'Passable',   min: 10, max: 11.9, gpa4: 2.0 },
      { label: 'Ajourné',    min: 0,  max: 9.9,  gpa4: 0.0 },
    ],
  },

  Germany: {
    iso: 'DE', flag: '🇩🇪',
    scaleType: 'bavarian',
    min: 1.0, max: 5.0, pass: 4.0,
    direction: 'desc',
    scaleLabel: '1.0–5.0 (1 = best)',
    scaleNote: 'Reverse scale: 1.0 = excellent, 4.0 = pass, 5.0 = fail',
    gradeMap: [
      { label: 'Sehr gut (1)',      min: 1.0, max: 1.5, gpa4: 4.0 },
      { label: 'Gut (2)',           min: 1.6, max: 2.5, gpa4: 3.3 },
      { label: 'Befriedigend (3)',  min: 2.6, max: 3.5, gpa4: 2.7 },
      { label: 'Ausreichend (4)',   min: 3.6, max: 4.0, gpa4: 2.0 },
      { label: 'Nicht bestanden',  min: 4.1, max: 5.0, gpa4: 0.0 },
    ],
  },

  Ghana: {
    iso: 'GH', flag: '🇬🇭',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA (WASSCE & tertiary); 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  India: {
    iso: 'IN', flag: '🇮🇳',
    scaleType: 'tenPoint',
    min: 0, max: 10, pass: 5.0,
    direction: 'asc',
    scaleLabel: '10-point CGPA',
    scaleNote: '10-point CGPA; 5.0 = pass (UGC framework)',
    gradeMap: [
      { label: 'O  (Outstanding)', min: 9,   max: 10,  gpa4: 4.0 },
      { label: 'A+ (Excellent)',   min: 8,   max: 8.9, gpa4: 3.7 },
      { label: 'A  (Very Good)',   min: 7,   max: 7.9, gpa4: 3.3 },
      { label: 'B+ (Good)',        min: 6,   max: 6.9, gpa4: 3.0 },
      { label: 'B  (Above Avg)',   min: 5,   max: 5.9, gpa4: 2.0 },
      { label: 'C  (Average)',     min: 4,   max: 4.9, gpa4: 1.0 },
      { label: 'F  (Fail)',        min: 0,   max: 3.9, gpa4: 0.0 },
    ],
  },

  Iran: {
    iso: 'IR', flag: '🇮🇷',
    scaleType: 'twentyPoint',
    min: 0, max: 20, pass: 10,
    direction: 'asc',
    scaleLabel: '0–20',
    scaleNote: '20-point scale; 10/20 = pass',
    gradeMap: [
      { label: 'Excellent (ممتاز)',   min: 17, max: 20,  gpa4: 4.0 },
      { label: 'Very Good (خیلی خوب)',min: 14, max: 16.9, gpa4: 3.3 },
      { label: 'Good (خوب)',          min: 12, max: 13.9, gpa4: 2.7 },
      { label: 'Average (متوسط)',     min: 10, max: 11.9, gpa4: 2.0 },
      { label: 'Fail (مردود)',        min: 0,  max: 9.9,  gpa4: 0.0 },
    ],
  },

  Ireland: {
    iso: 'IE', flag: '🇮🇪',
    scaleType: 'percentage',
    min: 0, max: 100, pass: 40,
    direction: 'asc',
    scaleLabel: '0–100%',
    scaleNote: 'Percentage → Honours classification; 40% = pass',
    gradeMap: IE_GRADE_MAP,
  },

  Italy: {
    iso: 'IT', flag: '🇮🇹',
    scaleType: 'italyScale',
    min: 18, max: 30, pass: 18,
    direction: 'asc',
    scaleLabel: '18–30 (30L)',
    scaleNote: '30-point scale; 18 = pass; 30 con lode = distinction',
    gradeMap: [
      { label: '30 con lode',   min: 30,  max: 30,  gpa4: 4.0 },
      { label: '27–30',         min: 27,  max: 29.9, gpa4: 3.7 },
      { label: '24–26',         min: 24,  max: 26.9, gpa4: 3.3 },
      { label: '21–23',         min: 21,  max: 23.9, gpa4: 2.7 },
      { label: '18–20 (Pass)',  min: 18,  max: 20.9, gpa4: 2.0 },
      { label: 'Fail',          min: 0,   max: 17.9, gpa4: 0.0 },
    ],
  },

  Kenya: {
    iso: 'KE', flag: '🇰🇪',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA system; 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  Malaysia: {
    iso: 'MY', flag: '🇲🇾',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA (CGPA)',
    scaleNote: '4.0 CGPA; 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  Netherlands: {
    iso: 'NL', flag: '🇳🇱',
    scaleType: 'nlScale',
    min: 1, max: 10, pass: 5.5,
    direction: 'asc',
    scaleLabel: '1–10',
    scaleNote: '10-point Dutch scale; 5.5 = pass (6 in practice)',
    gradeMap: [
      { label: 'Uitmuntend (10)',    min: 10,  max: 10,  gpa4: 4.0 },
      { label: 'Zeer goed (9)',      min: 9,   max: 9.9, gpa4: 4.0 },
      { label: 'Goed (8)',           min: 8,   max: 8.9, gpa4: 3.7 },
      { label: 'Ruim voldoende (7)', min: 7,   max: 7.9, gpa4: 3.3 },
      { label: 'Voldoende (6)',      min: 6,   max: 6.9, gpa4: 2.7 },
      { label: 'Bijna voldoende',    min: 5.5, max: 5.9, gpa4: 2.0 },
      { label: 'Onvoldoende',        min: 1,   max: 5.4, gpa4: 0.0 },
    ],
  },

  'New Zealand': {
    iso: 'NZ', flag: '🇳🇿',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA (NZQA)',
    scaleNote: '4.0 GPA (NZQA framework); 2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  Nigeria: {
    iso: 'NG', flag: '🇳🇬',
    scaleType: 'gpa5',
    min: 0, max: 5.0, pass: 1.5,
    direction: 'asc',
    scaleLabel: '5.0 GPA (CGPA)',
    scaleNote: '5.0 CGPA; 1.5 = minimum pass (D)',
    gradeMap: [
      { label: 'First Class',          min: 4.5, max: 5.0, gpa4: 4.0 },
      { label: 'Second Class Upper',   min: 3.5, max: 4.49, gpa4: 3.3 },
      { label: 'Second Class Lower',   min: 2.4, max: 3.49, gpa4: 2.7 },
      { label: 'Third Class',          min: 1.5, max: 2.39, gpa4: 2.0 },
      { label: 'Pass',                 min: 1.0, max: 1.49, gpa4: 1.0 },
      { label: 'Fail',                 min: 0,   max: 0.99, gpa4: 0.0 },
    ],
  },

  Pakistan: {
    iso: 'PK', flag: '🇵🇰',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA; 2.0 = pass (50% equivalent)',
    gradeMap: US_GRADE_MAP,
  },

  Philippines: {
    iso: 'PH', flag: '🇵🇭',
    scaleType: 'fivePointDesc',
    min: 1.0, max: 5.0, pass: 3.0,
    direction: 'desc',
    scaleLabel: '1.0 (best) – 5.0',
    scaleNote: 'Reverse scale: 1.0 = excellent, 3.0 = pass, 5.0 = fail',
    gradeMap: [
      { label: '1.0 (Excellent)', min: 1.0, max: 1.0, gpa4: 4.0 },
      { label: '1.25',            min: 1.1, max: 1.25, gpa4: 3.7 },
      { label: '1.5',             min: 1.26,max: 1.5,  gpa4: 3.3 },
      { label: '1.75',            min: 1.51,max: 1.75, gpa4: 3.0 },
      { label: '2.0',             min: 1.76,max: 2.0,  gpa4: 2.7 },
      { label: '2.25',            min: 2.01,max: 2.25, gpa4: 2.3 },
      { label: '2.5',             min: 2.26,max: 2.5,  gpa4: 2.0 },
      { label: '2.75',            min: 2.51,max: 2.75, gpa4: 1.7 },
      { label: '3.0 (Pass)',      min: 2.76,max: 3.0,  gpa4: 1.0 },
      { label: '5.0 (Fail)',      min: 3.01,max: 5.0,  gpa4: 0.0 },
    ],
  },

  Poland: {
    iso: 'PL', flag: '🇵🇱',
    scaleType: 'fivePointDesc',
    min: 2.0, max: 5.0, pass: 3.0,
    direction: 'asc',
    scaleLabel: '2.0–5.0',
    scaleNote: '5-point scale; 3.0 = pass, 2.0 = fail',
    gradeMap: [
      { label: 'Bardzo dobry (5)',    min: 5.0, max: 5.0,  gpa4: 4.0 },
      { label: 'Dobry plus (4.5)',    min: 4.5, max: 4.9,  gpa4: 3.5 },
      { label: 'Dobry (4)',           min: 4.0, max: 4.49, gpa4: 3.0 },
      { label: 'Dostateczny plus (3.5)', min: 3.5, max: 3.9, gpa4: 2.5 },
      { label: 'Dostateczny (3)',     min: 3.0, max: 3.49, gpa4: 2.0 },
      { label: 'Niedostateczny (2)',  min: 2.0, max: 2.99, gpa4: 0.0 },
    ],
  },

  Portugal: {
    iso: 'PT', flag: '🇵🇹',
    scaleType: 'twentyPoint',
    min: 0, max: 20, pass: 10,
    direction: 'asc',
    scaleLabel: '0–20',
    scaleNote: '20-point scale; 10/20 = pass',
    gradeMap: [
      { label: 'Muito Bom',   min: 16, max: 20,  gpa4: 4.0 },
      { label: 'Bom',         min: 14, max: 15.9, gpa4: 3.3 },
      { label: 'Suficiente',  min: 10, max: 13.9, gpa4: 2.0 },
      { label: 'Reprovado',   min: 0,  max: 9.9,  gpa4: 0.0 },
    ],
  },

  'South Africa': {
    iso: 'ZA', flag: '🇿🇦',
    scaleType: 'percentage',
    min: 0, max: 100, pass: 50,
    direction: 'asc',
    scaleLabel: '0–100%',
    scaleNote: 'Percentage system; 50% = pass',
    gradeMap: [
      { label: 'Distinction',    min: 75, max: 100, gpa4: 4.0 },
      { label: 'Merit',          min: 65, max: 74,  gpa4: 3.3 },
      { label: 'Credit',         min: 60, max: 64,  gpa4: 3.0 },
      { label: 'Pass',           min: 50, max: 59,  gpa4: 2.0 },
      { label: 'Fail',           min: 0,  max: 49,  gpa4: 0.0 },
    ],
  },

  'South Korea': {
    iso: 'KR', flag: '🇰🇷',
    scaleType: 'gpa4_5',
    min: 0, max: 4.5, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.5 GPA',
    scaleNote: '4.5 GPA (some universities use 4.3); 2.0 = pass',
    gradeMap: [
      { label: 'A+ (수)',  min: 4.3, max: 4.5, gpa4: 4.0 },
      { label: 'A  (우)',  min: 4.0, max: 4.29, gpa4: 3.7 },
      { label: 'B+ (미)',  min: 3.5, max: 3.99, gpa4: 3.3 },
      { label: 'B  (양)',  min: 3.0, max: 3.49, gpa4: 3.0 },
      { label: 'C+ (가)',  min: 2.5, max: 2.99, gpa4: 2.3 },
      { label: 'C  (가)',  min: 2.0, max: 2.49, gpa4: 2.0 },
      { label: 'D+ (가)',  min: 1.5, max: 1.99, gpa4: 1.3 },
      { label: 'D  (가)',  min: 1.0, max: 1.49, gpa4: 1.0 },
      { label: 'F  (낙)',  min: 0,   max: 0.99, gpa4: 0.0 },
    ],
  },

  Spain: {
    iso: 'ES', flag: '🇪🇸',
    scaleType: 'tenPoint',
    min: 0, max: 10, pass: 5,
    direction: 'asc',
    scaleLabel: '0–10',
    scaleNote: '10-point scale; 5 = pass (Aprobado)',
    gradeMap: [
      { label: 'Matrícula de Honor (10)', min: 10,  max: 10,  gpa4: 4.0 },
      { label: 'Sobresaliente (9–10)',    min: 9,   max: 9.9, gpa4: 4.0 },
      { label: 'Notable (7–8.9)',         min: 7,   max: 8.9, gpa4: 3.3 },
      { label: 'Aprobado (5–6.9)',        min: 5,   max: 6.9, gpa4: 2.0 },
      { label: 'Suspenso (0–4.9)',        min: 0,   max: 4.9, gpa4: 0.0 },
    ],
  },

  Sweden: {
    iso: 'SE', flag: '🇸🇪',
    scaleType: 'fivePoint',
    min: 0, max: 5, pass: 3,
    direction: 'asc',
    scaleLabel: 'A–F / 5-point',
    scaleNote: 'Letter grades A–F; numeric equiv 5–0; E/3 = pass',
    gradeMap: [
      { label: 'A (5)', min: 5,   max: 5,   gpa4: 4.0 },
      { label: 'B (4)', min: 4,   max: 4.9, gpa4: 3.3 },
      { label: 'C (3)', min: 3,   max: 3.9, gpa4: 2.7 },
      { label: 'D (2)', min: 2,   max: 2.9, gpa4: 2.0 },
      { label: 'E (1)', min: 1,   max: 1.9, gpa4: 1.0 },
      { label: 'F (0)', min: 0,   max: 0.9, gpa4: 0.0 },
    ],
  },

  Taiwan: {
    iso: 'TW', flag: '🇹🇼',
    scaleType: 'percentage',
    min: 0, max: 100, pass: 60,
    direction: 'asc',
    scaleLabel: '0–100',
    scaleNote: '100-point scale; 60 = pass (UG), 70 = pass (PG)',
    gradeMap: [
      { label: 'A+ (90–100)', min: 90, max: 100, gpa4: 4.0 },
      { label: 'A  (80–89)',  min: 80, max: 89,  gpa4: 3.7 },
      { label: 'B+ (70–79)',  min: 70, max: 79,  gpa4: 3.3 },
      { label: 'B  (60–69)',  min: 60, max: 69,  gpa4: 2.0 },
      { label: 'F  (0–59)',   min: 0,  max: 59,  gpa4: 0.0 },
    ],
  },

  Turkey: {
    iso: 'TR', flag: '🇹🇷',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA; 2.0 = pass (CC grade)',
    gradeMap: US_GRADE_MAP,
  },

  'United Arab Emirates': {
    iso: 'AE', flag: '🇦🇪',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA; 2.0 = pass (60% equivalent)',
    gradeMap: US_GRADE_MAP,
  },

  'United Kingdom': {
    iso: 'GB', flag: '🇬🇧',
    scaleType: 'percentage',
    min: 0, max: 100, pass: 40,
    direction: 'asc',
    scaleLabel: '0–100%',
    scaleNote: 'Percentage → degree classification; 40% = pass',
    gradeMap: UK_GRADE_MAP,
  },

  'United States': {
    iso: 'US', flag: '🇺🇸',
    scaleType: 'gpa4',
    min: 0, max: 4.0, pass: 2.0,
    direction: 'asc',
    scaleLabel: '4.0 GPA',
    scaleNote: '4.0 GPA; C/2.0 = pass',
    gradeMap: US_GRADE_MAP,
  },

  Vietnam: {
    iso: 'VN', flag: '🇻🇳',
    scaleType: 'tenPoint',
    min: 0, max: 10, pass: 5.0,
    direction: 'asc',
    scaleLabel: '0–10 / 4.0 GPA',
    scaleNote: '10-point scale; also mapped to 4.0 GPA',
    gradeMap: [
      { label: 'Xuất sắc (9–10)',  min: 9,  max: 10,  gpa4: 4.0 },
      { label: 'Giỏi (8–8.9)',     min: 8,  max: 8.9, gpa4: 3.5 },
      { label: 'Khá (7–7.9)',      min: 7,  max: 7.9, gpa4: 3.0 },
      { label: 'Trung bình (5–6.9)',min: 5, max: 6.9, gpa4: 2.0 },
      { label: 'Yếu (4–4.9)',      min: 4,  max: 4.9, gpa4: 1.0 },
      { label: 'Kém (0–3.9)',      min: 0,  max: 3.9, gpa4: 0.0 },
    ],
  },
};

/**
 * getSystem(countryName)
 * Returns the grading system for a country, or null if not found.
 */
export function getSystem(countryName) {
  return GRADING_SYSTEMS[countryName] ?? null;
}

/**
 * getSupportedCountries()
 * Returns a sorted array of all supported country names.
 */
export function getSupportedCountries() {
  return Object.keys(GRADING_SYSTEMS).sort();
}

/**
 * getGradeLabel(value, countryName)
 * Given a numeric grade value and country, returns the matching
 * gradeMap label (e.g. "First Class Honours", "Sehr gut (1)").
 * Returns null if the value is out of range or country not found.
 */
export function getGradeLabel(value, countryName) {
  const system = getSystem(countryName);
  if (!system) return null;
  const n = parseFloat(value);
  if (isNaN(n)) return null;
  return system.gradeMap.find(b => n >= b.min && n <= b.max)?.label ?? null;
}
