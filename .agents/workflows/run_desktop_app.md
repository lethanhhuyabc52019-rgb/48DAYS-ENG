# Workflow: Chạy Thử Nghiệm Desktop App

Tài liệu này mô tả các bước khởi chạy SMOB English Lab trên môi trường máy tính người dùng.

## Cách 1: Khởi động nhanh (Khuyên dùng)
Click đúp vào file `Chay_Phan_Mem.bat` tại thư mục gốc của dự án.
- Script sẽ tự động kiểm tra Python và môi trường PyWebView.
- Nếu đầy đủ, giao diện Desktop native sẽ xuất hiện.
- Nếu môi trường chưa có PyWebView, script sẽ mở trực tiếp trên trình duyệt mặc định.

## Cách 2: Chạy bằng dòng lệnh Python
```bash
python desktop_main.py
```

## Cách 3: Chạy ở chế độ Web thuần
Mở trực tiếp file `index.html` bằng Google Chrome, Edge hoặc bất kỳ trình duyệt nào.
Hoặc khởi tạo server cục bộ:
```bash
python -m http.server 8000
```
Truy cập `http://localhost:8000`.