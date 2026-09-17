import json
import sys
from pathlib import Path
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"
REPORT_FILE = ROOT / "reports" / "full_48_units_qa_report.json"

with open(REPORT_FILE, "r", encoding="utf-8") as f:
    report = json.load(f)

weak_expl = [i for i in report["issues"] if i["category"] == "weak_or_placeholder_explanation"]
counts = Counter(i["unit"] for i in weak_expl)
print(f"Total weak explanations: {len(weak_expl)} across {len(counts)} units:")
for u in range(1, 49):
    if u in counts:
        print(f"  Unit {u:2d}: {counts[u]} weak explanations")
