import os
import sys
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for u_id in range(1, 49):
    u_str = str(u_id)
    u_data = data.get(u_str, {})
    tests = u_data.get('unit_test', [])
    
    # Check parts
    parts = {}
    for q in tests:
        p = q.get('part', 1)
        pt = q.get('part_title', 'Phần ' + str(p))
        if p not in parts:
            parts[p] = {'title': pt, 'count': 0}
        parts[p]['count'] += 1
        
    parts_desc = ", ".join([f"Part {k} ('{v['title'][:25]}...'): {v['count']}qs" for k, v in parts.items()])
    print(f"Unit {u_id:02d}: Total {len(tests):2d} Qs -> {parts_desc}")
