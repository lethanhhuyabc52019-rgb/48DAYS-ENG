# SMOB English Lab — Quản Trị & Phát Triển Phần Mềm Học Tiếng Anh (48 Ngày)

Workspace này là dự án độc lập chứa toàn bộ source code, dữ liệu giáo trình, công cụ đóng gói và quy tắc phát triển cho phần mềm **SMOB English Lab (48-Day Foundation Course)**.

---

## 1. Quy Tắc Bắt Buộc: Tự Động Dọn Dẹp Hệ Thống (Temp, %Temp%, Prefetch)

Đây là quy tắc áp dụng cho mọi phiên làm việc của Antigravity:

### Mục đích:
Hệ thống thường xuyên biên dịch, đóng gói PyInstaller và xử lý file nặng, dễ sinh rác bộ nhớ đệm. Antigravity luôn chủ động giữ máy tính ở trạng thái mượt mà nhất.

### Thao tác dọn dẹp:
Chủ động dọn dẹp sau các tác vụ build, chạy code hoặc khi người dùng yêu cầu:
1. temp: C:\Windows\Temp
2. %temp%: C:\Users\Admin\AppData\Local\Temp
3. prefetch: C:\Windows\Prefetch

> Sử dụng script chuẩn: python scripts/clean_system_and_temp.py hoặc click đúp Don_Dep_He_Thong.bat.

---

## 2. Kiến Trúc Kỹ Thuật Dự Án

### A. Giao diện (Frontend)
- **Công nghệ**: HTML5, CSS3 hiện đại (Apple Glassmorphism UI, Responsive, Dark/Light mode), Vanilla JavaScript ES6+.
- **Tập tin chính**:
  - index.html: Khung ứng dụng chính (Sidebar 48 Units, Tabs: Bài học, Lý thuyết, Luyện tập, Flashcards Động từ, Bảng theo dõi).
  - css/app.css: Toàn bộ styles giao diện, theme token, hiệu ứng chuyển động mượt.
  - js/app.js: Xử lý tương tác, bộ máy làm bài trắc nghiệm (Quiz engine), chấm điểm, giải thích đáp án, kết nối media.
  - js/data_store.js: Lưu trữ trạng thái học tập, tiến độ, bookmark vào LocalStorage.
  - js/embedded_data.js: Bundle dữ liệu tĩnh nhúng sẵn của 48 Units (chạy offline 100% không cần HTTP server).

### B. Shell Desktop (PyWebView)
- **Tập tin**: desktop_main.py
- Tạo cửa sổ native desktop (1280x820) không phụ thuộc trình duyệt bên ngoài.
- Cung cấp bridge API AppApi cho JavaScript:
  - launch_video(unit_id): Tự động mở video bài giảng định dạng MP4 trong thư mục D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY {unit_id} bằng player mặc định của Windows.
  - launch_audio(unit_id, audio_file): Mở file audio phát âm / bài nghe.

### C. Cơ Sở Dữ Liệu Giáo Trình (Data)
- data/all_units_data.json: Dữ liệu đầy đủ của 48 Units (Lý thuyết, Đề thi, Câu hỏi, Giải thích đáp án).
- data/units.json: Mục lục 48 Units kèm chủ đề và trạng thái.
- data/irregular_verbs.json: Danh mục 360+ động từ bất quy tắc tra cứu nhanh.

### D. Bộ Công Cụ & Scripts Đóng Gói (Scripts)
- scripts/build_exe.py: Đóng gói PyInstaller thành file thực thi duy nhất SMOB English Lab.exe tại D:\2.English\phan mem hoc.
- scripts/build_full_48_units.py: Trích xuất và xây dựng lại toàn bộ 48 bài học từ tài liệu.
- scripts/generate_embedded_bundle.py: Chuyển ll_units_data.json thành js/embedded_data.js.
- scripts/clean_system_and_temp.py: Script dọn dẹp hệ thống chuẩn.
- scripts/pipeline/: Chứa các script tải và xử lý Google Drive / Google Sheets.

---

## 3. Hướng Dẫn Phát Triển Nhanh
- **Chạy thử nghiệm giao diện**: Mở trực tiếp index.html trên trình duyệt hoặc click Chay_Phan_Mem.bat.
- **Chạy bản Desktop đầy đủ**: Chạy python desktop_main.py.
- **Đóng gói phát hành**: Chạy python scripts/build_exe.py hoặc click Dong_Goi_EXE.bat.
- **Đồng bộ dữ liệu bundle**: Nếu chỉnh sửa data/all_units_data.json, hãy chạy python scripts/generate_embedded_bundle.py để cập nhật js/embedded_data.js.
