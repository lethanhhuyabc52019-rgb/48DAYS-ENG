import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# Search for the specific mentions
keywords = ["chim", "con chim", "bird", "bánh", "cake", "táo", "apple", "apples", "office", "kitchen", "văn phòng", "nhà bếp", "jeans", "this, that, these", "woman"]

for u, unit_data in data.items():
    s = json.dumps(unit_data, ensure_ascii=False)
    for kw in ["chim", "cake", "bánh", "office", "kitchen", "jeans"]:
        if kw.lower() in s.lower():
            print(f"Found '{kw}' in Unit {u}")

print("\n--- DETAILED SEARCH ---")
for u, unit_data in data.items():
    # check unit_test
    for q in unit_data.get("unit_test", []):
        q_str = json.dumps(q, ensure_ascii=False)
        for kw in ["chim", "bánh", "cake", "office", "kitchen", "jeans"]:
            if kw.lower() in q_str.lower():
                print(f"[Unit {u} unit_test] {q.get('id')}: stem='{q.get('stem')}' | ans='{q.get('correct_answer')}' | img='{q.get('image_url')}' | expl='{q.get('explanation')}'")
    
    # check grammar quizzes / practice / sections
    grammar = unit_data.get("grammar", {})
    g_str = json.dumps(grammar, ensure_ascii=False)
    for kw in ["chim", "bánh", "cake", "office", "kitchen", "jeans", "this, that, these", "woman _____"]:
        if kw.lower() in g_str.lower():
            print(f"[Unit {u} grammar] contains '{kw}'")
