"""
verify_all_quizzes_comprehensive.py
====================================
Comprehensive verification script for both Quiz Systems across all 48 Units:
1. In-Theory / Interactive Quizzes (995 items)
2. Unit Test Examination Questions (879 items)
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
JS_DIR = os.path.join(ROOT, "js")

print("=" * 70)
print("COMPREHENSIVE AUDIT REPORT: 48 UNITS QUIZ ACCURACY & EXPLANATIONS")
print("=" * 70)

# -------------------------------------------------------------------------
# SYSTEM 1: IN-THEORY INTERACTIVE QUIZZES (995 ITEMS)
# -------------------------------------------------------------------------
theory_file = os.path.join(DATA_DIR, "theory_quizzes_data.json")
with open(theory_file, "r", encoding="utf-8") as f:
    theory_db = json.load(f)

print(f"\n[SYSTEM 1: IN-THEORY INTERACTIVE QUIZZES] Total Items: {len(theory_db)}")

theory_errors = []
theory_choice_keys = {}
theory_types = {}
dummy_theory_count = 0

for q_id, q in theory_db.items():
    q_type = q.get('type', 'UNKNOWN')
    theory_types[q_type] = theory_types.get(q_type, 0) + 1
    
    expl = q.get('explanation', '')
    if 'Dựa vào cấu trúc ngữ pháp và ngữ cảnh bài học, đáp án chính xác là' in expl:
        dummy_theory_count += 1
        theory_errors.append(f"Dummy explanation found in {q_id}")
        
    if not expl or len(expl.strip()) < 10:
        theory_errors.append(f"Missing or very short explanation in {q_id}")
        
    if q_type == 'CHOICE':
        k = q.get('correct_key', '')
        theory_choice_keys[k] = theory_choice_keys.get(k, 0) + 1
        opts = q.get('options', [])
        opt_keys = [o['key'] for o in opts]
        if k not in opt_keys:
            theory_errors.append(f"Correct key {k} not in options {opt_keys} for {q_id}")
    elif q_type == 'INPUT':
        ans = q.get('correct_text', '')
        if not ans:
            theory_errors.append(f"Empty correct_text for INPUT item {q_id}")

print(f"- Item types: {theory_types}")
print(f"- CHOICE Key distribution: {theory_choice_keys}")
print(f"- Dummy explanations: {dummy_theory_count}")
print(f"- Errors found: {len(theory_errors)}")
if theory_errors:
    for err in theory_errors[:5]:
        print(f"  * {err}")

# Check user target questions
print("\n[VERIFY USER TARGET QUESTIONS IN THEORY]")
targets = [
    ('Unit 7 Q1', 'tq_7_1_0', 'B', 'Does'),
    ('Unit 7 Q10', 'tq_7_2_9', 'B', 'Do'),
    ('Unit 8 Q10 (tidies)', 'tq_8_2_9', 'B', 'tidies'),
    ('Unit 8 Q1 (get)', 'tq_8_1_0', 'B', 'get'),
    ('Unit 8 Q11 (run)', 'tq_8_2_10', 'B', 'run'),
    ('Unit 9 Q1 (beautifully)', 'tq_9_1_0', 'B', 'beautifully'),
    ('Unit 9 Q2 (teacher)', 'tq_9_1_1', 'A', 'teacher'),
    ('Unit 4 Q15 (at)', 'tq_4_2_14', 'B', 'at'),
    ('Unit 35 Q1 (himself)', 'tq_35_1_0', 'A', 'himself'),
    ('Unit 35 Q2 (herself)', 'tq_35_1_1', 'B', 'herself')
]
for label, q_key, exp_k, exp_txt in targets:
    it = theory_db.get(q_key, {})
    actual_k = it.get('correct_key')
    actual_txt = it.get('correct_text')
    status = "PASS" if actual_k == exp_k and exp_txt.lower() in (actual_txt or '').lower() else "FAIL"
    print(f"  [{status}] {label} ({q_key}): Expected {exp_k}. {exp_txt} -> Got {actual_k}. {actual_txt}")
    assert status == "PASS", f"Verification failed for {label}"

# Check formatting hygiene
raw_stem_count = sum(1 for q in theory_db.values() if '{stem}' in q.get('explanation', ''))
latex_count = sum(1 for q in theory_db.values() if r'$\implies$' in q.get('explanation', ''))
raw_star_count = sum(1 for q in theory_db.values() if '**' in q.get('explanation', ''))

print(f"\n[FORMATTING HYGIENE AUDIT]")
print(f"- Items with {{stem}} placeholder: {raw_stem_count} (Goal: 0)")
print(f"- Items with LaTeX $\\implies$: {latex_count} (Goal: 0)")
print(f"- Items with raw ** markdown: {raw_star_count} (Goal: 0)")
assert raw_stem_count == 0, f"Found {raw_stem_count} items with {{stem}}!"
assert latex_count == 0, f"Found {latex_count} items with LaTeX!"
assert raw_star_count == 0, f"Found {raw_star_count} items with raw **!"

# -------------------------------------------------------------------------
# SYSTEM 2: TEST UNIT EXAMINATION (879 QUESTIONS)
# -------------------------------------------------------------------------
all_data_file = os.path.join(DATA_DIR, "all_units_data.json")
with open(all_data_file, "r", encoding="utf-8") as f:
    all_data = json.load(f)

test_q_count = 0
test_missing_expl = 0
test_dummy_expl = 0
test_key_dist = {}
test_errors = []

for uid, u_info in all_data.items():
    tests = u_info.get('unit_test', [])
    test_q_count += len(tests)
    for q in tests:
        q_id = q.get('id', 'unknown')
        ans = q.get('correct_answer', '')
        expl = q.get('explanation', '')
        
        if not ans:
            test_errors.append(f"Missing correct_answer in Unit {uid} ({q_id})")
        else:
            first = ans.split('.')[0].strip()
            test_key_dist[first] = test_key_dist.get(first, 0) + 1
            
        if not expl or len(expl.strip()) < 5:
            test_missing_expl += 1
            test_errors.append(f"Missing explanation in Unit {uid} ({q_id})")
        elif 'Dựa vào cấu trúc ngữ pháp và ngữ cảnh bài học, đáp án chính xác là' in expl:
            test_dummy_expl += 1
            test_errors.append(f"Dummy explanation in Unit {uid} ({q_id})")

print(f"\n[SYSTEM 2: TEST UNIT EXAMS] Total Test Questions across 48 Units: {test_q_count}")
print(f"- Missing explanations: {test_missing_expl}")
print(f"- Dummy explanations: {test_dummy_expl}")
print(f"- Errors found: {len(test_errors)}")

# -------------------------------------------------------------------------
# SYSTEM 3: EMBEDDED BUNDLE INTEGRITY
# -------------------------------------------------------------------------
print(f"\n[SYSTEM 3: EMBEDDED BUNDLE INTEGRITY]")
embedded_file = os.path.join(JS_DIR, "embedded_data.js")
bundle_size_kb = os.path.getsize(embedded_file) / 1024
print(f"- embedded_data.js size: {bundle_size_kb:.1f} KB")
has_all_data = False
has_theory = False
has_units = False

with open(embedded_file, "r", encoding="utf-8") as f:
    text = f.read()
    has_units = "window.SMOB_UNITS" in text
    has_all_data = "window.SMOB_ALL_DATA" in text
    has_theory = "window.SMOB_THEORY_QUIZZES" in text

print(f"- window.SMOB_UNITS: {'YES' if has_units else 'NO'}")
print(f"- window.SMOB_ALL_DATA: {'YES' if has_all_data else 'NO'}")
print(f"- window.SMOB_THEORY_QUIZZES: {'YES' if has_theory else 'NO'}")

print("\n" + "=" * 70)
if len(theory_errors) == 0 and len(test_errors) == 0 and has_theory:
    print("ALL 48 UNITS VERIFICATION RESULT: 100% PERFECT & READY FOR PACKAGING")
else:
    print(f"VERIFICATION WARNINGS: Theory errors: {len(theory_errors)}, Test errors: {len(test_errors)}")
print("=" * 70)
