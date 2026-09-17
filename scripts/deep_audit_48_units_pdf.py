import sys
import os
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    app_data = json.load(f)

print("="*90)
print("TOÀN BỘ RÀ SOÁT 48 UNITS: SO SÁNH APP DATA VS BÀI THI ONLINE PDF & ĐÁP ÁN")
print("="*90)

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

unit_summary = []

for u in range(1, 49):
    app_u = app_data.get(str(u), {})
    app_tests = app_u.get('unit_test', []) or app_u.get('tests', [])
    app_exam = app_u.get('online_exam', {})
    
    # Check folder
    folder = os.path.join(base_dir, f'NGÀY {u}')
    exam_pdf = None
    key_pdf = None
    theory_pdf = None
    
    if os.path.exists(folder):
        for f in os.listdir(folder):
            fl = f.lower()
            if f.endswith('.pdf'):
                if 'đáp án' in fl or 'dap an' in fl:
                    key_pdf = f
                elif 'bài thi online' in fl or 'thi online' in fl or 'luyện thi' in fl or 'test' in fl:
                    exam_pdf = f
                else:
                    theory_pdf = f
                    
    # Let's inspect exam PDF contents
    has_images = False
    question_count_in_pdf = 0
    pdf_text_sample = ""
    exam_types = []
    
    if exam_pdf:
        doc = fitz.open(os.path.join(folder, exam_pdf))
        # check images
        img_count = 0
        for page in doc:
            img_count += len(page.get_images())
        has_images = img_count > 0
        
        full_text = "\n".join([page.get_text() for page in doc])
        lines = full_text.splitlines()
        
        # detect question formats
        if "Dựa vào các hình ảnh" in full_text:
            exam_types.append("Hình ảnh (Visual)")
        if "Chia dạng" in full_text or "Điền vào chỗ trống" in full_text:
            exam_types.append("Tự luận/Điền từ")
        if "Chọn đáp án đúng" in full_text or "Khoanh tròn" in full_text:
            exam_types.append("Trắc nghiệm ABCD")
        if "Sắp xếp lại" in full_text or "Viết lại câu" in full_text:
            exam_types.append("Viết câu")
        if "Nối" in full_text or "Matching" in full_text:
            exam_types.append("Nối cột")
            
        pdf_text_sample = full_text[:200].replace('\n', ' ')
    
    # Check what app currently has
    app_q_count = len(app_tests)
    app_has_image_ref = any('image' in str(q).lower() or 'img' in str(q).lower() for q in app_tests)
    
    # check first 2 questions of app
    sample_q = ""
    if app_tests:
        sample_q = app_tests[0].get('question', '')[:60]
        
    unit_summary.append({
        'unit': u,
        'app_q_count': app_q_count,
        'has_exam_pdf': exam_pdf is not None,
        'exam_pdf_name': exam_pdf,
        'has_key_pdf': key_pdf is not None,
        'key_pdf_name': key_pdf,
        'pdf_has_images': has_images,
        'exam_types': ", ".join(exam_types) if exam_types else "Standard",
        'sample_q': sample_q
    })

# Print report table
print(f"{'Unit':<6} | {'App Qs':<8} | {'PDF Exam':<35} | {'Images in PDF?':<15} | {'Dạng bài gốc trong PDF'}")
print("-" * 110)
for item in unit_summary:
    img_str = "CÓ HÌNH ẢNH ⚠️" if item['pdf_has_images'] else "Chỉ có Text"
    pdf_name = (item['exam_pdf_name'][:32] + '...') if item['exam_pdf_name'] and len(item['exam_pdf_name']) > 35 else (item['exam_pdf_name'] or "KHÔNG TÌM THẤY")
    print(f"Unit {item['unit']:<2} | {item['app_q_count']:<8} | {pdf_name:<35} | {img_str:<15} | {item['exam_types']}")

