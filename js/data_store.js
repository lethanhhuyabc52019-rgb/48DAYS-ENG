// SMOB English Lab - Data Store & Local Storage Service
// Offline-first engine for all 48 Units + History & Diligence Analytics Engine

class DataStore {
  constructor() {
    this.units = [];
    this.allUnitsData = {};
    this.irregularVerbs = [];
    this.currentUnitId = 1;
    this.userProgress = this.loadUserProgress();
    this.mistakes = this.loadMistakes();
    this.examHistory = this.loadExamHistory();
    this.vocabQuizHistory = this.loadVocabQuizHistory();
    this.irregularQuizHistory = this.loadIrregularQuizHistory();
    this.engagement = this.loadEngagement();
    
    // Check & update daily streak on init
    this.updateDailyStreak();
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

  // Helper for formatting date & time in Vietnamese standard
  formatTimestamp(dateObj = new Date()) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    const pad = n => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return {
      iso: d.toISOString(),
      dateStr: `${day}/${month}/${year}`,
      timeStr: `${hours}:${minutes}:${seconds}`,
      shortTime: `${hours}:${minutes}`,
      fullFormatted: `${hours}:${minutes}:${seconds} • ${day}/${month}/${year}`,
      dayMonth: `${day}/${month}`,
      ymd: `${year}-${month}-${day}`
    };
  }

  // ==========================================
  // 1. EXAM HISTORY (48 UNITS ONLINE TESTS)
  // ==========================================
  notifySync() {
    if (window.smobCloudSync && typeof window.smobCloudSync.autoSyncIfEnabled === 'function') {
      clearTimeout(this._syncDebounce);
      this._syncDebounce = setTimeout(() => {
        window.smobCloudSync.autoSyncIfEnabled();
      }, 1200);
    }
  }

  loadExamHistory() {
    const raw = localStorage.getItem('smob_exam_history');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  }

  saveExamHistory() {
    localStorage.setItem('smob_exam_history', JSON.stringify(this.examHistory));
    this.notifySync();
  }

  saveExamAttempt(unitId, attemptData) {
    const now = new Date();
    const timeInfo = this.formatTimestamp(now);
    const uid = Number(unitId);
    const unit = this.getUnit(uid) || {};

    const attempt = {
      attemptId: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      unitId: uid,
      unitTitle: unit.title || `Unit ${uid}`,
      timestamp: timeInfo.iso,
      dateFormatted: timeInfo.dateStr,
      timeFormatted: timeInfo.timeStr,
      displayTime: timeInfo.fullFormatted,
      scorePercent: Number(attemptData.scorePercent) || 0,
      correctCount: Number(attemptData.correctCount) || 0,
      totalCount: Number(attemptData.totalCount) || 0,
      durationSeconds: Number(attemptData.durationSeconds) || 0,
      durationFormatted: attemptData.durationFormatted || '00:00',
      userAnswers: attemptData.userAnswers || {},
      gradedResults: attemptData.gradedResults || []
    };

    // Prepend to history (newest first)
    this.examHistory.unshift(attempt);
    if (this.examHistory.length > 200) {
      this.examHistory = this.examHistory.slice(0, 200); // keep last 200 attempts
    }
    this.saveExamHistory();

    // Update userProgress high score / last score for this unit
    this.saveTestResult(uid, attempt.scorePercent, attempt.correctCount, attempt.totalCount);

    // Record engagement
    this.recordEngagement('exam_submit', 1);
    this.recordEngagement('typing', attempt.correctCount + Math.floor((attempt.totalCount - attempt.correctCount) / 2));

    return attempt;
  }

  getExamHistory(unitId = null) {
    if (unitId === null || unitId === undefined || unitId === 'all') {
      return this.examHistory;
    }
    const uid = Number(unitId);
    return this.examHistory.filter(a => a.unitId === uid);
  }

  getExamAttempt(attemptId) {
    return this.examHistory.find(a => a.attemptId === attemptId) || null;
  }

  clearExamHistory() {
    this.examHistory = [];
    this.saveExamHistory();
  }

  // ==========================================
  // 2. VOCABULARY QUIZ HISTORY
  // ==========================================
  loadVocabQuizHistory() {
    const raw = localStorage.getItem('smob_vocab_quiz_history');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  }

  saveVocabQuizHistory() {
    localStorage.setItem('smob_vocab_quiz_history', JSON.stringify(this.vocabQuizHistory));
    this.notifySync();
  }

  saveVocabQuizAttempt(unitId, data) {
    const timeInfo = this.formatTimestamp(new Date());
    const uid = Number(unitId);
    const unit = this.getUnit(uid) || {};

    const attempt = {
      attemptId: `v_att_${Date.now()}`,
      unitId: uid,
      unitTitle: unit.title || `Unit ${uid}`,
      timestamp: timeInfo.iso,
      displayTime: timeInfo.fullFormatted,
      dateFormatted: timeInfo.dateStr,
      timeFormatted: timeInfo.timeStr,
      scorePercent: Number(data.scorePercent) || 0,
      masteredCount: Number(data.masteredCount) || 0,
      reviewCount: Number(data.reviewCount) || 0,
      totalCount: Number(data.totalCount) || 0
    };

    this.vocabQuizHistory.unshift(attempt);
    if (this.vocabQuizHistory.length > 100) this.vocabQuizHistory = this.vocabQuizHistory.slice(0, 100);
    this.saveVocabQuizHistory();

    this.recordEngagement('quiz_submit', 1);
    return attempt;
  }

  getVocabQuizHistory(unitId = null) {
    if (!unitId || unitId === 'all') return this.vocabQuizHistory;
    return this.vocabQuizHistory.filter(v => v.unitId === Number(unitId));
  }

  // ==========================================
  // 3. IRREGULAR VERBS QUIZ HISTORY
  // ==========================================
  loadIrregularQuizHistory() {
    const raw = localStorage.getItem('smob_irregular_quiz_history');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [];
  }

  saveIrregularQuizHistory() {
    localStorage.setItem('smob_irregular_quiz_history', JSON.stringify(this.irregularQuizHistory));
    this.notifySync();
  }

  saveIrregularQuizAttempt(data) {
    const timeInfo = this.formatTimestamp(new Date());

    const attempt = {
      attemptId: `irv_att_${Date.now()}`,
      timestamp: timeInfo.iso,
      displayTime: timeInfo.fullFormatted,
      dateFormatted: timeInfo.dateStr,
      timeFormatted: timeInfo.timeStr,
      scorePercent: Number(data.scorePercent) || 0,
      correctCount: Number(data.correctCount) || 0,
      wrongCount: Number(data.wrongCount) || 0,
      totalCount: Number(data.totalCount) || 0,
      wrongVerbs: data.wrongVerbs || [], // [{ v1, v2, v3, userAns }]
      correctVerbs: data.correctVerbs || []
    };

    this.irregularQuizHistory.unshift(attempt);
    if (this.irregularQuizHistory.length > 100) this.irregularQuizHistory = this.irregularQuizHistory.slice(0, 100);
    this.saveIrregularQuizHistory();

    this.recordEngagement('quiz_submit', 1);
    return attempt;
  }

  getIrregularQuizHistory() {
    return this.irregularQuizHistory;
  }

  // Get most frequently mistaken irregular verbs
  getWeakIrregularVerbs(limit = 15) {
    const freq = {};
    this.irregularQuizHistory.forEach(att => {
      (att.wrongVerbs || []).forEach(v => {
        const key = typeof v === 'string' ? v : (v.v1 || JSON.stringify(v));
        freq[key] = (freq[key] || 0) + 1;
      });
    });

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, limit).map(([verb, count]) => ({ verb, count }));
  }

  // ==========================================
  // 4. ENGAGEMENT & DILIGENCE TRACKER
  // ==========================================
  loadEngagement() {
    const raw = localStorage.getItem('smob_engagement_tracker');
    let data = null;
    if (raw) {
      try { data = JSON.parse(raw); } catch (e) {}
    }
    if (!data) {
      data = {
        activeMinutesTotal: 15,
        totalTypingCount: 0,
        flashcardFlips: 0,
        aiSpeechCount: 0,
        examSubmits: 0,
        quizSubmits: 0,
        dailyStreak: 1,
        lastActiveDate: '',
        studyDays: {} // { "2026-09-13": { minutes: 15, actions: 10 } }
      };
    }
    if (!data.studyDays) data.studyDays = {};
    return data;
  }

  saveEngagement() {
    localStorage.setItem('smob_engagement_tracker', JSON.stringify(this.engagement));
  }

  recordEngagement(actionType, count = 1) {
    const timeInfo = this.formatTimestamp(new Date());
    const ymd = timeInfo.ymd;

    if (!this.engagement.studyDays[ymd]) {
      this.engagement.studyDays[ymd] = { minutes: 1, actions: 0, date: ymd };
    }
    this.engagement.studyDays[ymd].actions += count;

    if (actionType === 'typing') this.engagement.totalTypingCount += count;
    else if (actionType === 'flip') this.engagement.flashcardFlips += count;
    else if (actionType === 'speech') this.engagement.aiSpeechCount += count;
    else if (actionType === 'exam_submit') this.engagement.examSubmits += count;
    else if (actionType === 'quiz_submit') this.engagement.quizSubmits += count;

    this.saveEngagement();
  }

  addActiveMinutes(minutes = 1) {
    const timeInfo = this.formatTimestamp(new Date());
    const ymd = timeInfo.ymd;

    this.engagement.activeMinutesTotal = (this.engagement.activeMinutesTotal || 0) + minutes;
    if (!this.engagement.studyDays[ymd]) {
      this.engagement.studyDays[ymd] = { minutes: 0, actions: 1, date: ymd };
    }
    this.engagement.studyDays[ymd].minutes += minutes;
    this.saveEngagement();
  }

  updateDailyStreak() {
    const todayYmd = this.formatTimestamp(new Date()).ymd;
    const lastDate = this.engagement.lastActiveDate;

    if (!lastDate) {
      this.engagement.dailyStreak = 1;
      this.engagement.lastActiveDate = todayYmd;
      this.saveEngagement();
      return;
    }

    if (lastDate === todayYmd) {
      // Already recorded today
      return;
    }

    const today = new Date();
    const last = new Date(lastDate);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.engagement.dailyStreak = (this.engagement.dailyStreak || 0) + 1;
    } else if (diffDays > 1) {
      this.engagement.dailyStreak = 1; // Streak reset
    }

    this.engagement.lastActiveDate = todayYmd;
    this.saveEngagement();
  }

  // ==========================================
  // 5. COMPREHENSIVE PERFORMANCE & AI FEEDBACK
  // ==========================================
  getPerformanceAnalytics() {
    const totalUnits = 48;
    const testScores = this.userProgress.testScores || {};
    const testedUnits = Object.keys(testScores);
    const testedCount = testedUnits.length;
    
    // Average score
    let totalScoreSum = 0;
    let passedCount = 0; // score >= 80%
    let perfectCount = 0; // score === 100%

    testedUnits.forEach(uKey => {
      const item = testScores[uKey];
      const sc = Number(item.score) || 0;
      totalScoreSum += sc;
      if (sc >= 80) passedCount++;
      if (sc === 100) perfectCount++;
    });

    const avgScore = testedCount > 0 ? Math.round(totalScoreSum / testedCount) : 0;
    const curriculumProgress = Math.round((testedCount / totalUnits) * 100);

    // 1. Diligence Score (0-100)
    // Based on streak, active days, study minutes
    const streak = this.engagement.dailyStreak || 1;
    const totalMins = this.engagement.activeMinutesTotal || 0;
    const studyDaysCount = Object.keys(this.engagement.studyDays || {}).length;
    
    let diligenceScore = Math.min(100, Math.round(
      (Math.min(streak, 14) / 14) * 35 +
      (Math.min(totalMins, 300) / 300) * 35 +
      (Math.min(studyDaysCount, 10) / 10) * 30
    ));

    // 2. Engagement Score (0-100)
    // Based on typing count, flashcard flips, speech AI
    const typing = this.engagement.totalTypingCount || 0;
    const flips = this.engagement.flashcardFlips || 0;
    const speech = this.engagement.aiSpeechCount || 0;
    const exams = this.examHistory.length;

    let engagementScore = Math.min(100, Math.round(
      (Math.min(typing, 200) / 200) * 40 +
      (Math.min(flips, 150) / 150) * 30 +
      (Math.min(speech, 50) / 50) * 15 +
      (Math.min(exams, 20) / 20) * 15
    ));

    // 3. Mastery Score (0-100)
    let masteryScore = Math.round((avgScore * 0.6) + (curriculumProgress * 0.4));

    // Tier badge calculation
    let badge = {
      id: 'beginner',
      title: 'Tập Sự Tích Cực',
      icon: '🌱',
      color: '#10b981',
      desc: 'Đang bắt đầu hành trình xây dựng nền tảng tiếng Anh 48 ngày vững chắc.'
    };

    const overallScore = Math.round((masteryScore + diligenceScore + engagementScore) / 3);

    if (overallScore >= 85 || (passedCount >= 20 && streak >= 7)) {
      badge = {
        id: 'master',
        title: 'Bậc Thầy Kỷ Luật',
        icon: '👑',
        color: '#f59e0b',
        desc: 'Hiệu suất học tập vượt bậc, làm bài chuẩn xác và duy trì phong độ đỉnh cao!'
      };
    } else if (overallScore >= 65 || (passedCount >= 10 && streak >= 4)) {
      badge = {
        id: 'hardcore',
        title: 'Chiến Binh Bứt Phá',
        icon: '🔥',
        color: '#ef4444',
        desc: 'Chăm chỉ thao tác thực hành, làm bài thi đạt chuẩn và giữ vững chuỗi ngày học.'
      };
    } else if (overallScore >= 40 || testedCount >= 3) {
      badge = {
        id: 'diligent',
        title: 'Học Viên Chăm Chỉ',
        icon: '⭐',
        color: '#3b82f6',
        desc: 'Đang rèn luyện đều đặn và có tiến bộ rõ rệt qua từng bài thi.'
      };
    }

    // AI Feedback Text
    let aiFeedback = '';
    if (streak >= 5 && avgScore >= 80) {
      aiFeedback = `🔥 Phong độ xuất sắc! Bạn đã duy trì chuỗi học ${streak} ngày liên tiếp với điểm thi trung bình rất cao (${avgScore}%). Hãy tiếp tục phát huy ở các Unit tiếp theo nhé!`;
    } else if (avgScore >= 80) {
      aiFeedback = `🎯 Khả năng nắm vững ngữ pháp của bạn rất tốt (Điểm trung bình ${avgScore}%). Hãy vào học đều đặn mỗi ngày 15 phút để tăng chuỗi ngày liên tục nhé!`;
    } else if (testedCount > 0 && avgScore < 70) {
      aiFeedback = `💡 Điểm trung bình hiện tại là ${avgScore}%. Bạn nên mở phần Lý Thuyết & làm lại (Retake) các bài thi Unit điểm thấp để củng cố nền tảng thật chắc!`;
    } else {
      aiFeedback = `🚀 Chào mừng bạn! Hãy hoàn thành bài thi online Unit 1 & Unit 2 để hệ thống đo lường hiệu suất và đánh giá năng lực học tập của bạn nhé!`;
    }

    // Weekly 7-day activity map
    const weeklyActivity = [];
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ymd = this.formatTimestamp(d).ymd;
      const dayData = this.engagement.studyDays[ymd] || { minutes: 0, actions: 0 };
      weeklyActivity.push({
        dayName: daysOfWeek[d.getDay()],
        dateStr: `${d.getDate()}/${d.getMonth()+1}`,
        minutes: dayData.minutes,
        actions: dayData.actions,
        isToday: i === 0
      });
    }

    return {
      totalUnits,
      testedCount,
      passedCount,
      perfectCount,
      avgScore,
      curriculumProgress,
      diligenceScore,
      engagementScore,
      masteryScore,
      overallScore,
      streak,
      totalMins,
      totalTypingCount: typing,
      flashcardFlips: flips,
      aiSpeechCount: speech,
      examCount: exams,
      badge,
      aiFeedback,
      weeklyActivity
    };
  }

  // Legacy user progress methods
  loadUserProgress() {
    const raw = localStorage.getItem('smob_user_progress');
    let data = null;
    if (raw) {
      try { data = JSON.parse(raw); } catch (e) {}
    }
    if (!data) {
      data = {
        streakDays: 1,
        lastStudiedUnit: 1,
        completedUnits: [],
        vocabKnown: {},
        vocabReview: {},
        testScores: {}
      };
    }
    if (!data.starredVocab) data.starredVocab = {};
    if (!data.vocabNotes) data.vocabNotes = {};
    if (!data.starredIrregular) data.starredIrregular = {};
    if (!data.irregularNotes) data.irregularNotes = {};
    if (!data.testScores) data.testScores = {};
    if (!data.completedUnits) data.completedUnits = [];
    return data;
  }

  saveUserProgress() {
    localStorage.setItem('smob_user_progress', JSON.stringify(this.userProgress));
    this.notifySync();
  }

  saveTestResult(unitId, score, correct, total) {
    const uid = Number(unitId);
    if (!this.userProgress.testScores) this.userProgress.testScores = {};
    
    this.userProgress.testScores[`unit_${uid}`] = {
      score: score,
      correct: correct,
      total: total,
      date: new Date().toISOString()
    };

    if (score >= 70 && !this.userProgress.completedUnits.includes(uid)) {
      this.userProgress.completedUnits.push(uid);
    }
    this.saveUserProgress();
  }

  // Star & Note Management for Irregular Verbs
  toggleStarredIrregular(v1) {
    if (!this.userProgress.starredIrregular) this.userProgress.starredIrregular = {};
    const key = String(v1).toLowerCase().trim();
    if (this.userProgress.starredIrregular[key]) {
      delete this.userProgress.starredIrregular[key];
      this.saveUserProgress();
      return false;
    } else {
      this.userProgress.starredIrregular[key] = true;
      this.saveUserProgress();
      return true;
    }
  }

  isIrregularStarred(v1) {
    if (!this.userProgress.starredIrregular) return false;
    const key = String(v1).toLowerCase().trim();
    return !!this.userProgress.starredIrregular[key];
  }

  getStarredIrregularCount() {
    if (!this.userProgress.starredIrregular) return 0;
    return Object.keys(this.userProgress.starredIrregular).length;
  }

  saveIrregularNote(v1, note) {
    if (!this.userProgress.irregularNotes) this.userProgress.irregularNotes = {};
    const key = String(v1).toLowerCase().trim();
    if (!note || !note.trim()) {
      delete this.userProgress.irregularNotes[key];
    } else {
      this.userProgress.irregularNotes[key] = note.trim();
    }
    this.saveUserProgress();
  }

  getIrregularNote(v1) {
    if (!this.userProgress.irregularNotes) return '';
    const key = String(v1).toLowerCase().trim();
    return this.userProgress.irregularNotes[key] || '';
  }

  // Star & Note Management for Flashcards (Vocabulary)
  toggleStarredVocab(vocabKey) {
    if (!this.userProgress.starredVocab) this.userProgress.starredVocab = {};
    const key = String(vocabKey).toLowerCase().trim();
    if (this.userProgress.starredVocab[key]) {
      delete this.userProgress.starredVocab[key];
      this.saveUserProgress();
      return false;
    } else {
      this.userProgress.starredVocab[key] = true;
      this.saveUserProgress();
      return true;
    }
  }

  isVocabStarred(vocabKey) {
    if (!this.userProgress.starredVocab) return false;
    const key = String(vocabKey).toLowerCase().trim();
    return !!this.userProgress.starredVocab[key];
  }

  saveVocabNote(vocabKey, note) {
    if (!this.userProgress.vocabNotes) this.userProgress.vocabNotes = {};
    const key = String(vocabKey).toLowerCase().trim();
    if (!note || !note.trim()) {
      delete this.userProgress.vocabNotes[key];
    } else {
      this.userProgress.vocabNotes[key] = note.trim();
    }
    this.saveUserProgress();
  }

  getVocabNote(vocabKey) {
    if (!this.userProgress.vocabNotes) return '';
    const key = String(vocabKey).toLowerCase().trim();
    return this.userProgress.vocabNotes[key] || '';
  }

  loadMistakes() {
    const raw = localStorage.getItem('smob_mistakes_log');
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          // Normalize categories for legacy records
          arr.forEach(m => {
            if (!m.category) {
              const exId = String(m.exerciseId || '').toLowerCase();
              const stem = String(m.stem || '').toLowerCase();
              if (exId.startsWith('qz_') || exId.startsWith('vocab_') || stem.includes('nghĩa của từ') || stem.includes('quizlet')) {
                m.category = 'vocab_quizlet';
              } else if (exId.startsWith('gm_') || exId.startsWith('grammar_') || stem.includes('tính từ') || stem.includes('danh từ') || stem.includes('động từ') || stem.includes('trạng từ') || stem.includes('sắp xếp') || stem.includes('từ loại') || stem.includes('thì ')) {
                m.category = 'grammar_theory';
              } else {
                m.category = 'test_unit';
              }
            }
          });
          return arr;
        }
      } catch (e) {}
    }
    return [];
  }

  markVocabKnown(vocabId) {
    this.userProgress.vocabKnown[vocabId] = true;
    delete this.userProgress.vocabReview[vocabId];
    this.saveUserProgress();
    this.recordEngagement('flip', 1);
  }

  markVocabReview(vocabId) {
    this.userProgress.vocabReview[vocabId] = true;
    delete this.userProgress.vocabKnown[vocabId];
    this.saveUserProgress();
    this.recordEngagement('flip', 1);
  }

  recordMistake(unitId, questionId, stem, userAnswer, correctAnswer, explanation, category = 'test_unit') {
    const uid = Number(unitId) || this.currentUnitId;
    const existing = this.mistakes.find(m => m.exerciseId === questionId);
    if (existing) {
      existing.wrongCount = (existing.wrongCount || 1) + 1;
      existing.lastWrongAt = new Date().toISOString();
      existing.userAnswer = userAnswer || '(Chưa làm)';
      existing.unitId = uid;
      if (category) existing.category = category;
      if (stem) existing.stem = stem;
      if (correctAnswer) existing.correctAnswer = correctAnswer;
      if (explanation) existing.explanation = explanation;
    } else {
      this.mistakes.push({
        exerciseId: questionId,
        unitId: uid,
        category: category || 'test_unit', // 'vocab_quizlet' | 'grammar_theory' | 'test_unit'
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

  getMistakeStats() {
    const stats = {
      total: this.mistakes.length,
      vocab_quizlet: 0,
      grammar_theory: 0,
      test_unit: 0,
      unitsWithMistakes: []
    };

    const unitSet = new Set();
    this.mistakes.forEach(m => {
      const cat = m.category || 'test_unit';
      if (stats[cat] !== undefined) {
        stats[cat]++;
      } else {
        stats.test_unit++;
      }
      if (m.unitId) unitSet.add(Number(m.unitId));
    });

    stats.unitsWithMistakes = Array.from(unitSet).sort((a, b) => a - b);
    return stats;
  }

  getFilteredMistakes(category = 'all', unitId = 'all') {
    return this.mistakes.filter(m => {
      const matchCat = (category === 'all') || (m.category === category);
      const matchUnit = (unitId === 'all') || (Number(m.unitId) === Number(unitId));
      return matchCat && matchUnit;
    });
  }

  // ==========================================
  // 5. DATA EXPORT & MERGE (CLOUD / OFFLINE SYNC)
  // ==========================================
  getAllExportData() {
    return {
      version: 1,
      app: 'SMOB English Lab',
      exportedAt: new Date().toISOString(),
      userProgress: this.userProgress,
      mistakes: this.mistakes,
      examHistory: this.examHistory,
      vocabQuizHistory: this.vocabQuizHistory,
      irregularQuizHistory: this.irregularQuizHistory,
      engagement: this.engagement
    };
  }

  mergeExternalData(incoming) {
    if (!incoming || typeof incoming !== 'object') return false;

    // 1. Merge userProgress
    if (incoming.userProgress) {
      const inc = incoming.userProgress;
      const combinedUnits = new Set([...(this.userProgress.completedUnits || []), ...(inc.completedUnits || [])]);
      this.userProgress.completedUnits = Array.from(combinedUnits).sort((a, b) => a - b);

      this.userProgress.testScores = this.userProgress.testScores || {};
      if (inc.testScores) {
        Object.entries(inc.testScores).forEach(([k, incScoreObj]) => {
          const cur = this.userProgress.testScores[k];
          if (!cur || (Number(incScoreObj.score) > Number(cur.score))) {
            this.userProgress.testScores[k] = incScoreObj;
          }
        });
      }

      this.userProgress.starredVocab = { ...(this.userProgress.starredVocab || {}), ...(inc.starredVocab || {}) };
      this.userProgress.vocabNotes = { ...(this.userProgress.vocabNotes || {}), ...(inc.vocabNotes || {}) };
      this.userProgress.starredIrregular = { ...(this.userProgress.starredIrregular || {}), ...(inc.starredIrregular || {}) };
      this.userProgress.irregularNotes = { ...(this.userProgress.irregularNotes || {}), ...(inc.irregularNotes || {}) };

      if (inc.lastStudiedUnit && inc.lastStudiedUnit > (this.userProgress.lastStudiedUnit || 1)) {
        this.userProgress.lastStudiedUnit = inc.lastStudiedUnit;
      }
      this.saveUserProgress();
    }

    // 2. Merge examHistory (deduplicate by attemptId or timestamp)
    if (Array.isArray(incoming.examHistory)) {
      const existingIds = new Set(this.examHistory.map(a => a.attemptId || a.timestamp));
      incoming.examHistory.forEach(att => {
        const id = att.attemptId || att.timestamp;
        if (!existingIds.has(id)) {
          this.examHistory.push(att);
          existingIds.add(id);
        }
      });
      this.examHistory.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      if (this.examHistory.length > 200) this.examHistory = this.examHistory.slice(0, 200);
      this.saveExamHistory();
    }

    // 3. Merge vocabQuizHistory
    if (Array.isArray(incoming.vocabQuizHistory)) {
      const existingIds = new Set(this.vocabQuizHistory.map(a => a.attemptId || a.timestamp));
      incoming.vocabQuizHistory.forEach(att => {
        const id = att.attemptId || att.timestamp;
        if (!existingIds.has(id)) {
          this.vocabQuizHistory.push(att);
          existingIds.add(id);
        }
      });
      this.vocabQuizHistory.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      if (this.vocabQuizHistory.length > 100) this.vocabQuizHistory = this.vocabQuizHistory.slice(0, 100);
      this.saveVocabQuizHistory();
    }

    // 4. Merge irregularQuizHistory
    if (Array.isArray(incoming.irregularQuizHistory)) {
      const existingIds = new Set(this.irregularQuizHistory.map(a => a.attemptId || a.timestamp));
      incoming.irregularQuizHistory.forEach(att => {
        const id = att.attemptId || att.timestamp;
        if (!existingIds.has(id)) {
          this.irregularQuizHistory.push(att);
          existingIds.add(id);
        }
      });
      this.irregularQuizHistory.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      if (this.irregularQuizHistory.length > 100) this.irregularQuizHistory = this.irregularQuizHistory.slice(0, 100);
      this.saveIrregularQuizHistory();
    }

    // 5. Merge mistakes
    if (Array.isArray(incoming.mistakes)) {
      const makeKey = m => `${m.category || 'test'}_${m.unitId || 0}_${m.stem || ''}`;
      const existingKeys = new Set(this.mistakes.map(makeKey));
      incoming.mistakes.forEach(m => {
        const key = makeKey(m);
        if (!existingKeys.has(key)) {
          this.mistakes.push(m);
          existingKeys.add(key);
        }
      });
      localStorage.setItem('smob_mistakes_log', JSON.stringify(this.mistakes));
    }

    // 6. Merge engagement & streak
    if (incoming.engagement && typeof incoming.engagement === 'object') {
      const incEng = incoming.engagement;
      this.engagement.totalTypingCount = Math.max(this.engagement.totalTypingCount || 0, incEng.totalTypingCount || 0);
      this.engagement.flashcardFlips = Math.max(this.engagement.flashcardFlips || 0, incEng.flashcardFlips || 0);
      this.engagement.aiSpeechCount = Math.max(this.engagement.aiSpeechCount || 0, incEng.aiSpeechCount || 0);
      this.engagement.activeMinutesTotal = Math.max(this.engagement.activeMinutesTotal || 0, incEng.activeMinutesTotal || 0);
      this.engagement.dailyStreak = Math.max(this.engagement.dailyStreak || 1, incEng.dailyStreak || 1);

      if (incEng.studyDays) {
        this.engagement.studyDays = this.engagement.studyDays || {};
        Object.entries(incEng.studyDays).forEach(([ymd, dayObj]) => {
          if (!this.engagement.studyDays[ymd]) {
            this.engagement.studyDays[ymd] = dayObj;
          } else {
            this.engagement.studyDays[ymd].minutes = Math.max(this.engagement.studyDays[ymd].minutes, dayObj.minutes || 0);
            this.engagement.studyDays[ymd].actions = Math.max(this.engagement.studyDays[ymd].actions, dayObj.actions || 0);
          }
        });
      }
      this.saveEngagement();
    }

    this.updateDailyStreak();
    return true;
  }
}

window.dataStore = new DataStore();

