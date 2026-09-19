#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QC Script: Tim cau hoi thieu stem hoac stem = instruction trong 48 units
Output: Danh sach cau hoi can fix + tu dong patch neu co the
"""

import json
import re
from pathlib import Path

BASE = Path(__file__).parent.parent
DATA_FILE = BASE / "data" / "all_units_data.json"

def is_empty_stem(stem):
    if not stem:
        return True
    return len(str(stem).strip()) < 4

def is_generic_instruction(stem):
    if not stem:
        return True
    s = str(stem).strip().lower()
    generic_patterns = [
        r'^doc ky', r'^dua vao ngu canh', r'^nghe ky', r'^chon dap an',
        r'^dien vao', r'^chon tu', r'^yeu cau', r'^choose the', r'^select the',
        r'^fill in', r'^listen and', r'^read and',
        r'^đọc kỹ', r'^dựa vào ngữ cảnh', r'^nghe kỹ', r'^chọn đáp án',
        r'^điền vào', r'^chọn từ', r'^yêu cầu',
    ]
    for pat in generic_patterns:
        if re.match(pat, s):
            return True
    return False

def main():
    print("=" * 60)
    print("QC: Tim cau hoi thieu stem (48 units)")
    print("=" * 60)

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    needs_review = []
    auto_fixed = 0

    for unit_id, unit in data.items():
        unit_tests = unit.get('unit_test', [])
        for q in unit_tests:
            stem = q.get('stem', '')
            qtype = q.get('type', '')
            instruction = q.get('instruction', '')

            empty = is_empty_stem(stem)
            generic = is_generic_instruction(stem) and qtype not in ('TEXTAREA', 'AUDIO_CHOICE', 'MATCHING')

            if empty or generic:
                # Try auto-fix: if raw_content has something useful
                raw = q.get('raw_content', [])
                new_stem = None
                if isinstance(raw, list):
                    for item in raw:
                        s = str(item).strip()
                        if len(s) > 8 and not is_generic_instruction(s):
                            new_stem = s
                            break

                if new_stem:
                    q['stem'] = new_stem
                    auto_fixed += 1
                else:
                    needs_review.append({
                        'unit': unit_id,
                        'id': q.get('id', '?'),
                        'type': qtype,
                        'stem': str(stem)[:60],
                        'instruction': str(instruction)[:80],
                        'options': q.get('options', [])[:3],
                    })

    print(f"\n  Auto-fixed: {auto_fixed}")
    print(f"  Needs review: {len(needs_review)}")

    if needs_review:
        print(f"\nCAU CAN REVIEW ({min(len(needs_review), 30)} dau):")
        for i in needs_review[:30]:
            print(f"  Unit {i['unit']} | {i['id']} | {i['type']}")
            print(f"    stem: '{i['stem']}'")
            print(f"    instruction: '{i['instruction'][:60]}'")

    if auto_fixed > 0:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"\nDa luu {auto_fixed} sua vao {DATA_FILE}")

    print("=" * 60)
    return needs_review

if __name__ == '__main__':
    main()
