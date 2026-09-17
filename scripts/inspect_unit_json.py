import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for u in ['1', '2', '3']:
    u_data = d.get(u, {})
    print(f"=== UNIT {u} ===")
    test_list = u_data.get('unit_test', [])
    print(f"Total questions: {len(test_list)}")
    for i, q in enumerate(test_list[:4]):
        print(f"--- Q{i+1} ---")
        for k, v in q.items():
            print(f"  {k}: {repr(v)[:120]}")
