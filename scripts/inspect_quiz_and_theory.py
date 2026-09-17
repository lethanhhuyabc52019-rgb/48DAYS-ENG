import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for uid in ['1', '2', '3', '4', '5']:
    u = data[uid]
    pages = u.get('full_theory_pages', [])
    print(f"\n=================== UNIT {uid}: {u.get('title')} ===================")
    all_lines = []
    for p in pages:
        for l in p.get('text', '').split('\n'):
            if l.strip():
                all_lines.append(l.strip())
    
    for idx, l in enumerate(all_lines):
        if any(k in l.lower() for k in ['quiz', 'practice', 'bài tập']):
            print(f"\n[Line {idx}] >>> {l}")
            for next_l in all_lines[idx+1:idx+15]:
                print(f"     | {next_l}")
