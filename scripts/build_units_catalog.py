import os
import json

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(base_dir, 'data')
os.makedirs(target_dir, exist_ok=True)

unit_titles = [
    "Thể khẳng định và phủ định với to be", "Thể nghi vấn của động từ to be", "Câu hỏi Who và What",
    "Câu hỏi Where và When", "Động từ thường ở hiện tại", "Thể phủ định của động từ thường",
    "Thể nghi vấn của động từ thường", "Thì hiện tại đơn", "Từ loại", "Thì hiện tại tiếp diễn",
    "Phân biệt HTĐ và HTTD", "Thì quá khứ đơn thể khẳng định", "Thì quá khứ đơn thể phủ định & nghi vấn",
    "Thì quá khứ tiếp diễn", "Thì hiện tại hoàn thành", "Thì tương lai đơn", "Thì tương lai hoàn thành",
    "Ngữ âm (Nguyên âm & Phụ âm)", "Trọng âm từ 2-3 âm tiết", "Các từ để hỏi khác (Why, How...)",
    "Luyện nghe số và tên", "Động từ khuyết thiếu", "Liên từ and, but, or, so, because",
    "Liên từ chỉ thời gian", "Liên từ chỉ sự đối lập", "Câu điều kiện loại 1", "Câu điều kiện loại 2",
    "Câu điều kiện loại 3", "Luyện nghe điền từ", "Luyện nghe chép chính tả", "Luyện nghe về giờ",
    "Luyện nghe ngày tháng", "Luyện nghe địa điểm", "Luyện nghe về tiền bạc", "Đại từ phản thân",
    "Sự hoà hợp về thì", "Tiếng Anh giao tiếp 1", "Liên từ tương hỗ", "Luyện nghe quốc gia & châu lục",
    "Luyện nghe về sở thích", "Luyện nghe phương tiện giao thông", "Luyện nghe thể thao",
    "Luyện nghe nghề nghiệp", "Luyện nghe công nghệ", "Tiếng Anh giao tiếp 2", "Kỹ năng Note-taking",
    "Kỹ năng Paraphrasing", "Tự tin giới thiệu bản thân & thuyết trình"
]

audio_units = {
    21: 6, 29: 6, 30: 6, 31: 5, 32: 4, 33: 4, 34: 5, 37: 4,
    39: 5, 40: 4, 41: 4, 42: 2, 43: 4, 44: 4, 46: 3, 47: 3, 48: 2
}

all_units = []
for i, title in enumerate(unit_titles, start=1):
    stage = 1 if i <= 11 else (2 if i <= 20 else (3 if i <= 34 else 4))
    stage_names = {
        1: "Giai đoạn 1: Nền tảng cốt lõi",
        2: "Giai đoạn 2: Khung thì & Động từ",
        3: "Giai đoạn 3: Cấu trúc & Luyện nghe",
        4: "Giai đoạn 4: Giao tiếp & Ứng dụng"
    }
    all_units.append({
        "unit_id": i,
        "unit_number": i,
        "title": title,
        "stage": stage,
        "stage_name": stage_names[stage],
        "has_video": False if i in [12, 13] else True,
        "video_status": "MISSING" if i in [12, 13] else "AVAILABLE",
        "has_audio": i in audio_units,
        "audio_count": audio_units.get(i, 0)
    })

out_file = os.path.join(target_dir, 'units.json')
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(all_units, f, ensure_ascii=False, indent=2)

print('Successfully created units catalog:', out_file)
