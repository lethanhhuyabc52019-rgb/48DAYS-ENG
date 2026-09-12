# Workflow: Cập Nhật Dữ Liệu Giáo Trình 48 Units

Quy trình áp dụng khi bạn thêm câu hỏi trắc nghiệm mới, sửa nội dung lý thuyết hoặc bổ sung từ vựng.

## Bước 1: Sửa đổi dữ liệu
Chỉnh sửa trực tiếp file JSON:
- `data/all_units_data.json`: Nội dung bài giảng, lý thuyết ngữ pháp và đề kiểm tra.
- `data/units.json`: Danh mục bài và tiêu đề chủ đề.
- `data/irregular_verbs.json`: Bảng động từ bất quy tắc.

## Bước 2: Đồng bộ hóa Bundle Offline (Bắt buộc)
Chạy script để cập nhật `js/embedded_data.js`:
```bash
python scripts/generate_embedded_bundle.py
```

## Bước 3: Kiểm tra hiển thị
Mở `index.html` hoặc chạy `python desktop_main.py` để xác nhận nội dung mới đã xuất hiện chính xác.