import sys
import os
import fitz # PyMuPDF
import io
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
assets_base = r'assets\exam_images'
os.makedirs(assets_base, exist_ok=True)

print("="*80)
print("TRÍCH XUẤT TOÀN BỘ HÌNH ẢNH ĐỀ THI TỪ FILE PDF 48 UNITS")
print("="*80)

extracted_stats = {}

for u in range(1, 49):
    folder = os.path.join(base_dir, f'NGÀY {u}')
    if not os.path.exists(folder):
        continue
        
    exam_pdf = None
    for f in os.listdir(folder):
        fl = f.lower()
        if f.endswith('.pdf') and ('bài thi online' in fl or 'thi online' in fl or 'luyện thi' in fl or 'test' in fl) and 'đáp án' not in fl and 'dap an' not in fl:
            exam_pdf = f
            break
            
    if not exam_pdf:
        continue
        
    unit_assets_dir = os.path.join(assets_base, f'unit_{u:02d}')
    os.makedirs(unit_assets_dir, exist_ok=True)
    
    pdf_path = os.path.join(folder, exam_pdf)
    doc = fitz.open(pdf_path)
    
    unit_img_count = 0
    saved_images = []
    
    for page_idx, page in enumerate(doc):
        # Extract images list from page
        image_list = page.get_images(full=True)
        for img_idx, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Filter out tiny watermark / decor icons (e.g. smaller than 50x50)
            try:
                pil_img = Image.open(io.BytesIO(image_bytes))
                w, h = pil_img.size
                if w < 50 or h < 50:
                    continue
                    
                # Filter out header logos / watermarks if recognizable
                # Save valid question illustrations
                unit_img_count += 1
                img_filename = f"q_img_p{page_idx+1}_{unit_img_count:02d}.{image_ext}"
                out_path = os.path.join(unit_assets_dir, img_filename)
                
                with open(out_path, "wb") as f_out:
                    f_out.write(image_bytes)
                    
                saved_images.append({
                    "page": page_idx + 1,
                    "filename": img_filename,
                    "rel_path": f"assets/exam_images/unit_{u:02d}/{img_filename}",
                    "width": w,
                    "height": h
                })
            except Exception as e:
                pass
                
    extracted_stats[u] = {
        "pdf": exam_pdf,
        "count": unit_img_count,
        "images": saved_images
    }
    if unit_img_count > 0:
        print(f"Unit {u:02d}: Đã trích xuất thành công {unit_img_count} hình ảnh từ '{exam_pdf}'")

print(f"\nTổng kết: Đã kiểm tra và trích xuất ảnh hoàn tất cho 48 Units.")
