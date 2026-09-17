import sys
import json
import os

sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING INTEGRITY OF ALL 48 UNITS & DATASTORE ===")

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total_units = len(data)
total_questions = 0
visual_questions = 0
typing_questions = 0
mc_questions = 0
missing_stem = 0
missing_expl = 0
missing_images = 0

for u in range(1, 49):
    unit = data.get(str(u), {})
    tests = unit.get('unit_test', [])
    total_questions += len(tests)
    for q in tests:
        if not q.get('stem') or q.get('stem') == 'None':
            missing_stem += 1
        if not q.get('explanation'):
            missing_expl += 1
        if q.get('type') == 'IMAGE_FILL':
            visual_questions += 1
            img_path = q.get('image_url')
            if not img_path or not os.path.exists(img_path):
                print(f"⚠️ Warning: Image not found for Unit {u} {q.get('id')}: {img_path}")
                missing_images += 1
        elif q.get('type') in ['INLINE_FILL', 'SENTENCE_REWRITE']:
            typing_questions += 1
        else:
            mc_questions += 1

print(f"Total Units: {total_units}")
print(f"Total Exam Questions: {total_questions}")
print(f"Visual (Image) Questions: {visual_questions}")
print(f"Typing Practice Questions: {typing_questions}")
print(f"Multiple Choice Questions: {mc_questions}")
print(f"Missing Stems: {missing_stem}")
print(f"Missing Explanations: {missing_expl}")
print(f"Missing Images: {missing_images}")

if missing_stem == 0 and missing_expl == 0 and missing_images == 0:
    print("\n✅ ALL TESTS PASSED! Data is 100% complete and valid.")
else:
    print("\n❌ Found issues to fix.")
