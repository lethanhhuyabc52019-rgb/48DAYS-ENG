import sys
from pathlib import Path
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

units_to_check = [3, 4, 8, 11, 13, 14, 15]

for u in units_to_check:
    folder = PDF_ROOT / f"NGÀY {u}"
    print(f"\n==================== UNIT {u} ====================")
    pdfs = list(folder.glob("*.pdf"))
    exam_pdf = next((p for p in pdfs if "bai thi" in p.name.lower() or "thi online" in p.name.lower()), None)
    ans_pdf = next((p for p in pdfs if "dap an" in p.name.lower() or "đáp án" in p.name.lower()), None)
    
    if exam_pdf:
        print(f"--- EXAM PDF: {exam_pdf.name} ---")
        with pdfplumber.open(str(exam_pdf)) as pdf:
            for i, page in enumerate(pdf.pages):
                print(f"[Page {i+1}]")
                print(page.extract_text())
    
    if ans_pdf:
        print(f"--- ANSWER PDF: {ans_pdf.name} ---")
        with pdfplumber.open(str(ans_pdf)) as pdf:
            for i, page in enumerate(pdf.pages):
                print(f"[Page {i+1}]")
                print(page.extract_text())
