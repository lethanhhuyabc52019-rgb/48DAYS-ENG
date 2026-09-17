import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Inspect Unit 9
u9 = data['9']
print("Unit 9 current questions count:", len(u9['unit_test']))
for i, q in enumerate(u9['unit_test']):
    print(f"{i+1}. stem='{q.get('stem')}' | ans='{q.get('correct_answer')}' | options={q.get('options')}")
