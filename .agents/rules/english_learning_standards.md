# Tiêu Chuẩn Phát Triển Phần Mềm Học Tiếng Anh SMOB English Lab

## 1. Nguyên Tắc Thiết Kế Giao Diện (UI/UX)
- Giao diện định hướng hiện đại, trực quan cao, phong cách Apple tối giản và tinh tế (Glassmorphism, rounded card, micro-interactions).
- Hỗ trợ đầy đủ Dark Mode và Light Mode với độ tương phản tốt cho việc học tập lâu dài không mỏi mắt.
- Typography rõ ràng, dễ đọc cả trên màn hình máy tính lẫn màn hình độ phân giải cao.

## 2. Kiến Trúc Offline-First
- File index.html cùng js/embedded_data.js phải luôn có khả năng hoạt động trực tiếp khi mở bằng giao thức file cục bộ (ile:///) hoặc đóng gói trong PyInstaller.
- Khi cập nhật cấu trúc hoặc nội dung trong data/all_units_data.json, bắt buộc chạy scripts/generate_embedded_bundle.py để đồng bộ sang js/embedded_data.js.

## 3. Kết Nối Media & Native Desktop (PyWebView)
- Video bài giảng định dạng MP4 và tài liệu nằm tại D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY {unit_id}.
- Gọi thông qua API window.pywebview.api.launch_video(unitId) trên môi trường desktop.
- Có cơ chế graceful fallback hiển thị thông báo thân thiện nếu mở trên trình duyệt web thông thường hoặc nếu bài học đó chưa có video bài giảng.

## 4. Quản Lý Dữ Liệu Học Tập (Progress Tracking)
- Kết quả làm bài trắc nghiệm, điểm số, trạng thái hoàn thành (Completed), danh sách câu hỏi đã bookmark phải được lưu trữ đồng bộ vào localStorage thông qua data_store.js.
- Cho phép người dùng làm lại bài kiểm tra và xóa lịch sử làm bài nếu muốn làm mới tiến độ.
