import sys
import os
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
visual_units = [2, 3, 4, 7, 13, 16, 20]

print("=== CROPPING VISUAL SNIPPETS FOR ALL VISUAL UNITS ===")

for u in visual_units:
    folder = os.path.join(base_dir, f'NGÀY {u}')
    exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi online' in f.lower() or 'thi online' in f.lower()) and 'đáp án' not in f.lower()][0]
    doc = fitz.open(os.path.join(folder, exam_pdf))
    out_dir = f'assets/exam_images/unit_{u:02d}'
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\nProcessing Unit {u:02d} ({len(doc)} pages) -> {exam_pdf}")
    
    for p_idx, page in enumerate(doc):
        w = page.rect.width
        h = page.rect.height
        
        # Check text blocks on this page
        blocks = page.get_text("blocks")
        question_blocks = [b for b in blocks if any(k in b[4] for k in ['1.', '2.', '3.', '4.', '5.', '6.', 'Question '])]
        
        # Save high quality full page snippet or individual parts
        pix_full = page.get_pixmap(dpi=150)
        pix_full.save(os.path.join(out_dir, f"page_{p_idx+1}.png"))
        print(f"  Page {p_idx+1} saved as page_{p_idx+1}.png")

print("\nCropping completed for all visual units!")
