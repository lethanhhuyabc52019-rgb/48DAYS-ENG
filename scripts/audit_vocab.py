import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

unit_stats = {}
total_words = 0
total_bad_ex = 0
total_missing_ipa = 0

for u_id, u_data in data.items():
    vocab = u_data.get('vocabulary', [])
    bad_count = 0
    missing_ipa = 0
    for v in vocab:
        total_words += 1
        ex = v.get('example', '').strip()
        trans = v.get('translation', '').strip()
        # Bad if starts with Example:, or < 3 words, or translation is just Nghĩa gốc:...
        if not ex or ex.lower().startswith('example:') or len(ex.split()) < 3 or trans.startswith('Nghĩa gốc:'):
            bad_count += 1
        if not v.get('ipa'):
            missing_ipa += 1
    if vocab:
        total_bad_ex += bad_count
        total_missing_ipa += missing_ipa
        unit_stats[u_id] = {
            'total': len(vocab),
            'bad_examples': bad_count,
            'missing_ipa': missing_ipa
        }

print(f"Total vocabulary words across all units: {total_words}")
print(f"Total bad examples: {total_bad_ex} ({(total_bad_ex/total_words*100):.1f}%)")
print(f"Total missing IPA: {total_missing_ipa} ({(total_missing_ipa/total_words*100):.1f}%)")
print("\nBreakdown by unit:")
for u_id in sorted(unit_stats.keys(), key=lambda x: int(x) if x.isdigit() else 999):
    st = unit_stats[u_id]
    print(f"Unit {u_id:>2}: {st['total']:>2} words | {st['bad_examples']:>2} bad examples | {st['missing_ipa']:>2} missing IPA")
