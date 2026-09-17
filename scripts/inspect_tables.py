import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for uid in ['1', '2', '3', '4', '5']:
    u = data[uid]
    print(f"\n================ Unit {uid}: {u.get('title')} ================")
    for p_idx, p in enumerate(u.get('full_theory_pages', [])):
        tables = p.get('tables', [])
        if tables:
            print(f"--- Page {p_idx+1}: {len(tables)} tables ---")
            for t_idx, t in enumerate(tables):
                print(f"  Table {t_idx+1}:")
                for r in t.get('rows', []):
                    print("   ", r)
