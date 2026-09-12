---
name: english-learning-dev
description: Hướng dẫn chuyên sâu cấu trúc dữ liệu, PyWebView bridge, quy trình đóng gói PyInstaller và phát triển tính năng mới cho SMOB English Lab.
---

# Kỹ Năng Phát Triển Phần Mềm Học Tiếng Anh: SMOB English Lab

Kỹ năng này cung cấp các hướng dẫn chi tiết, cấu trúc dữ liệu và quy trình kỹ thuật dành cho Antigravity khi hỗ trợ người dùng nâng cấp, sửa đổi hoặc thêm tính năng vào phần mềm **SMOB English Lab (48-Day Foundation Course)**.

---

## 1. Cấu Trúc Thư Mục & Vai Trò Các Thành Phần

- `index.html`: Giao diện SPA chính (Single Page Application).
- `css/app.css`: Hệ thống CSS biến (CSS variables), Glassmorphism, Theme toggle, responsive layout.
- `js/app.js`: Điều phối UI, hiển thị Unit, render lý thuyết ngữ pháp, sinh bộ câu hỏi trắc nghiệm, tính điểm.
- `js/data_store.js`: Giao tiếp với `localStorage` để lưu điểm, trạng thái hoàn thành bài, câu hỏi đánh dấu.
- `js/embedded_data.js`: Chứa biến toàn cục `window.EMBEDDED_APP_DATA` bao gồm toàn bộ nội dung 48 bài học và danh mục động từ bất quy tắc.
- `desktop_main.py`: Ứng dụng Desktop chạy nền tảng `pywebview` (sử dụng Edge WebView2).
- `data/`:
  - `all_units_data.json`: Bộ dữ liệu JSON lớn (~1.28 MB) chứa toàn văn lý thuyết và đề kiểm tra 48 bài.
  - `units.json`: Metadata danh sách bài học (id, title, topic, video_filename, audio_filename...).
  - `irregular_verbs.json`: Danh mục 360+ động từ bất quy tắc (V1, V2, V3, Nghĩa tiếng Việt).
- `scripts/`:
  - `build_exe.py`: Script đóng gói ứng dụng bằng PyInstaller ra `D:\2.English\phan mem hoc\SMOB English Lab.exe`.
  - `generate_embedded_bundle.py`: Đọc `data/all_units_data.json` và xuất ra `js/embedded_data.js`.
  - `build_full_48_units.py`: Trích xuất và cấu trúc hóa toàn bộ 48 bài từ tài liệu PDF/Docx.
  - `clean_system_and_temp.py`: Script dọn dẹp hệ thống (Temp, %Temp%, Prefetch).
  - `pipeline/`: Chứa các script tự động hóa Google Sheets / Google Drive.

---

## 2. Quy Cách Cấu Trúc Dữ Liệu Bài Học (Data Schema)

Mỗi bài học (Unit) trong `all_units_data.json` có cấu trúc:

```json
{
  "id": 1,
  "title": "Unit 1: The Verb To Be",
  "topic": "Thể khẳng định và phủ định của động từ to be",
  "theory": [
    {
      "title": "1. Định nghĩa và cách dùng",
      "content": "Động từ to be mang nghĩa là thì, là, ở...",
      "examples": [
        {"en": "I am a student.", "vi": "Tôi là một học sinh."}
      ]
    }
  ],
  "tests": [
    {
      "id": 1,
      "question": "I ___ a student.",
      "options": ["am", "is", "are", "be"],
      "answer": "A",
      "explanation": "Chủ ngữ 'I' đi với động từ to be 'am'."
    }
  ],
  "media": {
    "video": "bai_giang_unit_01.mp4",
    "audio": ["audio_01.mp3"]
  }
}
```

---

## 3. PyWebView Bridge (`desktop_main.py`)

Khi chạy dưới dạng ứng dụng Desktop, `desktop_main.py` đăng ký `AppApi` cho phép JavaScript tương tác với hệ điều hành:

```javascript
// Kiểm tra xem đang chạy trong PyWebView hay trình duyệt:
if (window.pywebview && window.pywebview.api) {
  // Mở video bài giảng của Unit:
  window.pywebview.api.launch_video(unitId).then(result => {
    if (result.status === 'SUCCESS') {
      console.log('Video opened at:', result.path);
    } else {
      alert(result.message);
    }
  });
} else {
  // Fallback khi chạy trên trình duyệt web thông thường:
  alert('Đang chạy ở chế độ Web. Tính năng phát video bài giảng từ ổ cứng chỉ hoạt động trên bản Desktop.');
}
```

> **Lưu ý đặc biệt**: Unit 12 và Unit 13 hiện tại trong nguồn dữ liệu gốc của người dùng không có video MP4. `AppApi` đã cài đặt sẵn phản hồi `{"status": "MISSING", "message": "Video bài giảng hiện chưa có trong bộ dữ liệu."}` để xử lý êm ái.

---

## 4. Quy Trình Cập Nhật Dữ Liệu Hoặc Giao Diện

1. **Sửa đổi HTML/CSS/JS**: Chỉnh sửa trực tiếp trong `index.html`, `css/app.css` hoặc `js/app.js`.
2. **Sửa đổi nội dung bài giảng**:
   - Chỉnh sửa file `data/all_units_data.json`.
   - Chạy lệnh cập nhật bundle:
     ```bash
     python scripts/generate_embedded_bundle.py
     ```
3. **Kiểm tra trực tiếp**: Mở `index.html` hoặc chạy `python desktop_main.py`.

---

## 5. Quy Trình Đóng Gói Thành File EXE Độc Lập

Khi cần đóng gói ứng dụng cho người dùng:
```bash
python scripts/build_exe.py
```
Script sẽ tự động:
1. Đưa toàn bộ file giao diện (`index.html`, `css/`, `js/`, `data/`) vào gói PyInstaller (`--onefile`, `--windowed`).
2. Xuất file thực thi `SMOB English Lab.exe` vào đúng thư mục đích: `D:\2.English\phan mem hoc`.
3. Dọn dẹp các thư mục trung gian `build_tmp/` và `spec_tmp/`.
4. Sau khi hoàn thành, nhớ chạy `python scripts/clean_system_and_temp.py` để làm sạch hệ thống.