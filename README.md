# SMOB English Lab — Dự Án Học & Lấy Gốc Tiếng Anh 48 Ngày

Thư mục này là **Workspace Độc Lập** của phần mềm học tiếng Anh **SMOB English Lab**, được tối ưu cho cả người dùng và trợ lý trí tuệ nhân tạo (Antigravity AI).

---

## 📁 Cấu Trúc Dự Án

```
D:\2.English\ENG Learning_Antigravity\
├── AGENTS.md                         # Bối cảnh & Luật dọn dẹp hệ thống cho Antigravity AI
├── README.md                         # Hướng dẫn chi tiết dự án (file này)
├── index.html                        # Giao diện chính của ứng dụng
├── desktop_main.py                   # Runtime Desktop PyWebView mở video/audio cục bộ
├── Chay_Phan_Mem.bat                 # Phím tắt chạy phần mềm ngay lập tức
├── Dong_Goi_EXE.bat                  # Phím tắt đóng gói ra file EXE
├── Don_Dep_He_Thong.bat              # Phím tắt dọn dẹp rác Temp, Prefetch
│
├── css/
│   └── app.css                       # Giao diện Apple Glassmorphism, Dark/Light mode
│
├── js/
│   ├── app.js                        # Bộ điều khiển chính (Quiz engine, Media, Navigation)
│   ├── data_store.js                 # Lưu tiến độ học tập vào LocalStorage
│   └── embedded_data.js              # Bundle dữ liệu offline nhúng sẵn
│
├── data/
│   ├── all_units_data.json           # Dữ liệu 48 Units (Lý thuyết, Đề thi, Giải thích)
│   ├── units.json                    # Danh mục chủ đề 48 Units
│   ├── unit_01_content.json          # Dữ liệu mẫu Unit 1
│   └── irregular_verbs.json          # Bảng tra cứu 360+ động từ bất quy tắc
│
├── scripts/
│   ├── build_exe.py                  # Script đóng gói PyInstaller ra D:\2.English\phan mem hoc
│   ├── build_full_48_units.py        # Pipeline trích xuất 48 Units
│   ├── generate_embedded_bundle.py   # Script tạo embedded_data.js
│   ├── clean_system_and_temp.py      # Dọn dẹp Temp, %Temp%, Prefetch
│   └── pipeline/                     # Các script tải Google Drive / Google Sheets
│
└── .agents/                          # Customizations dành cho Antigravity
    ├── rules/                        # Quy tắc dọn dẹp hệ thống & chuẩn code
    ├── skills/                       # Kỹ năng english-learning-dev
    └── workflows/                    # Quy trình chạy, đóng gói và cập nhật dữ liệu
```

---

## 🚀 Hướng Dẫn Sử Dụng Nhanh

### 1. Khởi động phần mềm
- **Cách đơn giản nhất**: Click đúp vào `Chay_Phan_Mem.bat`.
- **Cách chạy lệnh**: `python desktop_main.py` hoặc mở `index.html` trong trình duyệt.

### 2. Đóng gói ra file EXE độc lập
- Click đúp vào `Dong_Goi_EXE.bat`.
- Hoặc chạy lệnh: `python scripts/build_exe.py`.
- File thành phẩm sẽ nằm tại: `D:\2.English\phan mem hoc\SMOB English Lab.exe`.

### 3. Vị trí dữ liệu video và bài nghe
- Các video bài giảng MP4 và file âm thanh nằm tại:
  `D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY 1` -> `NGÀY 48`.
- Ứng dụng Desktop sẽ tự động mở video tương ứng khi bạn bấm nút **"Xem Video Bài Giảng"**.

### 4. Dọn dẹp máy tính
- Click đúp vào `Don_Dep_He_Thong.bat` bất cứ lúc nào bạn muốn giải phóng ổ C: (Temp, %Temp%, Prefetch).

---

## 💡 Hướng Dẫn Cho Antigravity AI
Khi mở thư mục này trong Antigravity AI, AI sẽ tự động đọc file [AGENTS.md](file:///D:/2.English/ENG%20Learning_Antigravity/AGENTS.md) cùng thư mục [.agents](file:///D:/2.English/ENG%20Learning_Antigravity/.agents) để:
1. Hiểu toàn diện cấu trúc cơ sở dữ liệu bài học và API desktop.
2. Tuân thủ nghiêm ngặt quy tắc tự động dọn dẹp hệ thống.
3. Hỗ trợ bạn sửa đổi câu hỏi, làm mới giao diện, thêm tính năng flashcards hoặc mở rộng thêm giáo trình mới.