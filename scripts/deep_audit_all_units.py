import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("="*80)
print("DEEP AUDIT ACROSS ALL 48 UNITS ONLINE EXAMS")
print("="*80)

issues = []

for u_id in range(1, 49):
    u_str = str(u_id)
    u_data = data.get(u_str, {})
    tests = u_data.get('unit_test', [])
    
    unit_issues = []
    
    # 1. Check count
    if len(tests) < 10:
        unit_issues.append(f"Low question count: {len(tests)} questions")
        
    # 2. Check stems
    leading_dots = [i+1 for i, q in enumerate(tests) if q.get('stem', '').strip().startswith('.')]
    if leading_dots:
        unit_issues.append(f"Leading dot in stems at questions: {leading_dots}")
        
    # 3. Check correct answers validity
    for i, q in enumerate(tests):
        ans = q.get('correct_answer', '')
        opts = q.get('options', [])
        if not ans:
            unit_issues.append(f"Q{i+1} missing correct_answer")
        elif opts and len(opts) > 0:
            # Check if ans is in opts or matches prefix
            match = any(ans.strip().lower() == o.strip().lower() or o.strip().lower().startswith(ans.strip().lower()) or ans.strip().lower().startswith(o.strip().lower()) for o in opts)
            if not match and q.get('type') != 'WRITTEN' and q.get('type') != 'FILL_BLANK':
                unit_issues.append(f"Q{i+1} correct_answer '{ans}' not in options {opts}")

    # 4. Check all same answer (like Unit 9 where all were 'Tính từ')
    if len(tests) >= 5:
        answers = [q.get('correct_answer') for q in tests if q.get('options')]
        if len(set(answers)) == 1 and len(answers) >= 5:
            unit_issues.append(f"All questions have identical answer: '{answers[0]}'")

    if unit_issues:
        print(f"\n[Unit {u_id:02d}] {u_data.get('title', '')} ({len(tests)} questions):")
        for iss in unit_issues:
            print(f"  - {iss}")
        issues.append((u_id, unit_issues))
    else:
        print(f"[Unit {u_id:02d}] OK ({len(tests)} questions)")

print("\n" + "="*80)
print(f"TOTAL UNITS WITH ISSUES: {len(issues)} / 48")
print("="*80)
