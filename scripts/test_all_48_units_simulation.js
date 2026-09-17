/**
 * test_all_48_units_simulation.js
 * End-to-End Simulation testing all 48 Units:
 * 1. Simulates student answering with exact correct_answer -> Must get 100% Pass Rate
 * 2. Simulates student answering with each acceptable_variant -> Must get 100% Pass Rate
 * 3. Verifies image existence on disk for all visual questions
 * 4. Verifies non-empty stems and rich pedagogical explanations (>20 chars)
 */

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/all_units_data.json');
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

function normalize(s) {
  return (s || '')
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/,([^\s])/g, ', $1')
    .replace(/[,.;?!]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkExamAnswer(q, userAns) {
  if (!userAns || !q) return false;
  const uClean = normalize(userAns);
  const cClean = normalize(q.correct_answer || '');
  if (!cClean) return false;

  if (uClean === cClean) return true;

  if (q.acceptable_variants && q.acceptable_variants.length > 0) {
    if (q.acceptable_variants.some(v => normalize(v) === uClean)) {
      return true;
    }
  }

  if (cClean.length === 1 && /^[a-d]$/.test(cClean)) {
    if (uClean.startsWith(cClean + '.') || uClean.startsWith(cClean + ' ') || uClean.startsWith(cClean + ')')) {
      return true;
    }
  }
  if (uClean.length === 1 && /^[a-d]$/.test(uClean)) {
    if (cClean.startsWith(uClean + '.') || cClean.startsWith(uClean + ' ') || cClean.startsWith(uClean + ')')) {
      return true;
    }
  }

  if (q.options && q.options.length > 0) {
    const selectedIndex = q.options.findIndex(opt => normalize(opt) === uClean);
    if (selectedIndex >= 0) {
      const optionLetter = String.fromCharCode(97 + selectedIndex);
      if (optionLetter === cClean || cClean.startsWith(optionLetter + '.') || cClean.startsWith(optionLetter + ' ')) {
        return true;
      }
    }
    const correctIndex = q.options.findIndex(opt => normalize(opt) === cClean);
    if (correctIndex >= 0) {
      const optionLetter = String.fromCharCode(97 + correctIndex);
      if (optionLetter === uClean || uClean.startsWith(optionLetter + '.') || uClean.startsWith(optionLetter + ' ')) {
        return true;
      }
    }
  }

  return false;
}

console.log("================================================================================");
console.log("          SMOB ENGLISH LAB — 48 UNITS FULL SIMULATION & QA TEST REPORT          ");
console.log("================================================================================\n");

let totalUnits = 0;
let totalQuestions = 0;
let totalCorrectDirect = 0;
let totalVariantsTested = 0;
let totalVariantsPassed = 0;
let totalImagesChecked = 0;
let totalImagesFound = 0;
let failures = [];

for (let uNum = 1; uNum <= 48; uNum++) {
  const uKey = String(uNum);
  const unit = data[uKey];
  if (!unit) {
    failures.push(`Missing unit ${uNum}`);
    continue;
  }
  totalUnits++;
  const exam = unit.unit_test || [];
  let unitCorrect = 0;

  exam.forEach((q, idx) => {
    totalQuestions++;
    const qNum = idx + 1;
    const qId = q.id || `q${qNum}`;

    // 1. Check stem
    if (!q.stem || q.stem.trim().length === 0) {
      failures.push(`Unit ${uNum} [${qId}]: Empty question stem`);
    }

    // 2. Check explanation
    if (!q.explanation || q.explanation.trim().length < 20) {
      failures.push(`Unit ${uNum} [${qId}]: Explanation too short (${(q.explanation || '').length} chars)`);
    }

    // 3. Check image file on disk if image_url is present
    if (q.image_url) {
      totalImagesChecked++;
      const fullImgPath = path.join(__dirname, '..', q.image_url);
      if (fs.existsSync(fullImgPath)) {
        totalImagesFound++;
      } else {
        failures.push(`Unit ${uNum} [${qId}]: Image file missing on disk -> ${q.image_url}`);
      }
    }

    // 4. Test direct correct_answer
    const directAns = q.correct_answer;
    if (checkExamAnswer(q, directAns)) {
      unitCorrect++;
      totalCorrectDirect++;
    } else {
      failures.push(`Unit ${uNum} [${qId}]: Failed direct correct_answer match for '${directAns}'`);
    }

    // 5. Test all acceptable_variants
    if (q.acceptable_variants && Array.isArray(q.acceptable_variants)) {
      q.acceptable_variants.forEach(variant => {
        totalVariantsTested++;
        if (checkExamAnswer(q, variant)) {
          totalVariantsPassed++;
        } else {
          failures.push(`Unit ${uNum} [${qId}]: Failed variant match for '${variant}'`);
        }
      });
    }
  });

  const unitPassRate = ((unitCorrect / exam.length) * 100).toFixed(1);
  console.log(`Unit ${String(uNum).padStart(2, ' ')}: ${String(exam.length).padStart(2, ' ')} questions | Direct Pass Rate: ${unitPassRate}% | Pass: ${unitCorrect}/${exam.length}`);
}

console.log("\n================================================================================");
console.log("                               SIMULATION SUMMARY                               ");
console.log("================================================================================");
console.log(`Total Units Scanned:          ${totalUnits}/48`);
console.log(`Total Questions Graded:       ${totalQuestions}`);
console.log(`Direct Answer Pass Rate:      ${((totalCorrectDirect / totalQuestions) * 100).toFixed(2)}% (${totalCorrectDirect}/${totalQuestions})`);
console.log(`Variants Tested:              ${totalVariantsTested}`);
console.log(`Variants Pass Rate:           ${((totalVariantsPassed / totalVariantsTested) * 100).toFixed(2)}% (${totalVariantsPassed}/${totalVariantsTested})`);
console.log(`Visual Questions Images:      ${totalImagesFound}/${totalImagesChecked} found on disk`);
console.log(`Total Validation Failures:    ${failures.length}`);

if (failures.length > 0) {
  console.log("\n--- FAILURES REPORT ---");
  failures.slice(0, 20).forEach(f => console.log("  [FAIL]", f));
  process.exit(1);
} else {
  console.log("\n>>> ALL 48 UNITS PASSED 100% VERIFICATION WITH ZERO ERRORS! <<<");
}
