import json
import re
import sys
from pathlib import Path
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"
PDF_ROOT = Path(r"D:\2.English\Tai lieu_ENG\Drive_Download")

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total units in data: {len(data)}")

# Let's count total questions and inspect each unit
for u in range(1, 49):
    unit = data.get(str(u), {})
    questions = unit.get("unit_test", [])
    title = unit.get("title", "")
    print(f"Unit {u:2d}: {title} ({len(questions)} questions)")
