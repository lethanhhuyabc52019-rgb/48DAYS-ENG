import sys
import json
import os

sys.stdout.reconfigure(encoding='utf-8')

print("=== VERIFYING AND CLEANING QUESTION IMAGE ATTACHMENTS ACROSS ALL 48 UNITS ===")

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# List of true visual question units
visual_units = ['2', '3', '4', '7', '13', '16', '20']

cleaned_count = 0
valid_img_count = 0

for u_key, u_val in data.items():
    tests = u_val.get('unit_test', [])
    for q in tests:
        img = q.get('image_url')
        if img:
            if u_key not in visual_units or not os.path.exists(img):
                # Remove invalid image reference
                del q['image_url']
                cleaned_count += 1
            else:
                valid_img_count += 1

print(f"Total valid question illustration images: {valid_img_count}")
print(f"Total invalid / non-question image references cleaned: {cleaned_count}")

with open('data/all_units_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved cleaned all_units_data.json successfully!")
