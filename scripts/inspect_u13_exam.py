import sys
from pathlib import Path
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

folder = PDF_ROOT / "NGÀY 13"
exam_pdf = next(folder.glob("*bai thi*.pdf"), None) or next(folder.glob("*thi online*.pdf"), None)
with pdfplumber.open(str(exam_pdf)) as pdf:
    for i, p in enumerate(pdf.pages):
        print(f"=== Page {i+1} ===")
        print(p.extract_text())
