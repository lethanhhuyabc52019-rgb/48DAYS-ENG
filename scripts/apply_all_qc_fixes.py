# -*- coding: utf-8 -*-
"""
apply_all_qc_fixes.py
Applies verified corrections to data/all_units_data.json and data/theory_quizzes_data.json
to resolve all jumping questions, image swaps, and option key mismatches.
"""
import json
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
ALL_DATA_PATH = ROOT / "data" / "all_units_data.json"
THEORY_DATA_PATH = ROOT / "data" / "theory_quizzes_data.json"

with open(ALL_DATA_PATH, "r", encoding="utf-8") as f:
    all_data = json.load(f)

with open(THEORY_DATA_PATH, "r", encoding="utf-8") as f:
    theory_data = json.load(f)

print("Applying QC Fixes to all_units_data.json...")

# 1. UNIT 3: Fix swapped images in Part 1
u3_tests = all_data['3']['unit_test']
for q in u3_tests:
    qid = q.get('id')
    if qid == 'u03_q01': # What are they? -> Hats
        q['image_url'] = "assets/exam_images/unit_03/u03_q01.png"
        print("  ✓ Unit 3 Q1 (Hats): image_url -> u03_q01.png")
    elif qid == 'u03_q02': # What is this? -> Cake
        q['image_url'] = "assets/exam_images/unit_03/u03_q02.png"
        print("  ✓ Unit 3 Q2 (Cake): image_url -> u03_q02.png")
    elif qid == 'u03_q03': # What are these? -> Pillows
        q['image_url'] = "assets/exam_images/unit_03/u03_q03.png"
        print("  ✓ Unit 3 Q3 (Pillows): image_url -> u03_q03.png")
    elif qid == 'u03_q04': # Who are those? -> Doctors
        q['image_url'] = "assets/exam_images/unit_03/u03_q04.png"
        print("  ✓ Unit 3 Q4 (Doctors): image_url -> u03_q04.png")
    elif qid == 'u03_q05': # What is that? -> Bag
        q['image_url'] = "assets/exam_images/unit_03/u03_q05.png"
        print("  ✓ Unit 3 Q5 (Bag): image_url -> u03_q05.png")

# 2. UNIT 2: Fix Q10 explanation and Q13-Q20 correct_answer matching options
u2_tests = all_data['2']['unit_test']
for q in u2_tests:
    qid = str(q.get('id'))
    if qid == '10':
        q['explanation'] = "【Giải thích】 Bức tranh hiển thị các bạn học sinh/sinh viên (không phải em bé). Với câu hỏi 'Are they babies?', câu trả lời ngắn phủ định là: 'No, they aren't.'."
        print("  ✓ Unit 2 Q10: Corrected explanation to refer to students/young adults")
    elif qid == '13':
        q['correct_answer'] = "A. are"
        q['acceptable_variants'] = ["A. are", "are", "A"]
    elif qid == '14':
        q['correct_answer'] = "C. it isn’t"
        q['acceptable_variants'] = ["C. it isn’t", "it isn't", "it isn’t", "C"]
    elif qid == '15':
        q['correct_answer'] = "C. are"
        q['acceptable_variants'] = ["C. are", "are", "C"]
    elif qid == '16':
        q['correct_answer'] = "B. Is"
        q['acceptable_variants'] = ["B. Is", "Is", "is", "B"]
    elif qid == '17':
        q['correct_answer'] = "C. friends"
        q['acceptable_variants'] = ["C. friends", "friends", "C"]
    elif qid == '18':
        q['correct_answer'] = "B. Are"
        q['acceptable_variants'] = ["B. Are", "Are", "are", "B"]
    elif qid == '19':
        q['correct_answer'] = "A. he is"
        q['acceptable_variants'] = ["A. he is", "he is", "A"]
    elif qid == '20':
        q['correct_answer'] = "A. books"
        q['acceptable_variants'] = ["A. books", "books", "A"]
print("  ✓ Unit 2 Q13-Q20: Standardized correct_answer to full option string with variants")

# 3. UNIT 7: Fix Q06 correct_answer and Q16-Q20 options
u7_tests = all_data['7']['unit_test']
for q in u7_tests:
    qid = q.get('id')
    if qid == 'u07_q06':
        q['correct_answer'] = "B. play"
        q['acceptable_variants'] = ["B. play", "play", "B"]
        print("  ✓ Unit 7 Q6: Standardized correct_answer to 'B. play'")
    elif qid in ['u07_q16', 'u07_q17', 'u07_q18', 'u07_q19', 'u07_q20']:
        q['options'] = []
        q['type'] = "typing"
        print(f"  ✓ Unit 7 {qid}: Cleared spoiled single-option, set type to typing")

# 4. UNIT 13: Standardize Q01-Q05 correct_answer with option letter prefix
u13_tests = all_data['13']['unit_test']
u13_map = {
    'u13_q01': ("A. didn't pay", ["A. didn't pay", "didn't pay", "didn’t pay", "did not pay", "A"]),
    'u13_q02': ("A. Did – win", ["A. Did – win", "Did – win", "did - win", "A"]),
    'u13_q03': ("A. weren't", ["A. weren't", "weren't", "weren’t", "were not", "A"]),
    'u13_q04': ("A. didn’t come", ["A. didn’t come", "didn't come", "didn’t come", "did not come", "A"]),
    'u13_q05': ("A. Did – rain", ["A. Did – rain", "Did – rain", "did - rain", "A"])
}
for q in u13_tests:
    qid = q.get('id')
    if qid in u13_map:
        ans, vars_list = u13_map[qid]
        q['correct_answer'] = ans
        q['acceptable_variants'] = vars_list
print("  ✓ Unit 13 Q01-Q05: Standardized correct_answer")

# 5. UNIT 16: Standardize Q01-Q05 correct_answer with option letter prefix
u16_tests = all_data['16']['unit_test']
u16_map = {
    'u16_q01': ("A. will return", ["A. will return", "will return", "A"]),
    'u16_q02': ("A. will be", ["A. will be", "will be", "A"]),
    'u16_q03': ("A. Will – tell", ["A. Will – tell", "Will – tell", "will - tell", "A"]),
    'u16_q04': ("A. will lend", ["A. will lend", "will lend", "A"]),
    'u16_q05': ("A. won't sell", ["A. won't sell", "won't sell", "won’t sell", "will not sell", "A"])
}
for q in u16_tests:
    qid = q.get('id')
    if qid in u16_map:
        ans, vars_list = u16_map[qid]
        q['correct_answer'] = ans
        q['acceptable_variants'] = vars_list
print("  ✓ Unit 16 Q01-Q05: Standardized correct_answer")

# 6. UNIT 20: Remove erroneously attached images from Q01-Q05
u20_tests = all_data['20']['unit_test']
for idx in range(5):
    q = u20_tests[idx]
    q['image_url'] = None
    q['image'] = None
print("  ✓ Unit 20 Q01-Q05: Removed misplaced images from text gap-fill questions")

# 7. UNIT 45: Standardize Q18
u45_tests = all_data['45']['unit_test']
for q in u45_tests:
    if q.get('id') == 'u45_q18':
        q['correct_answer'] = "A. It’s very kind of you to say so."
        q['acceptable_variants'] = ["A. It’s very kind of you to say so.", "A", "a", "It’s very kind of you to say so.", "it’s very kind of you to say so."]
print("  ✓ Unit 45 Q18: Standardized correct_answer")

# Save updated all_units_data.json
with open(ALL_DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)
print("✓ Successfully saved updated data/all_units_data.json")

# 8. THEORY QUIZZES: Fix empty stems in Unit 37
tq_stems = {
    'tq_37_6_0': "Nghe đoạn audio 6 và chọn từ mô tả thời tiết chính xác (Câu 1):",
    'tq_37_6_1': "Nghe đoạn audio 6 và chọn từ mô tả thời tiết chính xác (Câu 2):",
    'tq_37_6_2': "Nghe đoạn audio 6 và chọn từ mô tả thời tiết chính xác (Câu 3):",
    'tq_37_6_3': "Nghe đoạn audio 6 và chọn từ mô tả thời tiết chính xác (Câu 4):"
}
for k, prompt in tq_stems.items():
    if k in theory_data:
        theory_data[k]['stem'] = prompt
        print(f"  ✓ TheoryQuiz {k}: Added stem prompt: '{prompt}'")

with open(THEORY_DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(theory_data, f, ensure_ascii=False, indent=2)
print("✓ Successfully saved updated data/theory_quizzes_data.json")
