import sys
import os
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

print("="*100)
print("CHI TIẾT TOÀN BỘ 48 UNITS: KHẢO SÁT CẤU TRÚC ĐỀ THI GỐC & CÁC DẠNG BÀI TẬP")
print("="*100)

full_audit = {}

for u in range(1, 49):
    folder = os.path.join(base_dir, f'NGÀY {u}')
    if not os.path.exists(folder):
        print(f"Unit {u:02d}: Folder not found")
        continue
        
    exam_pdf_name = None
    key_pdf_name = None
    theory_pdf_name = None
    for f in os.listdir(folder):
        fl = f.lower()
        if f.endswith('.pdf'):
            if 'đáp án' in fl or 'dap an' in fl:
                key_pdf_name = f
            elif 'bài thi online' in fl or 'thi online' in fl or 'luyện thi' in fl or 'test' in fl:
                exam_pdf_name = f
            else:
                theory_pdf_name = f
                
    unit_info = {
        'unit': u,
        'exam_pdf': exam_pdf_name,
        'key_pdf': key_pdf_name,
        'parts': [],
        'has_images': False,
        'image_count': 0
    }
    
    if exam_pdf_name:
        doc = fitz.open(os.path.join(folder, exam_pdf_name))
        img_total = 0
        for p in doc:
            img_total += len(p.get_images())
        unit_info['has_images'] = img_total > 0
        unit_info['image_count'] = img_total
        
        full_text = "\n".join([p.get_text() for p in doc])
        lines = [l.strip() for l in full_text.splitlines() if l.strip()]
        
        # Extract instructions / sections
        instructions = []
        for l in lines:
            if any(l.startswith(k) for k in [
                'Nối', 'Điền', 'Viết lại', 'Dựa vào', 'Chọn đáp án', 'Khoanh tròn', 
                'Chia dạng', 'Sắp xếp', 'Hoàn thành', 'Gạch chân', 'Tìm lỗi', 
                'Nghe', 'Listen', 'Read', 'Đọc'
            ]):
                if len(l) > 10 and l not in instructions:
                    instructions.append(l)
                    
        unit_info['parts'] = instructions
        
    full_audit[u] = unit_info

# Print summary
for u in range(1, 49):
    info = full_audit.get(u, {})
    img_tag = f"📸 {info.get('image_count')} ảnh" if info.get('has_images') else "📄 Không ảnh"
    print(f"\n[UNIT {u:02d}] - {img_tag} | PDF: {info.get('exam_pdf')}")
    for idx, p in enumerate(info.get('parts', [])):
        print(f"   Part {idx+1}: {p}")

