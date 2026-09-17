import sys
import os
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    app_data = json.load(f)

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

for u in [1, 2, 3]:
    print(f"\n{'='*40} UNIT {u} {'='*40}")
    
    folder = os.path.join(base_dir, f'NGÀY {u}')
    exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi online' in f.lower() or 'thi online' in f.lower()) and 'đáp án' not in f.lower()][0]
    key_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('đáp án' in f.lower() or 'dap an' in f.lower())][0]
    
    print(f"Exam PDF: {exam_pdf}")
    print(f"Key PDF:  {key_pdf}")
    
    doc_exam = fitz.open(os.path.join(folder, exam_pdf))
    print(f"\n--- PDF EXAM TEXT (First 800 chars) ---")
    print("\n".join([p.get_text() for p in doc_exam])[:1000])
    
    doc_key = fitz.open(os.path.join(folder, key_pdf))
    print(f"\n--- PDF KEY & EXPLANATION TEXT (First 800 chars) ---")
    print("\n".join([p.get_text() for p in doc_key])[:1000])
    
    print(f"\n--- APP DATA QUESTIONS (First 5) ---")
    app_u = app_data.get(str(u), {})
    tests = app_u.get('unit_test', [])
    for q in tests[:5]:
        print(f"Q{q.get('id')}: {q.get('question')}")
        print(f"   Options: {q.get('options')}")
        print(f"   Answer: {q.get('answer')} | Exp: {q.get('explanation')[:60]}...")
