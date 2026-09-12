import os
import json
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(base_dir, 'data')

# Core irregular verbs extracted from Unit 12 & Unit 15
verbs_data = [
    ("begin", "began", "begun", "bắt đầu", 12, 2),
    ("break", "broke", "broken", "làm vỡ", 12, 2),
    ("bring", "brought", "brought", "mang theo", 12, 2),
    ("buy", "bought", "bought", "mua", 12, 2),
    ("choose", "chose", "chosen", "lựa chọn", 12, 2),
    ("come", "came", "come", "đến", 12, 2),
    ("cost", "cost", "cost", "trị giá", 12, 2),
    ("cut", "cut", "cut", "cắt", 12, 2),
    ("do", "did", "done", "làm", 12, 2),
    ("draw", "drew", "drawn", "vẽ", 12, 2),
    ("drive", "drove", "driven", "lái xe", 12, 2),
    ("eat", "ate", "eaten", "ăn", 12, 2),
    ("feel", "felt", "felt", "cảm thấy", 12, 2),
    ("find", "found", "found", "tìm thấy", 12, 2),
    ("get", "got", "got / gotten", "có được", 12, 2),
    ("give", "gave", "given", "đưa cho", 12, 2),
    ("go", "went", "gone", "đi", 12, 2),
    ("have", "had", "had", "có", 12, 2),
    ("hear", "heard", "heard", "nghe", 12, 2),
    ("hold", "held", "held", "tổ chức, cầm, nắm", 12, 2),
    ("keep", "kept", "kept", "giữ", 12, 2),
    ("know", "knew", "known", "biết", 12, 2),
    ("leave", "left", "left", "rời đi", 12, 2),
    ("make", "made", "made", "làm, chế tạo", 12, 2),
    ("meet", "met", "met", "gặp gỡ", 12, 2),
    ("pay", "paid", "paid", "trả tiền", 12, 2),
    ("run", "ran", "run", "chạy", 12, 2),
    ("say", "said", "said", "nói", 12, 2),
    ("sell", "sold", "sold", "bán", 12, 2),
    ("send", "sent", "sent", "gửi", 12, 2),
    ("see", "saw", "seen", "xem, gặp", 12, 2),
    ("sit", "sat", "sat", "ngồi", 12, 2),
    ("sleep", "slept", "slept", "ngủ", 12, 2),
    ("speak", "spoke", "spoken", "nói", 12, 2),
    ("spend", "spent", "spent", "dành (thời gian, tiền)", 12, 2),
    ("stand", "stood", "stood", "đứng", 12, 2),
    ("take", "took", "taken", "mang, cầm, lấy", 12, 2),
    ("teach", "taught", "taught", "dạy học", 12, 2),
    ("tell", "told", "told", "kể, bảo", 12, 2),
    ("think", "thought", "thought", "nghĩ", 12, 2),
    ("understand", "understood", "understood", "hiểu", 12, 2),
    ("wear", "wore", "worn", "mặc, đội", 12, 2),
    ("win", "won", "won", "thắng, chiến thắng", 12, 2),
    ("write", "wrote", "written", "viết", 12, 2),
    ("be", "was / were", "been", "thì, là, ở", 15, 2)
]

irv_list = []
for v1, v2, v3, vi, u, p in verbs_data:
    irv_list.append({
        "id": f"irv_{v1}",
        "v1": v1,
        "v2": v2,
        "v3": v3,
        "meaning": vi,
        "source_unit": u,
        "source_page": p
    })

out_file = os.path.join(target_dir, 'irregular_verbs.json')
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(irv_list, f, ensure_ascii=False, indent=2)

print('Successfully created irregular verbs dataset:', len(irv_list), 'verbs')
