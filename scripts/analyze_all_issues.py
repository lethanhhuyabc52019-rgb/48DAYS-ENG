import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
DATA_FILE = ROOT / "data" / "all_units_data.json"
REPORT_FILE = ROOT / "reports" / "full_48_units_qa_report.json"

with open(REPORT_FILE, "r", encoding="utf-8") as f:
    report = json.load(f)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

issues_by_cat = {}
for issue in report["issues"]:
    cat = issue["category"]
    issues_by_cat.setdefault(cat, []).append(issue)

for cat, issues in issues_by_cat.items():
    print(f"Category: {cat} (Count: {len(issues)})")
    for i in issues[:5]:
        print(f"  Unit {i.get('unit')} | {i.get('qid')} | {i.get('message')}")
    print()
