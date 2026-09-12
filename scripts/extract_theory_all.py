import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

def clean_text(t):
    return re.sub(r'[ \t]+', ' ', t).strip()

units_data = {}

for u in range(1, 49):
    folder = os.path.join(src_dir, f'NGÀY {u}')
    if not os.path.isdir(folder):
        continue
    
    # Identify theory file
    theory_files = [f for f in os.listdir(folder) if f.endswith('.pdf') and 'thi' not in f.lower() and 'đáp án' not in f.lower() and 'bài tập' not in f.lower()]
    if not theory_files:
        continue
    t_file = theory_files[0]
    t_path = os.path.join(folder, t_file)
    
    doc = fitz.open(t_path)
    unit_vocab = []
    unit_grammar = []
    
    full_pages = []
    for pno in range(len(doc)):
        full_pages.append({
            'page_num': pno + 1,
            'text': doc[pno].get_text()
        })
    
    units_data[u] = {
        'unit_id': u,
        'theory_file': t_file,
        'page_count': len(doc),
        'pages': full_pages
    }
    doc.close()

print(f"Extracted raw text from {len(units_data)} Theory PDFs.")

# Analyze vocabulary and grammar patterns
total_vocab_est = 0
for u, data in units_data.items():
    all_text = "\n".join([p['text'] for p in data['pages']])
    # Check for vocabulary lines like: word /ipa/ (pos) meaning or word (pos): meaning
    lines = all_text.split('\n')
    vocab_lines = [l.strip() for l in lines if '/' in l and ('/' in l[l.find('/')+1:]) or ('(' in l and ')' in l and len(l.split()) <= 8)]
    total_vocab_est += len(vocab_lines)

print(f"Rough vocabulary candidates: ~{total_vocab_est}")
