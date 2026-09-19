# -*- coding: utf-8 -*-
import json
import os
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    all_data = json.load(f)

print("=" * 60)
print("1. CHECKING MULTIPLE CHOICE OPTIONS VS CORRECT_ANSWER")
print("=" * 60)
mismatches = []
for u_num in range(1, 49):
    ud = all_data.get(str(u_num), {})
    tests = ud.get('unit_test', [])
    for idx, q in enumerate(tests):
        opts = q.get('options') or []
        ans = (q.get('correct_answer') or '').strip()
        if opts:
            if ans not in opts:
                mismatches.append((u_num, idx+1, q.get('id'), ans, opts))

print(f"Total mismatches: {len(mismatches)}")
for u, qnum, qid, ans, opts in mismatches:
    print(f"Unit {u:02d} Q{qnum:02d} ({qid}): ans='{ans}' | opts={opts}")

print("\n" + "=" * 60)
print("2. CHECKING ALL QUESTIONS WITH NUMBERING IN STEMS VS ACTUAL INDEX")
print("=" * 60)
jump_stems = []
for u_num in range(1, 49):
    ud = all_data.get(str(u_num), {})
    tests = ud.get('unit_test', [])
    for idx, q in enumerate(tests):
        stem = q.get('stem', '').strip()
        # look for leading number
        m = re.match(r'^(?:Question\s+)?(\d+)[\.:\)]\s*(.*)', stem, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            jump_stems.append((u_num, idx+1, q.get('id'), num, stem[:50]))

# Group by unit and check if sequence has gaps
for u_num in range(1, 49):
    items = [x for x in jump_stems if x[0] == u_num]
    if items:
        # Check sub-sequences
        seq = [x[3] for x in items]
        # Check if sequence is reasonable (e.g. 1,2,3,4,5 or 1,2,3...10 or restarting at 1)
        for i in range(len(seq) - 1):
            cur = seq[i]
            nxt = seq[i+1]
            if nxt != cur + 1 and nxt != 1:
                print(f"Unit {u_num:02d}: Jump detected between Q[{items[i][1]}] (stem num {cur}) and Q[{items[i+1][1]}] (stem num {nxt})")
                print(f"   Stem 1: {items[i][4]}")
                print(f"   Stem 2: {items[i+1][4]}")

print("\n" + "=" * 60)
print("3. CHECKING ALL THEORY QUIZZES IN THEORY_QUIZZES_DATA")
print("=" * 60)
with open(ROOT / "data" / "theory_quizzes_data.json", "r", encoding="utf-8") as f:
    tq = json.load(f)

tq_issues = []
for k, v in tq.items():
    opts = v.get("options") or []
    c_key = v.get("correct_key")
    stem = v.get("stem", "")
    target = v.get("targetWord", "")
    u = v.get("unit")
    
    if v.get("type") == "CHOICE":
        opt_keys = [o.get("key") for o in opts if isinstance(o, dict)]
        if c_key not in opt_keys:
            tq_issues.append((k, u, f"correct_key '{c_key}' not in {opt_keys}", stem))
    if not stem.strip() and not target.strip():
        tq_issues.append((k, u, "Empty stem and target", ""))

print(f"Total Theory Quiz issues: {len(tq_issues)}")
for k, u, desc, stem in tq_issues:
    print(f"TQ [{k}] Unit {u}: {desc} | stem='{stem}'")
