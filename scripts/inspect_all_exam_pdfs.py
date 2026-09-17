import os
import sys
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base = r'D:\2.English\Tai lieu_ENG\Drive_Download'
folder_map = {}
for item in os.listdir(base):
    if item.startswith('NG') or item.startswith('ng'):
        parts = item.split()
        if len(parts) >= 2 and parts[1].isdigit():
            u = int(parts[1])
            folder_map[u] = os.path.join(base, item)

print(f"Mapped {len(folder_map)} folders from NGÀY 1 to NGÀY 48.")

audit_results = []

for u in range(1, 49):
    p = folder_map.get(u)
    if not p:
        print(f"Unit {u:02d}: MISSING FOLDER!")
        continue
    files = os.listdir(p)
    exam_pdf = [f for f in files if f.endswith('.pdf') and ('thi online' in f.lower() or 'bai thi' in f.lower() or 'test' in f.lower() or 'luyện thi' in f.lower()) and 'dap an' not in f.lower() and 'đáp án' not in f.lower()]
    ans_pdf = [f for f in files if f.endswith('.pdf') and ('dap an' in f.lower() or 'đáp án' in f.lower())]
    theory_pdf = [f for f in files if f.endswith('.pdf') and f not in exam_pdf and f not in ans_pdf]
    
    exam_name = exam_pdf[0] if exam_pdf else "NONE"
    ans_name = ans_pdf[0] if ans_pdf else "NONE"
    
    exam_text_len = 0
    ans_text_len = 0
    ans_has_img = False
    
    if exam_pdf:
        try:
            doc = fitz.open(os.path.join(p, exam_pdf[0]))
            exam_text_len = sum(len(page.get_text()) for page in doc)
        except Exception as e:
            exam_text_len = -1
            
    if ans_pdf:
        try:
            doc = fitz.open(os.path.join(p, ans_pdf[0]))
            ans_text_len = sum(len(page.get_text()) for page in doc)
            ans_has_img = any(len(page.get_images()) > 0 for page in doc)
        except Exception as e:
            ans_text_len = -1

    audit_results.append({
        'unit': u,
        'exam_file': exam_name,
        'ans_file': ans_name,
        'exam_text_len': exam_text_len,
        'ans_text_len': ans_text_len,
        'ans_has_img': ans_has_img
    })
    print(f"Unit {u:02d}: Exam='{exam_name}' (txt:{exam_text_len}) | Ans='{ans_name}' (txt:{ans_text_len}, img:{ans_has_img})")
