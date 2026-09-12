import os
import sys
import fitz
import json

sys.stdout.reconfigure(encoding='utf-8')

candidates = [
    r'D:\2.English\Tai lieu\_ENG\Drive\_Download',
    r'D:\2.English\Tai lieu_ENG\Drive_Download'
]
src_dir = next((c for c in candidates if os.path.isdir(c)), None)

with open(r'C:\Users\Admin\.gemini\antigravity-ide\brain\319d43f5-0571-43aa-b298-d633acb3253a\scratch\full_audit.json', encoding='utf-8') as f:
    audit = json.load(f)

for u in [audit[0], audit[1], audit[11], audit[20], audit[47]]:
    print('========================================')
    print(f"Unit {u['unit']}: {u['title']}")
    
    # Check theory
    if u['theory_file']:
        t_path = os.path.join(src_dir, f"NGÀY {u['unit']}", u['theory_file'])
        if os.path.exists(t_path):
            doc = fitz.open(t_path)
            print(f"Theory PDF: {u['theory_file']} ({len(doc)} pages)")
            txt = doc[0].get_text()[:400].replace('\n', ' ')
            print(f"  Page 1 snippet: {txt[:200]}...")
            doc.close()
    
    # Check test
    if u['test_file']:
        test_path = os.path.join(src_dir, f"NGÀY {u['unit']}", u['test_file'])
        if os.path.exists(test_path):
            doc = fitz.open(test_path)
            print(f"Test PDF: {u['test_file']} ({len(doc)} pages)")
            txt = doc[0].get_text()[:400].replace('\n', ' ')
            print(f"  Page 1 snippet: {txt[:200]}...")
            doc.close()

    # Check ans
    if u['ans_file']:
        ans_path = os.path.join(src_dir, f"NGÀY {u['unit']}", u['ans_file'])
        if os.path.exists(ans_path):
            doc = fitz.open(ans_path)
            print(f"Ans PDF: {u['ans_file']} ({len(doc)} pages)")
            txt = doc[0].get_text()
            print(f"  Ans text len: {len(txt)}")
            if len(txt) > 0:
                print(f"  Ans snippet: {txt[:200].replace(chr(10), ' ')}...")
            doc.close()
