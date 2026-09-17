import sys
from pathlib import Path
import pdfplumber
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

for u in range(1, 49):
    folder = PDF_ROOT / f"NGÀY {u}"
    if not folder.exists(): continue
    pdfs = list(folder.glob("*.pdf"))
    ans_pdf = next((p for p in pdfs if "dap an" in p.name.lower() or "đáp án" in p.name.lower()), None)
    if ans_pdf:
        with pdfplumber.open(str(ans_pdf)) as pdf:
            txt_len = sum(len(p.extract_text() or "") for p in pdf.pages)
            img_count = sum(len(p.images or []) for p in pdf.pages)
            print(f"Unit {u:2d} Answer PDF: pages={len(pdf.pages)}, text_len={txt_len}, images={img_count} | {ans_pdf.name}")
