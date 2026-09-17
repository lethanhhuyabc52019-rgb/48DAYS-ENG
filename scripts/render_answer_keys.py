import os
import sys
from pathlib import Path
import fitz  # PyMuPDF

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")
OUT_DIR = Path("d:/2.English/ENG Learning_Antigravity/reports/answer_keys_rendered")
OUT_DIR.mkdir(parents=True, exist_ok=True)

for u in range(1, 49):
    folder = PDF_ROOT / f"NGÀY {u}"
    if not folder.exists(): continue
    pdfs = list(folder.glob("*.pdf"))
    ans_pdf = next((p for p in pdfs if "dap an" in p.name.lower() or "đáp án" in p.name.lower()), None)
    if ans_pdf:
        doc = fitz.open(str(ans_pdf))
        page = doc[0]
        pix = page.get_pixmap(dpi=150)
        out_file = OUT_DIR / f"unit_{u:02d}_answer_key.png"
        pix.save(str(out_file))
        print(f"Rendered Unit {u:2d} Answer Key -> {out_file.name} ({pix.width}x{pix.height})")
