import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

print("Original app.js length:", len(code))

# 1. Update navigate() meta map to include analytics
old_meta = """      'mistakes': ['Sổ Tay Câu Sai & Khắc Phục', 'Ôn tập và luyện thi lại riêng các câu bạn đã từng trả lời chưa chính xác'],
      'settings': ['Cài Đặt', 'Tùy chỉnh chế độ giao diện, tốc độ phát âm và quản lý dữ liệu học tập offline']"""

new_meta = """      'mistakes': ['Sổ Tay Câu Sai & Khắc Phục', 'Ôn tập và luyện thi lại riêng các câu bạn đã từng trả lời chưa chính xác'],
      'analytics': ['Trung Tâm Hiệu Suất Học Tập & Lịch Sử Kiểm Tra', 'Theo dõi tiến độ, đo lường độ chăm chỉ và xem lại nhật ký các bài thi có ngày giờ chi tiết'],
      'settings': ['Cài Đặt', 'Tùy chỉnh chế độ giao diện, tốc độ phát âm và quản lý dữ liệu học tập offline']"""

if old_meta in code:
    code = code.replace(old_meta, new_meta, 1)
    print("✓ Updated navigate meta map")

# 2. Add trigger for analytics view in navigate()
old_view_triggers = """    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'mistakes') this.renderMistakes();"""

new_view_triggers = """    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'mistakes') this.renderMistakes();
    if (viewId === 'analytics') this.renderAnalyticsView();"""

if old_view_triggers in code:
    code = code.replace(old_view_triggers, new_view_triggers, 1)
    print("✓ Added renderAnalyticsView trigger in navigate")

# 3. Enhance question card rendering in renderPdfOnlineExam
# Search for question card construction
old_stem_render = """                <div class="pdf-exam-q-stem-body">
                  ${formattedStem}
                </div>"""

new_stem_render = """                ${q.image_url ? `
                  <div class="exam-q-visual-wrapper">
                    <img src="${q.image_url}" alt="Minh họa bài tập" class="exam-q-illustration" onclick="window.smobApp.zoomImage(this.src)" title="Bấm để phóng to ảnh" />
                  </div>
                ` : ''}

                <div class="pdf-exam-q-stem-body">
                  ${formattedStem}
                </div>"""

if old_stem_render in code:
    code = code.replace(old_stem_render, new_stem_render, 1)
    print("✓ Added image_url rendering to question cards")

# 4. Enhance interactive input for IMAGE_FILL, INLINE_FILL, SENTENCE_REWRITE
old_input_render = """            if (q.options && q.options.length > 0) {
              secHtml += `<div class="answers-grid" style="grid-template-columns: 1fr; gap: 8px; margin-top: 14px;">`;
              q.options.forEach((opt, oIdx) => {
                const defaultLetter = String.fromCharCode(65 + oIdx);
                let letter = defaultLetter;
                let optText = opt;

                const matchPrefix = opt.match(/^([A-D])[\.\)]\s*(.*)/i);
                if (matchPrefix) {
                  letter = matchPrefix[1].toUpperCase();
                  optText = matchPrefix[2];
                } else if (opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D') {
                  letter = opt;
                  optText = `Vị trí (${opt})`;
                }

                secHtml += `
                  <div class="answer-option-card" id="pdf-opt-${q.id}-${oIdx}" onclick="window.smobApp.setPdfQuestionAnswer('${q.id}', '${opt.replace(/'/g, "\\'")}', ${oIdx})">
                    <div class="option-key">${letter}</div>
                    <div class="option-text">${optText}</div>
                  </div>
                `;
              });
              secHtml += `</div>`;
            } else {
              // Fill-in-the-blank or sentence rewrite input
              const userAns = this.userPdfAnswers[q.id] || '';
              const blankLabel = q.blank_no ? `vị trí (${q.blank_no})` : `câu hỏi`;
              secHtml += `
                <div class="exam-fill-blank-card" id="pdf-fill-${q.id}" style="margin-top: 14px;">
                  <div class="exam-fill-prompt-row">
                    <div class="exam-fill-badge">✍️ Nhập đáp án cho ${blankLabel}:</div>
                    <div class="exam-fill-hint">Nhập từ nghe được hoặc câu viết lại vào ô bên dưới:</div>
                  </div>
                  <div class="exam-fill-input-wrapper">
                    <input type="text" class="exam-fill-input" id="pdf-input-${q.id}" 
                      placeholder="Gõ đáp án của bạn vào đây..." 
                      value="${this.escapeHtml(userAns)}"
                      oninput="window.smobApp.setPdfQuestionAnswer('${q.id}', this.value)"
                    />
                    <span class="exam-input-saved-badge ${userAns ? 'visible' : ''}" id="pdf-saved-${q.id}">✓ Đã lưu</span>
                  </div>
                </div>
              `;
            }"""

new_input_render = """            const userAns = this.userPdfAnswers[q.id] || '';
            const isTypingType = q.type === 'IMAGE_FILL' || q.type === 'INLINE_FILL' || q.type === 'SENTENCE_REWRITE';

            if (isTypingType) {
              // Primary Digital Worksheet: Smart Typing Input Box
              secHtml += `
                <div class="exam-fill-blank-card" id="pdf-fill-${q.id}" style="margin-top: 14px;">
                  <div class="exam-fill-prompt-row">
                    <div class="exam-fill-badge">✍️ Nhập câu trả lời thực hành:</div>
                    <div class="exam-fill-hint">Nhập từ / câu vào ô dưới (Gõ xong nhấn Enter để sang câu tiếp):</div>
                  </div>
                  <div class="exam-smart-input-row">
                    <input type="text" class="exam-smart-input" id="pdf-input-${q.id}" 
                      placeholder="${q.input_placeholder || 'Gõ câu trả lời của bạn vào đây...'}" 
                      value="${this.escapeHtml(userAns)}"
                      oninput="window.smobApp.setPdfQuestionAnswer('${q.id}', this.value)"
                      onkeydown="if(event.key==='Enter') window.smobApp.focusNextPdfInput('${q.id}')"
                    />
                    <button type="button" class="btn-hint-inline" onclick="window.smobApp.giveAnswerHint('${q.id}')" title="Gợi ý chữ cái đầu">💡 Gợi Ý</button>
                  </div>
                  <div id="pdf-hint-box-${q.id}" style="display: none;"></div>
                </div>
              `;

              // If multiple choice options exist as a secondary quick-choice aid
              if (q.options && q.options.length > 0) {
                secHtml += `
                  <div style="margin-top: 10px;">
                    <div style="font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px;">Hoặc chọn nhanh đáp án:</div>
                    <div class="answers-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
                `;
                q.options.forEach((opt, oIdx) => {
                  const defaultLetter = String.fromCharCode(65 + oIdx);
                  let letter = defaultLetter;
                  let optText = opt;
                  const matchPrefix = opt.match(/^([A-D])[\.\)]\s*(.*)/i);
                  if (matchPrefix) {
                    letter = matchPrefix[1].toUpperCase();
                    optText = matchPrefix[2];
                  }
                  secHtml += `
                    <div class="answer-option-card ${userAns === opt ? 'selected' : ''}" id="pdf-opt-${q.id}-${oIdx}" onclick="window.smobApp.setPdfQuestionAnswer('${q.id}', '${opt.replace(/'/g, "\\'")}', ${oIdx})">
                      <div class="option-key">${letter}</div>
                      <div class="option-text">${optText}</div>
                    </div>
                  `;
                });
                secHtml += `</div></div>`;
              }
            } else if (q.options && q.options.length > 0) {
              // Standard Multiple Choice
              secHtml += `<div class="answers-grid" style="grid-template-columns: 1fr; gap: 8px; margin-top: 14px;">`;
              q.options.forEach((opt, oIdx) => {
                const defaultLetter = String.fromCharCode(65 + oIdx);
                let letter = defaultLetter;
                let optText = opt;

                const matchPrefix = opt.match(/^([A-D])[\.\)]\s*(.*)/i);
                if (matchPrefix) {
                  letter = matchPrefix[1].toUpperCase();
                  optText = matchPrefix[2];
                } else if (opt === 'A' || opt === 'B' || opt === 'C' || opt === 'D') {
                  letter = opt;
                  optText = `Vị trí (${opt})`;
                }

                secHtml += `
                  <div class="answer-option-card ${userAns === opt ? 'selected' : ''}" id="pdf-opt-${q.id}-${oIdx}" onclick="window.smobApp.setPdfQuestionAnswer('${q.id}', '${opt.replace(/'/g, "\\'")}', ${oIdx})">
                    <div class="option-key">${letter}</div>
                    <div class="option-text">${optText}</div>
                  </div>
                `;
              });
              secHtml += `</div>`;
            } else {
              // Fallback Fill input
              secHtml += `
                <div class="exam-fill-blank-card" id="pdf-fill-${q.id}" style="margin-top: 14px;">
                  <div class="exam-smart-input-row">
                    <input type="text" class="exam-smart-input" id="pdf-input-${q.id}" 
                      placeholder="Gõ đáp án của bạn vào đây..." 
                      value="${this.escapeHtml(userAns)}"
                      oninput="window.smobApp.setPdfQuestionAnswer('${q.id}', this.value)"
                      onkeydown="if(event.key==='Enter') window.smobApp.focusNextPdfInput('${q.id}')"
                    />
                    <button type="button" class="btn-hint-inline" onclick="window.smobApp.giveAnswerHint('${q.id}')">💡 Gợi Ý</button>
                  </div>
                  <div id="pdf-hint-box-${q.id}" style="display: none;"></div>
                </div>
              `;
            }"""

if old_input_render in code:
    code = code.replace(old_input_render, new_input_render, 1)
    print("✓ Enhanced question inputs with Smart Typing & Hints")

# 5. Enhance submitPdfExam to record full attempt with timestamps
old_save_test = """    // Show transcripts and review
    this.renderPdfTranscriptsAndReview();
    window.dataStore.saveProgress(this.currentPdfUnit, percent);
    window.dataStore.saveTestResult(this.currentPdfUnit, percent, correctCount, this.pdfExamQuestions.length);

    window.smobApp.showToast(`🎉 Đã nộp bài: ${correctCount}/${this.pdfExamQuestions.length} câu đúng (${percent}%)!`);"""

new_save_test = """    // Build detailed graded results for review attempt feature
    const gradedResults = this.pdfExamQuestions.map((q, idx) => {
      const uAns = (this.userPdfAnswers[q.id] || '').trim();
      const isRight = this.checkExamAnswer(q, uAns);
      return {
        qId: q.id,
        qNum: idx + 1,
        stem: q.stem,
        type: q.type,
        imageUrl: q.image_url || null,
        userAnswer: uAns || '(Chưa điền)',
        correctAnswer: q.correct_answer,
        isCorrect: isRight,
        explanation: q.explanation || ''
      };
    });

    const timeStr = `${Math.floor(this.pdfExamTimerSeconds / 60)}:${String(this.pdfExamTimerSeconds % 60).padStart(2, '0')}`;

    // Save full attempt to history with timestamps
    window.dataStore.saveExamAttempt(this.currentPdfUnit, {
      scorePercent: percent,
      correctCount: correctCount,
      totalCount: this.pdfExamQuestions.length,
      durationSeconds: this.pdfExamTimerSeconds,
      durationFormatted: timeStr,
      userAnswers: { ...this.userPdfAnswers },
      gradedResults: gradedResults
    });

    // Show transcripts and review
    this.renderPdfTranscriptsAndReview();
    window.dataStore.saveProgress(this.currentPdfUnit, percent);

    window.smobApp.showToast(`🎉 Đã nộp bài: ${correctCount}/${this.pdfExamQuestions.length} câu đúng (${percent}%)! Đã lưu vào Lịch sử.`);"""

if old_save_test in code:
    code = code.replace(old_save_test, new_save_test, 1)
    print("✓ Enhanced submitPdfExam to save full attempt history")

# 6. Append Analytics & History methods to SmobApp class
analytics_methods = """
  // ==========================================
  // HINT, ZOOM & NAVIGATION HELPERS
  // ==========================================
  giveAnswerHint(qId) {
    const q = this.pdfExamQuestions.find(x => x.id === qId);
    if (!q || !q.correct_answer) return;
    const box = document.getElementById(`pdf-hint-box-${qId}`);
    if (!box) return;

    let ans = q.correct_answer.replace(/^[A-D]\.\s*/i, '').trim();
    let hintStr = '';
    if (ans.length <= 3) {
      hintStr = ans.charAt(0) + '... (từ gồm ' + ans.length + ' chữ cái)';
    } else {
      hintStr = ans.slice(0, 2) + '... (từ gồm ' + ans.length + ' chữ cái)';
    }

    box.style.display = 'block';
    box.innerHTML = `<span class="exam-hint-text">💡 Gợi ý chữ cái đầu: <strong>${hintStr}</strong></span>`;
    window.dataStore.recordEngagement('typing', 1);
  }

  focusNextPdfInput(currentQId) {
    const idx = this.pdfExamQuestions.findIndex(x => x.id === currentQId);
    if (idx >= 0 && idx < this.pdfExamQuestions.length - 1) {
      const nextQ = this.pdfExamQuestions[idx + 1];
      const nextInput = document.getElementById(`pdf-input-${nextQ.id}`);
      if (nextInput) {
        nextInput.focus();
        nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  zoomImage(src) {
    const modalContainer = document.getElementById('attempt-review-modal-container');
    if (!modalContainer) return;

    modalContainer.style.display = 'block';
    modalContainer.innerHTML = `
      <div class="review-modal-backdrop" onclick="window.smobApp.closeAttemptReviewModal()">
        <div class="review-modal-content" style="max-width: 680px; text-align: center; background: transparent; box-shadow: none; border: none;" onclick="event.stopPropagation()">
          <img src="${src}" style="max-width: 100%; max-height: 80vh; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); background: #fff; padding: 8px;" />
          <div style="margin-top: 14px;">
            <button class="apple-btn btn-secondary" style="background: rgba(255,255,255,0.9);" onclick="window.smobApp.closeAttemptReviewModal()">✕ Đóng Phóng To</button>
          </div>
        </div>
      </div>
    `;
  }

  openHistoryTab(tabName = 'exams') {
    this.navigate('analytics');
    setTimeout(() => {
      const btn = document.getElementById(`tab-analytics-${tabName}`);
      if (btn) this.switchAnalyticsSubTab(tabName, btn);
    }, 50);
  }

  // ==========================================
  // TRUNG TÂM HIỆU SUẤT & LỊCH SỬ HỌC TẬP
  // ==========================================
  renderAnalyticsView() {
    this.renderAnalyticsPerformance();
    this.populateHistoryUnitFilter();
    this.renderAnalyticsExamHistory('all');
    this.renderAnalyticsVocabAndIrregularHistory();
  }

  switchAnalyticsSubTab(tabName, btnEl) {
    document.querySelectorAll('#view-analytics .sticky-view-toolbar .filter-chip').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.getElementById('subview-analytics-perf').style.display = tabName === 'perf' ? 'block' : 'none';
    document.getElementById('subview-analytics-exams').style.display = tabName === 'exams' ? 'block' : 'none';
    document.getElementById('subview-analytics-vocab').style.display = tabName === 'vocab' ? 'block' : 'none';

    if (tabName === 'perf') this.renderAnalyticsPerformance();
    if (tabName === 'exams') this.renderAnalyticsExamHistory();
    if (tabName === 'vocab') this.renderAnalyticsVocabAndIrregularHistory();
  }

  renderAnalyticsPerformance() {
    const container = document.getElementById('analytics-perf-container');
    if (!container) return;

    const data = window.dataStore.getPerformanceAnalytics();

    container.innerHTML = `
      <!-- Streak & Habit Hero Banner -->
      <div class="streak-hero-card">
        <div class="streak-flame-circle">🔥</div>
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px;">Chuỗi Ngày Học Kỷ Luật</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 2px 0;">
            ${data.streak} Ngày Học Liên Tục • ${data.totalMins} Phút Thao Tác Thực Tế
          </div>
          <div style="font-size: 13.5px; color: var(--text-secondary);">
            Hệ thống chỉ đếm thời gian khi bạn thực sự làm bài, lật flashcard hoặc luyện nghe audio.
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 32px;">${data.badge.icon}</div>
          <div style="font-size: 13px; font-weight: 800; color: ${data.badge.color};">${data.badge.title}</div>
        </div>
      </div>

      <!-- AI Smart Feedback Box -->
      <div class="ai-feedback-box">
        <div class="ai-feedback-icon">🤖</div>
        <div>
          <div style="font-size: 13px; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 2px;">Nhận Xét & Đánh Giá AI</div>
          <div class="ai-feedback-text">${data.aiFeedback}</div>
        </div>
      </div>

      <!-- 3 KPI Metric Cards -->
      <div class="analytics-dashboard-grid">
        <!-- KPI 1: Mastery Score -->
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span class="kpi-card-title">1. Điểm Năng Lực Toàn Khóa</span>
            <span class="kpi-icon-badge" style="background: #e0f2fe; color: #0284c7;">🎯</span>
          </div>
          <div class="kpi-main-val" style="color: #0284c7;">${data.avgScore}%</div>
          <div class="kpi-sub-text">
            Điểm trung bình các bài thi (${data.testedCount}/${data.totalUnits} Units đã làm). Đạt chuẩn: <strong>${data.passedCount} Units</strong>.
          </div>
        </div>

        <!-- KPI 2: Diligence Index -->
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span class="kpi-card-title">2. Chỉ Số Chăm Học (Diligence)</span>
            <span class="kpi-icon-badge" style="background: #fef3c7; color: #d97706;">🔥</span>
          </div>
          <div class="kpi-main-val" style="color: #d97706;">${data.diligenceScore}/100</div>
          <div class="kpi-sub-text">
            Đo lường tần suất vào học đều đặn, chuỗi ngày streak và duy trì thói quen học tập.
          </div>
        </div>

        <!-- KPI 3: Engagement Score -->
        <div class="kpi-card">
          <div class="kpi-card-header">
            <span class="kpi-card-title">3. Điểm Thao Tác Thực Hành</span>
            <span class="kpi-icon-badge" style="background: #f3e8ff; color: #9333ea;">⚡</span>
          </div>
          <div class="kpi-main-val" style="color: #9333ea;">${data.engagementScore}/100</div>
          <div class="kpi-sub-text">
            Đã gõ <strong>${data.totalTypingCount}</strong> câu tự luận • Lật <strong>${data.flashcardFlips}</strong> thẻ từ vựng • Làm <strong>${data.examCount}</strong> lượt thi.
          </div>
        </div>
      </div>

      <!-- Weekly Activity Heatmap -->
      <div class="apple-card" style="padding: 20px 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-size: 15px; font-weight: 700; color: var(--text-primary);">📅 Bản Đồ Hoạt Động 7 Ngày Gần Nhất</div>
          <span style="font-size: 12px; color: var(--text-secondary);">Cập nhật tự động theo thời gian thực</span>
        </div>
        <div class="weekly-heatmap-grid">
          ${data.weeklyActivity.map(d => `
            <div class="heatmap-day-card ${d.minutes > 0 ? 'is-active' : ''} ${d.isToday ? 'style="border-color: var(--accent);"' : ''}">
              <div class="heatmap-day-title">${d.dayName} (${d.dateStr})</div>
              <div class="heatmap-day-mins">${d.minutes > 0 ? `${d.minutes}p` : '0p'}</div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${d.actions} thao tác</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  populateHistoryUnitFilter() {
    const sel = document.getElementById('history-unit-filter');
    if (!sel) return;
    sel.innerHTML = '<option value="all">Tất cả các Unit</option>';
    for (let u = 1; u <= 48; u++) {
      const opt = document.createElement('option');
      opt.value = u;
      opt.innerText = `Unit ${u}`;
      sel.appendChild(opt);
    }
  }

  filterExamHistoryByUnit(val) {
    this.renderAnalyticsExamHistory(val);
  }

  renderAnalyticsExamHistory(filterUnit = 'all') {
    const container = document.getElementById('exam-history-list-container');
    if (!container) return;

    const history = window.dataStore.getExamHistory(filterUnit);

    if (history.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-subtle); color: var(--text-secondary);">
          <div style="font-size: 36px; margin-bottom: 10px;">🕒</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Chưa có lịch sử làm bài thi nào</div>
          <div style="font-size: 13px; margin-top: 6px;">Hãy làm bài thi online ở mục "Bài Thi Online" để xem lại các lần nộp bài và chi tiết câu đúng/sai tại đây nhé!</div>
        </div>
      `;
      return;
    }

    container.innerHTML = history.map(att => {
      const badgeClass = att.scorePercent >= 80 ? 'score-badge-high' : (att.scorePercent >= 60 ? 'score-badge-med' : 'score-badge-low');
      return `
        <div class="history-item-card">
          <div class="history-item-left">
            <div class="history-score-badge ${badgeClass}">
              <span>${att.scorePercent}%</span>
            </div>
            <div>
              <div class="history-title-row">
                Unit ${att.unitId}: ${(att.unitTitle || '').toUpperCase()}
              </div>
              <div class="history-meta-row">
                <span>🗓️ <strong class="history-timestamp-tag">${att.displayTime || att.dateFormatted}</strong></span>
                <span>🎯 Đúng: <strong>${att.correctCount}/${att.totalCount}</strong> câu</span>
                <span>⏱️ Thời gian: <strong>${att.durationFormatted}</strong></span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="apple-btn btn-secondary" style="padding: 8px 14px; font-size: 13px; font-weight: 600;" onclick="window.smobApp.openAttemptReviewModal('${att.attemptId}')">
              🔍 Xem Lại Bài Làm
            </button>
            <button class="apple-btn btn-primary" style="padding: 8px 14px; font-size: 13px; font-weight: 600;" onclick="window.smobApp.retakeUnitExam(${att.unitId})">
              🔄 Làm Lại Đề Này
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  retakeUnitExam(unitId) {
    this.navigate('tests');
    const select = document.getElementById('test-unit-select');
    if (select) {
      select.value = unitId;
      this.onTestUnitSelectChange(unitId);
    }
  }

  openAttemptReviewModal(attemptId) {
    const attempt = window.dataStore.getExamAttempt(attemptId);
    if (!attempt) return;

    const modalContainer = document.getElementById('attempt-review-modal-container');
    if (!modalContainer) return;

    modalContainer.style.display = 'block';
    modalContainer.innerHTML = `
      <div class="review-modal-backdrop" onclick="if(event.target===this) window.smobApp.closeAttemptReviewModal()">
        <div class="review-modal-content">
          <div class="review-modal-header">
            <div>
              <div style="font-size: 12px; font-weight: 800; color: var(--accent); text-transform: uppercase;">Nhật Ký Chi Tiết Lần Làm Bài</div>
              <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">
                Unit ${attempt.unitId}: ${(attempt.unitTitle || '').toUpperCase()}
              </div>
              <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
                Nộp lúc: <strong>${attempt.displayTime}</strong> • Điểm số: <strong style="color: #16a34a;">${attempt.scorePercent}% (${attempt.correctCount}/${attempt.totalCount} câu)</strong> • Thời gian: ${attempt.durationFormatted}
              </div>
            </div>
            <button class="apple-btn btn-secondary" onclick="window.smobApp.closeAttemptReviewModal()">✕ Đóng</button>
          </div>

          <div class="review-modal-body">
            ${(attempt.gradedResults || []).map(q => `
              <div class="review-q-card ${q.isCorrect ? 'is-correct' : 'is-wrong'}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 800; font-size: 14px;">Question ${q.qNum}.</span>
                  <span style="font-size: 13px; font-weight: 800; color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">
                    ${q.isCorrect ? '✓ ĐÚNG' : '✗ SAI'}
                  </span>
                </div>

                ${q.imageUrl ? `
                  <div style="margin: 8px 0; text-align: center;">
                    <img src="${q.imageUrl}" style="max-height: 180px; border-radius: 8px; border: 1px solid var(--border-subtle);" />
                  </div>
                ` : ''}

                <div style="font-size: 15px; font-weight: 600; margin-bottom: 10px; color: var(--text-primary);">
                  ${q.stem || `Câu hỏi số ${q.qNum}`}
                </div>

                <div style="font-size: 13.5px; background: var(--bg-main); padding: 10px 14px; border-radius: 8px; margin-bottom: 8px;">
                  <div>Bạn đã trả lời: <strong style="color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">${q.userAnswer}</strong></div>
                  ${!q.isCorrect ? `
                    <div style="margin-top: 4px; color: #16a34a;">Đáp án chính xác: <strong>${q.correctAnswer}</strong></div>
                  ` : ''}
                </div>

                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; border-left: 3px solid #3b82f6; padding-left: 10px;">
                  ${q.explanation || '【Giải thích】 Xem lại lý thuyết ngữ pháp của bài học.'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  closeAttemptReviewModal() {
    const modalContainer = document.getElementById('attempt-review-modal-container');
    if (modalContainer) {
      modalContainer.style.display = 'none';
      modalContainer.innerHTML = '';
    }
  }

  clearAllExamHistory() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài thi?')) {
      window.dataStore.clearExamHistory();
      this.renderAnalyticsExamHistory();
      window.smobApp.showToast('🗑️ Đã xóa toàn bộ lịch sử bài thi.');
    }
  }

  renderAnalyticsVocabAndIrregularHistory() {
    // 1. Vocab History
    const vContainer = document.getElementById('vocab-history-list-container');
    if (vContainer) {
      const vHistory = window.dataStore.getVocabQuizHistory();
      if (vHistory.length === 0) {
        vContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-subtle);">
            Chưa có lịch sử làm bài Quiz từ vựng.
          </div>
        `;
      } else {
        vContainer.innerHTML = vHistory.slice(0, 20).map(v => `
          <div class="history-item-card" style="padding: 14px 18px;">
            <div>
              <div style="font-weight: 700; font-size: 14.5px;">Unit ${v.unitId}: ${v.unitTitle}</div>
              <div style="font-size: 12.5px; color: var(--text-secondary);">🗓️ ${v.displayTime}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: #16a34a; font-size: 16px;">${v.scorePercent}%</div>
              <div style="font-size: 12px; color: var(--text-secondary);">${v.masteredCount}/${v.totalCount} từ đã thuộc</div>
            </div>
          </div>
        `).join('');
      }
    }

    // 2. Irregular Verbs History & Weak Verbs
    const irvContainer = document.getElementById('irregular-history-list-container');
    if (irvContainer) {
      const irvHistory = window.dataStore.getIrregularQuizHistory();
      const weakVerbs = window.dataStore.getWeakIrregularVerbs(8);

      let html = '';
      if (weakVerbs.length > 0) {
        html += `
          <div style="margin-bottom: 14px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 14px;">
            <div style="font-size: 13px; font-weight: 800; color: #e11d48; margin-bottom: 6px;">⚠️ Danh Sách Động Từ Hay Nhầm Lẫn Cần Ôn Lại:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${weakVerbs.map(w => `
                <span style="background: #ffe4e6; color: #be123c; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 20px;">
                  ${w.verb} (${w.count} lần sai)
                </span>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (irvHistory.length === 0) {
        html += `
          <div style="padding: 24px; text-align: center; color: var(--text-secondary); background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-subtle);">
            Chưa có lịch sử làm bài kiểm tra Động từ bất quy tắc.
          </div>
        `;
      } else {
        html += irvHistory.slice(0, 15).map(ir => `
          <div class="history-item-card" style="padding: 14px 18px;">
            <div>
              <div style="font-weight: 700; font-size: 14.5px;">Kiểm Tra 3 Cột V1-V2-V3</div>
              <div style="font-size: 12.5px; color: var(--text-secondary);">🗓️ ${ir.displayTime}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: #16a34a; font-size: 16px;">${ir.scorePercent}%</div>
              <div style="font-size: 12px; color: var(--text-secondary);">${ir.correctCount}/${ir.totalCount} từ đúng</div>
            </div>
          </div>
        `).join('');
      }

      irvContainer.innerHTML = html;
    }
  }

  // Active time anti-idle tracker
  initActiveStudyTracker() {
    let lastActivityTime = Date.now();
    const markActivity = () => { lastActivityTime = Date.now(); };

    window.addEventListener('click', markActivity);
    window.addEventListener('keydown', markActivity);
    window.addEventListener('scroll', markActivity);

    // Every 60 seconds, if active in past 3 minutes, add 1 minute to dataStore
    setInterval(() => {
      const now = Date.now();
      if (now - lastActivityTime < 3 * 60 * 1000) {
        window.dataStore.addActiveMinutes(1);
        const streakEl = document.getElementById('sidebar-streak');
        if (streakEl && window.dataStore.engagement) {
          streakEl.innerText = `🔥 ${window.dataStore.engagement.dailyStreak} ngày học liên tục`;
        }
      }
    }, 60000);
  }
"""

# Insert methods into SmobApp before closing brace
idx = code.rfind("window.smobApp = new SmobApp();")
if idx > 0:
    # Find the closing brace of SmobApp class before window.smobApp
    class_close_idx = code.rfind("}", 0, idx)
    code = code[:class_close_idx] + "\n" + analytics_methods + "\n" + code[class_close_idx:]
    print("✓ Appended Analytics & History methods to SmobApp class")

# Also call initActiveStudyTracker in init()
if "this.initActiveStudyTracker();" not in code:
    code = code.replace("this.initEvents();", "this.initEvents();\n    this.initActiveStudyTracker();", 1)
    print("✓ Added initActiveStudyTracker to app init")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated js/app.js successfully! Length:", len(code))
