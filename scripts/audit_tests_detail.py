import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("="*80)
print("AUDIT ALL 48 UNITS ONLINE EXAM QUESTIONS")
print("="*80)

for u_id in range(1, 49):
    u_str = str(u_id)
    u_data = data.get(u_str, {})
    tests = u_data.get('unit_test', [])
    has_leading_dot = sum(1 for q in tests if q.get('stem', '').startswith('.') or q.get('stem', '').startswith(' .'))
    print(f"Unit {u_id:02d}: {len(tests):2d} questions | Title: {u_data.get('title', '')}")
    if has_leading_dot > 0:
        print(f"   ⚠️ Warning: {has_leading_dot}/{len(tests)} questions have leading dot!")
