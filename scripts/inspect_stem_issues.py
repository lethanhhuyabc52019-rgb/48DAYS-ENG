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

stem_issues = [i for i in report["issues"] if i["category"] == "stem_not_supported_by_exam_pdf_text"]
print(f"Total stem issues: {len(stem_issues)}")
for i in stem_issues:
    u = str(i["unit"])
    qid = i["qid"]
    q = next((x for x in data[u]["unit_test"] if x["id"] == qid), None)
    if q:
        print(f"Unit {u:2s} | {qid} | type={q.get('type')} | stem='{q.get('stem')}' | ans='{q.get('correct_answer')}'")
