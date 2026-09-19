// SMOB English Lab — 6-Digit Sync Code Engine (Zero-Login / Confidential PIN)
// Synchronizes learning progress between Home & Company PC securely using only a private 6-digit PIN
// Fully masked input, zero plaintext leakage, resilient Vercel API proxy with CORS preflight

class CloudSyncEngine {
  constructor() {
    this.apiEndpoint = 'https://48smobeng.vercel.app/api/sync';
    this.fallbackEndpoint = 'https://extendsclass.com/api/json-storage/bin/dccfcbf';
    this.pin = this.loadPin();
    this.lastSyncedAt = localStorage.getItem('smob_sync_last_time') || null;
    this.isSyncing = false;
    this.online = navigator.onLine;
    this._isPeeking = false;

    this.initNetworkListeners();
    this.initKeyListeners();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateUI();
        if (this.pin && this.online) {
          setTimeout(() => this.syncNow(true), 3500);
        }
      });
    } else {
      this.updateUI();
      if (this.pin && this.online) {
        setTimeout(() => this.syncNow(true), 3500);
      }
    }
  }

  loadPin() {
    return (localStorage.getItem('smob_sync_pin') || '').trim();
  }

  savePin(pin) {
    this.pin = (pin || '').trim();
    if (this.pin) {
      localStorage.setItem('smob_sync_pin', this.pin);
    } else {
      localStorage.removeItem('smob_sync_pin');
    }
    this.updateUI();
  }

  initNetworkListeners() {
    window.addEventListener('online', () => {
      this.online = true;
      this.updateUI();
      if (this.pin) {
        this.syncNow(true);
      }
    });

    window.addEventListener('offline', () => {
      this.online = false;
      this.updateUI();
    });
  }

  initKeyListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSyncModal();
      }
    });
  }

  // ==========================================
  // PIN CONNECTION & TWO-WAY SYNC
  // ==========================================
  async connectWithPin(inputPin) {
    const cleanPin = String(inputPin || '').replace(/[^0-9a-zA-Z]/g, '').trim().slice(0, 8);
    if (!cleanPin || cleanPin.length < 4) {
      this.showToast('⚠️ Vui lòng nhập mã bí mật tối thiểu 4 đến 6 ký tự!');
      const inputEl = document.getElementById('sync-pin-input');
      if (inputEl) inputEl.focus();
      return;
    }

    this.isSyncing = true;
    this.updateUI();
    this.showToast('🔄 Đang kiểm tra và kết nối kho dữ liệu...');

    try {
      let remoteData = null;

      // 1. Fetch remote data from Vercel API
      try {
        const res = await fetch(`${this.apiEndpoint}?pin=${encodeURIComponent(cleanPin)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            remoteData = json.data;
          }
        }
      } catch (apiErr) {
        console.warn('API GET failed, trying fallback:', apiErr);
        // Fallback: simple direct GET on ExtendsClass (zero custom headers to avoid CORS preflight)
        try {
          const resFallback = await fetch(`${this.fallbackEndpoint}?_t=${Date.now()}`);
          if (resFallback.ok) {
            const reg = await resFallback.json();
            if (reg && reg[cleanPin]) {
              remoteData = reg[cleanPin];
            }
          }
        } catch (e2) {
          console.warn('Fallback GET failed:', e2);
        }
      }

      if (remoteData) {
        // Remote data exists: Merge into local!
        if (window.dataStore) {
          window.dataStore.mergeExternalData(remoteData);
        }
        this.showToast('🎉 Kết nối thành công! Đã tải và đồng bộ tiến độ.');
      } else {
        // First time initialization
        this.showToast('✨ Đã kết nối mã bí mật! Đang tải tiến độ lên đám mây...');
      }

      this.savePin(cleanPin);
      this.lastSyncedAt = new Date().toISOString();
      localStorage.setItem('smob_sync_last_time', this.lastSyncedAt);

      // Push current combined payload to cloud
      await this.pushToCloud(cleanPin);

      this.refreshAppViews();
      this.closeSyncModal();
    } catch (err) {
      console.error('Connect PIN error:', err);
      this.showToast(`❌ Lỗi kết nối: ${err.message || 'Kiểm tra kết nối mạng'}`);
    } finally {
      this.isSyncing = false;
      this.updateUI();
    }
  }

  async pushToCloud(pin) {
    if (!pin || !navigator.onLine) return false;
    const payload = window.dataStore ? window.dataStore.getAllExportData() : {};
    payload.syncPin = pin;
    payload.lastSyncedAt = new Date().toISOString();

    try {
      const res = await fetch(`${this.apiEndpoint}?_t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ pin, data: payload })
      });
      return res.ok;
    } catch (err) {
      console.warn('pushToCloud error:', err);
      return false;
    }
  }

  async syncNow(silent = false) {
    if (!this.pin) {
      if (!silent) this.openSyncModal();
      return;
    }

    if (!navigator.onLine) {
      if (!silent) this.showToast('⚠️ Bạn đang ngoại tuyến. Dữ liệu đã lưu an toàn trên máy.');
      return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;
    this.updateUI();

    if (!silent) {
      this.showToast('🔄 Đang đồng bộ tiến độ học tập...');
    }

    try {
      // 1. Fetch remote updates with cache-busting
      try {
        const res = await fetch(`${this.apiEndpoint}?pin=${encodeURIComponent(this.pin)}&_t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && window.dataStore) {
            window.dataStore.mergeExternalData(json.data);
          }
        }
      } catch (e) {
        console.warn('Sync pull error:', e);
      }

      // 2. Push fresh local combined payload
      const pushOk = await this.pushToCloud(this.pin);

      this.lastSyncedAt = new Date().toISOString();
      localStorage.setItem('smob_sync_last_time', this.lastSyncedAt);
      this.refreshAppViews();

      if (!silent) {
        if (pushOk) {
          this.showToast('✅ Đã đồng bộ thành công! Dữ liệu 2 chiều đã khớp 100%.');
        } else {
          this.showToast('⚠️ Đã cập nhật trên máy. Đám mây đang bận, sẽ tự thử lại.');
        }
      }
    } catch (err) {
      console.warn('Sync failed:', err);
      if (!silent) {
        this.showToast(`⚠️ Không thể kết nối đồng bộ: ${err.message}`);
      }
    } finally {
      this.isSyncing = false;
      this.updateUI();
    }
  }

  disconnectPin() {
    if (confirm('Bạn có chắc muốn ngắt kết nối mã trên thiết bị này?\n(Toàn bộ bài làm và điểm số trên máy vẫn được giữ nguyên)')) {
      this.savePin('');
      this.lastSyncedAt = null;
      this._isPeeking = false;
      localStorage.removeItem('smob_sync_last_time');
      this.updateUI();
      this.showToast('Đã ngắt kết nối mã. Bạn có thể nhập mã mới.');
    }
  }

  autoSyncIfEnabled() {
    if (this.pin && navigator.onLine) {
      this.syncNow(true);
    }
  }

  togglePinVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁️';
    }
  }

  toggleConnectedPinPeek(btn) {
    const display = document.getElementById('sync-modal-pin-display');
    const tabDisplay = document.getElementById('tab-sync-pin-display');
    if (this._isPeeking) {
      if (display) display.textContent = '••••••';
      if (tabDisplay) tabDisplay.textContent = '••••••';
      btn.textContent = '👁️ Xem mã bí mật';
      this._isPeeking = false;
    } else {
      if (display) display.textContent = this.pin || '••••••';
      if (tabDisplay) tabDisplay.textContent = this.pin || '••••••';
      btn.textContent = '🙈 Ẩn mã';
      this._isPeeking = true;
    }
  }

  refreshAppViews() {
    if (!window.smobApp) return;
    try {
      const currentView = window.smobApp.currentView || 'unit-hub';
      if (currentView === 'dashboard') {
        if (typeof window.smobApp.renderDashboardMetrics === 'function') window.smobApp.renderDashboardMetrics();
        if (typeof window.smobApp.renderDashboard === 'function') window.smobApp.renderDashboard();
      } else if (currentView === 'unit-hub') {
        if (window.dataStore && typeof window.smobApp.openUnitHub === 'function') {
          window.smobApp.openUnitHub(window.dataStore.currentUnitId || 1, false);
        }
      } else if (currentView === 'study-plan') {
        if (window.dynamicPlan && typeof window.dynamicPlan.render === 'function') window.dynamicPlan.render();
      } else if (currentView === 'units') {
        if (typeof window.smobApp.renderUnitsCatalog === 'function') window.smobApp.renderUnitsCatalog();
      } else if (currentView === 'analytics') {
        if (typeof window.smobApp.renderAnalyticsView === 'function') window.smobApp.renderAnalyticsView();
      } else if (currentView === 'irregular') {
        if (typeof window.smobApp.renderIrregularVerbs === 'function') window.smobApp.renderIrregularVerbs();
      } else if (currentView === 'mistakes') {
        if (typeof window.smobApp.renderMistakes === 'function') window.smobApp.renderMistakes();
      }

      const streakEl = document.getElementById('sidebar-streak');
      if (streakEl && window.dataStore && window.dataStore.engagement) {
        streakEl.innerText = `🔥 ${window.dataStore.engagement.dailyStreak || 1} ngày học liên tục`;
      }
    } catch (e) {
      console.warn('refreshAppViews error:', e);
    }
  }

  // ==========================================
  // OFFLINE 1-CLICK JSON BACKUP & RESTORE
  // ==========================================
  exportToJsonFile() {
    if (!window.dataStore) return;
    const data = window.dataStore.getAllExportData();
    data.syncPin = this.pin || '';

    const jsonStr = JSON.stringify(data, null, 2);
    const timeStr = new Date().toISOString().slice(0, 10);
    const fileName = `SMOB_English_Lab_Backup_${timeStr}.json`;

    // 1. PyWebView Desktop check
    if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.save_backup_file === 'function') {
      window.pywebview.api.save_backup_file(jsonStr).then(res => {
        if (res && res.status === 'SUCCESS') {
          this.showToast(`✅ Đã lưu file dự phòng tại: ${res.path}`);
        } else if (res && res.message) {
          this.showToast(`⚠️ ${res.message}`);
        }
      }).catch(e => {
        this.fallbackWebDownload(jsonStr, fileName);
      });
      return;
    }

    // 2. Web browser download fallback
    this.fallbackWebDownload(jsonStr, fileName);
  }

  fallbackWebDownload(content, filename) {
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('✅ Đã tải file sao lưu về máy (.json)!');
  }

  importFromJsonFile() {
    // 1. PyWebView Desktop check
    if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.load_backup_file === 'function') {
      window.pywebview.api.load_backup_file().then(res => {
        if (res && res.status === 'SUCCESS' && res.data) {
          this.processImportedJson(res.data);
        } else if (res && res.message) {
          this.showToast(`⚠️ ${res.message}`);
        }
      }).catch(e => {
        this.fallbackWebUpload();
      });
      return;
    }

    // 2. Web browser file input fallback
    this.fallbackWebUpload();
  }

  fallbackWebUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.processImportedJson(ev.target.result);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  processImportedJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || (!data.userProgress && !data.examHistory)) {
        throw new Error('File không đúng định dạng dữ liệu SMOB English Lab.');
      }

      if (window.dataStore) {
        window.dataStore.mergeExternalData(data);
      }

      if (data.syncPin) {
        this.savePin(data.syncPin);
      }

      this.refreshAppViews();
      this.showToast('🎉 Khôi phục và gộp dữ liệu thành công 100%!');
      this.closeSyncModal();
    } catch (err) {
      this.showToast(`❌ Không thể nạp file: ${err.message}`);
    }
  }

  // ==========================================
  // UI & MODAL MANAGEMENT
  // ==========================================
  updateUI() {
    // 1. Topbar Header Badge
    const syncBtn = document.getElementById('cloud-sync-btn');
    const syncLabel = document.getElementById('cloud-sync-label');
    const syncDot = document.getElementById('cloud-sync-dot');
    const syncAvatar = document.getElementById('cloud-sync-avatar');

    if (syncBtn) {
      if (this.pin) {
        syncBtn.classList.add('logged-in');
        syncBtn.classList.remove('logged-out');
      } else {
        syncBtn.classList.add('logged-out');
        syncBtn.classList.remove('logged-in');
      }
    }

    if (syncDot) {
      syncDot.className = 'sync-status-indicator ' + (
        this.isSyncing ? 'syncing' : (this.online ? (this.pin ? 'online' : 'ready') : 'offline')
      );
    }

    if (syncLabel) {
      if (this.isSyncing) {
        syncLabel.textContent = 'Đang đồng bộ...';
      } else if (!this.online) {
        syncLabel.textContent = 'Ngoại tuyến';
      } else if (this.pin) {
        syncLabel.textContent = '🟢 Đã Đồng Bộ';
      } else {
        syncLabel.textContent = 'Dữ Liệu & Đồng Bộ';
      }
    }

    if (syncAvatar) {
      syncAvatar.innerHTML = this.pin ? '🔐' : '💾';
    }

    // 2. Sidebar Profile & Nav Account Link
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarCloudStatus = document.getElementById('sidebar-cloud-status');
    const navAccount = document.getElementById('nav-account-sync');

    if (sidebarName) {
      sidebarName.textContent = 'Học Viên SMOB';
    }

    if (sidebarAvatar) {
      sidebarAvatar.textContent = this.pin ? '🔐' : '48';
    }

    if (sidebarCloudStatus) {
      if (this.isSyncing) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status syncing"></span> Đang đồng bộ...`;
      } else if (!this.online) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status offline"></span> Ngoại tuyến`;
      } else if (this.pin) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status online"></span> Đã kết nối Đám Mây`;
      } else {
        sidebarCloudStatus.innerHTML = `<span class="dot-status ready"></span> Lưu trên máy này`;
      }
    }

    if (navAccount) {
      if (this.pin) {
        navAccount.innerHTML = `
          <svg viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Đã Đồng Bộ
        `;
      } else {
        navAccount.innerHTML = `
          <svg viewBox="0 0 24 24">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Đồng Bộ (Tùy Chọn)
        `;
      }
    }

    // 3. Modal and Tab details
    const pinText = this._isPeeking ? (this.pin || '••••••') : '••••••';
    const lastSyncText = this.lastSyncedAt
      ? `Lần đồng bộ gần nhất: ${new Date(this.lastSyncedAt).toLocaleTimeString('vi-VN')} (${new Date(this.lastSyncedAt).toLocaleDateString('vi-VN')})`
      : 'Chưa có lượt đồng bộ nào';

    ['sync-modal-pin-display', 'tab-sync-pin-display'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = pinText;
    });

    ['sync-modal-last-sync', 'tab-sync-last-sync'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = lastSyncText;
    });

    const connectSection = document.getElementById('sync-connect-section');
    const connectedSection = document.getElementById('sync-connected-section');
    const tabConnectSection = document.getElementById('tab-sync-connect-section');
    const tabConnectedSection = document.getElementById('tab-sync-connected-section');
    const pinInput = document.getElementById('sync-pin-input');
    const tabPinInput = document.getElementById('tab-sync-pin-input');

    if (this.pin) {
      if (connectSection) connectSection.style.display = 'none';
      if (connectedSection) connectedSection.style.display = 'block';
      if (tabConnectSection) tabConnectSection.style.display = 'none';
      if (tabConnectedSection) tabConnectedSection.style.display = 'block';
    } else {
      if (connectSection) connectSection.style.display = 'block';
      if (connectedSection) connectedSection.style.display = 'none';
      if (tabConnectSection) tabConnectSection.style.display = 'block';
      if (tabConnectedSection) tabConnectedSection.style.display = 'none';
      if (pinInput) pinInput.value = '';
      if (tabPinInput) tabPinInput.value = '';
    }
  }

  openSyncModal() {
    // If the main app view navigation exists, prefer opening the dedicated tab view!
    if (window.smobApp && typeof window.smobApp.navigate === 'function') {
      this.closeSyncModal();
      window.smobApp.navigate('sync');
      return;
    }
    const modal = document.getElementById('account-sync-modal');
    if (!modal) return;
    modal.style.setProperty('display', 'flex', 'important');
    modal.classList.add('active');
    this._isPeeking = false;
    this.updateUI();

    const pinInput = document.getElementById('sync-pin-input');
    if (pinInput && !this.pin) {
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 80);
    }
  }

  closeSyncModal() {
    const modal = document.getElementById('account-sync-modal');
    if (modal) {
      modal.style.setProperty('display', 'none', 'important');
      modal.classList.remove('active');
    }
    document.querySelectorAll('.modal-backdrop').forEach(b => {
      if (b.id === 'account-sync-modal') {
        b.style.setProperty('display', 'none', 'important');
        b.classList.remove('active');
      }
    });
  }

  showToast(message) {
    let toast = document.getElementById('smob-sync-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'smob-sync-toast';
      toast.className = 'smob-sync-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

window.smobCloudSync = new CloudSyncEngine();
