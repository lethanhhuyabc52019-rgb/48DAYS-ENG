"""
patch_all_master_prompt_fixes.py
Directly applies the ground truth fixes requested in Master Prompt:
- Unit 2: Q6 (Those are), Q8 (These are), Q11 (Dog, not bird, No it isn't), Q13-20 options & variants
- Unit 3: Q1-5 (Hats, Birthday Cake, Pillows, Doctors, Bag), Q8 & Q9 (Who for human nouns), Q10 (What are those for jeans), Q12 (are for classmates), Q13 (It's for chair)
- Unit 4: Q1-5 (When/Where), Q6 (at/in the supermarket variants), Q8 (on Monday), Q10 (on the floor), Q11 (He is at work / office, not kitchen), Q12 (9:00), Q13 (train station), Q14 (on the sofa), Q15 (Tuesday)
- Unit 7: Q1-5 visual answers (he does, they do, he doesn't, it doesn't, they don't), Q6-15 MCQs, Q16-20 sentence transformations
- Unit 13: Q1-5 past simple verbs, Q6-10 visual answers (were, he did, he didn't, it was, he didn't), Q11-20 MCQs
- Unit 16: Q1-5 future simple verbs, Q6-10 visual answers (he won't, I will, they will, he won't, they will), Q11-20 MCQs
- Unit 20: Q1-5 question words (How, Why, How much, How often, How many), Q6-10 visual questions (How are you, How much does this hat cost, How many cats do you have, How long have you lived in Hanoi, Why do you hate winter), Q11-20 MCQs (How often, Why, How far, How many, How, Which, How, old, Why, How long)
- Global cleanup: remove any leftover _____, ..., or dash prefixes/suffixes from correct_answer across all 48 units.
"""

import json
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "all_units_data.json"

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} units from {DATA_FILE}")

# ==========================================
# 1. UNIT 2 FIXES
# ==========================================
u2 = data['2']['unit_test']

# Q6: Image u02_p2_q02.png (books at a distance) -> Those are
for q in u2:
    if q.get('id') == 6 or q.get('id') == '6':
        q['correct_answer'] = 'Those are'
        q['acceptable_variants'] = ['Those are', 'those are', 'Those are my books.', 'Those are my books']
        q['explanation'] = "【Đại từ chỉ định】 Bức tranh chỉ những quyển sách ở vị trí xa người nói (mũi tên dài / khoảng cách xa), danh từ số nhiều 'books' $\\implies$ dùng 'Those are' (Kia là những quyển sách)."

    if q.get('id') == 8 or q.get('id') == '8':
        q['correct_answer'] = 'These are'
        q['acceptable_variants'] = ['These are', 'these are', 'These are my students.', 'These are my students']
        q['explanation'] = "【Đại từ chỉ định】 Bức tranh chỉ các học sinh ở vị trí gần người nói (ngay cạnh cô giáo), danh từ số nhiều 'students' $\\implies$ dùng 'These are' (Đây là các học sinh của tôi)."

    if q.get('id') == 11 or q.get('id') == '11':
        q['stem'] = "Is this a cat? (Nhìn tranh và trả lời)"
        q['correct_answer'] = "No, it isn't."
        q['acceptable_variants'] = ["No, it isn't.", "No, it isn't", "No, it is not.", "No, it is not", "it isn't", "it is not", "No, it's not.", "No, it's not"]
        q['explanation'] = "【Nhận diện tranh & Câu hỏi To Be】 Bức tranh hiển thị một chú cún/chó (dog), không phải con mèo (cat). Với câu hỏi Yes/No 'Is this a cat?', câu trả lời phủ định chính xác là: 'No, it isn't.' (hoặc 'No, it is not.'). Tuyệt đối không nhầm lẫn với các loài vật khác."

    if q.get('id') == 12 or q.get('id') == '12':
        q['stem'] = "Is he a doctor? (Nhìn tranh và trả lời)"
        q['correct_answer'] = "Yes, he is."
        q['acceptable_variants'] = ["Yes, he is.", "Yes, he is", "yes, he is.", "yes, he is", "he is", "Yes, he is"]
        q['explanation'] = "【Câu hỏi To Be ngắn】 Nhìn tranh người đàn ông mặc áo blouse bác sĩ. Câu hỏi 'Is he a doctor?' trả lời khẳng định: 'Yes, he is.'"

# ==========================================
# 2. UNIT 3 FIXES
# ==========================================
u3 = data['3']['unit_test']

# Q1-5: Visual Questions
u3_visual = [
    {
        "id": "u03_q01",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi)",
        "type": "typing",
        "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng. Nhớ đặt dấu chấm câu ở cuối câu.",
        "stem": "What are they? (Nhìn tranh những chiếc mũ)",
        "image_url": "assets/exam_images/unit_03/u03_p2_q01.png",
        "options": [],
        "correct_answer": "They are hats.",
        "acceptable_variants": [
            "They are hats.", "They are hats", "They're hats.", "They're hats",
            "they are hats.", "they are hats", "they're hats.", "they're hats"
        ],
        "explanation": "【Câu hỏi What số nhiều】 Hình ảnh hiển thị những chiếc mũ (hats) ở số nhiều. Với câu hỏi 'What are they?', câu trả lời chuẩn là: 'They are hats.' hoặc viết tắt 'They're hats.'."
    },
    {
        "id": "u03_q02",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi)",
        "type": "typing",
        "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng. Nhớ đặt dấu chấm câu ở cuối câu.",
        "stem": "What is this? (Nhìn tranh chiếc bánh sinh nhật)",
        "image_url": "assets/exam_images/unit_03/u03_p2_q02.png",
        "options": [],
        "correct_answer": "It is a cake.",
        "acceptable_variants": [
            "It is a cake.", "It is a cake", "It's a cake.", "It's a cake",
            "it is a cake.", "it is a cake", "it's a cake.", "it's a cake",
            "It is a birthday cake.", "It's a birthday cake."
        ],
        "explanation": "【Câu hỏi What số ít】 Hình ảnh là chiếc bánh sinh nhật (cake) số ít ở cự ly gần. Câu hỏi 'What is this?' trả lời chuẩn ngữ pháp là: 'It is a cake.' hoặc 'It's a cake.' (hoàn toàn không phải quả táo hay quyển sách)."
    },
    {
        "id": "u03_q03",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi)",
        "type": "typing",
        "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng. Nhớ đặt dấu chấm câu ở cuối câu.",
        "stem": "What are these? (Nhìn tranh những chiếc gối)",
        "image_url": "assets/exam_images/unit_03/u03_p2_q03.png",
        "options": [],
        "correct_answer": "They are pillows.",
        "acceptable_variants": [
            "They are pillows.", "They are pillows", "They're pillows.", "They're pillows",
            "these are pillows.", "these are pillows", "These are pillows."
        ],
        "explanation": "【Câu hỏi What số nhiều】 Hình ảnh hiển thị những chiếc gối (pillows). Câu hỏi 'What are these?' trả lời bằng đại từ số nhiều: 'They are pillows.' hoặc 'They're pillows.'."
    },
    {
        "id": "u03_q04",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi)",
        "type": "typing",
        "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng. Nhớ đặt dấu chấm câu ở cuối câu.",
        "stem": "Who are those? (Nhìn tranh các bác sĩ)",
        "image_url": "assets/exam_images/unit_03/u03_p2_q04.png",
        "options": [],
        "correct_answer": "They are doctors.",
        "acceptable_variants": [
            "They are doctors.", "They are doctors", "They're doctors.", "They're doctors",
            "those are doctors.", "those are doctors", "Those are doctors."
        ],
        "explanation": "【Câu hỏi Who chỉ người】 Hình ảnh hiển thị những người bác sĩ (doctors) mặc áo blouse. Câu hỏi chỉ người ở vị trí xa 'Who are those?' trả lời: 'They are doctors.' hoặc 'They're doctors.'."
    },
    {
        "id": "u03_q05",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi)",
        "type": "typing",
        "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho câu hỏi tương ứng. Nhớ đặt dấu chấm câu ở cuối câu.",
        "stem": "What is that? (Nhìn tranh chiếc túi xách)",
        "image_url": "assets/exam_images/unit_03/u03_p2_q05.png",
        "options": [],
        "correct_answer": "It is a bag.",
        "acceptable_variants": [
            "It is a bag.", "It is a bag", "It's a bag.", "It's a bag",
            "that is a bag.", "that is a bag", "That is a bag."
        ],
        "explanation": "【Câu hỏi What số ít】 Hình ảnh là chiếc túi xách (bag) ở xa. Câu hỏi 'What is that?' trả lời: 'It is a bag.' hoặc 'It's a bag.'."
    }
]

# Update Q1-5 in Unit 3
for i, vq in enumerate(u3_visual):
    u3[i] = vq

# Q6-10: Multiple Choice Part 1
u3[5]['stem'] = "Question 1. _______ is this? – It’s a desk."
u3[5]['options'] = ["A. What", "B. Who"]
u3[5]['correct_answer'] = "A. What"
u3[5]['acceptable_variants'] = ["A. What", "What", "what", "A"]
u3[5]['explanation'] = "【Phân biệt Who / What】 'a desk' (cái bàn học) là danh từ chỉ đồ vật $\\implies$ dùng từ để hỏi 'What'. Đáp án đúng là 'What is this?'."

u3[6]['stem'] = "Question 2. _______ are these? – They are shirts."
u3[6]['options'] = ["A. What", "B. Who"]
u3[6]['correct_answer'] = "A. What"
u3[6]['acceptable_variants'] = ["A. What", "What", "what", "A"]
u3[6]['explanation'] = "【Phân biệt Who / What】 'shirts' (áo sơ mi) là danh từ chỉ vật số nhiều $\\implies$ dùng từ để hỏi 'What'. Câu hỏi đúng: 'What are these?'."

u3[7]['stem'] = "Question 3. _______ are these? – They are my children."
u3[7]['options'] = ["A. What", "B. Who"]
u3[7]['correct_answer'] = "B. Who"
u3[7]['acceptable_variants'] = ["B. Who", "Who", "who", "B"]
u3[7]['explanation'] = "【Phân biệt Who / What】 'my children' (những đứa con của tôi) là danh từ chỉ người số nhiều $\\implies$ bắt buộc dùng từ để hỏi 'Who'. Câu hỏi đúng: 'Who are these?'."

u3[8]['stem'] = "Question 4. _______ is this? – It is my friend."
u3[8]['options'] = ["A. What", "B. Who"]
u3[8]['correct_answer'] = "B. Who"
u3[8]['acceptable_variants'] = ["B. Who", "Who", "who", "B"]
u3[8]['explanation'] = "【Phân biệt Who / What】 'my friend' (bạn của tôi) là danh từ chỉ người $\\implies$ từ để hỏi phải là 'Who'. Câu hỏi đúng: 'Who is this?'."

u3[9]['stem'] = "Question 5. _______ are those? – They are her jeans."
u3[9]['options'] = ["A. What", "B. Who"]
u3[9]['correct_answer'] = "A. What"
u3[9]['acceptable_variants'] = ["A. What", "What", "what", "A"]
u3[9]['explanation'] = "【Phân biệt Who / What】 'her jeans' (quần bò/quần jean) là đồ vật (trang phục) $\\implies$ bắt buộc dùng từ để hỏi 'What'. Do đó câu hỏi chuẩn xác là: 'What are those? – They are her jeans.'."

# Q11-15: Multiple Choice Part 2
u3[10]['stem'] = "Question 1. What are _______? – They are her dogs."
u3[10]['options'] = ["A. those", "B. it", "C. you"]
u3[10]['correct_answer'] = "A. those"
u3[10]['acceptable_variants'] = ["A. those", "those", "A"]
u3[10]['explanation'] = "【Hòa hợp đại từ và To Be】 Động từ to be 'are' và câu trả lời 'They are her dogs' ở số nhiều $\\implies$ đại từ chỉ định đi kèm phải là 'those'. Không dùng 'it' (số ít)."

u3[11]['stem'] = "Question 2. Who are they? – They _______ our classmates."
u3[11]['options'] = ["A. is", "B. am", "C. are"]
u3[11]['correct_answer'] = "C. are"
u3[11]['acceptable_variants'] = ["C. are", "are", "C"]
u3[11]['explanation'] = "【Chia động từ To Be】 Chủ ngữ 'They' (họ/chúng nó) là đại từ ngôi thứ 3 số nhiều $\\implies$ động từ to be bắt buộc là 'are': 'They are our classmates.'."

u3[12]['stem'] = "Question 3. What is this? – _______ a chair."
u3[12]['options'] = ["A. They’re", "B. It’s", "C. I’m"]
u3[12]['correct_answer'] = "B. It’s"
u3[12]['acceptable_variants'] = ["B. It’s", "It’s", "It's", "it's", "it is", "B"]
u3[12]['explanation'] = "【Đại từ thay thế đồ vật số ít】 'a chair' (một cái ghế) là danh từ số ít $\\implies$ đại từ nhân xưng thay thế là 'It's' (It is). 'They're' dùng cho số nhiều."

u3[13]['stem'] = "Question 4. Who is this? – _______ is my friend."
u3[13]['options'] = ["A. It", "B. You", "C. They"]
u3[13]['correct_answer'] = "A. It"
u3[13]['acceptable_variants'] = ["A. It", "It", "it", "This", "this", "A"]
u3[13]['explanation'] = "【Trả lời câu hỏi Who is this】 Khi trả lời cho câu hỏi nhận diện 'Who is this?', ta dùng cấu trúc chuẩn 'It is my friend.' (Đó là bạn của tôi)."

u3[14]['stem'] = "Question 5. Who _______ that? – It’s his grandmother."
u3[14]['options'] = ["A. is", "B. are", "C. am"]
u3[14]['correct_answer'] = "A. is"
u3[14]['acceptable_variants'] = ["A. is", "is", "A"]
u3[14]['explanation'] = "【Chia động từ To Be với That】 'that' là đại từ chỉ định số ít (người/vật ở xa) $\\implies$ đi cùng động từ to be 'is': 'Who is that?'."

# ==========================================
# 3. UNIT 4 FIXES
# ==========================================
u4 = data['4']['unit_test']

# Q1-5: Question words Where / When
u4[0]['stem'] = "Question 1. _______ is your exam? – It’s on Monday."
u4[0]['options'] = ["A. When", "B. Where"]
u4[0]['correct_answer'] = "A. When"
u4[0]['acceptable_variants'] = ["A. When", "When", "when", "A"]
u4[0]['explanation'] = "【Hỏi thời gian】 Câu trả lời 'It’s on Monday' (Vào thứ Hai) chỉ mốc thời gian $\\implies$ dùng từ để hỏi 'When' (Khi nào)."

u4[1]['stem'] = "Question 2. _______ is my clock? – It’s on the wall."
u4[1]['options'] = ["A. When", "B. Where"]
u4[1]['correct_answer'] = "B. Where"
u4[1]['acceptable_variants'] = ["B. Where", "Where", "where", "B"]
u4[1]['explanation'] = "【Hỏi nơi chốn】 Câu trả lời 'It’s on the wall' (Trên tường) chỉ địa điểm, vị trí $\\implies$ dùng từ để hỏi 'Where' (Ở đâu)."

u4[2]['stem'] = "Question 3. _______ is the class? – It’s on Wednesday."
u4[2]['options'] = ["A. When", "B. Where"]
u4[2]['correct_answer'] = "A. When"
u4[2]['acceptable_variants'] = ["A. When", "When", "when", "A"]
u4[2]['explanation'] = "【Hỏi thời gian】 Câu trả lời 'It’s on Wednesday' (Vào thứ Tư) chỉ thời gian $\\implies$ dùng từ để hỏi 'When'."

u4[3]['stem'] = "Question 4. _______ are the kids? – They are in the park."
u4[3]['options'] = ["A. When", "B. Where"]
u4[3]['correct_answer'] = "B. Where"
u4[3]['acceptable_variants'] = ["B. Where", "Where", "where", "B"]
u4[3]['explanation'] = "【Hỏi nơi chốn】 Câu trả lời 'They are in the park' (Trong công viên) chỉ vị trí $\\implies$ dùng từ để hỏi 'Where'."

u4[4]['stem'] = "Question 5. _______ is your bag? – It’s on the table."
u4[4]['options'] = ["A. When", "B. Where"]
u4[4]['correct_answer'] = "B. Where"
u4[4]['acceptable_variants'] = ["B. Where", "Where", "where", "B"]
u4[4]['explanation'] = "【Hỏi nơi chốn】 Câu trả lời 'It’s on the table' (Trên bàn) chỉ vị trí $\\implies$ dùng từ để hỏi 'Where'."

# Q6-10: Prepositions of place & time
u4[5]['stem'] = "Question 1. We are _______ the supermarket."
u4[5]['options'] = ["A. in", "B. on", "C. at"]
u4[5]['correct_answer'] = "C. at"
u4[5]['acceptable_variants'] = [
    "C. at", "at", "in", "A. in", "A", "C",
    "at the supermarket", "in the supermarket", "We are at the supermarket.", "We are in the supermarket."
]
u4[5]['explanation'] = "【Giới từ chỉ nơi chốn】 Đi với địa điểm công cộng như 'supermarket', tiếng Anh chấp nhận cả 'at' (ở siêu thị như một điểm đến) và 'in' (bên trong siêu thị). Đáp án chuẩn trong bài là 'at' (C), đồng thời hệ thống chấp nhận cả phương án 'in'."

u4[6]['stem'] = "Question 2. The jeans are _______ the wardrobe."
u4[6]['options'] = ["A. in", "B. on", "C. at"]
u4[6]['correct_answer'] = "A. in"
u4[6]['acceptable_variants'] = ["A. in", "in", "A"]
u4[6]['explanation'] = "【Giới từ chỉ nơi chốn】 Quần áo ở 'trong' tủ quần áo (wardrobe) $\\implies$ dùng giới từ 'in'."

u4[7]['stem'] = "Question 3. His birthday is _______ Monday."
u4[7]['options'] = ["A. in", "B. on", "C. at"]
u4[7]['correct_answer'] = "B. on"
u4[7]['acceptable_variants'] = ["B. on", "on", "B"]
u4[7]['explanation'] = "【Giới từ chỉ thời gian】 Đi trước các thứ trong tuần (Monday, Tuesday,...) bắt buộc dùng giới từ 'on': 'on Monday'."

u4[8]['stem'] = "Question 4. The Math class is _______ the morning."
u4[8]['options'] = ["A. in", "B. on", "C. at"]
u4[8]['correct_answer'] = "A. in"
u4[8]['acceptable_variants'] = ["A. in", "in", "A"]
u4[8]['explanation'] = "【Giới từ chỉ thời gian】 Đi trước các buổi trong ngày (the morning, the afternoon, the evening) dùng giới từ 'in': 'in the morning'."

u4[9]['stem'] = "Question 5. The oranges are _______ the floor."
u4[9]['options'] = ["A. in", "B. on", "C. at"]
u4[9]['correct_answer'] = "B. on"
u4[9]['acceptable_variants'] = ["B. on", "on", "B"]
u4[9]['explanation'] = "【Giới từ chỉ nơi chốn】 Tiếp xúc trên bề mặt sàn nhà (the floor) dùng giới từ 'on': 'on the floor'."

# Q11-15: Visual Questions Unit 4
u4[10] = {
    "id": "u04_q11",
    "part": 3,
    "part_title": "Part 3: Visual Q&A (Nhìn hình trả lời câu hỏi)",
    "type": "typing",
    "instruction": "Dựa vào các hình ảnh sau để viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Nhớ đặt dấu chấm ở cuối câu.",
    "stem": "Where is your brother? (Nhìn tranh anh trai làm việc tại bàn văn phòng)",
    "image_url": "assets/exam_images/unit_04/u04_q01.png",
    "options": [],
    "correct_answer": "He is at work.",
    "acceptable_variants": [
        "He is at work.", "He is at work", "He's at work.", "He's at work",
        "He is in the office.", "He is in the office", "He is at the office.", "He is at the office",
        "He's in the office.", "He's at the office.", "he is at work.", "he is at work"
    ],
    "explanation": "【Nhận diện tranh & Địa điểm】 Bức tranh hiển thị người anh trai đang ngồi làm việc tại bàn máy tính văn phòng. Câu trả lời chính xác là 'He is at work.' hoặc 'He is at the office.' / 'He is in the office.' (tuyệt đối không phải nhà bếp hay phòng khách)."
}

u4[11] = {
    "id": "u04_q12",
    "part": 3,
    "part_title": "Part 3: Visual Q&A (Nhìn hình trả lời câu hỏi)",
    "type": "typing",
    "instruction": "Dựa vào các hình ảnh sau để viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Nhớ đặt dấu chấm ở cuối câu.",
    "stem": "When is the English class? (Nhìn tranh đồng hồ chỉ 9:00)",
    "image_url": "assets/exam_images/unit_04/u04_q02.png",
    "options": [],
    "correct_answer": "It is at 9:00.",
    "acceptable_variants": [
        "It is at 9:00.", "It is at 9:00", "It's at 9:00.", "It's at 9:00",
        "It is at 9 o'clock.", "It's at 9 o'clock.", "It is at 9:00", "9:00", "At 9:00."
    ],
    "explanation": "【Nhận diện đồng hồ & Giới từ thời gian】 Kim đồng hồ chỉ đúng 9 giờ. Trả lời cho câu hỏi 'When is the English class?' là: 'It is at 9:00.' (hoặc 'It's at 9 o'clock.'). Lưu ý giờ giấc đi với giới từ 'at'."
}

u4[12] = {
    "id": "u04_q13",
    "part": 3,
    "part_title": "Part 3: Visual Q&A (Nhìn hình trả lời câu hỏi)",
    "type": "typing",
    "instruction": "Dựa vào các hình ảnh sau để viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Nhớ đặt dấu chấm ở cuối câu.",
    "stem": "Where are your parents? (Nhìn tranh bố mẹ ở ga tàu)",
    "image_url": "assets/exam_images/unit_04/u04_q03.png",
    "options": [],
    "correct_answer": "They are at the train station.",
    "acceptable_variants": [
        "They are at the train station.", "They are at the train station",
        "They're at the train station.", "They're at the train station",
        "they are at the train station.", "they are at the train station"
    ],
    "explanation": "【Nhận diện bối cảnh địa điểm】 Bức tranh hiển thị bố mẹ đang ở ga tàu hoả (train station). Chủ ngữ số nhiều 'parents' dùng đại từ 'They are': 'They are at the train station.'."
}

u4[13] = {
    "id": "u04_q14",
    "part": 3,
    "part_title": "Part 3: Visual Q&A (Nhìn hình trả lời câu hỏi)",
    "type": "typing",
    "instruction": "Dựa vào các hình ảnh sau để viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Nhớ đặt dấu chấm ở cuối câu.",
    "stem": "Where is her cat? (Nhìn tranh con mèo nằm trên ghế sofa)",
    "image_url": "assets/exam_images/unit_04/u04_q04.png",
    "options": [],
    "correct_answer": "It is on the sofa.",
    "acceptable_variants": [
        "It is on the sofa.", "It is on the sofa", "It's on the sofa.", "It's on the sofa",
        "The cat is on the sofa.", "The cat is on the sofa", "it is on the sofa."
    ],
    "explanation": "【Nhận diện tranh & Giới từ on】 Con mèo đang nằm ngủ trên chiếc ghế sô-pha. Câu trả lời chính xác: 'It is on the sofa.' (hoặc 'It's on the sofa.')."
}

u4[14] = {
    "id": "u04_q15",
    "part": 3,
    "part_title": "Part 3: Visual Q&A (Nhìn hình trả lời câu hỏi)",
    "type": "typing",
    "instruction": "Dựa vào các hình ảnh sau để viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Nhớ đặt dấu chấm ở cuối câu.",
    "stem": "When is his birthday? (Nhìn tranh bánh kem kèm tờ lịch ghi Tuesday)",
    "image_url": "assets/exam_images/unit_04/u04_q05.png",
    "options": [],
    "correct_answer": "It is on Tuesday.",
    "acceptable_variants": [
        "It is on Tuesday.", "It is on Tuesday", "It's on Tuesday.", "It's on Tuesday",
        "it is on tuesday.", "it is on tuesday", "On Tuesday."
    ],
    "explanation": "【Nhận diện thứ trong tuần】 Bức tranh hiển thị chiếc bánh kem sinh nhật kèm ghi chú ngày thứ Ba (Tuesday). Trả lời mốc thời gian thứ trong tuần dùng giới từ 'on': 'It is on Tuesday.' (hoặc 'It's on Tuesday.')."
}

# ==========================================
# 4. UNIT 7 FIXES
# ==========================================
u7 = data['7']['unit_test']

u7_visual = [
    {
        "id": "u07_q01",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi ngắn)",
        "type": "typing",
        "instruction": "Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Không cần thêm dấu chấm ở cuối câu.",
        "stem": "1. Does the child like ice cream? (Nhìn tranh em bé đang ăn kem vui vẻ) → Yes, ______________.",
        "image_url": "assets/exam_images/unit_07/u07_q01.png",
        "options": [],
        "correct_answer": "he does",
        "acceptable_variants": ["he does", "Yes, he does", "she does", "Yes, she does", "he does.", "she does."],
        "explanation": "【Câu hỏi Yes/No thì Hiện tại đơn】 Tranh vẽ em bé thích thú ăn que kem. Với câu hỏi 'Does the child like ice cream?', câu trả lời ngắn khẳng định là: 'Yes, he does' (hoặc 'Yes, she does')."
    },
    {
        "id": "u07_q02",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi ngắn)",
        "type": "typing",
        "instruction": "Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Không cần thêm dấu chấm ở cuối câu.",
        "stem": "2. Do they buy vegetables at the supermarket? (Nhìn tranh hai người chọn rau củ) → ___________________.",
        "image_url": "assets/exam_images/unit_07/u07_q02.png",
        "options": [],
        "correct_answer": "Yes, they do",
        "acceptable_variants": ["Yes, they do", "yes, they do", "they do", "Yes, they do.", "they do."],
        "explanation": "【Câu hỏi Yes/No thì Hiện tại đơn】 Tranh vẽ hai người đang mua rau củ tại siêu thị. Câu hỏi 'Do they buy vegetables at the supermarket?' trả lời khẳng định: 'Yes, they do'."
    },
    {
        "id": "u07_q03",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi ngắn)",
        "type": "typing",
        "instruction": "Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Không cần thêm dấu chấm ở cuối câu.",
        "stem": "3. Does the boy clean his room? (Nhìn tranh căn phòng bừa bộn đồ đạc) → ____________________.",
        "image_url": "assets/exam_images/unit_07/u07_q03.png",
        "options": [],
        "correct_answer": "No, he doesn't",
        "acceptable_variants": [
            "No, he doesn't", "No, he doesn’t", "no, he doesn't", "no, he doesn’t",
            "No, he does not", "he doesn't", "he doesn’t", "No, he doesn't."
        ],
        "explanation": "【Câu hỏi Yes/No thì Hiện tại đơn】 Tranh vẽ phòng của cậu bé rất bừa bộn chưa dọn dẹp. Câu hỏi 'Does the boy clean his room?' trả lời phủ định: 'No, he doesn't' (hoặc 'No, he does not')."
    },
    {
        "id": "u07_q04",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi ngắn)",
        "type": "typing",
        "instruction": "Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Không cần thêm dấu chấm ở cuối câu.",
        "stem": "4. Does it snow in the summer? (Nhìn tranh mặt trời mùa hè chói chang) → ____________________.",
        "image_url": "assets/exam_images/unit_07/u07_q04.png",
        "options": [],
        "correct_answer": "No, it doesn't",
        "acceptable_variants": [
            "No, it doesn't", "No, it doesn’t", "no, it doesn't", "no, it doesn’t",
            "No, it does not", "it doesn't", "it doesn’t", "No, it doesn't."
        ],
        "explanation": "【Câu hỏi Yes/No thì Hiện tại đơn】 Mùa hè trời nắng nóng, không có tuyết rơi. Với câu hỏi 'Does it snow in the summer?', câu trả lời là: 'No, it doesn't' (hoặc 'No, it does not')."
    },
    {
        "id": "u07_q05",
        "part": 1,
        "part_title": "Part 1: Visual Q&A (Nhìn tranh trả lời câu hỏi ngắn)",
        "type": "typing",
        "instruction": "Dựa vào các bức tranh sau, viết câu trả lời phù hợp cho mỗi câu hỏi tương ứng. Không cần thêm dấu chấm ở cuối câu.",
        "stem": "5. Do the students wear hats? (Nhìn tranh các học sinh để đầu trần đến trường) → ____________________.",
        "image_url": "assets/exam_images/unit_07/u07_q05.png",
        "options": [],
        "correct_answer": "No, they don't",
        "acceptable_variants": [
            "No, they don't", "No, they don’t", "no, they don't", "no, they don’t",
            "No, they do not", "they don't", "they don’t", "No, they don't."
        ],
        "explanation": "【Câu hỏi Yes/No thì Hiện tại đơn】 Các học sinh trong tranh không đội mũ khi đến trường. Câu hỏi 'Do the students wear hats?' trả lời phủ định: 'No, they don't'."
    }
]

for i, vq in enumerate(u7_visual):
    u7[i] = vq

# Q6-15: Multiple Choice
u7_mcq = [
    ("Question 1. Does Anna _______ the violin?", ["A. plays", "B. play"], "B. play", ["B. play", "play", "B"], "【Trợ động từ Does】 Trong câu hỏi với Does, động từ chính luôn ở dạng nguyên mẫu không 's/es': 'Does Anna play...?'."),
    ("Question 2. _______ they visit the cinema on weekends?", ["A. Do", "B. Does"], "A. Do", ["A. Do", "Do", "do", "A"], "【Trợ động từ Do/Does】 Chủ ngữ 'they' (số nhiều) đi với trợ động từ 'Do': 'Do they visit...?'."),
    ("Question 3. Do you _______ to the gym in the afternoon?", ["A. go", "B. goes"], "A. go", ["A. go", "go", "A"], "【Động từ nguyên mẫu】 Sau trợ động từ 'Do', động từ chính giữ nguyên mẫu 'go'."),
    ("Question 4. Do they _______ at university?", ["A. studies", "B. study"], "B. study", ["B. study", "study", "B"], "【Động từ nguyên mẫu】 Sau trợ động từ 'Do', động từ giữ nguyên mẫu 'study'."),
    ("Question 5. _______ he feed the cat in the evening?", ["A. Does", "B. Do"], "A. Does", ["A. Does", "Does", "does", "A"], "【Trợ động từ Does】 Chủ ngữ 'he' (ngôi thứ 3 số ít) dùng trợ động từ 'Does': 'Does he feed...?'."),
    ("Question 6. Does it rain in the winter? – Yes, it _______.", ["A. do", "B. does"], "B. does", ["B. does", "does", "B"], "【Câu trả lời ngắn khẳng định】 Chủ ngữ 'it' đi với 'does': 'Yes, it does.'."),
    ("Question 7. Do your parents rent a flat? – No, they _______.", ["A. don’t", "B. doesn’t"], "A. don’t", ["A. don’t", "don’t", "don't", "A"], "【Câu trả lời ngắn phủ định】 Chủ ngữ 'they' (your parents) đi với phủ định 'don't': 'No, they don't.'."),
    ("Question 8. Does your daughter want the pie? – Yes, she _______.", ["A. does", "B. doesn’t"], "A. does", ["A. does", "does", "A"], "【Câu trả lời ngắn khẳng định】 Khẳng định với 'Yes' và ngôi 'she' dùng 'does': 'Yes, she does.'."),
    ("Question 9. Do your grandparents _______ at 10.00? – No, they don’t.", ["A. sleeps", "B. sleep"], "B. sleep", ["B. sleep", "sleep", "B"], "【Động từ nguyên mẫu】 Sau trợ động từ 'Do', động từ chính là 'sleep' nguyên mẫu."),
    ("Question 10. _______ he finish his homework at night? – Yes, he _______.", ["A. Does – does", "B. Do – do"], "A. Does – does", ["A. Does – does", "Does – does", "does - does", "A"], "【Cấu trúc câu hỏi và trả lời ngắn】 Chủ ngữ 'he' dùng trợ động từ 'Does' ở đầu câu và trả lời ngắn 'Yes, he does.' $\\implies$ Chọn 'Does – does'.")
]

for idx, (stem, opts, ans, vars_, expl) in enumerate(u7_mcq):
    q_idx = 5 + idx
    u7[q_idx]['stem'] = stem
    u7[q_idx]['options'] = opts
    u7[q_idx]['correct_answer'] = ans
    u7[q_idx]['acceptable_variants'] = vars_
    u7[q_idx]['explanation'] = expl

# Q16-20: Sentence Transformation
u7_trans = [
    ("Question 1. His mother drinks tea in the morning. → ______________________________________________________________",
     "Does his mother drink tea in the morning?",
     ["Does his mother drink tea in the morning?", "Does his mother drink tea in the morning", "A. Does his mother drink tea in the morning?", "A"],
     "【Chuyển sang thể nghi vấn】 'His mother' là chủ ngữ số ít $\\implies$ mượn trợ động từ 'Does' đặt lên đầu câu và đưa 'drinks' về nguyên mẫu 'drink'."),

    ("Question 2. Harry eats fruits every evening. → ______________________________________________________________",
     "Does Harry eat fruits every evening?",
     ["Does Harry eat fruits every evening?", "Does Harry eat fruits every evening", "A. Does Harry eat fruits every evening?", "A"],
     "【Chuyển sang thể nghi vấn】 'Harry' là tên riêng số ít $\\implies$ mượn 'Does' lên đầu câu, động từ 'eats' chuyển thành 'eat' nguyên mẫu."),

    ("Question 3. Joey teaches him English. → ______________________________________________________________",
     "Does Joey teach him English?",
     ["Does Joey teach him English?", "Does Joey teach him English", "A. Does Joey teach him English?", "A"],
     "【Chuyển sang thể nghi vấn】 'Joey' là chủ ngữ số ít $\\implies$ dùng 'Does' và đưa 'teaches' về nguyên mẫu 'teach'."),

    ("Question 4. Her sisters work at a bank. → ______________________________________________________________",
     "Do her sisters work at a bank?",
     ["Do her sisters work at a bank?", "Do her sisters work at a bank", "A. Do her sisters work at a bank?", "A"],
     "【Chuyển sang thể nghi vấn】 'Her sisters' là danh từ số nhiều $\\implies$ mượn trợ động từ 'Do' đặt lên đầu câu: 'Do her sisters work at a bank?'."),

    ("Question 5. Their father buys them new toys. → ______________________________________________________________",
     "Does their father buy them new toys?",
     ["Does their father buy them new toys?", "Does their father buy them new toys", "A. Does their father buy them new toys?", "A"],
     "【Chuyển sang thể nghi vấn】 'Their father' là chủ ngữ số ít $\\implies$ mượn 'Does' và đưa 'buys' về nguyên mẫu 'buy'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(u7_trans):
    q_idx = 15 + idx
    u7[q_idx]['stem'] = stem
    u7[q_idx]['options'] = [f"A. {ans}"]
    u7[q_idx]['correct_answer'] = f"A. {ans}"
    u7[q_idx]['acceptable_variants'] = vars_
    u7[q_idx]['explanation'] = expl

# ==========================================
# 5. UNIT 13 FIXES
# ==========================================
u13 = data['13']['unit_test']

# Q1-5: Fill in the blank (Past simple)
u13[0]['stem'] = "1. My brother ____________ (not/pay) the bill last night."
u13[0]['options'] = ["A. didn't pay", "B. doesn't pay", "C. didn't paid"]
u13[0]['correct_answer'] = "A. didn't pay"
u13[0]['acceptable_variants'] = ["A. didn't pay", "didn't pay", "didn’t pay", "did not pay", "A"]
u13[0]['explanation'] = "【Thì Quá khứ đơn - Phủ định】 Dấu hiệu thời gian quá khứ 'last night'. Thể phủ định của động từ thường ở quá khứ đơn: S + did not (didn't) + V nguyên mẫu ('pay')."

u13[1]['stem'] = "2. _______ they _______ (win) the contest last Sunday?"
u13[1]['options'] = ["A. Did – win", "B. Do – win", "C. Did – won"]
u13[1]['correct_answer'] = "A. Did – win"
u13[1]['acceptable_variants'] = ["A. Did – win", "Did – win", "Did - win", "did - win", "A"]
u13[1]['explanation'] = "【Thì Quá khứ đơn - Nghi vấn】 Dấu hiệu 'last Sunday'. Cấu trúc nghi vấn quá khứ đơn: Did + S + V nguyên mẫu? $\\implies$ 'Did – win'."

u13[2]['stem'] = "3. We ____________ (be/not) at home last night."
u13[2]['options'] = ["A. weren't", "B. wasn't", "C. aren't"]
u13[2]['correct_answer'] = "A. weren't"
u13[2]['acceptable_variants'] = ["A. weren't", "weren't", "weren’t", "were not", "A"]
u13[2]['explanation'] = "【To Be ở Quá khứ đơn - Phủ định】 Chủ ngữ 'We' (chúng tôi) đi với dạng số nhiều của To Be ở quá khứ phủ định là 'were not' (weren't)."

u13[3]['stem'] = "4. They ____________ (not/ come) to the meeting yesterday."
u13[3]['options'] = ["A. didn’t come", "B. don't come", "C. didn't came"]
u13[3]['correct_answer'] = "A. didn’t come"
u13[3]['acceptable_variants'] = ["A. didn’t come", "didn’t come", "didn't come", "did not come", "A"]
u13[3]['explanation'] = "【Thì Quá khứ đơn - Phủ định】 Dấu hiệu 'yesterday'. Cấu trúc phủ định: didn't + V nguyên mẫu 'come'."

u13[4]['stem'] = "5. _______ it _______ (rain) last week?"
u13[4]['options'] = ["A. Did – rain", "B. Does – rain", "C. Was – rain"]
u13[4]['correct_answer'] = "A. Did – rain"
u13[4]['acceptable_variants'] = ["A. Did – rain", "Did – rain", "Did - rain", "did - rain", "A"]
u13[4]['explanation'] = "【Thì Quá khứ đơn - Nghi vấn】 Dấu hiệu 'last week'. Thể nghi vấn dùng trợ động từ 'Did' + động từ nguyên mẫu 'rain'."

# Q6-10: Visual Q&A
u13_vis = [
    ("1. Were they at the airport? (Nhìn tranh hai người ở sân bay) - Yes, they __________.", "were", ["were", "Yes, they were", "they were"], "【Trả lời ngắn To Be quá khứ】 Tranh vẽ hai người đang ở sân bay. Với câu hỏi 'Were they at the airport?', câu trả lời ngắn khẳng định là 'Yes, they were'."),
    ("2. Did the boy break the vase? (Nhìn tranh cậu bé làm vỡ bình hoa) - __________________.", "Yes, he did", ["Yes, he did", "yes, he did", "he did", "Yes, he did."], "【Trả lời ngắn trợ động từ Did】 Tranh vẽ cậu bé làm vỡ chiếc bình hoa trên sàn. Câu hỏi 'Did the boy break the vase?' trả lời khẳng định: 'Yes, he did'."),
    ("3. Did the baby cry last night? (Nhìn tranh em bé đang ngủ say, không khóc) - No, __________________.", "he didn't", ["he didn't", "he didn’t", "she didn't", "she didn’t", "he did not", "she did not", "No, he didn't"], "【Trả lời ngắn phủ định Did】 Tranh vẽ em bé đang ngủ rất ngoan và bình yên. Trả lời phủ định cho câu hỏi 'Did the baby cry last night?': 'No, he didn't' (hoặc 'she didn't')."),
    ("4. Was their bedroom tidy? (Nhìn tranh phòng ngủ sạch sẽ, ngăn nắp) - _____________________.", "Yes, it was", ["Yes, it was", "yes, it was", "it was", "Yes, it was."], "【Trả lời ngắn To Be số ít】 Tranh vẽ phòng ngủ rất gọn gàng, sạch đẹp. Trả lời khẳng định cho 'Was their bedroom tidy?': 'Yes, it was'."),
    ("5. Did Hung wear a suit to school? (Nhìn tranh Hùng mặc quần áo thường) - _____________________.", "No, he didn't", ["No, he didn't", "No, he didn’t", "he didn't", "he didn’t", "No, he did not", "he did not"], "【Trả lời ngắn phủ định Did】 Tranh vẽ Hùng mặc áo phông và quần thường đi học, không mặc bộ com-lê (suit). Trả lời phủ định: 'No, he didn't'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(u13_vis):
    q_idx = 5 + idx
    u13[q_idx]['stem'] = stem
    u13[q_idx]['correct_answer'] = ans
    u13[q_idx]['acceptable_variants'] = vars_
    u13[q_idx]['explanation'] = expl

# Q11-20: Multiple Choice Unit 13
u13_mcq = [
    ("Question 1. My parents _______ the old house in 2000.", ["A. didn’t sell", "B. don’t sell", "C. doesn’t sell"], "A. didn’t sell", ["A. didn’t sell", "didn’t sell", "didn't sell", "A"], "【Quá khứ đơn mốc thời gian】 'in 2000' là mốc thời gian trong quá khứ $\\implies$ dùng 'didn’t sell'."),
    ("Question 2. _______ your father work at a factory in 2014?", ["A. Does", "B. Do", "C. Did"], "C. Did", ["C. Did", "Did", "did", "C"], "【Trợ động từ quá khứ】 Mốc năm 'in 2014' trong quá khứ $\\implies$ dùng trợ động từ 'Did'."),
    ("Question 3. Daniel _______ up late yesterday.", ["A. doesn’t get", "B. don’t get", "C. didn’t get"], "C. didn’t get", ["C. didn’t get", "didn’t get", "didn't get", "C"], "【Dấu hiệu yesterday】 'yesterday' là quá khứ $\\implies$ thể phủ định là 'didn’t get'."),
    ("Question 4. The vegetables _______ fresh yesterday.", ["A. isn’t", "B. weren’t", "C. wasn’t"], "B. weren’t", ["B. weren’t", "weren’t", "weren't", "B"], "【To Be quá khứ số nhiều】 'The vegetables' là danh từ số nhiều $\\implies$ phủ định quá khứ là 'weren’t'."),
    ("Question 5. Did your child _______ a hat to school yesterday?", ["A. wearing", "B. wore", "C. wear"], "C. wear", ["C. wear", "wear", "C"], "【Động từ nguyên mẫu sau Did】 Sau trợ động từ 'Did', động từ chính luôn ở dạng nguyên mẫu 'wear'."),
    ("Question 6. He _______ me a letter last month.", ["A. don’t send", "B. didn’t send", "C. doesn’t send"], "B. didn’t send", ["B. didn’t send", "didn’t send", "didn't send", "B"], "【Dấu hiệu last month】 Thời điểm 'last month' chia thì quá khứ đơn $\\implies$ dùng 'didn’t send'."),
    ("Question 7. _______ it hot yesterday?", ["A. Is", "B. Was", "C. Were"], "B. Was", ["B. Was", "Was", "was", "B"], "【To Be quá khứ số ít】 Chủ ngữ 'it' đi với động từ to be ở quá khứ là 'Was': 'Was it hot yesterday?'."),
    ("Question 8. My sister _______ new shoes last month.", ["A. didn’t buy", "B. don’t buy", "C. doesn’t buy"], "A. didn’t buy", ["A. didn’t buy", "didn’t buy", "didn't buy", "A"], "【Dấu hiệu last month】 Thời gian 'last month' chia thì quá khứ $\\implies$ dùng 'didn’t buy'."),
    ("Question 9. Lucy _______ busy last night.", ["A. wasn’t", "B. weren’t", "C. aren’t"], "A. wasn’t", ["A. wasn’t", "wasn’t", "wasn't", "A"], "【To Be quá khứ ngôi thứ 3 số ít】 'Lucy' là chủ ngữ số ít $\\implies$ dùng 'wasn’t'."),
    ("Question 10. _______ the party last week funny?", ["A. Were", "B. Was", "C. Are"], "B. Was", ["B. Was", "Was", "was", "B"], "【To Be quá khứ số ít】 'the party' là danh từ số ít $\\implies$ đảo to be 'Was' lên đầu câu: 'Was the party...?'")
]

for idx, (stem, opts, ans, vars_, expl) in enumerate(u13_mcq):
    q_idx = 10 + idx
    u13[q_idx]['stem'] = stem
    u13[q_idx]['options'] = opts
    u13[q_idx]['correct_answer'] = ans
    u13[q_idx]['acceptable_variants'] = vars_
    u13[q_idx]['explanation'] = expl

# ==========================================
# 6. UNIT 16 FIXES
# ==========================================
u16 = data['16']['unit_test']

# Q1-5: Future simple verbs
u16[0]['stem'] = "Question 1. They _____________ (return) home tonight."
u16[0]['options'] = ["A. will return", "B. returned", "C. returns"]
u16[0]['correct_answer'] = "A. will return"
u16[0]['acceptable_variants'] = ["A. will return", "will return", "A"]
u16[0]['explanation'] = "【Thì Tương lai đơn】 'tonight' diễn tả sự việc trong tương lai $\\implies$ cấu trúc will + V nguyên mẫu: 'will return'."

u16[1]['stem'] = "Question 2. We _____________ (be) better soon."
u16[1]['options'] = ["A. will be", "B. are", "C. were"]
u16[1]['correct_answer'] = "A. will be"
u16[1]['acceptable_variants'] = ["A. will be", "will be", "A"]
u16[1]['explanation'] = "【Dấu hiệu soon】 'soon' (sớm) là dấu hiệu tương lai $\\implies$ dùng 'will be'."

u16[2]['stem'] = "Question 3. ______ he _______ (tell) a story tomorrow?"
u16[2]['options'] = ["A. Will – tell", "B. Does – tell", "C. Did – tell"]
u16[2]['correct_answer'] = "A. Will – tell"
u16[2]['acceptable_variants'] = ["A. Will – tell", "Will – tell", "Will - tell", "will - tell", "A"]
u16[2]['explanation'] = "【Thì Tương lai đơn - Nghi vấn】 Dấu hiệu 'tomorrow'. Cấu trúc câu hỏi: Will + S + V nguyên mẫu? $\\implies$ 'Will – tell'."

u16[3]['stem'] = "Question 4. I _____________ (lend) him the book next week."
u16[3]['options'] = ["A. will lend", "B. lent", "C. lends"]
u16[3]['correct_answer'] = "A. will lend"
u16[3]['acceptable_variants'] = ["A. will lend", "will lend", "A"]
u16[3]['explanation'] = "【Dấu hiệu next week】 Mốc 'next week' diễn đạt hành động sẽ xảy ra trong tương lai $\\implies$ dùng 'will lend'."

u16[4]['stem'] = "Question 5. Quang _____________ (not sell) his car next year."
u16[4]['options'] = ["A. won't sell", "B. didn't sell", "C. doesn't sell"]
u16[4]['correct_answer'] = "A. won't sell"
u16[4]['acceptable_variants'] = ["A. won't sell", "won't sell", "won’t sell", "will not sell", "A"]
u16[4]['explanation'] = "【Thì Tương lai đơn - Phủ định】 Dấu hiệu 'next year'. Thể phủ định tương lai đơn: will not (won't) + V nguyên mẫu 'sell'."

# Q6-10: Visual Q&A
u16_vis = [
    ("1. Will the boy travel by car? (Nhìn tranh cậu bé đi xe đạp) - No, __________.", "he won't", ["he won't", "he won’t", "he will not", "No, he won't", "No, he won't."], "【Trả lời ngắn phủ định tương lai】 Tranh vẽ cậu bé đi xe đạp chứ không đi bằng ô tô. Trả lời phủ định: 'No, he won't' (hoặc 'he will not')."),
    ("2. Will you get up at 6.00 tomorrow? (Nhìn tranh đồng hồ chỉ 6:00 thức dậy) - _______________.", "Yes, I will", ["Yes, I will", "yes, i will", "I will", "Yes, I will."], "【Trả lời ngắn khẳng định tương lai】 Tranh vẽ đồng hồ báo thức 6:00 và người thức dậy vui vẻ. Câu hỏi 'Will you...?' trả lời: 'Yes, I will'."),
    ("3. Will they watch a cartoon tonight? (Nhìn tranh đang cùng xem hoạt hình) - _______________.", "Yes, they will", ["Yes, they will", "yes, they will", "they will", "Yes, they will."], "【Trả lời ngắn khẳng định tương lai】 Tranh vẽ họ đang chăm chú xem phim hoạt hình trên TV. Trả lời: 'Yes, they will'."),
    ("4. Will he wear shoes to the party? (Nhìn tranh chân trần, không đi giày) - No, _______________.", "he won't", ["he won't", "he won’t", "he will not", "No, he won't", "No, he won't."], "【Trả lời ngắn phủ định tương lai】 Tranh vẽ cậu ấy không đi giày. Trả lời phủ định: 'No, he won't'."),
    ("5. Will your kids go to school tomorrow? (Nhìn tranh các bé đeo ba lô đi học) - _______________.", "Yes, they will", ["Yes, they will", "yes, they will", "they will", "Yes, they will."], "【Trả lời ngắn khẳng định tương lai】 Tranh vẽ các con đang đeo cặp sách vui vẻ đi tới trường. Trả lời: 'Yes, they will'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(u16_vis):
    q_idx = 5 + idx
    u16[q_idx]['stem'] = stem
    u16[q_idx]['correct_answer'] = ans
    u16[q_idx]['acceptable_variants'] = vars_
    u16[q_idx]['explanation'] = expl

# Q11-20: Multiple Choice Unit 16
u16_mcq = [
    ("Question 1. This bag is so big. I _______ it for you.", ["A. will carry", "B. carried", "C. have carried"], "A. will carry", ["A. will carry", "will carry", "A"], "【Quyết định ngay thời điểm nói】 Thấy túi nặng nên đề nghị giúp đỡ ngay lúc nói $\\implies$ dùng 'will carry'."),
    ("Question 2. They _______ the meeting soon.", ["A. cancelled", "B. have cancelled", "C. will cancel"], "C. will cancel", ["C. will cancel", "will cancel", "C"], "【Dấu hiệu soon】 'soon' chỉ tương lai gần $\\implies$ dùng 'will cancel'."),
    ("Question 3. I don’t think it _______ tomorrow.", ["A. rains", "B. will rain", "C. rained"], "B. will rain", ["B. will rain", "will rain", "B"], "【Dự đoán tương lai】 'I don't think' kết hợp mốc 'tomorrow' $\\implies$ dùng 'will rain'."),
    ("Question 4. It's cold. I _______ on the heater.", ["A. is turning", "B. will turn", "C. turned"], "B. will turn", ["B. will turn", "will turn", "B"], "【Quyết định tại thời điểm nói】 Thấy trời lạnh liền quyết định bật máy sưởi $\\implies$ dùng thì tương lai đơn 'will turn'."),
    ("Question 5. We _______ a new house next year.", ["A. didn’t buy", "B. haven’t bought", "C. won’t buy"], "C. won’t buy", ["C. won’t buy", "won’t buy", "won't buy", "C"], "【Dấu hiệu next year】 Mốc thời gian năm sau 'next year' $\\implies$ thể phủ định tương lai là 'won’t buy'."),
    ("Question 6. I think she _______ back tomorrow.", ["A. will go", "B. goes", "C. went"], "A. will go", ["A. will go", "will go", "A"], "【Dự đoán với I think】 'I think' + mốc 'tomorrow' $\\implies$ chọn 'will go'."),
    ("Question 7. _______ you write your essay tonight?", ["A. Will", "B. Are", "C. Have"], "A. Will", ["A. Will", "Will", "will", "A"], "【Câu hỏi tương lai đơn】 'tonight' với động từ nguyên mẫu 'write' $\\implies$ trợ động từ tương lai là 'Will'."),
    ("Question 8. I think it _______ hot tomorrow.", ["A. was", "B. is", "C. will be"], "C. will be", ["C. will be", "will be", "C"], "【Dự đoán thời tiết ngày mai】 Dự đoán với 'I think' + 'tomorrow' $\\implies$ dùng 'will be'."),
    ("Question 9. Your parents _______ your dog soon.", ["A. feed", "B. will feed", "C. don’t feed"], "B. will feed", ["B. will feed", "will feed", "B"], "【Dấu hiệu soon】 'soon' (sớm) diễn tả hành động sắp xảy ra $\\implies$ dùng 'will feed'."),
    ("Question 10. Freddy _______ a picture next week.", ["A. have brought", "B. bring", "C. will bring"], "C. will bring", ["C. will bring", "will bring", "C"], "【Dấu hiệu next week】 'next week' thuộc thì tương lai đơn $\\implies$ chọn 'will bring'.")
]

for idx, (stem, opts, ans, vars_, expl) in enumerate(u16_mcq):
    q_idx = 10 + idx
    u16[q_idx]['stem'] = stem
    u16[q_idx]['options'] = opts
    u16[q_idx]['correct_answer'] = ans
    u16[q_idx]['acceptable_variants'] = vars_
    u16[q_idx]['explanation'] = expl

# ==========================================
# 7. UNIT 20 FIXES
# ==========================================
u20 = data['20']['unit_test']

# Q1-5: Question words fill in the blank
u20_sec1 = [
    ("1. __________ was the film? – It was great!", "How", ["How", "how"], "【Hỏi tính chất / cảm nhận】 Câu trả lời 'It was great!' (Phim rất hay!) diễn đạt cảm nhận $\\implies$ từ để hỏi là 'How'."),
    ("2. __________ are you late? – Because it is raining.", "Why", ["Why", "why"], "【Hỏi lý do】 Câu trả lời bắt đầu bằng 'Because' (Vì trời đang mưa) $\\implies$ từ để hỏi lý do là 'Why'."),
    ("3. __________ does this book cost? – It is VND 50,000.", "How much", ["How much", "how much"], "【Hỏi giá tiền】 Câu trả lời chỉ mức giá '50,000 VND' $\\implies$ từ để hỏi giá là 'How much'."),
    ("4. __________ do you water the plants? – Twice a week.", "How often", ["How often", "how often"], "【Hỏi tần suất】 Câu trả lời 'Twice a week' (Hai lần một tuần) chỉ tần suất $\\implies$ từ để hỏi là 'How often'."),
    ("5. __________ students are there in your class? – There are 41 students.", "How many", ["How many", "how many"], "【Hỏi số lượng đếm được】 'students' là danh từ đếm được số nhiều, câu trả lời '41 students' $\\implies$ dùng 'How many'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(u20_sec1):
    u20[idx]['stem'] = stem
    u20[idx]['correct_answer'] = ans
    u20[idx]['acceptable_variants'] = vars_
    u20[idx]['explanation'] = expl

# Q6-10: Visual Q&A (Full sentence typing)
u20_sec2 = [
    ("1. How/you A: Hello, Peter. ___________________? B: I am fine, thank you.",
     "How are you",
     ["How are you", "How are you?", "how are you", "how are you?", "A. How are you?"],
     "【Tạo câu hỏi với How】 Dựa vào từ gợi ý 'How/you' và lời đáp 'I am fine, thank you' $\\implies$ câu hỏi chào hỏi sức khỏe là: 'How are you'."),

    ("2. How much/ this hat/ cost A: ____________________________? B: It is VND 40,000.",
     "How much does this hat cost",
     ["How much does this hat cost", "How much does this hat cost?", "how much does this hat cost", "How much is this hat", "How much is this hat?"],
     "【Tạo câu hỏi giá tiền với How much】 Gợi ý 'How much/ this hat/ cost', chủ ngữ 'this hat' số ít với động từ thường 'cost' mượn trợ động từ 'does' $\\implies$ 'How much does this hat cost'."),

    ("3. How many/ cats/ you/ have A: _____________________________? B: I have 3 cats.",
     "How many cats do you have",
     ["How many cats do you have", "How many cats do you have?", "how many cats do you have", "how many cats do you have?"],
     "【Tạo câu hỏi số lượng với How many】 Gợi ý 'How many/ cats/ you/ have' và câu trả lời 'I have 3 cats' $\\implies$ câu hỏi đầy đủ: 'How many cats do you have'."),

    ("4. How/ long/ you/ lived/ Hanoi A: ________________________________? B: For 5 years.",
     "How long have you lived in Hanoi",
     ["How long have you lived in Hanoi", "How long have you lived in Hanoi?", "how long have you lived in hanoi", "How long have you lived in Ha Noi"],
     "【Tạo câu hỏi khoảng thời gian với How long】 Gợi ý 'How/ long/ you/ lived/ Hanoi' và câu trả lời 'For 5 years' $\\implies$ câu hỏi thì hiện tại hoàn thành: 'How long have you lived in Hanoi'."),

    ("5. Why/you/hate/winter? A: _______________________________? B: Because it is cold.",
     "Why do you hate winter",
     ["Why do you hate winter", "Why do you hate winter?", "why do you hate winter", "Why do you hate winter?"],
     "【Tạo câu hỏi nguyên nhân với Why】 Gợi ý 'Why/you/hate/winter?' và câu trả lời 'Because it is cold' $\\implies$ câu hỏi thì hiện tại đơn: 'Why do you hate winter'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(u20_sec2):
    q_idx = 5 + idx
    u20[q_idx]['stem'] = stem
    u20[q_idx]['correct_answer'] = ans
    u20[q_idx]['acceptable_variants'] = vars_
    u20[q_idx]['explanation'] = expl

# Q11-20: Multiple Choice Unit 20
u20_sec3 = [
    ("Question 1. _______ do you go to the library? – Once a week.", ["A. How often", "B. Why", "C. How far"], "A. How often", ["A. How often", "How often", "how often", "A"], "【Hỏi tần suất】 'Once a week' (Một lần một tuần) $\\implies$ dùng từ để hỏi 'How often'."),
    ("Question 2. _______ were you late today? – Because I was tired.", ["A. Which", "B. How", "C. Why"], "C. Why", ["C. Why", "Why", "why", "C"], "【Hỏi lý do】 'Because I was tired' (Vì tôi mệt) là lý do $\\implies$ dùng từ để hỏi 'Why'."),
    ("Question 3. _______ is it from your house to your school? – It’s 1 kilometre.", ["A. Why", "B. Which", "C. How far"], "C. How far", ["C. How far", "How far", "how far", "C"], "【Hỏi khoảng cách】 '1 kilometre' (1 km) là độ dài khoảng cách $\\implies$ dùng 'How far'."),
    ("Question 4. _______ essays did you write? – Three essays.", ["A. Why", "B. How many", "C. How"], "B. How many", ["B. How many", "How many", "how many", "B"], "【Hỏi số lượng】 'Three essays' (3 bài tiểu luận) là số lượng đếm được $\\implies$ dùng 'How many'."),
    ("Question 5. _______ do you go to work every day? – By bus.", ["A. Why", "B. What", "C. How"], "C. How", ["C. How", "How", "how", "C"], "【Hỏi phương tiện đi lại】 'By bus' (Bằng xe buýt) là phương tiện $\\implies$ dùng từ để hỏi 'How'."),
    ("Question 6. _______ vase did Tim break? – The yellow vase.", ["A. Why", "B. Which", "C. How"], "B. Which", ["B. Which", "Which", "which", "B"], "【Hỏi sự lựa chọn】 'The yellow vase' (Chiếc bình màu vàng) chỉ rõ đối tượng cụ thể trong số các lựa chọn $\\implies$ dùng 'Which'."),
    ("Question 7. _______ is your mother? – She is fine.", ["A. How many", "B. How often", "C. How"], "C. How", ["C. How", "How", "how", "C"], "【Hỏi thăm sức khỏe】 'She is fine' (Mẹ khỏe) $\\implies$ dùng từ để hỏi 'How' ('How is your mother?')."),
    ("Question 8. How _______ is your daughter? – She’s 10 years old.", ["A. old", "B. many", "C. much"], "A. old", ["A. old", "old", "A"], "【Hỏi số tuổi】 '10 years old' là tuổi $\\implies$ dùng cấu trúc 'How old'."),
    ("Question 9. _______ are you eating that cake? – Because I’m hungry.", ["A. Why", "B. Which", "C. How"], "A. Why", ["A. Why", "Why", "why", "A"], "【Hỏi nguyên nhân】 'Because I'm hungry' (Vì tôi đói) $\\implies$ dùng từ để hỏi 'Why'."),
    ("Question 10. _______ has your father worked in the factory? – For 3 years.", ["A. How far", "B. What", "C. How long"], "C. How long", ["C. How long", "How long", "how long", "C"], "【Hỏi khoảng thời gian】 'For 3 years' (Được 3 năm) chỉ độ dài thời gian $\\implies$ dùng 'How long'.")
]

for idx, (stem, opts, ans, vars_, expl) in enumerate(u20_sec3):
    q_idx = 10 + idx
    u20[q_idx]['stem'] = stem
    u20[q_idx]['options'] = opts
    u20[q_idx]['correct_answer'] = ans
    u20[q_idx]['acceptable_variants'] = vars_
    u20[q_idx]['explanation'] = expl

# ==========================================
# 8. GLOBAL CLEANUP ACROSS ALL 48 UNITS
# ==========================================
cleaned_count = 0
for u_id, unit in data.items():
    if not str(u_id).isdigit():
        continue
    exam = unit.get('unit_test', [])
    for q in exam:
        ans = q.get('correct_answer', '')
        if isinstance(ans, str):
            orig = ans
            # Clean leftover '____', '...', leading/trailing '-'
            cleaned = ans.replace('_____', '').replace('____', '').replace('___', '').replace('...', '')
            cleaned = cleaned.strip(' -')
            if cleaned != orig:
                q['correct_answer'] = cleaned
                cleaned_count += 1
                if 'acceptable_variants' in q:
                    q['acceptable_variants'] = [v.replace('_____', '').replace('...', '').strip(' -') for v in q['acceptable_variants']]

print(f"Cleaned {cleaned_count} questions with garbage strings in correct_answer.")

# Save back to data/all_units_data.json
with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully saved updated data to {DATA_FILE}")
