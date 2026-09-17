import sys
import os
import fitz
import io
import json
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
assets_base = r'assets\exam_images'

print("="*90)
print("RÀ SOÁT VÀ XỬ LÝ TOÀN DIỆN TỪNG UNIT TRONG TOÀN BỘ 48 UNITS")
print("="*90)

# 1. Scan all 48 units and list all embedded images with their dimensions and xrefs
for u in range(1, 49):
    folder = os.path.join(base_dir, f'NGÀY {u}')
    if not os.path.exists(folder):
        continue
        
    exam_pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi' in f.lower() or 'thi online' in f.lower() or 'luyện thi' in f.lower() or 'test' in f.lower()) and 'đáp án' not in f.lower() and 'dap an' not in f.lower()]
    if not exam_pdfs:
        continue
    
    exam_pdf = exam_pdfs[0]
    doc = fitz.open(os.path.join(folder, exam_pdf))
    
    u_out = os.path.join(assets_base, f'unit_{u:02d}')
    os.makedirs(u_out, exist_ok=True)
    
    # Check all images on all pages
    extracted_imgs = []
    for p_idx, page in enumerate(doc):
        page_imgs = page.get_images(full=True)
        for img_info in page_imgs:
            xref = img_info[0]
            base_img = doc.extract_image(xref)
            img_bytes = base_img["image"]
            ext = base_img["ext"]
            try:
                pil = Image.open(io.BytesIO(img_bytes))
                w, h = pil.size
                # Filter out watermark logo (500x500 Ngoaingu24h logo or tiny decors < 60px)
                if (w == 500 and h == 500) or (w < 60 or h < 60):
                    continue
                extracted_imgs.append((p_idx + 1, xref, w, h, ext, pil))
            except Exception as e:
                pass
                
    if extracted_imgs:
        print(f"\n[Unit {u:02d}] {exam_pdf} -> {len(extracted_imgs)} ảnh minh họa bài tập thực tế:")
        for idx, (pg, xref, w, h, ext, pil) in enumerate(extracted_imgs):
            filename = f"pure_q_img_{idx+1:02d}.png"
            filepath = os.path.join(u_out, filename)
            pil.convert("RGB").save(filepath)
            print(f"   Trang {pg} | xref={xref} | {w}x{h}px -> {filename}")
    else:
        print(f"[Unit {u:02d}] Không chứa hình ảnh minh họa bài tập (Chỉ có câu hỏi chữ / trắc nghiệm / audio).")

