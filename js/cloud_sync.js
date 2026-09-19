// SMOB English Lab — 6-Digit Sync Code Engine (Zero-Login / Zero-Password)
// Synchronizes learning progress between Home & Company PC using only a 6-digit PIN (e.g. 120218)
// 100% Offline-first, auto-merge, and 1-click JSON backup & restore

class CloudSyncEngine {
  constructor() {
    this.masterEndpoint = 'https://extendsclass.com/api/json-storage/bin/dafdaee';
    this.pin = this.loadPin();
    this.lastSyncedAt = localStorage.getItem('smob_sync_last_time') || null;
    this.isSyncing = false;
    this.online = navigator.onLine;

    this.initNetworkListeners();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateUI();
        if (this.pin && this.online) {
          // Subtle initial auto-pull after app initializes
          setTimeout(() => this.syncNow(true), 1200);
        }
      });
    } else {
      this.updateUI();
      if (this.pin && this.online) {
        setTimeout(() => this.syncNow(true), 1200);
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

  // ==========================================
  // PIN CONNECTION & TWO-WAY SYNC
  // ==========================================
  async connectWithPin(inputPin) {
    const cleanPin = String(inputPin || '').replace(/[^0-9a-zA-Z]/g, '').trim().slice(0, 8);
    if (!cleanPin || cleanPin.length < 4) {
      this.showToast('⚠️ Vui lòng nhập mã tối thiểu 4 đến 6 chữ số (VD: 120218)!');
      return;
    }

    this.isSyncing = true;
    this.updateUI();
    this.showToast(`🔄 Đang tìm kiếm và liên kết kho dữ liệu mã [${cleanPin}]...`);

    try {
      // 1. Fetch remote registry
      const res = await fetch(this.masterEndpoint, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Máy chủ đám mây bận (HTTP ${res.status}). Vui lòng thử lại.`);
      const registry = await res.json();

      const localPayload = window.dataStore ? window.dataStore.getAllExportData() : {};
      localPayload.syncPin = cleanPin;
      localPayload.lastSyncedAt = new Date().toISOString();

      if (registry && registry[cleanPin]) {
        // Remote data exists: Merge remote into local!
        const remoteData = registry[cleanPin];
        if (window.dataStore) {
          window.dataStore.mergeExternalData(remoteData);
        }

        // Push combined back up to ensure cloud is fresh
        const combinedPayload = window.dataStore ? window.dataStore.getAllExportData() : localPayload;
        combinedPayload.syncPin = cleanPin;
        combinedPayload.lastSyncedAt = new Date().toISOString();
        registry[cleanPin] = combinedPayload;

        await fetch(this.masterEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registry)
        });

        this.savePin(cleanPin);
        this.lastSyncedAt = new Date().toISOString();
        localStorage.setItem('smob_sync_last_time', this.lastSyncedAt);

        this.refreshAppViews();
        this.showToast(`🎉 Kết nối mã [${cleanPin}] thành công! Tiến độ đã đồng bộ 100%.`);
      } else {
        // No remote data yet: Initialize cloud vault with current local data!
        registry[cleanPin] = localPayload;
        await fetch(this.masterEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registry)
        });

        this.savePin(cleanPin);
        this.lastSyncedAt = new Date().toISOString();
        localStorage.setItem('smob_sync_last_time', this.lastSyncedAt);

        this.showToast(`✨ Đã khởi tạo kho đồng bộ cho mã [${cleanPin}]! Hãy dùng mã này ở công ty.`);
      }

      this.closeSyncModal();
    } catch (err) {
      console.error('Connect PIN error:', err);
      this.showToast(`❌ Lỗi kết nối: ${err.message || 'Kiểm tra kết nối mạng'}`);
    } finally {
      this.isSyncing = false;
      this.updateUI();
    }
  }

  async syncNow(silent = false) {
    if (!this.pin) {
      if (!silent) this.openSyncModal();
      return;
    }

    if (!navigator.onLine) {
      if (!silent) this.showToast('⚠️ Bạn đang ngoại tuyến. Dữ liệu đã bảo toàn an toàn trên máy.');
      return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;
    this.updateUI();

    if (!silent) {
      this.showToast(`🔄 Đang đồng bộ tiến độ mã [${this.pin}]...`);
    }

    try {
      const res = await fetch(this.masterEndpoint, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Lỗi kết nối máy chủ (${res.status})`);
      const registry = await res.json();

      let remoteData = registry[this.pin];
      if (remoteData && window.dataStore) {
        window.dataStore.mergeExternalData(remoteData);
      }

      // Prepare fresh merged payload to update cloud
      const freshLocal = window.dataStore ? window.dataStore.getAllExportData() : {};
      freshLocal.syncPin = this.pin;
      freshLocal.lastSyncedAt = new Date().toISOString();
      registry[this.pin] = freshLocal;

      await fetch(this.masterEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry)
      });

      this.lastSyncedAt = new Date().toISOString();
      localStorage.setItem('smob_sync_last_time', this.lastSyncedAt);
      this.refreshAppViews();

      if (!silent) {
        this.showToast(`✅ Đã đồng bộ thành công! Mã [${this.pin}] đã cập nhật mới nhất.`);
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
    if (confirm(`Bạn có chắc muốn ngắt liên kết mã [${this.pin}] trên thiết bị này?\n(Dữ liệu bài học trên máy này vẫn được bảo toàn nguyên vẹn)`)) {
      const oldPin = this.pin;
      this.savePin('');
      this.lastSyncedAt = null;
      localStorage.removeItem('smob_sync_last_time');
      this.updateUI();
      this.showToast(`Đã ngắt liên kết mã [${oldPin}]. Bạn có thể nhập mã khác.`);
    }
  }

  autoSyncIfEnabled() {
    if (this.pin && navigator.onLine) {
      this.syncNow(true);
    }
  }

  refreshAppViews() {
    if (window.smobApp) {
      if (typeof window.smobApp.renderDashboardMetrics === 'function') {
        window.smobApp.renderDashboardMetrics();
      }
      if (typeof window.smobApp.renderDashboard === 'function') {
        window.smobApp.renderDashboard();
      }
      if (typeof window.smobApp.renderStudyPlanView === 'function') {
        window.smobApp.renderStudyPlanView();
      }
    }
  }

  // ==========================================
  // OFFLINE 1-CLICK JSON BACKUP & RESTORE
  // ==========================================
  exportToJsonFile() {
    if (!window.dataStore) return;
    const data = window.dataStore.getAllExportData();
    data.syncPin = this.pin || '120218';

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
        syncLabel.textContent = `Mã: ${this.pin}`;
      } else {
        syncLabel.textContent = 'Đồng Bộ Mã 6 Số';
      }
    }

    if (syncAvatar) {
      syncAvatar.innerHTML = this.pin ? '🔑' : '🔄';
    }

    // 2. Sidebar Profile & Nav Account Link
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarCloudStatus = document.getElementById('sidebar-cloud-status');
    const navAccount = document.getElementById('nav-account-sync');

    if (sidebarName) {
      sidebarName.textContent = this.pin ? `Học Viên [${this.pin}]` : 'Học Viên SMOB';
    }

    if (sidebarAvatar) {
      sidebarAvatar.textContent = this.pin ? this.pin.slice(-2) : '48';
    }

    if (sidebarCloudStatus) {
      if (this.isSyncing) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status syncing"></span> Đang đồng bộ...`;
      } else if (!this.online) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status offline"></span> Ngoại tuyến`;
      } else if (this.pin) {
        sidebarCloudStatus.innerHTML = `<span class="dot-status online"></span> Mã: ${this.pin} (Đang đồng bộ)`;
      } else {
        sidebarCloudStatus.innerHTML = `<span class="dot-status ready"></span> Bấm để nhập mã 6 số`;
      }
    }

    if (navAccount) {
      if (this.pin) {
        navAccount.innerHTML = `
          <svg viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Mã: ${this.pin} (Đã Đồng Bộ)
        `;
      } else {
        navAccount.innerHTML = `
          <svg viewBox="0 0 24 24">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Đồng Bộ Mã 6 Số
        `;
      }
    }

    // 3. Modal details (if open)
    const modalPinDisplay = document.getElementById('sync-modal-pin-display');
    const modalLastSync = document.getElementById('sync-modal-last-sync');
    const connectSection = document.getElementById('sync-connect-section');
    const connectedSection = document.getElementById('sync-connected-section');
    const pinInput = document.getElementById('sync-pin-input');

    if (modalPinDisplay) {
      modalPinDisplay.textContent = this.pin ? `Mã liên kết: ${this.pin}` : 'Chưa liên kết mã';
    }

    if (modalLastSync) {
      modalLastSync.textContent = this.lastSyncedAt
        ? `Lần đồng bộ gần nhất: ${new Date(this.lastSyncedAt).toLocaleTimeString('vi-VN')} (${new Date(this.lastSyncedAt).toLocaleDateString('vi-VN')})`
        : 'Chưa có lượt đồng bộ nào';
    }

    if (connectSection && connectedSection) {
      if (this.pin) {
        connectSection.style.display = 'none';
        connectedSection.style.display = 'block';
      } else {
        connectSection.style.display = 'block';
        connectedSection.style.display = 'none';
        if (pinInput && !pinInput.value) {
          pinInput.value = '120218'; // Pre-fill default suggested PIN for immediate ease of use!
        }
      }
    }
  }

  openSyncModal() {
    const modal = document.getElementById('account-sync-modal');
    if (!modal) return;
    modal.classList.add('active');
    this.updateUI();

    const pinInput = document.getElementById('sync-pin-input');
    if (pinInput && !this.pin) {
      pinInput.focus();
      pinInput.select();
    }
  }

  closeSyncModal() {
    const modal = document.getElementById('account-sync-modal');
    if (modal) modal.classList.remove('active');
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
