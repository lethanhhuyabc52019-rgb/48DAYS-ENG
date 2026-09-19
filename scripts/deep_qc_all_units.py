# -*- coding: utf-8 -*-
"""
deep_qc_all_units.py
Comprehensive diagnostic script to detect misalignments, swapped images, jumping questions,
broken options, missing keys, and theory-quiz discrepancies across all 48 units.
"""
import json
import os
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"
THEORY_QUIZZES_FILE = ROOT / "data" / "theory_quizzes_data.json"
UNITS_FILE = ROOT / "data" / "units.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    all_data = json.load(f)

with open(THEORY_QUIZZES_FILE, "r", encoding="utf-8") as f:
    theory_quizzes = json.load(f)

print("=" * 70)
print("COMPREHENSIVE AUDIT REPORT - ALL 48 UNITS")
print("=" * 70)

issues = []

# ---------------------------------------------------------
# 1. AUDIT UNIT TESTS IN all_units_data.json
# ---------------------------------------------------------
print("\n[1] AUDITING UNIT TESTS (all_units_data.json)...")
total_test_questions = 0

for u_num in range(1, 49):
    u_str = str(u_num)
    unit = all_data.get(u_str)
    if not unit:
        issues.append(f"Unit {u_num}: Missing completely from all_units_data.json")
        continue
    
    tests = unit.get("unit_test", [])
    total_test_questions += len(tests)
    
    # Check question ordering and IDs
    prev_num = 0
    part_num = 0
    
    for idx, q in enumerate(tests):
        qid = q.get("id", f"idx_{idx}")
        stem = q.get("stem", "")
        q_type = q.get("type", "")
        options = q.get("options") or []
        ans = q.get("correct_answer", "")
        variants = q.get("acceptable_variants", [])
        expl = q.get("explanation", "")
        img = q.get("image_url") or q.get("image")
        
        # 1.1 Check image validity & content match
        if img:
            full_img_path = ROOT / img
            if not full_img_path.exists():
                issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): Image file not found: {img}")
            else:
                # Specific known image mismatches
                # Check Unit 3:
                if u_num == 3:
                    if "hat" in stem.lower() or "hat" in ans.lower() or "they are hats" in ans.lower():
                        if "u03_p2_q01.png" in img: # u03_p2_q01 is cake!
                            issues.append(f"Unit 3 Q[{idx+1}] ({qid}): Stem asks for hats ('{stem}'), but image is cake ('{img}')")
                    if "cake" in stem.lower() or "cake" in ans.lower():
                        if "u03_p2_q02.png" in img: # u03_p2_q02 is hats!
                            issues.append(f"Unit 3 Q[{idx+1}] ({qid}): Stem asks for cake ('{stem}'), but image is hats ('{img}')")
                    if "doctor" in ans.lower() or "who are those" in stem.lower():
                        if "u03_p2_q04.png" in img: # u03_p2_q04 is bag!
                            issues.append(f"Unit 3 Q[{idx+1}] ({qid}): Stem asks for doctors ('{stem}'), but image is bag ('{img}')")
                    if "bag" in ans.lower() or "what is that" in stem.lower():
                        if "u03_p2_q05.png" in img: # u03_p2_q05 is doctors!
                            issues.append(f"Unit 3 Q[{idx+1}] ({qid}): Stem asks for bag ('{stem}'), but image is doctors ('{img}')")
                
                # Check Unit 20: Q1-Q5 are text gap-fills, they should NOT have images!
                if u_num == 20 and idx < 5 and img:
                    issues.append(f"Unit 20 Q[{idx+1}] ({qid}): Text question '{stem[:30]}...' erroneously has image attached ('{img}')")

        # 1.2 Check options & answer for multiple choice
        if q_type == "MULTIPLE_CHOICE" or len(options) > 0:
            if not options:
                issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): MULTIPLE_CHOICE type but options list is empty!")
            else:
                # Check if correct_answer matches any option
                opt_texts = [o.strip() for o in options]
                # If correct_answer is 'A. What', check if 'A. What' or 'What' is in options
                match_found = False
                ans_clean = re.sub(r'^[A-D]\.\s*', '', ans).strip().lower()
                for opt in options:
                    opt_clean = re.sub(r'^[A-D]\.\s*', '', opt).strip().lower()
                    if ans.strip().lower() == opt.strip().lower() or ans_clean == opt_clean:
                        match_found = True
                        break
                if not match_found and ans:
                    issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): Correct answer '{ans}' does not match any option {options}!")

        # 1.3 Check for blank stem or blank answer
        if not stem.strip():
            issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): Question stem is empty!")
        if not ans.strip() and not variants:
            issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): Correct answer and variants are empty!")

        # 1.4 Check question numbering jumps in stems
        # If stem starts with a number like "1.", "2.", "Question 1.", etc.
        m = re.match(r'^(?:Question\s+)?(\d+)[\.:\)]\s*(.*)', stem, re.IGNORECASE)
        if m:
            q_num_stem = int(m.group(1))
            # If numbering resets (e.g. Part 1 has 1-5, Part 2 has 1-5)
            if q_num_stem == 1:
                prev_num = 1
            elif q_num_stem == prev_num + 1:
                prev_num = q_num_stem
            else:
                # Number jumped!
                # Note: only flag if not a known intentional jump
                issues.append(f"Unit {u_num} Q[{idx+1}] ({qid}): Numbering jumped from {prev_num} to {q_num_stem} in stem: '{stem[:40]}'")
                prev_num = q_num_stem

print(f"Total test questions audited: {total_test_questions}")

# ---------------------------------------------------------
# 2. AUDIT THEORY QUIZZES (theory_quizzes_data.json)
# ---------------------------------------------------------
print("\n[2] AUDITING THEORY QUIZZES (theory_quizzes_data.json)...")
print(f"Total theory quiz items: {len(theory_quizzes)}")

for k, item in theory_quizzes.items():
    u = item.get("unit")
    stem = item.get("stem", "")
    qtype = item.get("type", "")
    options = item.get("options", [])
    correct_key = item.get("correct_key", "")
    expl = item.get("explanation", "")
    
    if qtype == "CHOICE":
        if not options:
            issues.append(f"TheoryQuiz {k} (Unit {u}): Type is CHOICE but options list is empty!")
        else:
            # Check if correct_key exists in options
            opt_keys = [o.get("key") for o in options if isinstance(o, dict)]
            if correct_key not in opt_keys:
                issues.append(f"TheoryQuiz {k} (Unit {u}): correct_key '{correct_key}' not in option keys {opt_keys}")
    
    # Check if stem is empty
    if not stem.strip() and not item.get("targetWord"):
        issues.append(f"TheoryQuiz {k} (Unit {u}): Stem and targetWord are both empty!")

# ---------------------------------------------------------
# 3. AUDIT UNITS 2, 3, 4, 7, 13, 16, 20 IMAGE ALIGNMENT
# ---------------------------------------------------------
print("\n[3] DEEP AUDIT OF IMAGE UNITS (2, 3, 4, 7, 13, 16, 20)...")
image_units = [2, 3, 4, 7, 13, 16, 20]
for u_num in image_units:
    unit = all_data.get(str(u_num), {})
    tests = unit.get("unit_test", [])
    img_qs = [q for q in tests if q.get("image_url") or q.get("image")]
    print(f"\n--- UNIT {u_num} ({len(img_qs)} image questions) ---")
    for q in img_qs:
        print(f"  ID: {q.get('id')} | img: {q.get('image_url')} | stem: {q.get('stem')}")
        print(f"     ans: {q.get('correct_answer')}")
        print(f"     expl: {q.get('explanation')[:80]}...")

print("\n" + "=" * 70)
print(f"TOTAL ISSUES FOUND: {len(issues)}")
print("=" * 70)
for i, issue in enumerate(issues, 1):
    print(f"{i}. {issue}")
