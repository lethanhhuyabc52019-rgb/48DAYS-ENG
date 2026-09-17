import json
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

print("=== ALL IMAGE QUESTIONS IN ALL 48 UNITS ===")
img_questions = []

for u in range(1, 49):
    u_str = str(u)
    unit_data = data.get(u_str, {})
    
    # Check unit_test
    for q in unit_data.get("unit_test", []):
        img = q.get("image_url") or q.get("image")
        q_type = q.get("type", "")
        if img or "IMAGE" in q_type or "visual" in q_type.lower():
            img_questions.append((u, "unit_test", q))
            
    # Check grammar
    grammar = unit_data.get("grammar", {})
    for quiz in grammar.get("quizzes", []):
        for q in quiz.get("questions", []):
            img = q.get("image_url") or q.get("image")
            if img:
                img_questions.append((u, "grammar_quiz", q))

print(f"Total image questions found: {len(img_questions)}")
for u, sec, q in img_questions:
    img_path = q.get("image_url") or q.get("image")
    exists = os.path.exists(os.path.join(ROOT, img_path)) if img_path else False
    print(f"\nUnit {u} [{sec}] {q.get('id')}:")
    print(f"  img: {img_path} (exists: {exists})")
    print(f"  stem: {q.get('stem')}")
    print(f"  options: {q.get('options')}")
    print(f"  correct_answer: {q.get('correct_answer')}")
    print(f"  explanation: {q.get('explanation')}")
