# Workflow: Đóng Gói Ứng Dụng Thành File EXE Độc Lập

Tài liệu này hướng dẫn quy trình tạo file `SMOB English Lab.exe` không cần cài đặt Python trên máy người dùng cuối.

## Cách 1: Click đúp Batch file
Click đúp vào `Dong_Goi_EXE.bat` ở thư mục gốc của dự án.

## Cách 2: Chạy bằng dòng lệnh
```bash
python scripts/build_exe.py
```

## Kết quả xuất ra:
File EXE độc lập sẽ được đưa vào:
`D:\2.English\phan mem hoc\SMOB English Lab.exe`

## Các bước xác minh sau khi đóng gói:
1. Mở thư mục `D:\2.English\phan mem hoc` và kiểm tra file `SMOB English Lab.exe`.
2. Chạy thử nghiệm file EXE, kiểm tra chuyển đổi giữa 48 Unit, tra từ và làm bài tập.
3. Chạy dọn dẹp hệ thống: `python scripts/clean_system_and_temp.py`.