import sys
from pathlib import Path
import pdfplumber
import fitz

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

for u in [2, 3, 4]:
    print(f"\n==================== UNIT {u} EXAM PDF ====================")
    folder = PDF_ROOT / f"NGÀY {u}"
    exam_pdf = next(folder.glob("*bai thi*.pdf"), None) or next(folder.glob("*thi online*.pdf"), None)
    ans_pdf = next(folder.glob("*dap an*.pdf"), None) or next(folder.glob("*đáp án*.pdf"), None)
    print(f"Exam: {exam_pdf.name if exam_pdf else 'None'}")
    print(f"Ans: {ans_pdf.name if ans_pdf else 'None'}")
    
    if exam_pdf:
        with pdfplumber.open(str(exam_pdf)) as pdf:
            for i, p in enumerate(pdf.pages):
                print(f"--- Exam Page {i+1} Text ---")
                print(p.extract_text())
