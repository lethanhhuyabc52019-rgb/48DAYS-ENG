import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = "d:/2.English/ENG Learning_Antigravity"
DATA_FILE = os.path.join(ROOT, "data/all_units_data.json")

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

for u in ["2", "3", "4"]:
    print(f"\n==================== UNIT {u} IMAGE QUESTIONS ====================")
    unit_data = data[u]
    for q in unit_data.get("unit_test", []):
        if q.get("image_url") or "IMAGE" in q.get("type", ""):
            print(f"ID: {q.get('id')} | stem: {q.get('stem')} | img: {q.get('image_url')}")
            print(f"  options: {q.get('options')}")
            print(f"  ans: {q.get('correct_answer')}")
            print(f"  expl: {q.get('explanation')}")
            print()
