import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Total Units in data: {len(data)}')

for unit_num in range(1, 49):
    u = data.get(str(unit_num), {})
    pages = u.get('full_theory_pages', [])
    lines = []
    for p in pages:
        lines.extend([l.strip() for l in p.get('text', '').split('\n') if l.strip()])
    
    # Check quizzes
    quiz_blocks = []
    for i, l in enumerate(lines):
        if re.match(r'^(?:Quiz\s*\d*|PRACTICE|BÀI TẬP\s*\d*|Bài tập\s*\d*)', l, re.IGNORECASE):
            quiz_blocks.append((i, l))
            
    if quiz_blocks:
        print(f"\nUnit {unit_num}: {u.get('title')} ({len(quiz_blocks)} quizzes)")
        for idx, (line_idx, title) in enumerate(quiz_blocks):
            # Inspect next 5 lines
            preview = lines[line_idx+1 : min(len(lines), line_idx+7)]
            print(f"  [{idx+1}] Header: \"{title}\"")
            for p_idx, pl in enumerate(preview):
                print(f"      L+{p_idx+1}: {pl}")
