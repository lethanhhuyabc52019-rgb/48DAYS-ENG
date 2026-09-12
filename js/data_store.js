// SMOB English Lab - Data Store & Local Storage Service
// Offline-first engine for all 48 Units
class DataStore {
  constructor() {
    this.units = [];
    this.allUnitsData = {};
    this.irregularVerbs = [];
    this.currentUnitId = 1;
    this.userProgress = this.loadUserProgress();
    this.mistakes = this.loadMistakes();
  }

  async initialize() {
    // 1. Load embedded offline bundle first (guaranteed 100% offline availability)
    if (window.SMOB_UNITS && window.SMOB_ALL_DATA) {
      this.units = window.SMOB_UNITS;
      this.allUnitsData = window.SMOB_ALL_DATA;
      this.irregularVerbs = window.SMOB_IRREGULAR_VERBS || [];
      return true;
    }

    // 2. Fallback to fetch if running on http server
    try {
      const unitsRes = await fetch('./data/units.json');
      this.units = await unitsRes.json();

      const allRes = await fetch('./data/all_units_data.json');
      this.allUnitsData = await allRes.json();

      const irvRes = await fetch('./data/irregular_verbs.json');
      this.irregularVerbs = await irvRes.json();
      return true;
    } catch (e) {
      console.warn('DataStore fetch fallback failed:', e);
      return false;
    }
  }

  getUnit(unitId) {
    const id = String(unitId);
    return this.allUnitsData[id] || this.allUnitsData[Number(unitId)] || null;
  }

  setCurrentUnit(unitId) {
    this.currentUnitId = Number(unitId);
    this.userProgress.lastStudiedUnit = this.currentUnitId;
    this.saveUserProgress();
  }

  getCurrentUnit() {
    return this.getUnit(this.currentUnitId) || this.getUnit(1);
  }

  // Combined Test Engine Generator
  // Strictly pulls questions ONLY from the specified unitIds
  generateCombinedTest(unitIds, difficulty = 'Normal', maxQuestions = 20) {
    if (!unitIds || unitIds.length === 0) {
      unitIds = [this.currentUnitId];
    }

    let pool = [];
    unitIds.forEach(uId => {
      const u = this.getUnit(uId);
      if (u && u.unit_test && u.unit_test.length > 0) {
        // Tag each question with its origin unit
        u.unit_test.forEach(q => {
          pool.push({
            ...q,
            origin_unit_id: u.unit_id,
            origin_unit_title: u.title
          });
        });
      }
    });

    if (pool.length === 0) return [];

    // Filter by difficulty if applicable
    if (difficulty === 'Easy') {
      // Prioritize multiple choice questions with 2-3 options
      pool.sort((a, b) => (a.options ? a.options.length : 99) - (b.options ? b.options.length : 99));
    } else if (difficulty === 'Hard') {
      // Prioritize fill-in-the-blank & sentence rewriting
      pool.sort((a, b) => (a.type === 'SENTENCE_REWRITE' || a.type === 'FILL_BLANK' ? -1 : 1));
    } else {
      // Normal / Random: Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    return pool.slice(0, Math.min(maxQuestions, pool.length));
  }

  loadUserProgress() {
    const raw = localStorage.getItem('smob_user_progress');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      streakDays: 5,
      lastStudiedUnit: 1,
      completedUnits: [1],
      vocabKnown: {}, // { "u01_v01": true }
      vocabReview: {}, // { "u01_v02": true }
      testScores: {
        "unit_1": { score: 95, correct: 19, total: 20, date: new Date().toISOString() }
      }
    };
  }

  saveUserProgress() {
    localStorage.setItem('smob_user_progress', JSON.stringify(this.userProgress));
  }

  loadMistakes() {
    const raw = localStorage.getItem('smob_mistakes_log');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  }

  saveMistake(exercise, userAnswer) {
    const existing = this.mistakes.find(m => m.exerciseId === exercise.id);
    if (existing) {
      existing.wrongCount++;
      existing.lastWrongAt = new Date().toISOString();
      existing.userAnswer = userAnswer;
    } else {
      this.mistakes.push({
        exerciseId: exercise.id,
        unitId: exercise.origin_unit_id || exercise.unit_id || this.currentUnitId,
        stem: exercise.stem,
        userAnswer: userAnswer,
        correctAnswer: exercise.correct_answer,
        explanation: exercise.explanation,
        sourcePage: exercise.source_page,
        wrongCount: 1,
        lastWrongAt: new Date().toISOString()
      });
    }
    localStorage.setItem('smob_mistakes_log', JSON.stringify(this.mistakes));
  }

  markVocabKnown(vocabId) {
    this.userProgress.vocabKnown[vocabId] = true;
    delete this.userProgress.vocabReview[vocabId];
    this.saveUserProgress();
  }

  markVocabReview(vocabId) {
    this.userProgress.vocabReview[vocabId] = true;
    delete this.userProgress.vocabKnown[vocabId];
    this.saveUserProgress();
  }

  saveTestResult(unitId, score, correct, total) {
    const uid = Number(unitId);
    this.userProgress.testScores[`unit_${uid}`] = {
      score: score,
      correct: correct,
      total: total,
      date: new Date().toISOString()
    };
    if (!this.userProgress.completedUnits.includes(uid)) {
      this.userProgress.completedUnits.push(uid);
    }
    this.saveUserProgress();
  }

  saveProgress(unitId, scorePercent) {
    const uid = Number(unitId);
    if (!this.userProgress.testScores) {
      this.userProgress.testScores = {};
    }
    const current = this.userProgress.testScores[`unit_${uid}`];
    this.userProgress.testScores[`unit_${uid}`] = {
      score: scorePercent,
      correct: current?.correct || 0,
      total: current?.total || 0,
      date: new Date().toISOString()
    };
    if (scorePercent >= 60 && !this.userProgress.completedUnits.includes(uid)) {
      this.userProgress.completedUnits.push(uid);
    }
    this.saveUserProgress();
  }

  recordMistake(unitId, questionId, stem, userAnswer, correctAnswer, explanation) {
    const uid = Number(unitId) || this.currentUnitId;
    const existing = this.mistakes.find(m => m.exerciseId === questionId);
    if (existing) {
      existing.wrongCount = (existing.wrongCount || 1) + 1;
      existing.lastWrongAt = new Date().toISOString();
      existing.userAnswer = userAnswer || '(Chưa làm)';
      existing.unitId = uid;
      if (stem) existing.stem = stem;
      if (correctAnswer) existing.correctAnswer = correctAnswer;
      if (explanation) existing.explanation = explanation;
    } else {
      this.mistakes.push({
        exerciseId: questionId,
        unitId: uid,
        stem: stem,
        userAnswer: userAnswer || '(Chưa làm)',
        correctAnswer: correctAnswer,
        explanation: explanation,
        wrongCount: 1,
        lastWrongAt: new Date().toISOString()
      });
    }
    localStorage.setItem('smob_mistakes_log', JSON.stringify(this.mistakes));
  }
}

window.dataStore = new DataStore();
