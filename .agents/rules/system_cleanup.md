# Yêu Cầu Bắt Buộc: Tự Động Dọn Dẹp Hệ Thống (Temp, %Temp%, Prefetch)

Đây là quy tắc áp dụng cho TẤT CẢ các dự án và mọi phiên làm việc của Antigravity trong thư mục D:\1.My Work\2.AI:

## 1. Mục đích
Máy tính của người dùng thường xuyên làm việc với các phần mềm kỹ thuật nặng (Revit, AutoCAD, ReCap, AI, code...), dễ bị đầy bộ nhớ đệm và giật lag. Antigravity luôn phải chủ động giữ máy tính ở trạng thái nhẹ và mượt nhất.

## 2. Thao tác dọn dẹp tiêu chuẩn
Khi thực hiện các tác vụ (đặc biệt là sau các thao tác lớn, sau khi build/chạy code, di chuyển dữ liệu) hoặc khi người dùng nhắc nhở, Antigravity phải chủ động hỗ trợ xóa toàn bộ rác trong 3 vị trí sau:
1. temp: C:\Windows\Temp (tương đương Windows + R -> temp)
2. %temp%: C:\Users\Admin\AppData\Local\Temp (tương đương Windows + R -> %temp%)
3. prefetch: C:\Windows\Prefetch (tương đương Windows + R -> prefetch)

## 3. Tiêu chuẩn thực thi an toàn
- Sử dụng script an toàn để xóa file và thư mục con.
- Bỏ qua an toàn các file đang được hệ điều hành hoặc phần mềm đang mở sử dụng (file locked/in-use).
- Tổng kết ngắn gọn số file đã xóa và dung lượng giải phóng cho người dùng.
