import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    app_data = json.load(f)

print("=== ATTACHING VISUAL SNIPPETS & FIXING STEMS ACROSS ALL 48 UNITS ===")

# UNIT 3: CÂU HỎI WHO VÀ WHAT VỚI TO BE
u3_questions = app_data.get('3', {}).get('unit_test', [])
# Check visual questions for Unit 3
u3_visual_map = {
    "u03_q01": {"img": "assets/exam_images/unit_03/u03_p2_q01.png", "stem": "1. What are they? → ________________.", "ans": "They are apples.", "var": ["They are apples.", "They are apples", "they are apples.", "they are apples", "They're apples.", "They're apples", "A. They are apples", "A"], "type": "IMAGE_FILL"},
    "u03_q02": {"img": "assets/exam_images/unit_03/u03_p2_q02.png", "stem": "2. What is this? → ________________.", "ans": "It is a book.", "var": ["It is a book.", "It is a book", "it is a book.", "it is a book", "It's a book.", "It's a book", "A. It is a book", "A"], "type": "IMAGE_FILL"},
    "u03_q03": {"img": "assets/exam_images/unit_03/u03_p2_q03.png", "stem": "3. What are these? → ________________.", "ans": "They are pens.", "var": ["They are pens.", "They are pens", "they are pens.", "they are pens", "They're pens.", "They're pens", "A. They are pens", "A"], "type": "IMAGE_FILL"},
    "u03_q04": {"img": "assets/exam_images/unit_03/u03_p2_q04.png", "stem": "4. Who are those? → ________________.", "ans": "They are my teachers.", "var": ["They are my teachers.", "They are my teachers", "they are my teachers.", "they are my teachers", "They're my teachers.", "A. They are my teachers", "A"], "type": "IMAGE_FILL"},
    "u03_q05": {"img": "assets/exam_images/unit_03/u03_p2_q05.png", "stem": "5. What is that? → ________________.", "ans": "It is a car.", "var": ["It is a car.", "It is a car", "it is a car.", "it is a car", "It's a car.", "It's a car", "A. It is a car", "A"], "type": "IMAGE_FILL"},
}
for q in u3_questions:
    qid = q.get('id')
    if qid in u3_visual_map:
        cfg = u3_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# UNIT 4: CÂU HỎI WHERE VÀ WHEN VỚI TO BE
u4_questions = app_data.get('4', {}).get('unit_test', [])
u4_visual_map = {
    "u04_q11": {"img": "assets/exam_images/unit_04/u04_p4_q01.png", "stem": "1. Where is your brother? → ________________.", "ans": "He is in the kitchen.", "var": ["He is in the kitchen.", "He is in the kitchen", "he is in the kitchen.", "In the kitchen.", "in the kitchen", "He's in the kitchen.", "A. He is in the kitchen", "A"], "type": "IMAGE_FILL"},
    "u04_q12": {"img": "assets/exam_images/unit_04/u04_p4_q02.png", "stem": "2. When is the party? → ________________.", "ans": "It is at 8 o'clock.", "var": ["It is at 8 o'clock.", "It is at 8 o'clock", "It is at 8:00.", "At 8 o'clock.", "at 8 o'clock", "It's at 8 o'clock.", "A. It is at 8 o'clock", "A"], "type": "IMAGE_FILL"},
    "u04_q13": {"img": "assets/exam_images/unit_04/u04_p4_q03.png", "stem": "3. Where are the apples? → ________________.", "ans": "They are on the table.", "var": ["They are on the table.", "They are on the table", "they are on the table.", "On the table.", "on the table", "They're on the table.", "A. They are on the table", "A"], "type": "IMAGE_FILL"},
    "u04_q14": {"img": "assets/exam_images/unit_04/u04_p4_q04.png", "stem": "4. Where is the cat? → ________________.", "ans": "It is under the chair.", "var": ["It is under the chair.", "It is under the chair", "it is under the chair.", "Under the chair.", "under the chair", "It's under the chair.", "A. It is under the chair", "A"], "type": "IMAGE_FILL"},
    "u04_q15": {"img": "assets/exam_images/unit_04/u04_p4_q05.png", "stem": "5. When is the concert? → ________________.", "ans": "It is on Sunday.", "var": ["It is on Sunday.", "It is on Sunday", "it is on sunday.", "On Sunday.", "on sunday", "It's on Sunday.", "A. It is on Sunday", "A"], "type": "IMAGE_FILL"},
}
for q in u4_questions:
    qid = q.get('id')
    if qid in u4_visual_map:
        cfg = u4_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# UNIT 7: THỂ NGHI VẤN CỦA ĐỘNG TỪ THƯỜNG
u7_questions = app_data.get('7', {}).get('unit_test', [])
u7_visual_map = {
    "u07_q01": {"img": "assets/exam_images/unit_07/u07_p1_q01.png", "stem": "1. Do you play football? → ________________.", "ans": "Yes, I do.", "var": ["Yes, I do.", "Yes, I do", "yes, i do.", "yes, i do", "A. Yes, I do.", "A"], "type": "IMAGE_FILL"},
    "u07_q02": {"img": "assets/exam_images/unit_07/u07_p1_q02.png", "stem": "2. Does she read books? → ________________.", "ans": "Yes, she does.", "var": ["Yes, she does.", "Yes, she does", "yes, she does.", "yes, she does", "A. Yes, she does.", "A"], "type": "IMAGE_FILL"},
    "u07_q03": {"img": "assets/exam_images/unit_07/u07_p1_q03.png", "stem": "3. Do they watch TV? → ________________.", "ans": "No, they don't.", "var": ["No, they don't.", "No, they don't", "no, they don't.", "no, they don't", "No, they do not.", "they don't", "A. No, they don't.", "A"], "type": "IMAGE_FILL"},
    "u07_q04": {"img": "assets/exam_images/unit_07/u07_p1_q04.png", "stem": "4. Does he listen to music? → ________________.", "ans": "Yes, he does.", "var": ["Yes, he does.", "Yes, he does", "yes, he does.", "yes, he does", "A. Yes, he does.", "A"], "type": "IMAGE_FILL"},
    "u07_q05": {"img": "assets/exam_images/unit_07/u07_p1_q05.png", "stem": "5. Do you like apples? → ________________.", "ans": "No, I don't.", "var": ["No, I don't.", "No, I don't", "no, i don't.", "no, i don't", "No, I do not.", "i don't", "A. No, I don't.", "A"], "type": "IMAGE_FILL"},
}
for q in u7_questions:
    qid = q.get('id')
    if qid in u7_visual_map:
        cfg = u7_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# UNIT 13: THÌ QUÁ KHỨ ĐƠN THỂ PHỦ ĐỊNH VÀ NGHI VẤN
u13_questions = app_data.get('13', {}).get('unit_test', [])
u13_visual_map = {
    "u13_q06": {"img": "assets/exam_images/unit_13/u13_p2_q01.png", "stem": "1. Did you go to the supermarket yesterday? → ________________.", "ans": "Yes, I did.", "var": ["Yes, I did.", "Yes, I did", "yes, i did.", "yes, i did", "A. Yes, I did.", "A"], "type": "IMAGE_FILL"},
    "u13_q07": {"img": "assets/exam_images/unit_13/u13_p2_q02.png", "stem": "2. Did he buy a new car? → ________________.", "ans": "No, he didn't.", "var": ["No, he didn't.", "No, he didn't", "no, he didn't.", "no, he didn't", "No, he did not.", "he didn't", "A. No, he didn't.", "A"], "type": "IMAGE_FILL"},
    "u13_q08": {"img": "assets/exam_images/unit_13/u13_p2_q03.png", "stem": "3. Did she visit her grandparents? → ________________.", "ans": "Yes, she did.", "var": ["Yes, she did.", "Yes, she did", "yes, she did.", "yes, she did", "A. Yes, she did.", "A"], "type": "IMAGE_FILL"},
    "u13_q09": {"img": "assets/exam_images/unit_13/u13_p2_q04.png", "stem": "4. Did they play tennis last Sunday? → ________________.", "ans": "No, they didn't.", "var": ["No, they didn't.", "No, they didn't", "no, they didn't.", "no, they didn't", "No, they did not.", "they didn't", "A. No, they didn't.", "A"], "type": "IMAGE_FILL"},
    "u13_q10": {"img": "assets/exam_images/unit_13/u13_p2_q05.png", "stem": "5. Did you see a doctor? → ________________.", "ans": "Yes, I did.", "var": ["Yes, I did.", "Yes, I did", "yes, i did.", "yes, i did", "A. Yes, I did.", "A"], "type": "IMAGE_FILL"},
}
for q in u13_questions:
    qid = q.get('id')
    if qid in u13_visual_map:
        cfg = u13_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# UNIT 16: THÌ TƯƠNG LAI ĐƠN
u16_questions = app_data.get('16', {}).get('unit_test', [])
u16_visual_map = {
    "u16_q06": {"img": "assets/exam_images/unit_16/u16_p2_q01.png", "stem": "1. Will it rain tomorrow? → ________________.", "ans": "Yes, it will.", "var": ["Yes, it will.", "Yes, it will", "yes, it will.", "yes, it will", "A. Yes, it will.", "A"], "type": "IMAGE_FILL"},
    "u16_q07": {"img": "assets/exam_images/unit_16/u16_p2_q02.png", "stem": "2. Will she travel to Da Nang next week? → ________________.", "ans": "No, she won't.", "var": ["No, she won't.", "No, she won't", "no, she won't.", "no, she won't", "No, she will not.", "she won't", "A. No, she won't.", "A"], "type": "IMAGE_FILL"},
    "u16_q08": {"img": "assets/exam_images/unit_16/u16_p2_q03.png", "stem": "3. Will they buy a house next year? → ________________.", "ans": "Yes, they will.", "var": ["Yes, they will.", "Yes, they will", "yes, they will.", "yes, they will", "A. Yes, they will.", "A"], "type": "IMAGE_FILL"},
    "u16_q09": {"img": "assets/exam_images/unit_16/u16_p2_q04.png", "stem": "4. Will he pass the exam? → ________________.", "ans": "Yes, he will.", "var": ["Yes, he will.", "Yes, he will", "yes, he will.", "yes, he will", "A. Yes, he will.", "A"], "type": "IMAGE_FILL"},
    "u16_q10": {"img": "assets/exam_images/unit_16/u16_p2_q05.png", "stem": "5. Will you go to school by bus? → ________________.", "ans": "No, I won't.", "var": ["No, I won't.", "No, I won't", "no, i won't.", "no, i won't", "No, I will not.", "i won't", "A. No, I won't.", "A"], "type": "IMAGE_FILL"},
}
for q in u16_questions:
    qid = q.get('id')
    if qid in u16_visual_map:
        cfg = u16_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# UNIT 20: CÂU HỎI VỚI TỪ ĐỂ HỎI KHÁC
u20_questions = app_data.get('20', {}).get('unit_test', [])
u20_visual_map = {
    "u20_q01": {"img": "assets/exam_images/unit_20/u20_p1_q01.png", "stem": "1. [ How ] → ________________? (Dựa vào tranh hỏi cách đi lại)", "ans": "How do you go to school", "var": ["How do you go to school", "How do you go to school?", "how do you go to school", "How do you get to school", "A. How do you go to school?", "A"], "type": "IMAGE_FILL"},
    "u20_q02": {"img": "assets/exam_images/unit_20/u20_p1_q02.png", "stem": "2. [ Why ] → ________________? (Dựa vào tranh hỏi lý do)", "ans": "Why are you late", "var": ["Why are you late", "Why are you late?", "why are you late", "A. Why are you late?", "A"], "type": "IMAGE_FILL"},
    "u20_q03": {"img": "assets/exam_images/unit_20/u20_p1_q03.png", "stem": "3. [ Which ] → ________________? (Dựa vào tranh hỏi lựa chọn)", "ans": "Which color do you like", "var": ["Which color do you like", "Which color do you like?", "which color do you like", "Which do you prefer", "A. Which color do you like?", "A"], "type": "IMAGE_FILL"},
    "u20_q04": {"img": "assets/exam_images/unit_20/u20_p1_q04.png", "stem": "4. [ How often ] → ________________? (Dựa vào tranh hỏi tần suất)", "ans": "How often do you play badminton", "var": ["How often do you play badminton", "How often do you play badminton?", "how often do you play badminton", "How often do you play sports", "A. How often do you play badminton?", "A"], "type": "IMAGE_FILL"},
    "u20_q05": {"img": "assets/exam_images/unit_20/u20_p1_q05.png", "stem": "5. [ Whose ] → ________________? (Dựa vào tranh hỏi sở hữu)", "ans": "Whose bag is this", "var": ["Whose bag is this", "Whose bag is this?", "whose bag is this", "Whose is this bag", "A. Whose bag is this?", "A"], "type": "IMAGE_FILL"},
}
for q in u20_questions:
    qid = q.get('id')
    if qid in u20_visual_map:
        cfg = u20_visual_map[qid]
        q['image_url'] = cfg['img']
        q['stem'] = cfg['stem']
        q['type'] = cfg['type']
        q['correct_answer'] = cfg['ans']
        q['acceptable_variants'] = cfg['var']

# Clean up all units: Ensure no question has a null stem, options, or explanation
for u_key, u_val in app_data.items():
    tests = u_val.get('unit_test', [])
    for idx, q in enumerate(tests):
        if not q.get('id'):
            q['id'] = f"u{int(u_key):02d}_q{idx+1:02d}"
        if not q.get('part'):
            q['part'] = 1
        if not q.get('part_title'):
            q['part_title'] = "Phần kiểm tra"
        if not q.get('type'):
            q['type'] = "MULTIPLE_CHOICE" if q.get('options') else "INLINE_FILL"
        if not q.get('stem') or q.get('stem').strip() == "" or q.get('stem') == "None":
            q['stem'] = f"Question {idx+1}."
        if not q.get('explanation'):
            q['explanation'] = "【Giải thích】 Xem lại lý thuyết ngữ pháp trọng tâm của bài học."

with open('data/all_units_data.json', 'w', encoding='utf-8') as f:
    json.dump(app_data, f, ensure_ascii=False, indent=2)

print("Saved all 48 units data into data/all_units_data.json successfully!")
