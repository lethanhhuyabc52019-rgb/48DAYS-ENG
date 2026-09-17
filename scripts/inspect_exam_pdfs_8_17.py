import json
import sys
from pathlib import Path
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

for u in [8, 10, 11, 12, 13, 14, 15, 16, 17]:
    folder = PDF_ROOT / f"NGÀY {u}"
    exam_pdf = next(folder.glob("*bai thi*.pdf"), None) or next(folder.glob("*thi online*.pdf"), None)
    print(f"\n==================== UNIT {u} EXAM PDF ({exam_pdf.name if exam_pdf else 'None'}) ====================")
    if exam_pdf:
        with pdfplumber.open(str(exam_pdf)) as pdf:
            for i, p in enumerate(pdf.pages):
                print(f"--- Page {i+1} ---")
                print(p.extract_text())
