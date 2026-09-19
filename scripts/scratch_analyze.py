import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
unmatched = json.load(open(os.path.join(ROOT, 'scratch', 'unmatched_174.json'), encoding='utf-8'))

target_units = [19, 29, 30, 32, 33, 34, 37, 39, 40, 41, 42, 43, 44, 46, 47]

for it in unmatched:
    if it['unit'] in target_units and it.get('type') != 'READING':
        opts = it.get('options', [])
        opt_str = f" | Opts: {[o['key'] + '.' + o['text'] for o in opts]}" if opts else ""
        print(f"U{it['unit']} [{it['quizId']}_{it['idx']}] [{it.get('type')}]: {it.get('stem') or it.get('targetWord')}{opt_str}")






