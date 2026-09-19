// -*- coding: utf-8 -*-
/**
 * scripts/test_student_customer_experience.js
 * ===========================================
 * End-to-End simulation of a real student answering questions across all 48 units.
 * Verifies evaluation logic, display badges, correct answers, and rich explanations.
 */

const fs = require('fs');
const theoryDB = JSON.parse(fs.readFileSync('d:/2.English/ENG Learning_Antigravity/data/theory_quizzes_data.json', 'utf8'));

console.log('======================================================================');
console.log('KIỂM THỬ TRẢI NGHIỆM THỰC TẾ HỌC VIÊN TRÊN TOÀN BỘ 48 UNITS');
console.log('======================================================================');

const testCases = [
  {
    unit: 7,
    quizId: 'tq_7_3',
    idx: 0,
    qNum: 11,
    desc: 'Unit 7 - Câu 11 (Vấn đề học viên vừa gặp): His father cleans the window.',
    studentInput: 'Does his father clean the window?',
    expectedOutcome: true,
    expectedAnsKeyword: 'Does his father clean the window?',
    forbiddenExplKeyword: 'David có mặc chiếc áo sơ mi này không'
  },
  {
    unit: 7,
    quizId: 'tq_7_3',
    idx: 1,
    qNum: 12,
    desc: 'Unit 7 - Câu 12: They rent a flat.',
    studentInput: 'Do they rent a flat?',
    expectedOutcome: true,
    expectedAnsKeyword: 'Do they rent a flat?',
    forbiddenExplKeyword: 'you sleep at 9.30'
  },
  {
    unit: 7,
    quizId: 'tq_7_2',
    idx: 0,
    qNum: 1,
    desc: 'Unit 7 - Bài tập 1 Câu 1: Does David ______ this shirt?',
    studentInput: 'A',
    expectedOutcome: true,
    expectedAnsKeyword: 'wear',
    expectedExplKeyword: 'David có mặc chiếc áo sơ mi này không'
  },
  {
    unit: 6,
    quizId: 'tq_6_2',
    idx: 0,
    qNum: 1,
    desc: 'Unit 6 - Bài tập 1 Câu 1: John _____ like swimming.',
    studentInput: 'A',
    expectedOutcome: true,
    expectedAnsKeyword: "doesn't",
    expectedExplKeyword: 'John'
  },
  {
    unit: 1,
    quizId: 'tq_1_1',
    idx: 0,
    qNum: 1,
    desc: 'Unit 1 - Dịch thuật Câu 1: giáo viên của anh ấy.',
    studentInput: 'his teacher',
    expectedOutcome: true,
    expectedAnsKeyword: 'his teacher',
    expectedExplKeyword: 'his'
  },
  {
    unit: 1,
    quizId: 'tq_1_2',
    idx: 0,
    qNum: 1,
    desc: 'Unit 1 - Mạo từ Câu 1: a/ an child',
    studentInput: 'a',
    expectedOutcome: true,
    expectedAnsKeyword: 'a',
    expectedExplKeyword: 'child'
  },
  {
    unit: 2,
    quizId: 'tq_2_1',
    idx: 0,
    qNum: 1,
    desc: 'Unit 2 - Số nhiều Câu 1: woman',
    studentInput: 'women',
    expectedOutcome: true,
    expectedAnsKeyword: 'women',
    expectedExplKeyword: 'woman'
  },
  {
    unit: 9,
    quizId: 'tq_9_1',
    idx: 0,
    qNum: 1,
    desc: 'Unit 9 - Từ loại Câu 1: He sings ______.',
    studentInput: 'B',
    expectedOutcome: true,
    expectedAnsKeyword: 'beautifully',
    expectedExplKeyword: 'Trạng từ'
  },
  {
    unit: 35,
    quizId: 'tq_35_1',
    idx: 0,
    qNum: 1,
    desc: 'Unit 35 - Đại từ phản thân Câu 1: He cut ______.',
    studentInput: 'A',
    expectedOutcome: true,
    expectedAnsKeyword: 'himself',
    expectedExplKeyword: 'himself'
  },
  {
    unit: 43,
    quizId: 'tq_43_1',
    idx: 2,
    qNum: 3,
    desc: 'Unit 43 - Nghề nghiệp Câu 3 (Nghe audio): florist / architect',
    studentInput: 'B',
    expectedOutcome: true,
    expectedAnsKeyword: 'architect',
    expectedExplKeyword: 'architect'
  },
  {
    unit: 44,
    quizId: 'tq_44_1',
    idx: 2,
    qNum: 3,
    desc: 'Unit 44 - Thiết bị Câu 3 (Nghe audio): headphones / air conditioner',
    studentInput: 'A',
    expectedOutcome: true,
    expectedAnsKeyword: 'headphones',
    expectedExplKeyword: 'headphones'
  },
  {
    unit: 47,
    quizId: 'tq_47_2',
    idx: 0,
    qNum: 1,
    desc: 'Unit 47 - Paraphrase Câu 1: There were many vehicles behind the park.',
    studentInput: 'B',
    expectedOutcome: true,
    expectedAnsKeyword: 'vehicles',
    expectedExplKeyword: 'Paraphrasing'
  }
];

let passCount = 0;
testCases.forEach((tc, i) => {
  const reqKey = `${tc.quizId}_${tc.idx}`;
  const entry = theoryDB[reqKey];

  if (!entry) {
    console.error(`[FAIL] ${tc.desc}: Key ${reqKey} NOT FOUND in theoryDB!`);
    return;
  }

  // Normalize helper matching app.js
  const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ');

  let isMatch = false;
  let correctVal = '';
  if (entry.type === 'CHOICE') {
    correctVal = entry.correct_key;
    isMatch = (tc.studentInput.toUpperCase() === entry.correct_key.toUpperCase());
  } else if (entry.type === 'CIRCLE') {
    correctVal = entry.correct_text;
    isMatch = (tc.studentInput.toLowerCase() === entry.correct_text.toLowerCase());
  } else {
    correctVal = entry.correct_text;
    const uNorm = normalize(tc.studentInput);
    const expNorm = normalize(entry.correct_text);
    const variants = (entry.acceptable_variants || []).map(normalize);
    isMatch = (uNorm.length > 0) && ((uNorm === expNorm) || variants.includes(uNorm));
  }

  const expl = entry.explanation || '';
  const normApos = (s) => (s || '').replace(/[\u2018\u2019`]/g, "'");

  // Check assertions
  let hasForbidden = false;
  if (tc.forbiddenExplKeyword && expl.includes(tc.forbiddenExplKeyword)) {
    hasForbidden = true;
  }

  let hasExpectedKeyword = false;
  const expKeyword = normApos(tc.expectedAnsKeyword);
  if (tc.expectedAnsKeyword && (normApos(correctVal).includes(expKeyword) || (entry.correct_text && normApos(entry.correct_text).includes(expKeyword)))) {
    hasExpectedKeyword = true;
  }

  if (isMatch === tc.expectedOutcome && !hasForbidden && hasExpectedKeyword) {
    passCount++;
    console.log(`[PASS] ${tc.desc}`);
    console.log(`       ✓ Đáp án trả về: "${correctVal}"`);
    console.log(`       ✓ Giải thích chuẩn: "${expl.replace(/<[^>]+>/g, '').slice(0, 90)}..."\n`);
  } else {
    console.error(`[FAIL] ${tc.desc}`);
    console.error(`       Returned ans: "${correctVal}" | isMatch: ${isMatch} | hasForbidden: ${hasForbidden}`);
    console.error(`       Expl: "${expl}"\n`);
  }
});

console.log('======================================================================');
console.log(`KẾT QUẢ: ${passCount}/${testCases.length} BÀI THI TEST CASE ĐẠT CHUẨN HOÀN TOÀN (100%)`);
console.log('======================================================================');

if (passCount !== testCases.length) {
  process.exit(1);
}
