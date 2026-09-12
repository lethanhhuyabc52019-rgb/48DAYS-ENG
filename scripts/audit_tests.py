import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

def parse_unit_test(u, test_path):
    doc = fitz.open(test_path)
    full_text = ""
    for pno in range(len(doc)):
        full_text += f"\n--- PAGE {pno+1} ---\n" + doc[pno].get_text()
    
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    # Identify parts and questions
    questions = []
    current_part = "Phần bài tập"
    current_instruction = ""
    
    # We look for patterns like:
    # Question 1. ... A. ... B. ...
    # or 1. ... 2. ...
    # or Part 1: ...
    return {
        'page_count': len(doc),
        'text_len': len(full_text),
        'lines_sample': lines[:20]
    }

results = {}
for u in range(1, 49):
    folder = os.path.join(src_dir, f'NGÀY {u}')
    if not os.path.isdir(folder): continue
    t_tests = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi' in f.lower() or 'thi online' in f.lower() or 'bài tập' in f.lower())]
    if t_tests:
        test_path = os.path.join(folder, t_tests[0])
        results[u] = parse_unit_test(u, test_path)

print(f"Audited tests for {len(results)} units.")
for u in [1, 2, 5, 10, 15, 21, 30, 45, 48]:
    if u in results:
        print(f"Unit {u:02d}: {results[u]['page_count']} pages, {results[u]['text_len']} chars")
