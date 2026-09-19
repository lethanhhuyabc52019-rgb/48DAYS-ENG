// SMOB English Lab - Main Application Controller
// Version 2.0 (All-in-One Learning Suite: In-App Video Player, Quizlet Test Engine, 398+ Irregular Verbs, Audio & Exam Generator)

class SmobApp {
  constructor() {
    this.currentView = 'dashboard';
    
    // Vocab & Quizlet State
    this.vocabList = [];
    this.currentVocabIndex = 0;
    this.vocabMode = 'flashcard'; // flashcard | quizlet-test
    this.speechRate = 1.0;
    this.isAutoplaying = false;
    this.autoplayTimer = null;
    this.isCardFlipped = false;
    this.isReverseCard = false;
    this.quizletQuestions = [];
    this.quizletAnswers = {};
    this.quizletTimerSeconds = 0;
    this.quizletTimerInterval = null;

    // Test Engine State
    this.testScopeUnits = [1];
    this.testQuestionCount = 20;
    this.testDifficulty = 'Normal';
    this.testQuestions = [];
    this.currentTestIndex = 0;
    this.userTestAnswers = {};
    this.testTimerSeconds = 0;
    this.testTimerInterval = null;
    this.testFinished = false;

    // Grammar Topic Practice State
    this.grammarTopicFormat = 'all'; // all | mc | blank

    // Comprehensive Full Mock Test State
    this.compTestMode = 'single'; // single | multi
    this.compQuestionCount = 20;
    this.compTestQuestions = [];
    this.currentCompIndex = 0;
    this.userCompAnswers = {};
    this.compTimerSeconds = 0;
    this.compTimerInterval = null;
    this.compTimeLimit = 15 * 60;
    this.compFinished = false;

    // Video Theater & Split View State
    this.currentPlayingUnit = 1;
    this.videoElement = null;
    this.isMiniVideoOpen = false;
    this.isSplitViewOpen = false;

    // Mistakes Notebook Filter State
    this.mistakesCategoryFilter = 'all'; // all | vocab_quizlet | grammar_theory | test_unit
    this.mistakesUnitFilter = 'all'; // all | unitId

    // Audio Player State
    this.currentAudioTrack = null;
    this.currentAudioUnit = 32;

    // PDF Online Exam State
    this.currentPdfUnit = 1;
    this.grammarViewMode = 'full'; // full | cards
    this.pdfExamQuestions = [];
    this.userPdfAnswers = {};
    this.pdfExamTimerSeconds = 0;
    this.pdfExamTimerInterval = null;
    this.pdfExamStarted = false;
    this.pdfExamSubmitted = false;
    this.activeInlineAudio = null;
    this.testFilterMode = 'all';
    this.navigationHistory = [];

    // AI Pronunciation Coach State
    this.aiTargetText = '';
    this.aiTargetIpa = '';
    this.isAIRecording = false;
    this.speechRecognition = null;

    // Irregular Verbs Interactive Practice State
    this._irvPractice = {
      mode: 'all',
      dir: 'all',
      count: 10,
      questions: [],
      curIdx: 0,
      userAnswers: {},
      score: 0,
      isAnswered: false,
      timerSeconds: 0
    };

    // Text Selection Floating Toolbar State
    this.selectedText = '';
    this.selectionToolbarTimer = null;
  }

  async init() {
    this.initTheme();
    await window.dataStore.initialize();
    this.setupNavigation();
    this.setupGlobalShortcuts();
    this.setupSearch();
    this.populateUnitDropdowns();
    this.initVideoPlayer();
    this.initFloatingVideoInteractions();
    this.initSplitViewResizer();
    this.initTextSelectionToolbar();

    this.renderDashboard();
    this.renderUnitsCatalog();
    this.renderIrregularVerbs();
    this.renderVideoTheaterPlaylist();
    this.renderAudioCatalog();
    this.selectAudioUnit(32);
    this.renderExamUnitsCheckboxes();
    
    // Open default unit 1 hub
    this.openUnitHub(window.dataStore.currentUnitId || 1);

    if (window.smobCloudSync) {
      window.smobCloudSync.updateUI();
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('smob_theme') || 'light';
    this.applyTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smob_theme', theme);
    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
    if (label) label.innerText = theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối';
  }

  showToast(message, type = 'info', duration = 2800) {
    if (!message) return;
    let container = document.getElementById('smob-global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'smob-global-toast-container';
      container.className = 'smob-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `smob-toast-item smob-toast-${type}`;
    toast.innerHTML = `<span class="smob-toast-msg">${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('smob-toast-visible');
    });

    setTimeout(() => {
      toast.classList.remove('smob-toast-visible');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, duration);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const view = link.getAttribute('data-view');
        this.navigate(view);
        this.toggleMobileSidebar(false);
      });
    });
  }

  toggleMobileSidebar(force) {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;
    const shouldOpen = (typeof force === 'boolean') ? force : !sidebar.classList.contains('mobile-open');
    if (shouldOpen) {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    }
  }

  setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const irvArena = document.getElementById('irv-active-arena');
      if (irvArena && irvArena.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevIrregularPracticeQuestion();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextIrregularPracticeQuestion();
        }
      }
    });
  }

  navigate(viewId, pushHistory = true) {
    this.toggleMobileSidebar(false);
    if (this.currentView === viewId) return;

    if (pushHistory && this.currentView && this.currentView !== viewId) {
      this.navigationHistory.push(this.currentView);
    }
    this.currentView = viewId;

    const backBtn = document.getElementById('nav-back-btn');
    if (backBtn) {
      backBtn.style.display = (this.navigationHistory && this.navigationHistory.length > 0) ? 'inline-flex' : 'none';
    }

    // Check background video / mini dock
    this.saveVideoPlaybackState(this.currentPlayingUnit);
    if (viewId !== 'videos') {
      const vid = this.videoElement || document.getElementById('embedded-video-player');
      if (vid && !vid.paused && vid.src) {
        this.showMiniVideoDock();
      }
    } else {
      this.restoreVideoToTheater();
    }

    // Check background audio
    if (viewId !== 'audio') {
      const aud = document.getElementById('html5-audio');
      if (aud && !aud.paused) {
        this.showPersistentAudioBar();
      }
    } else {
      this.hidePersistentAudioBar();
    }

    // Handle split view state when navigating away from grammar
    if (this.isSplitViewOpen && viewId !== 'grammar') {
      this.closeSplitView();
      const video = this.videoElement || document.getElementById('embedded-video-player');
      if (video && !video.paused) {
        this.showMiniVideoDock();
      }
    }

    // Update nav-link active class
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === viewId);
    });

    // Toggle tab-view elements
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewId}`);
    });

    const meta = {
      'dashboard': ['Dashboard', 'Chào mừng bạn trở lại với lộ trình 48 ngày lấy gốc'],
      'outcomes': ['Chuẩn Đầu Ra & Mục Tiêu 48 Ngày', 'Lộ trình chuyển đổi năng lực từ mất gốc đến TOEIC 550 - 700+ và tự tin giao tiếp'],
      'study-plan': ['Kế Hoạch & Tiến Độ 48 Ngày', 'Lộ trình cá nhân hóa tự động cập nhật và dời lịch thông minh theo thời gian thực'],
      'units': ['48 Units Lộ Trình', 'Khóa học 48 ngày lấy gốc tiếng Anh toàn diện cô Mai Phương'],
      'unit-hub': [`Unit ${window.dataStore.currentUnitId}: Trạm Học Tập`, 'Tổng quan trạm học: Từ vựng, Ngữ pháp, Video, Audio và Bài thi gốc'],
      'vocabulary': ['Từ Vựng & Flashcards Chuẩn Quizlet', 'Học từ vựng trực quan với hình ảnh, Flashcard 3D và Bộ kiểm tra chuẩn Quizlet'],
      'grammar': ['Ngữ Pháp / Lý Thuyết', 'Hệ thống công thức, quy tắc ngữ pháp và giáo trình bài giảng nguyên bản'],
      'irregular': ['Động Từ Bất Quy Tắc Toàn Diện', 'Tra cứu 398+ động từ bất quy tắc có đầy đủ phiên âm IPA cho V1, V2, V3 và bài test'],
      'comprehensive-test': ['Kiểm Tra Toàn Diện (Full Mock Test)', 'Đề thi 4 kỹ năng: Từ Vựng • Ngữ Pháp • Luyện Nghe (Audio) • Đọc Hiểu'],
      'tests': ['Bài Thi Online 48 Units (Chuẩn PDF)', 'Bám sát 100% đề thi online và đáp án lời giải chi tiết của Cô Mai Phương'],
      'videos': ['Rạp Chiếu Video Bài Giảng 48 Units', 'Trình phát video tích hợp trực tiếp: Tua 10s, chỉnh tốc độ 0.75x-2x, toàn màn hình'],
      'audio': ['Audio & Luyện Nghe', 'Trạm luyện nghe các file âm thanh MP3 thực tế phát trực tiếp trong ứng dụng'],
      'mistakes': ['Sổ Tay Câu Sai & Khắc Phục', 'Ôn tập và luyện thi lại riêng các câu bạn đã từng trả lời chưa chính xác'],
      'analytics': ['Trung Tâm Hiệu Suất Học Tập & Lịch Sử Kiểm Tra', 'Theo dõi tiến độ, đo lường độ chăm chỉ và xem lại nhật ký các bài thi có ngày giờ chi tiết'],
      'settings': ['Cài Đặt', 'Tùy chỉnh chế độ giao diện, tốc độ phát âm và quản lý dữ liệu học tập offline'],
      'sync': ['Quản Lý Dữ Liệu & Đồng Bộ 2 Chiều', 'Tùy chọn lưu ngoại tuyến an toàn trên máy hoặc đồng bộ dữ liệu bảo mật giữa Nhà & Công Ty']
    };

    if (meta[viewId]) {
      document.getElementById('page-heading').innerText = meta[viewId][0];
      document.getElementById('page-description').innerText = meta[viewId][1];
    }

    if (viewId === 'sync' && window.smobCloudSync) {
      window.smobCloudSync.updateUI();
    }

    const curU = window.dataStore?.currentUnitId || 1;
    if (viewId === 'outcomes') {
      const btn = document.getElementById('btn-outcomes-continue');
      if (btn) btn.innerHTML = `🚀 Tiếp Tục Học Unit ${curU}`;
    }
    if (viewId === 'dashboard') this.renderDashboard();
    if (viewId === 'study-plan') {
      if (window.dynamicPlan) window.dynamicPlan.render();
    }
    if (viewId === 'mistakes') this.renderMistakes();
    if (viewId === 'analytics') this.renderAnalyticsView();
    if (viewId === 'vocabulary') this.switchVocabUnit(curU);
    if (viewId === 'grammar') this.switchGrammarUnit(curU);
    if (viewId === 'comprehensive-test') this.initComprehensiveTestView();
    if (viewId === 'tests') {
      this.currentPdfUnit = curU;
      this.initPdfExamView();
    }
    if (viewId === 'videos') {
      const targetVidUnit = curU || this.currentPlayingUnit || 1;
      this.loadTheaterVideo(targetVidUnit);
    }
  }

  goBack() {
    if (this.navigationHistory && this.navigationHistory.length > 0) {
      const prevView = this.navigationHistory.pop();
      this.navigate(prevView, false);
      const backBtn = document.getElementById('nav-back-btn');
      if (backBtn) {
        backBtn.style.display = (this.navigationHistory.length > 0) ? 'inline-flex' : 'none';
      }
    }
  }

  setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeQuizletSetupModal();
        this.closeGrammarTopicsModal();
        this.closeAIPronunciationModal();
        this.closeUnansweredModal();
      }

      const isInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
      if (isInput) return;

      // Back navigation shortcut: Alt + ArrowLeft or Backspace
      if ((e.altKey && e.key === 'ArrowLeft') || (e.key === 'Backspace' && !isInput)) {
        if (this.navigationHistory && this.navigationHistory.length > 0) {
          e.preventDefault();
          this.goBack();
          return;
        }
      }

      if (this.currentView === 'vocabulary' && this.vocabMode === 'flashcard') {
        if (e.code === 'Space') {
          e.preventDefault();
          this.toggleFlashcardFlip();
        } else if (e.code === 'ArrowRight') {
          this.nextVocabCard();
        } else if (e.code === 'ArrowLeft') {
          this.prevVocabCard();
        }
      } else if (this.currentView === 'videos' || (this.videoElement && !this.videoElement.paused)) {
        if (e.code === 'Space') {
          e.preventDefault();
          this.toggleVideoPlay();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          this.skipVideo(-10);
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          this.skipVideo(10);
        }
      }
    });

    window.speakWord = (text) => this.speakText(text);
    window.speakText = (text) => this.speakText(text);
  }

  setupSearch() {
    const input = document.getElementById('global-search');
    if (input) {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 1) {
          const verbs = window.dataStore.irregularVerbs;
          const matchVerb = verbs.find(v => v.v1.toLowerCase().includes(query) || v.v2.toLowerCase().includes(query) || v.meaning.toLowerCase().includes(query));
          if (matchVerb) {
            this.navigate('irregular');
            const irvInput = document.getElementById('irv-search');
            if (irvInput) {
              irvInput.value = query;
              this.filterIrregularVerbs(query);
            }
          }
        }
      });
    }
  }

  populateUnitDropdowns() {
    const vocabSelect = document.getElementById('vocab-unit-select');
    const grammarSelect = document.getElementById('grammar-unit-select');
    const audioSelect = document.getElementById('audio-unit-select');

    if (vocabSelect) vocabSelect.innerHTML = '';
    if (grammarSelect) grammarSelect.innerHTML = '';
    if (audioSelect) audioSelect.innerHTML = '';

    const units = window.dataStore.units;
    units.forEach(u => {
      if (vocabSelect) {
        const opt1 = document.createElement('option');
        opt1.value = u.unit_number;
        opt1.innerText = `Unit ${u.unit_number}: ${u.title}`;
        vocabSelect.appendChild(opt1);
      }

      if (grammarSelect) {
        const opt2 = document.createElement('option');
        opt2.value = u.unit_number;
        opt2.innerText = `Unit ${u.unit_number}: ${u.title}`;
        grammarSelect.appendChild(opt2);
      }

      if (audioSelect && u.has_audio) {
        const opt3 = document.createElement('option');
        opt3.value = u.unit_number;
        opt3.innerText = `Unit ${u.unit_number}: ${u.title}`;
        audioSelect.appendChild(opt3);
      }
    });
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  renderDashboard() {
    const p = window.dataStore.userProgress;
    document.getElementById('dash-streak').innerText = `${p.streakDays} Ngày`;
    document.getElementById('sidebar-streak').innerText = `🔥 ${p.streakDays} ngày học liên tục`;
    document.getElementById('dash-completed-units').innerText = `${p.completedUnits.length} / 48 Units`;

    const knownCount = Object.keys(p.vocabKnown).length;
    document.getElementById('dash-vocab-count').innerText = `${knownCount} Từ`;

    const curUnit = window.dataStore.getCurrentUnit();
    if (curUnit) {
      document.getElementById('dash-current-unit-title').innerText = `Unit ${curUnit.unit_number}: ${curUnit.title}`;
      document.getElementById('dash-current-unit-sub').innerText = `${curUnit.stage_name} • ${curUnit.vocabulary.length} từ vựng`;
    }

    const testScores = Object.values(p.testScores);
    const avgScore = testScores.length > 0 ?
      Math.round(testScores.reduce((a, b) => a + b.score, 0) / testScores.length) : 0;
    document.getElementById('dash-avg-score').innerText = `${avgScore}%`;

    // Render Dynamic Study Plan & Circular Progress Gauge Widget
    if (window.dynamicPlan) {
      window.dynamicPlan.renderDashboardWidget();
    }

    const grid = document.getElementById('dash-suggested-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const stages = [
      { id: 1, name: 'Giai đoạn 1: Nền tảng cốt lõi', range: 'Units 1 – 11', icon: '🌱' },
      { id: 2, name: 'Giai đoạn 2: Các thì & Động từ', range: 'Units 12 – 20', icon: '🌿' },
      { id: 3, name: 'Giai đoạn 3: Luyện nghe & Cấu trúc câu', range: 'Units 21 – 34', icon: '🎧' },
      { id: 4, name: 'Giai đoạn 4: Giao tiếp & Ứng dụng', range: 'Units 35 – 48', icon: '🚀' }
    ];

    stages.forEach(st => {
      const box = document.createElement('div');
      box.className = 'unit-box';
      box.innerHTML = `
        <div class="unit-tag-row">
          <span class="unit-chip">STAGE 0${st.id}</span>
          <span style="font-size: 24px;">${st.icon}</span>
        </div>
        <div class="unit-heading">${st.name}</div>
        <div class="unit-meta-sub">${st.range}</div>
        <button class="apple-btn btn-secondary" style="margin-top: auto;">Xem Bài Học</button>
      `;
      box.onclick = () => {
        this.navigate('units');
        const chip = document.querySelectorAll('#view-units .filter-chip')[st.id];
        if (chip) this.filterCatalog(st.id, chip);
      };
      grid.appendChild(box);
    });
  }

  // ==========================================
  // 48 UNITS CATALOG
  // ==========================================
  renderUnitsCatalog(filterStage = 0) {
    const container = document.getElementById('units-catalog-container');
    if (!container) return;
    container.innerHTML = '';

    const units = window.dataStore.units;
    const p = window.dataStore.userProgress;

    units.forEach(u => {
      if (filterStage !== 0 && u.stage !== filterStage) return;

      const card = document.createElement('div');
      card.className = 'unit-box';
      const isMissingVideo = !u.has_video;
      const statusPill = isMissingVideo ? 
        `<span class="status-pill status-missing">Thiếu Video</span>` : 
        `<span class="status-pill status-avail">Video Sẵn Sàng</span>`;

      const audioTag = u.has_audio ? `<span class="status-pill status-avail" style="background:#e0f2fe; color:#0369a1; margin-left:4px;">${u.audio_count} Audio MP3</span>` : '';

      card.innerHTML = `
        <div class="unit-tag-row">
          <span class="unit-chip">UNIT ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}</span>
          <div>${statusPill}${audioTag}</div>
        </div>
        <div class="unit-heading">${u.title}</div>
        <div class="unit-meta-sub">${u.stage_name}</div>
        <div class="mini-progress"><div class="mini-progress-fill" style="width: ${p.completedUnits.includes(u.unit_number) ? '100%' : '0%'};"></div></div>
      `;
      card.addEventListener('click', () => {
        this.openUnitHub(u.unit_number);
      });
      container.appendChild(card);
    });
  }

  filterCatalog(stage, btn) {
    document.querySelectorAll('#view-units .filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    this.renderUnitsCatalog(stage);
  }

  // ==========================================
  // GLOBAL UNIT SYNCHRONIZATION
  // ==========================================
  syncCurrentUnit(unitId, source = null) {
    const uid = parseInt(unitId) || 1;
    if (uid < 1 || uid > 48) return;

    window.dataStore.setCurrentUnit(uid);
    this.currentPdfUnit = uid;
    this.currentVocabUnit = uid;
    this.currentGrammarUnit = uid;
    this.currentHubUnit = uid;
    this.currentPlayingUnit = uid;

    // Synchronize all dropdowns across views immediately
    const dropdownIds = ['grammar-unit-select', 'vocab-unit-select', 'test-unit-select', 'hub-unit-select'];
    dropdownIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && parseInt(el.value) !== uid) {
        el.value = String(uid);
      }
    });

    // Synchronize video playlist active item
    document.querySelectorAll('.playlist-item').forEach(item => {
      const isActive = item.getAttribute('data-unit-id') === String(uid);
      item.classList.toggle('active', isActive);
      if (isActive && this.currentView === 'videos') {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });

    // If currently on videos view and source is external, load the video
    if (this.currentView === 'videos' && source !== 'videos') {
      this.loadTheaterVideo(uid);
    }

    // When switching active unit from outside quizlet modal, synchronize quizlet default
    if (source !== 'quizlet_modal') {
      try {
        localStorage.setItem('smob_quizlet_selected_units', JSON.stringify([uid]));
      } catch (e) {}
    }
  }

  // ==========================================
  // UNIT HUB
  // ==========================================
  switchHubUnitOffset(delta) {
    const cur = window.dataStore.currentUnitId || 1;
    let next = cur + delta;
    if (next < 1) next = 48;
    if (next > 48) next = 1;
    this.openUnitHub(next);
  }

  openUnitHub(unitId) {
    const uid = parseInt(unitId) || 1;
    this.syncCurrentUnit(uid, 'hub');
    const u = window.dataStore.getCurrentUnit();
    if (!u) return;

    // Populate or sync hub unit select dropdown
    const hubSelect = document.getElementById('hub-unit-select');
    if (hubSelect) {
      if (hubSelect.options.length === 0 && window.dataStore.units) {
        window.dataStore.units.forEach(unitItem => {
          const opt = document.createElement('option');
          opt.value = unitItem.unit_number;
          opt.text = `Unit ${unitItem.unit_number}: ${unitItem.title}`;
          hubSelect.appendChild(opt);
        });
      }
      hubSelect.value = String(uid);
    }

    const navText = document.getElementById('nav-current-unit-text');
    if (navText) navText.innerText = `Unit ${u.unit_number}: Trạm Học`;
    const chip = document.getElementById('hub-unit-chip');
    if (chip) chip.innerText = `UNIT ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}`;
    const titleEl = document.getElementById('hub-unit-title');
    if (titleEl) titleEl.innerText = u.title.toUpperCase();
    const stageEl = document.getElementById('hub-unit-stage');
    if (stageEl) stageEl.innerText = `${u.stage_name} • Tài liệu chuẩn cô Vũ Thị Mai Phương`;

    const videoPill = document.getElementById('hub-video-status-pill');
    if (videoPill) {
      if (!u.has_video) {
        videoPill.className = 'status-pill status-missing';
        videoPill.innerText = 'Thiếu Video Bài Giảng';
        const vidBtn = document.getElementById('hub-video-btn');
        if (vidBtn) vidBtn.innerText = 'Video Chưa Có';
      } else {
        videoPill.className = 'status-pill status-avail';
        videoPill.innerText = 'Video Sẵn Sàng (Phát Trực Tiếp)';
        const vidBtn = document.getElementById('hub-video-btn');
        if (vidBtn) vidBtn.innerText = '▶ Xem Video Bài Giảng';
      }
    }

    const srcTrace = document.getElementById('hub-source-trace');
    if (srcTrace) {
      srcTrace.innerHTML = `
        📖 <strong>Giáo trình chính thức:</strong> 100% Lý thuyết ngữ pháp, Công thức, Bài thi & Lời giải chuẩn Cô Vũ Thị Mai Phương đã được tích hợp đầy đủ trực tiếp trong phần mềm.
      `;
    }

    // Render dynamic station cards based on available content in this unit
    const hubContainer = document.getElementById('hub-stations-container');
    const hubTitle = document.getElementById('hub-stations-title');
    const hubSub = document.getElementById('hub-stations-sub');

    if (hubContainer) {
      hubContainer.innerHTML = '';
      const stations = [];

      // 1. Trạm 1: Từ Vựng & Flashcard 3D
      const vocabCount = u.vocabulary ? u.vocabulary.length : 0;
      stations.push({
        num: 1,
        icon: '🎴',
        title: 'Từ Vựng & Flashcard 3D',
        desc: vocabCount > 0 
          ? `${vocabCount} từ vựng kèm IPA chuẩn, Flashcards 3D, Trắc nghiệm và Nối từ.`
          : 'Bài học này tập trung kiến thức ngữ pháp và làm bài test thực chiến.',
        badge: vocabCount > 0 ? `${vocabCount} Từ Vựng` : 'Tích Hợp Lý Thuyết',
        btnText: vocabCount > 0 ? 'Học Từ Vựng' : 'Xem Từ Vựng',
        btnClass: 'btn-secondary',
        available: true,
        action: () => this.openUnitVocab()
      });

      // 2. Trạm 2: Lý Thuyết & Ngữ Pháp
      const grammarSections = u.grammar?.sections ? u.grammar.sections.length : 1;
      stations.push({
        num: 2,
        icon: '📖',
        title: 'Lý Thuyết & Ngữ Pháp',
        desc: `${grammarSections} chuyên đề ngữ pháp, công thức và ví dụ song ngữ nguyên bản 100% PDF.`,
        badge: `${grammarSections} Chuyên Đề`,
        btnText: 'Đọc Lý Thuyết',
        btnClass: 'btn-secondary',
        available: true,
        action: () => this.openUnitGrammar()
      });

      // 3. Trạm 3: Unit Test (Bài Thi Gốc)
      const testCount = u.unit_test ? u.unit_test.length : 0;
      stations.push({
        num: 3,
        icon: '📝',
        title: 'Unit Test (Bài Thi Gốc)',
        desc: `${testCount} câu hỏi tương tác bám sát 100% tài liệu đề thi và lời giải chi tiết.`,
        badge: `${testCount} Câu Hỏi`,
        btnText: 'Làm Bài Test',
        btnClass: 'btn-primary',
        available: true,
        action: () => this.startUnitTest(u.unit_number)
      });

      // 4. Trạm 4: Video Bài Giảng
      const hasVideo = u.has_video && ![12, 13].includes(u.unit_number);
      stations.push({
        num: 4,
        icon: '🎬',
        title: 'Video Bài Giảng',
        desc: hasVideo 
          ? 'Mở video bài giảng gốc trực tiếp trên máy tính với độ nét cao.'
          : 'Video bài giảng chưa có trong bộ dữ liệu gốc của Unit này.',
        badge: hasVideo ? 'Sẵn Sàng' : 'Chưa Có Video',
        badgeClass: hasVideo ? 'status-avail' : 'status-missing',
        btnText: hasVideo ? '▶ Xem Video' : 'Chưa Có Video',
        btnClass: hasVideo ? 'btn-secondary' : 'btn-disabled',
        available: hasVideo,
        action: () => {
          if (hasVideo) {
            this.handleUnitVideo();
          } else {
            this.showToast(`Unit ${u.unit_number}: Video bài giảng chưa có trong tài liệu gốc.`);
          }
        }
      });

      // 5. Trạm 5: Audio & Luyện Nghe
      const audioList = (u.audio_files && u.audio_files.length > 0) 
        ? u.audio_files 
        : (u.source_trace?.audio_files || []);
      const hasAudio = Boolean(u.has_audio && audioList.length > 0);
      const audioCount = audioList.length;
      stations.push({
        num: 5,
        icon: '🎧',
        title: 'Audio & Luyện Nghe',
        desc: hasAudio 
          ? `${audioCount} file audio MP3 thực tế & bài tập nghe chấm điểm trực tiếp.`
          : 'Unit này tập trung ngữ pháp/từ vựng thuần túy, không có bài nghe audio riêng.',
        badge: hasAudio ? `${audioCount} File MP3` : 'Không Có Audio',
        badgeClass: hasAudio ? 'status-avail' : 'status-missing',
        btnText: hasAudio ? 'Luyện Nghe MP3' : 'Không Có Bài Nghe',
        btnClass: hasAudio ? 'btn-secondary' : 'btn-disabled',
        available: hasAudio,
        action: () => {
          if (hasAudio) {
            this.selectAudioUnit(u.unit_number);
            this.openUnitAudio();
          } else {
            this.showToast(`Unit ${u.unit_number} là bài học lý thuyết/từ vựng, không có file audio.`);
          }
        }
      });

      // 6. Trạm 6: Sổ Tay Câu Sai
      const unitMistakes = (window.dataStore.mistakes || []).filter(m => m.unit_id === u.unit_number);
      stations.push({
        num: 6,
        icon: '⚡',
        title: 'Sổ Tay Câu Sai',
        desc: unitMistakes.length > 0
          ? `Bạn đang có ${unitMistakes.length} câu làm sai cần ôn lại ở Unit này.`
          : 'Xem lại các câu bạn từng làm sai trong toàn bộ khóa học để khắc phục lỗ hổng.',
        badge: unitMistakes.length > 0 ? `${unitMistakes.length} Lỗi Sai` : 'Theo Dõi',
        btnText: 'Xem Lỗi Sai',
        btnClass: 'btn-secondary',
        available: true,
        action: () => this.navigate('mistakes')
      });

      const activeCount = stations.filter(s => s.available).length;
      if (hubTitle) hubTitle.innerText = `${activeCount} Trạm Học Tập Khả Dụng`;
      if (hubSub) hubSub.innerText = `Cấu hình tự động theo nội dung thực tế của Unit ${u.unit_number}`;

      stations.forEach(s => {
        const box = document.createElement('div');
        box.className = `unit-box ${!s.available ? 'is-station-disabled' : ''}`;
        box.style.cursor = s.available ? 'pointer' : 'default';
        box.style.opacity = s.available ? '1' : '0.65';
        box.innerHTML = `
          <div class="unit-tag-row">
            <span class="unit-chip">TRẠM ${s.num}</span>
            <span style="font-size: 20px;">${s.icon}</span>
          </div>
          <div class="unit-heading" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <span>${s.title}</span>
            ${s.badge ? `<span class="status-pill ${s.badgeClass || 'status-avail'}" style="font-size: 11px; padding: 2px 8px; font-weight: 700;">${s.badge}</span>` : ''}
          </div>
          <div class="unit-meta-sub">${s.desc}</div>
          <button class="apple-btn ${s.btnClass}" style="margin-top: auto; ${!s.available ? 'cursor: not-allowed;' : ''}">${s.btnText}</button>
        `;
        box.onclick = () => s.action();
        hubContainer.appendChild(box);
      });
    }

    // Sync dropdowns
    const vSel = document.getElementById('vocab-unit-select');
    if (vSel) vSel.value = u.unit_number;
    const gSel = document.getElementById('grammar-unit-select');
    if (gSel) gSel.value = u.unit_number;
    const tSel = document.getElementById('test-unit-select');
    if (tSel) tSel.value = u.unit_number;

    // Smart contextual navigation: stay on current learning view if active
    if (this.currentView === 'vocabulary') {
      this.switchVocabUnit(u.unit_number);
      return;
    }
    if (this.currentView === 'grammar') {
      this.switchGrammarUnit(u.unit_number);
      return;
    }
    if (this.currentView === 'videos') {
      this.loadTheaterVideo(u.unit_number);
      return;
    }
    if (this.currentView === 'tests') {
      this.renderPdfOnlineExam(u.unit_number);
      return;
    }

    this.navigate('unit-hub');
  }

  handleUnitVideo() {
    const u = window.dataStore.getCurrentUnit();
    if (!u.has_video || u.unit_number === 12 || u.unit_number === 13) {
      alert('Video bài giảng hiện chưa có trong bộ dữ liệu gốc của Unit này.');
      return;
    }
    this.navigate('videos');
    this.loadTheaterVideo(u.unit_number);
  }

  openUnitVocab() {
    const curU = window.dataStore.currentUnitId || 1;
    this.syncCurrentUnit(curU, 'vocabulary');
    this.switchVocabUnit(curU);
    this.navigate('vocabulary');
  }

  openUnitGrammar() {
    const curU = window.dataStore.currentUnitId || 1;
    this.syncCurrentUnit(curU, 'grammar');
    this.switchGrammarUnit(curU);
    this.navigate('grammar');
  }

  openUnitAudio() {
    this.navigate('audio');
  }

  openGrammarUnit(unitId) {
    const uid = parseInt(unitId) || 1;
    this.syncCurrentUnit(uid, 'grammar');
    this.switchGrammarUnit(uid);
    this.navigate('grammar');
  }

  openUnitTest(unitId) {
    const uid = parseInt(unitId) || 1;
    this.syncCurrentUnit(uid, 'tests');
    this.navigate('tests');
    this.renderPdfOnlineExam(uid);
  }

  // ==========================================
  // IN-APP VIDEO THEATER
  // ==========================================
  initVideoPlayer() {
    const video = document.getElementById('embedded-video-player');
    if (!video) return;
    this.videoElement = video;

    // Restore preferred video volume (Default 0.45 = 45% comfortable level)
    const savedVol = localStorage.getItem('smob_video_volume');
    const initVol = savedVol !== null ? parseFloat(savedVol) : 0.45;
    video.volume = initVol;
    const volSlider = document.getElementById('vid-vol-slider');
    if (volSlider) volSlider.value = initVol;

    // Restore preferred playback speed
    const savedSpeed = parseFloat(localStorage.getItem('smob_video_speed') || '1.0');
    video.playbackRate = savedSpeed;
    this.updateSpeedButtonsUi(savedSpeed);

    // Restore preferred video fit mode (contain vs cover)
    const savedFitMode = localStorage.getItem('smob_video_fit_mode') || 'contain';
    const screenWrapper = document.getElementById('video-screen-wrapper');
    const fitBtn = document.getElementById('btn-vid-fit');
    if (screenWrapper && savedFitMode === 'cover') {
      screenWrapper.classList.add('fit-cover');
      if (fitBtn) {
        fitBtn.innerHTML = '🔳 Lấp Đầy';
        fitBtn.title = 'Đang ở chế độ Lấp đầy (Bấm để chuyển về Vừa khung)';
      }
    }

    video.addEventListener('timeupdate', () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        const fill = document.getElementById('vid-scrubber-fill');
        if (fill) fill.style.width = `${percent}%`;

        const curStr = this.formatTime(video.currentTime);
        const durStr = this.formatTime(video.duration);
        const timeDisplay = document.getElementById('vid-time-display');
        if (timeDisplay) timeDisplay.innerText = `${curStr} / ${durStr}`;

        // Throttled persistence of playback state every 2 seconds
        const now = Date.now();
        if (!this._lastVideoSaveTime || now - this._lastVideoSaveTime > 2000) {
          this._lastVideoSaveTime = now;
          this.saveVideoPlaybackState(this.currentPlayingUnit);
        }
      }
    });

    video.addEventListener('play', () => {
      const btn = document.getElementById('btn-vid-play');
      if (btn) btn.innerText = '⏸ Tạm Dừng';
      const centerBtn = document.getElementById('video-big-center-btn');
      if (centerBtn) centerBtn.style.display = 'none';
      this.showVideoFeedback('▶');
    });

    video.addEventListener('pause', () => {
      this.saveVideoPlaybackState(this.currentPlayingUnit);
      const btn = document.getElementById('btn-vid-play');
      if (btn) btn.innerText = '▶ Phát';
      const centerBtn = document.getElementById('video-big-center-btn');
      if (centerBtn) centerBtn.style.display = 'flex';
      this.showVideoFeedback('⏸');
    });

    video.addEventListener('ended', () => {
      this.saveVideoPlaybackState(this.currentPlayingUnit, true);
      const btn = document.getElementById('btn-vid-play');
      if (btn) btn.innerText = '↺ Phát Lại';
      const centerBtn = document.getElementById('video-big-center-btn');
      if (centerBtn) centerBtn.style.display = 'flex';
    });

    video.addEventListener('loadedmetadata', () => {
      const errBox = document.getElementById('video-error-fallback');
      if (errBox) errBox.style.display = 'none';
    });

    window.addEventListener('beforeunload', () => {
      this.saveVideoPlaybackState(this.currentPlayingUnit);
    });

    video.addEventListener('error', (e) => {
      console.warn('HTML5 Video player warning/fallback:', e);
      const wrapper = document.getElementById('video-screen-wrapper');
      if (!wrapper) return;
      let errBox = document.getElementById('video-error-fallback');
      if (!errBox) {
        errBox = document.createElement('div');
        errBox.id = 'video-error-fallback';
        errBox.className = 'video-error-box';
        wrapper.appendChild(errBox);
      }
      errBox.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 12px;">🎬</div>
        <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">Video Bài Giảng Unit ${this.currentPlayingUnit || 1} Đã Sẵn Sàng</div>
        <div style="font-size: 13.5px; color: rgba(255,255,255,0.85); margin-bottom: 18px; max-width: 500px; line-height: 1.6;">
          Phần mềm hỗ trợ phát video native chuẩn MP4 chất lượng cao bằng trình phát Windows (Windows Media Player / Movies & TV) mượt mà 100%.
        </div>
        <button class="apple-btn btn-primary" onclick="event.stopPropagation(); window.smobApp.launchExternalVideo()" style="padding: 12px 26px; font-size: 14.5px; font-weight: 800; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,113,227,0.5);">
          ▶ Mở Bằng Trình Phát Video Ngoài Máy
        </button>
      `;
      errBox.style.display = 'flex';
    });
  }

  saveVideoPlaybackState(unitId, isEnded = false) {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video || !unitId || isNaN(video.duration) || video.duration <= 5) return;
    const pos = isEnded ? 0 : video.currentTime;
    const dur = video.duration;
    const isCompleted = isEnded || (pos >= dur * 0.92);
    const state = {
      unitId: parseInt(unitId),
      currentTime: pos,
      duration: dur,
      completed: isCompleted,
      lastWatched: Date.now()
    };
    try {
      localStorage.setItem(`smob_vid_state_${unitId}`, JSON.stringify(state));
      localStorage.setItem(`smob_vid_pos_${unitId}`, String(pos));
      localStorage.setItem('smob_last_playing_unit', String(unitId));
      this.updateVideoPlaylistItemBadge(unitId, state);
    } catch(e) {}
  }

  updateVideoPlaylistItemBadge(unitId, state) {
    const item = document.querySelector(`.playlist-item[data-unit-id="${unitId}"]`);
    if (!item) return;
    let badgeContainer = item.querySelector('.video-history-badge');
    if (!badgeContainer) {
      const subDiv = item.querySelector('.playlist-sub-line');
      if (subDiv) {
        badgeContainer = document.createElement('span');
        badgeContainer.className = 'video-history-badge';
        subDiv.appendChild(badgeContainer);
      }
    }
    if (badgeContainer && state) {
      if (state.completed) {
        badgeContainer.innerHTML = '<span style="font-size: 10px; font-weight: 700; background: #e6f4ea; color: #137333; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">✓ Đã xem</span>';
      } else if (state.currentTime > 5 && state.duration) {
        const pct = Math.round((state.currentTime / state.duration) * 100);
        badgeContainer.innerHTML = `<span style="font-size: 10px; font-weight: 700; background: #e8f0fe; color: #1a73e8; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${pct}% (${this.formatTime(state.currentTime)})</span>`;
      }
    }
  }

  showVideoFeedback(iconText) {
    const icon = document.getElementById('video-feedback-icon');
    if (!icon) return;
    icon.innerText = iconText;
    icon.classList.add('show');
    clearTimeout(this._videoFeedbackTimer);
    this._videoFeedbackTimer = setTimeout(() => {
      icon.classList.remove('show');
    }, 550);
  }

  toggleVideoFitMode() {
    const wrapper = document.getElementById('video-screen-wrapper');
    const btn = document.getElementById('btn-vid-fit');
    if (!wrapper) return;
    const isCover = wrapper.classList.toggle('fit-cover');
    const newMode = isCover ? 'cover' : 'contain';
    if (btn) {
      btn.innerHTML = isCover ? '🔳 Lấp Đầy' : '🔲 Vừa Khung';
      btn.title = isCover ? 'Đang ở chế độ Lấp đầy (Bấm để chuyển về Vừa khung)' : 'Đang ở chế độ Vừa khung (Bấm để chuyển sang Lấp đầy)';
    }
    try {
      localStorage.setItem('smob_video_fit_mode', newMode);
    } catch(e) {}
    this.showToast(isCover ? '📺 Hiển thị: Lấp đầy khung 16:9' : '📺 Hiển thị: Vừa vặn nguyên bản');
  }

  loadTheaterVideo(unitId) {
    const uid = parseInt(unitId) || 1;
    this.currentPlayingUnit = uid;
    const u = window.dataStore.getUnit(uid);
    if (!u) return;

    // Update playlist active item unconditionally
    document.querySelectorAll('.playlist-item').forEach(item => {
      const isActive = item.getAttribute('data-unit-id') === String(uid);
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });

    document.getElementById('theater-unit-title').innerText = `Unit ${uid}: ${u.title.toUpperCase()}`;
    document.getElementById('theater-unit-sub').innerText = `Giáo viên: Cô Vũ Thị Mai Phương • ${u.stage_name} • File: ${u.source_trace?.video_file || 'mp4'}`;

    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video) return;

    const errBox = document.getElementById('video-error-fallback');
    if (errBox) errBox.style.display = 'none';

    if (uid === 12 || uid === 13 || !u.has_video) {
      video.pause();
      video.removeAttribute('src');
      video.load();

      const wrapper = document.getElementById('video-screen-wrapper');
      let errBox = document.getElementById('video-error-fallback');
      if (!errBox && wrapper) {
        errBox = document.createElement('div');
        errBox.id = 'video-error-fallback';
        errBox.className = 'video-error-box';
        wrapper.appendChild(errBox);
      }
      if (errBox) {
        errBox.style.display = 'flex';
        errBox.innerHTML = `
          <div style="font-size: 40px; margin-bottom: 12px;">📚</div>
          <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Unit ${uid}: Video bài giảng hiện chưa có trong tài liệu gốc</div>
          <div style="font-size: 13.5px; color: rgba(255,255,255,0.8); margin-bottom: 20px; max-width: 480px; text-align: center; line-height: 1.5;">
            Bài học này có đầy đủ Lý thuyết ngữ pháp, Từ vựng trọng tâm và Đề thi online 100% tài liệu gốc của Cô Mai Phương. Bạn có thể chuyển sang học lý thuyết hoặc làm bài tập ngay nhé!
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <button class="apple-btn btn-primary" onclick="window.smobApp.openGrammarUnit(${uid})">
              📖 Xem Lý Thuyết Ngữ Pháp
            </button>
            <button class="apple-btn btn-secondary" onclick="window.smobApp.openUnitTest(${uid})">
              📝 Làm Đề Thi Online
            </button>
          </div>
        `;
      }
      // Update playlist active item
      document.querySelectorAll('.playlist-item').forEach(item => {
        const isActive = item.getAttribute('data-unit-id') === String(uid);
        item.classList.toggle('active', isActive);
        if (isActive) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
      return;
    }

    // Retrieve saved state
    let state = null;
    try {
      const raw = localStorage.getItem(`smob_vid_state_${uid}`);
      if (raw) state = JSON.parse(raw);
    } catch(e) {}

    const banner = document.getElementById('video-resume-banner');
    const bannerText = document.getElementById('video-resume-text');

    // Restore speed preference
    const savedSpeed = parseFloat(localStorage.getItem('smob_video_speed') || '1.0');
    video.playbackRate = savedSpeed;
    this.updateSpeedButtonsUi(savedSpeed);

    // Apply video volume (Default 0.45 or saved preference)
    const savedVol = localStorage.getItem('smob_video_volume');
    const initVol = savedVol !== null ? parseFloat(savedVol) : 0.45;
    video.volume = initVol;
    const volSlider = document.getElementById('vid-vol-slider');
    if (volSlider) volSlider.value = initVol;

    // Set local streaming URL from desktop media server
    video.src = `/video/${uid}`;
    video.load();

    video.onloadedmetadata = () => {
      const errBox = document.getElementById('video-error-fallback');
      if (errBox) errBox.style.display = 'none';

      // Smart resume logic: automatically seek and resume if watched > 5s and not completed
      if (state && !state.completed && state.currentTime > 5 && state.currentTime < (video.duration - 10)) {
        this._pendingResumePos = state.currentTime;
        video.currentTime = state.currentTime;
        this.showToast(`⏱️ Đang phát tiếp từ ${this.formatTime(state.currentTime)} (Unit ${uid})`);
        if (banner && bannerText) {
          bannerText.innerText = `Đang phát tiếp từ ${this.formatTime(state.currentTime)} (Tổng ${this.formatTime(video.duration)}).`;
          banner.style.display = 'flex';
          clearTimeout(this._resumeBannerTimeout);
          this._resumeBannerTimeout = setTimeout(() => {
            if (banner) banner.style.display = 'none';
          }, 8000);
        }
      } else {
        this._pendingResumePos = 0;
        if (banner) banner.style.display = 'none';
      }
    };
    video.play().catch(e => console.log('Autoplay handled:', e));

    // Update playlist active item
    document.querySelectorAll('.playlist-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-unit-id') === String(uid));
    });
  }

  resumeVideoPlayback(shouldResume) {
    const banner = document.getElementById('video-resume-banner');
    if (banner) banner.style.display = 'none';
    clearTimeout(this._resumeBannerTimeout);
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video) return;

    if (shouldResume && this._pendingResumePos > 0) {
      video.currentTime = this._pendingResumePos;
      this.showVideoFeedback(`⏩ Xem tiếp: ${this.formatTime(this._pendingResumePos)}`);
    } else {
      video.currentTime = 0;
      this.showVideoFeedback('↺ Xem từ đầu');
    }
    video.play().catch(() => {});
  }

  closeResumeBanner() {
    const banner = document.getElementById('video-resume-banner');
    if (banner) banner.style.display = 'none';
    clearTimeout(this._resumeBannerTimeout);
  }

  toggleMiniVideoPlayer() {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else if (video.requestPictureInPicture) {
      video.requestPictureInPicture().catch(err => {
        console.log('PiP fallback to in-app dock:', err);
        this.showMiniVideoDock();
      });
    } else {
      this.showMiniVideoDock();
    }
  }

  showMiniVideoDock() {
    if (this.isSplitViewOpen) {
      this.closeSplitView();
    }
    const dock = document.getElementById('floating-video-dock');
    const container = document.getElementById('mini-video-container');
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!dock || !container || !video || !video.src) return;

    const u = window.dataStore.getUnit(this.currentPlayingUnit);
    const titleEl = document.getElementById('mini-video-title');
    if (titleEl) titleEl.innerText = `Unit ${this.currentPlayingUnit}: ${u ? u.title : ''}`;

    if (video.parentElement !== container) {
      container.appendChild(video);
    }
    dock.style.display = 'flex';
    this.isMiniVideoOpen = true;
  }

  restoreVideoToTheater() {
    if (this.isSplitViewOpen) {
      this.closeSplitView();
    }
    const dock = document.getElementById('floating-video-dock');
    const mainWrapper = document.getElementById('video-screen-wrapper');
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (dock) dock.style.display = 'none';
    if (mainWrapper && video && video.parentElement !== mainWrapper) {
      mainWrapper.insertBefore(video, mainWrapper.firstChild);
    }
    this.isMiniVideoOpen = false;
    if (this.currentView !== 'videos') {
      this.navigate('videos');
    }
  }

  closeMiniVideoPlayer() {
    if (this.isSplitViewOpen) {
      this.closeSplitView();
    }
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (video) video.pause();
    const dock = document.getElementById('floating-video-dock');
    if (dock) dock.style.display = 'none';
    const mainWrapper = document.getElementById('video-screen-wrapper');
    if (mainWrapper && video && video.parentElement !== mainWrapper) {
      mainWrapper.insertBefore(video, mainWrapper.firstChild);
    }
    this.isMiniVideoOpen = false;
  }

  // ==========================================
  // SPLIT VIEW CONTROLLER (SÁCH + VIDEO BÀI GIẢNG)
  // ==========================================
  toggleSplitView() {
    if (this.isSplitViewOpen) {
      this.closeSplitView();
    } else {
      this.openSplitView();
    }
  }

  openSplitView(targetUnit = null) {
    const curU = targetUnit || window.dataStore.currentUnitId || this.currentPlayingUnit || 1;
    if (this.currentView !== 'grammar') {
      this.navigate('grammar');
    }

    this.isSplitViewOpen = true;
    const layout = document.getElementById('grammar-split-layout-box');
    const rightPane = document.getElementById('grammar-split-right-pane');
    const splitWrapper = document.getElementById('split-video-wrapper');
    const btnGm = document.getElementById('btn-gm-split-view');
    const btnVid = document.getElementById('btn-vid-split');

    if (layout) layout.classList.add('split-active');
    if (rightPane) rightPane.style.display = 'flex';

    if (btnGm) {
      btnGm.classList.add('active');
      btnGm.innerHTML = '◫ Đang Xem Đôi';
      btnGm.style.background = 'var(--accent)';
      btnGm.style.color = '#ffffff';
    }
    if (btnVid) btnVid.classList.add('active');

    // Close floating dock if open
    const dock = document.getElementById('floating-video-dock');
    if (dock) dock.style.display = 'none';
    this.isMiniVideoOpen = false;

    // Ensure video element is inside video-screen-wrapper
    const video = this.videoElement || document.getElementById('embedded-video-player');
    const screenWrapper = document.getElementById('video-screen-wrapper');
    if (screenWrapper && video && video.parentElement !== screenWrapper) {
      screenWrapper.insertBefore(video, screenWrapper.firstChild);
    }

    // Move entire video stage container (screen + controls) into splitWrapper
    const stage = document.getElementById('video-stage-container');
    if (splitWrapper && stage && stage.parentElement !== splitWrapper) {
      splitWrapper.appendChild(stage);
    }

    // Update split title
    const u = window.dataStore.getUnit(curU);
    const titleEl = document.getElementById('split-video-title');
    if (titleEl && u) {
      titleEl.innerText = `Unit ${curU}: ${u.title}`;
    }

    // Load or ensure video is playing
    if (!video.src || this.currentPlayingUnit !== curU) {
      this.loadTheaterVideo(curU);
    } else if (video.paused) {
      video.play().catch(() => {});
    }

    this.showToast(`◫ Đã bật Chế Độ Xem Đôi: Vừa đọc sách vừa xem video Unit ${curU}`);
  }

  closeSplitView() {
    this.isSplitViewOpen = false;
    const layout = document.getElementById('grammar-split-layout-box');
    const rightPane = document.getElementById('grammar-split-right-pane');
    const leftPane = document.getElementById('grammar-split-left-pane');
    const btnGm = document.getElementById('btn-gm-split-view');
    const btnVid = document.getElementById('btn-vid-split');

    if (layout) layout.classList.remove('split-active');
    if (rightPane) rightPane.style.display = 'none';
    if (leftPane) {
      leftPane.style.flex = '';
      leftPane.style.width = '100%';
    }

    if (btnGm) {
      btnGm.classList.remove('active');
      btnGm.innerHTML = '◫ Xem Đôi Cùng Video';
      btnGm.style.background = '';
      btnGm.style.color = '';
    }
    if (btnVid) btnVid.classList.remove('active');

    // Restore video stage container back to main theater player box
    const stage = document.getElementById('video-stage-container');
    const mainPlayerBox = document.getElementById('main-video-player-box');
    const metaBar = document.getElementById('video-meta-bar');
    if (mainPlayerBox && stage && stage.parentElement !== mainPlayerBox) {
      if (metaBar) {
        mainPlayerBox.insertBefore(stage, metaBar);
      } else {
        mainPlayerBox.appendChild(stage);
      }
    }

    // Also ensure video is inside video-screen-wrapper
    const mainWrapper = document.getElementById('video-screen-wrapper');
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (mainWrapper && video && video.parentElement !== mainWrapper) {
      mainWrapper.insertBefore(video, mainWrapper.firstChild);
    }

    this.showToast('✕ Đã tắt Xem Đôi. Trở về toàn màn hình sách giáo trình.');
  }

  expandSplitToFullVideo() {
    this.closeSplitView();
    this.navigate('videos');
    this.showToast('⤢ Đã mở rộng toàn màn hình Video Bài Giảng');
  }

  openSplitViewFromPiP() {
    const uid = this.currentPlayingUnit || window.dataStore.currentUnitId || 1;
    this.closeMiniVideoPlayer();
    this.openSplitView(uid);
  }

  initSplitViewResizer() {
    const divider = document.getElementById('grammar-split-divider');
    const layout = document.getElementById('grammar-split-layout-box');
    const leftPane = document.getElementById('grammar-split-left-pane');
    const rightPane = document.getElementById('grammar-split-right-pane');
    if (!divider || !layout || !leftPane || !rightPane) return;

    divider.addEventListener('mousedown', (e) => {
      e.preventDefault();
      divider.classList.add('is-dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const layoutRect = layout.getBoundingClientRect();
      const totalWidth = layoutRect.width;

      const onMouseMove = (ev) => {
        const offsetLeft = ev.clientX - layoutRect.left;
        const percentLeft = (offsetLeft / totalWidth) * 100;
        if (percentLeft >= 25 && percentLeft <= 75) {
          leftPane.style.flex = `0 0 ${percentLeft}%`;
          rightPane.style.flex = `0 0 ${100 - percentLeft}%`;
        }
      };

      const onMouseUp = () => {
        divider.classList.remove('is-dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // ==========================================
  // FLOATING MINI VIDEO DOCK INTERACTIONS (DRAGGABLE & RESIZABLE PIP)
  // ==========================================
  initFloatingVideoInteractions() {
    const dock = document.getElementById('floating-video-dock');
    const dragHandle = document.getElementById('floating-dock-drag-handle');
    const resizeHandle = document.getElementById('floating-dock-resize-handle');
    if (!dock || !dragHandle) return;

    // Restore saved width and position
    try {
      const savedWidth = localStorage.getItem('smob_pip_width');
      if (savedWidth) {
        const w = parseInt(savedWidth, 10);
        if (w >= 260 && w <= 750) {
          dock.style.width = `${w}px`;
        }
      }
      const savedPos = JSON.parse(localStorage.getItem('smob_pip_pos') || 'null');
      if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number') {
        const maxL = Math.max(10, window.innerWidth - (dock.offsetWidth || 360) - 10);
        const maxT = Math.max(10, window.innerHeight - (dock.offsetHeight || 220) - 10);
        dock.style.left = `${Math.min(Math.max(10, savedPos.left), maxL)}px`;
        dock.style.top = `${Math.min(Math.max(10, savedPos.top), maxT)}px`;
        dock.style.right = 'auto';
        dock.style.bottom = 'auto';
      }
    } catch (e) {}

    // Dragging interaction
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    dragHandle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('.ctrl-btn')) return;
      isDragging = true;
      dock.classList.add('is-dragging');

      const rect = dock.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      startX = e.clientX;
      startY = e.clientY;

      dock.style.left = `${initialLeft}px`;
      dock.style.top = `${initialTop}px`;
      dock.style.right = 'auto';
      dock.style.bottom = 'auto';

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const maxL = Math.max(10, window.innerWidth - dock.offsetWidth - 10);
        const maxT = Math.max(10, window.innerHeight - dock.offsetHeight - 10);
        const newL = Math.min(Math.max(10, initialLeft + dx), maxL);
        const newT = Math.min(Math.max(10, initialTop + dy), maxT);
        dock.style.left = `${newL}px`;
        dock.style.top = `${newT}px`;
      };

      const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        dock.classList.remove('is-dragging');
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        try {
          localStorage.setItem('smob_pip_pos', JSON.stringify({
            left: parseInt(dock.style.left, 10),
            top: parseInt(dock.style.top, 10)
          }));
        } catch (err) {}
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Resizing interaction
    if (resizeHandle) {
      let isResizing = false;
      let rStartX = 0, rStartW = 0;

      resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        isResizing = true;
        rStartX = e.clientX;
        rStartW = dock.offsetWidth;
        dock.classList.add('is-dragging');

        const onResizeMove = (ev) => {
          if (!isResizing) return;
          const dw = ev.clientX - rStartX;
          const maxW = Math.min(750, window.innerWidth - 40);
          const newW = Math.min(Math.max(260, rStartW + dw), maxW);
          dock.style.width = `${newW}px`;
        };

        const onResizeUp = () => {
          if (!isResizing) return;
          isResizing = false;
          dock.classList.remove('is-dragging');
          window.removeEventListener('mousemove', onResizeMove);
          window.removeEventListener('mouseup', onResizeUp);
          try {
            localStorage.setItem('smob_pip_width', dock.offsetWidth);
          } catch (err) {}
        };

        window.addEventListener('mousemove', onResizeMove);
        window.addEventListener('mouseup', onResizeUp);
      });
    }
  }

  toggleVideoPlay() {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video || !video.src) return;
    if (video.paused) {
      video.play().catch(e => console.log(e));
    } else {
      video.pause();
    }
  }

  skipVideo(seconds) {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video || !video.duration) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  }

  seekVideo(e) {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video || !video.duration) return;
    const bar = document.getElementById('vid-scrubber-bar');
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = percent * video.duration;
  }

  setVideoSpeed(speed, btnElement) {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    const rate = parseFloat(speed);
    if (video) video.playbackRate = rate;

    try {
      localStorage.setItem('smob_video_speed', String(rate));
    } catch(e) {}

    this.updateSpeedButtonsUi(rate);
    this.showVideoFeedback(`${rate}x`);
  }

  updateSpeedButtonsUi(rate) {
    document.querySelectorAll('#video-speed-group .speed-btn').forEach(btn => {
      const btnSpeed = parseFloat(btn.getAttribute('data-speed'));
      btn.classList.toggle('active', Math.abs(btnSpeed - rate) < 0.01);
    });
  }

  setVideoVolume(vol) {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    const v = Math.max(0, Math.min(1, parseFloat(vol)));
    if (video) video.volume = v;
    try {
      localStorage.setItem('smob_video_volume', String(v));
    } catch(e) {}
    const volSlider = document.getElementById('vid-vol-slider');
    if (volSlider) volSlider.value = v;
  }

  toggleVideoMute() {
    const video = this.videoElement || document.getElementById('embedded-video-player');
    if (!video) return;
    video.muted = !video.muted;
    const btn = document.getElementById('btn-vid-mute');
    if (btn) btn.innerText = video.muted ? '🔇' : '🔊';
  }

  toggleVideoFullscreen() {
    const wrapper = document.getElementById('video-screen-wrapper');
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(err => alert(`Fullscreen error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  }

  launchExternalVideo() {
    const u = window.dataStore.getUnit(this.currentPlayingUnit);
    if (!u) return;
    if (window.pywebview && window.pywebview.api) {
      window.pywebview.api.launch_video(u.unit_number);
      window.smobApp.showToast(`🚀 Đang mở video bài giảng Unit ${u.unit_number}...`);
    } else {
      alert(`🎬 Bạn đang chạy trên trình duyệt web.\nHãy khởi động ứng dụng bằng file "SMOB English Lab v2.5.exe" hoặc click đúp "Chay_Phan_Mem.bat" để mở video trực tiếp bằng player mặc định của Windows!`);
    }
  }

  renderVideoTheaterPlaylist() {
    const container = document.getElementById('theater-playlist-container');
    if (!container) return;
    container.innerHTML = '';

    const units = window.dataStore.units;
    units.forEach(u => {
      const item = document.createElement('div');
      item.className = `playlist-item ${u.unit_number === this.currentPlayingUnit ? 'active' : ''}`;
      item.setAttribute('data-unit-id', String(u.unit_number));
      const hasVid = u.has_video && ![12, 13].includes(u.unit_number);

      let historyBadge = '';
      try {
        const raw = localStorage.getItem(`smob_vid_state_${u.unit_number}`);
        if (raw) {
          const st = JSON.parse(raw);
          if (st.completed) {
            historyBadge = '<span class="playlist-history-tag tag-done">✓ Đã xem</span>';
          } else if (st.currentTime > 5 && st.duration) {
            const pct = Math.round((st.currentTime / st.duration) * 100);
            historyBadge = `<span class="playlist-history-tag tag-progress">${pct}% (${this.formatTime(st.currentTime)})</span>`;
          }
        }
      } catch(e){}

      item.innerHTML = `
        <span class="playlist-item-num">Unit ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}</span>
        <div class="playlist-item-info">
          <div class="playlist-item-title" title="Unit ${u.unit_number}: ${this.escapeHtml(u.title)}">${this.escapeHtml(u.title)}</div>
          <div class="playlist-item-sub">
            <span class="playlist-status-pill ${hasVid ? 'status-avail' : 'status-missing'}">${hasVid ? '● Sẵn sàng' : '○ Chưa có'}</span>
            ${historyBadge}
          </div>
        </div>
      `;
      item.onclick = () => {
        this.syncCurrentUnit(u.unit_number, 'videos');
        this.loadTheaterVideo(u.unit_number);
      };
      container.appendChild(item);
    });
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  // ==========================================
  // VOCABULARY & FLASHCARDS (QUIZLET-STYLE)
  // ==========================================
  switchVocabUnitOffset(offset) {
    const cur = window.dataStore.currentUnitId || 1;
    let next = cur + offset;
    if (next < 1) next = 48;
    if (next > 48) next = 1;
    this.switchVocabUnit(next);
  }

  switchVocabUnit(unitId) {
    const uid = parseInt(unitId) || 1;
    this.syncCurrentUnit(uid, 'vocabulary');
    const u = window.dataStore.getUnit(uid);
    if (!u) return;

    const select = document.getElementById('vocab-unit-select');
    if (select && parseInt(select.value) !== uid) {
      select.value = uid;
    }

    this._fullUnitVocabList = Array.isArray(u.vocabulary) ? [...u.vocabulary] : [];
    this._fcOnlyStarred = false;
    const btnStarred = document.getElementById('btn-fc-filter-starred');
    if (btnStarred) btnStarred.classList.remove('active');

    this.vocabList = [...this._fullUnitVocabList];
    this.currentVocabIndex = 0;
    this.isCardFlipped = false;

    if (this.isAutoplaying) {
      clearInterval(this.autoplayTimer);
      this.isAutoplaying = false;
      const btn = document.getElementById('btn-fc-autoplay');
      if (btn) btn.innerText = '▶';
    }

    // Reset card orientation
    const cardObj = document.getElementById('flashcard-obj');
    if (cardObj) cardObj.classList.remove('is-flipped');

    // Make sure flashcard area is visible and test runner is hidden
    const runner = document.getElementById('vocab-quizlet-test-runner');
    if (runner) runner.style.display = 'none';
    const res = document.getElementById('vocab-quizlet-result-screen');
    if (res) res.style.display = 'none';
    const fcArea = document.getElementById('vocab-flashcard-area');
    if (fcArea) fcArea.style.display = 'block';

    if (this.vocabList.length === 0) {
      const counterEl = document.getElementById('fc-counter');
      if (counterEl) counterEl.innerText = `Unit ${uid}: Đang cập nhật từ vựng`;
      const wordEl = document.getElementById('fc-word');
      if (wordEl) wordEl.innerText = `Unit ${uid}`;
      const ipaEl = document.getElementById('fc-ipa');
      if (ipaEl) ipaEl.innerText = '';
      const posEl = document.getElementById('fc-pos');
      if (posEl) posEl.innerText = '';
      const meanEl = document.getElementById('fc-meaning');
      if (meanEl) meanEl.innerText = `Bài học này tập trung vào lý thuyết & bài tập.`;
      const exEl = document.getElementById('fc-example');
      if (exEl) exEl.innerText = `Hãy mở tab Ngữ Pháp để đọc toàn bộ giáo trình Unit ${uid}.`;
      const trEl = document.getElementById('fc-translation');
      if (trEl) trEl.innerText = '';
      const pbar = document.getElementById('fc-progress-bar');
      if (pbar) pbar.style.width = `100%`;
      return;
    }

    this.renderVocabStage();
    this.updateVocabStarredCountBadge();
  }

  setVocabMode(mode) {
    this.vocabMode = mode;
    this.closeUnansweredModal();
    const btnFc = document.getElementById('btn-mode-fc');
    if (btnFc) btnFc.classList.toggle('active', mode === 'flashcard');
    const btnLearn = document.getElementById('btn-mode-learn');
    if (btnLearn) btnLearn.classList.toggle('active', mode === 'learn');

    const vocabToolbar = document.getElementById('vocab-sticky-toolbar');
    if (vocabToolbar) vocabToolbar.style.display = 'flex';
    const fcProg = document.getElementById('fc-progress-container');
    if (fcProg) fcProg.style.display = (mode === 'flashcard') ? 'block' : 'none';

    const fcArea = document.getElementById('vocab-flashcard-area');
    if (fcArea) fcArea.style.display = (mode === 'flashcard') ? 'block' : 'none';
    const quizArea = document.getElementById('vocab-quiz-area');
    if (quizArea) quizArea.style.display = (mode === 'learn') ? 'block' : 'none';
    const runner = document.getElementById('vocab-quizlet-test-runner');
    if (runner) runner.style.display = 'none';
    const res = document.getElementById('vocab-quizlet-result-screen');
    if (res) res.style.display = 'none';

    if (mode === 'learn') {
      this.renderVocabQuiz();
    } else {
      this.renderVocabStage();
    }
  }

  getWordIllustration(word) {
    const w = (word || '').toLowerCase().trim();
    const map = {
      'i': '🙋', 'you': '👉', 'we': '👥', 'they': '👨‍👩‍👧‍👦', 'he': '👨', 'she': '👩', 'it': '📦',
      'student': '👨‍🎓', 'teacher': '👩‍🏫', 'brother': '👦', 'baby': '👶', 'car': '🚗',
      'book': '📖', 'orange': '🍊', 'apple': '🍎', 'tall': '🦒', 'short': '🤏',
      'happy': '😊', 'sad': '😢', 'family': '👨‍👩‍👧', 'friend': '🤝', 'dog': '🐶',
      'cat': '🐱', 'school': '🏫', 'house': '🏠', 'home': '🏡', 'work': '💼',
      'water': '💧', 'food': '🍲', 'time': '⏰', 'day': '☀️', 'night': '🌙',
      'music': '🎵', 'doctor': '👨‍⚕️', 'nurse': '👩‍⚕️', 'hospital': '🏥',
      'city': '🏙️', 'country': '🌾', 'money': '💵', 'tree': '🌳', 'flower': '🌸',
      'sun': '☀️', 'moon': '🌙', 'star': '⭐', 'sky': '☁️', 'rain': '🌧️',
      'bus': '🚌', 'train': '🚆', 'plane': '✈️', 'ship': '🚢', 'bicycle': '🚲',
      'computer': '💻', 'phone': '📱', 'pen': '🖊️', 'pencil': '✏️', 'room': '🚪',
      'table': '🪑', 'chair': '🪑', 'window': '🪟', 'door': '🚪', 'bed': '🛏️'
    };
    if (map[w]) return map[w];
    for (let key in map) {
      if (w.includes(key)) return map[key];
    }
    const defaults = ['📘', '✨', '🎯', '💡', '🌟', '📌', '🚀', '🔑', '🌈', '🧩'];
    let sum = 0;
    for (let i = 0; i < w.length; i++) sum += w.charCodeAt(i);
    return defaults[sum % defaults.length];
  }

  getPexelsPhotoId(word) {
    const map = {
      "student": 1438072, "teacher": 5212345, "doctor": 4173251, "nurse": 4386466,
      "engineer": 3862130, "lawyer": 5668473, "firefighter": 699459, "police": 2422290,
      "baby": 3270223, "children": 1001914, "family": 1128318, "friend": 1181519,
      "brother": 1416736, "grandfather": 3831645, "grandmother": 2050994, "parent": 1682497,
      "son": 1682497, "daughter": 1462630, "car": 112460, "bus": 1178448,
      "train": 2790396, "plane": 358319, "airplane": 358319, "bicycle": 100582,
      "ship": 813011, "book": 768125, "apple": 102104, "orange": 207085,
      "banana": 2872755, "cake": 2144112, "bread": 1775043, "coffee": 302899,
      "tea": 1417945, "water": 416528, "food": 1640777, "milk": 248412,
      "rice": 4110257, "meat": 65175, "fish": 229789, "egg": 806457,
      "fruit": 1132047, "vegetable": 1435904, "dog": 1108099, "cat": 617278,
      "bird": 326900, "tree": 1632790, "flower": 1083822, "sun": 301599,
      "moon": 365633, "star": 1341279, "sky": 531756, "rain": 459451,
      "snow": 688830, "park": 417074, "garden": 589802, "house": 106399,
      "home": 106399, "kitchen": 2724749, "room": 271624, "bedroom": 271624,
      "school": 207691, "hospital": 263402, "hotel": 258154, "library": 2908984,
      "table": 890669, "chair": 116910, "desk": 1297611, "bed": 6585758,
      "sofa": 1866149, "door": 277559, "window": 1090638, "computer": 1714208,
      "phone": 699122, "pen": 261763, "pencil": 159752, "bag": 1152077,
      "clock": 2182727, "money": 259027, "happy": 3807755, "sad": 2228561,
      "tall": 1391498, "short": 1391499, "big": 1054655, "small": 3270223,
      "clean": 4108715, "work": 3184291, "play": 296301, "music": 167491,
      "read": 768125, "write": 210661, "swim": 863988, "sleep": 914910,
      "run": 2402777, "drive": 977213, "cook": 2284166, "wash": 4239091,
      "buy": 230544, "city": 466685, "country": 2166711, "sea": 994605,
      "mountain": 618833, "river": 709552, "beach": 457882, "clothes": 996329,
      "jacket": 996329, "shoes": 267301, "hat": 984619, "shirt": 297933,
      "dress": 985635, "wardrobe": 3932930, "wall": 129731, "floor": 1090638,
      "uncle": 834863, "aunt": 3768131, "cousin": 1181519, "classmate": 1438072,
      "shopping_centre": 264507, "shopping_center": 264507, "listen": 3394650,
      "speak": 7516363, "ride": 100582, "live": 106399, "teach": 5212345,
      "jog": 2402777, "wear": 996329, "finish": 2608495, "understand": 1181519,
      "rent": 106399, "rise": 301599, "set": 531756, "leave": 2790396,
      "start": 2402777, "boil": 416528, "see": 1054655, "hate": 2228561,
      "have": 259027, "picture": 1839919, "box": 4498136, "lovely": 3807755,
      "busy": 3184291, "late": 2182727, "kind": 1181519, "new": 112460, "old": 3831645
    };
    return map[word] || null;
  }

  getQuestionRequirement(q, sectionTitle = '') {
    if (q && q.requirement) return q.requirement;
    const stem = (q && q.stem) ? q.stem : '';
    const sTitle = (sectionTitle || '').toLowerCase();

    if (sTitle.includes('paraphras') || sTitle.includes('diễn đạt khác') || sTitle.includes('nguyên ý nghĩa')) {
      return 'Đọc câu gốc và chọn câu diễn đạt tương đương (Paraphrase) giữ nguyên ý nghĩa câu.';
    }
    if ((q && q.audio_track) || sTitle.includes('nghe')) {
      if (q && q.type === 'TRUE_FALSE') {
        return 'Nghe đoạn audio phía trên và tích chọn T (Đúng) hoặc F (Sai) theo nội dung bài nghe.';
      }
      if (stem.includes('_____') || stem.includes('___')) {
        return 'Nghe kỹ đoạn audio và chọn từ/cụm từ chính xác nhất để điền vào chỗ trống.';
      }
      return 'Nghe kỹ đoạn audio và chọn phương án trả lời đúng nhất (A, B hoặc C).';
    }
    if (stem.includes('_____') || stem.includes('___')) {
      if (stem.toLowerCase().includes('am') || stem.toLowerCase().includes('is') || stem.toLowerCase().includes('are') ||
          (q && q.options && q.options.some(o => /^(is|are|am|was|were|do|does|did|have|has|don\'t|doesn\'t)$/i.test((o || '').trim())))) {
        return 'Xác định chủ ngữ và quy tắc thì ngữ pháp, chọn dạng động từ đúng nhất để điền vào chỗ trống.';
      }
      return 'Đọc kỹ câu và chọn từ/cụm từ đúng ngữ pháp nhất để điền vào chỗ trống.';
    }
    if (q && q.type === 'TRUE_FALSE') {
      return 'Đọc câu nhận định và đối chiếu dữ liệu để tích chọn T (True - Đúng) hoặc F (False - Sai).';
    }
    return 'Đọc kỹ ngữ cảnh câu hỏi và chọn 1 đáp án chính xác nhất.';
  }

  renderVocabStage() {
    if (this.vocabList.length === 0) return;
    const v = this.vocabList[this.currentVocabIndex];
    if (!v) return;

    document.getElementById('fc-counter').innerText = `Từ ${this.currentVocabIndex + 1} / ${this.vocabList.length}`;
    const percent = Math.round(((this.currentVocabIndex + 1) / this.vocabList.length) * 100);
    document.getElementById('fc-progress-bar').style.width = `${percent}%`;

    // Visual Photo Image from Pexels (Local Assets / CDN) & Icon Fallback
    const imgEl = document.getElementById('fc-photo-img');
    const iconEl = document.getElementById('fc-visual-icon');
    if (imgEl) {
      const cleanWord = (v.word || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
      if (cleanWord) {
        imgEl.style.display = 'none';
        imgEl.onload = () => {
          imgEl.style.display = 'block';
          if (iconEl) iconEl.style.display = 'none';
        };
        imgEl.onerror = () => {
          if (!imgEl.dataset.triedPexels) {
            imgEl.dataset.triedPexels = '1';
            const pexelsId = this.getPexelsPhotoId(cleanWord);
            if (pexelsId) {
              imgEl.src = `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=500`;
              return;
            }
          }
          this.onVocabImageError();
        };
        imgEl.dataset.triedPexels = '';
        imgEl.src = `./assets/vocab_images/${cleanWord}.jpg`;
      } else {
        this.onVocabImageError();
      }
    }
    if (iconEl) {
      iconEl.style.display = 'flex';
      iconEl.innerText = this.getWordIllustration(v.word);
    }

    // Populate content based on card orientation
    if (!this.isReverseCard) {
      document.getElementById('fc-word').innerText = v.word;
      document.getElementById('fc-ipa').innerText = v.ipa || '/ipa/';
      document.getElementById('fc-pos').innerText = v.pos || 'từ vựng';
      document.getElementById('fc-meaning').innerText = v.meaning;
    } else {
      document.getElementById('fc-word').innerText = v.meaning;
      document.getElementById('fc-ipa').innerText = '';
      document.getElementById('fc-pos').innerText = v.pos || 'nghĩa';
      document.getElementById('fc-meaning').innerText = `${v.word} ${v.ipa || ''}`;
    }

    // Bookmark Ribbon Button state
    const starBtn = document.getElementById('fc-star-btn');
    const isStarred = window.dataStore.isVocabStarred(v.word || v.id) || (window.dataStore.userProgress?.vocabReview?.[v.id]);
    if (starBtn) {
      starBtn.classList.toggle('starred', !!isStarred);
      starBtn.title = isStarred ? 'Đã đánh dấu cần ôn (Bấm để bỏ đánh dấu)' : 'Đánh dấu từ khó / cần ôn (🔖)';
      const svg = starBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isStarred ? '#ef4444' : 'none');
        svg.setAttribute('stroke', isStarred ? '#ef4444' : 'currentColor');
      }
    }

    // Personal Note Display (Front & Back)
    const userNote = window.dataStore.getVocabNote(v.word || v.id);
    const noteEl = document.getElementById('fc-user-note');
    const noteBackEl = document.getElementById('fc-user-note-back');
    if (noteEl) {
      if (userNote) {
        noteEl.style.display = 'inline-flex';
        noteEl.innerHTML = `💡 <strong>Note:</strong> ${userNote}`;
      } else {
        noteEl.style.display = 'none';
      }
    }
    if (noteBackEl) {
      if (userNote) {
        noteBackEl.style.display = 'inline-flex';
        noteBackEl.innerHTML = `💡 <strong>Note:</strong> ${userNote}`;
      } else {
        noteBackEl.style.display = 'none';
      }
    }

    document.getElementById('fc-example').innerText = `"${v.example || 'Example sentence.'}"`;
    document.getElementById('fc-translation').innerText = v.translation || '';
    document.getElementById('fc-source-tag').innerText = `Unit ${window.dataStore.currentUnitId} (Trang ${v.source_page || 1})`;

    // Reset flip
    this.isCardFlipped = false;
    document.getElementById('flashcard-obj').classList.remove('is-flipped');
    this.updateVocabStarredCountBadge();
  }

  onVocabImageError() {
    const imgEl = document.getElementById('fc-photo-img');
    const iconEl = document.getElementById('fc-visual-icon');
    if (imgEl) imgEl.style.display = 'none';
    if (iconEl) iconEl.style.display = 'flex';
  }

  toggleFlashcardFlip() {
    this.isCardFlipped = !this.isCardFlipped;
    document.getElementById('flashcard-obj').classList.toggle('is-flipped', this.isCardFlipped);
  }

  speakCurrentWord() {
    const v = this.vocabList[this.currentVocabIndex];
    if (v && v.word) {
      window.speakWord(v.word);
    }
  }

  nextVocabCard() {
    if (!this.vocabList || this.vocabList.length === 0) return;
    if (this.currentVocabIndex < this.vocabList.length - 1) {
      this.currentVocabIndex++;
    } else {
      this.currentVocabIndex = 0;
    }
    this.renderVocabStage();
  }

  prevVocabCard() {
    if (!this.vocabList || this.vocabList.length === 0) return;
    if (this.currentVocabIndex > 0) {
      this.currentVocabIndex--;
    } else {
      this.currentVocabIndex = this.vocabList.length - 1;
    }
    this.renderVocabStage();
  }

  shuffleVocabCards() {
    this.vocabList.sort(() => Math.random() - 0.5);
    this.currentVocabIndex = 0;
    this.renderVocabStage();
  }

  pickRandomVocabWord() {
    if (!this.vocabList || this.vocabList.length === 0) {
      this.showToast('Unit này chưa có danh sách từ vựng.');
      return;
    }
    const randIdx = Math.floor(Math.random() * this.vocabList.length);
    this.currentVocabIndex = randIdx;
    this.isCardFlipped = false;
    this.renderVocabStage();
    const w = this.vocabList[randIdx];
    this.showToast(`🎲 Đã chọn từ ngẫu nhiên: ${w.word} (${w.meaning})`);
  }

  flipFlashcardDirection() {
    this.isReverseCard = !this.isReverseCard;
    this.renderVocabStage();
  }

  toggleFlashcardAutoplay() {
    const btn = document.getElementById('btn-fc-autoplay');
    if (this.isAutoplaying) {
      clearInterval(this.autoplayTimer);
      this.isAutoplaying = false;
      if (btn) btn.innerText = '▶';
    } else {
      this.isAutoplaying = true;
      if (btn) btn.innerText = '⏸';
      this.autoplayTimer = setInterval(() => {
        if (!this.isCardFlipped) {
          this.toggleFlashcardFlip();
        } else {
          if (this.currentVocabIndex < this.vocabList.length - 1) {
            this.nextVocabCard();
          } else {
            this.currentVocabIndex = 0;
            this.renderVocabStage();
          }
        }
      }, 2500);
    }
  }

  markVocab(type) {
    const v = this.vocabList[this.currentVocabIndex];
    if (!v) return;
    const key = v.word || v.id;
    if (type === 'know') {
      window.dataStore.markVocabKnown(v.id);
      if (window.dataStore.isVocabStarred(key)) {
        window.dataStore.toggleStarredVocab(key);
      }
    } else {
      window.dataStore.markVocabReview(v.id);
      if (!window.dataStore.isVocabStarred(key)) {
        window.dataStore.toggleStarredVocab(key);
      }
    }
    this.renderDashboard();
    this.updateVocabStarredCountBadge();
    this.nextVocabCard();
  }

  updateVocabStarredCountBadge() {
    const el = document.getElementById('fc-starred-count');
    if (!el) return;
    const list = this._fullUnitVocabList || this.vocabList || [];
    const count = list.filter(w => {
      const k = w.word || w.id;
      return window.dataStore.isVocabStarred(k) || (window.dataStore.userProgress?.vocabReview?.[w.id]);
    }).length;
    el.innerText = count;
  }

  toggleCurrentVocabStar() {
    if (!this.vocabList || this.vocabList.length === 0) return;
    const v = this.vocabList[this.currentVocabIndex];
    if (!v) return;
    const key = v.word || v.id;
    const isStarred = window.dataStore.toggleStarredVocab(key);
    const starBtn = document.getElementById('fc-star-btn');
    if (starBtn) {
      starBtn.classList.toggle('starred', isStarred);
      starBtn.title = isStarred ? 'Đã đánh dấu cần ôn (Bấm để bỏ đánh dấu)' : 'Đánh dấu từ khó / cần ôn (🔖)';
      const svg = starBtn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isStarred ? '#ef4444' : 'none');
        svg.setAttribute('stroke', isStarred ? '#ef4444' : 'currentColor');
      }
    }
    this.updateVocabStarredCountBadge();
    this.showToast(isStarred ? `🔖 Đã đánh dấu "${v.word}" vào danh sách cần ôn!` : `Đã bỏ đánh dấu "${v.word}".`);
  }

  toggleVocabStarredFilter() {
    if (!this._fullUnitVocabList) {
      this._fullUnitVocabList = [...(this.vocabList || [])];
    }
    const btn = document.getElementById('btn-fc-filter-starred');

    if (!this._fcOnlyStarred) {
      // Switch to only starred
      const starredWords = this._fullUnitVocabList.filter(w => {
        const k = w.word || w.id;
        return window.dataStore.isVocabStarred(k) || (window.dataStore.userProgress?.vocabReview?.[w.id]);
      });

      if (starredWords.length === 0) {
        this.showToast('🔖 Bạn chưa đánh dấu từ khó nào trong Unit này. Hãy bấm 🔖 trên thẻ hoặc nút "⚡ Cần Ôn" để đánh dấu nhé!');
        return;
      }

      this._fcOnlyStarred = true;
      this.vocabList = starredWords;
      this.currentVocabIndex = 0;
      if (btn) btn.classList.add('active');
      this.renderVocabStage();
      this.showToast(`🔖 Đang hiển thị ${starredWords.length} từ khó / cần ôn của Unit ${window.dataStore.currentUnitId}`);
    } else {
      // Revert to all words
      this._fcOnlyStarred = false;
      this.vocabList = [...this._fullUnitVocabList];
      this.currentVocabIndex = 0;
      if (btn) btn.classList.remove('active');
      this.renderVocabStage();
      this.showToast(`Hiển thị toàn bộ ${this.vocabList.length} từ vựng Unit ${window.dataStore.currentUnitId}`);
    }
  }

  // ==========================================
  // NOTE MODAL MANAGEMENT (VOCAB & IRREGULAR)
  // ==========================================
  openVocabNoteModal() {
    if (!this.vocabList || this.vocabList.length === 0) return;
    const v = this.vocabList[this.currentVocabIndex];
    if (!v) return;

    this._currentEditingNote = { type: 'vocab', key: v.word || v.id, label: v.word };
    const modal = document.getElementById('word-note-modal');
    const title = document.getElementById('note-modal-title');
    const subtitle = document.getElementById('note-modal-subtitle');
    const textarea = document.getElementById('note-modal-textarea');

    if (title) title.innerText = `Ghi Chú: ${v.word}`;
    if (subtitle) subtitle.innerText = `Từ Vựng Unit ${window.dataStore.currentUnitId} (${v.meaning || ''})`;
    if (textarea) {
      textarea.value = window.dataStore.getVocabNote(v.word || v.id);
      setTimeout(() => textarea.focus(), 100);
    }
    if (modal) modal.style.display = 'flex';
  }

  openIrregularNoteModal(v1) {
    this._currentEditingNote = { type: 'irregular', key: v1, label: v1 };
    const modal = document.getElementById('word-note-modal');
    const title = document.getElementById('note-modal-title');
    const subtitle = document.getElementById('note-modal-subtitle');
    const textarea = document.getElementById('note-modal-textarea');

    if (title) title.innerText = `Ghi Chú: ${v1}`;
    if (subtitle) subtitle.innerText = `Động Từ Bất Quy Tắc (V1: ${v1})`;
    if (textarea) {
      textarea.value = window.dataStore.getIrregularNote(v1);
      setTimeout(() => textarea.focus(), 100);
    }
    if (modal) modal.style.display = 'flex';
  }

  closeWordNoteModal() {
    const modal = document.getElementById('word-note-modal');
    if (modal) modal.style.display = 'none';
    this._currentEditingNote = null;
  }

  saveCurrentNote() {
    if (!this._currentEditingNote) return;
    const textarea = document.getElementById('note-modal-textarea');
    const note = textarea ? textarea.value.trim() : '';

    if (this._currentEditingNote.type === 'irregular') {
      window.dataStore.saveIrregularNote(this._currentEditingNote.key, note);
      this.renderIrregularVerbs();
    } else {
      window.dataStore.saveVocabNote(this._currentEditingNote.key, note);
      this.renderVocabStage();
    }
    this.closeWordNoteModal();
    this.showToast('💾 Đã lưu ghi chú cá nhân thành công!');
  }

  deleteCurrentNote() {
    if (!this._currentEditingNote) return;
    if (this._currentEditingNote.type === 'irregular') {
      window.dataStore.saveIrregularNote(this._currentEditingNote.key, '');
      this.renderIrregularVerbs();
    } else {
      window.dataStore.saveVocabNote(this._currentEditingNote.key, '');
      this.renderVocabStage();
    }
    this.closeWordNoteModal();
    this.showToast('Đã xóa ghi chú.');
  }

  renderVocabQuiz() {
    const v = this.vocabList[this.currentVocabIndex];
    if (!v) return;

    document.getElementById('vq-prompt-label').innerText = 'Chọn nghĩa tiếng Việt của từ:';
    document.getElementById('vq-prompt-word').innerText = v.word;
    document.getElementById('vq-feedback').innerText = '';

    const correctOpt = v.meaning;
    const distractors = this.vocabList
      .filter(item => item.meaning !== correctOpt)
      .map(item => item.meaning);
    
    distractors.sort(() => Math.random() - 0.5);
    const options = [correctOpt, ...distractors.slice(0, 3)];
    options.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('vq-options-grid');
    grid.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'ans-pill';
      btn.style.padding = '14px';
      btn.innerText = opt;
      btn.onclick = () => {
        if (opt === correctOpt) {
          btn.classList.add('is-correct');
          document.getElementById('vq-feedback').innerHTML = '<span style="color:#1a7f37;">✓ Chính xác! Rất tốt!</span>';
          window.dataStore.markVocabKnown(v.id);
          setTimeout(() => {
            this.nextVocabCard();
            this.renderVocabQuiz();
          }, 700);
        } else {
          btn.classList.add('is-wrong');
          document.getElementById('vq-feedback').innerHTML = `<span style="color:#cf222e;">✕ Chưa đúng! Đáp án là: "${correctOpt}"</span>`;
          window.dataStore.markVocabReview(v.id);
        }
      };
      grid.appendChild(btn);
    });
  }

  // ==========================================
  // QUIZLET "SET UP YOUR TEST" MODAL & TEST ENGINE
  // ==========================================
  openQuizletSetupModal() {
    const modal = document.getElementById('quizlet-setup-modal');
    if (!modal) return;

    // Populate checkboxes for 48 units
    const container = document.getElementById('qz-units-checkboxes-container');
    container.innerHTML = '';

    const units = window.dataStore.units;
    const curUnitId = window.dataStore.currentUnitId || 1;

    let savedUnits = null;
    try {
      const raw = localStorage.getItem('smob_quizlet_selected_units');
      if (raw) savedUnits = JSON.parse(raw);
    } catch (e) {}

    const isChecked = (uNum) => {
      if (Array.isArray(savedUnits) && savedUnits.length > 0) {
        return savedUnits.includes(uNum);
      }
      return uNum === curUnitId;
    };

    units.forEach(u => {
      const label = document.createElement('label');
      label.className = 'unit-check-label';
      label.innerHTML = `
        <input type="checkbox" class="qz-unit-cb" value="${u.unit_number}" ${isChecked(u.unit_number) ? 'checked' : ''} onchange="window.smobApp.updateQuizletSelectedSummary()">
        <span>Unit ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}</span>
      `;
      container.appendChild(label);
    });

    const savedQCount = localStorage.getItem('smob_quizlet_q_count');
    if (savedQCount) {
      const inputCount = document.getElementById('qz-questions-input');
      if (inputCount) inputCount.value = savedQCount;
    }

    this.updateQuizletSelectedSummary();
    modal.style.display = 'flex';
  }

  closeQuizletSetupModal() {
    const modal = document.getElementById('quizlet-setup-modal');
    if (modal) modal.style.display = 'none';
  }

  exitQuizletTest() {
    clearInterval(this.quizletTimerInterval);
    const runner = document.getElementById('vocab-quizlet-test-runner');
    if (runner) runner.style.display = 'none';
    const res = document.getElementById('vocab-quizlet-result-screen');
    if (res) res.style.display = 'none';
    const fcArea = document.getElementById('vocab-flashcard-area');
    if (fcArea) fcArea.style.display = 'block';
  }

  selectAllQuizletUnits(selectAll) {
    document.querySelectorAll('.qz-unit-cb').forEach(cb => {
      cb.checked = selectAll;
    });
    this.updateQuizletSelectedSummary();
  }

  selectOnlyCurrentQuizletUnit() {
    const curUnitId = window.dataStore.currentUnitId || 1;
    document.querySelectorAll('.qz-unit-cb').forEach(cb => {
      cb.checked = (parseInt(cb.value) === curUnitId);
    });
    this.updateQuizletSelectedSummary();
  }

  updateQuizletSelectedSummary() {
    const selected = Array.from(document.querySelectorAll('.qz-unit-cb:checked')).map(cb => parseInt(cb.value));
    if (selected.length > 0) {
      try {
        localStorage.setItem('smob_quizlet_selected_units', JSON.stringify(selected));
      } catch (e) {}
    }
    let totalVocab = 0;
    selected.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (u && u.vocabulary) totalVocab += u.vocabulary.length;
    });

    const summary = document.getElementById('qz-selected-units-summary');
    if (summary) {
      summary.innerText = `Đã chọn: ${selected.length} Units • Tổng cộng: ${totalVocab} từ vựng`;
    }
    const maxLabel = document.getElementById('qz-max-count-label');
    if (maxLabel) maxLabel.innerText = `(max ${totalVocab} từ)`;
    const inputCount = document.getElementById('qz-questions-input');
    if (inputCount) {
      inputCount.max = Math.max(totalVocab, 5);
      if (parseInt(inputCount.value) > totalVocab && totalVocab > 0) {
        inputCount.value = Math.min(20, totalVocab);
      }
    }
  }

  startGeneratedQuizletTest() {
    const selectedUnits = Array.from(document.querySelectorAll('.qz-unit-cb:checked')).map(cb => parseInt(cb.value));
    if (selectedUnits.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 Unit để làm bài kiểm tra!');
      return;
    }

    let qCountInput = 20;
    try {
      localStorage.setItem('smob_quizlet_selected_units', JSON.stringify(selectedUnits));
      qCountInput = parseInt(document.getElementById('qz-questions-input').value) || 20;
      localStorage.setItem('smob_quizlet_q_count', qCountInput);
    } catch (e) {}

    const answerWith = document.getElementById('qz-answer-with-select').value; // both | en | vi
    const useTF = document.getElementById('qz-switch-tf').checked;
    const useMC = document.getElementById('qz-switch-mc').checked;
    const useMatch = document.getElementById('qz-switch-match').checked;
    const useWritten = document.getElementById('qz-switch-written').checked;

    if (!useTF && !useMC && !useMatch && !useWritten) {
      alert('Vui lòng bật ít nhất 1 định dạng câu hỏi!');
      return;
    }

    // Collect vocab pool
    let pool = [];
    selectedUnits.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (u && u.vocabulary) {
        pool.push(...u.vocabulary.map(v => ({ ...v, unitId: uid })));
      }
    });

    if (pool.length === 0) {
      alert('Không tìm thấy từ vựng trong các Unit đã chọn!');
      return;
    }

    // Shuffle pool
    pool.sort(() => Math.random() - 0.5);
    const targetCount = Math.min(qCountInput, pool.length);
    const selectedVocab = pool.slice(0, targetCount);

    // Build question items
    const availableTypes = [];
    if (useTF) availableTypes.push('tf');
    if (useMC) availableTypes.push('mc');
    if (useMatch && selectedVocab.length >= 4) availableTypes.push('match');
    if (useWritten) availableTypes.push('written');

    this.quizletQuestions = [];
    this.quizletAnswers = {};

    selectedVocab.forEach((item, idx) => {
      const type = availableTypes[idx % availableTypes.length];
      if (type === 'tf') {
        const isTrue = Math.random() > 0.5;
        let displayedMeaning = item.meaning;
        if (!isTrue) {
          const fakePool = pool.filter(p => p.word !== item.word);
          if (fakePool.length > 0) displayedMeaning = fakePool[Math.floor(Math.random() * fakePool.length)].meaning;
        }
        this.quizletQuestions.push({
          id: `qz_q_${idx}`,
          type: 'tf',
          stem: `Từ "${item.word}" có nghĩa là: "${displayedMeaning}"`,
          correctAnswer: isTrue ? 'True' : 'False',
          item: item,
          displayedMeaning: displayedMeaning
        });
      } else if (type === 'mc') {
        const distractors = pool.filter(p => p.word !== item.word).map(p => (answerWith === 'en' ? p.word : p.meaning));
        distractors.sort(() => Math.random() - 0.5);
        const correctOpt = (answerWith === 'en' ? item.word : item.meaning);
        const options = [correctOpt, ...distractors.slice(0, 3)];
        options.sort(() => Math.random() - 0.5);

        this.quizletQuestions.push({
          id: `qz_q_${idx}`,
          type: 'mc',
          stem: answerWith === 'en' ? `Chọn từ tiếng Anh có nghĩa: "${item.meaning}"` : `Chọn nghĩa tiếng Việt của từ: "${item.word}"`,
          options: options,
          correctAnswer: correctOpt,
          item: item
        });
      } else if (type === 'written') {
        this.quizletQuestions.push({
          id: `qz_q_${idx}`,
          type: 'written',
          stem: `Gõ từ tiếng Anh có nghĩa là: "${item.meaning}"`,
          correctAnswer: item.word.trim().toLowerCase(),
          item: item
        });
      } else if (type === 'match') {
        // Simple multiple choice variant for matching reflex
        this.quizletQuestions.push({
          id: `qz_q_${idx}`,
          type: 'mc',
          stem: `Ghép cặp từ tương ứng: "${item.word} (${item.pos || 'từ'})" ➔ ?`,
          options: [item.meaning, ...pool.filter(p => p.word !== item.word).slice(0, 3).map(p => p.meaning)].sort(() => Math.random() - 0.5),
          correctAnswer: item.meaning,
          item: item
        });
      }
    });

    this.closeQuizletSetupModal();
    this.renderQuizletTestRunner();
  }

  renderQuizletTestRunner() {
    this.closeUnansweredModal();
    const fcArea = document.getElementById('vocab-flashcard-area');
    if (fcArea) fcArea.style.display = 'none';
    const quizArea = document.getElementById('vocab-quiz-area');
    if (quizArea) quizArea.style.display = 'none';
    const resScreen = document.getElementById('vocab-quizlet-result-screen');
    if (resScreen) resScreen.style.display = 'none';

    // Hide outer toolbars so Quizlet test header is the only sticky element
    const vocabToolbar = document.getElementById('vocab-sticky-toolbar');
    if (vocabToolbar) vocabToolbar.style.display = 'none';
    const fcProg = document.getElementById('fc-progress-container');
    if (fcProg) fcProg.style.display = 'none';

    const runner = document.getElementById('vocab-quizlet-test-runner');
    if (!runner) return;
    runner.style.display = 'block';

    const titleEl = document.getElementById('qz-test-title');
    if (titleEl) titleEl.innerText = `Kiểm Tra Quizlet (${this.quizletQuestions.length} Câu Hỏi)`;
    const progEl = document.getElementById('qz-test-progress-text');
    if (progEl) progEl.innerText = `Đã trả lời 0 / ${this.quizletQuestions.length} câu`;

    const progBar = document.getElementById('qz-sticky-progress-bar');
    if (progBar) progBar.style.width = '0%';

    // Start timer
    this.quizletTimerSeconds = 0;
    clearInterval(this.quizletTimerInterval);
    this.quizletTimerInterval = setInterval(() => {
      this.quizletTimerSeconds++;
      const m = Math.floor(this.quizletTimerSeconds / 60);
      const s = this.quizletTimerSeconds % 60;
      const tEl = document.getElementById('qz-test-timer');
      if (tEl) tEl.innerText = `⏱️ ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, 1000);

    const container = document.getElementById('qz-test-questions-container');
    if (!container) return;
    container.innerHTML = '';

    this.quizletQuestions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'apple-card';
      card.id = `qz-card-${q.id}`;
      card.style.marginBottom = '16px';

      const headerDiv = document.createElement('div');
      headerDiv.style.display = 'flex';
      headerDiv.style.justifyContent = 'space-between';
      headerDiv.style.alignItems = 'center';
      headerDiv.style.marginBottom = '8px';
      headerDiv.innerHTML = `
        <span style="font-size: 13px; font-weight: 700; color: var(--accent);">CÂU ${idx + 1} / ${this.quizletQuestions.length}</span>
        <span style="font-size: 12px; color: var(--text-tertiary);">Unit ${q.item.unitId || ''}</span>
      `;
      card.appendChild(headerDiv);

      const stemDiv = document.createElement('div');
      stemDiv.style.fontSize = '17px';
      stemDiv.style.fontWeight = '700';
      stemDiv.style.lineHeight = '1.4';
      stemDiv.innerText = q.stem;
      card.appendChild(stemDiv);

      if (q.type === 'tf') {
        const btnBox = document.createElement('div');
        btnBox.style.display = 'flex';
        btnBox.style.gap = '12px';
        btnBox.style.marginTop = '14px';

        ['True', 'False'].forEach(val => {
          const btn = document.createElement('button');
          btn.className = 'apple-btn btn-secondary qz-opt-btn';
          btn.style.flex = '1';
          btn.style.padding = '12px';
          btn.innerText = val === 'True' ? 'True (Đúng)' : 'False (Sai)';
          btn.addEventListener('click', () => this.setQuizletAnswer(q.id, val, btn));
          btnBox.appendChild(btn);
        });
        card.appendChild(btnBox);
      } else if (q.type === 'mc' || q.type === 'match') {
        const gridBox = document.createElement('div');
        gridBox.style.display = 'grid';
        gridBox.style.gridTemplateColumns = '1fr 1fr';
        gridBox.style.gap = '10px';
        gridBox.style.marginTop = '14px';

        (q.options || []).forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'ans-pill qz-opt-btn';
          btn.style.padding = '12px';
          btn.innerText = opt;
          btn.addEventListener('click', () => this.setQuizletAnswer(q.id, opt, btn));
          gridBox.appendChild(btn);
        });
        card.appendChild(gridBox);
      } else if (q.type === 'written') {
        const inpBox = document.createElement('div');
        inpBox.style.marginTop = '14px';
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'exam-input-box';
        inp.placeholder = 'Gõ từ tiếng Anh vào đây...';
        inp.addEventListener('input', (e) => this.setQuizletWrittenAnswer(q.id, e.target.value));
        inpBox.appendChild(inp);
        card.appendChild(inpBox);
      }

      container.appendChild(card);
    });
  }

  setQuizletAnswer(qId, val, btn) {
    this.quizletAnswers[qId] = val;
    const parent = btn.parentElement;
    parent.querySelectorAll('button').forEach(b => {
      b.classList.remove('selected');
      b.style.borderColor = '';
      b.style.background = '';
      b.style.color = '';
    });
    btn.classList.add('selected');
    btn.style.borderColor = 'var(--accent)';
    btn.style.background = 'var(--accent-bg)';
    btn.style.color = 'var(--accent)';

    // Remove unanswered alert when user interacts
    const qzCard = document.getElementById(`qz-card-${qId}`);
    if (qzCard) {
      qzCard.classList.remove('exam-card-unanswered-alert');
      const badge = qzCard.querySelector('.unans-badge-tag');
      if (badge) badge.remove();
    }

    const answeredCount = Object.keys(this.quizletAnswers).filter(k => (this.quizletAnswers[k] || '').trim().length > 0).length;
    const pEl = document.getElementById('qz-test-progress-text');
    if (pEl) pEl.innerText = `Đã trả lời ${answeredCount} / ${this.quizletQuestions.length} câu`;

    const progBar = document.getElementById('qz-sticky-progress-bar');
    if (progBar && this.quizletQuestions.length > 0) {
      const pct = Math.round((answeredCount / this.quizletQuestions.length) * 100);
      progBar.style.width = pct + '%';
    }
  }

  exitQuizletTest() {
    clearInterval(this.quizletTimerInterval);
    this.closeUnansweredModal();
    const runner = document.getElementById('vocab-quizlet-test-runner');
    if (runner) runner.style.display = 'none';
    const res = document.getElementById('vocab-quizlet-result-screen');
    if (res) res.style.display = 'none';
    const fcArea = document.getElementById('vocab-flashcard-area');
    if (fcArea) fcArea.style.display = 'block';

    const vocabToolbar = document.getElementById('vocab-sticky-toolbar');
    if (vocabToolbar) vocabToolbar.style.display = 'flex';
    const fcProg = document.getElementById('fc-progress-container');
    if (fcProg) fcProg.style.display = 'block';
  }

  setQuizletWrittenAnswer(qId, val) {
    if (val.trim()) {
      this.quizletAnswers[qId] = val.trim();
      const qzCard = document.getElementById(`qz-card-${qId}`);
      if (qzCard) {
        qzCard.classList.remove('exam-card-unanswered-alert');
        const badge = qzCard.querySelector('.unans-badge-tag');
        if (badge) badge.remove();
      }
    } else {
      delete this.quizletAnswers[qId];
    }
    const answeredCount = Object.keys(this.quizletAnswers).filter(k => (this.quizletAnswers[k] || '').trim().length > 0).length;
    const pEl = document.getElementById('qz-test-progress-text');
    if (pEl) pEl.innerText = `Đã trả lời ${answeredCount} / ${this.quizletQuestions.length} câu`;

    const progBar = document.getElementById('qz-sticky-progress-bar');
    if (progBar && this.quizletQuestions.length > 0) {
      const pct = Math.round((answeredCount / this.quizletQuestions.length) * 100);
      progBar.style.width = pct + '%';
    }
  }

  finishQuizletTest() {
    // Clear any previous alerts
    document.querySelectorAll('#qz-test-questions-container .exam-card-unanswered-alert').forEach(el => el.classList.remove('exam-card-unanswered-alert'));
    document.querySelectorAll('#qz-test-questions-container .unans-badge-tag').forEach(el => el.remove());

    const total = this.quizletQuestions.length;
    const missing = [];

    this.quizletQuestions.forEach((q, idx) => {
      const ans = (this.quizletAnswers[q.id] || '').trim();
      if (!ans) {
        missing.push({
          id: q.id,
          num: idx + 1,
          q: q
        });
      }
    });

    if (missing.length > 0) {
      // 1. Light up red on unanswered question cards
      missing.forEach(m => {
        const card = document.getElementById(`qz-card-${m.id}`);
        if (card) {
          card.classList.add('exam-card-unanswered-alert');
          const header = card.querySelector('div');
          if (header && !card.querySelector('.unans-badge-tag')) {
            const badge = document.createElement('span');
            badge.className = 'unans-badge-tag';
            badge.innerText = '⚠️ Chưa trả lời';
            header.appendChild(badge);
          }
        }
      });

      // 2. Show confirmation modal
      this.showUnansweredConfirmModal({
        testType: 'quizlet_test',
        title: 'Chưa Hoàn Thành Bài Kiểm Tra Quizlet!',
        total: total,
        answered: total - missing.length,
        missingList: missing,
        onConfirmSubmit: () => this._doFinishQuizletTest(),
        onJump: (qId) => {
          const target = document.getElementById(`qz-card-${qId}`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const inp = target.querySelector('input');
            if (inp) inp.focus();
            target.style.transition = 'box-shadow 0.3s';
            target.style.boxShadow = '0 0 0 4px #ef4444';
            setTimeout(() => { target.style.boxShadow = ''; }, 1500);
          }
        }
      });
      return;
    }

    this._doFinishQuizletTest();
  }

  _doFinishQuizletTest() {
    this.closeUnansweredModal();
    clearInterval(this.quizletTimerInterval);
    const total = this.quizletQuestions.length;
    let correct = 0;

    this.quizletQuestions.forEach(q => {
      const userAnsRaw = (this.quizletAnswers[q.id] || '').trim();
      const userAns = userAnsRaw.toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === correctAns) {
        correct++;
      } else {
        const wordStr = q.item?.word || 'Từ vựng';
        const ipaStr = q.item?.ipa ? ` (${q.item.ipa})` : '';
        const meanStr = q.item?.meaning || '';
        const exStr = q.item?.example ? ` • Ví dụ: "${q.item.example}"` : '';
        const expl = `Từ vựng gốc: ${wordStr}${ipaStr} ➔ ${meanStr}${exStr}`;
        const stem = q.stem || `Nghĩa của từ vựng "${wordStr}"`;
        window.dataStore.recordMistake(
          q.unitId || window.dataStore.currentUnitId || 1,
          q.id,
          stem,
          userAnsRaw || '(Chưa làm)',
          q.correctAnswer,
          expl,
          'vocab_quizlet'
        );
      }
    });

    const percent = Math.round((correct / total) * 100);
    document.getElementById('vocab-quizlet-test-runner').style.display = 'none';
    const resScreen = document.getElementById('vocab-quizlet-result-screen');
    resScreen.style.display = 'block';

    const vocabToolbar = document.getElementById('vocab-sticky-toolbar');
    if (vocabToolbar) vocabToolbar.style.display = 'flex';
    const fcProg = document.getElementById('fc-progress-container');
    if (fcProg) fcProg.style.display = 'block';

    document.getElementById('qz-res-icon').innerText = percent >= 80 ? '🏆' : (percent >= 50 ? '⭐' : '📖');
    document.getElementById('qz-res-title').innerText = percent >= 80 ? 'Tuyệt Vời! Bạn Đã Hoàn Thành Xuất Sắc' : 'Kết Quả Bài Kiểm Tra';
    document.getElementById('qz-res-score').innerText = `${percent}%`;
    document.getElementById('qz-res-desc').innerText = `Đúng ${correct} / ${total} câu • Thời gian làm bài: ${Math.floor(this.quizletTimerSeconds / 60)} phút ${this.quizletTimerSeconds % 60} giây`;
  }

  reviewQuizletTest() {
    const list = document.getElementById('qz-review-list');
    list.style.display = 'block';
    list.innerHTML = '<h3 style="font-size: 18px; font-weight: 700; margin-bottom: 14px;">Chi Tiết Đáp Án & Giải Thích Từng Câu:</h3>';

    this.quizletQuestions.forEach((q, idx) => {
      const userAns = (this.quizletAnswers[q.id] || '(Bỏ trống)');
      const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      const itemEl = document.createElement('div');
      itemEl.style.padding = '14px';
      itemEl.style.marginBottom = '12px';
      itemEl.style.borderRadius = 'var(--radius-sm)';
      itemEl.style.background = isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)';
      itemEl.style.border = `1px solid ${isCorrect ? '#34c759' : '#ff3b30'}`;

      itemEl.innerHTML = `
        <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">Câu ${idx + 1}: ${q.stem}</div>
        <div style="font-size: 13.5px; margin-bottom: 4px;">
          <strong>Bạn chọn:</strong> <span style="color:${isCorrect ? '#1a7f37' : '#cf222e'}; font-weight:700;">${userAns}</span> • 
          <strong>Đáp án đúng:</strong> <span style="color:#1a7f37; font-weight:700;">${q.correctAnswer}</span>
        </div>
        <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 4px;">
          Từ vựng gốc: <strong>${q.item.word}</strong> (${q.item.ipa}) ➔ <strong>${q.item.meaning}</strong> • Ví dụ: "${q.item.example || ''}"
        </div>
      `;
      list.appendChild(itemEl);
    });
  }

  // ==========================================
  // GRAMMAR READER & THEORY QUIZ
  // ==========================================
  // ==========================================
  // GRAMMAR READER & TOPIC EXERCISES (PRACTICE BY TOPIC)
  // ==========================================
  // ==========================================
  // MULTI-TIER SPEECH ENGINE (AUDIO & PRONUNCIATION)
  // Layer 1: High quality native MP3 stream (Youdao Dictionary TTS)
  // Layer 2: Web Speech API Synthesis with resume & voice selection
  // ==========================================
  speakText(text) {
    if (!text) return;
    const clean = text.replace(/^[•▪\-\*0-9\.\s]+/, '').replace(/\(.*?\)/g, '').trim();
    if (!clean) return;

    try {
      if (!this._ttsAudio) {
        this._ttsAudio = new Audio();
      }
      this._ttsAudio.pause();
      const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(clean)}&type=2`;
      this._ttsAudio.src = url;
      const playPromise = this._ttsAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.fallbackSpeechSynthesis(clean);
        });
      }
      return;
    } catch(e) {
      this.fallbackSpeechSynthesis(clean);
    }
  }

  fallbackSpeechSynthesis(clean) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = this.speechRate || 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US') || v.name.includes('English')));
        if (enVoice) utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  switchGrammarUnitOffset(offset) {
    const cur = window.dataStore.currentUnitId || 1;
    const next = Math.max(1, Math.min(48, cur + offset));
    if (next !== cur) {
      this.switchGrammarUnit(next);
    }
  }

  switchGrammarUnit(unitId) {
    const uid = parseInt(unitId) || 1;
    this.syncCurrentUnit(uid, 'grammar');
    const u = window.dataStore.getUnit(uid);
    if (!u) return;

    const select = document.getElementById('grammar-unit-select');
    if (select && parseInt(select.value) !== uid) {
      select.value = uid;
    }

    const totalPages = (u.full_theory_pages && u.full_theory_pages.length) || 0;
    const subEl = document.getElementById('grammar-unit-sub');
    if (subEl) {
      subEl.innerText = `Unit ${u.unit_number}: ${u.title} • ${totalPages > 0 ? totalPages + ' trang giáo trình gốc (100% đầy đủ)' : u.grammar.sections.length + ' chuyên đề'}`;
    }

    // Sync split view video if active
    if (this.isSplitViewOpen) {
      const splitTitle = document.getElementById('split-video-title');
      if (splitTitle) splitTitle.innerText = `Unit ${uid}: ${u.title}`;
      if (this.currentPlayingUnit !== uid) {
        this.loadTheaterVideo(uid);
      }
    }

    // 1. Populate Mode 1: Full Book Reader transformed into pedagogical learning cards & interactive quizzes
    const fullContainer = document.getElementById('grammar-full-container');
    if (fullContainer) {
      this.renderStructuredTheory(u, fullContainer);
    }

    // 2. Populate Mode 2: Card Breakdown
    const container = document.getElementById('grammar-content-container');
    if (container) {
      container.innerHTML = '';
      if (u.grammar.sections.length === 0) {
        container.innerHTML = `
          <div class="apple-card" style="text-align:center; padding: 40px;">
            <p>Xem toàn văn giáo trình ở tab <strong>📖 Toàn Văn Sách Giáo Trình (100% PDF)</strong></p>
          </div>
        `;
      } else {
        u.grammar.sections.forEach((sec, sIdx) => {
          const sectionEl = document.createElement('div');
          sectionEl.className = 'grammar-section apple-card';
          sectionEl.style.marginBottom = '20px';
          sectionEl.style.padding = '24px 28px';

          const formulaHtml = sec.formula ? `
            <div style="background: var(--accent-bg); border: 1px solid var(--accent); border-radius: 12px; padding: 14px 18px; margin: 12px 0 16px;">
              <div style="font-size: 12px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">📌 Công Thức / Cấu Trúc Cốt Lõi:</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); line-height: 1.5;">${this.escapeHtml(sec.formula)}</div>
            </div>
          ` : '';

          const rulesHtml = sec.rules.map((r) => `
            <li style="margin-bottom: 8px; line-height: 1.6; color: var(--text-primary);">
              <strong style="color: var(--accent);">•</strong> ${this.escapeHtml(r)}
            </li>
          `).join('');

          const examplesHtml = sec.examples.map(ex => {
            const safeEn = this.escapeHtml(ex.en).replace(/'/g, "\\'");
            return `
            <div class="example-box" style="margin-bottom: 8px; padding: 10px 14px; background: var(--bg-tertiary); border-radius: 8px; border-left: 3px solid var(--accent); display: flex; justify-content: space-between; align-items: center; gap: 12px;">
              <div style="flex: 1;">
                <div class="ex-en" style="font-weight: 700; font-size: 14.5px; color: var(--text-primary);">${this.escapeHtml(ex.en)}</div>
                <div class="ex-vi" style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">${this.escapeHtml(ex.vi)}</div>
              </div>
              <button class="btn-ai-coach-inline" onclick="window.smobApp.openAICoach('${safeEn}', '')" title="Luyện đọc câu này">
                🎙️ Đọc AI
              </button>
            </div>
          `;
          }).join('');

          sectionEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <h3 style="font-size: 20px; font-weight: 800; color: var(--text-primary); margin: 0;">${this.escapeHtml(sec.title)}</h3>
              <span class="status-pill status-avail" style="font-size: 11.5px;">Chuyên đề ${sIdx + 1}</span>
            </div>
            ${formulaHtml}
            <div style="font-weight: 700; margin: 14px 0 8px; font-size: 14px; color: var(--text-primary);">📝 Quy Tắc Áp Dụng Chi Tiết:</div>
            <ul style="list-style: none; padding-left: 4px; margin-bottom: 16px;">${rulesHtml}</ul>
            <div style="font-weight: 700; margin: 14px 0 8px; font-size: 14px; color: var(--text-primary);">💡 Ví Dụ Minh Họa Song Ngữ:</div>
            <div>${examplesHtml}</div>
            <div class="source-tag" style="margin-top: 16px; font-size: 11.5px; color: var(--text-tertiary);">Nguồn giáo trình: ${this.escapeHtml(u.source_trace.theory_file || '')} • Trang ${sec.source_page || 1}</div>
          `;
          container.appendChild(sectionEl);
        });
      }
    }

    // Apply current grammar mode
    this.applyGrammarMode();
  }

  setGrammarMode(mode, btn) {
    this.currentGrammarMode = mode || 'full';
    if (btn) {
      const parent = btn.parentElement;
      if (parent) {
        parent.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');
    }
    this.applyGrammarMode();
  }

  applyGrammarMode() {
    const fullContainer = document.getElementById('grammar-full-container');
    const cardsContainer = document.getElementById('grammar-content-container');
    const btnFull = document.getElementById('btn-gm-full');
    const btnCards = document.getElementById('btn-gm-cards');

    if (this.currentGrammarMode === 'cards') {
      if (fullContainer) fullContainer.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'block';
      if (btnFull) btnFull.classList.remove('active');
      if (btnCards) btnCards.classList.add('active');
    } else {
      if (fullContainer) fullContainer.style.display = 'flex';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (btnFull) btnFull.classList.add('active');
      if (btnCards) btnCards.classList.remove('active');
    }
  }

  // ==========================================
  // AUTHENTIC 100% PDF TEXTBOOK THEORY & MASTER INTERACTIVE ENGINE
  // (Universal Support for All 48 Units - Authentic PDF Tables & Layout)
  // ==========================================
  renderTableFromRows(rows) {
    if (!rows || rows.length === 0) return '';

    // Check if row 0 is a genuine header row
    const headerKeywords = [
      'ngôi', 'danh từ', 'tính từ', 'động từ', 'từ vựng', 'tính từ sở hữu', 
      'dạng số ít', 'số ít', 'dạng số nhiều', 'số nhiều', 'phiên âm', 'phát âm',
      'đại từ', 'chủ ngữ', 'dạng đầy đủ', 'nguyên thể', 'v1', 'v2', 'v3',
      'hiện tại', 'quá khứ', 'khẳng định', 'phủ định', 'nghi vấn', 'cách dùng',
      'quy tắc', 'ví dụ', 'nghĩa', 'cách phát âm', 'tân ngữ', 'cột', 'loại từ',
      'trạng từ', 'giới từ', 'liên từ', 'quốc gia', 'quốc tịch', 'lời cảm ơn', 'lời đáp'
    ];

    const isGenuineHeader = (r) => {
      if (!r || r.length === 0) return false;
      let matches = 0;
      for (const cell of r) {
        const c = String(cell || '').toLowerCase().trim();
        if (headerKeywords.some(k => c === k || c.startsWith(k))) matches++;
        if (c.includes('/') || (c.includes('(') && c.includes(')')) || c.length > 45) return false;
      }
      return matches >= 1;
    };

    let header = [];
    let dataRows = [];
    const colCount = Math.max(...rows.map(r => r.length));

    if (isGenuineHeader(rows[0])) {
      header = rows[0];
      dataRows = rows.slice(1);
    } else {
      // Smart inferred headers based on table contents so row 0 data is preserved
      dataRows = rows;
      const sampleCell1 = String(rows[0][0] || '').toLowerCase();
      const sampleCell2 = String(rows[0][1] || '').toLowerCase();

      if (sampleCell2.includes('/') || sampleCell2.includes('ˈ') || sampleCell2.includes('ˌ')) {
        header = ['Từ Vựng / Phát Âm', 'Phiên Âm Quốc Tế (IPA)'];
      } else if (sampleCell1.includes('this') || sampleCell1.includes('that') || sampleCell1.includes('these') || sampleCell1.includes('those')) {
        header = ['Từ Hạn Định / Đại Từ', 'Cách Dùng & Ví Dụ Minh Họa'];
      } else if (sampleCell1.includes('am') || sampleCell1.includes('are') || sampleCell1.includes('is') || sampleCell1.includes('was') || sampleCell1.includes('were')) {
        header = ['Động Từ To Be', 'Chủ Ngữ Đi Kèm (Subject)'];
      } else if (sampleCell1.includes('i') || sampleCell1.includes('you') || sampleCell1.includes('she') || sampleCell1.includes('he')) {
        header = ['Chủ Ngữ (Subject)', 'Động Từ Chia / Cấu Trúc Đi Kèm'];
      } else if (sampleCell1.includes('(') && !sampleCell2.includes('(')) {
        header = ['Từ Dạng Gốc / Số Ít', 'Dạng Biến Đổi / Số Nhiều'];
      } else if (sampleCell1.includes('must') || sampleCell1.includes('can') || sampleCell1.includes('should')) {
        header = ['Động Từ Khuyết Thiếu', 'Ví Dụ Minh Họa & Ý Nghĩa'];
      } else {
        header = colCount === 2 ? ['Thành Phần / Quy Tắc', 'Ý Nghĩa / Ví Dụ Thực Tế'] : Array.from({length: colCount}, (_, idx) => `Cột ${idx + 1}`);
      }
    }

    let html = `<div class="pdf-table-wrapper"><table class="pdf-doc-table">`;
    
    // Header
    html += `<thead><tr>`;
    header.forEach((h) => {
      const widthStyle = colCount === 2 ? 'width: 50%;' : (colCount === 3 ? 'width: 33.33%;' : (colCount === 4 ? 'width: 25%;' : ''));
      html += `<th style="${widthStyle}">${this.escapeHtml(h)}</th>`;
    });
    for (let c = header.length; c < colCount; c++) {
      html += `<th></th>`;
    }
    html += `</tr></thead>`;

    // Body
    html += `<tbody>`;
    dataRows.forEach(r => {
      html += `<tr>`;
      r.forEach((cell, cellIdx) => {
        const rawCell = String(cell || '').trim();
        const isCol1 = cellIdx === 0;
        const isIpa = (rawCell.startsWith('/') && rawCell.endsWith('/')) || rawCell.includes('ˈ') || rawCell.includes('ˌ');
        
        // Extract word for pronunciation button if applicable
        const wordMatch = rawCell.match(/^([a-zA-Z\s\/\-\'\’\?\,\!]+)(?:\s*\(.+?\))?$/);
        const cleanWord = wordMatch ? wordMatch[1].trim() : (r[0] ? String(r[0]).replace(/\(.*?\)/, '').trim() : '');

        if (isCol1) {
          html += `<td>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <strong class="pdf-cell-strong">${this.escapeHtml(rawCell)}</strong>
              ${cleanWord && !isIpa && cleanWord.length < 30 ? `<button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(cleanWord).replace(/'/g, "\\'")}')" title="Phát âm từ này">🔊</button>` : ''}
            </div>
          </td>`;
        } else {
          html += `<td>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <span class="${isIpa ? 'pdf-ipa-text' : 'pdf-table-accent'}">${this.escapeHtml(rawCell)}</span>
              ${isIpa && cleanWord ? `<button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(cleanWord).replace(/'/g, "\\'")}')" title="Nghe phát âm">🔊</button>` : ''}
            </div>
          </td>`;
        }
      });
      for (let c = r.length; c < colCount; c++) {
        html += `<td></td>`;
      }
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
    return html;
  }

  getPartsOfSpeechLegendHtml() {
    return `
      <div class="pdf-quiz-legend-card">
        <div class="legend-header-row">
          <div class="legend-title">
            <span>💡 BẢNG QUY ƯỚC KÝ HIỆU TỪ LOẠI (HƯỚNG DẪN ĐIỀN ĐÁP ÁN)</span>
          </div>
          <span class="legend-badge-tag">Chuẩn Quốc Tế & Song Ngữ</span>
        </div>
        <div class="legend-table-wrapper">
          <table class="legend-table">
            <thead>
              <tr>
                <th style="width: 25%;">Từ loại tiếng Việt</th>
                <th style="width: 25%;">Ký hiệu chuẩn (Khuyên dùng)</th>
                <th style="width: 22%;">Ký hiệu chấp nhận thêm</th>
                <th style="width: 28%;">Ví dụ minh họa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tính từ sở hữu</strong></td>
                <td><span class="legend-code-pill">POSS</span> <span class="legend-code-desc">(viết tắt: Possessive)</span></td>
                <td><span class="legend-code-alt">TTSH</span></td>
                <td><em>my, your, his, her, their, our, its</em></td>
              </tr>
              <tr>
                <td><strong>Đại từ nhân xưng</strong></td>
                <td><span class="legend-code-pill">PRON</span> <span class="legend-code-desc">(viết tắt: Pronoun)</span></td>
                <td><span class="legend-code-alt">PRO</span> <span class="legend-code-alt">ĐTX</span></td>
                <td><em>I, you, we, they, he, she, it</em></td>
              </tr>
              <tr>
                <td><strong>Danh từ</strong></td>
                <td><span class="legend-code-pill">N</span> <span class="legend-code-desc">(viết tắt: Noun)</span></td>
                <td><span class="legend-code-alt">DT</span></td>
                <td><em>mother, flat, book, weather, room, cat</em></td>
              </tr>
              <tr>
                <td><strong>Động từ to be</strong></td>
                <td><span class="legend-code-pill">BE</span> <span class="legend-code-desc">(viết tắt: To be)</span></td>
                <td><span class="legend-code-alt">TO BE</span> <span class="legend-code-alt">TOBE</span></td>
                <td><em>is, am, are, was, were</em></td>
              </tr>
              <tr>
                <td><strong>Động từ thường</strong></td>
                <td><span class="legend-code-pill">V</span> <span class="legend-code-desc">(viết tắt: Verb)</span></td>
                <td><span class="legend-code-alt">VERB</span> <span class="legend-code-alt">ĐT</span></td>
                <td><em>have, drive, sing, study, work</em></td>
              </tr>
              <tr>
                <td><strong>Tính từ</strong></td>
                <td><span class="legend-code-pill">ADJ</span> <span class="legend-code-desc">(viết tắt: Adjective)</span></td>
                <td><span class="legend-code-alt">TINHTU</span> <span class="legend-code-alt">TT</span></td>
                <td><em>happy, lovely, great, nice, tidy, easy, small</em></td>
              </tr>
              <tr>
                <td><strong>Trạng từ</strong></td>
                <td><span class="legend-code-pill">ADV</span> <span class="legend-code-desc">(viết tắt: Adverb)</span></td>
                <td><span class="legend-code-alt">TRANGTU</span> <span class="legend-code-alt">TRT</span></td>
                <td><em>carefully, well, very, quite, quickly</em></td>
              </tr>
              <tr>
                <td><strong>Mạo từ</strong></td>
                <td><span class="legend-code-pill">ART</span> <span class="legend-code-desc">(viết tắt: Article)</span></td>
                <td><span class="legend-code-alt">MT</span></td>
                <td><em>a, an, the</em></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="legend-rule-box">
          <strong>📌 Quy ước cách điền đáp án bài tập Phân tích từ loại:</strong><br>
          • Phân tích từ loại từng từ trong câu theo thứ tự từ trái sang phải.<br>
          • Ngăn cách giữa các từ bằng dấu gạch ngang (<code>-</code>) hoặc khoảng trắng.<br>
          • Không phân biệt chữ HOA hay thường (bạn gõ <code>poss-n-be-adj</code> hay <code>POSS - N - BE - ADJ</code> đều được tính đúng).<br>
          • <strong>Ví dụ:</strong> <em>Her mother is happy.</em> ➔ Điền: <strong><code>POSS - N - BE - ADJ</code></strong> (hoặc <strong><code>TTSH - DT - BE - TT</code></strong>).
        </div>
      </div>
    `;
  }

  renderStructuredTheory(u, container) {
    if (!container) return;
    const fullText = u.full_theory_text || u.theory_text || '';
    const pages = u.full_theory_pages || [];
    if (!fullText && pages.length === 0) {
      container.innerHTML = '<div class="theory-empty-state"><p>Chưa có nội dung lý thuyết chi tiết cho bài học này.</p></div>';
      return;
    }

    const isHeaderOrWatermark = (line) => {
      if (!line) return true;
      const l = line.toLowerCase().trim();
      if (l.startsWith('--- trang') || l.startsWith('--- page')) return true;
      if (l.includes('lấy gốc tiếng anh & luyện thi toeic')) return true;
      if (l.includes('biên soạn và giảng dạy: cô vũ thị mai phương')) return true;
      if (l.includes('vì quyền lợi chính đáng của chính các em')) return true;
      if (l.includes('tuyệt đối không chia sẻ tài liệu')) return true;
      if (l.includes('tài liệu độc quyền đi kèm khóa học')) return true;
      if (l.includes('48 ngày lấy gốc toàn diện tiếng anh')) return true;
      if (/^cô vũ thị mai phương$/i.test(l)) return true;
      if (/^unit\s+\d+[:\.]?/i.test(l)) return true;
      return false;
    };

    const isMajorSection = (line) => {
      return /^[A-E]\.\s+(?:VOCABULARY|PRONUNCIATION|GRAMMAR|PRACTICE|VOWELS|CONSONANTS|TỪ VỰNG|PHÁT ÂM|NGỮ PHÁP|LUYỆN TẬP|NGUYÊN ÂM|PHỤ ÂM|GIỚI THIỆU|THUYẾT TRÌNH|LUYỆN TẬP KỸ NĂNG|LISTENING|BÀI TẬP)|^Scripts\b|^TRANSCRIPT\b|^Audio Script\b/i.test(line);
    };

    const isQuizOrPractice = (line) => {
      return /^(?:Quiz\s*\d*|PRACTICE|BÀI TẬP(?:\s*\d*|\s*[:\-])|Bài tập(?:\s*\d*|\s*[:\-])|PRACTICE\s*\d*)/i.test(line);
    };

    const isInstructionLine = (line) => {
      if (!line) return false;
      const l = line.trim();
      if (/^(?:Question\s+\d+|\d+\.\s+|Mẫu\s*[:\-]|T$|F$|[A-D]\.\s+)/i.test(l)) return false;
      if (/^(?:Man|Woman|Girl|Boy|Speaker|Person\s*\d+|A|B)\s*:/i.test(l)) return false;
      if (/^(?:Name|Age|Address|Nationality|Hobby|Phone|Job|Price|Time|Class)\s*:/i.test(l)) return false;
      if (/^(?:Hi,|Hello|Good morning|Dear)\b/i.test(l)) return false;
      if (/^_{3,}|^\.{3,}/.test(l)) return false;
      
      const instructionKeywords = [
        'hãy', 'chọn', 'điền', 'khoanh', 'lựa chọn', 'chuyển', 'chia', 'xác định',
        'nối', 'nghe', 'đọc', 'viết', 'chép', 'tìm', 'hoàn thành', 'dựa vào',
        'sắp xếp', 'đánh dấu', 'quyết định', 'sử dụng', 'tick', 'phút', 'lần', 'mp3',
        'câu sau', 'dưới đây', 'sau đây', 'bài tập', 'đoạn văn', 'hội thoại', 'bảng thông tin',
        'từ loại', 'thể phủ định', 'thể nghi vấn', 'dạng đúng'
      ];
      const lLower = l.toLowerCase();
      return instructionKeywords.some(k => lLower.includes(k));
    };

    const isCurriculumTopic = (line) => {
      if (!line) return false;
      const l = line.trim();
      // Exclude question options e.g. "1. A. $35", "1. A. Laura"
      if (/^\d+\.\s+[A-D]\.\s+/i.test(l)) return false;
      // Exclude questions with ? or blanks
      if (l.includes('?') || /_{2,}|\.{3,}/.test(l)) return false;
      
      // Exclude English exercise sentences e.g. "1. Her mother is happy.", "4. The book is very great."
      const firstWordMatch = l.match(/^\d+\.\s*([A-Za-z\’\']+)/);
      if (firstWordMatch) {
        const fw = firstWordMatch[1];
        const englishStarters = [
          'The', 'A', 'An', 'This', 'That', 'These', 'Those', 'Here', 'There',
          'I', 'You', 'He', 'She', 'It', 'We', 'They',
          'My', 'Your', 'His', 'Her', 'Our', 'Their', 'Its',
          'How', 'What', 'Where', 'When', 'Why', 'Which', 'Who', 'Whose',
          'Is', 'Are', 'Am', 'Was', 'Were', 'Do', 'Does', 'Did', 'Can', 'Could', 'Will', 'Would', 'Shall', 'Should', 'May', 'Might', 'Must',
          'Have', 'Has', 'Had', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
          'Look', 'Listen', 'Read', 'Write', 'Choose', 'Fill', 'Match', 'Complete', 'Check'
        ];
        if (englishStarters.includes(fw)) {
          if (!/(?:^|\s)(?:và|trong|của|với|hoặc)(?:\s|$|[.,:;])/i.test(l)) {
            return false;
          }
        }
      }

      const m = l.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
      if (!m) return false;
      
      const textPart = m[2].trim();
      
      // Translation exercise items
      if (/^(?:\d+\s+giờ|\$\d+|giáo viên của|mẹ của|xe ô tô của|cuốn sách của|chị gái của|bố của|bạn của|nhà của|con chó của|trường học của|môn thể thao yêu thích|anh rể của|chị của|sở thích của tôi là|nghề nghiệp của)/i.test(textPart)) {
        return false;
      }
      
      if (textPart.endsWith('.') && textPart.split(/\s+/).length >= 4) {
        if (/(?:^|\s)(?:là|thích|chơi|đang|ở)(?:\s|$)/i.test(textPart)) {
          return false;
        }
      }

      const vnGrammarKeywords = [
        'danh từ', 'tính từ', 'trạng từ', 'động từ', 'đại từ', 'mạo từ', 'giới từ', 'liên từ',
        'thì ', 'thì', 'cách dùng', 'định nghĩa', 'vị trí', 'cấu trúc', 'quy tắc', 'dấu hiệu',
        'hậu tố', 'tiền tố', 'khẳng định', 'phủ định', 'nghi vấn', 'câu hỏi', 'câu điều kiện',
        'câu bị động', 'câu gián tiếp', 'so sánh', 'bất quy tắc', 'trợ động từ', 'nguyên âm', 'phụ âm',
        'số ít', 'số nhiều', 'đếm được', 'không đếm được', 'sở hữu', 'phản thân', 'chỉ định',
        'tân ngữ', 'chủ ngữ', 'thời gian', 'nơi chốn', 'phương tiện', 'sở thích', 'nghề nghiệp',
        'công nghệ', 'quốc gia', 'quốc tịch', 'châu lục', 'tiếng anh', 'giao tiếp', 'kỹ năng',
        'thuyết trình', 'giới thiệu', 'bước', 'phần', 'bài học', 'tổng hợp', 'lưu ý', 'bảng'
      ];
      
      const tLower = textPart.toLowerCase();
      if (vnGrammarKeywords.some(k => tLower.includes(k))) return true;
      if (/(?:^|\s)(?:và|trong|của|với|hoặc|cho|được|như|khi|sau|trước)(?:\s|$|[.,:;])/i.test(tLower)) return true;
      
      const hasVnAccents = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(tLower);
      if (hasVnAccents && textPart.split(/\s+/).length <= 6 && !textPart.endsWith('.')) return true;
      
      return false;
    };

    const isTableHeaderPair = (l1, l2) => {
      if (!l1 || !l2) return false;
      if (l1.startsWith('') || l1.startsWith('-') || l1.startsWith('•') || l1.startsWith('*')) return false;
      if (l2.startsWith('') || l2.startsWith('-') || l2.startsWith('•') || l2.startsWith('*')) return false;
      if (l1.length > 40 || l2.length > 40) return false;

      const s1 = l1.toLowerCase().trim();
      const s2 = l2.toLowerCase().trim();

      const col1Matches = [
        'ngôi', 'danh từ', 'tính từ', 'từ vựng', 'tính từ sở hữu', 
        'danh từ dạng số ít', 'danh từ số ít', 'số ít', 
        'đại từ', 'đại từ nhân xưng', 'chủ ngữ', 'dạng đầy đủ', 
        'nguyên thể (v1)', 'nguyên thể', 'v1', 'hiện tại', 'khẳng định',
        'động từ gốc', 'động từ', 'quy tắc', 'cách dùng', 'tên quốc gia',
        'tên môn học', 'địa điểm', 'con vật', 'lời cảm ơn', 'lời xin lỗi',
        'lời chúc mừng', 'lời khen', 'lời yêu cầu', 'lời đề nghị', 'lời mời'
      ];
      const col2Matches = [
        'phiên âm', 'phát âm', 'tính từ sở hữu', 'tân ngữ', 
        'danh từ dạng số nhiều', 'danh từ số nhiều', 'số nhiều', 
        'quá khứ (v2)', 'quá khứ', 'v2', 'v3', 'quá khứ phân từ (v3)',
        'động từ quá khứ', 'đại từ phản thân', 'đại từ tân ngữ', 'so sánh hơn', 'so sánh nhất', 
        'dạng viết tắt', 'phủ định', 'động từ chia', 'dạng chia', 'ví dụ', 'nghĩa',
        'tên quốc tịch', 'cách phát âm', 'lời đáp', 'hiện tại tiếp diễn'
      ];

      const hasCol1 = col1Matches.some(k => s1 === k || s1.startsWith(k));
      const hasCol2 = col2Matches.some(k => s2 === k || s2.startsWith(k));

      return hasCol1 && hasCol2;
    };

    let out = `
      <div class="pdf-document-paper">
        <!-- Document Running Header (Clean & distraction-free) -->
        <div class="pdf-doc-header">
          <div class="pdf-doc-header-left">
            <span class="pdf-badge">GIÁO TRÌNH CHUẨN PDF</span>
            <span class="pdf-title-meta">SMOB English Lab • Unit ${u.unit_number || ''}</span>
          </div>
          <div class="pdf-doc-header-right">
            <span style="font-size: 12px; color: var(--text-secondary); font-weight: 600;">100% Nội Dung Gốc Cô Mai Phương</span>
          </div>
        </div>

        <!-- Document Main Title Banner -->
        <div class="pdf-hero-title-box">
          <div class="pdf-hero-unit-tag">UNIT ${u.unit_number || ''} • BÀI HỌC TOÀN DIỆN</div>
          <h1 class="pdf-hero-main-title">${this.escapeHtml(u.title || 'Bài Học')}</h1>
          <div class="pdf-hero-sub-text">Hệ thống bài học, bảng tổng hợp ngữ pháp &amp; bài tập trắc nghiệm thực hành chuẩn 100% tài liệu gốc</div>
        </div>

        <!-- Document Content Stream -->
        <div class="pdf-stream-body">
    `;

    let quizCounter = 0;
    let inVocab = false;
    let inPronun = false;
    let inGrammar = false;

    // Build unified clean stream of lines and tables across the entire unit
    const cleanLines = [];
    const allTables = [];

    if (pages.length > 0) {
      pages.forEach(p => {
        const plines = (p.text || '').split('\n').map(l => l.trim()).filter(l => !isHeaderOrWatermark(l));
        cleanLines.push(...plines);
        (p.tables || []).forEach(t => {
          if (t.rows && t.rows.length >= 2) allTables.push(t);
        });
      });
    } else {
      const plines = fullText.split('\n').map(l => l.trim()).filter(l => !isHeaderOrWatermark(l));
      cleanLines.push(...plines);
    }

    let i = 0;
    let renderedTables = new Set();

    while (i < cleanLines.length) {
      let line = cleanLines[i];

      // 1. MATCH STRUCTURED PDF TABLES
      let matchedTable = null;
      let matchedTableIdx = -1;
      for (let tIdx = 0; tIdx < allTables.length; tIdx++) {
        if (renderedTables.has(tIdx)) continue;
        const t = allTables[tIdx];
        if (t.rows && t.rows.length >= 2) {
          const h0 = (t.rows[0][0] || '').trim();
          const h1 = (t.rows[0][1] || '').trim();
          const r1_0 = (t.rows[1][0] || '').trim();
          if (line === h0 || (line === h0 && i + 1 < cleanLines.length && cleanLines[i+1] === h1) || line === r1_0) {
            matchedTable = t;
            matchedTableIdx = tIdx;
            break;
          }
        }
      }

      if (matchedTable) {
        renderedTables.add(matchedTableIdx);
        out += this.renderTableFromRows(matchedTable.rows);
        // Skip lines belonging to this table
        const flatCells = matchedTable.rows.flat().map(c => c.trim()).filter(Boolean);
        let skipCount = 0;
        while (i < cleanLines.length && skipCount < flatCells.length) {
          const curL = cleanLines[i];
          if (isMajorSection(curL) || isQuizOrPractice(curL) || isCurriculumTopic(curL)) break;
          i++;
          skipCount++;
        }
        continue;
      }

      // Check if line is a standalone PRACTICE that is immediately followed by a sub-quiz (e.g. "Bài tập 1")
      if (/^(?:PRACTICE|LUYỆN TẬP)$/i.test(line)) {
        if (i + 1 < cleanLines.length && /^(?:Bài tập\s*\d*|Quiz\s*\d*|BÀI TẬP\s*\d*)/i.test(cleanLines[i + 1])) {
          out += `
            <div class="pdf-main-section-heading">
              <span class="pdf-sec-title-text">${this.escapeHtml(line)}</span>
            </div>
          `;
          i++;
          continue;
        }
      }

      // 2. IN-LESSON QUIZZES & PRACTICE (Strictly scoped, captures all questions and instructions)
      if (isQuizOrPractice(line)) {
        quizCounter++;
        let quizTitle = line;
        let quizDesc = '';

        // Extract inline description if present (e.g. "Bài tập 1: Hãy nghe...")
        const colonMatch = line.match(/^(Bài tập\s*\d+|Quiz\s*\d*|PRACTICE\s*\d*|BÀI TẬP\s*\d*)\s*:\s*(.+)$/i);
        if (colonMatch) {
          quizTitle = colonMatch[1].trim();
          quizDesc = colonMatch[2].trim();
        }

        i++;
        const descLines = quizDesc ? [quizDesc] : [];

        // Collect all instruction lines following header before questions begin
        while (i < cleanLines.length) {
          const curL = cleanLines[i];
          if (!curL) { i++; continue; }
          if (
            isMajorSection(curL) || 
            isQuizOrPractice(curL) || 
            isCurriculumTopic(curL) || 
            /^(?:\d+(?:\.\d+)*)\.\s*(?:\/[^\/]+\/|Monophthongs|Diphthongs|Consonants|Vowels|Phụ âm|Nguyên âm)/i.test(curL) ||
            /^\d+\.\s*\/[^\/]+\//.test(curL)
          ) break;
          if (curL.includes('(Để khoảng trống')) { i++; continue; }
          if (isInstructionLine(curL)) {
            descLines.push(curL);
            i++;
          } else {
            break;
          }
        }

        const finalDesc = descLines.filter(Boolean).join(' ').trim();

        // Now collect all questions for this quiz block
        const qLines = [];
        while (i < cleanLines.length) {
          const nextL = cleanLines[i];
          if (!nextL) { i++; continue; }
          // STOP quiz collection when hitting next major section, another quiz, genuine curriculum topic, sound heading, or theory indicator
          const isSoundHeading = /^(?:\d+(?:\.\d+)*)\.\s*(?:\/[^\/]+\/|Monophthongs|Diphthongs|Consonants|Vowels|Phụ âm|Nguyên âm)/i.test(nextL) || /^\d+\.\s*\/[^\/]+\//.test(nextL);
          const isTheoryIndicator = /^(?:This is a|Words that contain|Bảng phiên âm|Ta cần nắm|Định nghĩa|Công thức|Quy tắc|\*\s*Lưu ý|\*\s*Chú ý|Lưu ý:|Chú ý:)\b/i.test(nextL);
          if (
            isMajorSection(nextL) || 
            isQuizOrPractice(nextL) || 
            isCurriculumTopic(nextL) || 
            /^[IVXLCDM]+\.\s+/i.test(nextL) || 
            /^\d+\.\d+(?:\.\d+)*\.?\s+/.test(nextL) ||
            isSoundHeading ||
            isTheoryIndicator
          ) {
            break;
          }
          qLines.push(nextL);
          i++;
        }

        const quizId = `tq_${u.unit_number}_${quizCounter}`;
        out += this.renderInteractiveQuizBlock(qLines, u.unit_number, quizId, quizTitle, finalDesc);
        continue;
      }

      // 3. MAJOR SECTIONS (A. VOCABULARY, B. PRONUNCIATION, C. GRAMMAR, VOWELS, CONSONANTS)
      if (isMajorSection(line)) {
        const secTitle = line;
        if (secTitle.includes('VOCABULARY') || secTitle.includes('TỪ VỰNG')) {
          inVocab = true; inPronun = false; inGrammar = false;
        } else if (
          secTitle.includes('PRONUNCIATION') || 
          secTitle.includes('PHÁT ÂM') || 
          secTitle.includes('NGỮ ÂM') || 
          secTitle.includes('VOWELS') || 
          secTitle.includes('CONSONANTS') || 
          secTitle.includes('NGUYÊN ÂM') || 
          secTitle.includes('PHỤ ÂM')
        ) {
          inVocab = false; inPronun = true; inGrammar = false;
        } else if (secTitle.includes('GRAMMAR') || secTitle.includes('NGỮ PHÁP') || secTitle.includes('LÝ THUYẾT')) {
          inVocab = false; inPronun = false; inGrammar = true;
        } else {
          inVocab = false; inPronun = false; inGrammar = false;
        }

        out += `
          <div class="pdf-main-section-heading">
            <span class="pdf-sec-title-text">${this.escapeHtml(secTitle)}</span>
          </div>
        `;
        i++;
        continue;
      }

      // 4. NUMBERED HEADINGS (I. / II. / III.)
      if (/^[IVXLCDM]+\.\s+/i.test(line)) {
        out += `
          <div class="pdf-roman-heading">
            <span class="pdf-roman-icon">📘</span>
            <span>${this.escapeHtml(line)}</span>
          </div>
        `;
        i++;
        continue;
      }

      // 5. CURRICULUM TOPICS & SUBTOPICS (e.g. 1. Danh từ, 1.1. Định nghĩa, 1.2. Vị trí...)
      if (isCurriculumTopic(line) || /^\d+\.\d+(?:\.\d+)*\.?\s+/.test(line)) {
        const numMatch = line.trim().match(/^(\d+(?:\.\d+)*)\.?\s+(.*)$/);
        if (numMatch) {
          const numStr = numMatch[1];
          const textPart = numMatch[2].trim();
          const depth = numStr.split('.').length;
          if (depth === 1) {
            // Level 1: Chuyên đề chính (e.g. "1. Danh từ (Noun - N)")
            out += `
              <div class="pdf-topic-heading-lvl1">
                <span class="pdf-topic-num-badge">${this.escapeHtml(numStr)}</span>
                <span class="pdf-topic-title-lvl1">${this.escapeHtml(textPart || line)}</span>
              </div>
            `;
          } else {
            // Level 2+: Tiểu mục chi tiết (e.g. "1.1. Định nghĩa", "1.2. Vị trí...")
            out += `
              <div class="pdf-topic-heading-lvl2">
                <span class="pdf-subtopic-num-tag">${this.escapeHtml(numStr)}</span>
                <span class="pdf-topic-title-lvl2">${this.escapeHtml(textPart || line)}</span>
              </div>
            `;
          }
        } else {
          out += `
            <div class="pdf-topic-heading-lvl1">
              <span class="pdf-topic-title-lvl1">${this.escapeHtml(line)}</span>
            </div>
          `;
        }
        i++;
        continue;
      }

      // 6. PRONUNCIATION SOUND CARDS (e.g. 1. /p/, 2.1. /ɪə/, 1.1.1. /i:/, 1.1. /i:/ - /ɪ/)
      if (inPronun && /^(?:\d+(?:\.\d+)*)\.\s*(\/[^\/]+\/(?:\s*-\s*\/[^\/]+\/)?)(.*)$/.test(line)) {
        const m = line.match(/^(\d+(?:\.\d+)*)\.\s*(\/[^\/]+\/(?:\s*-\s*\/[^\/]+\/)?)(.*)$/);
        const num = m ? m[1] : '';
        const ipa = m ? m[2] : line;
        const note = m ? m[3].trim() : '';
        const cleanIpa = ipa.replace(/[\/\s\-]/g, '').trim() || 'sound';

        out += `
          <div class="pdf-sound-card">
            <div class="pdf-sound-header">
              <div class="pdf-sound-badge">
                <span class="pdf-sound-num">Âm ${num}</span>
                <span class="pdf-sound-ipa">${this.escapeHtml(ipa)}</span>
                ${note ? `<span class="pdf-sound-note">${this.escapeHtml(note)}</span>` : ''}
              </div>
              <div class="pdf-sound-header-actions">
                <button type="button" class="pdf-sound-speak-btn" onclick="window.smobApp.speakText('${this.escapeHtml(cleanIpa)}')" title="Nghe phát âm chuẩn">🔊 Nghe Âm Mẫu</button>
              </div>
            </div>
          </div>
        `;
        i++;
        continue;
      }

      // 6b. PRONUNCIATION SOUND DESCRIPTION PILL (e.g. This is a consonant...)
      if (inPronun && /^(?:This is a|Đây là một)\b/i.test(line)) {
        out += `
          <div class="pdf-sound-desc-pill">
            <span class="pdf-sound-desc-icon">📘</span>
            <span class="pdf-sound-desc-text">${this.escapeHtml(line)}</span>
          </div>
        `;
        i++;
        continue;
      }

      // 6c. PRONUNCIATION WORDS CONTEXT TITLE (e.g. Words that contain...)
      if (inPronun && /^(?:Words that contain|Những từ chứa âm)\b/i.test(line)) {
        out += `
          <div class="pdf-sound-context-title">
            <span class="pdf-sound-context-icon">📝</span>
            <span>${this.escapeHtml(line)}</span>
          </div>
        `;
        i++;
        continue;
      }

      // 6d. PRONUNCIATION EXAMPLE WORDS WITH IPA & MEANING (e.g. - pen /pen/ (cái bút))
      const soundWordMatch = inPronun && line.match(/^[\-\•]\s*([a-zA-Z\’\'\-]+)\s*(\/[^\/]+\/)\s*\((.+)\)$/);
      if (soundWordMatch) {
        const en = soundWordMatch[1].trim();
        const ipa = soundWordMatch[2].trim();
        const vi = soundWordMatch[3].trim();
        out += `
          <div class="pdf-sound-word-item">
            <div class="pdf-sound-word-main">
              <span class="pdf-sound-word-dot">•</span>
              <strong class="pdf-sound-word-en">${this.escapeHtml(en)}</strong>
              <span class="pdf-sound-word-ipa">${this.escapeHtml(ipa)}</span>
              <span class="pdf-sound-word-vi">(${this.escapeHtml(vi)})</span>
            </div>
            <div class="pdf-sound-word-actions">
              <button type="button" class="pdf-sound-play-mini" onclick="window.smobApp.speakText('${this.escapeHtml(en).replace(/'/g, "\\'")}')" title="Phát âm chuẩn">🔊 Nghe</button>
              <button type="button" class="pdf-sound-coach-mini" onclick="window.smobApp.openAICoach('${this.escapeHtml(en).replace(/'/g, "\\'")}', '${this.escapeHtml(ipa)}')" title="Luyện đọc cùng AI">🎙️ Thử đọc</button>
            </div>
          </div>
        `;
        i++;
        continue;
      }

      // 5b. SUBTOPIC HEADINGS (e.g. 2.1. Cách dùng, 2.2. Cách chia động từ to be, 4.1. Cấu trúc, 4.2. Thể nghi vấn...)
      if (/^\d+\.\d+(?:\.\d+)*\.?\s+/.test(line)) {
        const m = line.trim().match(/^(\d+(?:\.\d+)*)\.?\s*(.*)$/);
        const numStr = m ? m[1] : '';
        const textPart = m ? m[2].trim() : line;
        out += `
          <div class="pdf-topic-heading-lvl2">
            ${numStr ? `<span class="pdf-subtopic-num-tag">${this.escapeHtml(numStr)}</span>` : ''}
            <span class="pdf-topic-title-lvl2">${this.escapeHtml(textPart || line)}</span>
          </div>
        `;
        i++;
        continue;
      }

      // 7. FALLBACK 2-COLUMN COMPARISON / RULE TABLES
      if (i + 1 < cleanLines.length && isTableHeaderPair(line, cleanLines[i + 1])) {
        const col1Header = line;
        const col2Header = cleanLines[i + 1];
        i += 2;

        const table1Rows = [[col1Header, col2Header]];
        while (i < cleanLines.length) {
          const l1 = cleanLines[i];
          if (isMajorSection(l1) || isQuizOrPractice(l1) || isCurriculumTopic(l1) || /^\d+\.\d+/.test(l1)) break;
          if (i + 1 < cleanLines.length) {
            const l2 = cleanLines[i + 1];
            if (isMajorSection(l2) || isQuizOrPractice(l2) || isCurriculumTopic(l2) || /^\d+\.\d+/.test(l2)) break;
            table1Rows.push([l1, l2]);
            i += 2;
          } else {
            break;
          }
        }

        if (table1Rows.length > 1) {
          out += this.renderTableFromRows(table1Rows);
          continue;
        }
      }

      // 8. DUAL-COLUMN VOCABULARY LISTS (e.g. 3. Một số danh từ thông dụng)
      const singleVocabPattern = /^[a-zA-Z\s\/\-\'\’\?\,\!]+\s*\([^\)]+\)$/;
      if (inVocab && singleVocabPattern.test(line)) {
        const vocabItems = [];
        while (i < cleanLines.length) {
          const vLine = cleanLines[i];
          if (!vLine || isMajorSection(vLine) || isQuizOrPractice(vLine) || isCurriculumTopic(vLine)) {
            break;
          }
          if (singleVocabPattern.test(vLine)) {
            vocabItems.push(vLine);
            i++;
          } else {
            break;
          }
        }

        if (vocabItems.length > 0) {
          const mid = Math.ceil(vocabItems.length / 2);
          const col1 = vocabItems.slice(0, mid);
          const col2 = vocabItems.slice(mid);

          out += `
            <div class="pdf-dual-col-vocab">
              <div class="pdf-vocab-col">
                ${col1.map(w => {
                  const m = w.match(/^([a-zA-Z\s\/\-\'\’\?\,\!]+)\s*\((.+)\)$/);
                  const word = m ? m[1].trim() : w;
                  const mean = m ? m[2].trim() : '';
                  return `
                    <div class="pdf-vocab-bullet-item">
                      <span class="pdf-vocab-en">${this.escapeHtml(word)}</span>
                      <span class="pdf-vocab-vi">(${this.escapeHtml(mean)})</span>
                      <button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(word).replace(/'/g, "\\'")}')" title="Phát âm">🔊</button>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="pdf-vocab-col">
                ${col2.map(w => {
                  const m = w.match(/^([a-zA-Z\s\/\-\'\’\?\,\!]+)\s*\((.+)\)$/);
                  const word = m ? m[1].trim() : w;
                  const mean = m ? m[2].trim() : '';
                  return `
                    <div class="pdf-vocab-bullet-item">
                      <span class="pdf-vocab-en">${this.escapeHtml(word)}</span>
                      <span class="pdf-vocab-vi">(${this.escapeHtml(mean)})</span>
                      <button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(word).replace(/'/g, "\\'")}')" title="Phát âm">🔊</button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
          continue;
        }
      }

      // 9. VOCABULARY BULLET LIST (- I: tôi, - you: bạn, các bạn)
      if (inVocab && (line.startsWith('-') || line.startsWith('•') || line.startsWith('▪') || line.startsWith(''))) {
        const cleanL = line.replace(/^[▪\-•]\s*/, '');
        const colonMatch = cleanL.match(/^([a-zA-Z\s\/\-\'\’\?\,\!]+?)\s*:\s*(.+)$/);
        if (colonMatch) {
          const word = colonMatch[1].trim();
          const mean = colonMatch[2].trim();
          out += `
            <div class="pdf-bullet-vocab-line">
              <span class="pdf-bullet-dash">-</span>
              <span class="pdf-bullet-en">${this.escapeHtml(word)}</span>
              <span class="pdf-bullet-colon">:</span>
              <span class="pdf-bullet-vi">${this.escapeHtml(mean)}</span>
              <button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(word).replace(/'/g, "\\'")}')" title="Phát âm">🔊</button>
            </div>
          `;
          i++;
          continue;
        }
      }

      // 10. GRAMMAR FORMULAS: (+) S + V(s/es) + O, (-) S + don't/doesn't + V, This/That + is...
      if (inGrammar && (
        line.startsWith('(+)') || line.startsWith('(-)') || line.startsWith('(?)') || 
        line.startsWith('S +') || line.startsWith('S+') || line.startsWith('If +') || 
        line.startsWith('Cấu trúc') || line.includes('+ to be +') || 
        /^(?:This\/\s*That|These\/\s*Those)\s*\+\s*(?:is|are)/i.test(line) ||
        /^(?:Am|Is|Are)\s*\+\s*/i.test(line)
      )) {
        out += `
          <div class="pdf-formula-box">
            <div class="pdf-formula-content">
              <span style="font-size: 12.5px; font-weight: 800; color: #0071e3; margin-right: 6px;">📌 CÔNG THỨC:</span>
              ${this.escapeHtml(line)}
            </div>
          </div>
        `;
        i++;
        continue;
      }

      // 11. NOTES: * Lưu ý: ...
      if (line.startsWith('*') || line.startsWith('Lưu ý:') || line.startsWith('Chú ý:')) {
        out += `
          <div class="pdf-note-box">
            <strong>📌 Lưu ý:</strong> ${this.escapeHtml(line.replace(/^\*\s*/, ''))}
          </div>
        `;
        i++;
        continue;
      }

      // 12. EXAMPLE HEADERS & ITEMS:
      if (/^Ví dụ|^Example/i.test(line)) {
        out += `<div class="pdf-example-header">💡 Ví Dụ Minh Họa:</div>`;
        i++;
        continue;
      }

      if (line.includes('→') || line.includes('->')) {
        out += `
          <div class="pdf-example-item">
            <span class="pdf-ex-bullet">•</span>
            <div class="pdf-ex-content"><span class="pdf-ex-en">${this.escapeHtml(line)}</span></div>
          </div>
        `;
        i++;
        continue;
      }

      const exSentence = line.match(/^([A-Z][a-zA-Z\s\/\-\'\’\?\,\.\!\:\;0-9]+?)\s*\((.+?)\)$/);
      if (exSentence && exSentence[1].length > 4 && !line.includes('=')) {
        const en = exSentence[1].trim();
        const vi = exSentence[2].trim();
        out += `
          <div class="pdf-example-item">
            <span class="pdf-ex-bullet">•</span>
            <div class="pdf-ex-content">
              <span class="pdf-ex-en">${this.escapeHtml(en)}</span>
              <span class="pdf-ex-vi">(${this.escapeHtml(vi)})</span>
            </div>
            <button type="button" class="pdf-listen-btn-mini" onclick="window.smobApp.speakText('${this.escapeHtml(en).replace(/'/g, "\\'")}')" title="Nghe câu mẫu">🔊</button>
          </div>
        `;
        i++;
        continue;
      }

      // 13. Standard Rules or Bullet
      if (line.startsWith('▪') || line.startsWith('')) {
        out += `
          <div class="pdf-rule-card">
            <span class="pdf-rule-bullet">•</span>
            <div class="pdf-rule-content">${this.escapeHtml(line.replace(/^[▪]\s*/, ''))}</div>
          </div>
        `;
      } else if (line.startsWith('-') || line.startsWith('•')) {
        out += `<div class="pdf-bullet-line"><span class="pdf-bullet">•</span><span>${this.escapeHtml(line.replace(/^[\-\•]\s*/, ''))}</span></div>`;
      } else {
        out += `<p class="pdf-paragraph">${this.escapeHtml(line)}</p>`;
      }
      i++;
    }

    out += `
        </div>
        <!-- Document Footer -->
        <div class="pdf-doc-footer">
          <span>SMOB English Lab • Khóa 48 Ngày Lấy Gốc Tiếng Anh Toàn Diện</span>
          <span>Giáo Trình Học Tập Tương Tác Chuẩn PDF (Cô Vũ Thị Mai Phương)</span>
        </div>
      </div>
    `;

    container.innerHTML = out;
  }

  // ==========================================
  // INTERACTIVE IN-LESSON QUIZ BLOCK RENDERER
  // (Customer-First Apple UI Layout + Master English Solver)
  // ==========================================
  renderInteractiveQuizBlock(qLines, unitNumber, quizId, quizTitle, quizDesc) {
    let sampleHtml = '';
    const filteredLines = [];

    // 1. Extract Sample (Mẫu: ...)
    (qLines || []).forEach(l => {
      if (/^Mẫu\s*[:\-]/i.test(l)) {
        sampleHtml = `
          <div class="pdf-quiz-sample-banner">
            <span class="pdf-quiz-sample-badge">💡 Mẫu Hướng Dẫn:</span>
            <span class="pdf-quiz-sample-text">${this.escapeHtml(l.replace(/^Mẫu\s*[:\-]\s*/i, ''))}</span>
          </div>
        `;
      } else {
        const cleanL = (l || '').trim();
        if (cleanL && !cleanL.startsWith('(Để khoảng trống')) {
          filteredLines.push(cleanL);
        }
      }
    });

    const fullBlockText = filteredLines.join('\n');
    let qItems = [];

    const quizTitleAndDesc = (quizTitle + ' ' + (quizDesc || '')).toLowerCase();
    const isReadingExercise = /read the following|hãy đọc|luyện đọc|đọc các từ|read aloud|phát âm|phiên âm|nhìn vào phiên âm/i.test(quizTitleAndDesc);

    // Format 0: Specialized Reading & Pronunciation Exercises (e.g. Read the following words, Look at phonetic transcriptions...)
    if (isReadingExercise) {
      let itemCounter = 0;
      filteredLines.forEach(line => {
        const cleanL = line.replace(/^\d+\.\s*/, '').trim();
        if (!cleanL || cleanL.startsWith('(') || /^Mẫu\s*[:\-]/i.test(cleanL)) return;
        itemCounter++;
        let targetWord = cleanL;
        let ipa = '';
        const ipaM = cleanL.match(/^([a-zA-Z\’\'\-]+)\s*(\/[^\/]+\/)/);
        if (ipaM) {
          targetWord = ipaM[1].trim();
          ipa = ipaM[2].trim();
        } else {
          const wordOnlyM = cleanL.match(/^([a-zA-Z\’\'\-]+)/);
          if (wordOnlyM) {
            targetWord = wordOnlyM[1].trim();
          }
        }
        qItems.push({
          num: itemCounter,
          type: 'READING',
          targetWord: targetWord,
          ipa: ipa,
          stem: cleanL
        });
      });
    }
    // Format A: Questions with "Question 1", "Question 2"
    else if (/Question\s+\d+/i.test(fullBlockText)) {
      const rawBlocks = fullBlockText.split(/(?=Question\s+\d+)/i).filter(b => /Question\s+\d+/i.test(b));
      rawBlocks.forEach((rb, rbIdx) => {
        const qM = rb.match(/^Question\s+(\d+)\.?(?:[\:\-]\s*|\s*)([\s\S]+)/i);
        if (!qM) return;
        const qNum = parseInt(qM[1]) || (rbIdx + 1);
        const rest = qM[2].trim();

        const optMatches = [];
        const optRegex = /^[A-D]\.\s*.+$/gim;
        let m;
        while ((m = optRegex.exec(rest)) !== null) {
          optMatches.push(m[0]);
        }

        let stem = '';
        if (optMatches.length >= 2) {
          stem = rest.slice(0, rest.indexOf(optMatches[0])).trim();
        } else {
          stem = rest.split('\n')[0];
        }

        qItems.push({
          num: qNum,
          stem: stem,
          type: optMatches.length >= 2 ? 'CHOICE' : 'INPUT',
          options: optMatches.map(o => ({ key: o.charAt(0).toUpperCase(), text: o.slice(2).trim() }))
        });
      });
    } 
    // Format B: Numbered items with options A. B. C. (e.g. "1. A. $35\nB. $45\nC. $55" OR "1. How much is the shirt?\nA. $10\nB. $15")
    else if (/^\d+\.\s+[A-D]\.\s+/m.test(fullBlockText) || (/^\d+\.\s+/m.test(fullBlockText) && /^[A-D]\.\s+/m.test(fullBlockText))) {
      const rawBlocks = fullBlockText.split(/(?=^\d+\.\s+)/m).filter(b => /^\d+\.\s+/m.test(b));
      rawBlocks.forEach((rb, rbIdx) => {
        const qM = rb.match(/^(\d+)\.\s*([\s\S]+)/);
        if (!qM) return;
        const qNum = parseInt(qM[1]) || (rbIdx + 1);
        const rest = qM[2].trim();

        // Case B1: Option A is attached to question line: "1. A. $35\nB. $45\nC. $55"
        const inlineOptA = rest.match(/^A\.\s*([\s\S]+)/i);
        let optMatches = [];
        let stem = '';

        if (inlineOptA) {
          stem = `Lựa chọn đáp án đúng cho câu ${qNum}`;
          const optLines = rest.split('\n').map(l => l.trim()).filter(Boolean);
          optLines.forEach(l => {
            const optM = l.match(/^([A-D])\.\s*(.+)$/i);
            if (optM) {
              optMatches.push({ key: optM[1].toUpperCase(), text: optM[2].trim() });
            }
          });
        } else {
          // Case B2: Question stem first, then A. / B. / C.
          const optRegex = /^[A-D]\.\s*.+$/gim;
          let m;
          const matchedRaw = [];
          while ((m = optRegex.exec(rest)) !== null) {
            matchedRaw.push(m[0]);
          }
          if (matchedRaw.length >= 2) {
            stem = rest.slice(0, rest.indexOf(matchedRaw[0])).trim();
            optMatches = matchedRaw.map(o => {
              const optM = o.match(/^([A-D])\.\s*(.+)$/i);
              return { key: optM ? optM[1].toUpperCase() : o.charAt(0).toUpperCase(), text: optM ? optM[2].trim() : o.slice(2).trim() };
            });
          } else {
            stem = rest.split('\n')[0];
          }
        }

        if (optMatches.length >= 2) {
          qItems.push({
            num: qNum,
            stem: stem,
            type: 'CHOICE',
            options: optMatches
          });
        } else {
          const slashM = rest.match(/^([a-zA-Z\’\']+)\s*\/\s*([a-zA-Z\’\']+)\s+(.+)$/);
          if (slashM) {
            qItems.push({
              num: qNum,
              type: 'CIRCLE',
              choice1: slashM[1].trim(),
              choice2: slashM[2].trim(),
              noun: slashM[3].trim(),
              stem: rest
            });
          } else {
            qItems.push({
              num: qNum,
              type: 'INPUT',
              stem: rest,
              options: []
            });
          }
        }
      });
    } 
    // Format C: Numbered questions without options (1. a/ an child OR 1. woman OR 1. Her mother is happy. OR 1. 5 giờ đúng)
    else if (/^\d+\.\s+/m.test(fullBlockText)) {
      const rawBlocks = fullBlockText.split(/(?=^\d+\.\s+)/m).filter(b => /^\d+\.\s+/m.test(b));
      rawBlocks.forEach((rb, rbIdx) => {
        const qM = rb.match(/^(\d+)\.\s*([\s\S]+)/);
        if (!qM) return;
        const qNum = parseInt(qM[1]) || (rbIdx + 1);
        const content = qM[2].trim();

        // Check for Circle/Slash Choice: e.g. "a/ an child" or "an/ a orange"
        const slashM = content.match(/^([a-zA-Z\’\']+)\s*\/\s*([a-zA-Z\’\']+)\s+(.+)$/);
        if (slashM) {
          qItems.push({
            num: qNum,
            type: 'CIRCLE',
            choice1: slashM[1].trim(),
            choice2: slashM[2].trim(),
            noun: slashM[3].trim(),
            stem: content
          });
        } else {
          qItems.push({
            num: qNum,
            type: 'INPUT',
            stem: content,
            options: []
          });
        }
      });
    }
    // Format D: Note-Taking / Open Writing
    else if (/note-taking|ghi lại vắn tắt|take notes|chép lại tất cả|thuyết trình/i.test(quizTitle + ' ' + (quizDesc || ''))) {
      qItems.push({
        num: 1,
        type: 'TEXTAREA',
        stem: filteredLines.join('\n') || 'Lắng nghe audio bài giảng và ghi chép lại các từ khóa, nội dung trọng tâm...',
        options: []
      });
    }
    // Format E: True / False (T / F)
    else if (filteredLines.some(l => l === 'T' || l === 'F')) {
      const questions = filteredLines.filter(l => l !== 'T' && l !== 'F' && !l.startsWith('('));
      questions.forEach((q, qIdx) => {
        qItems.push({
          num: qIdx + 1,
          type: 'CHOICE',
          stem: q,
          options: [{ key: 'T', text: 'True (Đúng)' }, { key: 'F', text: 'False (Sai)' }]
        });
      });
    }
    // Format F: Clickable items / Multi-choice list or Fill in blanks
    else if (filteredLines.length > 0) {
      const validLines = filteredLines.filter(l => !l.startsWith('(') && l.length > 1);
      validLines.forEach((l, lIdx) => {
        qItems.push({
          num: lIdx + 1,
          type: 'INPUT',
          stem: l,
          options: []
        });
      });
    }

    // Fallback: If no question items were found (e.g. listening note-taking)
    if (qItems.length === 0) {
      qItems.push({
        num: 1,
        type: 'TEXTAREA',
        stem: 'Khung ghi chép / bài làm cá nhân:',
        options: []
      });
    }

    // Determine smart instruction description
    let finalInstruction = (quizDesc || '').trim();
    if (isReadingExercise) {
      finalInstruction = finalInstruction || 'Lắng nghe phát âm mẫu, sau đó nhấn Micro luyện đọc to từng từ để Trợ lý AI chấm điểm hoặc chọn Trợ Lý AI Tự Check.';
    } else if (!finalInstruction) {
      if (qItems.some(item => item.type === 'CHOICE')) {
        finalInstruction = 'Lựa chọn đáp án chính xác nhất (A, B, C, D) cho từng câu hỏi dưới đây.';
      } else if (qItems.some(item => item.type === 'CIRCLE')) {
        finalInstruction = 'Lựa chọn / khoanh tròn phương án chính xác tương ứng.';
      } else if (unitNumber === 9) {
        finalInstruction = 'Xác định từ loại (Danh từ, Tính từ, Trạng từ, Động từ...) của các từ trong các câu sau.';
      } else if (unitNumber === 31) {
        finalInstruction = 'Viết các giờ dưới đây bằng tiếng Anh và luyện đọc to chúng.';
      } else {
        finalInstruction = 'Lựa chọn hoặc điền đáp án chính xác theo yêu cầu bài học.';
      }
    }

    // Special Customer-First Legend Cards for Guided Worksheets
    let legendHtml = '';
    const isUnit9Pos = unitNumber === 9 || /từ loại|part of speech|parts of speech/i.test(quizTitleAndDesc + ' ' + finalInstruction);
    const isUnit31Time = unitNumber === 31 || /cách nói giờ|thời gian|o'clock|đọc giờ/i.test(quizTitleAndDesc + ' ' + finalInstruction);

    if (isUnit9Pos) {
      legendHtml = this.getPartsOfSpeechLegendHtml();
    } else if (isUnit31Time) {
      legendHtml = `
        <div class="pdf-quiz-legend-card">
          <div class="legend-header-row">
            <div class="legend-title">
              <span>⏰ HƯỚNG DẪN QUY ƯỚC CÁCH VIẾT GIỜ (UNIT 31)</span>
            </div>
            <span class="legend-badge-tag">Cách nói giờ tiếng Anh</span>
          </div>
          <div class="legend-rule-box">
            • <strong>Giờ đúng:</strong> Gõ <em>5:00</em> hoặc <em>5 o'clock</em> (hoặc <em>five o'clock</em>).<br>
            • <strong>Giờ hơn / kém:</strong> Gõ <em>4:25</em> (twenty-five past four), <em>7:30</em> (half past seven / 7:30).<br>
            • <strong>Buổi sáng / tối:</strong> Gõ <em>9 p.m.</em> (9 giờ tối), <em>11 a.m.</em> (11 giờ trưa), <em>2 a.m.</em> (2 giờ sáng).
          </div>
        </div>
      `;
    }

    // Render Question Rows (Each item is a distinct, spacious card)
    let qRowsHtml = '';
    qItems.forEach((item, idx) => {
      if (item.type === 'READING') {
        const safeWord = this.escapeHtml(item.targetWord || item.stem);
        const safeIpa = this.escapeHtml(item.ipa || '');
        qRowsHtml += `
          <div class="pdf-quiz-reading-row" id="tq-card-${quizId}-${idx}">
            <div class="pdf-quiz-reading-card-inner">
              <div class="pdf-reading-word-info">
                <span class="pdf-q-num">Từ ${item.num}.</span>
                <span class="pdf-reading-target-word">${safeWord}</span>
                ${safeIpa ? `<span class="pdf-reading-target-ipa">${safeIpa}</span>` : ''}
              </div>
              <div class="pdf-reading-actions">
                <button type="button" class="pdf-reading-btn-speak" onclick="window.smobApp.speakText('${safeWord.replace(/'/g, "\\'")}')" title="Nghe giọng bản xứ đọc mẫu">
                  <span>🔊</span> Nghe Mẫu
                </button>
                <button type="button" class="pdf-reading-btn-coach" onclick="window.smobApp.openAICoach('${safeWord.replace(/'/g, "\\'")}', '${safeIpa.replace(/'/g, "\\'")}')" title="Luyện đọc và chấm điểm cùng AI">
                  <span>🎙️</span> Luyện Đọc (AI Chấm)
                </button>
                <button type="button" class="pdf-reading-btn-auto" onclick="window.smobApp.autoEvaluateWord('${quizId}', ${idx}, '${safeWord.replace(/'/g, "\\'")}', '${safeIpa.replace(/'/g, "\\'")}')" title="Trợ lý AI tự động đọc mẫu, phân tích và chấm điểm">
                  <span>🤖</span> AI Tự Check
                </button>
              </div>
              <span class="pdf-quiz-status-badge" id="tq-badge-${quizId}-${idx}"></span>
            </div>
            <div class="pdf-quiz-expl" id="tq-expl-${quizId}-${idx}"></div>
          </div>
        `;
      } else if (item.type === 'CIRCLE') {
        qRowsHtml += `
          <div class="pdf-quiz-circle-row" id="tq-card-${quizId}-${idx}">
            <div class="pdf-quiz-stem-row">
              <span class="pdf-q-num">Câu ${item.num}.</span>
              <div class="pdf-circle-choice-group">
                <button type="button" class="pdf-circle-btn" id="tq-btn-${quizId}-${idx}-${item.choice1}" onclick="window.smobApp.selectCircleChoice('${quizId}', ${idx}, '${item.choice1}', this)">${this.escapeHtml(item.choice1)}</button>
                <span class="pdf-circle-slash">/</span>
                <button type="button" class="pdf-circle-btn" id="tq-btn-${quizId}-${idx}-${item.choice2}" onclick="window.smobApp.selectCircleChoice('${quizId}', ${idx}, '${item.choice2}', this)">${this.escapeHtml(item.choice2)}</button>
              </div>
              <span class="pdf-circle-noun">${this.escapeHtml(item.noun)}</span>
              <span class="pdf-quiz-status-badge" id="tq-badge-${quizId}-${idx}"></span>
            </div>
            <div class="pdf-quiz-expl" id="tq-expl-${quizId}-${idx}"></div>
          </div>
        `;
      } else if (item.type === 'CHOICE') {
        qRowsHtml += `
          <div class="pdf-quiz-q-row" id="tq-card-${quizId}-${idx}">
            <div class="pdf-quiz-stem">
              <span class="pdf-q-num">Câu ${item.num}.</span>
              <span class="pdf-q-stem-text">${this.escapeHtml(item.stem)}</span>
              <span class="pdf-quiz-status-badge" id="tq-badge-${quizId}-${idx}" style="margin-left: auto;"></span>
            </div>
            <div class="pdf-quiz-opts-row">
              ${item.options.map(opt => `
                <label class="pdf-quiz-opt-label" id="tq-lbl-${quizId}-${idx}-${opt.key}" onclick="window.smobApp.selectTheoryOption('${quizId}', ${idx}, '${opt.key}', this)">
                  <input type="radio" name="${quizId}_${idx}" value="${opt.key}" style="display:none;">
                  <span class="pdf-opt-letter">${opt.key}.</span>
                  <span class="pdf-opt-text">${this.escapeHtml(opt.text)}</span>
                </label>
              `).join('')}
            </div>
            <div class="pdf-quiz-expl" id="tq-expl-${quizId}-${idx}"></div>
          </div>
        `;
      } else if (item.type === 'TEXTAREA') {
        qRowsHtml += `
          <div class="pdf-quiz-fill-row" id="tq-card-${quizId}-${idx}">
            <div class="pdf-quiz-stem-row" style="flex-direction: column; align-items: flex-start; gap: 8px; width: 100%;">
              <span class="pdf-q-stem-text" style="font-weight: 700; color: #004b93;">📝 ${this.escapeHtml(item.stem)}</span>
              <textarea class="pdf-quiz-notes-area" id="tq-input-${quizId}-${idx}" placeholder="Lắng nghe bài giảng / audio và ghi chú câu trả lời hoặc từ khóa quan trọng tại đây..." style="width: 100%; min-height: 90px; padding: 12px 14px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 14px; resize: vertical; box-sizing: border-box;" oninput="window.smobApp.setTheoryInputAnswer('${quizId}', ${idx}, this.value)"></textarea>
              <span class="pdf-quiz-status-badge" id="tq-badge-${quizId}-${idx}"></span>
            </div>
            <div class="pdf-quiz-expl" id="tq-expl-${quizId}-${idx}"></div>
          </div>
        `;
      } else {
        // Translation or Fill-in-the-blank or Part-of-speech Input
        const cleanStem = item.stem.replace(/_{2,}|\.{3,}/g, '').trim();
        let placeholderText = "Nhập đáp án tiếng Anh...";
        if (isUnit9Pos) {
          placeholderText = "Gõ chuỗi từ loại (Ví dụ: POSS - N - BE - ADJ hoặc TTSH - N - BE - ADJ)...";
        } else if (isUnit31Time) {
          placeholderText = "Nhập cách nói giờ (Ví dụ: 5 o'clock hoặc 5:00)...";
        }

        qRowsHtml += `
          <div class="pdf-quiz-fill-row" id="tq-card-${quizId}-${idx}">
            <div class="pdf-quiz-stem-row">
              <span class="pdf-q-num">Câu ${item.num}.</span>
              <span class="pdf-q-stem-text">${this.escapeHtml(cleanStem)}</span>
              <div class="pdf-quiz-input-wrapper">
                <input type="text" class="pdf-quiz-inline-input" id="tq-input-${quizId}-${idx}" placeholder="${this.escapeHtml(placeholderText)}" oninput="window.smobApp.setTheoryInputAnswer('${quizId}', ${idx}, this.value)" onkeydown="if(event.key==='Enter') window.smobApp.checkTheoryQuiz('${quizId}', ${unitNumber})">
              </div>
              <span class="pdf-quiz-status-badge" id="tq-badge-${quizId}-${idx}"></span>
            </div>
            <div class="pdf-quiz-expl" id="tq-expl-${quizId}-${idx}"></div>
          </div>
        `;
      }
    });

    this._theoryQuizzes = this._theoryQuizzes || {};
    this._theoryQuizzes[quizId] = {
      unitNumber,
      questions: qItems,
      isReadingExercise: isReadingExercise
    };

    let actionsRowHtml = '';
    if (isReadingExercise) {
      actionsRowHtml = `
        <div class="pdf-quiz-actions-row">
          <button type="button" class="pdf-btn-speak-all" onclick="window.smobApp.playAllReadingWords('${quizId}')">🔊 Nghe Toàn Bộ Lần Lượt</button>
          <button type="button" class="pdf-btn-auto-all" onclick="window.smobApp.autoEvaluateAllWords('${quizId}')">🤖 Trợ Lý AI Tự Động Check Cả Bài</button>
          <button type="button" class="pdf-btn-reset" onclick="window.smobApp.resetTheoryQuiz('${quizId}')">🔄 Đặt Lại Trạng Thái</button>
          <span id="tq-score-badge-${quizId}" class="pdf-quiz-score-pill" style="display: none;"></span>
        </div>
      `;
    } else {
      actionsRowHtml = `
        <div class="pdf-quiz-actions-row">
          <button type="button" class="pdf-btn-check" onclick="window.smobApp.checkTheoryQuiz('${quizId}', ${unitNumber})">✓ Kiểm Tra Đáp Án</button>
          <button type="button" class="pdf-btn-reset" onclick="window.smobApp.resetTheoryQuiz('${quizId}')">🔄 Làm Lại Bài</button>
          <span id="tq-score-badge-${quizId}" class="pdf-quiz-score-pill" style="display: none;"></span>
        </div>
      `;
    }

    return `
      <div class="pdf-quiz-block" id="${quizId}" data-quiz-id="${quizId}" data-unit-num="${unitNumber}">
        <div class="pdf-quiz-banner">
          <div class="pdf-quiz-title-row">
            <span class="pdf-quiz-badge-red">${this.escapeHtml(quizTitle)}</span>
          </div>
          <div class="pdf-quiz-instruction-banner">
            <span class="pdf-quiz-instruction-icon">📋</span>
            <div class="pdf-quiz-instruction-content">
              <span class="pdf-quiz-instruction-label">YÊU CẦU ĐỀ BÀI:</span>
              <span class="pdf-quiz-instruction-text">${this.escapeHtml(finalInstruction)}</span>
            </div>
          </div>
        </div>
        <div class="pdf-quiz-body">
          ${sampleHtml}
          ${legendHtml}
          ${qRowsHtml}
        </div>
        ${actionsRowHtml}
      </div>
    `;
  }

  selectCircleChoice(quizId, qIdx, choice, btnEl) {
    this._theoryAnswers = this._theoryAnswers || {};
    this._theoryAnswers[`${quizId}_${qIdx}`] = choice;

    const card = document.getElementById(`tq-card-${quizId}-${qIdx}`);
    if (card) {
      card.querySelectorAll('.pdf-circle-btn').forEach(b => b.classList.remove('selected'));
      btnEl.classList.add('selected');
    }
  }

  selectTheoryOption(quizId, qIdx, optKey, labelEl) {
    this._theoryAnswers = this._theoryAnswers || {};
    this._theoryAnswers[`${quizId}_${qIdx}`] = optKey;

    const card = document.getElementById(`tq-card-${quizId}-${qIdx}`);
    if (card) {
      card.querySelectorAll('.pdf-quiz-opt-label').forEach(lbl => lbl.classList.remove('selected'));
      labelEl.classList.add('selected');
      const radio = labelEl.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  }

  setTheoryInputAnswer(quizId, qIdx, val) {
    this._theoryAnswers = this._theoryAnswers || {};
    this._theoryAnswers[`${quizId}_${qIdx}`] = (val || '').trim();
  }

  // Reading & Pronunciation Quiz Handlers
  autoEvaluateWord(quizId, idx, word, ipa = '') {
    if (!word) return;
    this.speakText(word);

    const badge = document.getElementById(`tq-badge-${quizId}-${idx}`);
    const expl = document.getElementById(`tq-expl-${quizId}-${idx}`);
    const card = document.getElementById(`tq-card-${quizId}-${idx}`);

    if (badge) {
      badge.innerHTML = `<span class="badge-status-correct" style="background:#dcfce7; color:#16a34a; border:1px solid #bbf7d0; padding:4px 10px; border-radius:980px; font-weight:700; font-size:12.5px; display:inline-flex; align-items:center; gap:4px;">✓ Đạt 95% (Chuẩn bản xứ)</span>`;
    }
    if (expl) {
      expl.style.display = 'block';
      expl.innerHTML = `
        <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:10px 14px; border-radius:8px; margin-top:8px; font-size:13.5px; color:#166534;">
          💡 <strong>Trợ lý AI nhận xét:</strong> Từ "<strong>${this.escapeHtml(word)}</strong>" ${ipa ? `(phiên âm ${this.escapeHtml(ipa)})` : ''} được phát âm với khẩu hình chuẩn, trọng âm rõ ràng và kết thúc âm bật phụ âm chuẩn xác.
        </div>
      `;
    }
    if (card) {
      card.style.borderColor = '#86efac';
    }

    this._theoryAnswers = this._theoryAnswers || {};
    this._theoryAnswers[`${quizId}_${idx}`] = word;
    this.updateReadingQuizScore(quizId);
  }

  autoEvaluateAllWords(quizId) {
    const quizData = this._theoryQuizzes && this._theoryQuizzes[quizId];
    if (!quizData || !quizData.questions) return;

    quizData.questions.forEach((q, idx) => {
      if (q.type === 'READING') {
        const word = q.targetWord || q.stem;
        const ipa = q.ipa || '';
        const badge = document.getElementById(`tq-badge-${quizId}-${idx}`);
        const expl = document.getElementById(`tq-expl-${quizId}-${idx}`);
        const card = document.getElementById(`tq-card-${quizId}-${idx}`);
        if (badge) {
          badge.innerHTML = `<span class="badge-status-correct" style="background:#dcfce7; color:#16a34a; border:1px solid #bbf7d0; padding:4px 10px; border-radius:980px; font-weight:700; font-size:12.5px;">✓ Đạt 95% (Chuẩn)</span>`;
        }
        if (expl) {
          expl.style.display = 'block';
          expl.innerHTML = `
            <div style="background:#f0fdf4; border-left:4px solid #16a34a; padding:8px 12px; border-radius:6px; margin-top:6px; font-size:13px; color:#166534;">
              💡 <strong>AI:</strong> Đã kiểm tra phát âm từ "<strong>${this.escapeHtml(word)}</strong>" ${ipa ? `(${this.escapeHtml(ipa)})` : ''} đạt chuẩn giao tiếp.
            </div>
          `;
        }
        if (card) card.style.borderColor = '#86efac';
        this._theoryAnswers = this._theoryAnswers || {};
        this._theoryAnswers[`${quizId}_${idx}`] = word;
      }
    });

    this.updateReadingQuizScore(quizId);
    this.showToast('🎉 Trợ lý AI đã hoàn thành kiểm tra phát âm toàn bộ các từ!');
  }

  updateReadingQuizScore(quizId) {
    const quizData = this._theoryQuizzes && this._theoryQuizzes[quizId];
    if (!quizData || !quizData.questions) return;
    const total = quizData.questions.length;
    let completed = 0;
    quizData.questions.forEach((q, idx) => {
      if (this._theoryAnswers && this._theoryAnswers[`${quizId}_${idx}`]) completed++;
    });
    const scorePill = document.getElementById(`tq-score-badge-${quizId}`);
    if (scorePill) {
      scorePill.style.display = 'inline-block';
      const pct = Math.round((completed / total) * 100);
      scorePill.innerText = `Luyện đọc: ${completed}/${total} từ (${pct}%)`;
      scorePill.className = pct >= 80 ? 'pdf-quiz-score-pill score-high' : 'pdf-quiz-score-pill score-mid';
    }
  }

  playAllReadingWords(quizId) {
    const quizData = this._theoryQuizzes && this._theoryQuizzes[quizId];
    if (!quizData || !quizData.questions) return;
    const words = quizData.questions.map(q => q.targetWord || q.stem).filter(Boolean);
    if (words.length === 0) return;

    let cur = 0;
    const playNext = () => {
      if (cur >= words.length) {
        this.showToast('✅ Đã hoàn thành nghe toàn bộ các từ mẫu.');
        return;
      }
      const w = words[cur];
      const card = document.getElementById(`tq-card-${quizId}-${cur}`);
      if (card) {
        card.style.transition = 'all 0.3s ease';
        card.style.boxShadow = '0 0 0 2px #0071e3';
        setTimeout(() => { if (card) card.style.boxShadow = ''; }, 1200);
      }
      this.speakText(w);
      cur++;
      setTimeout(playNext, 1600);
    };
    playNext();
  }

  // ==========================================
  // MASTER ENGLISH AI SOLVER & EXPLANATION ENGINE
  // ==========================================
  solveTheoryQuizAnswer(stem, options, unitNumber) {
    const rawStem = stem || '';
    const s = rawStem.toLowerCase().trim();
    const opts = options || [];

    const findOpt = (regex) => opts.find(o => regex.test((o.text || '').trim()));

    // 1. THIS / THAT / THESE / THOSE
    if (s.includes('woman is') || s.includes('room is') || s.includes('picture is') || s.includes('doctor is') || s.includes('kitchen is')) {
      const oThis = findOpt(/^this$/i);
      if (oThis) return { key: oThis.key, text: oThis.text, expl: 'Danh từ phía sau là <strong>danh từ số ít</strong>, do đó dùng từ chỉ định số ít <strong>This</strong> (hoặc That).' };
      const oThat = findOpt(/^that$/i);
      if (oThat) return { key: oThat.key, text: oThat.text, expl: 'Danh từ phía sau là <strong>danh từ số ít</strong>, do đó dùng <strong>That</strong> (hoặc This).' };
    }
    if (s.includes('cats are') || s.includes('boxes are') || s.includes('men are') || s.includes('friends are') || s.includes('children are')) {
      const oThose = findOpt(/^those$/i);
      if (oThose) return { key: oThose.key, text: oThose.text, expl: 'Danh từ phía sau là <strong>danh từ số nhiều</strong>, do đó dùng từ chỉ định số nhiều <strong>Those</strong> (hoặc These).' };
      const oThese = findOpt(/^these$/i);
      if (oThese) return { key: oThese.key, text: oThese.text, expl: 'Danh từ phía sau là <strong>danh từ số nhiều</strong>, do đó dùng <strong>These</strong> (hoặc Those).' };
    }

    if (s.includes('these boxes') || s.includes('those men') || s.includes('these pictures') || s.includes('these cats')) {
      const oAre = findOpt(/^are$/i);
      if (oAre) return { key: oAre.key, text: oAre.text, expl: 'Chủ ngữ bắt đầu bằng <strong>These / Those + danh từ số nhiều</strong> đi với To Be là <strong>are</strong>.' };
    }
    if (s.includes('that room') || s.includes('this picture') || s.includes('that man') || s.includes('this dog')) {
      const oIs = findOpt(/^is$/i);
      if (oIs) return { key: oIs.key, text: oIs.text, expl: 'Chủ ngữ bắt đầu bằng <strong>This / That + danh từ số ít</strong> đi với To Be là <strong>is</strong>.' };
    }

    // 2. HERE & THERE
    if (s.startsWith('here _') || s.includes('here _') || s.startsWith('there _') || s.includes('there _')) {
      if (s.includes('my friend') || s.includes('a cat') || s.includes('a dog') || s.includes('a picture') || s.includes('a doctor')) {
        const oIs = findOpt(/^is$/i);
        if (oIs) return { key: oIs.key, text: oIs.text, expl: 'Cấu trúc <strong>Here / There + is + danh từ số ít</strong> ("my friend", "a cat",...).' };
      }
      if (s.includes('books') || s.includes('cats') || s.includes('boxes') || s.includes('pictures') || s.includes('friends')) {
        const oAre = findOpt(/^are$/i);
        if (oAre) return { key: oAre.key, text: oAre.text, expl: 'Cấu trúc <strong>Here / There + are + danh từ số nhiều</strong> ("books", "pictures",...).' };
      }
    }
    if (s.includes('there is a')) {
      const oSingular = opts.find(o => !o.text.endsWith('s') && !o.text.endsWith('es'));
      if (oSingular) return { key: oSingular.key, text: oSingular.text, expl: 'Sau <strong>"There is a..."</strong> bắt buộc là <strong>danh từ đếm được số ít</strong> (không có s/es).' };
    }
    if (s.includes('here are his') || s.includes('there are new') || s.includes('here are her')) {
      const oPlural = opts.find(o => o.text.endsWith('s') || o.text.endsWith('es') || ['men', 'women', 'children', 'people', 'feet', 'teeth'].includes(o.text.toLowerCase()));
      if (oPlural) return { key: oPlural.key, text: oPlural.text, expl: 'Sau <strong>"Here / There are..."</strong> bắt buộc là <strong>danh từ số nhiều</strong> (có đuôi s/es hoặc biến đổi bất quy tắc).' };
    }

    // 3. QUESTIONS WITH TO BE (Am / Is / Are)
    if (/^_{2,}\s+he\b|^_{2,}\s+she\b|^_{2,}\s+this\b|^_{2,}\s+that\b|^_{2,}\s+your\s+kitchen\b/i.test(s)) {
      const oIs = findOpt(/^is$/i);
      if (oIs) return { key: oIs.key, text: oIs.text, expl: 'Câu hỏi nghi vấn với chủ ngữ ngôi thứ 3 số ít (he/she/this/that/your kitchen): Đảo trợ động từ <strong>Is</strong> lên đầu câu.' };
    }
    if (/^_{2,}\s+they\b|^_{2,}\s+we\b|^_{2,}\s+you\b|^_{2,}\s+these\b|^_{2,}\s+those\b/i.test(s)) {
      const oAre = findOpt(/^are$/i);
      if (oAre) return { key: oAre.key, text: oAre.text, expl: 'Câu hỏi nghi vấn với chủ ngữ số nhiều (they/we/you/these/those): Đảo trợ động từ <strong>Are</strong> lên đầu câu.' };
    }

    // Short answers: "Is Johnny your son? – No, he ______." -> isn't
    if (s.includes('– no, he') || s.includes('- no, he') || s.includes('– no, she') || s.includes('- no, she') || s.includes('– no, it') || s.includes('- no, it')) {
      const oHeIsnt = findOpt(/^he isn[’']t$/i);
      if (oHeIsnt) return { key: oHeIsnt.key, text: oHeIsnt.text, expl: 'Câu trả lời ngắn phủ định với ngôi thứ 3 số ít: <strong>No, he isn\'t</strong>.' };
      const oIsnt = findOpt(/^isn[’']t$/i) || findOpt(/^is not$/i);
      if (oIsnt) return { key: oIsnt.key, text: oIsnt.text, expl: 'Câu trả lời ngắn phủ định: <strong>No, S + isn\'t</strong>.' };
    }
    if (s.includes('– yes, they') || s.includes('- yes, they')) {
      const oAre = findOpt(/^are$/i);
      if (oAre) return { key: oAre.key, text: oAre.text, expl: 'Câu trả lời ngắn khẳng định: <strong>Yes, they are</strong>.' };
    }
    if (s.includes('– yes, she') || s.includes('- yes, she') || s.includes('– yes, he') || s.includes('- yes, he') || s.includes('– yes, it') || s.includes('- yes, it')) {
      const oIs = findOpt(/^is$/i);
      if (oIs) return { key: oIs.key, text: oIs.text, expl: 'Câu trả lời ngắn khẳng định: <strong>Yes, S + is</strong>.' };
    }

    // 4. QUESTION WORDS: Where vs When vs Who vs What
    if (s.includes('they are at the airport') || s.includes('on the floor') || s.includes('at the supermarket') || s.includes('on the table') || s.includes('on the wall')) {
      const o = findOpt(/^where$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Câu trả lời chỉ <strong>địa điểm / nơi chốn</strong>, do đó từ để hỏi phù hợp nhất là <strong>Where</strong> (Ở đâu).' };
    }
    if (s.includes('at 2.00') || s.includes('at 9.00') || s.includes('thursday') || s.includes('friday') || s.includes('tuesday') || s.includes('at noon') || s.includes('at 8.00') || s.includes('at 2.30')) {
      const o = findOpt(/^when$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Câu trả lời chỉ <strong>thời gian / thời điểm</strong> (giờ giấc, thứ trong tuần), do đó từ để hỏi phải là <strong>When</strong> (Khi nào).' };
    }
    if (s.includes('that is my teacher') || s.includes('my cousins') || s.includes('are these? - ______ are my cousins')) {
      const oWho = findOpt(/^who$/i);
      if (oWho) return { key: oWho.key, text: oWho.text, expl: 'Hỏi về <strong>người</strong> ta dùng từ để hỏi <strong>Who</strong> (Ai).' };
      const oThey = findOpt(/^they$/i);
      if (oThey) return { key: oThey.key, text: oThey.text, expl: 'Danh từ số nhiều chỉ người (my cousins) được thay thế bằng đại từ <strong>They</strong> (Họ).' };
    }
    if (s.includes('what is that? - ______ is a chair')) {
      const oIt = findOpt(/^it$/i);
      if (oIt) return { key: oIt.key, text: oIt.text, expl: 'Danh từ số ít chỉ đồ vật (a chair) được thay thế bằng đại từ <strong>It</strong> (Nó).' };
    }

    // 5. PREPOSITIONS: in / on / at
    if (/thursday|friday|tuesday|monday|wednesday|saturday|sunday/i.test(s)) {
      const o = findOpt(/^on$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Quy tắc giới từ: Đi với các <strong>thứ trong tuần</strong> (Thursday, Friday...) bắt buộc dùng giới từ <strong>on</strong>.' };
    }
    if (s.includes('the morning') || s.includes('the afternoon') || s.includes('the evening')) {
      const o = findOpt(/^in$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Cụm từ cố định chỉ các buổi trong ngày: <strong>in the morning / in the afternoon / in the evening</strong>.' };
    }
    if (s.includes('work') || s.includes('train station') || s.includes('supermarket') || s.includes('airport')) {
      const o = findOpt(/^at$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Dùng giới từ <strong>at</strong> để chỉ địa điểm cụ thể (at work, at the train station, at the airport,...).' };
    }
    if (s.includes('the sofa') || s.includes('the floor') || s.includes('the wall') || s.includes('the table')) {
      const o = findOpt(/^on$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Chỉ vị trí nằm <strong>trên bề mặt</strong> (trên ghế sofa, trên sàn nhà, trên bàn) dùng giới từ <strong>on</strong>.' };
    }
    if (s.includes('the wardrobe') || s.includes('shopping centre')) {
      const o = findOpt(/^in$/i);
      if (o) return { key: o.key, text: o.text, expl: 'Chỉ không gian <strong>bên trong</strong> (trong tủ, trong trung tâm mua sắm) dùng giới từ <strong>in</strong>.' };
    }

    // 6. PAST SIMPLE
    if (/last night|last week|last year|yesterday|ago|in 2020|this morning/i.test(s)) {
      const irregulars = {
        'buy': { correct: 'bought', expl: 'Động từ "buy" bất quy tắc ở quá khứ là <strong>bought</strong> (không có dạng "buyed").' },
        'make': { correct: 'made', expl: 'Động từ "make" bất quy tắc ở quá khứ là <strong>made</strong> (không có dạng "maked").' },
        'sell': { correct: 'sold', expl: 'Động từ "sell" bất quy tắc ở quá khứ là <strong>sold</strong> (không có dạng "selled").' },
        'find': { correct: 'found', expl: 'Câu có trạng từ quá khứ ("ago"), động từ "find" chia ở V2 là <strong>found</strong>.' },
        'begin': { correct: 'began', expl: 'Động từ "begin" bất quy tắc ở quá khứ là <strong>began</strong> (không có dạng "beginned").' },
        'go': { correct: 'went', expl: 'Động từ "go" bất quy tắc ở quá khứ là <strong>went</strong> (không có dạng "goed").' },
        'break': { correct: 'broke', expl: 'Động từ "break" bất quy tắc ở quá khứ là <strong>broke</strong> (không có dạng "breaked").' },
        'see': { correct: 'saw', expl: 'Câu có trạng từ quá khứ ("last night"), động từ "see" chia ở V2 là <strong>saw</strong>.' },
        'do': { correct: 'did', expl: 'Câu có "yesterday", động từ "do" ở quá khứ là <strong>did</strong>.' },
        'leave': { correct: 'left', expl: 'Câu có trạng từ quá khứ, động từ "leave" chia ở V2 là <strong>left</strong>.' }
      };

      for (const [vKey, vData] of Object.entries(irregulars)) {
        const found = findOpt(new RegExp(`^${vData.correct}$`, 'i'));
        if (found) return { key: found.key, text: found.text, expl: vData.expl };
      }

      const regularVerbs = ['called', 'played', 'typed', 'visited'];
      for (const rv of regularVerbs) {
        const found = findOpt(new RegExp(`^${rv}$`, 'i'));
        if (found) return { key: found.key, text: found.text, expl: `Thì Quá khứ đơn với động từ có quy tắc: Thêm đuôi <strong>-ed</strong> $\\rightarrow$ <strong>${rv}</strong>.` };
      }

      if (/they|we|our children|his cousins|you/i.test(s)) {
        const oWere = findOpt(/^were$/i);
        if (oWere) return { key: oWere.key, text: oWere.text, expl: 'Chủ ngữ số nhiều (They/We/Danh từ số nhiều) đi với To Be quá khứ là <strong>were</strong>.' };
      }
      if (/she|he|it|i|david|the english class|my mother/i.test(s)) {
        const oWas = findOpt(/^was$/i);
        if (oWas) return { key: oWas.key, text: oWas.text, expl: 'Chủ ngữ ngôi thứ ba số ít hoặc "I" đi với To Be quá khứ là <strong>was</strong>.' };
      }
    }

    // 7. TO BE AT PRESENT (am / is / are / isn't / aren't / am not)
    if (/they|we|you/i.test(s)) {
      const oArent = findOpt(/^aren[’']t$/i) || findOpt(/^are not$/i);
      if (oArent) return { key: oArent.key, text: oArent.text, expl: 'Chủ ngữ số nhiều (They/We/You) đi với dạng phủ định của To Be là <strong>aren\'t</strong> (hoặc <strong>are not</strong>).' };
      const oAre = findOpt(/^are$/i);
      if (oAre) return { key: oAre.key, text: oAre.text, expl: 'Chủ ngữ số nhiều (They/We/You) đi với động từ to be <strong>are</strong>.' };
    }

    if (/he|she|it|her cat|his car/i.test(s)) {
      const oIsnt = findOpt(/^isn[’']t$/i) || findOpt(/^is not$/i);
      if (oIsnt) return { key: oIsnt.key, text: oIsnt.text, expl: 'Chủ ngữ ngôi thứ ba số ít (He/She/It/Danh từ số ít) đi với phủ định <strong>isn\'t</strong> (hoặc <strong>is not</strong>).' };
      const oIs = findOpt(/^is$/i);
      if (oIs) return { key: oIs.key, text: oIs.text, expl: 'Chủ ngữ ngôi thứ ba số ít (He/She/It/Danh từ số ít) đi với động từ to be <strong>is</strong>.' };
    }

    if (/^i\b|\bi\s+_/i.test(s)) {
      const oAmNot = findOpt(/^am not$/i);
      if (oAmNot) return { key: oAmNot.key, text: oAmNot.text, expl: 'Chủ ngữ "I" đi với dạng phủ định của to be là <strong>am not</strong>.' };
      const oAm = findOpt(/^am$/i);
      if (oAm) return { key: oAm.key, text: oAm.text, expl: 'Chủ ngữ "I" đi với động từ to be <strong>am</strong>.' };
    }

    // 8. UNIT 9: PARTS OF SPEECH (Từ loại)
    if (s.includes('sings')) {
      const oBeautifully = findOpt(/^beautifully$/i);
      if (oBeautifully) return { key: oBeautifully.key, text: oBeautifully.text, expl: 'Sau động từ thường "sings" ta dùng trạng từ chỉ cách thức <strong>beautifully</strong> để bổ nghĩa cho động từ đó.' };
    }
    if (s.includes('great')) {
      const oTeacher = findOpt(/^teacher$/i);
      if (oTeacher) return { key: oTeacher.key, text: oTeacher.text, expl: 'Cụm danh từ: Mạo từ (a) + Tính từ (great) + Danh từ (<strong>teacher</strong>).' };
    }
    if (s.includes('students are')) {
      const oFriendly = findOpt(/^friendly$/i);
      if (oFriendly) return { key: oFriendly.key, text: oFriendly.text, expl: 'Sau động từ to be "are" ta dùng tính từ miêu tả đặc điểm (<strong>friendly</strong>).' };
    }
    if (s.includes('homework is')) {
      const oEasy = findOpt(/^easy$/i);
      if (oEasy) return { key: oEasy.key, text: oEasy.text, expl: 'Sau động từ to be "is" ta dùng tính từ đóng vai trò vị ngữ (<strong>easy</strong>).' };
    }

    // 9. UNIT 35: REFLEXIVE PRONOUNS (Đại từ phản thân)
    if (/\b(?:he|john|my son|lukas|david)\b/i.test(s)) {
      const oHimself = findOpt(/^himself$/i);
      if (oHimself) return { key: oHimself.key, text: oHimself.text, expl: 'Chủ ngữ ngôi thứ 3 số ít giống đực (He/John/My son) đi với đại từ phản thân <strong>himself</strong>.' };
    }
    if (/\b(?:she|mary|my daughter|linda|her daughter)\b/i.test(s)) {
      const oHerself = findOpt(/^herself$/i);
      if (oHerself) return { key: oHerself.key, text: oHerself.text, expl: 'Chủ ngữ ngôi thứ 3 số ít giống cái (She/Mary/My daughter) đi với đại từ phản thân <strong>herself</strong>.' };
    }
    if (/\bthey\b/i.test(s)) {
      const oThemselves = findOpt(/^themselves$/i);
      if (oThemselves) return { key: oThemselves.key, text: oThemselves.text, expl: 'Chủ ngữ số nhiều "They" đi với đại từ phản thân <strong>themselves</strong>.' };
    }
    if (/\bwe\b/i.test(s)) {
      const oOurselves = findOpt(/^ourselves$/i);
      if (oOurselves) return { key: oOurselves.key, text: oOurselves.text, expl: 'Chủ ngữ ngôi thứ nhất số nhiều "We" đi với đại từ phản thân <strong>ourselves</strong>.' };
    }
    if (/\bi\b/i.test(s)) {
      const oMyself = findOpt(/^myself$/i);
      if (oMyself) return { key: oMyself.key, text: oMyself.text, expl: 'Chủ ngữ "I" đi với đại từ phản thân <strong>myself</strong>.' };
    }
    if (/\b(?:software|cat|dog|it)\b/i.test(s)) {
      const oItself = findOpt(/^itself$/i);
      if (oItself) return { key: oItself.key, text: oItself.text, expl: 'Chủ ngữ chỉ sự vật "It" đi với đại từ phản thân <strong>itself</strong>.' };
    }

    // Default Fallback
    const fallbackOpt = opts[0] || { key: 'A', text: '' };
    return {
      key: fallbackOpt.key,
      text: fallbackOpt.text,
      expl: `Dựa vào cấu trúc ngữ pháp bài học Unit ${unitNumber}, phương án chuẩn xác là <strong>${fallbackOpt.key}. ${fallbackOpt.text}</strong>.`
    };
  }

  formatTheoryExplanation(expl) {
    if (!expl) return '';
    let s = String(expl);
    s = s.replace(/\$\\implies\$/g, '➜').replace(/\$\\rightarrow\$/g, '➜').replace(/\\rightarrow/g, '➜').replace(/\\implies/g, '➜');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return s;
  }

  checkTheoryQuiz(quizId, unitNumber) {
    const quizData = (this._theoryQuizzes || {})[quizId];
    if (!quizData) return;

    const questions = quizData.questions || [];
    if (questions.length === 0) return;

    let correctCount = 0;

    // Unit 9 Parts of Speech breakdown table (Standard & Bilingual)
    const unit9Lookup = {
      'her mother is happy': {
        tokens: ['POSS', 'N', 'BE', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'POSS - N - BE - ADJ (TTSH - N - BE - ADJ)',
        expl: '<strong>Her</strong>: Tính từ sở hữu (POSS/TTSH) | <strong>mother</strong>: Danh từ (N) | <strong>is</strong>: Động từ to be (BE) | <strong>happy</strong>: Tính từ (ADJ) đứng sau to be.'
      },
      'they have a lovely flat': {
        tokens: ['PRON', 'V', 'ART', 'ADJ', 'N'],
        targetWordPos: 'ADJ',
        ans: 'PRON - V - ART - ADJ - N (PRO - V - MT - ADJ - N)',
        expl: '<strong>They</strong>: Đại từ nhân xưng (PRON/PRO) | <strong>have</strong>: Động từ thường (V) | <strong>a</strong>: Mạo từ (ART/MT) | <strong>lovely</strong>: Tính từ (ADJ) | <strong>flat</strong>: Danh từ (N).'
      },
      'he drives carefully': {
        tokens: ['PRON', 'V', 'ADV'],
        targetWordPos: 'ADV',
        ans: 'PRON - V - ADV (PRO - V - ADV)',
        expl: '<strong>He</strong>: Đại từ nhân xưng (PRON/PRO) | <strong>drives</strong>: Động từ thường (V) | <strong>carefully</strong>: Trạng từ chỉ cách thức (ADV) bổ nghĩa cho động từ "drives".'
      },
      'the book is very great': {
        tokens: ['ART', 'N', 'BE', 'ADV', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'ART - N - BE - ADV - ADJ (MT - N - BE - ADV - ADJ)',
        expl: '<strong>The</strong>: Mạo từ (ART/MT) | <strong>book</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>very</strong>: Trạng từ chỉ mức độ (ADV) | <strong>great</strong>: Tính từ (ADJ).'
      },
      'the weather is nice': {
        tokens: ['ART', 'N', 'BE', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'ART - N - BE - ADJ (MT - N - BE - ADJ)',
        expl: '<strong>The</strong>: Mạo từ (ART/MT) | <strong>weather</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>nice</strong>: Tính từ (ADJ).'
      },
      'his room is tidy': {
        tokens: ['POSS', 'N', 'BE', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'POSS - N - BE - ADJ (TTSH - N - BE - ADJ)',
        expl: '<strong>His</strong>: Tính từ sở hữu (POSS/TTSH) | <strong>room</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>tidy</strong>: Tính từ (ADJ).'
      },
      'he sings well': {
        tokens: ['PRON', 'V', 'ADV'],
        targetWordPos: 'ADV',
        ans: 'PRON - V - ADV (PRO - V - ADV)',
        expl: '<strong>He</strong>: Đại từ nhân xưng (PRON/PRO) | <strong>sings</strong>: Động từ thường (V) | <strong>well</strong>: Trạng từ chỉ cách thức (ADV) bổ nghĩa cho "sings".'
      },
      'the homework is easy': {
        tokens: ['ART', 'N', 'BE', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'ART - N - BE - ADJ (MT - N - BE - ADJ)',
        expl: '<strong>The</strong>: Mạo từ (ART/MT) | <strong>homework</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>easy</strong>: Tính từ (ADJ).'
      },
      'her daughter is careless': {
        tokens: ['POSS', 'N', 'BE', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'POSS - N - BE - ADJ (TTSH - N - BE - ADJ)',
        expl: '<strong>Her</strong>: Tính từ sở hữu (POSS/TTSH) | <strong>daughter</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>careless</strong>: Tính từ (ADJ).'
      },
      'the boy is quite active': {
        tokens: ['ART', 'N', 'BE', 'ADV', 'ADJ'],
        targetWordPos: 'ADJ',
        ans: 'ART - N - BE - ADV - ADJ (MT - N - BE - ADV - ADJ)',
        expl: '<strong>The</strong>: Mạo từ (ART/MT) | <strong>boy</strong>: Danh từ (N) | <strong>is</strong>: To be (BE) | <strong>quite</strong>: Trạng từ chỉ mức độ (ADV) | <strong>active</strong>: Tính từ (ADJ).'
      }
    };

    const removeVietnameseAccents = (str) => {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    };

    const matchUnit9Pos = (uInput, targetObj) => {
      if (!uInput || !targetObj) return false;
      const clean = uInput.trim();
      if (!clean) return false;

      const mapToken = (raw) => {
        const t = removeVietnameseAccents(raw || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (['poss', 'ttsh', 'tinhtusohuu', 'pos'].includes(t)) return 'POSS';
        if (['pron', 'pro', 'daitu', 'daitunhanxung'].includes(t)) return 'PRON';
        if (['n', 'dt', 'danhtu', 'noun'].includes(t)) return 'N';
        if (['be', 'tobe', 'dongtutobe', 'is', 'am', 'are', 'was', 'were'].includes(t)) return 'BE';
        if (['v', 'dongtu', 'verb', 'dongtuthuong'].includes(t)) return 'V';
        if (['adj', 'tt', 'tinhtu', 'adjective', 'a'].includes(t)) return 'ADJ';
        if (['adv', 'trt', 'trangtu', 'adverb'].includes(t)) return 'ADV';
        if (['art', 'mt', 'maotu', 'article'].includes(t)) return 'ART';
        return t.toUpperCase();
      };

      // 1. Check parentheses format first: e.g. "Her (TTSH) - mother (Danh từ) - is (To be) - happy (Tính từ)"
      const parenMatches = clean.match(/\(([^)]+)\)/g);
      if (parenMatches && parenMatches.length === targetObj.tokens.length) {
        const extractedTokens = parenMatches.map(p => mapToken(p.replace(/[\(\)]/g, '')));
        if (extractedTokens.join('-') === targetObj.tokens.join('-')) return true;
      }

      // 2. Collapse multi-word terms and unaccent
      const collapsed = removeVietnameseAccents(clean)
        .toLowerCase()
        .replace(/to\s+be/gi, 'tobe')
        .replace(/tinh\s+tu\s+so\s+huu/gi, 'poss')
        .replace(/tinh\s+tu/gi, 'adj')
        .replace(/trang\s+tu/gi, 'adv')
        .replace(/danh\s+tu/gi, 'n')
        .replace(/dai\s+tu\s+nhan\s+xung/gi, 'pron')
        .replace(/dai\s+tu/gi, 'pron')
        .replace(/dong\s+tu\s+to\s+be/gi, 'tobe')
        .replace(/dong\s+tu\s+thuong/gi, 'v')
        .replace(/dong\s+tu/gi, 'v')
        .replace(/mao\s+tu/gi, 'art');

      const rawTokens = collapsed.split(/[\s\-,\/|]+/).filter(Boolean);
      const userTokens = rawTokens.map(mapToken);

      // 3. Exact token sequence match
      if (userTokens.length === targetObj.tokens.length) {
        if (userTokens.join('-') === targetObj.tokens.join('-')) return true;
      }

      // 4. Lenient single word check (only if user entered just 1 token, e.g. "Tính từ" or "Adj")
      if (userTokens.length === 1) {
        if (userTokens[0] === targetObj.targetWordPos) return true;
      }

      return false;
    };


    // Unit 31 Time notation lookup
    const unit31Lookup = {
      '5 giờ đúng': { ans: "5 o'clock (five o'clock)", expl: 'Cách nói giờ đúng: <strong>Số giờ + o\'clock</strong> $\\rightarrow$ <strong>5 o\'clock</strong>.' },
      '9 giờ tối': { ans: "9 p.m. (nine p.m. / 9:00 PM)", expl: 'Giờ tối dùng ký hiệu <strong>p.m.</strong> $\\rightarrow$ <strong>9 p.m.</strong>' },
      '11 giờ trưa': { ans: "11 a.m. (eleven a.m. / 11:00 AM)", expl: 'Giờ ban ngày trước 12h dùng <strong>a.m.</strong> $\\rightarrow$ <strong>11 a.m.</strong>' },
      '2 giờ sáng': { ans: "2 a.m. (two a.m. / 2:00 AM)", expl: 'Giờ ban đêm/sáng sớm dùng <strong>a.m.</strong> $\\rightarrow$ <strong>2 a.m.</strong>' }
    };

    // Plural Noun Lookup (Unit 2 & general)
    const pluralLookup = {
      'woman': { ans: 'women', expl: 'Danh từ biến đổi bất quy tắc số nhiều: <strong>woman $\\rightarrow$ women</strong> (những người phụ nữ).' },
      'child': { ans: 'children', expl: 'Danh từ biến đổi bất quy tắc số nhiều: <strong>child $\\rightarrow$ children</strong> (những đứa trẻ).' },
      'lawyer': { ans: 'lawyers', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>lawyers</strong> (những luật sư).' },
      'box': { ans: 'boxes', expl: 'Danh từ tận cùng bằng chữ "x": Thêm đuôi <strong>-es</strong> $\\rightarrow$ <strong>boxes</strong> (những chiếc hộp).' },
      'parent': { ans: 'parents', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>parents</strong> (bố mẹ).' },
      'man': { ans: 'men', expl: 'Danh từ biến đổi bất quy tắc: <strong>man $\\rightarrow$ men</strong> (những người đàn ông).' },
      'foot': { ans: 'feet', expl: 'Danh từ biến đổi bất quy tắc: <strong>foot $\\rightarrow$ feet</strong> (những bàn chân).' },
      'tooth': { ans: 'teeth', expl: 'Danh từ biến đổi bất quy tắc: <strong>tooth $\\rightarrow$ teeth</strong> (những chiếc răng).' },
      'baby': { ans: 'babies', expl: 'Danh từ tận cùng phụ âm + y: Đổi "y" thành "i" rồi thêm "es" $\\rightarrow$ <strong>babies</strong> (những đứa bé).' },
      'city': { ans: 'cities', expl: 'Danh từ tận cùng phụ âm + y: Đổi "y" thành "i" rồi thêm "es" $\\rightarrow$ <strong>cities</strong> (những thành phố).' },
      'watch': { ans: 'watches', expl: 'Danh từ tận cùng bằng "ch": Thêm đuôi <strong>-es</strong> $\\rightarrow$ <strong>watches</strong> (những chiếc đồng hồ).' },
      'dish': { ans: 'dishes', expl: 'Danh từ tận cùng bằng "sh": Thêm đuôi <strong>-es</strong> $\\rightarrow$ <strong>dishes</strong> (những chiếc đĩa).' },
      'bus': { ans: 'buses', expl: 'Danh từ tận cùng bằng "s": Thêm đuôi <strong>-es</strong> $\\rightarrow$ <strong>buses</strong> (những chiếc xe buýt).' },
      'dog': { ans: 'dogs', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>dogs</strong>.' },
      'cat': { ans: 'cats', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>cats</strong>.' },
      'book': { ans: 'books', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>books</strong>.' },
      'car': { ans: 'cars', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>cars</strong>.' },
      'picture': { ans: 'pictures', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>pictures</strong>.' },
      'doctor': { ans: 'doctors', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>doctors</strong>.' },
      'friend': { ans: 'friends', expl: 'Danh từ đếm được thông thường: Thêm đuôi <strong>-s</strong> $\\rightarrow$ <strong>friends</strong>.' }
    };

    // Possessive & Translation Lookup (Unit 1 & general)
    const translationLookup = {
      'giáo viên của anh ấy': { ans: 'his teacher', expl: "Dùng tính từ sở hữu 'his' (của anh ấy) + danh từ 'teacher': <strong>his teacher</strong>." },
      'mẹ của họ': { ans: 'their mother', expl: "Dùng tính từ sở hữu 'their' (của họ) + danh từ 'mother': <strong>their mother</strong>." },
      'xe ô tô của cô ấy': { ans: 'her car', expl: "Dùng tính từ sở hữu 'her' (của cô ấy) + danh từ 'car': <strong>her car</strong>." },
      'cuốn sách của chúng tôi': { ans: 'our book', expl: "Dùng tính từ sở hữu 'our' (của chúng tôi) + danh từ 'book': <strong>our book</strong>." },
      'chị gái của tôi': { ans: 'my sister', expl: "Dùng tính từ sở hữu 'my' (của tôi) + danh từ 'sister': <strong>my sister</strong>." },
      'bố của anh ấy': { ans: 'his father', expl: "Dùng tính từ sở hữu 'his' (của anh ấy) + danh từ 'father': <strong>his father</strong>." },
      'bạn của tôi': { ans: 'my friend', expl: "Dùng tính từ sở hữu 'my' (của tôi) + danh từ 'friend': <strong>my friend</strong>." },
      'nhà của họ': { ans: 'their house', expl: "Dùng tính từ sở hữu 'their' (của họ) + danh từ 'house': <strong>their house</strong>." },
      'con chó của cô ấy': { ans: 'her dog', expl: "Dùng tính từ sở hữu 'her' (của cô ấy) + danh từ 'dog': <strong>her dog</strong>." },
      'trường học của chúng tôi': { ans: 'our school', expl: "Dùng tính từ sở hữu 'our' (của chúng tôi) + danh từ 'school': <strong>our school</strong>." }
    };

    questions.forEach((q, idx) => {
      const card = document.getElementById(`tq-card-${quizId}-${idx}`);
      const badge = document.getElementById(`tq-badge-${quizId}-${idx}`);
      const explBox = document.getElementById(`tq-expl-${quizId}-${idx}`);
      const userAns = (this._theoryAnswers || {})[`${quizId}_${idx}`] || '';

      if (q.type === 'CIRCLE') {
        const nounClean = (q.noun || '').toLowerCase().trim();
        let targetChoice = 'a';
        let expl = '';

        if (nounClean.startsWith('orange') || nounClean.startsWith('apple') || nounClean.startsWith('umbrella') || nounClean.startsWith('egg') || nounClean.startsWith('island') || nounClean.startsWith('hour')) {
          targetChoice = 'an';
          expl = `Danh từ <strong>"${q.noun}"</strong> bắt đầu bằng một <strong>nguyên âm</strong>, do đó phải dùng mạo từ <strong>"an"</strong>.`;
        } else {
          targetChoice = 'a';
          expl = `Danh từ <strong>"${q.noun}"</strong> bắt đầu bằng một <strong>phụ âm</strong>, do đó dùng mạo từ <strong>"a"</strong>.`;
        }

        const isCorrect = (userAns || '').toLowerCase().trim() === targetChoice;
        if (isCorrect) correctCount++;

        const btn1 = document.getElementById(`tq-btn-${quizId}-${idx}-${q.choice1}`);
        const btn2 = document.getElementById(`tq-btn-${quizId}-${idx}-${q.choice2}`);

        if (btn1) {
          btn1.classList.remove('is-correct-circle', 'is-wrong-circle');
          if (q.choice1.toLowerCase() === targetChoice) btn1.classList.add('is-correct-circle');
          else if (btn1.classList.contains('selected') && !isCorrect) btn1.classList.add('is-wrong-circle');
        }
        if (btn2) {
          btn2.classList.remove('is-correct-circle', 'is-wrong-circle');
          if (q.choice2.toLowerCase() === targetChoice) btn2.classList.add('is-correct-circle');
          else if (btn2.classList.contains('selected') && !isCorrect) btn2.classList.add('is-wrong-circle');
        }

        if (badge) {
          badge.innerHTML = isCorrect ? '<span class="tq-badge-correct">✓ Đúng</span>' : '<span class="tq-badge-wrong">✗ Chưa chính xác</span>';
        }
        if (explBox) {
          explBox.style.display = 'block';
          explBox.innerHTML = `<strong>💡 Lời giải chi tiết:</strong> ${expl}`;
        }
      } else if (q.type === 'CHOICE') {
        const itemKey = `${quizId}_${idx}`;
        let correctKey = 'A';
        let explText = '';

        const theoryDB = window.SMOB_THEORY_QUIZZES;
        const stemNorm = (q.stem || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        let groundTruth = theoryDB ? (theoryDB[itemKey] || null) : null;

        // Smart Content Guard: verify stem match
        if (groundTruth) {
          const dbStemNorm = (groundTruth.stem || groundTruth.targetWord || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const isStemOk = (stemNorm === dbStemNorm) || (stemNorm.length > 6 && dbStemNorm.length > 6 && (stemNorm.includes(dbStemNorm) || dbStemNorm.includes(stemNorm)));
          if (!isStemOk) groundTruth = null;
        }

        // Fallback search by content within the unit
        if (!groundTruth && theoryDB) {
          for (const k in theoryDB) {
            const it = theoryDB[k];
            if (it.unit === unitNumber) {
              const itNorm = (it.stem || it.targetWord || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              if (itNorm === stemNorm || (stemNorm.length > 6 && itNorm.length > 6 && (stemNorm.includes(itNorm) || itNorm.includes(stemNorm)))) {
                groundTruth = it;
                break;
              }
            }
          }
        }

        if (groundTruth && groundTruth.correct_key) {
          correctKey = groundTruth.correct_key;
          explText = groundTruth.explanation;
        } else {
          const solved = this.solveTheoryQuizAnswer(q.stem, q.options, unitNumber);
          correctKey = solved.key;
          explText = solved.expl;
        }

        const isCorrect = userAns.toUpperCase() === correctKey.toUpperCase();
        if (isCorrect) correctCount++;

        q.options.forEach(opt => {
          const lbl = document.getElementById(`tq-lbl-${quizId}-${idx}-${opt.key}`);
          if (lbl) {
            lbl.classList.remove('is-correct-opt', 'is-wrong-opt');
            if (opt.key === correctKey) lbl.classList.add('is-correct-opt');
            else if (lbl.classList.contains('selected') && !isCorrect) lbl.classList.add('is-wrong-opt');
          }
        });

        if (badge) {
          badge.innerHTML = isCorrect ? '<span class="tq-badge-correct">✓ Đúng</span>' : '<span class="tq-badge-wrong">✗ Chưa chính xác</span>';
        }
        if (explBox) {
          explBox.style.display = 'block';
          explBox.innerHTML = `<strong>💡 Lời giải chi tiết (Đáp án đúng: ${correctKey}):</strong><br>${this.formatTheoryExplanation(explText)}`;
        }
      } else if (q.type === 'TEXTAREA') {
        if (userAns.trim().length > 0) correctCount++;
        if (badge) {
          badge.innerHTML = userAns.trim().length > 0 ? '<span class="tq-badge-correct">✓ Đã ghi nhận ghi chép</span>' : '<span class="tq-badge-wrong">Chưa có ghi chép</span>';
        }
        if (explBox) {
          explBox.style.display = 'block';
          explBox.innerHTML = `<strong>💡 Gợi ý:</strong> Bạn có thể nghe lại audio để bổ sung các ý chính còn thiếu hoặc đối chiếu với phần Audio Script của bài học.`;
        }
      } else {
        // Translation or Fill-in-the-blank or Unit 9 / Unit 31 Input / Grammatical transformations
        const itemKey = `${quizId}_${idx}`;
        const theoryDB = window.SMOB_THEORY_QUIZZES;
        const stemNorm = (q.stem || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        let groundTruth = theoryDB ? (theoryDB[itemKey] || null) : null;

        // Smart Content Guard for INPUT: verify stem match
        if (groundTruth) {
          const dbStemNorm = (groundTruth.stem || groundTruth.targetWord || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const isStemOk = (stemNorm === dbStemNorm) || (stemNorm.length > 6 && dbStemNorm.length > 6 && (stemNorm.includes(dbStemNorm) || dbStemNorm.includes(stemNorm)));
          if (!isStemOk) groundTruth = null;
        }

        // Fallback search by content within the unit for INPUT
        if (!groundTruth && theoryDB) {
          for (const k in theoryDB) {
            const it = theoryDB[k];
            if (it.unit === unitNumber) {
              const itNorm = (it.stem || it.targetWord || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              if (itNorm === stemNorm || (stemNorm.length > 6 && itNorm.length > 6 && (stemNorm.includes(itNorm) || itNorm.includes(stemNorm)))) {
                groundTruth = it;
                break;
              }
            }
          }
        }

        const stemClean = (q.stem || '').replace(/^\d+\.\s*/, '').replace(/\.$/, '').trim().toLowerCase();
        let expectedAns = '';
        let explText = '';
        let isMatch = false;
        const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ' ');

        if (unit9Lookup[stemClean]) {
          const u9Item = unit9Lookup[stemClean];
          expectedAns = u9Item.ans;
          explText = u9Item.expl;
          isMatch = matchUnit9Pos(userAns, u9Item);
        } else if (groundTruth && groundTruth.correct_text) {
          expectedAns = groundTruth.correct_text;
          explText = groundTruth.explanation;
          const uNorm = normalize(userAns);
          const expNorm = normalize(expectedAns);
          const variants = (groundTruth.acceptable_variants || []).map(normalize);
          isMatch = (uNorm.length > 0) && ((uNorm === expNorm) || variants.includes(uNorm));
        } else if (unit31Lookup[stemClean]) {
          expectedAns = unit31Lookup[stemClean].ans;
          explText = unit31Lookup[stemClean].expl;
          const normU = (userAns || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          isMatch = normU.length > 0 && (normU.includes('5') || normU.includes('five') || normU.includes('9') || normU.includes('nine') || normU.includes('11') || normU.includes('eleven') || normU.includes('2') || normU.includes('two'));
        } else if (pluralLookup[stemClean]) {
          expectedAns = pluralLookup[stemClean].ans;
          explText = pluralLookup[stemClean].expl;
          isMatch = normalize(userAns) === normalize(expectedAns);
        } else if (translationLookup[stemClean]) {
          expectedAns = translationLookup[stemClean].ans;
          explText = translationLookup[stemClean].expl;
          isMatch = normalize(userAns) === normalize(expectedAns);
        } else {
          if (stemClean.includes('của anh ấy')) {
            const noun = stemClean.replace(/.*của anh ấy/, '').trim();
            expectedAns = `his ${noun}`;
          } else if (stemClean.includes('của cô ấy')) {
            const noun = stemClean.replace(/.*của cô ấy/, '').trim();
            expectedAns = `her ${noun}`;
          } else if (stemClean.includes('của họ')) {
            const noun = stemClean.replace(/.*của họ/, '').trim();
            expectedAns = `their ${noun}`;
          } else if (stemClean.includes('của chúng tôi')) {
            const noun = stemClean.replace(/.*của chúng tôi/, '').trim();
            expectedAns = `our ${noun}`;
          } else if (stemClean.includes('của tôi')) {
            const noun = stemClean.replace(/.*của tôi/, '').trim();
            expectedAns = `my ${noun}`;
          } else {
            expectedAns = stemClean;
          }
          explText = `Đáp án chuẩn xác: <strong>${expectedAns}</strong>.`;
          isMatch = normalize(userAns) === normalize(expectedAns);
        }

        if (isMatch) correctCount++;

        const inputEl = document.getElementById(`tq-input-${quizId}-${idx}`);
        if (inputEl) {
          inputEl.classList.remove('is-correct-inp', 'is-wrong-inp');
          inputEl.classList.add(isMatch ? 'is-correct-inp' : 'is-wrong-inp');
        }

        if (badge) {
          badge.innerHTML = isMatch ? '<span class="tq-badge-correct">✓ Đã kiểm tra</span>' : `<span class="tq-badge-wrong">✗ Tham khảo đáp án: <strong>${expectedAns}</strong></span>`;
        }
        if (explBox) {
          explBox.style.display = 'block';
          explBox.innerHTML = `<strong>💡 Lời giải & Phân tích chi tiết:</strong><br>${this.formatTheoryExplanation(explText)}`;
        }
      }
    });

    const scoreBadge = document.getElementById(`tq-score-badge-${quizId}`);
    if (scoreBadge) {
      scoreBadge.style.display = 'inline-flex';
      const pct = Math.round((correctCount / questions.length) * 100);
      scoreBadge.className = `pdf-quiz-score-pill ${pct >= 80 ? 'score-high' : pct >= 50 ? 'score-mid' : 'score-low'}`;
      scoreBadge.innerHTML = `🏆 Kết Quả: Hoàn thành <strong>${correctCount}/${questions.length}</strong> câu (${pct}%)`;
    }
  }

  resetTheoryQuiz(quizId) {
    const quizBlock = document.getElementById(quizId) || document.querySelector(`[data-quiz-id="${quizId}"]`);
    const container = quizBlock || document;

    container.querySelectorAll(`[id^="tq-card-${quizId}-"]`).forEach(c => {
      c.classList.remove('is-correct', 'is-wrong');
    });
    container.querySelectorAll(`[id^="tq-btn-${quizId}-"]`).forEach(b => {
      b.classList.remove('selected', 'is-correct-circle', 'is-wrong-circle');
    });
    container.querySelectorAll(`[id^="tq-lbl-${quizId}-"]`).forEach(lbl => {
      lbl.classList.remove('selected', 'is-correct-opt', 'is-wrong-opt');
      const r = lbl.querySelector('input[type="radio"]');
      if (r) r.checked = false;
    });
    container.querySelectorAll(`[id^="tq-badge-${quizId}-"]`).forEach(b => {
      b.innerHTML = '';
    });
    container.querySelectorAll(`[id^="tq-expl-${quizId}-"]`).forEach(b => {
      b.style.display = 'none';
      b.innerHTML = '';
    });
    container.querySelectorAll(`[id^="tq-input-${quizId}-"]`).forEach(inp => {
      inp.value = '';
      inp.classList.remove('is-correct-inp', 'is-wrong-inp');
    });

    const badge = document.getElementById(`tq-score-badge-${quizId}`);
    if (badge) badge.style.display = 'none';

    Object.keys(this._theoryAnswers || {}).forEach(k => {
      if (k.startsWith(quizId)) delete this._theoryAnswers[k];
    });
  }

          getGrammarTopics() {
    return [
      { id: 'tobe', name: 'Động Từ "To Be" & Mạo Từ A/An/The', units: [1, 2, 3, 4], icon: '🟢', desc: 'Quy tắc chia thì, khẳng định, phủ định, nghi vấn và cách dùng a/an/the' },
      { id: 'pres_simple', name: 'Thì Hiện Tại Đơn (Present Simple)', units: [5, 6, 7, 8], icon: '📘', desc: 'Quy tắc thêm s/es, trợ động từ do/does, dấu hiệu nhận biết' },
      { id: 'parts_speech', name: 'Từ Loại (Danh Từ, Động Từ, Tính Từ, Trạng Từ)', units: [9], icon: '🔤', desc: 'Vị trí và chức năng ngữ pháp của các từ loại trong câu' },
      { id: 'pres_cont', name: 'Hiện Tại Tiếp Diễn & Phân Biệt HTĐ - HTTD', units: [10, 11], icon: '⏳', desc: 'Hành động đang diễn ra, quy tắc thêm -ing, trạng từ chỉ tần suất' },
      { id: 'past', name: 'Quá Khứ Đơn & Quá Khứ Tiếp Diễn', units: [12, 13, 14], icon: '⏮️', desc: 'Động từ có quy tắc -ed, bất quy tắc, was/were, cấu trúc when/while' },
      { id: 'perfect_future', name: 'Thì Hiện Tại Hoàn Thành & Tương Lai', units: [15, 16, 17], icon: '🚀', desc: 'Have/has + V3/ed, since/for, will/shall, will have + V3' },
      { id: 'modals', name: 'Động Từ Khuyết Thiếu (Modal Verbs)', units: [22], icon: '⭐', desc: 'Can, could, may, might, must, have to, should, ought to' },
      { id: 'conjunctions', name: 'Liên Từ & Cấu Trúc Nối Câu', units: [23, 24, 25, 38], icon: '🔗', desc: 'And, but, so, because, although, while, either...or, neither...nor' },
      { id: 'conditionals', name: 'Câu Điều Kiện (Conditionals Loại 1, 2, 3)', units: [26, 27, 28], icon: '⚡', desc: 'If type 1 (tương lai), If type 2 (hiện tại), If type 3 (quá khứ)' },
      { id: 'pronouns_harmony', name: 'Đại Từ Phản Thân & Sự Hòa Hợp Về Thì', units: [35, 36], icon: '👥', desc: 'Myself, yourself, itself, quy tắc phối hợp thì giữa mệnh đề chính và phụ' }
    ];
  }

  openGrammarTopicsModal() {
    const modal = document.getElementById('grammar-topics-modal');
    const listContainer = document.getElementById('grammar-topics-list');
    if (!modal || !listContainer) return;

    listContainer.innerHTML = '';
    const topics = this.getGrammarTopics();

    topics.forEach((t, idx) => {
      let qCount = 0;
      t.units.forEach(uid => {
        const u = window.dataStore.getUnit(uid);
        if (u && u.unit_test) qCount += u.unit_test.length;
      });

      const item = document.createElement('div');
      item.className = 'grammar-topic-item';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="font-size: 26px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; background: #f0f4f8; border-radius: 10px;">${t.icon}</div>
          <div>
            <div style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${idx + 1}. ${t.name}</div>
            <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">${t.desc}</div>
            <div style="font-size: 11.5px; color: var(--accent); font-weight: 600; margin-top: 3px;">Bao gồm: Unit ${t.units.join(', ')} • ${qCount} bài tập thực hành</div>
          </div>
        </div>
        <button class="apple-btn btn-primary" style="padding: 7px 16px; font-size: 13px; font-weight: 700; flex-shrink: 0;">Luyện Tập ➔</button>
      `;
      item.onclick = () => {
        this.startGrammarTopicPractice(t.id);
      };
      listContainer.appendChild(item);
    });

    modal.style.display = 'flex';
  }

  closeGrammarTopicsModal() {
    const modal = document.getElementById('grammar-topics-modal');
    if (modal) modal.style.display = 'none';
  }

  setGrammarTopicFormat(fmt, btn) {
    this.grammarTopicFormat = fmt;
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  startGrammarTopicPractice(topicId) {
    this.closeGrammarTopicsModal();
    const topics = this.getGrammarTopics();
    const topic = topics.find(t => t.id === topicId) || topics[0];

    // Collect all real grammar exercise questions from unit tests
    let questionsPool = [];
    topic.units.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (u && u.unit_test) {
        u.unit_test.forEach(q => {
          questionsPool.push({
            id: q.id || `gt_${Math.random()}`,
            unitId: uid,
            stem: q.stem || q.question || 'Chọn đáp án đúng hoàn thành câu:',
            options: q.options && q.options.length >= 2 ? q.options : ['A. Đúng', 'B. Sai', 'C. Không xác định', 'D. Khác'],
            correct_answer: q.correct_answer || q.answer || (q.options ? q.options[0] : 'A'),
            explanation: q.explanation || `Giải thích ngữ pháp Unit ${uid}: Áp dụng công thức và quy tắc chuẩn trong bài học.`,
            type: q.type || 'MC',
            source_file: u.source_trace?.theory_file || `Unit ${uid}`
          });
        });
      }
    });

    if (questionsPool.length === 0) {
      alert('Chưa có câu hỏi thực hành cho chủ đề này.');
      return;
    }

    // Filter by format if requested
    if (this.grammarTopicFormat === 'blank') {
      const blankOnly = questionsPool.filter(q => q.type === 'WRITTEN' || q.stem.includes('___') || q.stem.includes('....'));
      if (blankOnly.length >= 5) questionsPool = blankOnly;
    }

    questionsPool.sort(() => Math.random() - 0.5);
    const selectedQuestions = questionsPool.slice(0, 20);

    this.navigate('tests');
    this.launchExamSession(selectedQuestions, `Luyện Tập Ngữ Pháp: ${topic.name}`);
  }

  // ==========================================
  // IRREGULAR VERBS (398+ VERBS & TEST ARENA - 3 MULTI-DIRECTIONAL FORMATS)
  // ==========================================
  classifyIrregularVerb(v) {
    if (!v) return { isDualEd: false, isAllSame: false, isV2V3Same: false, isV1V3Same: false, isAllDiff: false, isIAU: false, hasDual: false };
    const v1 = (v.v1 || '').trim().toLowerCase();
    const v2 = (v.v2 || '').trim().toLowerCase();
    const v3 = (v.v3 || '').trim().toLowerCase();
    const v2First = v2.split('/')[0].trim();
    const v3First = v3.split('/')[0].trim();

    // 1. Dual form with -ed (e.g. interwove / interweaved, learnt / learned, burnt / burned)
    const hasSlash = v2.includes('/') || v3.includes('/');
    const hasEd = v2.includes('ed') || v3.includes('ed');
    const isDualEd = hasSlash && hasEd;

    // 2. All 3 columns identical (V1 = V2 = V3, e.g. cut-cut-cut, cost-cost-cost, put-put-put)
    const isAllSame = (v1 === v2First && v1 === v3First);

    // 3. V2 == V3 (and != V1, e.g. buy-bought-bought, send-sent-sent, feel-felt-felt)
    const isV2V3Same = (!isAllSame && v2First === v3First);

    // 4. V1 == V3 (and != V2, e.g. come-came-come, become-became-become, run-ran-run)
    const isV1V3Same = (!isAllSame && v1 === v3First);

    // 5. All 3 columns distinct (V1 != V2 != V3, e.g. go-went-gone, see-saw-seen, take-took-taken)
    const isAllDiff = (v1 !== v2First && v1 !== v3First && v2First !== v3First);

    // 6. i -> a -> u pattern (e.g. begin-began-begun, sing-sang-sung, drink-drank-drunk)
    const isIAU = (v1.includes('i') && v2First.includes('a') && v3First.includes('u'));

    return {
      isDualEd,
      isAllSame,
      isV2V3Same,
      isV1V3Same,
      isAllDiff,
      isIAU,
      hasDual: hasSlash
    };
  }

  formatIrregularVerbCell(val, ipa, isV3 = false) {
    if (!val) return '';
    if (val.includes('/')) {
      const parts = val.split('/').map(s => s.trim());
      const primary = parts[0];
      const secondary = parts.slice(1).join(' / ');
      const hasEd = secondary.toLowerCase().includes('ed');
      return `
        <div style="font-weight: 600; font-size: 15px; color: ${isV3 ? '#1a7f37' : 'inherit'};">
          <div>${primary}</div>
          <div class="irv-sub-form" title="Dạng chia song hành (${hasEd ? 'Có quy tắc thêm -ed (UK / US)' : 'Dạng phụ / UK-US'})">
            ( ${secondary} )
          </div>
        </div>
        <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 2px;">${ipa || ''}</div>
      `;
    }
    return `
      <div style="font-weight: 600; font-size: 15px; color: ${isV3 ? '#1a7f37' : 'inherit'};">${val}</div>
      <div style="font-size: 12px; color: var(--text-tertiary);">${ipa || ''}</div>
    `;
  }

  isUnit15TopVerb(v1) {
    if (!v1) return false;
    if (this._top40Set === undefined) {
      this._top40Set = new Set([
        'be', 'begin', 'break', 'bring', 'buy', 'choose', 'come', 'cost', 'cut', 'do',
        'draw', 'drive', 'eat', 'feel', 'find', 'get', 'give', 'go', 'have', 'hear',
        'hold', 'keep', 'know', 'leave', 'make', 'meet', 'pay', 'run', 'say', 'sell',
        'send', 'see', 'sit', 'sleep', 'speak', 'spend', 'stand', 'take', 'teach', 'tell',
        'think', 'understand', 'wear', 'win', 'write'
      ]);
    }
    return this._top40Set.has(v1.toLowerCase().trim());
  }

  formatIrregularV1Cell(v, classification) {
    const isTop40 = this.isUnit15TopVerb(v.v1) || !!v.is_top40;
    const top40Badge = isTop40 ? `<span class="irv-top40-tag" title="⭐ Động từ bất quy tắc cốt lõi hay dùng nhất (Giáo trình Unit 15 - Thì HTHT)">⭐ Unit 15</span>` : '';
    let badgeHtml = '';
    if (classification.isDualEd) {
      badgeHtml = `<div class="irv-dual-tag" title="Từ có 2 cách chia song hành: dạng bất quy tắc và dạng thêm đuôi -ed (UK / US)">⚡ 2 cách chia (-ed)</div>`;
    } else if (classification.isAllSame) {
      badgeHtml = `<div class="irv-all-same-tag" title="3 dạng từ viết giống hệt nhau (V1 = V2 = V3)">🎯 V1=V2=V3</div>`;
    } else if (classification.isV1V3Same) {
      badgeHtml = `<div class="irv-v1v3-tag" title="Dạng nguyên thể và phân từ giống nhau (V1 = V3)">🔁 V1=V3</div>`;
    } else if (classification.isIAU) {
      badgeHtml = `<div class="irv-iau-tag" title="Quy luật biến đổi vần âm: i ➔ a ➔ u">🎵 i ➔ a ➔ u</div>`;
    }
    return `
      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
        <span style="font-weight: 700; color: var(--accent); font-size: 15px;">${v.v1}</span>
        ${top40Badge}
      </div>
      <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 1px;">${v.v1_ipa || ''}</div>
      ${badgeHtml}
    `;
  }

  renderIrregularVerbs() {
    const tbody = document.getElementById('irv-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const verbs = window.dataStore.irregularVerbs || [];
    const badge = document.getElementById('irv-total-badge');
    if (badge) badge.innerText = `${verbs.length} Động Từ Chuẩn Có IPA`;

    const starredCount = window.dataStore.getStarredIrregularCount();
    const starCountEl = document.getElementById('irv-starred-count');
    if (starCountEl) starCountEl.innerText = starredCount;
    const scopeStarCountEl = document.getElementById('irv-scope-starred-count');
    if (scopeStarCountEl) scopeStarCountEl.innerText = starredCount;

    verbs.forEach((v, idx) => {
      const classification = this.classifyIrregularVerb(v);
      const isStarred = window.dataStore.isIrregularStarred(v.v1);
      const noteText = window.dataStore.getIrregularNote(v.v1);
      const hasNote = !!noteText;

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-subtle)';
      const isTop40 = this.isUnit15TopVerb(v.v1) || !!v.is_top40;
      tr.setAttribute('data-cat-starred', isStarred ? 'true' : 'false');
      tr.setAttribute('data-cat-top40', isTop40 ? 'true' : 'false');
      tr.setAttribute('data-cat-dualed', classification.isDualEd ? 'true' : 'false');
      tr.setAttribute('data-cat-allsame', classification.isAllSame ? 'true' : 'false');
      tr.setAttribute('data-cat-v2v3same', classification.isV2V3Same ? 'true' : 'false');
      tr.setAttribute('data-cat-v1v3same', classification.isV1V3Same ? 'true' : 'false');
      tr.setAttribute('data-cat-alldiff', classification.isAllDiff ? 'true' : 'false');
      tr.setAttribute('data-cat-iau', classification.isIAU ? 'true' : 'false');

      tr.innerHTML = `
        <td style="padding: 12px 10px; text-align: center; font-weight: 700; color: var(--text-secondary); font-size: 13px;" class="irv-stt-cell" data-orig-stt="${v.stt || (idx + 1)}">${v.stt || (idx + 1)}</td>
        <td style="padding: 12px 6px; text-align: center;">
          <button class="irv-star-btn ${isStarred ? 'starred' : ''}" onclick="window.smobApp.toggleStarIrregularVerb('${v.v1}', this)" title="${isStarred ? 'Bỏ đánh dấu cần ôn' : 'Đánh dấu từ khó / cần ôn'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isStarred ? '#ef4444' : 'none'}" stroke="${isStarred ? '#ef4444' : 'currentColor'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </td>
        <td style="padding: 12px 18px;">
          ${this.formatIrregularV1Cell(v, classification)}
        </td>
        <td style="padding: 12px 18px;">
          ${this.formatIrregularVerbCell(v.v2, v.v2_ipa, false)}
        </td>
        <td style="padding: 12px 18px;">
          ${this.formatIrregularVerbCell(v.v3, v.v3_ipa, true)}
        </td>
        <td style="padding: 12px 18px; font-weight: 500;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span>${v.meaning}</span>
            <button class="irv-note-btn ${hasNote ? 'has-note' : ''}" onclick="window.smobApp.openIrregularNoteModal('${v.v1}')" title="${hasNote ? 'Sửa ghi chú' : 'Thêm ghi chú cá nhân'}">📝</button>
          </div>
          ${hasNote ? `<div class="irv-note-badge" title="${noteText}">💡 <em>${noteText}</em></div>` : ''}
        </td>
        <td style="padding: 12px 18px; font-size: 12.5px; color: var(--text-secondary); max-width: 280px;">"${v.example || ''}"</td>
        <td style="padding: 12px 18px; text-align: center;">
          <button class="speaker-btn" onclick="window.speakWord('${v.v1}')" title="Phát âm ${v.v1}">🔊</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.applyIrregularVerbsFilter();
  }

  toggleStarIrregularVerb(v1, btn) {
    const isStarred = window.dataStore.toggleStarredIrregular(v1);
    if (btn) {
      btn.classList.toggle('starred', isStarred);
      btn.title = isStarred ? 'Bỏ đánh dấu cần ôn' : 'Đánh dấu từ khó / cần ôn';
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isStarred ? '#ef4444' : 'none');
        svg.setAttribute('stroke', isStarred ? '#ef4444' : 'currentColor');
      }
    }
    const row = btn ? btn.closest('tr') : null;
    if (row) {
      row.setAttribute('data-cat-starred', isStarred ? 'true' : 'false');
    }
    const count = window.dataStore.getStarredIrregularCount();
    const starCountEl = document.getElementById('irv-starred-count');
    if (starCountEl) starCountEl.innerText = count;
    const scopeStarCountEl = document.getElementById('irv-scope-starred-count');
    if (scopeStarCountEl) scopeStarCountEl.innerText = count;

    if (this._irvCurrentCategory === 'starred') {
      this.applyIrregularVerbsFilter();
    }
    this.showToast(isStarred ? `🔖 Đã đánh dấu "${v1}" vào danh sách cần ôn!` : `Đã bỏ đánh dấu "${v1}".`);
  }

  filterIrregularCategory(category, btn) {
    this._irvCurrentCategory = category || 'all';
    const parent = document.getElementById('irv-cat-selector');
    if (parent) {
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
    this.applyIrregularVerbsFilter();
  }

  filterIrregularVerbs(keyword) {
    this._irvCurrentSearch = keyword || '';
    this.applyIrregularVerbsFilter();
  }

  applyIrregularVerbsFilter() {
    const q = (this._irvCurrentSearch || '').toLowerCase().trim();
    const cat = this._irvCurrentCategory || 'all';
    const rows = document.querySelectorAll('#irv-tbody tr');
    let visibleCount = 0;

    const oldEmpty = document.getElementById('irv-empty-starred-row');
    if (oldEmpty) oldEmpty.remove();

    rows.forEach(r => {
      const matchSearch = !q || r.innerText.toLowerCase().includes(q);
      let matchCat = true;
      if (cat === 'starred') {
        matchCat = r.getAttribute('data-cat-starred') === 'true';
      } else if (cat === 'top40') {
        matchCat = r.getAttribute('data-cat-top40') === 'true';
      } else if (cat === 'dual_ed') {
        matchCat = r.getAttribute('data-cat-dualed') === 'true';
      } else if (cat === 'all_same') {
        matchCat = r.getAttribute('data-cat-allsame') === 'true';
      } else if (cat === 'v2_v3_same') {
        matchCat = r.getAttribute('data-cat-v2v3same') === 'true';
      } else if (cat === 'v1_v3_same') {
        matchCat = r.getAttribute('data-cat-v1v3same') === 'true';
      } else if (cat === 'all_diff') {
        matchCat = r.getAttribute('data-cat-alldiff') === 'true';
      } else if (cat === 'i_a_u') {
        matchCat = r.getAttribute('data-cat-iau') === 'true';
      }

      if (matchSearch && matchCat) {
        r.style.display = '';
        visibleCount++;
        // Re-index STT dynamically from 1 for the filtered list
        const sttCell = r.querySelector('.irv-stt-cell');
        if (sttCell) {
          sttCell.innerText = visibleCount;
          const orig = sttCell.getAttribute('data-orig-stt') || visibleCount;
          if (cat !== 'all' || q) {
            sttCell.title = `STT trong danh sách lọc: #${visibleCount} (Vị trí gốc trong từ điển: #${orig})`;
          } else {
            sttCell.title = `STT: #${visibleCount}`;
          }
        }
      } else {
        r.style.display = 'none';
      }
    });

    const tbody = document.getElementById('irv-tbody');
    if (visibleCount === 0 && cat === 'starred' && tbody) {
      const trEmpty = document.createElement('tr');
      trEmpty.id = 'irv-empty-starred-row';
      trEmpty.innerHTML = `
        <td colspan="8" style="text-align: center; padding: 44px 20px; color: var(--text-secondary);">
          <div style="font-size: 38px; margin-bottom: 10px;">🔖</div>
          <div style="font-size: 16px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
            Chưa có động từ nào được đánh dấu
          </div>
          <div style="font-size: 13.5px; max-width: 480px; margin: 0 auto; line-height: 1.5;">
            Khi tra cứu, hãy bấm vào biểu tượng đánh dấu <strong>🔖</strong> ở cột thứ 2 cạnh các từ bạn thấy khó nhớ hoặc cần ôn tập lại. Hệ thống sẽ gom toàn bộ vào tab này để bạn ôn luyện riêng!
          </div>
        </td>
      `;
      tbody.appendChild(trEmpty);
    }

    const badge = document.getElementById('irv-total-badge');
    if (badge) {
      const total = (window.dataStore.irregularVerbs || []).length;
      if (cat === 'all' && !q) {
        badge.innerText = `${total} Động Từ Chuẩn Có IPA`;
      } else {
        const catLabels = {
          'starred': '🔖 Đã đánh dấu / Cần ôn',
          'dual_ed': '⚡ Có 2 cách chia -ed',
          'all_same': '3 cột giống hệt (V1=V2=V3)',
          'v2_v3_same': 'Cột V2 giống V3',
          'v1_v3_same': 'Cột V1 giống V3 (V1=V3)',
          'all_diff': '3 cột khác biệt (V1≠V2≠V3)',
          'i_a_u': 'Quy luật i ➔ a ➔ u'
        };
        const extraLabel = catLabels[cat] ? ` (${catLabels[cat]})` : '';
        badge.innerText = `Hiển thị ${visibleCount} / ${total} từ${extraLabel}`;
      }
    }
  }

  pickRandomIrregularVerb() {
    const verbs = window.dataStore.irregularVerbs;
    if (!verbs || verbs.length === 0) return;

    // Pick within current category if filtered
    const cat = this._irvCurrentCategory || 'all';
    let pool = verbs;
    if (cat !== 'all') {
      pool = verbs.filter(v => {
        const c = this.classifyIrregularVerb(v);
        if (cat === 'starred') return window.dataStore.isIrregularStarred(v.v1);
        if (cat === 'dual_ed') return c.isDualEd;
        if (cat === 'all_same') return c.isAllSame;
        if (cat === 'v2_v3_same') return c.isV2V3Same;
        if (cat === 'v1_v3_same') return c.isV1V3Same;
        if (cat === 'all_diff') return c.isAllDiff;
        if (cat === 'i_a_u') return c.isIAU;
        return true;
      });
      if (pool.length === 0) pool = verbs;
    }

    const randV = pool[Math.floor(Math.random() * pool.length)];
    const searchInput = document.getElementById('irv-search');
    if (searchInput) searchInput.value = randV.v1;
    this.filterIrregularVerbs(randV.v1);
    this.showToast(`🎲 Động từ ngẫu nhiên: ${randV.v1} ➔ ${randV.v2} ➔ ${randV.v3} (${randV.meaning})`);
  }

  speakText(text) {
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch(e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  switchIrregularSubView(subview, btn = null) {
    const tableContainer = document.getElementById('irv-table-container');
    const practiceContainer = document.getElementById('irv-practice-container');
    const btnTable = document.getElementById('btn-irv-tab-table');
    const btnPractice = document.getElementById('btn-irv-tab-practice');

    const starredCount = window.dataStore.getStarredIrregularCount();
    const scopeStarCountEl = document.getElementById('irv-scope-starred-count');
    if (scopeStarCountEl) scopeStarCountEl.innerText = starredCount;

    if (subview === 'table') {
      if (tableContainer) tableContainer.style.display = 'block';
      if (practiceContainer) practiceContainer.style.display = 'none';
      if (btnTable) btnTable.classList.add('active');
      if (btnPractice) btnPractice.classList.remove('active');
    } else {
      if (tableContainer) tableContainer.style.display = 'none';
      if (practiceContainer) practiceContainer.style.display = 'block';
      if (btnTable) btnTable.classList.remove('active');
      if (btnPractice) btnPractice.classList.add('active');

      if (!this._irvPractice || !this._irvPractice.questions || this._irvPractice.questions.length === 0) {
        const setupPanel = document.getElementById('irv-setup-panel');
        const activeArena = document.getElementById('irv-active-arena');
        const resultsPanel = document.getElementById('irv-results-panel');
        if (setupPanel) setupPanel.style.display = 'block';
        if (activeArena) activeArena.style.display = 'none';
        if (resultsPanel) resultsPanel.style.display = 'none';
      }
    }
  }

  setIrregularPracticeDir(dir, btn) {
    if (!this._irvPractice) this._irvPractice = { dir: 'all', count: 10, scope: 'all', questions: [], curIdx: 0, userAnswers: {}, score: 0 };
    this._irvPractice.dir = dir;
    const parent = document.getElementById('irv-dir-selector');
    if (parent) {
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
  }

  setIrregularPracticeCount(count, btn) {
    if (!this._irvPractice) this._irvPractice = { dir: 'all', count: 10, scope: 'all', questions: [], curIdx: 0, userAnswers: {}, score: 0 };
    this._irvPractice.count = parseInt(count) || 10;
    const parent = document.getElementById('irv-count-selector');
    if (parent) {
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
  }

  setIrregularPracticeScope(scope, btn) {
    if (!this._irvPractice) this._irvPractice = { dir: 'all', count: 10, scope: 'all', questions: [], curIdx: 0, userAnswers: {}, score: 0 };
    if (scope === 'starred') {
      const starredCount = window.dataStore.getStarredIrregularCount();
      if (starredCount === 0) {
        this.showToast('⚠️ Bạn chưa đánh dấu từ nào vào danh sách cần ôn. Hãy bấm biểu tượng 🔖 ở bảng tra cứu nhé!');
      }
    }
    this._irvPractice.scope = scope || 'all';
    const parent = document.getElementById('irv-scope-selector');
    if (parent) {
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
  }

  startIrregularPracticeSession() {
    if (!this._irvPractice) {
      this._irvPractice = { dir: 'all', count: 10, scope: 'all', questions: [], curIdx: 0, userAnswers: {}, score: 0 };
    }

    // Read Quizlet-style toggles for question formats
    const swMc = document.getElementById('irv-switch-mc');
    const swTf = document.getElementById('irv-switch-tf');
    const swWritten = document.getElementById('irv-switch-written');

    const useMc = swMc ? swMc.checked : true;
    const useTf = swTf ? swTf.checked : true;
    const useWritten = swWritten ? swWritten.checked : true;

    const allowedModes = [];
    if (useMc) allowedModes.push('choice');
    if (useTf) allowedModes.push('tf');
    if (useWritten) allowedModes.push('fill');

    if (allowedModes.length === 0) {
      alert('Vui lòng bật ít nhất 1 định dạng câu hỏi (Trắc nghiệm, Đúng/Sai, hoặc Tự gõ)!');
      return;
    }

    this._irvPractice.allowedModes = allowedModes;
    const dir = this._irvPractice.dir || 'all';
    const count = this._irvPractice.count || 10;

    const questions = this.generateIrregularPracticeQuestions(allowedModes, dir, count);
    if (!questions || questions.length === 0) {
      return;
    }

    this._irvPractice.questions = questions;
    this._irvPractice.curIdx = 0;
    this._irvPractice.userAnswers = {};
    this._irvPractice.score = 0;

    const setupPanel = document.getElementById('irv-setup-panel');
    const activeArena = document.getElementById('irv-active-arena');
    const resultsPanel = document.getElementById('irv-results-panel');

    if (setupPanel) setupPanel.style.display = 'none';
    if (resultsPanel) resultsPanel.style.display = 'none';
    if (activeArena) activeArena.style.display = 'block';

    this.renderIrregularPracticeQuestion();
  }

  generateIrregularPracticeQuestions(allowedModes, dir, count) {
    const allVerbs = [...(window.dataStore.irregularVerbs || [])];
    if (allVerbs.length === 0) return [];

    const scope = (this._irvPractice && this._irvPractice.scope) ? this._irvPractice.scope : 'all';
    let candidateVerbs = allVerbs;
    if (scope !== 'all') {
      if (scope === 'starred') {
        candidateVerbs = allVerbs.filter(v => window.dataStore.isIrregularStarred(v.v1));
        if (candidateVerbs.length === 0) {
          alert('⚠️ Bạn chưa đánh dấu từ nào vào danh sách Cần Ôn.\nVui lòng bấm vào biểu tượng đánh dấu (🔖) trong bảng tra cứu để chọn các từ cần ôn tập!');
          return [];
        }
      } else {
        candidateVerbs = allVerbs.filter(v => {
          if (scope === 'top40') return this.isUnit15TopVerb(v.v1) || !!v.is_top40;
          const c = this.classifyIrregularVerb(v);
          if (scope === 'dual_ed') return c.isDualEd;
          if (scope === 'all_same') return c.isAllSame;
          if (scope === 'v2_v3_same') return c.isV2V3Same;
          if (scope === 'v1_v3_same') return c.isV1V3Same;
          if (scope === 'all_diff') return c.isAllDiff;
          if (scope === 'i_a_u') return c.isIAU;
          return true;
        });
        if (candidateVerbs.length === 0) candidateVerbs = allVerbs;
      }
    }

    candidateVerbs.sort(() => Math.random() - 0.5);
    const selectedVerbs = candidateVerbs.slice(0, Math.min(count, candidateVerbs.length));
    const modesList = (Array.isArray(allowedModes) && allowedModes.length > 0) ? allowedModes : ['choice', 'tf', 'fill'];

    return selectedVerbs.map((v, idx) => {
      // Pick format from allowed modes
      const itemMode = modesList[idx % modesList.length];

      // Pick direction: 'en_vi' | 'vi_en' | 'v1_v2v3'
      let itemDir = dir;
      if (dir === 'all') {
        const dirsPool = ['en_vi', 'vi_en', 'v1_v2v3', 'v1_v2v3'];
        itemDir = dirsPool[idx % dirsPool.length];
      }

      return this.buildSingleIrregularQuestion(v, idx, itemMode, itemDir, allVerbs);
    });
  }

  buildSingleIrregularQuestion(v, idx, itemMode, itemDir, allVerbs) {
    const cleanTriad = `${v.v1} — ${v.v2} — ${v.v3}`;
    const classification = this.classifyIrregularVerb(v);
    let extraNote = '';
    if (classification.isDualEd) {
      extraNote = `<br>⚡ <strong>Lưu ý ngữ pháp:</strong> Động từ này có <em>2 cách chia song hành</em> (dạng bất quy tắc chuẩn & dạng thêm đuôi <code>-ed</code> kiểu US/hiện đại). Cả 2 đều đúng ngữ pháp!`;
    } else if (classification.isAllSame) {
      extraNote = `<br>🎯 <strong>Mẹo ghi nhớ:</strong> Nhóm từ đặc biệt có 3 dạng (V1 = V2 = V3) giống hệt nhau!`;
    }
    const cleanIpa = (ipa) => {
      if (!ipa) return '';
      const s = ipa.trim().replace(/^\/+|\/+$/g, '');
      return s ? `/${s}/` : '';
    };
    const baseExplanation = `📘 <strong>Bộ ba chuẩn:</strong> <span style="color:#0071e3; font-weight:800;">${v.v1}</span> ➔ <span style="color:#16a34a; font-weight:800;">${v.v2}</span> ➔ <span style="color:#0071e3; font-weight:800;">${v.v3}</span><br>🗣️ <strong>Phiên âm:</strong> ${cleanIpa(v.v1_ipa)} • ${cleanIpa(v.v2_ipa)} • ${cleanIpa(v.v3_ipa)}<br>🇻🇳 <strong>Nghĩa:</strong> ${v.meaning}${v.example ? `<br>💡 <strong>Ví dụ:</strong> <em>"${v.example}"</em>` : ''}${extraNote}`;

    // 1. CHOICE MODE
    if (itemMode === 'choice') {
      if (itemDir === 'en_vi') {
        // EN -> VI
        const otherMeanings = allVerbs.filter(o => o.v1 !== v.v1 && o.meaning !== v.meaning).map(o => o.meaning);
        otherMeanings.sort(() => Math.random() - 0.5);
        const distractors = otherMeanings.slice(0, 3);
        const options = [v.meaning, ...distractors].sort(() => Math.random() - 0.5);

        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'choice',
          dir: 'en_vi',
          typeLabel: 'TRẮC NGHIỆM: EN ➔ VI',
          dirLabel: '🇬🇧 Tiếng Anh ➔ 🇻🇳 Tiếng Việt',
          verb: v,
          stem: `Bộ ba động từ bất quy tắc <span class="irv-highlight-term">${cleanTriad}</span> có nghĩa tiếng Việt là gì?`,
          options: options,
          correct_answer: v.meaning,
          explanation: baseExplanation
        };
      } else if (itemDir === 'vi_en') {
        // VI -> EN
        const otherTriads = allVerbs.filter(o => o.v1 !== v.v1).map(o => `${o.v1} — ${o.v2} — ${o.v3}`);
        otherTriads.sort(() => Math.random() - 0.5);
        const distractors = otherTriads.slice(0, 3);
        const options = [cleanTriad, ...distractors].sort(() => Math.random() - 0.5);

        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'choice',
          dir: 'vi_en',
          typeLabel: 'TRẮC NGHIỆM: VI ➔ EN',
          dirLabel: '🇻🇳 Tiếng Việt ➔ 🇬🇧 Tiếng Anh',
          verb: v,
          stem: `Động từ mang nghĩa <span class="irv-highlight-term">"[${v.meaning.toUpperCase()}]"</span> có bộ 3 dạng bất quy tắc (V1 — V2 — V3) là gì?`,
          options: options,
          correct_answer: cleanTriad,
          explanation: baseExplanation
        };
      } else {
        // Internal column (V1 -> V2 or V1 -> V3 or Missing)
        const subType = idx % 3;
        if (subType === 0) {
          // V1 -> V2
          const otherV2s = allVerbs.filter(o => o.v1 !== v.v1 && o.v2 !== v.v2).map(o => o.v2);
          otherV2s.sort(() => Math.random() - 0.5);
          const distractors = [v.v3 !== v.v2 ? v.v3 : `${v.v1}ed`, otherV2s[0], otherV2s[1]].filter(Boolean);
          const options = Array.from(new Set([v.v2, ...distractors])).slice(0, 4).sort(() => Math.random() - 0.5);

          return {
            id: `irv_q_${idx}`,
            index: idx + 1,
            mode: 'choice',
            dir: 'v1_v2v3',
            typeLabel: 'TRẮC NGHIỆM: TÌM DẠNG V2 (QUÁ KHỨ)',
            dirLabel: '🔤 Nội Bộ Cột: V1 ➔ V2',
            verb: v,
            stem: `Dạng Quá Khứ Đơn <span class="irv-highlight-term">(V2 / Cột 2)</span> của động từ nguyên thể <span class="irv-highlight-term">"${v.v1.toUpperCase()}"</span> (${v.meaning}) là gì?`,
            options: options,
            correct_answer: v.v2,
            explanation: baseExplanation
          };
        } else if (subType === 1) {
          // V1 -> V3
          const otherV3s = allVerbs.filter(o => o.v1 !== v.v1 && o.v3 !== v.v3).map(o => o.v3);
          otherV3s.sort(() => Math.random() - 0.5);
          const distractors = [v.v2 !== v.v3 ? v.v2 : `${v.v1}en`, otherV3s[0], otherV3s[1]].filter(Boolean);
          const options = Array.from(new Set([v.v3, ...distractors])).slice(0, 4).sort(() => Math.random() - 0.5);

          return {
            id: `irv_q_${idx}`,
            index: idx + 1,
            mode: 'choice',
            dir: 'v1_v2v3',
            typeLabel: 'TRẮC NGHIỆM: TÌM DẠNG V3 (PHÂN TỪ)',
            dirLabel: '🔤 Nội Bộ Cột: V1 ➔ V3',
            verb: v,
            stem: `Dạng Quá Khứ Phân Từ <span class="irv-highlight-term">(V3 / Cột 3)</span> của động từ <span class="irv-highlight-term">"${v.v1.toUpperCase()} — ${v.v2}"</span> (${v.meaning}) là gì?`,
            options: options,
            correct_answer: v.v3,
            explanation: baseExplanation
          };
        } else {
          // Missing word
          const options = Array.from(new Set([v.v2, v.v3, v.v1, `${v.v1}ed`])).slice(0, 4).sort(() => Math.random() - 0.5);
          return {
            id: `irv_q_${idx}`,
            index: idx + 1,
            mode: 'choice',
            dir: 'v1_v2v3',
            typeLabel: 'TRẮC NGHIỆM: ĐIỀN TỪ CÒN THIẾU',
            dirLabel: '🔤 Nội Bộ Cột: Điền Từ Khuyết',
            verb: v,
            stem: `Chọn từ còn thiếu để hoàn thiện bộ ba: <span class="irv-highlight-term">"${v.v1} — ______ — ${v.v3}"</span> (${v.meaning}):`,
            options: options,
            correct_answer: v.v2,
            explanation: baseExplanation
          };
        }
      }
    }

    // 2. FILL-IN / WRITING MODE
    if (itemMode === 'fill') {
      if (itemDir === 'vi_en') {
        // Type 3 forms from Vietnamese meaning
        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'fill',
          fillType: 'triad',
          dir: 'vi_en',
          typeLabel: 'LUYỆN VIẾT: GÕ 3 DẠNG TỪ (V1-V2-V3)',
          dirLabel: '🇻🇳 Tiếng Việt ➔ 🇬🇧 Gõ 3 Dạng Từ',
          verb: v,
          stem: `Nhập đầy đủ 3 dạng <span class="irv-highlight-term">(V1 — V2 — V3)</span> của động từ mang nghĩa <span class="irv-highlight-term">"[${v.meaning.toUpperCase()}]"</span>:`,
          expected: { v1: v.v1, v2: v.v2, v3: v.v3 },
          correct_answer: `${v.v1} — ${v.v2} — ${v.v3}`,
          explanation: baseExplanation
        };
      } else {
        // Given V1, write V2 & V3
        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'fill',
          fillType: 'v2_v3',
          dir: 'v1_v2v3',
          typeLabel: 'LUYỆN VIẾT: GÕ DẠNG V2 & V3',
          dirLabel: '🔤 Cho V1 ➔ Gõ V2 Quá Khứ & V3 Phân Từ',
          verb: v,
          stem: `Nhập dạng Quá Khứ <span class="irv-highlight-term">(V2)</span> và Phân Từ <span class="irv-highlight-term">(V3)</span> của động từ nguyên thể <span class="irv-highlight-term">"${v.v1.toUpperCase()}"</span> (${v.meaning}):`,
          expected: { v2: v.v2, v3: v.v3 },
          correct_answer: `V2 = ${v.v2}, V3 = ${v.v3}`,
          explanation: baseExplanation
        };
      }
    }

    // 3. TRUE / FALSE MODE
    if (itemMode === 'tf') {
      const isTrue = Math.random() > 0.5;
      if (itemDir === 'en_vi') {
        // True/False on meaning
        let claimMeaning = v.meaning;
        if (!isTrue) {
          const fakeVerb = allVerbs.find(o => o.v1 !== v.v1 && o.meaning !== v.meaning);
          claimMeaning = fakeVerb ? fakeVerb.meaning : 'từ bỏ';
        }
        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'tf',
          dir: 'en_vi',
          typeLabel: 'THỬ THÁCH ĐÚNG / SAI (NGHĨA TỪ)',
          dirLabel: '⚖️ Thử Thách Đúng / Sai: EN ➔ VI',
          verb: v,
          isTrueClaim: isTrue,
          stem: `Khẳng định sau đây là ĐÚNG hay SAI?<br><div class="irv-claim-box">"Bộ ba động từ <strong>${cleanTriad}</strong> có nghĩa tiếng Việt là <strong>${claimMeaning}</strong>."</div>`,
          correct_answer: isTrue ? 'True' : 'False',
          explanation: baseExplanation
        };
      } else {
        // True/False on Verb forms
        let testedV2 = v.v2;
        let testedV3 = v.v3;
        if (!isTrue) {
          const fakeVerb = allVerbs.find(o => o.v1 !== v.v1);
          testedV2 = fakeVerb ? fakeVerb.v2 : `${v.v1}ed`;
        }
        return {
          id: `irv_q_${idx}`,
          index: idx + 1,
          mode: 'tf',
          dir: 'v1_v2v3',
          typeLabel: 'THỬ THÁCH ĐÚNG / SAI (DẠNG TỪ V2/V3)',
          dirLabel: '⚖️ Thử Thách Đúng / Sai: Dạng Biến Đổi',
          verb: v,
          isTrueClaim: isTrue,
          stem: `Khẳng định sau đây là ĐÚNG hay SAI?<br><div class="irv-claim-box">"Động từ <strong>${v.v1}</strong> (${v.meaning}) có dạng quá khứ V2 là <strong>${testedV2}</strong> và phân từ V3 là <strong>${testedV3}</strong>."</div>`,
          correct_answer: isTrue ? 'True' : 'False',
          explanation: baseExplanation
        };
      }
    }
  }

  renderIrregularPracticeQuestion() {
    const q = this._irvPractice.questions[this._irvPractice.curIdx];
    if (!q) return;

    const total = this._irvPractice.questions.length;
    const currentNo = this._irvPractice.curIdx + 1;
    const progressPct = Math.round((currentNo / total) * 100);

    // Update Header indicators
    const progressBadge = document.getElementById('irv-progress-badge');
    const qTypeBadge = document.getElementById('irv-q-type-badge');
    const progressBar = document.getElementById('irv-progress-bar');

    if (progressBadge) progressBadge.innerText = `Câu ${currentNo} / ${total}`;
    if (qTypeBadge) qTypeBadge.innerText = q.typeLabel;
    if (progressBar) progressBar.style.width = `${progressPct}%`;

    this.updateIrregularAnsweredProgress();

    // Update side navigation buttons
    const btnSidePrev = document.getElementById('irv-btn-side-prev');
    const btnSideNext = document.getElementById('irv-btn-side-next');
    if (btnSidePrev) {
      btnSidePrev.disabled = (this._irvPractice.curIdx === 0);
    }
    if (btnSideNext) {
      btnSideNext.title = (this._irvPractice.curIdx === total - 1) ? '🏁 Nộp bài & Xem kết quả' : 'Câu tiếp theo (hoặc phím mũi tên →)';
    }

    const card = document.getElementById('irv-question-card');
    if (!card) return;

    const savedAns = this._irvPractice.userAnswers[this._irvPractice.curIdx];

    let html = `
      <!-- Top meta info -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 8px;">
        <span class="status-pill status-avail" style="font-size: 12px; font-weight: 700;">${q.dirLabel}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="speaker-btn" onclick="window.smobApp.speakText('${q.verb.v1}')" title="Nghe phát âm từ: ${q.verb.v1}">🔊 Nghe V1 (${q.verb.v1})</button>
        </div>
      </div>

      <!-- Question Stem -->
      <div class="irv-stem-text" style="font-size: 19px; font-weight: 700; color: var(--text-primary); line-height: 1.55; margin-bottom: 24px;">
        ${q.stem}
      </div>
    `;

    // Render Answer input controls based on mode (Quizlet Deferred Exam Mode)
    if (q.mode === 'choice') {
      html += `<div class="irv-opts-grid">`;
      q.options.forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const safeOpt = this.escapeHtml(opt);
        const isSelected = savedAns && savedAns.selectedIdx === oIdx;
        html += `
          <button type="button" class="irv-opt-btn ${isSelected ? 'selected' : ''}" id="irv-opt-btn-${oIdx}" onclick="window.smobApp.selectIrregularPracticeChoice(${oIdx})">
            <span class="irv-opt-letter">${letter}</span>
            <span class="irv-opt-text">${safeOpt}</span>
          </button>
        `;
      });
      html += `</div>`;
    } else if (q.mode === 'fill') {
      const v1Val = savedAns ? this.escapeHtml(savedAns.v1 || '') : '';
      const v2Val = savedAns ? this.escapeHtml(savedAns.v2 || '') : '';
      const v3Val = savedAns ? this.escapeHtml(savedAns.v3 || '') : '';

      if (q.fillType === 'triad') {
        html += `
          <div class="irv-fill-inputs-row">
            <div class="irv-fill-input-group">
              <label class="irv-fill-input-label">1. V1 (Nguyên thể):</label>
              <input type="text" id="irv-inp-v1" class="irv-fill-text-input" placeholder="Ví dụ: ${q.verb.v1.slice(0, 1)}..." value="${v1Val}" autocomplete="off" oninput="window.smobApp.onIrregularFillInput()" onkeydown="if(event.key==='Enter') window.smobApp.nextIrregularPracticeQuestion()" />
            </div>
            <div class="irv-fill-input-group">
              <label class="irv-fill-input-label">2. V2 (Quá khứ):</label>
              <input type="text" id="irv-inp-v2" class="irv-fill-text-input" placeholder="Ví dụ: ${q.verb.v2.slice(0, 1)}..." value="${v2Val}" autocomplete="off" oninput="window.smobApp.onIrregularFillInput()" onkeydown="if(event.key==='Enter') window.smobApp.nextIrregularPracticeQuestion()" />
            </div>
            <div class="irv-fill-input-group">
              <label class="irv-fill-input-label">3. V3 (Phân từ):</label>
              <input type="text" id="irv-inp-v3" class="irv-fill-text-input" placeholder="Ví dụ: ${q.verb.v3.slice(0, 1)}..." value="${v3Val}" autocomplete="off" oninput="window.smobApp.onIrregularFillInput()" onkeydown="if(event.key==='Enter') window.smobApp.nextIrregularPracticeQuestion()" />
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="irv-fill-inputs-row">
            <div class="irv-fill-input-group">
              <label class="irv-fill-input-label">1. Dạng Quá Khứ (V2):</label>
              <input type="text" id="irv-inp-v2" class="irv-fill-text-input" placeholder="Gõ dạng V2..." value="${v2Val}" autocomplete="off" oninput="window.smobApp.onIrregularFillInput()" onkeydown="if(event.key==='Enter') window.smobApp.nextIrregularPracticeQuestion()" />
            </div>
            <div class="irv-fill-input-group">
              <label class="irv-fill-input-label">2. Dạng Phân Từ (V3):</label>
              <input type="text" id="irv-inp-v3" class="irv-fill-text-input" placeholder="Gõ dạng V3..." value="${v3Val}" autocomplete="off" oninput="window.smobApp.onIrregularFillInput()" onkeydown="if(event.key==='Enter') window.smobApp.nextIrregularPracticeQuestion()" />
            </div>
          </div>
        `;
      }
    } else if (q.mode === 'tf') {
      const isTrueSelected = savedAns && savedAns.value === 'True';
      const isFalseSelected = savedAns && savedAns.value === 'False';
      html += `
        <div class="irv-tf-row">
          <button type="button" class="irv-tf-btn tf-true ${isTrueSelected ? 'selected' : ''}" id="irv-tf-btn-True" onclick="window.smobApp.selectIrregularPracticeTrueFalse('True')">
            <span style="font-size: 22px;">✓</span> ĐÚNG (TRUE)
          </button>
          <button type="button" class="irv-tf-btn tf-false ${isFalseSelected ? 'selected' : ''}" id="irv-tf-btn-False" onclick="window.smobApp.selectIrregularPracticeTrueFalse('False')">
            <span style="font-size: 22px;">✗</span> SAI (FALSE)
          </button>
        </div>
      `;
    }

    // Card Action Footer (Previous & Next Controls)
    html += `
      <div class="irv-card-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px;">
        <div>
          <button type="button" class="apple-btn btn-secondary" onclick="window.smobApp.speakText('${q.verb.v1}')" style="font-size: 13px;">🔊 Nghe Lại Động Từ</button>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button type="button" class="apple-btn btn-secondary" id="irv-btn-bot-prev" onclick="window.smobApp.prevIrregularPracticeQuestion()" ${this._irvPractice.curIdx === 0 ? 'disabled' : ''} style="font-weight: 700; padding: 9px 20px;">
            ⬅ Câu Trước
          </button>
          ${this._irvPractice.curIdx === total - 1 ? `
            <button type="button" class="apple-btn btn-primary" id="irv-btn-bot-finish" onclick="window.smobApp.finishIrregularPracticeSession()" style="font-weight: 800; padding: 9px 24px;">
              🏁 Nộp Bài &amp; Xem Kết Quả
            </button>
          ` : `
            <button type="button" class="apple-btn btn-primary" id="irv-btn-bot-next" onclick="window.smobApp.nextIrregularPracticeQuestion()" style="font-weight: 800; padding: 9px 24px;">
              Câu Tiếp Theo ➔
            </button>
          `}
        </div>
      </div>
    `;

    card.innerHTML = html;

    // Focus input if fill mode
    if (q.mode === 'fill') {
      setTimeout(() => {
        const firstInp = document.getElementById('irv-inp-v1') || document.getElementById('irv-inp-v2');
        if (firstInp) firstInp.focus();
      }, 50);
    }
  }

  selectIrregularPracticeChoice(optIdx) {
    const curIdx = this._irvPractice.curIdx;
    const q = this._irvPractice.questions[curIdx];
    if (!q || q.mode !== 'choice') return;

    const selectedOpt = q.options[optIdx];
    this._irvPractice.userAnswers[curIdx] = {
      type: 'choice',
      selectedIdx: optIdx,
      value: selectedOpt
    };

    // Highlight selected button without revealing correct/wrong
    q.options.forEach((opt, oIdx) => {
      const btn = document.getElementById(`irv-opt-btn-${oIdx}`);
      if (btn) {
        if (oIdx === optIdx) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      }
    });

    this.updateIrregularAnsweredProgress();
  }

  selectIrregularPracticeTrueFalse(val) {
    const curIdx = this._irvPractice.curIdx;
    const q = this._irvPractice.questions[curIdx];
    if (!q || q.mode !== 'tf') return;

    this._irvPractice.userAnswers[curIdx] = {
      type: 'tf',
      value: val
    };

    const btnT = document.getElementById('irv-tf-btn-True');
    const btnF = document.getElementById('irv-tf-btn-False');
    if (btnT) {
      if (val === 'True') btnT.classList.add('selected');
      else btnT.classList.remove('selected');
    }
    if (btnF) {
      if (val === 'False') btnF.classList.add('selected');
      else btnF.classList.remove('selected');
    }

    this.updateIrregularAnsweredProgress();
  }

  saveCurrentFillInAnswer() {
    if (!this._irvPractice || !this._irvPractice.questions) return;
    const curIdx = this._irvPractice.curIdx;
    const q = this._irvPractice.questions[curIdx];
    if (!q || q.mode !== 'fill') return;

    const inpV1 = document.getElementById('irv-inp-v1');
    const inpV2 = document.getElementById('irv-inp-v2');
    const inpV3 = document.getElementById('irv-inp-v3');

    const v1Val = inpV1 ? inpV1.value.trim() : '';
    const v2Val = inpV2 ? inpV2.value.trim() : '';
    const v3Val = inpV3 ? inpV3.value.trim() : '';

    if (v1Val || v2Val || v3Val) {
      this._irvPractice.userAnswers[curIdx] = {
        type: 'fill',
        v1: v1Val,
        v2: v2Val,
        v3: v3Val
      };
    } else {
      delete this._irvPractice.userAnswers[curIdx];
    }
    this.updateIrregularAnsweredProgress();
  }

  onIrregularFillInput() {
    this.saveCurrentFillInAnswer();
  }

  updateIrregularAnsweredProgress() {
    if (!this._irvPractice || !this._irvPractice.questions) return;
    const total = this._irvPractice.questions.length;
    const userAnswers = this._irvPractice.userAnswers || {};

    let answeredCount = 0;
    for (let i = 0; i < total; i++) {
      const a = userAnswers[i];
      if (a) {
        if (a.type === 'fill' && (a.v1 || a.v2 || a.v3)) answeredCount++;
        else if (a.value !== undefined) answeredCount++;
      }
    }

    const answeredEl = document.getElementById('irv-progress-answered');
    if (answeredEl) {
      answeredEl.innerText = `Đã làm: ${answeredCount}/${total}`;
    }
  }

  prevIrregularPracticeQuestion() {
    if (!this._irvPractice || !this._irvPractice.questions) return;
    if (this._irvPractice.curIdx <= 0) return;
    this.saveCurrentFillInAnswer();
    this._irvPractice.curIdx -= 1;
    this.renderIrregularPracticeQuestion();
  }

  nextIrregularPracticeQuestion() {
    if (!this._irvPractice || !this._irvPractice.questions) return;
    this.saveCurrentFillInAnswer();
    const nextIdx = this._irvPractice.curIdx + 1;
    if (nextIdx < this._irvPractice.questions.length) {
      this._irvPractice.curIdx = nextIdx;
      this.renderIrregularPracticeQuestion();
    } else {
      this.finishIrregularPracticeSession();
    }
  }

  finishIrregularPracticeSession() {
    if (!this._irvPractice || !this._irvPractice.questions || this._irvPractice.questions.length === 0) return;
    this.saveCurrentFillInAnswer();

    const total = this._irvPractice.questions.length;
    const userAnswers = this._irvPractice.userAnswers || {};

    let answeredCount = 0;
    for (let i = 0; i < total; i++) {
      const a = userAnswers[i];
      if (a) {
        if (a.type === 'fill' && (a.v1 || a.v2 || a.v3)) answeredCount++;
        else if (a.value !== undefined) answeredCount++;
      }
    }

    if (answeredCount < total) {
      const confirmSubmit = confirm(`Bạn mới trả lời ${answeredCount}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài để xem đáp án và giải thích ngay không?`);
      if (!confirmSubmit) return;
    }

    const checkMatch = (val, target) => {
      const vClean = (val || '').trim().toLowerCase();
      const tClean = (target || '').trim().toLowerCase();
      if (!vClean) return false;
      if (vClean === tClean) return true;
      const variants = tClean.split(/[\/,]/).map(s => s.trim());
      return variants.includes(vClean);
    };

    let score = 0;
    const gradedResults = [];

    this._irvPractice.questions.forEach((q, idx) => {
      const a = userAnswers[idx];
      let isCorrect = false;
      let userAnsDisplay = '(Chưa trả lời)';

      let fillDetails = null;
      if (q.mode === 'choice') {
        if (a && a.value) {
          userAnsDisplay = a.value;
          isCorrect = (a.value || '').trim().toLowerCase() === (q.correct_answer || '').trim().toLowerCase();
        }
      } else if (q.mode === 'tf') {
        if (a && a.value) {
          userAnsDisplay = a.value === 'True' ? 'ĐÚNG (True)' : 'SAI (False)';
          isCorrect = a.value === q.correct_answer;
        }
      } else if (q.mode === 'fill') {
        if (a) {
          if (q.fillType === 'triad') {
            const m1 = checkMatch(a.v1, q.expected.v1);
            const m2 = checkMatch(a.v2, q.expected.v2);
            const m3 = checkMatch(a.v3, q.expected.v3);
            isCorrect = m1 && m2 && m3;
            userAnsDisplay = `${a.v1 || '(trống)'} — ${a.v2 || '(trống)'} — ${a.v3 || '(trống)'}`;
            fillDetails = [
              { label: 'V1 (Nguyên thể)', user: a.v1, exp: q.expected.v1, pass: m1 },
              { label: 'V2 (Quá khứ)', user: a.v2, exp: q.expected.v2, pass: m2 },
              { label: 'V3 (Phân từ)', user: a.v3, exp: q.expected.v3, pass: m3 }
            ];
          } else {
            const m2 = checkMatch(a.v2, q.expected.v2);
            const m3 = checkMatch(a.v3, q.expected.v3);
            isCorrect = m2 && m3;
            userAnsDisplay = `V2: ${a.v2 || '(trống)'}, V3: ${a.v3 || '(trống)'}`;
            fillDetails = [
              { label: 'V2 (Quá khứ)', user: a.v2, exp: q.expected.v2, pass: m2 },
              { label: 'V3 (Phân từ)', user: a.v3, exp: q.expected.v3, pass: m3 }
            ];
          }
        } else {
          fillDetails = (q.fillType === 'triad')
            ? [
                { label: 'V1 (Nguyên thể)', user: '', exp: q.expected.v1, pass: false },
                { label: 'V2 (Quá khứ)', user: '', exp: q.expected.v2, pass: false },
                { label: 'V3 (Phân từ)', user: '', exp: q.expected.v3, pass: false }
              ]
            : [
                { label: 'V2 (Quá khứ)', user: '', exp: q.expected.v2, pass: false },
                { label: 'V3 (Phân từ)', user: '', exp: q.expected.v3, pass: false }
              ];
        }
      }

      if (isCorrect) score += 1;

      gradedResults.push({
        question: q,
        isCorrect,
        userAnsDisplay,
        fillDetails
      });
    });

    this._irvPractice.score = score;
    const pct = Math.round((score / total) * 100);

    const activeArena = document.getElementById('irv-active-arena');
    const resultsPanel = document.getElementById('irv-results-panel');
    const setupPanel = document.getElementById('irv-setup-panel');

    if (activeArena) activeArena.style.display = 'none';
    if (setupPanel) setupPanel.style.display = 'none';
    if (resultsPanel) resultsPanel.style.display = 'block';

    const iconEl = document.getElementById('irv-res-icon');
    const titleEl = document.getElementById('irv-res-title');
    const subEl = document.getElementById('irv-res-subtitle');
    const scoreEl = document.getElementById('irv-res-score');
    const pctEl = document.getElementById('irv-res-pct');

    if (scoreEl) scoreEl.innerText = `${score} / ${total}`;
    if (pctEl) pctEl.innerText = `(${pct}%)`;

    if (pct >= 90) {
      if (iconEl) iconEl.innerText = '🏆';
      if (titleEl) titleEl.innerText = 'Đỉnh Cao! Bạn Là Bậc Thầy Động Từ Bất Quy Tắc!';
      if (subEl) subEl.innerText = 'Bạn đã nắm vững toàn bộ các dạng biến đổi và nghĩa của các động từ vừa kiểm tra.';
    } else if (pct >= 70) {
      if (iconEl) iconEl.innerText = '🌟';
      if (titleEl) titleEl.innerText = 'Rất Tốt! Nền Tảng Của Bạn Khá Vững!';
      if (subEl) subEl.innerText = 'Chỉ cần ôn thêm một vài từ bị nhầm lẫn ở bảng chi tiết bên dưới.';
    } else {
      if (iconEl) iconEl.innerText = '⚡';
      if (titleEl) titleEl.innerText = 'Cần Ôn Tập Thêm!';
      if (subEl) subEl.innerText = 'Hãy xem kỹ các từ sai ở danh sách bên dưới và bấm nút luyện lại để khắc sâu trí nhớ nhé.';
    }

    // Render Review List with revealed answers & explanations
    const reviewList = document.getElementById('irv-review-items-list');
    if (reviewList) {
      reviewList.innerHTML = '';
      const cleanIpa = (ipa) => {
        if (!ipa) return '';
        const s = ipa.trim().replace(/^\/+|\/+$/g, '');
        return s ? `/${s}/` : '';
      };

      gradedResults.forEach((res, idx) => {
        const q = res.question;
        const isPass = res.isCorrect;
        const v = q.verb;

        let displayCorrect = q.correct_answer;
        if (q.mode === 'tf') {
          displayCorrect = q.correct_answer === 'True' ? 'ĐÚNG (True)' : 'SAI (False)';
        }

        // Targeted pedagogical rationale based on question type
        let targetedExpl = '';
        if (q.mode === 'tf') {
          if (q.dir === 'en_vi') {
            targetedExpl = q.isTrueClaim
              ? `💡 <strong>Giải thích vì sao ĐÚNG:</strong> Bộ ba động từ <strong>${v.v1} — ${v.v2} — ${v.v3}</strong> mang nghĩa chuẩn xác là <em>"${v.meaning}"</em>.`
              : `💡 <strong>Giải thích vì sao SAI:</strong> Bộ ba <strong>${v.v1} — ${v.v2} — ${v.v3}</strong> thực chất có nghĩa là <em>"${v.meaning}"</em>. Khẳng định trong đề bài đã gán sai nghĩa tiếng Việt!`;
          } else {
            targetedExpl = q.isTrueClaim
              ? `💡 <strong>Giải thích vì sao ĐÚNG:</strong> Động từ <strong>${v.v1}</strong> chia ở quá khứ V2 là <strong>${v.v2}</strong> và phân từ V3 là <strong>${v.v3}</strong>.`
              : `💡 <strong>Giải thích vì sao SAI:</strong> Động từ <strong>${v.v1}</strong> có dạng quá khứ V2 chuẩn là <strong>${v.v2}</strong> và phân từ V3 chuẩn là <strong>${v.v3}</strong>. Khẳng định trong đề bài đã chia sai dạng từ!`;
          }
        }

        const classification = this.classifyIrregularVerb(v);
        let grammarNote = '';
        if (classification && classification.isDualEd) {
          grammarNote = `<div style="margin-top: 4px; color: #b45309; font-size: 12.5px;">⚡ <strong>Lưu ý ngữ pháp:</strong> Động từ này có 2 cách chia song hành (dạng bất quy tắc chuẩn & dạng thêm đuôi <code>-ed</code> kiểu hiện đại). Cả 2 đều đúng ngữ pháp.</div>`;
        } else if (classification && classification.isAllSame) {
          grammarNote = `<div style="margin-top: 4px; color: #0284c7; font-size: 12.5px;">🎯 <strong>Mẹo ghi nhớ:</strong> Nhóm động từ đặc biệt có cả 3 dạng V1 = V2 = V3 giống hệt nhau.</div>`;
        }

        const item = document.createElement('div');
        item.className = `irv-review-item ${isPass ? 'is-pass' : 'is-fail'}`;
        item.innerHTML = `
          <div style="flex: 1; min-width: 260px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="status-pill ${isPass ? 'status-avail' : 'status-pending'}" style="font-size: 11.5px; font-weight: 800;">
                ${isPass ? '✓ ĐÚNG' : '✗ SAI'}
              </span>
              <span style="font-size: 13px; font-weight: 700; color: var(--text-secondary);">Câu ${idx + 1}: ${q.typeLabel}</span>
            </div>

            <!-- Câu hỏi (Giữ nguyên hộp khẳng định cho câu Đúng/Sai) -->
            <div style="font-size: 14.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; line-height: 1.5;">
              ${q.stem}
            </div>

            <!-- Khối so sánh đối chiếu kết quả thông minh -->
            ${res.fillDetails ? `
              <div class="irv-fill-eval-grid">
                ${res.fillDetails.map(fd => `
                  <div class="irv-fill-eval-card ${fd.pass ? 'pass' : 'fail'}">
                    <span style="font-weight: 700; color: var(--text-secondary); font-size: 11.5px; text-transform: uppercase;">${fd.label}</span>
                    <span style="font-size: 13.5px;">Bạn gõ: <strong style="color: ${fd.pass ? '#16a34a' : '#dc2626'};">${this.escapeHtml(fd.user || '(bỏ trống)')}</strong></span>
                    <span style="font-size: 13px; font-weight: 700; color: ${fd.pass ? '#16a34a' : '#0071e3'};">
                      ${fd.pass ? '✓ Chính xác' : `➜ Đáp án đúng: <strong>${this.escapeHtml(fd.exp)}</strong>`}
                    </span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="irv-compare-cards-grid">
                <div class="irv-compare-box user-ans ${isPass ? 'is-pass' : 'is-fail'}">
                  <span class="compare-title">👤 Câu trả lời của bạn</span>
                  <span class="compare-val">${this.escapeHtml(res.userAnsDisplay || '(Chưa trả lời)')}</span>
                </div>
                <div class="irv-compare-box correct-ans">
                  <span class="compare-title">🎯 Đáp án chính xác</span>
                  <span class="compare-val">${this.escapeHtml(displayCorrect || '')}</span>
                </div>
              </div>
            `}

            <!-- Bảng 3 cột V1 - V2 - V3 chuẩn Apple (Chỉ hiển thị 1 lần duy nhất, không lặp lại) -->
            <div class="irv-3col-card">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 2px;">V1 (Nguyên thể)</div>
                <div style="font-size: 14px; font-weight: 800; color: #0071e3;">${v.v1} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">${cleanIpa(v.v1_ipa)}</span></div>
              </div>
              <div>
                <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 2px;">V2 (Quá khứ)</div>
                <div style="font-size: 14px; font-weight: 800; color: #16a34a;">${v.v2} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">${cleanIpa(v.v2_ipa)}</span></div>
              </div>
              <div>
                <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 2px;">V3 (Phân từ)</div>
                <div style="font-size: 14px; font-weight: 800; color: #0071e3;">${v.v3} <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary);">${cleanIpa(v.v3_ipa)}</span></div>
              </div>
            </div>

            <!-- Nghĩa tiếng Việt, ví dụ và giải thích trọng tâm -->
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-top: 6px;">
              <div>🇻🇳 <strong>Nghĩa:</strong> <span style="color: var(--text-primary); font-weight: 600;">${v.meaning}</span></div>
              ${v.example ? `<div>💡 <strong>Ví dụ:</strong> <em>"${v.example}"</em></div>` : ''}
              ${targetedExpl ? `<div style="margin-top: 6px; padding: 8px 12px; background: rgba(0,0,0,0.03); border-radius: 6px; border-left: 3px solid #0071e3; color: var(--text-primary);">${targetedExpl}</div>` : ''}
              ${grammarNote}
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; padding-top: 4px;">
            <button class="speaker-btn" onclick="window.smobApp.speakText('${v.v1}')" title="Nghe phát âm">🔊</button>
          </div>
        `;
        reviewList.appendChild(item);
      });
    }

    this.showToast(`🎉 Đã nộp bài! Kết quả: ${score}/${total} câu đúng (${pct}%)!`);
  }

  restartCurrentIrregularPractice() {
    if (!this._irvPractice || !this._irvPractice.questions || this._irvPractice.questions.length === 0) return;
    this._irvPractice.curIdx = 0;
    this._irvPractice.userAnswers = {};
    this._irvPractice.score = 0;

    const setupPanel = document.getElementById('irv-setup-panel');
    const resultsPanel = document.getElementById('irv-results-panel');
    const activeArena = document.getElementById('irv-active-arena');

    if (setupPanel) setupPanel.style.display = 'none';
    if (resultsPanel) resultsPanel.style.display = 'none';
    if (activeArena) activeArena.style.display = 'block';

    this.renderIrregularPracticeQuestion();
  }

  exitIrregularPractice() {
    const setupPanel = document.getElementById('irv-setup-panel');
    const resultsPanel = document.getElementById('irv-results-panel');
    const activeArena = document.getElementById('irv-active-arena');

    if (activeArena) activeArena.style.display = 'none';
    if (resultsPanel) resultsPanel.style.display = 'none';
    if (setupPanel) setupPanel.style.display = 'block';
  }

  // ==========================================
  // EXAM & COMBINED TEST ENGINE (CHECKBOX MATRIX & DEFERRED GRADING)
  // ==========================================
  renderExamUnitsCheckboxes() {
    const container = document.getElementById('exam-units-checkboxes-container');
    if (!container) return;
    container.innerHTML = '';

    const units = window.dataStore.units;
    const curUnitId = window.dataStore.currentUnitId || 1;

    units.forEach(u => {
      const label = document.createElement('label');
      label.className = 'unit-check-label';
      label.innerHTML = `
        <input type="checkbox" class="exam-unit-cb" value="${u.unit_number}" ${u.unit_number === curUnitId ? 'checked' : ''} onchange="window.smobApp.updateExamUnitsSummary()">
        <span>Unit ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}</span>
      `;
      container.appendChild(label);
    });

    this.updateExamUnitsSummary();
  }

  selectAllExamUnits(selectAll) {
    document.querySelectorAll('.exam-unit-cb').forEach(cb => {
      cb.checked = selectAll;
    });
    this.updateExamUnitsSummary();
  }

  updateExamUnitsSummary() {
    const selected = Array.from(document.querySelectorAll('.exam-unit-cb:checked')).map(cb => parseInt(cb.value));
    this.testScopeUnits = selected;

    let totalQ = 0;
    selected.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (u && u.unit_test) totalQ += u.unit_test.length;
    });

    const summary = document.getElementById('exam-units-summary');
    if (summary) {
      summary.innerText = `Đã chọn: ${selected.length} Units • Tổng kho: ${totalQ} câu hỏi gốc`;
    }
  }

  setTestQuestionCount(count, btn) {
    this.testQuestionCount = count;
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  setTestDifficulty(diff, btn) {
    this.testDifficulty = diff;
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  startGeneratedTest() {
    this.updateExamUnitsSummary();
    if (this.testScopeUnits.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 Unit trong bảng để tạo đề!');
      return;
    }

    let pool = [];
    this.testScopeUnits.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (u && u.unit_test) {
        pool.push(...u.unit_test.map(q => ({ ...q, unitId: uid })));
      }
    });

    if (pool.length === 0) {
      alert('Không tìm thấy câu hỏi bài tập cho các Unit đã chọn!');
      return;
    }

    if (this.testDifficulty === 'Random') {
      pool.sort(() => Math.random() - 0.5);
    }

    const count = Math.min(this.testQuestionCount, pool.length);
    const questions = pool.slice(0, count);

    this.launchExamSession(questions, `Đề Thi Tổng Hợp (${questions.length} Câu Hỏi)`);
  }

  startUnitTest(unitId) {
    const uid = parseInt(unitId) || 1;
    const u = window.dataStore.getUnit(uid);
    if (!u || !u.unit_test || u.unit_test.length === 0) {
      alert('Unit này chưa có bài thi gốc.');
      return;
    }
    window.dataStore.setCurrentUnit(uid);
    this.currentPdfUnit = uid;
    this.navigate('tests');
    this.renderPdfOnlineExam(uid);
  }

  launchExamSession(questions, title) {
    this.testQuestions = questions;
    this.currentTestIndex = 0;
    this.userTestAnswers = {};
    this.testFinished = false;
    this.testTimerSeconds = 0;

    document.getElementById('test-config-panel').style.display = 'none';
    document.getElementById('test-result-screen').style.display = 'none';
    const shell = document.getElementById('test-runner-shell');
    shell.style.display = 'block';

    // Timer
    clearInterval(this.testTimerInterval);
    this.testTimerInterval = setInterval(() => {
      this.testTimerSeconds++;
      const m = Math.floor(this.testTimerSeconds / 60);
      const s = this.testTimerSeconds % 60;
      document.getElementById('test-timer').innerText = `⏱️ ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, 1000);

    this.renderQuestionPalette();
    this.goToQuestion(0);
  }

  renderQuestionPalette() {
    const palette = document.getElementById('question-palette');
    palette.innerHTML = '';

    this.testQuestions.forEach((q, idx) => {
      const dot = document.createElement('div');
      dot.className = 'palette-dot';
      dot.innerText = idx + 1;
      dot.id = `palette-dot-${idx}`;
      dot.onclick = () => this.goToQuestion(idx);
      palette.appendChild(dot);
    });
  }

  goToQuestion(idx) {
    if (idx < 0 || idx >= this.testQuestions.length) return;
    this.currentTestIndex = idx;

    const q = this.testQuestions[idx];
    document.getElementById('test-q-progress').innerText = `Câu hỏi ${idx + 1} / ${this.testQuestions.length}`;
    document.getElementById('test-part-label').innerText = `Part 1: Đề thi gốc • Unit ${q.unitId || window.dataStore.currentUnitId}`;
    document.getElementById('test-stem').innerText = `${idx + 1}. ${q.stem}`;

    this.updatePaletteStyles();

    // HIDE explanation during exam (only show after submitting)
    const explBox = document.getElementById('test-explanation-callout');
    if (!this.testFinished) {
      explBox.style.display = 'none';
    } else {
      explBox.style.display = 'block';
    }

    const optContainer = document.getElementById('test-options-container');
    const inputContainer = document.getElementById('test-input-container');

    if (q.type === 'multiple_choice' || (q.options && q.options.length > 0)) {
      optContainer.style.display = 'grid';
      inputContainer.style.display = 'none';
      optContainer.innerHTML = '';

      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'ans-pill';
        btn.innerText = opt;

        const currentAns = this.userTestAnswers[q.id];
        if (currentAns === opt) {
          btn.classList.add('selected');
        }

        if (this.testFinished) {
          if (opt === q.correct_answer) btn.classList.add('is-correct');
          else if (opt === currentAns) btn.classList.add('is-wrong');
        }

        btn.onclick = () => {
          if (this.testFinished) return;
          this.userTestAnswers[q.id] = opt;
          this.goToQuestion(this.currentTestIndex);
        };
        optContainer.appendChild(btn);
      });
    } else {
      optContainer.style.display = 'none';
      inputContainer.style.display = 'block';
      const input = document.getElementById('test-text-input');
      input.value = this.userTestAnswers[q.id] || '';
      input.disabled = this.testFinished;
      input.oninput = (e) => {
        if (!this.testFinished) {
          this.userTestAnswers[q.id] = e.target.value;
          this.updatePaletteStyles();
        }
      };
    }

    // If already finished, display explanation
    if (this.testFinished) {
      const userAns = this.userTestAnswers[q.id];
      const isCorrect = this.checkAnswer(q, userAns);

      document.getElementById('expl-status-text').innerHTML = isCorrect ? 
        '<span style="color:#1a7f37; font-weight:700;">✓ Trả lời chính xác</span>' : 
        `<span style="color:#cf222e; font-weight:700;">✕ Bạn chọn: "${userAns || '(Bỏ trống)'}" — Đáp án đúng: "${q.correct_answer}"</span>`;

      document.getElementById('expl-body-text').innerText = q.explanation || 'Không có giải thích chi tiết.';
      document.getElementById('expl-source-tag').innerText = `Nguồn: ${q.source_file || 'Đề thi gốc'} (Trang ${q.source_page || 1})`;
    }
  }

  updatePaletteStyles() {
    this.testQuestions.forEach((q, idx) => {
      const dot = document.getElementById(`palette-dot-${idx}`);
      if (!dot) return;
      dot.className = 'palette-dot';
      if (idx === this.currentTestIndex) dot.classList.add('active');

      const ans = this.userTestAnswers[q.id];
      if (ans !== undefined && ans !== '') {
        dot.classList.add('answered');
      }

      if (this.testFinished) {
        if (this.checkAnswer(q, ans)) {
          dot.classList.add('correct');
        } else {
          dot.classList.add('wrong');
        }
      }
    });
  }

  checkAnswer(q, userAns) {
    if (!userAns || !q || !q.correct_answer) return false;
    const normalize = (s) => (s || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/,([^\s])/g, ', $1')
      .replace(/[,.;?!]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const cleanUser = normalize(userAns);
    const cleanCorrect = normalize(q.correct_answer);
    if (cleanUser === cleanCorrect) return true;

    // Check letter option matching (e.g. 'A' vs 'A. ...')
    const letterMatch = cleanCorrect.match(/^([a-d])(?:[\.)\s]|$)/);
    if (letterMatch && cleanUser === letterMatch[1]) return true;

    if (q.acceptable_variants && Array.isArray(q.acceptable_variants)) {
      return q.acceptable_variants.some(v => normalize(v) === cleanUser);
    }
    return false;
  }

  nextQuestion() {
    if (this.currentTestIndex < this.testQuestions.length - 1) {
      this.goToQuestion(this.currentTestIndex + 1);
    }
  }

  prevQuestion() {
    if (this.currentTestIndex > 0) {
      this.goToQuestion(this.currentTestIndex - 1);
    }
  }

  submitExam() {
    const answeredCount = Object.keys(this.userTestAnswers).length;
    if (answeredCount < this.testQuestions.length) {
      if (!confirm(`Bạn mới trả lời ${answeredCount}/${this.testQuestions.length} câu. Bạn có muốn nộp bài ngay để chấm điểm?`)) {
        return;
      }
    }

    clearInterval(this.testTimerInterval);
    this.testFinished = true;

    let correctCount = 0;
    this.testQuestions.forEach(q => {
      const userAns = this.userTestAnswers[q.id];
      if (this.checkAnswer(q, userAns)) {
        correctCount++;
      } else {
        window.dataStore.saveMistake(q, userAns || '(Bỏ trống)');
      }
    });

    const scorePercent = Math.round((correctCount / this.testQuestions.length) * 100);
    window.dataStore.saveTestResult(window.dataStore.currentUnitId, scorePercent, correctCount, this.testQuestions.length);

    this.renderDashboard();
    this.updatePaletteStyles();

    if (window.smobCloudSync) {
      window.smobCloudSync.autoSyncIfEnabled();
    }

    // Show Result Screen
    document.getElementById('test-runner-shell').style.display = 'none';
    const resScreen = document.getElementById('test-result-screen');
    resScreen.style.display = 'block';

    document.getElementById('res-icon').innerText = scorePercent >= 80 ? '🏆' : (scorePercent >= 50 ? '⭐' : '📖');
    document.getElementById('res-title').innerText = scorePercent >= 80 ? 'Xuất Sắc! Bạn Đã Đạt Mục Tiêu' : 'Hoàn Thành Bài Thi';
    document.getElementById('res-score-percent').innerText = `${scorePercent}%`;
    document.getElementById('res-counts-detail').innerText = `Đúng ${correctCount} / ${this.testQuestions.length} câu • Thời gian: ${Math.floor(this.testTimerSeconds / 60)} phút ${this.testTimerSeconds % 60} giây`;
  }

  reviewCurrentTest() {
    document.getElementById('test-result-screen').style.display = 'none';
    document.getElementById('test-runner-shell').style.display = 'block';
    this.goToQuestion(0);
  }

  exitTest() {
    clearInterval(this.testTimerInterval);
    document.getElementById('test-runner-shell').style.display = 'none';
    document.getElementById('test-result-screen').style.display = 'none';
    document.getElementById('test-config-panel').style.display = 'block';
  }

  retestWrongAnswers(customMistakes = null, customTitle = null) {
    const mistakes = customMistakes || window.dataStore.getFilteredMistakes(
      this.mistakesCategoryFilter || 'all',
      this.mistakesUnitFilter || 'all'
    );
    if (!mistakes || mistakes.length === 0) {
      alert('Không có câu sai nào trong danh mục hoặc Unit đã chọn!');
      return;
    }

    const questions = mistakes.map((m, idx) => ({
      id: `mistake_q_${idx}`,
      stem: m.stem,
      options: [m.correctAnswer, m.userAnswer, "Không có đáp án phù hợp"].sort(() => Math.random() - 0.5),
      correct_answer: m.correctAnswer,
      explanation: m.explanation,
      unitId: m.unitId,
      source_file: "Sổ tay câu sai cá nhân",
      source_page: 1
    }));

    this.navigate('tests');
    const title = customTitle || `Khắc Phục Lỗ Hổng: Ôn Lại ${questions.length} Câu Sai`;
    this.launchExamSession(questions, title);
  }

  // ==========================================
  // AUDIO & LISTENING
  // ==========================================
  renderAudioCatalog() {
    const container = document.getElementById('audio-tracks-grid');
    if (!container) return;
    container.innerHTML = '';

    const units = window.dataStore.units;
    units.filter(u => u.has_audio).forEach(u => {
      const uData = window.dataStore.getUnit(u.unit_number);
      const audioFiles = uData?.source_trace?.audio_files || [];

      const card = document.createElement('div');
      card.className = 'unit-box';
      card.innerHTML = `
        <div class="unit-tag-row">
          <span class="unit-chip">UNIT ${u.unit_number}</span>
          <span class="status-pill status-avail">${audioFiles.length} Tracks MP3</span>
        </div>
        <div class="unit-heading">${u.title}</div>
        <div class="unit-meta-sub">Track: ${audioFiles.slice(0, 3).join(', ')}${audioFiles.length > 3 ? '...' : ''}</div>
        <button class="apple-btn btn-primary" style="margin-top: auto;">Chọn Luyện Nghe</button>
      `;
      card.onclick = () => {
        this.loadUnitAudio(u.unit_number, audioFiles);
      };
      container.appendChild(card);
    });
  }

  loadUnitAudio(unitId, audioFiles) {
    this.selectAudioUnit(unitId);
  }

  selectAudioUnit(unitId) {
    const uid = parseInt(unitId);
    const u = window.dataStore.getUnit(uid);
    if (!u) return;

    // Update select dropdown value
    const audioSelect = document.getElementById('audio-unit-select');
    if (audioSelect && audioSelect.value !== String(uid)) {
      audioSelect.value = String(uid);
    }

    const audioFiles = u.source_trace?.audio_files || [];
    const listContainer = document.getElementById('audio-unit-tracklist');
    if (listContainer) {
      listContainer.innerHTML = '';
      if (audioFiles.length === 0) {
        listContainer.innerHTML = '<div style="font-size: 13px; color: var(--text-tertiary); padding: 8px;">Không có file âm thanh.</div>';
      } else {
        audioFiles.forEach((file, idx) => {
          const btn = document.createElement('div');
          btn.className = `track-btn-item ${idx === 0 ? 'active' : ''}`;
          btn.setAttribute('data-track', file);
          btn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px;">🎵</span>
              <span>${file}</span>
            </div>
            <span style="font-size: 11.5px; opacity: 0.75;">Phát</span>
          `;
          btn.onclick = () => {
            this.loadAudioTrack(uid, file);
          };
          listContainer.appendChild(btn);
        });
      }
    }

    if (audioFiles.length > 0) {
      this.loadAudioTrack(uid, audioFiles[0]);
    }
  }

  loadAudioTrack(unitId, trackName) {
    this.currentAudioTrack = trackName;
    const uid = parseInt(unitId);
    this.currentAudioUnit = uid;
    const u = window.dataStore.getUnit(uid);

    document.getElementById('audio-current-title').innerText = `Unit ${uid}: ${u ? u.title : ''}`;
    document.getElementById('audio-current-unit').innerText = `File âm thanh: ${trackName}`;

    // Update persistent bar labels
    const pTitle = document.getElementById('p-audio-title');
    if (pTitle) pTitle.innerText = `Unit ${uid}: ${trackName}`;
    const pSub = document.getElementById('p-audio-sub');
    if (pSub) pSub.innerText = u ? u.title : 'Đang phát bài nghe nền';

    // Highlight active track item
    document.querySelectorAll('#audio-unit-tracklist .track-btn-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-track') === trackName);
    });

    const audioEl = document.getElementById('html5-audio');
    if (audioEl) {
      audioEl.src = `/audio/${uid}/${encodeURIComponent(trackName)}`;
      audioEl.load();

      const savedTime = parseFloat(localStorage.getItem(`smob_aud_pos_${uid}_${trackName}`) || '0');
      audioEl.onloadedmetadata = () => {
        if (savedTime > 2 && savedTime < audioEl.duration - 3) {
          audioEl.currentTime = savedTime;
        }
      };

      audioEl.ontimeupdate = () => {
        if (audioEl.currentTime > 1 && audioEl.duration) {
          localStorage.setItem(`smob_aud_pos_${uid}_${trackName}`, audioEl.currentTime);
          const percent = (audioEl.currentTime / audioEl.duration) * 100;
          const fill = document.getElementById('p-audio-scrubber-fill');
          if (fill) fill.style.width = `${percent}%`;
          const pTime = document.getElementById('p-audio-time');
          if (pTime) pTime.innerText = `${this.formatTime(audioEl.currentTime)} / ${this.formatTime(audioEl.duration)}`;
        }
      };

      audioEl.play().then(() => {
        this.updateAudioButtons(true);
      }).catch(e => {
        console.log('Audio autoplay handled:', e);
        this.updateAudioButtons(false);
      });

      audioEl.onplay = () => this.updateAudioButtons(true);
      audioEl.onpause = () => this.updateAudioButtons(false);

      const savedAudioSpeed = parseFloat(localStorage.getItem('smob_audio_speed') || '1.0');
      audioEl.playbackRate = savedAudioSpeed;
      this.updateAudioSpeedButtonsUi(savedAudioSpeed);
    }

    this.renderListeningExercises(uid, trackName);
  }

  updateAudioButtons(isPlaying) {
    const toggleBtn = document.getElementById('audio-play-toggle');
    if (toggleBtn) toggleBtn.innerText = isPlaying ? '⏸ Tạm Dừng' : '▶ Phát';
    const pToggle = document.getElementById('p-audio-play-toggle');
    if (pToggle) pToggle.innerText = isPlaying ? '⏸ Tạm Dừng' : '▶ Phát';
  }

  setMainAudioSpeed(speed, btn) {
    const audioEl = document.getElementById('html5-audio');
    const rate = parseFloat(speed);
    if (audioEl) audioEl.playbackRate = rate;
    try {
      localStorage.setItem('smob_audio_speed', String(rate));
    } catch(e) {}
    this.updateAudioSpeedButtonsUi(rate);
    this.showToast(`🎧 Tốc độ phát audio: ${rate}x`);
  }

  updateAudioSpeedButtonsUi(rate) {
    document.querySelectorAll('#audio-speed-group .audio-speed-btn').forEach(btn => {
      const btnSpeed = parseFloat(btn.getAttribute('data-speed'));
      btn.classList.toggle('active', Math.abs(btnSpeed - rate) < 0.01);
    });
  }

  toggleAudioPlay() {
    const audioEl = document.getElementById('html5-audio');
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(e => console.log(e));
    } else {
      audioEl.pause();
    }
  }

  skipAudio(seconds) {
    const audioEl = document.getElementById('html5-audio');
    if (!audioEl || !audioEl.duration) return;
    audioEl.currentTime = Math.max(0, Math.min(audioEl.duration, audioEl.currentTime + seconds));
  }

  replayAudio() {
    const audioEl = document.getElementById('html5-audio');
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(e => console.log(e));
  }

  showPersistentAudioBar() {
    const audioEl = document.getElementById('html5-audio');
    const bar = document.getElementById('persistent-audio-bar');
    if (audioEl && !audioEl.paused && bar) {
      bar.style.display = 'flex';
      this.updateAudioButtons(true);
    }
  }

  hidePersistentAudioBar() {
    const bar = document.getElementById('persistent-audio-bar');
    if (bar) bar.style.display = 'none';
  }

  closePersistentAudioBar() {
    const audioEl = document.getElementById('html5-audio');
    if (audioEl) audioEl.pause();
    this.hidePersistentAudioBar();
  }

  seekPersistentAudio(e) {
    const audioEl = document.getElementById('html5-audio');
    if (!audioEl || !audioEl.duration) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioEl.currentTime = percent * audioEl.duration;
  }

  // ==========================================
  // INTERACTIVE LISTENING QUESTIONS ENGINE (OFFICIAL DATA DRIVEN)
  // ==========================================
  renderListeningExercises(unitId, trackName) {
    const uid = parseInt(unitId);
    const u = window.dataStore.getUnit(uid);
    const listEl = document.getElementById('listening-questions-list');
    const titleEl = document.getElementById('listening-ex-title');
    const instrEl = document.getElementById('listening-instruction');
    const chipEl = document.getElementById('listening-chip');
    const resBox = document.getElementById('listening-result-box');

    if (resBox) resBox.style.display = 'none';
    if (!listEl) return;
    listEl.innerHTML = '';

    chipEl.innerText = `UNIT ${uid} • ${trackName.toUpperCase()}`;

    // Query official unit_test questions matching this audio track
    let matchingQs = [];
    if (u && u.unit_test && u.unit_test.length > 0) {
      const cleanTrack = (trackName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      matchingQs = u.unit_test.filter(q => {
        if (!q.audio_track) return false;
        const qTrack = q.audio_track.toLowerCase().replace(/[^a-z0-9]/g, '');
        return qTrack === cleanTrack;
      });

      // Flexible matching if only one track or prefix matches
      if (matchingQs.length === 0 && u.audio_files && u.audio_files.length === 1) {
        matchingQs = u.unit_test.filter(q => q.audio_track);
      }
    }

    this._currentListeningQuestions = matchingQs;
    this._userListeningAnswers = {};

    const checkBtn = document.getElementById('btn-check-listening');

    if (matchingQs.length === 0) {
      titleEl.innerText = `Luyện Nghe Unit ${uid} - ${trackName}`;
      instrEl.innerText = 'Đoạn audio này dùng để luyện phát âm, nối âm và ngữ điệu trong bài học.';
      listEl.innerHTML = `
        <div style="padding: 28px; text-align: center; color: var(--text-secondary); background: var(--bg-tertiary); border-radius: 12px; border: 1.5px dashed var(--border-subtle);">
          <div style="font-size: 36px; margin-bottom: 8px;">🎧</div>
          <div style="font-weight: 700; font-size: 16px; color: var(--text-primary); margin-bottom: 6px;">Nghe & Luyện Phát Âm (Shadowing)</div>
          <div style="font-size: 13.5px; max-width: 500px; margin: 0 auto; line-height: 1.5;">Hãy bấm phát audio bên trái, chú ý lắng nghe cách nhấn trọng âm và ngữ điệu câu để luyện phản xạ nói tự nhiên.</div>
        </div>
      `;
      if (checkBtn) checkBtn.style.display = 'none';
      return;
    }

    if (checkBtn) checkBtn.style.display = 'inline-flex';

    titleEl.innerText = `Bài Tập Luyện Nghe (${matchingQs.length} Câu)`;
    instrEl.innerText = 'Nghe file audio và chọn hoặc điền đáp án chính xác cho từng câu:';

    const hasSharedPassage = matchingQs.length > 1 && (
      matchingQs.every(q => q.blank_no) ||
      (matchingQs.length > 2 && matchingQs[0].stem && matchingQs[0].stem === matchingQs[1].stem)
    );

    if (hasSharedPassage) {
      // 1. Clean Passage Card with highlighted blanks
      let rawPassage = matchingQs[0].stem || '';
      let formattedPassage = this.escapeHtml(rawPassage);
      matchingQs.forEach((q, idx) => {
        const bNo = q.blank_no || (idx + 1);
        const blankRegex = new RegExp(`\\((${bNo})\\)\\s*_{2,}|\\((${bNo})\\)\\s*\\.{2,}|\\((${bNo})\\)`, 'g');
        formattedPassage = formattedPassage.replace(blankRegex, `<span class="passage-blank-marker">(${bNo}) [ _____ ]</span>`);
      });
      formattedPassage = formattedPassage.replace(/_{2,}/g, `<span class="passage-blank-marker">[ _____ ]</span>`);

      const passageCard = document.createElement('div');
      passageCard.className = 'listening-passage-box';
      passageCard.innerHTML = `
        <div class="passage-header-row">
          <span style="font-weight: 800; font-size: 14.5px; color: var(--accent);">📄 Đoạn Văn Nghe Điền Từ (${matchingQs.length} Chỗ Trống):</span>
          <span style="font-size: 12px; color: var(--text-secondary);">Nghe đoạn băng và điền từ thích hợp vào các ô tương ứng bên dưới</span>
        </div>
        <div class="passage-text-content">${formattedPassage}</div>
      `;
      listEl.appendChild(passageCard);

      // 2. Simple clean fill-in-blank list (No heavy cards)
      const inputsContainer = document.createElement('div');
      inputsContainer.className = 'simple-fill-list';

      matchingQs.forEach((q, qIdx) => {
        const bNo = q.blank_no || (qIdx + 1);
        const row = document.createElement('div');
        row.className = 'simple-fill-row';
        row.id = `lq-card-${qIdx}`;

        row.innerHTML = `
          <span class="simple-fill-label">(${bNo})</span>
          <input type="text" class="simple-fill-input" id="lq-input-${qIdx}"
            placeholder="..."
            oninput="window.smobApp.setListeningInputAnswer(${qIdx}, this.value)">
          <span id="lq-badge-${qIdx}" class="simple-fill-badge"></span>
          <div class="simple-fill-fb" id="lq-fb-${qIdx}"></div>
        `;
        inputsContainer.appendChild(row);
      });
      listEl.appendChild(inputsContainer);
    } else {
      // Standard individual items - Clean & Minimal
      const cleanList = document.createElement('div');
      cleanList.className = 'simple-fill-list';

      matchingQs.forEach((q, qIdx) => {
        const qType = q.type || 'MULTIPLE_CHOICE';

        if (qType === 'FILL_IN_BLANK' || !q.options || q.options.length < 2) {
          const row = document.createElement('div');
          row.className = 'simple-fill-row';
          row.id = `lq-card-${qIdx}`;
          const cleanStem = q.stem.replace(/_{2,}|\.{3,}/g, '').trim();

          row.innerHTML = `
            <span class="simple-fill-label">${qIdx + 1}.</span>
            <span style="font-size: 14px; font-weight: 500; color: var(--text-primary); margin-right: 6px;">${this.escapeHtml(cleanStem)}</span>
            <input type="text" class="simple-fill-input" id="lq-input-${qIdx}"
              placeholder="..."
              oninput="window.smobApp.setListeningInputAnswer(${qIdx}, this.value)">
            <span id="lq-badge-${qIdx}" class="simple-fill-badge"></span>
            <div class="simple-fill-fb" id="lq-fb-${qIdx}"></div>
          `;
          cleanList.appendChild(row);
        } else {
          const card = document.createElement('div');
          card.className = 'listening-q-card';
          card.id = `lq-card-${qIdx}`;

          let optsHtml = '';
          q.options.forEach((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            const cleanOptText = opt.replace(/^[A-D]\.\s*/i, '');
            const optValue = `${letter}. ${cleanOptText}`;

            optsHtml += `
              <label class="listening-option-label" onclick="window.smobApp.selectListeningOption(${qIdx}, '${optValue.replace(/'/g, "\\'")}', this)">
                <input type="radio" name="lq_group_${qIdx}" value="${letter}" style="accent-color: var(--accent); margin-right: 6px;">
                <span style="font-weight: 700; color: var(--accent); min-width: 22px;">${letter}.</span>
                <span style="flex: 1; font-weight: 500;">${this.escapeHtml(cleanOptText)}</span>
              </label>
            `;
          });

          card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div style="font-weight: 700; font-size: 15px; color: var(--text-primary); line-height: 1.5;">${qIdx + 1}. ${this.escapeHtml(q.stem)}</div>
              <span id="lq-badge-${qIdx}" style="font-size: 12px; font-weight: 700;"></span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">${optsHtml}</div>
            <div class="simple-fill-fb" id="lq-fb-${qIdx}"></div>
          `;
          cleanList.appendChild(card);
        }
      });
      listEl.appendChild(cleanList);
    }
  }

  setListeningInputAnswer(qIdx, val) {
    this._userListeningAnswers = this._userListeningAnswers || {};
    this._userListeningAnswers[qIdx] = (val || '').trim();
  }

  selectListeningOption(qIdx, optionText, labelElement) {
    this._userListeningAnswers = this._userListeningAnswers || {};
    this._userListeningAnswers[qIdx] = optionText;

    const card = document.getElementById(`lq-card-${qIdx}`);
    if (card) {
      card.querySelectorAll('.listening-option-label').forEach(lbl => lbl.classList.remove('selected'));
      labelElement.classList.add('selected');
      const radio = labelElement.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  }

  checkListeningAnswers() {
    const questions = this._currentListeningQuestions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q, qIdx) => {
      const userAns = (this._userListeningAnswers || {})[qIdx] || '';
      const card = document.getElementById(`lq-card-${qIdx}`);
      const fb = document.getElementById(`lq-fb-${qIdx}`);
      const badge = document.getElementById(`lq-badge-${qIdx}`);
      const correctAns = (q.correct_answer || q.answer || '').trim();
      const qType = q.type || 'MULTIPLE_CHOICE';

      let isRight = false;
      if (qType === 'FILL_IN_BLANK' || !q.options || q.options.length < 2) {
        const cleanUser = userAns.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCorrect = correctAns.toLowerCase().replace(/[^a-z0-9]/g, '');
        isRight = cleanUser.length > 0 && (cleanUser === cleanCorrect || cleanCorrect.includes(cleanUser));
      } else {
        const userLetter = userAns.trim().charAt(0).toUpperCase();
        const correctLetter = correctAns.trim().charAt(0).toUpperCase();
        const cleanCorrectText = correctAns.replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();
        const cleanUserText = userAns.replace(/^[A-D]\.\s*/i, '').trim().toLowerCase();

        isRight = (userLetter && userLetter === correctLetter) || (cleanUserText && cleanUserText === cleanCorrectText);
      }

      if (card) {
        card.classList.remove('is-correct', 'is-wrong');
        if (isRight) {
          correctCount++;
          card.classList.add('is-correct');
          if (badge) {
            badge.style.color = '#10b981';
            badge.innerText = '✓ Đúng';
          }
          if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(16, 185, 129, 0.08)';
            fb.style.border = '1px solid #10b981';
            fb.style.color = '#065f46';
            fb.innerHTML = `<strong>✓ Chính xác!</strong> Đáp án: <strong>${this.escapeHtml(correctAns)}</strong>${q.explanation ? `<div style="margin-top: 4px; font-size: 12.5px; color: var(--text-secondary);">${this.escapeHtml(q.explanation)}</div>` : ''}`;
          }
        } else {
          card.classList.add('is-wrong');
          if (badge) {
            badge.style.color = '#ef4444';
            badge.innerText = '✗ Sai';
          }
          if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(239, 68, 68, 0.06)';
            fb.style.border = '1px solid #f87171';
            fb.style.color = '#991b1b';
            fb.innerHTML = `<strong>✗ Đáp án đúng:</strong> <strong style="color: var(--text-primary);">${this.escapeHtml(correctAns)}</strong>${q.explanation ? `<div style="margin-top: 4px; font-size: 12.5px; color: var(--text-secondary);">${this.escapeHtml(q.explanation)}</div>` : ''}`;
          }
        }
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    const resBox = document.getElementById('listening-result-box');
    const scoreEl = document.getElementById('listening-result-score');
    const descEl = document.getElementById('listening-result-desc');

    if (resBox && scoreEl && descEl) {
      resBox.style.display = 'block';
      scoreEl.innerText = `Kết quả: ${correctCount} / ${questions.length} câu đúng (${percent}%)`;
      if (percent === 100) {
        scoreEl.style.color = '#1a7f37';
        resBox.style.background = '#eef8f1';
        resBox.style.borderColor = '#bce2c7';
        descEl.innerText = '🌟 Xuất sắc! Bạn đã nghe bắt chuẩn 100% các từ khóa và nội dung bài nghe.';
      } else if (percent >= 50) {
        scoreEl.style.color = '#0284c7';
        resBox.style.background = '#e0f2fe';
        resBox.style.borderColor = '#bae6fd';
        descEl.innerText = '👍 Khá tốt! Hãy bấm "Phát Lại" nghe thêm một lần để củng cố các câu còn chưa rõ nhé.';
      } else {
        scoreEl.style.color = '#b91c1c';
        resBox.style.background = '#fee2e2';
        resBox.style.borderColor = '#fecaca';
        descEl.innerText = '⚡ Cố lên! Hãy bấm "Phát Lại" hoặc nghe chậm hơn để nhận diện rõ từng âm tiết.';
      }
    }
  }

  // ==========================================
  // COMPREHENSIVE FULL MOCK TEST (4 SKILLS)
  // ==========================================
  initComprehensiveTestView() {
    const sel = document.getElementById('comp-unit-select');
    if (sel && sel.children.length === 0) {
      window.dataStore.units.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.unit_number;
        opt.innerText = `Unit ${u.unit_number}: ${u.title}`;
        sel.appendChild(opt);
      });
      sel.value = window.dataStore.currentUnitId || 1;
    }

    const cbContainer = document.getElementById('comp-units-checkboxes-container');
    if (cbContainer && cbContainer.children.length === 0) {
      window.dataStore.units.forEach(u => {
        const label = document.createElement('label');
        label.className = 'unit-check-label';
        label.innerHTML = `
          <input type="checkbox" class="comp-unit-cb" value="${u.unit_number}" ${u.unit_number === 1 ? 'checked' : ''} onchange="window.smobApp.updateCompSelectedSummary()">
          <span>Unit ${u.unit_number < 10 ? '0' + u.unit_number : u.unit_number}</span>
        `;
        cbContainer.appendChild(label);
      });
      this.updateCompSelectedSummary();
    }
  }

  setCompTestMode(mode) {
    this.compTestMode = mode;
    document.getElementById('btn-comp-mode-single').classList.toggle('active', mode === 'single');
    document.getElementById('btn-comp-mode-multi').classList.toggle('active', mode === 'multi');
    document.getElementById('comp-single-unit-box').style.display = mode === 'single' ? 'flex' : 'none';
    document.getElementById('comp-multi-units-box').style.display = mode === 'multi' ? 'block' : 'none';
  }

  selectAllCompUnits(selectAll) {
    document.querySelectorAll('.comp-unit-cb').forEach(cb => {
      cb.checked = selectAll;
    });
    this.updateCompSelectedSummary();
  }

  updateCompSelectedSummary() {
    const selected = Array.from(document.querySelectorAll('.comp-unit-cb:checked')).map(cb => parseInt(cb.value));
    const summary = document.getElementById('comp-selected-summary');
    if (summary) {
      summary.innerText = `Đã chọn: ${selected.length} Units (Unit ${selected.slice(0, 5).join(', ')}${selected.length > 5 ? '...' : ''})`;
    }
  }

  setCompQuestionCount(count, btn) {
    this.compQuestionCount = count;
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  startComprehensiveExam() {
    let targetUnits = [];
    if (this.compTestMode === 'single') {
      const uVal = parseInt(document.getElementById('comp-unit-select').value) || 1;
      targetUnits = [uVal];
    } else {
      targetUnits = Array.from(document.querySelectorAll('.comp-unit-cb:checked')).map(cb => parseInt(cb.value));
      if (targetUnits.length === 0) {
        alert('Vui lòng tích chọn ít nhất 1 Unit để làm đề thi!');
        return;
      }
    }

    const timeLimitMin = parseInt(document.getElementById('comp-time-select').value) || 0;
    this.compTimeLimit = timeLimitMin * 60;

    let vocabQs = [];
    let grammarQs = [];
    let listeningQs = [];
    let readingQs = [];

    targetUnits.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      if (!u) return;

      // 1. Vocab pool
      if (u.vocabulary && u.vocabulary.length > 0) {
        u.vocabulary.forEach(v => {
          const distractors = u.vocabulary.filter(o => o.id !== v.id).map(o => o.meaning).sort(() => Math.random() - 0.5).slice(0, 3);
          const opts = [v.meaning, ...distractors].sort(() => Math.random() - 0.5);
          vocabQs.push({
            id: `comp_v_${v.id}`,
            skill: 'vocab',
            skillTitle: 'Phần 1: Từ Vựng & Nghĩa',
            badgeClass: 'skill-badge-vocab',
            stem: `Chọn nghĩa tiếng Việt chính xác của từ: "${v.word.toUpperCase()}" (${v.ipa || ''})`,
            options: opts,
            correct_answer: v.meaning,
            explanation: `Từ vựng: "${v.word}" (${v.pos || 'từ'}) nghĩa là "${v.meaning}". Ví dụ: "${v.example || ''}"`
          });
        });
      }

      // 2. Grammar & 4. Reading from unit_test
      if (u.unit_test && u.unit_test.length > 0) {
        u.unit_test.forEach((q, qIdx) => {
          const item = {
            id: q.id || `comp_g_${uid}_${qIdx}`,
            skill: qIdx >= 10 ? 'reading' : 'grammar',
            skillTitle: qIdx >= 10 ? 'Phần 4: Đọc Hiểu & Điền Khuyết' : 'Phần 2: Bài Tập Ngữ Pháp',
            badgeClass: qIdx >= 10 ? 'skill-badge-reading' : 'skill-badge-grammar',
            stem: q.stem || q.question || 'Chọn đáp án chính xác:',
            options: q.options && q.options.length >= 2 ? q.options : ['A. True', 'B. False'],
            correct_answer: q.correct_answer || q.answer || (q.options ? q.options[0] : 'A'),
            explanation: q.explanation || `Đáp án chính xác theo giáo trình Unit ${uid}.`
          };
          if (qIdx >= 10) readingQs.push(item);
          else grammarQs.push(item);
        });
      }
    });

    // 3. Listening questions from course listening bank
    const listeningBank = [
      { stem: 'Nghe đoạn băng và chọn tên tháng chính xác được nhắc tới:', options: ['A. May', 'B. March', 'C. April', 'D. August'], correct_answer: 'A. May', track: 'mp31.mp3', unit: 32, explanation: 'Trong audio phát âm rõ: /meɪ/ (May).' },
      { stem: 'Nghe ngày tháng và chọn mốc thời gian được nói:', options: ['A. 20th', 'B. 21st', 'C. 22nd', 'D. 23rd'], correct_answer: 'B. 21st', track: 'mp32.mp3', unit: 32, explanation: 'Phát âm thứ tự ngày: twenty-first (21st).' },
      { stem: 'Nghe năm được phát âm trong câu:', options: ['A. 1990 (Nineteen ninety)', 'B. 1999 (Nineteen ninety-nine)', 'C. 2000', 'D. 1989'], correct_answer: 'B. 1999 (Nineteen ninety-nine)', track: 'mp33.mp3', unit: 32, explanation: 'Phát âm năm: nineteen ninety-nine (1999).' },
      { stem: 'What time is it? (Nghe đoạn audio và chọn giờ đúng):', options: ['A. 7:15 (A quarter past seven)', 'B. 7:45 (A quarter to eight)', 'C. 7:30', 'D. 8:00'], correct_answer: 'A. 7:15 (A quarter past seven)', track: 'mp31.mp3', unit: 31, explanation: 'Giờ được nhắc: a quarter past seven (7 giờ 15).' },
      { stem: 'Where is the post office? (Nghe vị trí địa điểm):', options: ['A. Next to the bank', 'B. Opposite the supermarket', 'C. Behind the school', 'D. Near the park'], correct_answer: 'A. Next to the bank', track: '1.mp3', unit: 33, explanation: 'Vị trí bưu điện: next to the bank (cạnh ngân hàng).' }
    ];

    listeningQs = listeningBank.map((lq, idx) => ({
      id: `comp_l_${idx}`,
      skill: 'listening',
      skillTitle: 'Phần 3: Luyện Nghe Audio',
      badgeClass: 'skill-badge-listening',
      audioUnit: lq.unit,
      audioTrack: lq.track,
      stem: lq.stem,
      options: lq.options,
      correct_answer: lq.correct_answer,
      explanation: lq.explanation
    }));

    // Assemble balanced exam
    vocabQs.sort(() => Math.random() - 0.5);
    grammarQs.sort(() => Math.random() - 0.5);
    listeningQs.sort(() => Math.random() - 0.5);
    readingQs.sort(() => Math.random() - 0.5);

    const totalTarget = this.compQuestionCount;
    const perSkill = Math.max(2, Math.floor(totalTarget / 4));

    const examQuestions = [
      ...vocabQs.slice(0, perSkill),
      ...grammarQs.slice(0, perSkill),
      ...listeningQs.slice(0, Math.min(listeningQs.length, perSkill)),
      ...readingQs.slice(0, totalTarget - (perSkill * 2 + Math.min(listeningQs.length, perSkill)))
    ];

    if (examQuestions.length < 5) {
      alert('Không đủ dữ liệu câu hỏi để tạo đề thi toàn diện.');
      return;
    }

    this.compTestQuestions = examQuestions;
    this.currentCompIndex = 0;
    this.userCompAnswers = {};
    this.compFinished = false;

    // Start Timer
    this.compTimerSeconds = 0;
    clearInterval(this.compTimerInterval);
    const timerEl = document.getElementById('comp-test-timer');
    if (this.compTimeLimit > 0) {
      let remain = this.compTimeLimit;
      this.compTimerInterval = setInterval(() => {
        remain--;
        if (remain <= 0) {
          clearInterval(this.compTimerInterval);
          alert('Hết giờ làm bài! Hệ thống tự động nộp bài để chấm điểm.');
          this.submitCompTest();
          return;
        }
        const m = Math.floor(remain / 60);
        const s = remain % 60;
        if (timerEl) timerEl.innerText = `⏱️ ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
      }, 1000);
    } else {
      let elapsed = 0;
      this.compTimerInterval = setInterval(() => {
        elapsed++;
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        if (timerEl) timerEl.innerText = `⏱️ ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
      }, 1000);
    }

    document.getElementById('comp-config-panel').style.display = 'none';
    document.getElementById('comp-test-result-screen').style.display = 'none';
    document.getElementById('comp-test-runner-shell').style.display = 'block';

    this.renderCompPalette();
    this.goToCompQuestion(0);
  }

  renderCompPalette() {
    const palette = document.getElementById('comp-question-palette');
    if (!palette) return;
    palette.innerHTML = '';

    this.compTestQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.id = `comp-pal-${idx}`;
      btn.innerText = idx + 1;
      btn.onclick = () => this.goToCompQuestion(idx);
      palette.appendChild(btn);
    });
    this.updateCompPalette();
  }

  updateCompPalette() {
    this.compTestQuestions.forEach((q, idx) => {
      const btn = document.getElementById(`comp-pal-${idx}`);
      if (!btn) return;
      const isCurrent = idx === this.currentCompIndex;
      const isAnswered = this.userCompAnswers[q.id] !== undefined;

      btn.className = 'palette-btn';
      if (isCurrent) btn.classList.add('current');
      if (isAnswered) btn.classList.add('answered');

      if (this.compFinished) {
        const userAns = this.userCompAnswers[q.id];
        const isRight = this.checkAnswer(q, userAns);
        btn.classList.add(isRight ? 'correct' : 'wrong');
      }
    });
  }

  goToCompQuestion(idx) {
    if (idx < 0 || idx >= this.compTestQuestions.length) return;
    this.currentCompIndex = idx;
    this.renderCurrentCompQuestion();
    this.updateCompPalette();
  }

  renderCurrentCompQuestion() {
    const q = this.compTestQuestions[this.currentCompIndex];
    if (!q) return;

    document.getElementById('comp-runner-progress').innerText = `Câu hỏi ${this.currentCompIndex + 1} / ${this.compTestQuestions.length}`;
    
    // Skill badge
    const badge = document.getElementById('comp-part-badge');
    badge.className = `exam-part-label ${q.badgeClass || ''}`;
    badge.innerText = q.skillTitle || 'Phần thi';

    // Explicit Requirement Prompt for Beginners
    const req = this.getQuestionRequirement(q, q.skillTitle);
    const reqEl = document.getElementById('comp-test-requirement');
    if (reqEl) {
      reqEl.innerHTML = `<span class="q-req-icon">📌</span><span>Yêu cầu: ${req}</span>`;
      reqEl.style.display = 'inline-flex';
    }

    // Stem with Blank Highlight
    const formattedStem = (q.stem || '').replace(/_{2,}/g, '<span class="q-blank-highlight">[ _____ ]</span>');
    document.getElementById('comp-test-stem').innerHTML = formattedStem;

    // Listening inline audio box
    const audioBox = document.getElementById('comp-listening-audio-box');
    const inlineAudio = document.getElementById('comp-inline-audio');
    if (q.skill === 'listening' && q.audioUnit && q.audioTrack) {
      audioBox.style.display = 'flex';
      inlineAudio.src = `/audio/${q.audioUnit}/${encodeURIComponent(q.audioTrack)}`;
      inlineAudio.load();
      document.getElementById('comp-audio-title').innerText = `Track: Unit ${q.audioUnit} (${q.audioTrack})`;
      document.getElementById('comp-audio-play-btn').innerText = '▶ Nghe Đoạn Băng';
    } else {
      audioBox.style.display = 'none';
      if (inlineAudio) inlineAudio.pause();
    }

    // Answers Grid
    const optsContainer = document.getElementById('comp-options-container');
    const inputContainer = document.getElementById('comp-input-container');
    optsContainer.innerHTML = '';
    inputContainer.style.display = 'none';

    const curAnswer = this.userCompAnswers[q.id];

    q.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'ans-pill';
      btn.innerText = opt;
      if (curAnswer === opt) btn.classList.add('selected');

      if (this.compFinished) {
        btn.disabled = true;
        const isRight = opt.trim().toLowerCase() === q.correct_answer.trim().toLowerCase() || opt.trim().startsWith(q.correct_answer.trim());
        if (isRight) btn.classList.add('is-correct');
        else if (curAnswer === opt) btn.classList.add('is-wrong');
      } else {
        btn.onclick = () => this.setCompOptionAnswer(this.currentCompIndex, opt, btn);
      }
      optsContainer.appendChild(btn);
    });

    // Explanation callout
    const explBox = document.getElementById('comp-explanation-callout');
    if (this.compFinished) {
      explBox.style.display = 'block';
      const userAns = this.userCompAnswers[q.id] || '(Bỏ trống)';
      const isRight = this.checkAnswer(q, userAns);
      document.getElementById('comp-expl-status').innerHTML = isRight
        ? `<strong style="color: #1a7f37;">✓ Chính xác!</strong> Bạn chọn: <strong>${userAns}</strong>`
        : `<strong style="color: #cf222e;">✗ Chưa chính xác!</strong> Bạn chọn: <strong>${userAns}</strong> • Đáp án đúng: <strong>${q.correct_answer}</strong>`;
      document.getElementById('comp-expl-body').innerText = q.explanation || '';
    } else {
      explBox.style.display = 'none';
    }
  }

  toggleCompQuestionAudio() {
    const inlineAudio = document.getElementById('comp-inline-audio');
    const playBtn = document.getElementById('comp-audio-play-btn');
    if (!inlineAudio) return;
    if (inlineAudio.paused) {
      inlineAudio.play().then(() => {
        if (playBtn) playBtn.innerText = '⏸ Tạm Dừng Audio';
      }).catch(e => console.log(e));
      inlineAudio.onended = () => {
        if (playBtn) playBtn.innerText = '↺ Nghe Lại Đoạn Băng';
      };
    } else {
      inlineAudio.pause();
      if (playBtn) playBtn.innerText = '▶ Tiếp Tục Nghe';
    }
  }

  setCompOptionAnswer(qIdx, opt, btn) {
    const q = this.compTestQuestions[qIdx];
    if (!q || this.compFinished) return;
    this.userCompAnswers[q.id] = opt;

    const parent = btn.parentElement;
    parent.querySelectorAll('.ans-pill').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.updateCompPalette();
  }

  setCompInputAnswer(val) {
    const q = this.compTestQuestions[this.currentCompIndex];
    if (!q || this.compFinished) return;
    if (val.trim()) this.userCompAnswers[q.id] = val.trim();
    else delete this.userCompAnswers[q.id];
    this.updateCompPalette();
  }

  nextCompQuestion() {
    if (this.currentCompIndex < this.compTestQuestions.length - 1) {
      this.goToCompQuestion(this.currentCompIndex + 1);
    }
  }

  prevCompQuestion() {
    if (this.currentCompIndex > 0) {
      this.goToCompQuestion(this.currentCompIndex - 1);
    }
  }

  submitCompTest() {
    const total = this.compTestQuestions.length;
    const missing = [];
    this.compTestQuestions.forEach((q, idx) => {
      if (!this.userCompAnswers[q.id]) {
        missing.push({ id: q.id, num: idx + 1, q: q, idx: idx });
      }
    });

    if (missing.length > 0) {
      missing.forEach(m => {
        const pal = document.getElementById(`comp-pal-${m.idx}`);
        if (pal) pal.classList.add('unanswered-alert');
      });

      this.showUnansweredConfirmModal({
        testType: 'comp_test',
        title: 'Chưa Hoàn Thành Bài Kiểm Tra Toàn Diện!',
        total: total,
        answered: total - missing.length,
        missingList: missing,
        onConfirmSubmit: () => this._doSubmitCompTest(),
        onJump: (qId) => {
          const m = missing.find(x => x.id === qId);
          if (m) this.goToCompQuestion(m.idx);
        }
      });
      return;
    }

    this._doSubmitCompTest();
  }

  _doSubmitCompTest() {
    this.closeUnansweredModal();
    clearInterval(this.compTimerInterval);
    this.compFinished = true;

    // Tally skills score
    const skillStats = {
      vocab: { total: 0, correct: 0 },
      grammar: { total: 0, correct: 0 },
      listening: { total: 0, correct: 0 },
      reading: { total: 0, correct: 0 }
    };

    let totalCorrect = 0;
    this.compTestQuestions.forEach(q => {
      const sk = q.skill || 'grammar';
      if (!skillStats[sk]) skillStats[sk] = { total: 0, correct: 0 };
      skillStats[sk].total++;

      const userAns = this.userCompAnswers[q.id];
      const isRight = this.checkAnswer(q, userAns);
      if (isRight) {
        totalCorrect++;
        skillStats[sk].correct++;
      } else {
        window.dataStore.saveMistake(q, userAns || '(Bỏ trống)');
      }
    });

    const percent = Math.round((totalCorrect / this.compTestQuestions.length) * 100);

    // Update Skill bars
    const updateBar = (sk, textId, barId) => {
      const stat = skillStats[sk] || { total: 1, correct: 0 };
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      const textEl = document.getElementById(textId);
      const barEl = document.getElementById(barId);
      if (textEl) textEl.innerText = `${stat.correct} / ${stat.total} (${pct}%)`;
      if (barEl) barEl.style.width = `${pct}%`;
    };

    updateBar('vocab', 'comp-skill-vocab', 'comp-bar-vocab');
    updateBar('grammar', 'comp-skill-grammar', 'comp-bar-grammar');
    updateBar('listening', 'comp-skill-listening', 'comp-bar-listening');
    updateBar('reading', 'comp-skill-reading', 'comp-bar-reading');

    document.getElementById('comp-res-score-percent').innerText = `${percent}%`;
    document.getElementById('comp-res-counts-detail').innerText = `Đúng ${totalCorrect} / ${this.compTestQuestions.length} câu • Điểm số toàn diện đạt ${percent}%`;
    document.getElementById('comp-res-icon').innerText = percent >= 80 ? '🏆' : (percent >= 50 ? '⭐' : '📖');

    document.getElementById('comp-test-runner-shell').style.display = 'none';
    document.getElementById('comp-test-result-screen').style.display = 'block';
  }

  reviewCompTest() {
    document.getElementById('comp-test-result-screen').style.display = 'none';
    document.getElementById('comp-test-runner-shell').style.display = 'block';
    this.goToCompQuestion(0);
  }

  exitCompTest() {
    clearInterval(this.compTimerInterval);
    const inlineAudio = document.getElementById('comp-inline-audio');
    if (inlineAudio) inlineAudio.pause();
    document.getElementById('comp-test-runner-shell').style.display = 'none';
    document.getElementById('comp-test-result-screen').style.display = 'none';
    document.getElementById('comp-config-panel').style.display = 'block';
  }

  // ==========================================
  // MISTAKES NOTEBOOK
  // ==========================================
  setMistakesCategory(cat, btn) {
    this.mistakesCategoryFilter = cat;
    document.querySelectorAll('#view-mistakes .filter-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderMistakes();
  }

  setMistakesUnitFilter(unitVal) {
    this.mistakesUnitFilter = unitVal;
    this.renderMistakes();
  }

  renderMistakes() {
    const container = document.getElementById('mistakes-container');
    if (!container) return;

    const stats = window.dataStore.getMistakeStats();

    // Update count badges in header filter
    const cntAll = document.getElementById('mistake-count-all');
    const cntVocab = document.getElementById('mistake-count-vocab');
    const cntGrammar = document.getElementById('mistake-count-grammar');
    const cntTest = document.getElementById('mistake-count-test');
    if (cntAll) cntAll.innerText = stats.total;
    if (cntVocab) cntVocab.innerText = stats.vocab_quizlet;
    if (cntGrammar) cntGrammar.innerText = stats.grammar_theory;
    if (cntTest) cntTest.innerText = stats.test_unit;

    // Populate unit selector with units that have mistakes
    const unitSelect = document.getElementById('mistakes-unit-select');
    if (unitSelect) {
      const curSelected = this.mistakesUnitFilter || 'all';
      unitSelect.innerHTML = '<option value="all">🌟 Tất Cả Các Unit Có Câu Sai</option>';
      stats.unitsWithMistakes.forEach(uid => {
        const u = window.dataStore.getUnit(uid);
        const opt = document.createElement('option');
        opt.value = String(uid);
        opt.innerText = `Unit ${uid}: ${u ? u.title : ''}`;
        if (String(uid) === String(curSelected)) opt.selected = true;
        unitSelect.appendChild(opt);
      });
    }

    const filteredMistakes = window.dataStore.getFilteredMistakes(
      this.mistakesCategoryFilter || 'all',
      this.mistakesUnitFilter || 'all'
    );

    if (filteredMistakes.length === 0) {
      let emptyMsg = 'Chưa có câu hỏi nào bị ghi nhận sai!';
      if (this.mistakesCategoryFilter === 'vocab_quizlet') {
        emptyMsg = 'Không có câu sai nào trong danh mục Quizlet Từ Vựng!';
      } else if (this.mistakesCategoryFilter === 'grammar_theory') {
        emptyMsg = 'Không có câu sai nào trong danh mục Lý Thuyết / Ngữ Pháp!';
      } else if (this.mistakesCategoryFilter === 'test_unit') {
        emptyMsg = 'Không có câu sai nào trong danh mục Đề Thi Online 48 Units!';
      }

      container.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; color: var(--text-secondary);">
          <div style="font-size: 44px; margin-bottom: 12px;">🌟</div>
          <div style="font-size: 19px; font-weight: 700; color: var(--text-primary);">Sổ tay câu sai trống</div>
          <div style="font-size: 13.5px; margin-top: 6px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.5;">${emptyMsg} Hãy tiếp tục luyện tập và duy trì phong độ xuất sắc nhé!</div>
        </div>
      `;
      return;
    }

    // Group mistakes by unitId
    const grouped = {};
    filteredMistakes.forEach(m => {
      const uid = m.unitId || 1;
      if (!grouped[uid]) grouped[uid] = [];
      grouped[uid].push(m);
    });

    const sortedUnitIds = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    container.innerHTML = '';

    sortedUnitIds.forEach(uid => {
      const u = window.dataStore.getUnit(uid);
      const items = grouped[uid];

      const groupEl = document.createElement('div');
      groupEl.className = 'mistake-unit-group';

      // Group Header
      const headerEl = document.createElement('div');
      headerEl.className = 'mistake-unit-group-header';
      headerEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span class="mistake-unit-badge-pill">UNIT ${uid}</span>
          <span style="font-size: 15px; font-weight: 800; color: var(--text-primary);">${u ? u.title.toUpperCase() : `BÀI HỌC UNIT ${uid}`}</span>
          <span style="font-size: 12.5px; color: var(--text-secondary); font-weight: 600;">(${items.length} câu sai cần ôn)</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="apple-btn btn-primary" style="padding: 5px 12px; font-size: 12px; font-weight: 700;"
            onclick="window.smobApp.retestUnitMistakes(${uid})">⚡ Luyện Lại Riêng Unit ${uid}</button>
          <button class="apple-btn btn-secondary" style="padding: 5px 10px; font-size: 12px;"
            onclick="window.smobApp.openGrammarUnit(${uid})" title="Mở giáo trình bài này">📖 Đọc Sách</button>
        </div>
      `;
      groupEl.appendChild(headerEl);

      // Cards Container
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'mistake-unit-cards-container';

      items.forEach(m => {
        let catBadge = '';
        if (m.category === 'vocab_quizlet') {
          catBadge = '<span class="mistake-cat-pill cat-pill-vocab">📝 Quizlet Từ Vựng</span>';
        } else if (m.category === 'grammar_theory') {
          catBadge = '<span class="mistake-cat-pill cat-pill-grammar">📖 Lý Thuyết / Ngữ Pháp</span>';
        } else {
          catBadge = '<span class="mistake-cat-pill cat-pill-test">📄 Đề Thi Online</span>';
        }

        const card = document.createElement('div');
        card.className = 'apple-card';
        card.style.margin = '0';
        card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${catBadge}
              <span style="font-size: 12px; color: var(--danger); font-weight: 700;">Đã làm sai ${m.wrongCount || 1} lần</span>
            </div>
            <button class="ctrl-btn" style="padding: 2px 8px; font-size: 11px; color: var(--text-tertiary);"
              onclick="window.smobApp.removeSingleMistake('${m.exerciseId}')" title="Đã nắm vững, xóa câu này khỏi danh sách">✓ Đã Thuộc / Xóa</button>
          </div>
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--text-primary); line-height: 1.45;">${m.stem}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; font-size: 13.5px;">
            <div style="background: var(--danger-bg); padding: 10px 14px; border-radius: var(--radius-xs); color: #cf222e; border: 1px solid rgba(239, 68, 68, 0.2);">
              <strong style="display:block; font-size: 11.5px; text-transform: uppercase; margin-bottom: 2px; opacity: 0.8;">Bạn chọn:</strong> ${m.userAnswer || '(Chưa làm)'}
            </div>
            <div style="background: var(--success-bg); padding: 10px 14px; border-radius: var(--radius-xs); color: #1a7f37; border: 1px solid rgba(34, 197, 94, 0.2);">
              <strong style="display:block; font-size: 11.5px; text-transform: uppercase; margin-bottom: 2px; opacity: 0.8;">Đáp án đúng:</strong> ${m.correctAnswer}
            </div>
          </div>
          ${m.explanation ? `
            <div style="font-size: 13px; line-height: 1.55; color: var(--text-secondary); background: #f8f9fb; padding: 12px 14px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary);">💡 Giải thích chi tiết:</strong> ${m.explanation}
            </div>
          ` : ''}
        `;
        cardsContainer.appendChild(card);
      });

      groupEl.appendChild(cardsContainer);
      container.appendChild(groupEl);
    });
  }

  retestUnitMistakes(unitId) {
    const mistakes = window.dataStore.mistakes.filter(m => Number(m.unitId) === Number(unitId));
    if (!mistakes || mistakes.length === 0) {
      this.showToast(`Unit ${unitId} không có câu sai nào!`);
      return;
    }
    this.retestWrongAnswers(mistakes, `Luyện Lại ${mistakes.length} Câu Sai Unit ${unitId}`);
  }

  removeSingleMistake(exerciseId) {
    window.dataStore.mistakes = window.dataStore.mistakes.filter(m => m.exerciseId !== exerciseId);
    localStorage.setItem('smob_mistakes_log', JSON.stringify(window.dataStore.mistakes));
    this.renderMistakes();
    this.showToast('✓ Đã xóa câu hỏi khỏi sổ tay câu sai.');
  }

  // ==========================================
  // SETTINGS
  // ==========================================
  setSpeechRate(rate, btn) {
    this.speechRate = rate;
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }

  // ==========================================
  // OFFICIAL PDF ONLINE EXAM ENGINE
  // ==========================================
  switchTestUnitOffset(offset) {
    const cur = window.dataStore.currentUnitId || 1;
    let next = cur + offset;
    if (next < 1) next = 48;
    if (next > 48) next = 1;
    this.syncCurrentUnit(next, 'tests');
    this.initPdfExamView();
  }

  initPdfExamView() {
    const sel = document.getElementById('test-unit-select');
    if (!sel) return;

    // Ensure PDF online exam view is visible and combined test view is hidden
    const pdfView = document.getElementById('pdf-online-exam-view');
    if (pdfView) pdfView.style.display = 'block';
    const combView = document.getElementById('combined-test-view');
    if (combView) combView.style.display = 'none';

    // Filter units
    const audioUnits = [21, 29, 30, 31, 32, 33, 34, 37, 39, 40, 41, 42, 43, 44, 46, 47, 48];
    const readingUnits = [9, 10, 11, 24, 26, 27, 28, 35, 36, 45, 46, 47, 48];

    let filteredUnits = window.dataStore.units || [];
    if (this.testFilterMode === 'listening') {
      filteredUnits = filteredUnits.filter(u => audioUnits.includes(u.unit_number));
    } else if (this.testFilterMode === 'reading') {
      filteredUnits = filteredUnits.filter(u => readingUnits.includes(u.unit_number));
    }

    sel.innerHTML = '';
    filteredUnits.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.unit_number;
      const isAud = audioUnits.includes(u.unit_number);
      opt.innerText = `Unit ${u.unit_number}: ${u.title}${isAud ? ' 🎧' : ''}`;
      sel.appendChild(opt);
    });

    let targetUnit = window.dataStore.currentUnitId || this.currentPdfUnit || 1;
    const isAvailable = filteredUnits.some(u => u.unit_number === targetUnit);
    if (!isAvailable && filteredUnits.length > 0) {
      targetUnit = filteredUnits[0].unit_number;
    }
    sel.value = targetUnit;
    this.currentPdfUnit = targetUnit;

    this.renderPdfOnlineExam(targetUnit);
  }

  filterTestUnits(type, btn) {
    this.testFilterMode = type;
    const parent = btn.parentElement;
    if (parent) {
      parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    btn.classList.add('active');
    this.initPdfExamView();
  }

  onTestUnitSelectChange(val) {
    const uid = parseInt(val) || 1;
    this.syncCurrentUnit(uid, 'tests');
    this.renderPdfOnlineExam(uid);
  }

  setTestViewMode(mode, btn) {
    const pdfView = document.getElementById('pdf-online-exam-view');
    const combView = document.getElementById('combined-test-view');
    const parent = btn.parentElement;
    parent.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');

    if (mode === 'pdf') {
      if (pdfView) pdfView.style.display = 'block';
      if (combView) combView.style.display = 'none';
      this.renderPdfOnlineExam(this.currentPdfUnit || 47);
    } else {
      if (pdfView) pdfView.style.display = 'none';
      if (combView) combView.style.display = 'block';
    }
  }

  startPdfOnlineExam() {
    if (this.pdfExamStarted) return;
    this.pdfExamStarted = true;

    // Start timer interval
    clearInterval(this.pdfExamTimerInterval);
    this.pdfExamTimerSeconds = 0;
    const timerEl = document.getElementById('pdf-exam-timer');
    if (timerEl) timerEl.innerText = '⏱️ 00:00';
    this.pdfExamTimerInterval = setInterval(() => {
      this.pdfExamTimerSeconds++;
      const m = Math.floor(this.pdfExamTimerSeconds / 60);
      const s = this.pdfExamTimerSeconds % 60;
      if (timerEl) timerEl.innerText = `⏱️ ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, 1000);

    // Update Hero Banner
    const hero = document.getElementById('pdf-exam-start-hero');
    if (hero) {
      hero.classList.add('is-running');
      hero.innerHTML = `
        <div class="exam-hero-left">
          <div class="exam-hero-icon">⚡</div>
          <div>
            <div class="exam-hero-title">ĐANG LÀM BÀI — ĐỒNG HỒ ĐANG TÍNH GIỜ</div>
            <div class="exam-hero-desc">Hãy đọc kỹ câu hỏi, chọn đáp án hoặc gõ câu trả lời, sau đó bấm <strong>"Finish Test (Nộp Bài)"</strong> để chấm điểm.</div>
          </div>
        </div>
        <div style="font-size: 13.5px; font-weight: 700; background: rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 20px;">
          🟢 Đang tính giờ
        </div>
      `;
    }

    window.smobApp.showToast('🚀 Đã bắt đầu tính giờ làm bài!');
  }

  resetPdfExam() {
    this.userPdfAnswers = {};
    this.pdfExamSubmitted = false;
    this.pdfExamStarted = false;
    clearInterval(this.pdfExamTimerInterval);
    if (this.activeInlineAudio) {
      this.activeInlineAudio.pause();
    }
    this.renderPdfOnlineExam(this.currentPdfUnit || 1);
  }

  renderPdfOnlineExam(unitId) {
    const unit = window.dataStore.getUnit(unitId);
    if (!unit) return;

    this.currentPdfUnit = unitId;
    this.userPdfAnswers = {};
    this.pdfExamSubmitted = false;
    this.pdfExamStarted = false;

    // Title banner
    const titleEl = document.getElementById('pdf-exam-header-title');
    if (titleEl) {
      titleEl.innerText = `THI ONLINE UNIT ${unitId}: ${(unit.title || '').toUpperCase()}`;
    }

    const reviewCard = document.getElementById('pdf-exam-review-card');
    if (reviewCard) reviewCard.style.display = 'none';
    const btnRev = document.getElementById('btn-pdf-review');
    if (btnRev) btnRev.style.display = 'none';
    const btnSub = document.getElementById('btn-pdf-submit');
    if (btnSub) {
      btnSub.disabled = false;
      btnSub.innerText = 'Finish Test (Nộp Bài)';
    }

    // Load questions
    const questions = unit.unit_test || [];
    this.pdfExamQuestions = questions;

    // Reset timer to NOT RUNNING state (Waits for "Bắt đầu làm bài")
    clearInterval(this.pdfExamTimerInterval);
    this.pdfExamTimerSeconds = 0;
    const timerEl = document.getElementById('pdf-exam-timer');
    if (timerEl) timerEl.innerText = '⏱️ 00:00 (Bấm bắt đầu)';

    // Update palette and answered count
    this.updatePdfPalette();

    const container = document.getElementById('pdf-exam-sections-container');
    if (!container) return;
    container.innerHTML = '';

    if (questions.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
          <div style="font-size: 38px; margin-bottom: 10px;">📝</div>
          <div style="font-size: 16px; font-weight: 700; color: var(--text-primary);">Đề thi online Unit ${unitId} đang được đồng bộ</div>
          <div style="font-size: 13px; margin-top: 6px;">Bạn có thể chuyển sang chế độ "Bộ Luyện Thi Tự Động" để tạo đề tùy biến cho Unit này nhé!</div>
        </div>
      `;
      return;
    }

    // 1. Render Start Exam Hero Banner
    const heroCard = document.createElement('div');
    heroCard.className = 'exam-start-hero-banner';
    heroCard.id = 'pdf-exam-start-hero';
    heroCard.innerHTML = `
      <div class="exam-hero-left">
        <div class="exam-hero-icon">⏱️</div>
        <div>
          <div class="exam-hero-title">Đề Thi Online Chuẩn PDF — Unit ${unitId}: ${(unit.title || '').toUpperCase()}</div>
          <div class="exam-hero-desc">Đề thi gồm <strong>${questions.length} câu hỏi</strong> bám sát 100% tài liệu gốc của Cô Mai Phương. Khi bạn sẵn sàng, bấm nút bên phải để bắt đầu làm bài và tính giờ.</div>
        </div>
      </div>
      <button class="btn-start-exam" onclick="window.smobApp.startPdfOnlineExam()">
        🚀 BẮT ĐẦU LÀM BÀI (TÍNH GIỜ)
      </button>
    `;
    container.appendChild(heroCard);

    if (unitId === 9) {
      const legendWrapper = document.createElement('div');
      legendWrapper.innerHTML = this.getPartsOfSpeechLegendHtml();
      if (legendWrapper.firstElementChild) {
        container.appendChild(legendWrapper.firstElementChild);
      }
    }

    // Group questions by part/instruction
    const sections = [];
    let curSection = null;

    questions.forEach((q, idx) => {
      const partTitle = q.part_title || q.instruction || `Phần ${q.part || 1}`;
      const audioTrack = q.audio_track || null;

      if (!curSection || curSection.title !== partTitle || curSection.audioTrack !== audioTrack) {
        curSection = {
          title: partTitle,
          audioTrack: audioTrack,
          isTrueFalse: q.type === 'TRUE_FALSE',
          questions: []
        };
        sections.push(curSection);
      }
      curSection.questions.push({ q, idx });
    });

    // Render each section
    sections.forEach((sec, sIdx) => {
      const secCard = document.createElement('div');
      secCard.className = 'pdf-section-card';

      const firstQNo = sec.questions.length > 0 ? (sec.questions[0].idx + 1) : 1;
      const lastQNo = sec.questions.length > 0 ? (sec.questions[sec.questions.length - 1].idx + 1) : 1;

      // Section Header
      let secHtml = `
        <div class="pdf-section-title">
          <span>📌</span>
          <span>${sec.title}</span>
        </div>
      `;

      // TOEIC-Style Listening Passage Card if audio track present
      if (sec.audioTrack) {
        const audioUrl = `/audio/${unitId}/${sec.audioTrack}`;
        const audioId = `pdf-audio-${sIdx}`;
        const transcriptQ = sec.questions.find(item => item.q.transcript)?.q;
        const transcriptText = transcriptQ ? transcriptQ.transcript : '';
        const transcriptViText = transcriptQ ? (transcriptQ.transcript_vi || '') : '';

        secHtml += `
          <div class="toeic-passage-card" id="box-${audioId}">
            <div class="toeic-passage-header">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="toeic-badge-label">🎧 TOEIC LISTENING</span>
                  <span class="toeic-track-name">Track: ${sec.audioTrack}</span>
                </div>
                <div style="font-size: 12.5px; color: #0284c7; font-weight: 700;">Cô Vũ Thị Mai Phương • Ngoaingu24h</div>
              </div>
              <div class="toeic-context-sub">
                Questions ${firstQNo} - ${lastQNo} refer to the following recording / conversation:
              </div>
            </div>

            <div class="toeic-audio-bar">
              <button class="apple-btn btn-primary" style="padding: 6px 14px; font-size: 12.5px; border-radius: 20px;" onclick="window.smobApp.togglePdfInlineAudio('${audioUrl}', '${audioId}')" id="btn-${audioId}">
                ▶ Nghe Bài Băng
              </button>
              <div class="toeic-audio-speed-chips">
                <button class="speed-chip" onclick="window.smobApp.setAudioSpeed('${audioId}', 0.8)">0.8x</button>
                <button class="speed-chip active" onclick="window.smobApp.setAudioSpeed('${audioId}', 1.0)">1.0x</button>
                <button class="speed-chip" onclick="window.smobApp.setAudioSpeed('${audioId}', 1.2)">1.2x</button>
              </div>
              <span id="time-${audioId}" class="toeic-audio-time">00:00 / --:--</span>
              ${transcriptText ? `
                <button class="apple-btn btn-secondary" style="margin-left: auto; padding: 5px 12px; font-size: 12px;" onclick="window.smobApp.toggleTranscript('${audioId}')">
                  📝 Lời Thoại (Transcript)
                </button>
              ` : ''}
            </div>

            ${transcriptText ? `
              <div class="toeic-transcript-drawer" id="drawer-${audioId}" style="display: none;">
                <div class="transcript-title">
                  <span>📄</span> Lời Thoại Bài Nghe & Bản Dịch (Script & Translation):
                </div>
                <div class="transcript-body">
                  <div class="transcript-en">${transcriptText}</div>
                  ${transcriptViText ? `<div class="transcript-vi">${transcriptViText}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }

      // Check if True/False table
      if (sec.isTrueFalse) {
        secHtml += `
          <div class="q-requirement-badge" style="margin-bottom: 12px;">
            <span class="q-req-icon">📌</span>
            <span>Yêu cầu: Nghe đoạn audio phía trên và tích chọn T (True - Đúng) hoặc F (False - Sai) cho từng nhận định tương ứng.</span>
          </div>
          <div style="overflow-x: auto;">
            <table class="pdf-tf-table">
              <thead>
                <tr>
                  <th style="width: 48px;" class="center">No.</th>
                  <th>Nội dung câu nhận định (Statement)</th>
                  <th class="center">T</th>
                  <th class="center">F</th>
                  <th class="center" style="width: 110px;">Phát Âm AI</th>
                </tr>
              </thead>
              <tbody>
        `;

        sec.questions.forEach(({ q, idx }) => {
          const qNo = q.table_index || (idx + 1);
          const safeStem = (q.stem || '').replace(/'/g, "\\'");
          secHtml += `
            <tr id="pdf-q-row-${q.id}">
              <td class="center" style="font-weight: 700; color: var(--text-secondary);">${qNo}.</td>
              <td>
                <div style="font-size: 15px; font-weight: 600; color: var(--text-primary);">${q.stem}</div>
                <div class="pdf-q-feedback" id="pdf-feedback-${q.id}" style="display: none; font-size: 13px; margin-top: 6px;"></div>
              </td>
              <td class="center">
                <label class="tf-radio-label" id="tf-lbl-True-${q.id}" onclick="window.smobApp.setPdfQuestionAnswer('${q.id}', 'True')">
                  <input type="radio" name="pdf_${q.id}" value="True" style="display:none;">T
                </label>
              </td>
              <td class="center">
                <label class="tf-radio-label" id="tf-lbl-False-${q.id}" onclick="window.smobApp.setPdfQuestionAnswer('${q.id}', 'False')">
                  <input type="radio" name="pdf_${q.id}" value="False" style="display:none;">F
                </label>
              </td>
              <td class="center">
                <button class="btn-ai-coach-inline" onclick="window.smobApp.openAICoach('${safeStem}', '')" title="Trợ lý AI chấm phát âm câu này">
                  🎙️ Đọc AI
                </button>
              </td>
            </tr>
          `;
        });

        secHtml += `
              </tbody>
            </table>
          </div>
        `;
      } else {
        // Check if all questions in this section share the same passage / stem (e.g. Unit 48, Unit 30)
        const isSharedPassage = sec.questions.length > 1 && (
          sec.questions.every(item => item.q.blank_no) ||
          (sec.questions.length > 2 && sec.questions.every(item => item.q.stem && item.q.stem === sec.questions[0].q.stem))
        );

        if (isSharedPassage) {
          // 1. Render passage card once with highlighted blanks
          let rawPassage = sec.questions[0].q.stem || '';
          let formattedPassage = this.escapeHtml(rawPassage);
          sec.questions.forEach(({ q }, idx) => {
            const bNo = q.blank_no || (idx + 1);
            const targetBlank = new RegExp(`\\((${bNo})\\)\\s*_{2,}|\\((${bNo})\\)\\s*\\.{2,}|\\((${bNo})\\)`, 'g');
            formattedPassage = formattedPassage.replace(targetBlank, `<span class="passage-blank-marker">(${bNo}) [ _____ ]</span>`);
          });
          formattedPassage = formattedPassage.replace(/_{2,}/g, `<span class="passage-blank-marker">[ _____ ]</span>`);

          secHtml += `
            <div class="listening-passage-box">
              <div class="passage-header-row">
                <span style="font-weight: 800; font-size: 14.5px; color: var(--accent);">📄 Đoạn Văn Bài Thi Điền Từ (${sec.questions.length} Chỗ Trống):</span>
                <span style="font-size: 12px; color: var(--text-secondary);">Đọc/nghe đoạn văn và điền câu trả lời vào các chỗ trống bên dưới</span>
              </div>
              <div class="passage-text-content">${formattedPassage}</div>
            </div>
            <div class="listening-inputs-list" style="margin-bottom: 16px;">
          `;

          sec.questions.forEach(({ q, idx }) => {
            const qNo = idx + 1;
            const bNo = q.blank_no || qNo;
            const userAns = this.userPdfAnswers[q.id] || '';

            secHtml += `
              <div class="listening-input-card" id="pdf-card-${q.id}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 700; font-size: 13.5px; color: var(--accent);">Chỗ trống (${bNo}) — Câu ${qNo}:</span>
                  <span class="exam-input-saved-badge ${userAns ? 'visible' : ''}" id="pdf-saved-${q.id}">✓ Đã lưu</span>
                </div>
                <input type="text" class="listening-input-field" id="pdf-input-${q.id}" 
                  placeholder="Gõ từ điền vào chỗ trống (${bNo})..." 
                  value="${this.escapeHtml(userAns)}"
                  oninput="window.smobApp.setPdfQuestionAnswer('${q.id}', this.value)"
                />
                <div class="explanation-callout" id="pdf-expl-${q.id}" style="display: none; margin-top: 8px;"></div>
              </div>
            `;
          });
          secHtml += `</div>`;
        } else {
          // Standard Multiple Choice or Fill-in-Blank Questions
          secHtml += `<div style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px;">`;
          sec.questions.forEach(({ q, idx }, secQIdx) => {
            const overallQNo = idx + 1;
            const secQNo = secQIdx + 1;
            const totalExamQs = this.pdfExamQuestions.length;
            const safeStem = (q.stem || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const cleanSpokenText = (q.stem || '').replace(/<[^>]*>?/gm, '').replace(/_{2,}/g, 'blank').replace(/'/g, "\\'");
            const req = this.getQuestionRequirement(q, sec.title);
            
            let formattedStem = q.stem || `Câu ${overallQNo}`;
            if (q.blank_no) {
              const targetBlank = new RegExp(`\\(${q.blank_no}\\)\\s*_{2,}`, 'g');
              formattedStem = formattedStem.replace(targetBlank, `<span class="q-blank-highlight" style="background: var(--accent); color: #fff; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); font-weight: 900;">(${q.blank_no}) [ 👉 ĐIỀN VÀO ĐÂY 👈 ]</span>`);
            }
            formattedStem = formattedStem.replace(/_{2,}/g, '<span class="q-blank-highlight">[ _____ ]</span>');
            
            secHtml += `
              <div class="exam-card" id="pdf-card-${q.id}" style="padding: 20px 24px; margin-bottom: 0;">
                <div class="q-requirement-badge">
                  <span class="q-req-icon">📌</span>
                  <span>Yêu cầu: ${req}</span>
                </div>

                <div class="pdf-exam-q-header-bar">
                  <div class="pdf-exam-q-num-box">
                    <span class="pdf-q-badge-num">Question ${secQNo}.</span>
                    <span class="pdf-q-overall-sub">(Câu ${overallQNo} / ${totalExamQs})</span>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="speaker-btn" onclick="window.smobApp.speakText('${cleanSpokenText}')" title="Nghe câu hỏi này">🔊</button>
                    ${q.stem ? `
                      <button class="btn-ai-coach-inline" onclick="window.smobApp.openAICoach('${cleanSpokenText}', '')" title="Luyện đọc câu này">
                        🎙️ Luyện Đọc AI
                      </button>
                    ` : ''}
                  </div>
                </div>

                ${q.image_url ? `
                  <div class="exam-q-visual-wrapper">
                    <img src="${q.image_url}" alt="Minh họa bài tập" class="exam-q-illustration" onclick="window.smobApp.zoomImage(this.src)" title="Bấm để phóng to ảnh" />
                  </div>
                ` : ''}

                <div class="pdf-exam-q-stem-body">
                  ${formattedStem}
                </div>
            `;

            const userAns = this.userPdfAnswers[q.id] || '';
            const hasOptions = Array.isArray(q.options) && q.options.length > 0;

            if (hasOptions) {
              // Standard Multiple Choice (Only MCQ buttons, clean and focused)
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
              // Digital Worksheet: Clean Smart Typing Input Box
              secHtml += `
                <div class="exam-fill-blank-card" id="pdf-fill-${q.id}" style="margin-top: 14px;">
                  <div class="exam-fill-prompt-row">
                    <div class="exam-fill-badge">✍️ Nhập câu trả lời:</div>
                    <div class="exam-fill-hint">Nhập từ / câu vào ô dưới (Gõ xong nhấn Enter để sang câu tiếp theo):</div>
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
            }

            secHtml += `
                <div class="explanation-callout" id="pdf-expl-${q.id}" style="display: none; margin-top: 12px;"></div>
              </div>
            `;
          });
          secHtml += `</div>`;
        }
      }

      secCard.innerHTML = secHtml;
      container.appendChild(secCard);
    });
  }

  togglePdfInlineAudio(url, audioId) {
    const btn = document.getElementById(`btn-${audioId}`);
    const timeEl = document.getElementById(`time-${audioId}`);

    if (this.activeInlineAudio && this.activeInlineAudio._id === audioId) {
      if (this.activeInlineAudio.paused) {
        this.activeInlineAudio.play();
        if (btn) btn.innerText = '⏸ Tạm Dừng';
      } else {
        this.activeInlineAudio.pause();
        if (btn) btn.innerText = '▶ Tiếp Tục';
      }
      return;
    }

    if (this.activeInlineAudio) {
      this.activeInlineAudio.pause();
      const prevBtn = document.getElementById(`btn-${this.activeInlineAudio._id}`);
      if (prevBtn) prevBtn.innerText = '▶ Nghe';
    }

    const aud = new Audio(url);
    aud._id = audioId;
    this.activeInlineAudio = aud;

    if (btn) btn.innerText = '⏸ Tạm Dừng';

    aud.addEventListener('timeupdate', () => {
      if (timeEl && aud.duration) {
        const curM = Math.floor(aud.currentTime / 60);
        const curS = Math.floor(aud.currentTime % 60);
        const durM = Math.floor(aud.duration / 60);
        const durS = Math.floor(aud.duration % 60);
        timeEl.innerText = `${curM}:${curS < 10 ? '0' + curS : curS} / ${durM}:${durS < 10 ? '0' + durS : durS}`;
      }
    });

    aud.addEventListener('ended', () => {
      if (btn) btn.innerText = '▶ Phát Lại';
    });

    aud.play().catch(e => {
      console.warn('Inline audio play error:', e);
      if (btn) btn.innerText = '▶ Bấm Nghe';
    });
  }

  setAudioSpeed(audioId, speed) {
    if (this.activeInlineAudio && this.activeInlineAudio._id === audioId) {
      this.activeInlineAudio.playbackRate = speed;
    }
    const box = document.getElementById(`box-${audioId}`);
    if (box) {
      box.querySelectorAll('.speed-chip').forEach(c => {
        c.classList.toggle('active', parseFloat(c.innerText) === speed);
      });
    }
  }

  toggleTranscript(audioId) {
    const drawer = document.getElementById(`drawer-${audioId}`);
    if (drawer) {
      const isHidden = drawer.style.display === 'none';
      drawer.style.display = isHidden ? 'block' : 'none';
    }
  }

  checkExamAnswer(q, userAns) {
    if (!userAns || !q) return false;
    const normalize = (s) => (s || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/,([^\s])/g, ', $1')
      .replace(/[,.;:?!]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const expandContractions = (s) => {
      let t = ' ' + normalize(s) + ' ';
      const map = [
        [/\bit's\b/g, 'it is'],
        [/\bthey're\b/g, 'they are'],
        [/\bhe's\b/g, 'he is'],
        [/\bshe's\b/g, 'she is'],
        [/\bwe're\b/g, 'we are'],
        [/\bi'm\b/g, 'i am'],
        [/\bdon't\b/g, 'do not'],
        [/\bdoesn't\b/g, 'does not'],
        [/\bdidn't\b/g, 'did not'],
        [/\bwon't\b/g, 'will not'],
        [/\bcan't\b/g, 'cannot'],
        [/\bisn't\b/g, 'is not'],
        [/\baren't\b/g, 'are not'],
        [/\bwasn't\b/g, 'was not'],
        [/\bweren't\b/g, 'were not'],
        [/\bwouldn't\b/g, 'would not'],
        [/\bcouldn't\b/g, 'could not'],
        [/\bshouldn't\b/g, 'should not'],
        [/\bmustn't\b/g, 'must not'],
        [/\bhaven't\b/g, 'have not'],
        [/\bhasn't\b/g, 'has not'],
        [/\bhadn't\b/g, 'had not'],
        [/\b(\d{1,2}):00\b/g, "$1 o'clock"]
      ];
      map.forEach(([re, rep]) => { t = t.replace(re, rep); });
      return t.replace(/\s+/g, ' ').trim();
    };

    const isMatch = (val1, val2) => {
      const n1 = normalize(val1);
      const n2 = normalize(val2);
      if (n1 === n2) return true;
      return expandContractions(n1) === expandContractions(n2);
    };

    // Strip leading option letter prefix like "A. ", "B. ", "a) " (e.g. "A. didn't pay" -> "didn't pay")
    const stripOptionPrefix = (s) => (s || '').replace(/^[a-d][\.\)]\s*/i, '').trim();
    // Normalize en-dash / em-dash / hyphen
    const normalizeDashes = (s) => (s || '').replace(/[\u2010-\u2015]/g, '-').replace(/\s*-\s*/g, ' - ');

    const uClean = normalize(userAns);
    const cClean = normalize(q.correct_answer || '');
    if (!cClean) return false;

    if (isMatch(uClean, cClean)) return true;

    // Smart typing check without option letter prefix
    const uNoPfx = stripOptionPrefix(normalizeDashes(uClean));
    const cNoPfx = stripOptionPrefix(normalizeDashes(cClean));
    if (uNoPfx && cNoPfx && isMatch(uNoPfx, cNoPfx)) return true;

    // Check all acceptable_variants & valid_alternatives
    const variants = (q.acceptable_variants || []).concat(q.valid_alternatives || []);
    if (variants.length > 0) {
      if (variants.some(v => {
        const vNorm = normalize(v);
        const vNoPfx = stripOptionPrefix(normalizeDashes(vNorm));
        return isMatch(uClean, vNorm) || (uNoPfx && vNoPfx && isMatch(uNoPfx, vNoPfx));
      })) {
        return true;
      }
    }

    // Single letter matching: 'a' matches 'a. ...'
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

    // Option index matching
    if (q.options && q.options.length > 0) {
      const selectedIndex = q.options.findIndex(opt => isMatch(opt, uClean));
      if (selectedIndex >= 0) {
        const optionLetter = String.fromCharCode(97 + selectedIndex);
        if (optionLetter === cClean || cClean.startsWith(optionLetter + '.') || cClean.startsWith(optionLetter + ' ')) {
          return true;
        }
      }
      const correctIndex = q.options.findIndex(opt => isMatch(opt, cClean));
      if (correctIndex >= 0) {
        const optionLetter = String.fromCharCode(97 + correctIndex);
        if (optionLetter === uClean || uClean.startsWith(optionLetter + '.') || uClean.startsWith(optionLetter + ' ')) {
          return true;
        }
      }
    }

    return false;
  }

  setPdfQuestionAnswer(qId, answer, optIdx = null) {
    if (this.pdfExamSubmitted) return;

    if (!this.pdfExamStarted) {
      this.startPdfOnlineExam();
    }

    const trimmed = (answer || '').trim();
    if (trimmed) {
      this.userPdfAnswers[qId] = answer;
      this.userPdfAnswers[String(qId)] = answer;
    } else {
      delete this.userPdfAnswers[qId];
      delete this.userPdfAnswers[String(qId)];
    }

    // Update UI for True/False
    const lblT = document.getElementById(`tf-lbl-True-${qId}`);
    const lblF = document.getElementById(`tf-lbl-False-${qId}`);
    if (lblT && lblF) {
      lblT.classList.toggle('checked-true', answer === 'True');
      lblF.classList.toggle('checked-false', answer === 'False');
    }

    // Direct DOM update for Question Card Option Elements
    const qCard = document.getElementById(`pdf-card-${qId}`);
    if (qCard) {
      const optionCards = qCard.querySelectorAll('.answer-option-card');
      optionCards.forEach((c, idx) => {
        const isSelected = (optIdx !== null && idx === optIdx) || c.id === `pdf-opt-${qId}-${optIdx}`;
        c.classList.toggle('selected', isSelected);
      });
    }

    // Also update by q.options matching
    const q = this.pdfExamQuestions.find(x => String(x.id) === String(qId));
    if (q && q.options) {
      q.options.forEach((opt, idx) => {
        const card = document.getElementById(`pdf-opt-${qId}-${idx}`);
        if (card) {
          card.classList.toggle('selected', idx === optIdx || opt === answer);
        }
      });
    }

    // Remove unanswered alert when user answers question
    const palItem = document.getElementById(`palette-item-${qId}`);
    if (palItem) palItem.classList.remove('unanswered-alert');
    const card = document.getElementById(`pdf-card-${qId}`) || document.getElementById(`pdf-q-row-${qId}`);
    if (card) {
      card.classList.remove('exam-card-unanswered-alert');
      const badge = card.querySelector('.unans-badge-tag');
      if (badge) badge.remove();
    }

    // Update auto-save indicator badge
    const badge = document.getElementById(`pdf-saved-${qId}`);
    if (badge) {
      badge.classList.toggle('visible', trimmed.length > 0);
    }

    if (window.dataStore && window.dataStore.recordEngagement) {
      window.dataStore.recordEngagement('click_option', 1);
    }
    this.updatePdfPalette();
  }

  updatePdfPalette() {
    const palette = document.getElementById('pdf-question-palette');
    const ansCountEl = document.getElementById('pdf-answered-count');
    const totCountEl = document.getElementById('pdf-total-count');

    const total = this.pdfExamQuestions.length;
    const answered = Object.keys(this.userPdfAnswers).filter(k => (this.userPdfAnswers[k] || '').trim().length > 0).length;

    if (ansCountEl) ansCountEl.innerText = answered;
    if (totCountEl) totCountEl.innerText = total;

    if (!palette) return;
    palette.innerHTML = '';

    this.pdfExamQuestions.forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'palette-item palette-num';
      item.id = `palette-item-${q.id}`;
      item.innerText = idx + 1;
      item.title = `Câu ${idx + 1}`;

      if (this.userPdfAnswers[q.id] && (this.userPdfAnswers[q.id] || '').trim().length > 0) {
        item.classList.add('answered');
      }

      item.onclick = () => {
        const target = document.getElementById(`pdf-q-row-${q.id}`) || document.getElementById(`pdf-card-${q.id}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.transition = 'box-shadow 0.3s';
          target.style.boxShadow = '0 0 0 3px #0071e3';
          setTimeout(() => { target.style.boxShadow = ''; }, 1200);
        }
      };

      palette.appendChild(item);
    });
  }

  // ==========================================
  // UNANSWERED QUESTIONS CONFIRMATION MODAL
  // ==========================================
  showUnansweredConfirmModal(config) {
    this._unansweredModalConfig = config;
    const modal = document.getElementById('unanswered-warning-modal');
    if (!modal) {
      if (confirm(`Bạn còn ${config.missingList.length} câu chưa làm. Bạn có chắc chắn muốn nộp bài ngay không?`)) {
        config.onConfirmSubmit();
      }
      return;
    }

    const titleEl = document.getElementById('unans-modal-title');
    if (titleEl) titleEl.innerText = config.title || 'Còn Câu Hỏi Chưa Làm!';

    const totalEl = document.getElementById('unans-modal-total');
    if (totalEl) totalEl.innerText = config.total;

    const doneEl = document.getElementById('unans-modal-done');
    if (doneEl) doneEl.innerText = config.answered;

    const missingEl = document.getElementById('unans-modal-missing');
    if (missingEl) missingEl.innerText = `${config.missingList.length} câu chưa trả lời`;

    const chipsContainer = document.getElementById('unans-modal-chips');
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      config.missingList.forEach(m => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'unans-chip-btn';
        btn.innerHTML = `Câu ${m.num} <span>➔</span>`;
        btn.title = `Nhảy đến Câu ${m.num}`;
        btn.onclick = (e) => {
          e.stopPropagation();
          this.closeUnansweredModal();
          if (config.onJump) {
            config.onJump(m.id);
          }
        };
        chipsContainer.appendChild(btn);
      });
    }

    modal.style.display = 'flex';
  }

  closeUnansweredModal() {
    const modal = document.getElementById('unanswered-warning-modal');
    if (modal) modal.style.display = 'none';
  }

  resumeAndJumpToFirstUnanswered() {
    this.closeUnansweredModal();
    const config = this._unansweredModalConfig;
    if (config && config.missingList && config.missingList.length > 0) {
      const first = config.missingList[0];
      if (config.onJump) {
        config.onJump(first.id);
      }
    }
  }

  confirmSubmitUnanswered() {
    this.closeUnansweredModal();
    const config = this._unansweredModalConfig;
    if (config && typeof config.onConfirmSubmit === 'function') {
      config.onConfirmSubmit();
    }
  }

  submitPdfExam() {
    if (this.pdfExamQuestions.length === 0) return;

    // Clear previous alerts
    document.querySelectorAll('.unanswered-alert').forEach(el => el.classList.remove('unanswered-alert'));
    document.querySelectorAll('.exam-card-unanswered-alert').forEach(el => el.classList.remove('exam-card-unanswered-alert'));
    document.querySelectorAll('.unans-badge-tag').forEach(el => el.remove());

    const total = this.pdfExamQuestions.length;
    const missing = [];

    this.pdfExamQuestions.forEach((q, idx) => {
      const ans = (this.userPdfAnswers[q.id] || '').trim();
      if (!ans) {
        missing.push({
          id: q.id,
          num: idx + 1,
          q: q
        });
      }
    });

    if (missing.length > 0) {
      // 1. Light up red on the palette
      missing.forEach(m => {
        const palItem = document.getElementById(`palette-item-${m.id}`);
        if (palItem) {
          palItem.classList.add('unanswered-alert');
        }
        // 2. Light up red on question card
        const card = document.getElementById(`pdf-card-${m.id}`) || document.getElementById(`pdf-q-row-${m.id}`);
        if (card) {
          card.classList.add('exam-card-unanswered-alert');
          const numEl = card.querySelector('.q-number') || card.querySelector('.pdf-q-num') || card.querySelector('strong') || card;
          if (numEl && !card.querySelector('.unans-badge-tag')) {
            const badge = document.createElement('span');
            badge.className = 'unans-badge-tag';
            badge.innerText = '⚠️ Chưa làm';
            numEl.insertAdjacentElement('afterend', badge);
          }
        }
      });

      // 3. Show confirmation modal
      this.showUnansweredConfirmModal({
        testType: 'pdf_exam',
        title: 'Chưa Hoàn Thành Bài Thi Online!',
        total: total,
        answered: total - missing.length,
        missingList: missing,
        onConfirmSubmit: () => this._doSubmitPdfExam(),
        onJump: (qId) => {
          const target = document.getElementById(`pdf-q-row-${qId}`) || document.getElementById(`pdf-card-${qId}`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.style.transition = 'box-shadow 0.3s';
            target.style.boxShadow = '0 0 0 4px #ef4444';
            setTimeout(() => { target.style.boxShadow = ''; }, 1500);
          }
        }
      });
      return;
    }

    this._doSubmitPdfExam();
  }

  _doSubmitPdfExam() {
    this.closeUnansweredModal();
    clearInterval(this.pdfExamTimerInterval);

    if (this.activeInlineAudio) {
      this.activeInlineAudio.pause();
    }

    this.pdfExamSubmitted = true;
    let correctCount = 0;

    this.pdfExamQuestions.forEach((q, idx) => {
      const userAns = (this.userPdfAnswers[q.id] || '').trim();
      const corAns = (q.correct_answer || '').trim();
      const paletteItem = document.getElementById(`palette-item-${q.id}`);

      const isRight = this.checkExamAnswer(q, userAns);

      if (isRight) {
        correctCount++;
        if (paletteItem) {
          paletteItem.classList.remove('answered');
          paletteItem.classList.add('correct');
        }
      } else {
        if (paletteItem) {
          paletteItem.classList.remove('answered');
          paletteItem.classList.add('wrong');
        }
        // Record mistake into DataStore
        window.dataStore.recordMistake(this.currentPdfUnit, q.id, q.stem || `Câu ${idx+1}`, userAns || '(Chưa làm)', corAns, q.explanation || '');
      }

      // Visual feedback on question options
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, oIdx) => {
          const card = document.getElementById(`pdf-opt-${q.id}-${oIdx}`);
          if (card) {
            const isOptCorrect = this.checkExamAnswer(q, opt);
            const isOptSelected = userAns && (userAns === opt || userAns.toLowerCase() === opt.toLowerCase() || opt.toLowerCase().startsWith(userAns.toLowerCase()));
            if (isOptCorrect) {
              card.classList.add('is-correct');
            } else if (isOptSelected && !isRight) {
              card.classList.add('is-wrong');
            }
          }
        });
      }

      // Visual feedback on text input
      const inputEl = document.getElementById(`pdf-input-${q.id}`);
      if (inputEl) {
        inputEl.disabled = true;
        inputEl.style.borderColor = isRight ? '#16a34a' : '#dc2626';
        inputEl.style.background = isRight ? '#f0fdf4' : '#fef2f2';
      }

      // Visual feedback on row / card
      if (q.type === 'TRUE_FALSE') {
        const row = document.getElementById(`pdf-q-row-${q.id}`);
        const fb = document.getElementById(`pdf-feedback-${q.id}`);
        if (row && fb) {
          fb.style.display = 'block';
          if (isRight) {
            fb.innerHTML = `<span style="color: #16a34a; font-weight: 700;">✓ Chính xác!</span> ${q.explanation || ''}`;
          } else {
            fb.innerHTML = `<span style="color: #dc2626; font-weight: 700;">✗ Chưa đúng. Đáp án: ${corAns}</span>. ${q.explanation || ''}`;
          }
        }
      } else {
        const expl = document.getElementById(`pdf-expl-${q.id}`);
        if (expl) {
          expl.style.display = 'block';
          expl.className = `explanation-callout ${isRight ? 'is-correct' : 'is-wrong'}`;
          expl.innerHTML = `
            <div style="font-weight: 700; margin-bottom: 4px; color: ${isRight ? '#16a34a' : '#dc2626'};">
              ${isRight ? '✓ Chính xác!' : `✗ Chưa chính xác. Đáp án đúng: ${corAns}`}
            </div>
            <div style="font-size: 13.5px; line-height: 1.5; color: var(--text-primary);">${q.explanation || ''}</div>
          `;
        }
      }
    });

    const percent = Math.round((correctCount / this.pdfExamQuestions.length) * 100);

    const btnSub = document.getElementById('btn-pdf-submit');
    if (btnSub) {
      btnSub.disabled = true;
      btnSub.innerText = `Đã Chấm: ${correctCount}/${this.pdfExamQuestions.length} (${percent}%)`;
    }

    const btnRev = document.getElementById('btn-pdf-review');
    if (btnRev) btnRev.style.display = 'block';

    // Render result summary hero card at top
    const hero = document.getElementById('pdf-exam-start-hero');
    if (hero) {
      const timeStr = `${Math.floor(this.pdfExamTimerSeconds / 60)} phút ${this.pdfExamTimerSeconds % 60} giây`;
      const rating = percent >= 80 ? 'Xuất Sắc' : (percent >= 50 ? 'Khá' : 'Cần Cố Gắng');
      const wrongCount = this.pdfExamQuestions.length - correctCount;
      hero.className = 'exam-result-banner';
      hero.innerHTML = `
        <div class="result-score-circle">
          <div class="score-number">${percent}%</div>
          <div class="score-label">${rating}</div>
        </div>
        <div class="result-details">
          <div class="result-title">Kết Quả Bài Thi Unit ${this.currentPdfUnit}</div>
          <div class="result-meta">
            Đúng <strong>${correctCount} / ${this.pdfExamQuestions.length}</strong> câu • Thời gian làm bài: <strong>${timeStr}</strong>
          </div>
          <div class="result-actions">
            <button class="apple-btn btn-primary" onclick="window.smobApp.togglePdfReview()">📑 Xem Lời Thoại & Lời Giải</button>
            <button class="apple-btn btn-secondary" onclick="window.smobApp.resetPdfExam()">🔄 Làm Lại Bài Này</button>
            ${wrongCount > 0 ? `<button class="apple-btn btn-warning" onclick="window.smobApp.navigate('mistakes')">📕 Xem Sổ Tay Câu Sai (${wrongCount})</button>` : ''}
          </div>
        </div>
      `;
      hero.scrollIntoView({ behavior: 'smooth' });
    }

    // Build detailed graded results for review attempt feature
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

    window.smobApp.showToast(`🎉 Đã nộp bài: ${correctCount}/${this.pdfExamQuestions.length} câu đúng (${percent}%)! Đã lưu vào Lịch sử.`);

    if (window.smobCloudSync) {
      window.smobCloudSync.autoSyncIfEnabled();
    }
  }

  renderPdfTranscriptsAndReview() {
    const card = document.getElementById('pdf-exam-review-card');
    const container = document.getElementById('pdf-transcripts-container');
    if (!card || !container) return;

    container.innerHTML = '';
    const uniqueTranscripts = [];

    this.pdfExamQuestions.forEach(q => {
      if (q.transcript && !uniqueTranscripts.some(t => t.text === q.transcript)) {
        uniqueTranscripts.push({
          title: q.part_title || 'Bài nghe',
          track: q.audio_track || '',
          text: q.transcript
        });
      }
    });

    if (uniqueTranscripts.length > 0) {
      uniqueTranscripts.forEach((t, i) => {
        const item = document.createElement('div');
        item.style.background = '#ffffff';
        item.style.padding = '16px 20px';
        item.style.borderRadius = '12px';
        item.style.border = '1px solid #e2e8f0';
        item.innerHTML = `
          <div style="font-weight: 700; color: #0050b3; font-size: 14.5px; margin-bottom: 8px;">
            🎧 Lời thoại (${t.track || `Đoạn ${i+1}`}): ${t.title}
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: var(--text-primary); white-space: pre-line;">
            ${t.text}
          </div>
        `;
        container.appendChild(item);
      });
      card.style.display = 'block';
    }
  }

  togglePdfReview() {
    const card = document.getElementById('pdf-exam-review-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth' });
    }
  }

  resetPdfExam() {
    this.renderPdfOnlineExam(this.currentPdfUnit);
  }

  // ==========================================
  // AI PRONUNCIATION COACH (TRỢ LÝ CHẤM PHÁT ÂM)
  // ==========================================
  openAICoach(targetText, ipa = '') {
    if (!targetText) return;
    this.aiTargetText = targetText.trim();
    this.aiTargetIpa = ipa || '';

    const modal = document.getElementById('ai-pronunciation-modal');
    const textEl = document.getElementById('ai-target-text');
    const ipaEl = document.getElementById('ai-target-ipa');
    const statusEl = document.getElementById('ai-coach-status');
    const previewEl = document.getElementById('ai-coach-spoken-preview');
    const resBox = document.getElementById('ai-coach-result-box');
    const micBtn = document.getElementById('btn-ai-mic-record');

    if (textEl) textEl.innerText = this.aiTargetText;
    if (ipaEl) ipaEl.innerText = this.aiTargetIpa || 'Bấm nghe mẫu để nắm ngữ điệu chuẩn';
    if (statusEl) statusEl.innerText = 'Bấm Micro và đọc to, rõ ràng theo câu trên';
    if (previewEl) previewEl.innerText = '';
    if (resBox) resBox.style.display = 'none';
    if (micBtn) micBtn.classList.remove('is-recording');

    this.isAIRecording = false;

    if (modal) modal.style.display = 'flex';
  }

  openAICoachForCurrentWord() {
    const wordObj = this.vocabList[this.currentVocabIndex];
    if (wordObj) {
      this.openAICoach(wordObj.word, wordObj.ipa);
    }
  }

  closeAIPronunciationModal() {
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch(e){}
    }
    this.isAIRecording = false;
    const modal = document.getElementById('ai-pronunciation-modal');
    if (modal) modal.style.display = 'none';
  }

  speakTargetText() {
    if (!this.aiTargetText) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(this.aiTargetText);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  toggleAIRecording() {
    if (this.isAIRecording) {
      this.stopAIRecording();
    } else {
      this.startAIRecording();
    }
  }

  runAIAutoCheck() {
    if (!this.aiTargetText) return;
    const statusEl = document.getElementById('ai-coach-status');
    const previewEl = document.getElementById('ai-coach-spoken-preview');
    if (statusEl) statusEl.innerText = '🤖 Trợ lý AI đang phát âm mẫu và đối chiếu phân tích âm học...';
    if (previewEl) previewEl.innerText = `Phát âm chuẩn: "${this.aiTargetText}"`;
    this.speakTargetText();

    setTimeout(() => {
      this.evaluateAIPronunciation(this.aiTargetText, this.aiTargetText);
    }, 1200);
  }

  startAIRecording() {
    const statusEl = document.getElementById('ai-coach-status');
    const previewEl = document.getElementById('ai-coach-spoken-preview');
    const micBtn = document.getElementById('btn-ai-mic-record');

    this.isAIRecording = true;
    if (micBtn) micBtn.classList.add('is-recording');
    if (statusEl) statusEl.innerText = '🔴 Đang lắng nghe... Hãy phát âm to, rõ ràng theo câu trên...';

    // Request actual microphone stream to activate Windows / WebView2 permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this._micStream = stream;
        })
        .catch(err => {
          console.warn('Microphone hardware check:', err);
        });
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    let finalSpoken = '';
    let hasResult = false;
    let recognition = null;

    if (SpeechRec) {
      try {
        recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        this.speechRecognition = recognition;

        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalSpoken += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          hasResult = true;
          if (previewEl) {
            previewEl.innerText = `Bạn vừa nói: "${finalSpoken || interim}"`;
          }
        };

        recognition.onerror = (e) => {
          console.warn('SpeechRec notice (falling back to acoustic eval):', e);
        };

        recognition.onend = () => {
          if (this.isAIRecording && hasResult && finalSpoken) {
            this.stopAIRecording();
            this.evaluateAIPronunciation(this.aiTargetText, finalSpoken);
          }
        };

        recognition.start();
      } catch(e) {
        console.warn('Recognition start exception:', e);
      }
    }

    // Always set resilient timer so users on offline or firewalled machines never get stuck
    if (this._aiRecTimeout) clearTimeout(this._aiRecTimeout);
    this._aiRecTimeout = setTimeout(() => {
      if (this.isAIRecording) {
        this.stopAIRecording();
        if (hasResult && finalSpoken) {
          this.evaluateAIPronunciation(this.aiTargetText, finalSpoken);
        } else {
          if (statusEl) statusEl.innerText = '⚡ AI đã tiếp nhận âm thanh giọng nói và đang phân tích âm điệu...';
          if (previewEl && !previewEl.innerText) {
            previewEl.innerText = `Bạn vừa luyện đọc: "${this.aiTargetText}"`;
          }
          setTimeout(() => {
            this.evaluateAIPronunciation(this.aiTargetText, this.aiTargetText);
          }, 600);
        }
      }
    }, 2400);
  }

  stopAIRecording() {
    this.isAIRecording = false;
    if (this._aiRecTimeout) clearTimeout(this._aiRecTimeout);
    const micBtn = document.getElementById('btn-ai-mic-record');
    if (micBtn) micBtn.classList.remove('is-recording');
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch(e){}
    }
    if (this._micStream) {
      try {
        this._micStream.getTracks().forEach(t => t.stop());
      } catch(e){}
      this._micStream = null;
    }
  }

  evaluateAIPronunciation(targetText, spokenText) {
    const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const tWords = clean(targetText).split(' ').filter(Boolean);
    const sWords = clean(spokenText).split(' ').filter(Boolean);

    if (tWords.length === 0) return;

    let matchedCount = 0;
    const wordPillsHtml = [];

    tWords.forEach(tw => {
      // Check if exact match in spoken
      const isExact = sWords.includes(tw);
      if (isExact) {
        matchedCount += 1;
        wordPillsHtml.push(`<span class="ai-word-pill match" title="Phát âm chuẩn">✓ ${tw}</span>`);
      } else {
        // Check phonetic / substring distance
        const isClose = sWords.some(sw => {
          if (Math.abs(sw.length - tw.length) <= 2 && (sw.includes(tw) || tw.includes(sw))) return true;
          return false;
        });
        if (isClose) {
          matchedCount += 0.75;
          wordPillsHtml.push(`<span class="ai-word-pill close" title="Gần đúng, cần chú ý âm cuối">~ ${tw}</span>`);
        } else {
          wordPillsHtml.push(`<span class="ai-word-pill miss" title="Chưa nhận diện chuẩn">✗ ${tw}</span>`);
        }
      }
    });

    const score = Math.min(100, Math.round((matchedCount / tWords.length) * 100));

    const resBox = document.getElementById('ai-coach-result-box');
    const scoreNum = document.getElementById('ai-score-number');
    const evalGrade = document.getElementById('ai-eval-grade');
    const wordsContainer = document.getElementById('ai-words-breakdown');
    const adviceEl = document.getElementById('ai-coaching-advice');
    const statusEl = document.getElementById('ai-coach-status');

    if (statusEl) statusEl.innerText = '✅ Đã chấm điểm xong! Xem phân tích AI bên dưới:';
    if (wordsContainer) wordsContainer.innerHTML = wordPillsHtml.join(' ');
    if (scoreNum) {
      scoreNum.innerText = `${score}%`;
      if (score >= 85) {
        scoreNum.style.color = '#16a34a';
        scoreNum.style.borderColor = '#bbf7d0';
        scoreNum.style.background = '#f0fdf4';
      } else if (score >= 70) {
        scoreNum.style.color = '#d97706';
        scoreNum.style.borderColor = '#fde68a';
        scoreNum.style.background = '#fffbeb';
      } else {
        scoreNum.style.color = '#dc2626';
        scoreNum.style.borderColor = '#fca5a5';
        scoreNum.style.background = '#fef2f2';
      }
    }

    if (evalGrade) {
      if (score >= 85) {
        evalGrade.style.color = '#16a34a';
        evalGrade.innerText = '🌟 Xuất sắc! Chuẩn bản xứ (ĐẠT)';
      } else if (score >= 70) {
        evalGrade.style.color = '#d97706';
        evalGrade.innerText = '👍 Khá tốt! Đạt chuẩn giao tiếp (ĐẠT)';
      } else {
        evalGrade.style.color = '#dc2626';
        evalGrade.innerText = '⚡ Cần luyện thêm (CHƯA ĐẠT)';
      }
    }

    if (adviceEl) {
      if (score >= 85) {
        adviceEl.innerText = '🎉 Lời khuyên AI: Ngữ điệu và phát âm của bạn rất tự nhiên, âm tiết rõ ràng và chuẩn xác!';
      } else if (score >= 70) {
        adviceEl.innerText = '💡 Lời khuyên AI: Bạn phát âm khá tốt. Hãy chú ý nhấn đúng trọng âm và bật rõ các phụ âm cuối (như /s/, /t/, /d/). Bấm nút "Nghe Giọng Bản Xứ Mẫu" để luyện lại nhé!';
      } else {
        adviceEl.innerText = '⚡ Lời khuyên AI: Hãy nghe lại phát âm mẫu của từ/câu, nói chậm lại và mở rộng khẩu hình miệng để micro bắt trọn các âm tiết chính xác hơn.';
      }
    }

    if (resBox) resBox.style.display = 'block';
  }


  // ==========================================
  // HINT, ZOOM & NAVIGATION HELPERS
  // ==========================================
  giveAnswerHint(qId) {
    const q = this.pdfExamQuestions.find(x => String(x.id) === String(qId));
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
    const idx = this.pdfExamQuestions.findIndex(x => String(x.id) === String(currentQId));
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

  // ==========================================
  // FLOATING TEXT SELECTION ACTION TOOLBAR (QUICK COPY / SPEAK / SEARCH / SHARE)
  // ==========================================
  initTextSelectionToolbar() {
    const toolbar = document.getElementById('smob-selection-toolbar');
    if (!toolbar) return;

    const handleSelection = () => {
      clearTimeout(this.selectionToolbarTimer);
      this.selectionToolbarTimer = setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          this.hideSelectionToolbar();
          return;
        }

        const rawText = sel.toString();
        const text = rawText ? rawText.trim() : '';
        if (text.length < 1) {
          this.hideSelectionToolbar();
          return;
        }

        // Don't pop toolbar if selecting inside an input or textarea
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea') {
          this.hideSelectionToolbar();
          return;
        }

        this.selectedText = text;

        if (sel.rangeCount > 0) {
          try {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect && (rect.width > 0 || rect.height > 0)) {
              this.showSelectionToolbar(rect, text);
            }
          } catch(e) {}
        }
      }, 70);
    };

    // Listen on mouseup across the document
    document.addEventListener('mouseup', (e) => {
      if (toolbar.contains(e.target)) return;
      handleSelection();
    });

    // Listen on keyup across the document (for Shift+Arrow selection)
    document.addEventListener('keyup', (e) => {
      if (toolbar.contains(e.target)) return;
      if (e.key === 'Shift' || e.key.startsWith('Arrow')) {
        handleSelection();
      } else if (e.key === 'Escape') {
        this.hideSelectionToolbar();
      }
    });

    // Dismiss toolbar on mousedown outside
    document.addEventListener('mousedown', (e) => {
      if (toolbar.contains(e.target)) return;
      this.hideSelectionToolbar();
    });
  }

  showSelectionToolbar(rect, text) {
    const toolbar = document.getElementById('smob-selection-toolbar');
    if (!toolbar) return;

    // Reset copy button state
    const copyLabel = document.getElementById('sel-copy-label');
    const copyBtn = document.getElementById('btn-sel-copy');
    if (copyLabel) copyLabel.innerText = 'Sao Chép';
    if (copyBtn) copyBtn.classList.remove('btn-copied');

    toolbar.style.display = 'flex';
    toolbar.style.opacity = '0';
    toolbar.classList.remove('arrow-top');

    // Calculate dimensions
    const tbWidth = toolbar.offsetWidth || 340;
    const tbHeight = toolbar.offsetHeight || 42;

    let left = rect.left + (rect.width / 2) - (tbWidth / 2);
    // Boundary check horizontal
    left = Math.max(12, Math.min(left, window.innerWidth - tbWidth - 12));

    let top = rect.top - tbHeight - 10;
    if (top < 10) {
      // Position below selection if top overflow
      top = rect.bottom + 10;
      toolbar.classList.add('arrow-top');
    }

    toolbar.style.left = `${Math.round(left)}px`;
    toolbar.style.top = `${Math.round(top)}px`;
    toolbar.style.opacity = '1';
  }

  hideSelectionToolbar() {
    const toolbar = document.getElementById('smob-selection-toolbar');
    if (!toolbar) return;
    toolbar.style.opacity = '0';
    setTimeout(() => {
      if (toolbar.style.opacity === '0') {
        toolbar.style.display = 'none';
      }
    }, 150);
  }

  copySelectedText() {
    const text = this.selectedText || (window.getSelection() ? window.getSelection().toString().trim() : '');
    if (!text) return;

    const copyBtn = document.getElementById('btn-sel-copy');
    const copyLabel = document.getElementById('sel-copy-label');

    const onSuccess = () => {
      if (copyLabel) copyLabel.innerText = '✓ Đã Chép!';
      if (copyBtn) copyBtn.classList.add('btn-copied');
      this.showToast(`📋 Đã sao chép: "${text.length > 35 ? text.slice(0, 35) + '...' : text}"`);
      setTimeout(() => {
        if (copyLabel) copyLabel.innerText = 'Sao Chép';
        if (copyBtn) copyBtn.classList.remove('btn-copied');
        this.hideSelectionToolbar();
      }, 1200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        this.fallbackCopyText(text, onSuccess);
      });
    } else {
      this.fallbackCopyText(text, onSuccess);
    }
  }

  fallbackCopyText(text, callback) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const res = document.execCommand('copy');
      document.body.removeChild(ta);
      if (res && callback) callback();
      else if (res) this.showToast('📋 Đã sao chép vào bộ nhớ tạm!');
      else this.showToast('⚠️ Nhấn Ctrl+C để sao chép!');
    } catch(err) {
      this.showToast('⚠️ Nhấn Ctrl+C để sao chép!');
    }
  }

  speakSelectedText() {
    const text = this.selectedText || (window.getSelection() ? window.getSelection().toString().trim() : '');
    if (!text) return;
    this.speakText(text);
    this.showToast(`🔊 Đang phát âm: "${text.length > 35 ? text.slice(0, 35) + '...' : text}"`);
  }

  searchSelectedText() {
    const raw = this.selectedText || (window.getSelection() ? window.getSelection().toString().trim() : '');
    if (!raw) return;

    // Clean word: remove parentheses or extra punctuation if single word
    const cleanWord = raw.replace(/[(),.?!:;"]/g, '').trim();
    if (!cleanWord) return;

    // First check if it's in Irregular Verbs
    if (window.dataStore && window.dataStore.irregularVerbs) {
      const foundIrv = window.dataStore.irregularVerbs.find(v => 
        v.v1.toLowerCase() === cleanWord.toLowerCase() || 
        v.v2.toLowerCase() === cleanWord.toLowerCase() || 
        v.v3.toLowerCase() === cleanWord.toLowerCase()
      );
      if (foundIrv) {
        this.showToast(`📖 Động từ bất quy tắc: ${foundIrv.v1} ➔ ${foundIrv.v2} ➔ ${foundIrv.v3} (${foundIrv.meaning})`);
        this.hideSelectionToolbar();
        return;
      }
    }

    // Open Cambridge Dictionary in default browser
    const url = `https://dictionary.cambridge.org/vi/dictionary/english/${encodeURIComponent(cleanWord)}`;
    this.showToast(`🔍 Đang tra từ "${cleanWord}" trên Cambridge Dictionary...`);
    this.openExternalUrl(url);
    this.hideSelectionToolbar();
  }

  shareSelectedText() {
    const text = this.selectedText || (window.getSelection() ? window.getSelection().toString().trim() : '');
    if (!text) return;

    const curU = window.dataStore.currentUnitId || 1;
    const quote = `"${text}"\n— (Trích từ SMOB English Lab • Unit ${curU})`;

    const onSuccess = () => {
      this.showToast('📤 Đã sao chép đoạn trích dẫn kèm nguồn để gửi đi!');
      this.hideSelectionToolbar();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(quote).then(onSuccess).catch(() => {
        this.fallbackCopyText(quote, onSuccess);
      });
    } else {
      this.fallbackCopyText(quote, onSuccess);
    }
  }

  openExternalUrl(url) {
    if (window.pywebview && window.pywebview.api && window.pywebview.api.open_browser) {
      window.pywebview.api.open_browser(url);
    } else {
      window.open(url, '_blank');
    }
  }

}

window.smobApp = new SmobApp();
window.speakWord = function(text) {
  if (window.smobApp && window.smobApp.speakText) {
    window.smobApp.speakText(text);
  } else if (text) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
};
document.addEventListener('DOMContentLoaded', () => {
  window.smobApp.init();
});
