// -*- coding: utf-8 -*-
const fs = require('fs');

const allUnits = JSON.parse(fs.readFileSync('data/all_units_data.json', 'utf8'));
const theoryDB = JSON.parse(fs.readFileSync('data/theory_quizzes_data.json', 'utf8'));

// Mock DOM
global.window = {};
global.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const appCode = fs.readFileSync('js/app.js', 'utf8');
eval(appCode);
const app = global.window.smobApp;

console.log('======================================================================');
console.log('KIỂM TOÁN TOÀN DIỆN 48 UNITS (100% CÂU HỎI TRÊN GIAO DIỆN)');
console.log('======================================================================');

let totalRenderedQuestions = 0;
let exactMatches = 0;
let missingInDB = 0;
let badExplanations = 0;

for (let uNum = 1; uNum <= 48; uNum++) {
  const u = allUnits[String(uNum)];
  if (!u) continue;

  const container = { innerHTML: '' };
  app._theoryQuizzes = {};
  app.renderStructuredTheory(u, container);

  for (const [quizId, qz] of Object.entries(app._theoryQuizzes)) {
    qz.questions.forEach((q, idx) => {
      totalRenderedQuestions++;
      const reqKey = `${quizId}_${idx}`;
      const stem = (q.stem || q.targetWord || '').trim();

      const entry = theoryDB[reqKey];
      if (!entry) {
        missingInDB++;
        console.error(`[MISSING] Unit ${uNum} ${reqKey}: "${stem.slice(0, 30)}"`);
      } else {
        // Check stem alignment
        const stemNorm = stem.toLowerCase().replace(/[^a-z0-9]/g, '');
        const dbStemNorm = (entry.stem || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        if (stemNorm.length > 5 && dbStemNorm.length > 5 && stemNorm !== dbStemNorm) {
          console.warn(`[STEM DIFF] Unit ${uNum} ${reqKey}:`);
          console.warn(`   UI: "${stem.slice(0, 40)}"`);
          console.warn(`   DB: "${entry.stem.slice(0, 40)}"`);
        } else {
          exactMatches++;
        }

        const expl = entry.explanation || '';
        if (expl.includes('{stem}') || expl.includes('$\\implies$') || expl.includes('**')) {
          badExplanations++;
          console.error(`[BAD FORMAT] Unit ${uNum} ${reqKey} explanation has raw tokens`);
        }
      }
    });
  }
}

console.log('----------------------------------------------------------------------');
console.log(`Tổng số câu hỏi được render bởi app.js: ${totalRenderedQuestions}`);
console.log(`Khớp chính xác 1:1 cả ID và Nội dung:   ${exactMatches} (${((exactMatches / totalRenderedQuestions) * 100).toFixed(2)}%)`);
console.log(`Thiếu trong DB:                         ${missingInDB}`);
console.log(`Giải thích chứa lỗi định dạng:          ${badExplanations}`);
console.log('======================================================================');

if (missingInDB > 0 || badExplanations > 0 || exactMatches !== totalRenderedQuestions) {
  console.error('KIỂM TOÁN THẤT BẠI!');
  process.exit(1);
} else {
  console.log('CHÚC MỪNG: 100% CÂU HỎI TRÊN CẢ 48 BÀI HỌC ĐẠT CHUẨN HOÀN HẢO!');
}
