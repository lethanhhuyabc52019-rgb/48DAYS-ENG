import sys
import os
import fitz
import io
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
visual_units = [2, 3, 4, 7, 13, 16, 20]

print("=== INSPECTING EMBEDDED IMAGES IN VISUAL UNITS ===")

for u in visual_units:
    folder = os.path.join(base_dir, f'NGÀY {u}')
    exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi online' in f.lower() or 'thi online' in f.lower()) and 'đáp án' not in f.lower()][0]
    doc = fitz.open(os.path.join(folder, exam_pdf))
    
    print(f"\n--- UNIT {u:02d}: {exam_pdf} ({len(doc)} pages) ---")
    
    for p_idx, page in enumerate(doc):
        imgs = page.get_images(full=True)
        print(f"Page {p_idx+1}: {len(imgs)} images")
        for img_idx, img in enumerate(imgs):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            ext = base_image["ext"]
            try:
                pil_img = Image.open(io.BytesIO(image_bytes))
                w, h = pil_img.size
                print(f"  Img {img_idx+1}: xref={xref}, size={w}x{h}, ext={ext}")
            except Exception as e:
                print(f"  Img {img_idx+1}: xref={xref}, error={e}")
