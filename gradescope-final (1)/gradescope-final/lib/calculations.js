/**
 * calculations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure JavaScript calculation functions for the GradeScope platform.
 *
 * Exports:
 *   normalizeToPercent(value, countryName)  → 0–100 internal percentage
 *   normalizeToFourScale(value, countryName) → 0.0–4.0 GPA
 *   convertGPA(value, fromCountry, toCountry) → converted grade value
 *   calculateGPA(subjects, countryName)     → weighted GPA result object
 *
 * Rules:
 *   - No React, no UI, no HTML, no translation.
 *   - Every function is a pure function: same input → same output.
 *   - All functions return null / { error } on invalid input rather
 *     than throwing, so callers can handle gracefully.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getSystem, getGradeLabel } from './gradingSystems.js';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * clamp(n, min, max) — keeps a number inside [min, max]
 */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/**
 * round(n, dp) — round to dp decimal places
 */
function round(n, dp = 3) {
  return parseFloat(n.toFixed(dp));
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — normalizeToPercent
// ─────────────────────────────────────────────────────────────────────────────

/**
 * normalizeToPercent(value, countryName)
 *
 * Converts any country's grade value into an internal 0–100 percentage.
 * This is the first step in every conversion — all scales pass through here.
 *
 * Strategy per scaleType:
 *
 *   Standard ascending scales (linear):
 *     pct = (value − min) / (max − min) × 100
 *
 *   Descending scales (Germany, Philippines):
 *     These use the Modified Bavarian Formula to preserve academic meaning:
 *       - bestGrade (min of scale) → 100%
 *       - passGrade               → 40%   (threshold universally maps to ~D)
 *       - worstGrade (max of scale) → 0%
 *     Above pass:  pct = 40 + ((pass − value) / (pass − best)) × 60
 *     Below pass:  pct = ((worst − value) / (worst − pass)) × 40
 *
 *   Italy (18–30):
 *     Treated as linear from 18 (pass) to 30 (max).
 *     pct = (value − 18) / (30 − 18) × 60 + 40   → maps 18→40%, 30→100%
 *
 *   Netherlands (1–10, pass = 5.5):
 *     Linear but pass sits at 40% equivalent.
 *     pct = 40 + ((value − 5.5) / (10 − 5.5)) × 60  when value ≥ 5.5
 *     pct = (value − 1) / (5.5 − 1) × 40             when value < 5.5
 *
 * @param {number} value        — raw grade in the source country's scale
 * @param {string} countryName  — must match a key in GRADING_SYSTEMS
 * @returns {number|null}       — 0–100 or null on error
 */
export function normalizeToPercent(value, countryName) {
  const system = getSystem(countryName);
  if (!system) return null;
  const n = parseFloat(value);
  if (isNaN(n)) return null;

  const { min, max, pass, direction, scaleType } = system;

  // ── Italy: 18–30 scale, pass = 18 ────────────────────────────────────────
  if (scaleType === 'italyScale') {
    if (n < 18) return 0; // Fail
    // 18 → 40%, 30 → 100%
    return clamp(40 + ((n - 18) / (30 - 18)) * 60, 0, 100);
  }

  // ── Netherlands: 1–10, pass = 5.5 ────────────────────────────────────────
  if (scaleType === 'nlScale') {
    if (n < 1) return 0;
    if (n >= 5.5) {
      // 5.5 → 40%, 10 → 100%
      return clamp(40 + ((n - 5.5) / (10 - 5.5)) * 60, 0, 100);
    } else {
      // 1 → 0%, 5.5 → 40%
      return clamp(((n - 1) / (5.5 - 1)) * 40, 0, 100);
    }
  }

  // ── Poland 2–5 (ascending but 2 = fail) ──────────────────────────────────
  if (scaleType === 'fivePointDesc' && direction === 'asc') {
    // 3.0 = pass (40%), 5.0 = 100%, 2.0 = 0%
    if (n < pass) return clamp(((n - min) / (pass - min)) * 40, 0, 40);
    return clamp(40 + ((n - pass) / (max - pass)) * 60, 0, 100);
  }

  // ── Descending scales: Germany (bavarian), Philippines ───────────────────
  if (direction === 'desc') {
    const best  = min;   // 1.0 (Germany), 1.0 (Philippines)
    const worst = max;   // 5.0 both
    if (n <= best)  return 100;
    if (n >= worst) return 0;
    if (n <= pass) {
      // between best and pass → maps to 40–100%
      return clamp(40 + ((pass - n) / (pass - best)) * 60, 0, 100);
    } else {
      // between pass and worst → maps to 0–40%
      return clamp(((worst - n) / (worst - pass)) * 40, 0, 100);
    }
  }

  // ── Standard ascending linear scale ──────────────────────────────────────
  if (max === min) return 50; // degenerate edge case
  return clamp(((n - min) / (max - min)) * 100, 0, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — normalizeToFourScale
// ─────────────────────────────────────────────────────────────────────────────

/**
 * normalizeToFourScale(value, countryName)
 *
 * Converts any grade to the US 4.0 GPA scale.
 * Used as an intermediate value in conversions and for display.
 *
 * Mapping from internal percentage → 4.0 GPA:
 *   100–90% → 4.0
 *   90–80%  → 3.7
 *   80–73%  → 3.3
 *   73–67%  → 3.0
 *   67–60%  → 2.7
 *   60–53%  → 2.3
 *   53–47%  → 2.0
 *   47–40%  → 1.7
 *   40–33%  → 1.3
 *   33–27%  → 1.0
 *   27–0%   → 0.0
 *
 * @param {number} value
 * @param {string} countryName
 * @returns {number|null} — 0.0 to 4.0, or null on error
 */
export function normalizeToFourScale(value, countryName) {
  const pct = normalizeToPercent(value, countryName);
  if (pct === null) return null;

  // Standard WES-aligned percentage → 4.0 GPA mapping
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3;
  if (pct >= 60) return 1.0;
  return 0.0;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — percentToScale
// ─────────────────────────────────────────────────────────────────────────────

/**
 * percentToScale(pct, system)
 *
 * Reverses normalizeToPercent: converts an internal 0–100% back into
 * the destination country's grading scale.
 *
 * @param {number} pct    — 0–100 internal percentage
 * @param {object} system — a GRADING_SYSTEMS entry
 * @returns {number}      — grade value in the destination scale
 */
function percentToScale(pct, system) {
  const { min, max, pass, direction, scaleType } = system;
  const p = clamp(pct, 0, 100);

  // ── Italy ─────────────────────────────────────────────────────────────────
  if (scaleType === 'italyScale') {
    if (p < 40) return 0;  // below pass threshold = fail
    return clamp(18 + ((p - 40) / 60) * (30 - 18), 18, 30);
  }

  // ── Netherlands ───────────────────────────────────────────────────────────
  if (scaleType === 'nlScale') {
    if (p >= 40) {
      return clamp(5.5 + ((p - 40) / 60) * (10 - 5.5), 5.5, 10);
    } else {
      return clamp(1 + (p / 40) * (5.5 - 1), 1, 5.4);
    }
  }

  // ── Poland (ascending, min=2, pass=3) ─────────────────────────────────────
  if (scaleType === 'fivePointDesc' && direction === 'asc') {
    if (p < 40) return clamp(min + (p / 40) * (pass - min), min, pass - 0.001);
    return clamp(pass + ((p - 40) / 60) * (max - pass), pass, max);
  }

  // ── Descending scales ─────────────────────────────────────────────────────
  if (direction === 'desc') {
    const best  = min;
    const worst = max;
    if (p >= 100) return best;
    if (p <= 0)   return worst;
    if (p >= 40) {
      // 40–100% → between best and pass
      return clamp(pass - ((p - 40) / 60) * (pass - best), best, pass);
    } else {
      // 0–40% → between pass and worst
      return clamp(worst - (p / 40) * (worst - pass), pass, worst);
    }
  }

  // ── Standard ascending linear ─────────────────────────────────────────────
  return clamp(min + (p / 100) * (max - min), min, max);
}

// ─────────────────────────────────────────────────────────────────────────────
// convertGPA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * convertGPA(value, fromCountry, toCountry)
 *
 * Converts a grade from one country's scale to another.
 *
 * Pipeline:
 *   value (source scale)
 *     → normalizeToPercent()        [0–100 internal]
 *     → percentToScale()            [destination scale value]
 *
 * Also returns intermediate values and labels for UI transparency.
 *
 * @param {number} value        — grade in source country's scale
 * @param {string} fromCountry  — source country name
 * @param {string} toCountry    — destination country name
 * @returns {object|null}
 *   {
 *     input:           number   — original value
 *     fromCountry:     string
 *     toCountry:       string
 *     internalPercent: number   — 0–100 intermediate
 *     gpa4:            number   — 4.0 scale equivalent
 *     result:          number   — converted value (destination scale)
 *     resultRounded:   string   — result rounded to 2dp (for display)
 *     fromLabel:       string   — source grade label (e.g. "First Class Honours")
 *     toLabel:         string   — destination grade label
 *     isPassing:       boolean  — true if result meets destination pass threshold
 *     fromSystem:      object   — full source grading system
 *     toSystem:        object   — full destination grading system
 *   }
 */
export function convertGPA(value, fromCountry, toCountry) {
  if (value === null || value === undefined || value === '') return null;

  const fromSystem = getSystem(fromCountry);
  const toSystem   = getSystem(toCountry);

  if (!fromSystem) return { error: `Country not supported: ${fromCountry}` };
  if (!toSystem)   return { error: `Country not supported: ${toCountry}`   };

  const n = parseFloat(value);
  if (isNaN(n)) return { error: 'Invalid grade value' };

  // Validate input is within the source scale
  const { min: sMin, max: sMax } = fromSystem;
  if (n < sMin || n > sMax) {
    return { error: `Value ${n} is outside ${fromCountry}'s scale (${sMin}–${sMax})` };
  }

  const internalPercent = normalizeToPercent(n, fromCountry);
  if (internalPercent === null) return { error: 'Normalisation failed' };

  const gpa4   = normalizeToFourScale(n, fromCountry);
  const result = percentToScale(internalPercent, toSystem);

  // Determine passing
  const { pass: dPass, direction: dDir } = toSystem;
  const isPassing = dDir === 'desc' ? result <= dPass : result >= dPass;

  return {
    input:           n,
    fromCountry,
    toCountry,
    internalPercent: round(internalPercent, 2),
    gpa4:            round(gpa4, 2),
    result:          round(result, 3),
    resultRounded:   round(result, 2).toFixed(2),
    fromLabel:       getGradeLabel(n, fromCountry),
    toLabel:         getGradeLabel(result, toCountry),
    isPassing,
    fromSystem,
    toSystem,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// calculateGPA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateGPA(subjects, countryName)
 *
 * Calculates a weighted GPA from a list of subjects for a given country.
 *
 * Formula:
 *   GPA = Σ(gradePoints × creditHours) / Σ(creditHours)
 *
 * Each subject in the array must have:
 *   { name?: string, grade: number, credits: number }
 *
 * - grade   is in the country's native scale.
 * - credits can be any positive number (hours, ECTS, units, etc.).
 * - The function converts each grade to the 4.0 scale for the weighted sum,
 *   then scales the result back to the country's native range so the output
 *   is meaningful in local context.
 *
 * @param {Array}  subjects     — [{ name, grade, credits }, ...]
 * @param {string} countryName  — must match a key in GRADING_SYSTEMS
 * @returns {object|null}
 *   {
 *     gpa4:            number   — weighted GPA on 4.0 scale
 *     nativeGpa:       number   — GPA on country's own scale
 *     nativeGpaStr:    string   — formatted string (2dp)
 *     totalCredits:    number
 *     totalPoints:     number   — sum of (gpa4 × credits)
 *     classification:  string   — grade label on country's scale
 *     isPassing:       boolean
 *     subjects:        Array    — enriched with { gpa4, label, qualityPoints }
 *     country:         string
 *     system:          object   — the grading system used
 *     error?:          string   — present only if something went wrong
 *   }
 */
export function calculateGPA(subjects, countryName) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return { error: 'No subjects provided' };
  }

  const system = getSystem(countryName);
  if (!system) return { error: `Country not supported: ${countryName}` };

  let totalCredits = 0;
  let totalPoints  = 0;
  const enriched   = [];

  for (let i = 0; i < subjects.length; i++) {
    const subj = subjects[i];
    const grade   = parseFloat(subj.grade);
    const credits = parseFloat(subj.credits);

    if (isNaN(grade)) {
      return { error: `Subject "${subj.name || i + 1}": invalid grade "${subj.grade}"` };
    }
    if (isNaN(credits) || credits <= 0) {
      return { error: `Subject "${subj.name || i + 1}": credits must be a positive number` };
    }

    const gpa4 = normalizeToFourScale(grade, countryName);
    if (gpa4 === null) {
      return { error: `Subject "${subj.name || i + 1}": could not convert grade ${grade} for ${countryName}` };
    }

    const qualityPoints = gpa4 * credits;
    totalCredits += credits;
    totalPoints  += qualityPoints;

    enriched.push({
      name:          subj.name || `Subject ${i + 1}`,
      grade,
      credits,
      gpa4:          round(gpa4, 3),
      qualityPoints: round(qualityPoints, 3),
      label:         getGradeLabel(grade, countryName),
    });
  }

  if (totalCredits === 0) return { error: 'Total credits cannot be zero' };

  const gpa4 = totalPoints / totalCredits;

  // Convert the 4.0 GPA back to the country's native scale for display
  // We do this by treating the 4.0 result as a percentage (÷4 × 100)
  // then converting to the native scale.
  const pct       = (gpa4 / 4.0) * 100;
  const nativeGpa = percentToScale(pct, system);

  // Classification from native result
  const classification = getGradeLabel(nativeGpa, countryName);

  // Passing check
  const { pass, direction } = system;
  const isPassing = direction === 'desc' ? nativeGpa <= pass : nativeGpa >= pass;

  return {
    gpa4:           round(gpa4, 3),
    nativeGpa:      round(nativeGpa, 3),
    nativeGpaStr:   round(nativeGpa, 2).toFixed(2),
    totalCredits:   round(totalCredits, 2),
    totalPoints:    round(totalPoints,  3),
    classification: classification ?? (isPassing ? 'Pass' : 'Fail'),
    isPassing,
    subjects:       enriched,
    country:        countryName,
    system,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// percentToScale (re-exported for testing and external use)
// ─────────────────────────────────────────────────────────────────────────────
export { percentToScale };
