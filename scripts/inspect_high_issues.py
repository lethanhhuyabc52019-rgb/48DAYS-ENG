import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path("d:/2.English/ENG Learning_Antigravity")
REPORT_FILE = ROOT / "reports" / "full_48_units_qa_report.json"
DATA_FILE = ROOT / "data" / "all_units_data.json"

with open(REPORT_FILE, "r", encoding="utf-8") as f:
    report = json.load(f)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

print("=== ALL HIGH ISSUES ===")
for issue in report["issues"]:
    if issue["severity"] == "high":
        u = str(issue["unit"])
        qid = issue["qid"]
        print(f"Unit {u} | {qid} | Category: {issue['category']}")
        print(f"  Msg: {issue['message']}")
        print(f"  Current: {issue.get('current')}")
        print(f"  Suggested: {issue.get('suggested')}")
        if u in data:
            q_found = next((q for q in data[u].get("unit_test", []) if q.get("id") == qid), None)
            if q_found:
                print(f"  Full Q data: stem='{q_found.get('stem')}', options={q_found.get('options')}, correct_answer='{q_found.get('correct_answer')}', acceptable_variants={q_found.get('acceptable_variants')}")
        print("-" * 60)
