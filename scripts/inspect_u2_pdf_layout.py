import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect Unit 2 PDF page by page
folder = r'D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY 2'
exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc = fitz.open(os.path.join(folder, exam_pdf))

print(f"Unit 2 PDF pages: {len(doc)}")
for i, p in enumerate(doc):
    print(f"\n--- Page {i+1} rect: {p.rect} ---")
    imgs = p.get_images()
    print(f"Images on page: {len(imgs)}")
    for img in imgs:
        print(f"  xref: {img[0]}, w: {img[2]}, h: {img[3]}")
