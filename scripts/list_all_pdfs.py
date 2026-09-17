import os
import sys
from pathlib import Path
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

for u in range(1, 49):
    folder = PDF_ROOT / f"NGÀY {u}"
    if not folder.exists():
        print(f"Missing folder for Unit {u}")
        continue
    pdfs = list(folder.glob("*.pdf"))
    print(f"Unit {u}: {[p.name for p in pdfs]}")
