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

for u in [8, 11, 13, 14, 15]:
    print(f"\n==================== UNIT {u} ====================")
    folder = PDF_ROOT / f"NGÀY {u}"
    exam_pdf = next(folder.glob("*bai thi*.pdf"), None) or next(folder.glob("*thi online*.pdf"), None)
    if exam_pdf:
        print(f"--- EXAM PDF TEXT ({exam_pdf.name}) ---")
        with pdfplumber.open(str(exam_pdf)) as pdf:
            for p in pdf.pages:
                print(p.extract_text())
    print("\n--- APP QUESTIONS ---")
    for q in data[str(u)].get("unit_test", []):
        print(f"  {q.get('id')}: stem='{q.get('stem')}' | options={q.get('options')} | ans='{q.get('correct_answer')}' | variants={q.get('acceptable_variants')}")
