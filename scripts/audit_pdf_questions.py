import os
import sys
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
folder_map = {}
for item in os.listdir(base_dir):
    if item.startswith('NG') or item.startswith('ng'):
        parts = item.split()
        if len(parts) >= 2 and parts[1].isdigit():
            u = int(parts[1])
            folder_map[u] = os.path.join(base_dir, item)

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)

print("="*80)
print("AUDITING 48 UNITS: CURRENT DATA VS PDF CONTENT")
print("="*80)

for u in range(1, 49):
    curr_unit = current_data.get(str(u), {})
    curr_tests = curr_unit.get('unit_test', [])
    
    p = folder_map.get(u)
    if not p:
        print(f"Unit {u:02d}: Folder not found")
        continue
        
    files = os.listdir(p)
    exam_pdf = [f for f in files if f.endswith('.pdf') and ('thi online' in f.lower() or 'bai thi' in f.lower() or 'test' in f.lower() or 'luyện thi' in f.lower()) and 'dap an' not in f.lower() and 'đáp án' not in f.lower()]
    
    if not exam_pdf:
        print(f"Unit {u:02d}: No exam PDF found in folder!")
        continue
        
    doc = fitz.open(os.path.join(p, exam_pdf[0]))
    raw_text = "\n".join([page.get_text() for page in doc])
    
    # Count occurrences of 'Question ' in raw text
    q_occurrences = raw_text.count("Question ")
    
    print(f"Unit {u:02d}: Current JSON Qs = {len(curr_tests):2d} | PDF 'Question' count = {q_occurrences:2d} | Exam PDF: {exam_pdf[0]}")
