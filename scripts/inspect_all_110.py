import json

with open('scratch/110_items_readable.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

by_unit = {}
for it in items:
    by_unit.setdefault(it['unit'], []).append(it)

with open('scratch/110_by_unit_summary.txt', 'w', encoding='utf-8') as out:
    for u in sorted(by_unit.keys(), key=lambda x: int(x)):
        out.write(f"=== UNIT {u} ({len(by_unit[u])} items) ===\n")
        for it in by_unit[u]:
            key = it['key']
            num = it['num']
            stem = it['stem']
            opts = it['options']
            ckey = it['currentKey']
            ctext = it['currentText']
            out.write(f"[{key}] Q{num}: {stem}\n")
            out.write(f"   Opts: {opts}\n")
            out.write(f"   Current: {ckey} - {ctext}\n\n")

print("Generated scratch/110_by_unit_summary.txt successfully.")
