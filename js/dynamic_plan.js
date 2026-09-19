// SMOB English Lab - Dynamic Study Plan & Intelligent Rescheduling Engine
// Version 1.0 (Real-time Pacing, Circular Progress Gauge & Auto-Slide Engine)

class SmobDynamicPlan {
  constructor() {
    this.storageKey = 'smob_dynamic_plan_v1';
    this.tetDate = new Date(2027, 1, 6); // 06/02/2027 (Tet Dinh Mui)
    this.startDate = new Date(2026, 8, 19); // 19/09/2026
    this.unit18StartDate = new Date(2026, 8, 28); // 28/09/2026
    this.companyTripStart = new Date(2026, 10, 26); // 26/11/2026
    this.companyTripEnd = new Date(2026, 10, 29); // 29/11/2026
    this.activeFilter = 'all'; // all | active | p0 | p1 | p2 | p3 | p4
    this.simulatedToday = null; // for testing/simulation

    this.state = this.loadState();
    this.recalculateDynamicSchedule();
  }

  // Baseline title & stage dictionary for all 48 units
  getUnitMetadata(uid) {
    if (window.SMOB_UNITS && window.SMOB_UNITS.length) {
      const found = window.SMOB_UNITS.find(u => Number(u.unit_number || u.unit_id) === Number(uid));
      if (found) return found;
    }
    return {
      unit_number: uid,
      title: `Unit ${uid}`,
      stage_name: uid <= 17 ? 'Nền tảng cốt lõi (1-17)' : 'Nâng cao & Luyện nghe (18-48)'
    };
  }

  // Initialize fresh baseline state
  initFreshState() {
    const units = {};
    for (let i = 1; i <= 48; i++) {
      const meta = this.getUnitMetadata(i);
      units[i] = {
        id: i,
        title: meta.title || `Unit ${i}`,
        stageName: meta.stage_name || '',
        status: i <= 9 ? 'in_progress' : 'pending', // default user noted they reviewed up to unit 9
        completedDate: null,
        notes: ''
      };
    }

    return {
      version: 1,
      createdAt: new Date().toISOString(),
      lastRecalculated: new Date().toISOString(),
      simulatedDateStr: null,
      units: units
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.units && Object.keys(parsed.units).length === 48) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load dynamic plan state from localStorage:', e);
    }
    const fresh = this.initFreshState();
    this.saveState(fresh);
    return fresh;
  }

  saveState(customState = null) {
    const dataToSave = customState || this.state;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving dynamic plan state:', e);
    }
  }

  // Format date helper DD/MM/YYYY
  formatDate(d) {
    if (!d) return '--/--/----';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '--/--/----';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatShortDate(d) {
    if (!d) return '--/--';
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return '--/--';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  getDayOfWeekStr(d) {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[d.getDay()];
  }

  // Check if date is a study day for advanced units (Mon - Thu only, skipping company trip)
  isValidStudyDay(d) {
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    // Only Mon (1), Tue (2), Wed (3), Thu (4)
    if (dayOfWeek < 1 || dayOfWeek > 4) return false;

    // Check company trip (25/11 prep, 26-29/11 trip)
    const y = d.getFullYear();
    const m = d.getMonth();
    const dt = d.getDate();
    if (y === 2026 && m === 10) { // month 10 = Nov
      if (dt >= 25 && dt <= 29) return false;
    }
    return true;
  }

  getNextValidStudyDay(fromDate) {
    const cur = new Date(fromDate);
    while (!this.isValidStudyDay(cur)) {
      cur.setDate(cur.getDate() + 1);
    }
    return cur;
  }

  // Core Rescheduling Engine
  recalculateDynamicSchedule() {
    const now = this.simulatedToday ? new Date(this.simulatedToday) : new Date();
    const computedUnits = {};

    // 1. Calculate Baseline Dates for All 48 Units (Reference point)
    // Phase 0: Units 1 - 17 (19/09/2026 - 25/09/2026)
    const p0Baseline = {
      1: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      2: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      3: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      4: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      5: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      6: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      7: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      8: { s: new Date(2026, 8, 19), e: new Date(2026, 8, 19) },
      9: { s: new Date(2026, 8, 20), e: new Date(2026, 8, 20) },
      10: { s: new Date(2026, 8, 20), e: new Date(2026, 8, 20) },
      11: { s: new Date(2026, 8, 20), e: new Date(2026, 8, 20) },
      12: { s: new Date(2026, 8, 21), e: new Date(2026, 8, 21) },
      13: { s: new Date(2026, 8, 21), e: new Date(2026, 8, 21) },
      14: { s: new Date(2026, 8, 22), e: new Date(2026, 8, 22) },
      15: { s: new Date(2026, 8, 23), e: new Date(2026, 8, 23) },
      16: { s: new Date(2026, 8, 24), e: new Date(2026, 8, 24) },
      17: { s: new Date(2026, 8, 25), e: new Date(2026, 8, 25) }
    };

    // Calculate baseline dates for units 18..48
    let curBaselineDay = new Date(2026, 8, 28); // Mon 28/09/2026
    const baselineDates = { ...p0Baseline };

    for (let u = 18; u <= 48; u++) {
      curBaselineDay = this.getNextValidStudyDay(curBaselineDay);
      const startDay = new Date(curBaselineDay);
      // Advance 1 study day for second half of unit
      curBaselineDay.setDate(curBaselineDay.getDate() + 1);
      curBaselineDay = this.getNextValidStudyDay(curBaselineDay);
      const endDay = new Date(curBaselineDay);
      baselineDates[u] = { s: startDay, e: endDay };
      // Move to next study day for subsequent unit
      curBaselineDay.setDate(curBaselineDay.getDate() + 1);
    }

    const baselineFinishDate = baselineDates[48].e; // baseline finish: Thu 14/01/2027

    // 2. Compute Dynamic Rescheduled Dates Based on Current Progress & Real-time Date
    let completedCount = 0;
    let inProgressCount = 0;
    let pendingCount = 0;

    for (let u = 1; u <= 48; u++) {
      const uState = this.state.units[u] || { status: 'pending' };
      if (uState.status === 'completed') completedCount++;
      else if (uState.status === 'in_progress') inProgressCount++;
      else pendingCount++;
    }

    // Determine if any past units are actually overdue
    // A unit is overdue if:
    // status !== 'completed' AND now > baselineEnd + 1 day
    let hasOverdueUnits = false;
    for (let u = 1; u <= 48; u++) {
      const uState = this.state.units[u] || { status: 'pending' };
      const base = baselineDates[u];
      if (uState.status !== 'completed' && now.getTime() > base.e.getTime() + (24 * 3600 * 1000)) {
        hasOverdueUnits = true;
        break;
      }
    }

    // If no past units are overdue and we haven't started past deadlines, keep baseline schedule!
    if (!hasOverdueUnits && now <= this.unit18StartDate) {
      // Clean baseline mode: all units are on time!
      for (let u = 1; u <= 48; u++) {
        const uState = this.state.units[u] || { status: 'pending' };
        const base = baselineDates[u];
        const meta = this.getUnitMetadata(u);

        computedUnits[u] = {
          ...uState,
          title: meta.title || `Unit ${u}`,
          stageName: meta.stage_name || '',
          baseStart: base.s,
          baseEnd: base.e,
          dynStart: base.s,
          dynEnd: uState.status === 'completed' && uState.completedDate ? new Date(uState.completedDate) : base.e,
          isShifted: false,
          dayDiff: 0
        };
      }
    } else {
      // Dynamic rescheduling mode: push incomplete units forward
      let curDynamicDate = new Date(now);

      for (let u = 1; u <= 48; u++) {
        const uState = this.state.units[u] || { status: 'pending' };
        const base = baselineDates[u];
        const meta = this.getUnitMetadata(u);

        let dynStart, dynEnd;

        if (uState.status === 'completed') {
          dynStart = base.s;
          dynEnd = uState.completedDate ? new Date(uState.completedDate) : base.e;
        } else {
          // Incomplete unit
          if (u <= 17) {
            // If now is before this unit's scheduled day, keep its baseline day
            if (now <= base.e) {
              dynStart = base.s;
              dynEnd = base.e;
            } else {
              // Unit is overdue: assign to current dynamic date
              dynStart = new Date(curDynamicDate);
              dynEnd = new Date(curDynamicDate);
              // Advance 1 day for next incomplete unit
              curDynamicDate.setDate(curDynamicDate.getDate() + 1);
            }
          } else {
            // Advanced units (18..48)
            if (curDynamicDate < this.unit18StartDate) {
              curDynamicDate = new Date(this.unit18StartDate);
            }
            curDynamicDate = this.getNextValidStudyDay(curDynamicDate);
            dynStart = new Date(curDynamicDate);

            if (uState.status === 'in_progress') {
              // 1 study day remaining
              dynEnd = new Date(dynStart);
              curDynamicDate.setDate(curDynamicDate.getDate() + 1);
            } else {
              // 2 study days
              curDynamicDate.setDate(curDynamicDate.getDate() + 1);
              curDynamicDate = this.getNextValidStudyDay(curDynamicDate);
              dynEnd = new Date(curDynamicDate);
              curDynamicDate.setDate(curDynamicDate.getDate() + 1);
            }
          }
        }

        const isShifted = dynEnd.getTime() > base.e.getTime() + (24 * 3600 * 1000);
        const dayDiff = Math.max(0, Math.round((dynEnd.getTime() - base.e.getTime()) / (24 * 3600 * 1000)));

        computedUnits[u] = {
          ...uState,
          title: meta.title || `Unit ${u}`,
          stageName: meta.stage_name || '',
          baseStart: base.s,
          baseEnd: base.e,
          dynStart: dynStart,
          dynEnd: dynEnd,
          isShifted: isShifted,
          dayDiff: dayDiff
        };
      }
    }

    const projectedFinish = computedUnits[48].dynEnd;
    const diffMs = projectedFinish.getTime() - baselineFinishDate.getTime();
    const delayDays = Math.round(diffMs / (24 * 3600 * 1000));

    // Days before Tet
    const msBeforeTet = this.tetDate.getTime() - projectedFinish.getTime();
    const daysBeforeTet = Math.round(msBeforeTet / (24 * 3600 * 1000));

    const percent = Number(((completedCount / 48) * 100).toFixed(1));

    this.computed = {
      completedCount,
      inProgressCount,
      pendingCount,
      percent,
      baselineFinishDate,
      projectedFinish,
      delayDays,
      daysBeforeTet,
      units: computedUnits
    };

    return this.computed;
  }

  // Update a single unit status
  setUnitStatus(unitId, newStatus) {
    const uid = Number(unitId);
    if (!this.state.units[uid]) return;

    this.state.units[uid].status = newStatus;
    if (newStatus === 'completed') {
      this.state.units[uid].completedDate = new Date().toISOString();
    } else {
      this.state.units[uid].completedDate = null;
    }

    this.saveState();
    this.recalculateDynamicSchedule();
    this.render();
    this.renderDashboardWidget();

    // Show toast
    const statusText = newStatus === 'completed' ? 'Hoàn thành 100%' : (newStatus === 'in_progress' ? 'Đang học Ngày 1' : 'Chưa học');
    this.showToast(`✓ Đã cập nhật Unit ${uid}: ${statusText}. Lịch trình đã tự động đồng bộ!`);
  }

  // Cycle status: pending -> in_progress -> completed -> pending
  cycleUnitStatus(unitId) {
    const uid = Number(unitId);
    const cur = this.state.units[uid]?.status || 'pending';
    let next = 'in_progress';
    if (cur === 'in_progress') next = 'completed';
    else if (cur === 'completed') next = 'pending';
    this.setUnitStatus(uid, next);
  }

  // Batch mark range
  markUnitsUpTo(maxUid) {
    for (let u = 1; u <= maxUid; u++) {
      if (this.state.units[u]) {
        this.state.units[u].status = 'completed';
        if (!this.state.units[u].completedDate) {
          this.state.units[u].completedDate = new Date().toISOString();
        }
      }
    }
    this.saveState();
    this.recalculateDynamicSchedule();
    this.render();
    this.renderDashboardWidget();
    this.showToast(`🎉 Đã đánh dấu hoàn thành từ Unit 1 đến Unit ${maxUid}!`);
  }

  // Sync with dataStore test results
  syncFromDataStore() {
    if (!window.dataStore) return;
    const completedInStore = window.dataStore.userProgress?.completedUnits || [];
    let added = 0;
    completedInStore.forEach(uid => {
      const u = Number(uid);
      if (this.state.units[u] && this.state.units[u].status !== 'completed') {
        this.state.units[u].status = 'completed';
        this.state.units[u].completedDate = new Date().toISOString();
        added++;
      }
    });

    this.saveState();
    this.recalculateDynamicSchedule();
    this.render();
    this.renderDashboardWidget();
    this.showToast(added > 0 ? `✓ Đã tự động đồng bộ ${added} Unit hoàn thành từ hệ thống bài thi!` : `Dữ liệu kế hoạch đã khớp với hệ thống bài thi.`);
  }

  // Reset to default baseline
  resetToDefault() {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ kế hoạch về mặc định ban đầu không?')) {
      this.state = this.initFreshState();
      this.simulatedToday = null;
      this.saveState();
      this.recalculateDynamicSchedule();
      this.render();
      this.renderDashboardWidget();
      this.showToast('✓ Đã khôi phục kế hoạch học tập về mặc định!');
    }
  }

  // Open PDF file via Desktop API or download link
  openPlanPdf(type = 'master') {
    const pdfFile = type === 'week1' 
      ? "D:\\2.English\\Ke_Hoach_Hoc_Tieng_Anh_Tuan_1_SMOB.pdf" 
      : "D:\\2.English\\Lo_Trinh_48_Ngay_Thong_Tha_SMOB.pdf";

    if (window.pywebview?.api?.launch_pdf) {
      window.pywebview.api.launch_pdf(pdfFile).then(res => {
        if (res.status !== 'SUCCESS') {
          this.showToast('Không thể mở file PDF: ' + (res.message || 'Lỗi không xác định'));
        }
      });
    } else {
      window.open(pdfFile, '_blank');
    }
  }

  showToast(msg) {
    if (window.smobApp?.showToast) {
      window.smobApp.showToast(msg);
      return;
    }
    const toast = document.createElement('div');
    toast.className = 'smob-toast-item smob-toast-visible';
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '999999';
    toast.style.background = '#0f172a';
    toast.style.color = '#ffffff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    toast.style.fontSize = '13px';
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3200);
  }

  // ==========================================
  // UI RENDERERS
  // ==========================================

  // Render SVG Circular Donut Chart
  renderCircularGaugeSvg(percent, size = 180, strokeWidth = 14) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const safePercent = Math.min(Math.max(percent, 0), 100);
    const strokeDashoffset = circumference - (safePercent / 100) * circumference;

    return `
      <div class="circular-gauge-wrap" style="position: relative; width: ${size}px; height: ${size}px; display: inline-flex; align-items: center; justify-content: center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); overflow: visible;">
          <defs>
            <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
            <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.35" />
            </filter>
          </defs>
          <!-- Background track -->
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" 
            fill="none" 
            stroke="var(--border-subtle, rgba(0,0,0,0.08))" 
            stroke-width="${strokeWidth}" 
          />
          <!-- Animated Progress Stroke -->
          <circle cx="${size/2}" cy="${size/2}" r="${radius}" 
            fill="none" 
            stroke="url(#circleGrad)" 
            stroke-width="${strokeWidth}" 
            stroke-linecap="round"
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${strokeDashoffset}"
            filter="url(#gaugeShadow)"
            style="transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);"
          />
        </svg>
        <div class="gauge-center-text" style="position: absolute; text-align: center; pointer-events: none;">
          <div style="font-size: ${size > 140 ? '28px' : '20px'}; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; line-height: 1;">
            ${safePercent}%
          </div>
          <div style="font-size: ${size > 140 ? '11px' : '9px'}; font-weight: 600; color: var(--text-secondary); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
            Hoàn Thành
          </div>
        </div>
      </div>
    `;
  }

  // Render Mini Widget for Dashboard
  renderDashboardWidget() {
    const container = document.getElementById('dash-dynamic-plan-widget');
    if (!container) return;

    const { completedCount, inProgressCount, pendingCount, percent, projectedFinish, delayDays, daysBeforeTet } = this.computed;
    const finishStr = this.formatDate(projectedFinish);

    let statusTag = '';
    if (delayDays <= 0) {
      statusTag = `<span class="plan-badge-status status-on-track">🟢 Đúng Tiến Độ</span>`;
    } else {
      statusTag = `<span class="plan-badge-status status-delayed">🔄 Tự Dời +${delayDays} Ngày</span>`;
    }

    container.innerHTML = `
      <div class="apple-card" style="padding: 18px 22px; margin-bottom: 20px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 18px;">
          ${this.renderCircularGaugeSvg(percent, 92, 9)}
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 16px; font-weight: 800; color: var(--text-primary);">📅 Tiến Độ Lộ Trình 48 Ngày</span>
              ${statusTag}
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
              Đã hoàn thành: <strong style="color:var(--success);">${completedCount}/48 Units</strong> • Đang học: <strong style="color:var(--warning);">${inProgressCount}</strong> • Còn lại: <strong>${pendingCount}</strong>
            </div>
            <div style="font-size: 12px; color: var(--text-tertiary);">
              🎯 Dự kiến về đích: <strong style="color:var(--accent); font-weight:700;">${finishStr}</strong> • Cách Tết Đinh Mùi: <strong style="color:#dc2626;">${daysBeforeTet} ngày</strong>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.syncFromDataStore()" style="font-size: 12.5px; padding: 8px 14px;">
            🔄 Đồng Bộ Điểm Thi
          </button>
          <button class="apple-btn btn-primary" onclick="window.smobApp.navigate('study-plan')" style="font-size: 12.5px; padding: 8px 18px; font-weight: 700;">
            Xem Kế Hoạch Động Chi Tiết →
          </button>
        </div>
      </div>
    `;
  }

  // Render Full View (#view-study-plan)
  render() {
    const viewContainer = document.getElementById('view-study-plan');
    if (!viewContainer) return;

    const { completedCount, inProgressCount, pendingCount, percent, baselineFinishDate, projectedFinish, delayDays, daysBeforeTet, units } = this.computed;

    const finishStr = this.formatDate(projectedFinish);
    const baselineStr = this.formatDate(baselineFinishDate);

    // Alert banner message
    let alertBanner = '';
    if (delayDays > 0) {
      alertBanner = `
        <div class="dynamic-plan-alert delayed" style="margin-bottom: 18px; padding: 12px 18px; border-radius: 12px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">🔄</span>
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: #b45309;">
                Hệ Thống Đã Tự Động Dời Lịch (+${delayDays} Ngày) Theo Thực Tế
              </div>
              <div style="font-size: 12px; color: #92400e; margin-top: 2px;">
                Do có tuần chưa kịp hoàn thành đủ 2 Unit, các bài tiếp theo đã được tự động đẩy về các ngày Thứ 2 – Thứ 5 kế tiếp. Ngày hoàn thành mới: <strong>${finishStr}</strong> (Vẫn kịp thảnh thơi trước Tết <strong>${daysBeforeTet} ngày</strong>)!
              </div>
            </div>
          </div>
          <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.recalculateDynamicSchedule(); window.dynamicPlan.render();" style="font-size: 12px; padding: 6px 14px;">
            ⚡ Cập Nhật Lại Ngay
          </button>
        </div>
      `;
    } else {
      alertBanner = `
        <div class="dynamic-plan-alert on-track" style="margin-bottom: 18px; padding: 12px 18px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">🟢</span>
            <div>
              <div style="font-size: 13.5px; font-weight: 700; color: #047857;">
                Tuyệt Vời! Bạn Đang Giữ Đúng Kế Hoạch Chiến Lược
              </div>
              <div style="font-size: 12px; color: #065f46; margin-top: 2px;">
                Duy trì nhịp độ 2 ngày / 1 Unit (Thứ 2 ➔ Thứ 5, Thứ 6 chill). Ngày về đích: <strong>${finishStr}</strong>, cách Tết Nguyên Đán <strong>${daysBeforeTet} ngày</strong>!
              </div>
            </div>
          </div>
          <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.openPlanPdf('master')" style="font-size: 12px; padding: 6px 14px;">
            📄 Mở Bản In PDF A4
          </button>
        </div>
      `;
    }

    // Build Grouped Weeks Table
    // Group units into weeks
    let htmlWeeks = '';
    
    // Phase 0: Week 0 (Units 1 - 17)
    const p0Units = [];
    for (let u = 1; u <= 17; u++) p0Units.push(units[u]);

    htmlWeeks += this.renderWeekAccordion(0, "19/09 – 25/09/2026", "GIAI ĐOẠN 0: CỦNG CỐ NỀN MÓNG CỐT LÕI (UNIT 01 ➔ 17)", p0Units, false, false);

    // Advanced Weeks (Tuần 1 -> Tuần 16)
    // Week 1: 18, 19
    // Week 2: 20, 21
    // ...
    // Week 9: 34 (Company trip)
    // ...
    let curU = 18;
    let wIndex = 1;
    while (curU <= 48) {
      if (curU === 34) {
        // Week 9 company trip
        const uList = [units[34]];
        const dRange = `${this.formatShortDate(units[34].dynStart)} – ${this.formatShortDate(units[34].dynEnd)}`;
        htmlWeeks += this.renderWeekAccordion(wIndex, dRange, "TUẦN 09: UNIT 34 & 🏖️ NGHỈ ĐI CHƠI CÔNG TY (26–29/11)", uList, true, false);
        curU += 1;
        wIndex++;
        continue;
      }

      const u1 = units[curU];
      const u2 = units[curU + 1] || null;
      const uList = u2 ? [u1, u2] : [u1];
      const isLast = (curU >= 47);

      const dRange = `${this.formatShortDate(u1.dynStart)} – ${this.formatShortDate(uList[uList.length - 1].dynEnd)}`;
      const title = isLast 
        ? `TUẦN ${String(wIndex).padStart(2, '0')}: UNIT 47, 48 & 🎓 ĐẠI LỄ TỐT NGHIỆP 48 NGÀY`
        : `TUẦN ${String(wIndex).padStart(2, '0')}: UNIT ${String(u1.id).padStart(2, '0')} ${u2 ? '& ' + String(u2.id).padStart(2, '0') : ''}`;

      htmlWeeks += this.renderWeekAccordion(wIndex, dRange, title, uList, false, isLast);
      curU += u2 ? 2 : 1;
      wIndex++;
    }

    viewContainer.innerHTML = `
      <div class="dynamic-plan-container" style="max-width: 1200px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- TOP EXECUTIVE CARDS & CIRCULAR GAUGE -->
        <div class="apple-card" style="padding: 24px; border-radius: 18px; margin-bottom: 20px; background: var(--bg-card); box-shadow: var(--shadow-sm); border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;">
            
            <!-- Left: Donut Chart & Pacing Philosophy -->
            <div style="display: flex; align-items: center; gap: 24px;">
              ${this.renderCircularGaugeSvg(percent, 140, 14)}
              <div>
                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 980px; background: rgba(0, 113, 227, 0.1); color: var(--accent); font-size: 11.5px; font-weight: 700; margin-bottom: 6px;">
                  <span>⚡</span> 2 NGÀY / 1 UNIT • ĐI TỪ TỪ MÀ CHẮC
                </div>
                <h2 style="font-size: 22px; font-weight: 800; color: var(--text-primary); margin: 0 0 4px; letter-spacing: -0.4px;">
                  Tiến Độ Kế Hoạch Toàn Khóa 48 Ngày
                </h2>
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                  Tự động dời lịch thông minh khi dang dở • Học Thứ 2–Thứ 5 (15p) • Thứ 6 Chill • Cuối tuần tự do.
                </div>
              </div>
            </div>

            <!-- Right: KPI Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; min-width: 320px;">
              
              <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Đã Hoàn Thành</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--success); margin-top: 2px;">
                  ${completedCount} <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">/ 48 Units</span>
                </div>
              </div>

              <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Đang Học Dở (Ngày 1)</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--warning); margin-top: 2px;">
                  ${inProgressCount} <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Units</span>
                </div>
              </div>

              <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Ngày Về Đích Thực Tế</div>
                <div style="font-size: 15px; font-weight: 800; color: var(--accent); margin-top: 4px;">
                  ${finishStr}
                </div>
              </div>

              <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-subtle);">
                <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Đón Tết Đinh Mùi 2027</div>
                <div style="font-size: 15px; font-weight: 800; color: #dc2626; margin-top: 4px;">
                  Trước Tết ${daysBeforeTet} Ngày 🎆
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- SMART ALERT BANNER -->
        ${alertBanner}

        <!-- TOOLBAR ACTIONS -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="apple-btn ${this.activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="window.dynamicPlan.setFilter('all')" style="font-size: 12px; padding: 6px 14px;">
              Tất Cả 48 Units
            </button>
            <button class="apple-btn ${this.activeFilter === 'active' ? 'btn-primary' : 'btn-secondary'}" onclick="window.dynamicPlan.setFilter('active')" style="font-size: 12px; padding: 6px 14px;">
              ⏳ Chưa Xong / Đang Dở
            </button>
            <button class="apple-btn ${this.activeFilter === 'p0' ? 'btn-primary' : 'btn-secondary'}" onclick="window.dynamicPlan.setFilter('p0')" style="font-size: 12px; padding: 6px 14px;">
              GĐ 0 (Unit 1–17)
            </button>
            <button class="apple-btn ${this.activeFilter === 'p1' ? 'btn-primary' : 'btn-secondary'}" onclick="window.dynamicPlan.setFilter('p1')" style="font-size: 12px; padding: 6px 14px;">
              GĐ 1–4 (Unit 18–48)
            </button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.syncFromDataStore()" title="Tự động quét và tích hoàn thành các bài thi đã làm">
              📥 Đồng Bộ Điểm Thi
            </button>
            <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.openPlanPdf('master')" title="Mở file PDF A4 đã được đóng gói sẵn">
              📄 Mở PDF Lộ Trình
            </button>
            <button class="apple-btn btn-secondary" onclick="window.dynamicPlan.resetToDefault()" title="Khôi phục trạng thái mặc định">
              🔄 Đặt Lại Gốc
            </button>
          </div>
        </div>

        <!-- WEEKS ACCORDION LIST -->
        <div class="dynamic-weeks-list">
          ${htmlWeeks}
        </div>

      </div>
    `;
  }

  setFilter(filterName) {
    this.activeFilter = filterName;
    this.render();
  }

  // Render a Single Week Card / Accordion
  renderWeekAccordion(weekNum, dateRange, title, unitsList, isTripWeek, isGradWeek) {
    // Filter units if needed
    let filteredList = unitsList;
    if (this.activeFilter === 'active') {
      filteredList = unitsList.filter(u => u.status !== 'completed');
      if (filteredList.length === 0) return '';
    } else if (this.activeFilter === 'p0') {
      filteredList = unitsList.filter(u => u.id <= 17);
      if (filteredList.length === 0) return '';
    } else if (this.activeFilter === 'p1') {
      filteredList = unitsList.filter(u => u.id >= 18);
      if (filteredList.length === 0) return '';
    }

    const completedInWeek = unitsList.filter(u => u.status === 'completed').length;
    const totalInWeek = unitsList.length;
    const isWeekFullyDone = completedInWeek === totalInWeek && totalInWeek > 0;

    let weekCardBorder = 'var(--border-subtle)';
    let weekHeaderBg = 'var(--bg-card)';
    if (isTripWeek) {
      weekCardBorder = 'rgba(245, 158, 11, 0.4)';
      weekHeaderBg = 'rgba(245, 158, 11, 0.06)';
    } else if (isGradWeek) {
      weekCardBorder = 'rgba(16, 185, 129, 0.4)';
      weekHeaderBg = 'rgba(16, 185, 129, 0.06)';
    }

    let unitsMarkup = '';
    for (const u of filteredList) {
      unitsMarkup += this.renderUnitRow(u);
    }

    return `
      <div class="apple-card week-card" style="margin-bottom: 16px; border-radius: 14px; border: 1px solid ${weekCardBorder}; background: var(--bg-card); overflow: hidden; box-shadow: var(--shadow-sm);">
        <div class="week-header" style="padding: 14px 20px; background: ${weekHeaderBg}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="plan-week-badge ${isTripWeek ? 'trip' : (isGradWeek ? 'grad' : '')}">
              ${weekNum === 0 ? 'GĐ.0' : 'Tuần ' + String(weekNum).padStart(2, '0')}
            </span>
            <div>
              <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">
                ${title}
              </div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
                🗓️ Lịch dự kiến: <strong>${dateRange}</strong>
              </div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 12.5px; font-weight: 600; color: ${isWeekFullyDone ? 'var(--success)' : 'var(--text-secondary)'};">
              ${isWeekFullyDone ? '✅ Đã Hoàn Thành Tuần' : `Tiến độ: ${completedInWeek}/${totalInWeek} Unit`}
            </div>
          </div>
        </div>

        <div class="week-units-body" style="padding: 10px 16px;">
          ${unitsMarkup}
        </div>
      </div>
    `;
  }

  // Render an Individual Unit Row
  renderUnitRow(u) {
    const isDone = u.status === 'completed';
    const isProg = u.status === 'in_progress';

    let statusBadge = '';
    if (isDone) {
      statusBadge = `<button class="plan-status-btn done" onclick="window.dynamicPlan.cycleUnitStatus(${u.id})" title="Bấm để đổi trạng thái">✅ Hoàn Thành</button>`;
    } else if (isProg) {
      statusBadge = `<button class="plan-status-btn prog" onclick="window.dynamicPlan.cycleUnitStatus(${u.id})" title="Bấm để đổi trạng thái">⏳ Đang Học Ngày 1</button>`;
    } else {
      statusBadge = `<button class="plan-status-btn pending" onclick="window.dynamicPlan.cycleUnitStatus(${u.id})" title="Bấm để đổi trạng thái">○ Chưa Học</button>`;
    }

    let delayNotice = '';
    if (u.isShifted && !isDone) {
      delayNotice = `<span style="display:inline-block; font-size:11px; padding:2px 8px; border-radius:6px; background:rgba(245,158,11,0.15); color:#b45309; font-weight:600; margin-left:8px;">🔄 Tự dời +${u.dayDiff} ngày</span>`;
    }

    const dateStr = u.id <= 17 
      ? this.formatDate(u.dynStart)
      : `${this.formatDate(u.dynStart)} ➔ ${this.formatDate(u.dynEnd)}`;

    return `
      <div class="plan-unit-row ${isDone ? 'is-done' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; border-bottom: 1px solid var(--border-subtle); transition: background 0.2s;">
        
        <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 250px;">
          <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.dynamicPlan.setUnitStatus(${u.id}, this.checked ? 'completed' : 'pending')" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent);" />
          
          <div>
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
              <span class="plan-unit-tag">Unit ${String(u.id).padStart(2, '0')}</span>
              <span style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); text-decoration: ${isDone ? 'line-through' : 'none'}; opacity: ${isDone ? 0.75 : 1};">
                ${u.title}
              </span>
              ${delayNotice}
            </div>
            <div style="font-size: 11.5px; color: var(--text-tertiary); margin-top: 2px;">
              ${u.stageName} • 📅 Dự kiến: <strong style="color:var(--text-secondary);">${dateStr}</strong>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          ${statusBadge}
          <button class="apple-btn btn-secondary" onclick="window.smobApp.openUnitHub(${u.id})" style="font-size: 11.5px; padding: 5px 10px;" title="Vào Trạm Học Tập của Unit này">
            Học Ngay →
          </button>
        </div>

      </div>
    `;
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.dynamicPlan = new SmobDynamicPlan();
});
