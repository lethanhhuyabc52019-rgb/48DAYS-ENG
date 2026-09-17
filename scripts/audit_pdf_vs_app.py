import sys
import os
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

print("--- 1. SEARCHING 'ly-thuyet-bai-tap-48-ngay-lay-goc.pdf' ---")
pdf_book = 'ly-thuyet-bai-tap-48-ngay-lay-goc.pdf'
doc = fitz.open(pdf_book)
print(f"Total pages in book: {len(doc)}")

for i, page in enumerate(doc):
    t = page.get_text()
    if "Dựa vào các hình ảnh" in t or "Are they babies" in t or "điền danh từ số ít hoặc số nhiều" in t:
        print(f"\n[Book Page {i+1}]")
        print(t[:500])

print("\n--- 2. SEARCHING IN Drive_Download INDIVIDUAL FILES ---")
base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
for u in range(1, 10):
    folder = os.path.join(base_dir, f'NGÀY {u}')
    if not os.path.exists(folder):
        continue
    for f in os.listdir(folder):
        if f.endswith('.pdf'):
            fp = os.path.join(folder, f)
            try:
                d = fitz.open(fp)
                text = "\n".join([p.get_text() for p in d])
                if "Dựa vào các hình ảnh" in text or "Are they babies" in text:
                    print(f"Unit {u} | File: {f} | Match found!")
            except Exception as e:
                pass
