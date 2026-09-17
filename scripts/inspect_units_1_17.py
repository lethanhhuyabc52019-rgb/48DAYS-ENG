import os
import sys
import json
import fitz
import re

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
    all_data = json.load(f)

for u in range(1, 18):
    p = folder_map.get(u)
    if not p: continue
    files = os.listdir(p)
    exam_pdf = [f for f in files if f.endswith('.pdf') and ('thi online' in f.lower() or 'bai thi' in f.lower() or 'test' in f.lower()) and 'dap an' not in f.lower() and 'đáp án' not in f.lower()]
    if not exam_pdf: continue
    doc = fitz.open(os.path.join(p, exam_pdf[0]))
    text = "\n".join([page.get_text() for page in doc])
    
    current_q_count = len(all_data.get(str(u), {}).get('unit_test', []))
    print(f"\n==================== UNIT {u:02d} (JSON: {current_q_count} Qs) ====================")
    # print lines that look like sections or instructions
    for line in text.split('\n'):
        line_clean = line.strip()
        if any(kw in line_clean.lower() for kw in ['chọn đáp án', 'bài tập', 'lựa chọn', 'điền từ', 'question 1.', 'question 1 ']) or (len(line_clean) > 10 and line_clean.endswith('.')):
            if not any(ign in line_clean.lower() for ign in ['lấy gốc tiếng anh', 'biên soạn', 'vì quyền lợi', 'tài liệu độc quyền', 'tuyệt đối']):
                print(f"  > {line_clean[:80]}")
