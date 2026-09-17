# -*- coding: utf-8 -*-
"""
MASTER VOCABULARY ENRICHMENT SCRIPT
Merges all 5 curated vocabulary datasets, deduplicates internal unit duplicates,
and applies standard Oxford/Cambridge IPA, practical example sentences, and natural translations
across all 48 units in data/all_units_data.json.
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(base_dir, 'scripts', 'pipeline'))

from vocab_data_part1 import VOCAB_PART1
from vocab_data_part2 import VOCAB_PART2
from vocab_data_part3 import VOCAB_PART3
from vocab_data_part4 import VOCAB_PART4
from vocab_data_part5 import VOCAB_PART5

# Master dictionary merging all parts
MASTER_DICT = {}
for d in [VOCAB_PART1, VOCAB_PART2, VOCAB_PART3, VOCAB_PART4, VOCAB_PART5]:
    for k, v in d.items():
        MASTER_DICT[k.strip().lower()] = v

print(f"Total curated entries in MASTER_DICT: {len(MASTER_DICT)}")

data_file = os.path.join(base_dir, 'data', 'all_units_data.json')
with open(data_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

total_before = 0
total_after = 0
enriched_count = 0
dedup_removed = 0
remaining_bad_examples = []

for u_id in sorted(data.keys(), key=lambda x: int(x) if x.isdigit() else 999):
    vocab = data[u_id].get('vocabulary', [])
    total_before += len(vocab)
    
    seen_words = set()
    cleaned_vocab = []
    
    for v in vocab:
        w_raw = v.get('word', '').strip()
        w_lower = w_raw.lower()
        
        # 1. Deduplication within the same unit
        if w_lower in seen_words:
            dedup_removed += 1
            continue
        seen_words.add(w_lower)
        
        # 2. Enrich with master dictionary
        matched_info = MASTER_DICT.get(w_lower)
        if not matched_info:
            # Try cleaning punctuation
            w_clean = w_lower.replace('-', ' ').strip()
            matched_info = MASTER_DICT.get(w_clean)
            
        if matched_info:
            v['ipa'] = matched_info['ipa']
            v['pos'] = matched_info.get('pos', v.get('pos', 'từ vựng'))
            if matched_info.get('meaning') and (not v.get('meaning') or len(v.get('meaning')) < 2):
                v['meaning'] = matched_info['meaning']
            v['example'] = matched_info['example']
            v['translation'] = matched_info['translation']
            enriched_count += 1
        else:
            # Check if current example is already good
            ex = v.get('example', '').strip()
            trans = v.get('translation', '').strip()
            if not ex or ex.lower().startswith('example:') or len(ex.split()) < 3 or trans.startswith('Nghĩa gốc:'):
                remaining_bad_examples.append({
                    'unit': u_id,
                    'word': w_raw,
                    'meaning': v.get('meaning')
                })
                
        cleaned_vocab.append(v)
        
    # Re-assign cleaned vocab to unit
    data[u_id]['vocabulary'] = cleaned_vocab
    total_after += len(cleaned_vocab)

print(f"Total vocabulary words before: {total_before}")
print(f"Duplicates removed: {dedup_removed}")
print(f"Total vocabulary words after: {total_after}")
print(f"Successfully enriched entries: {enriched_count}")
print(f"Remaining entries with bad examples: {len(remaining_bad_examples)}")

if remaining_bad_examples:
    print("\n--- REMAINING BAD ENTRIES ---")
    for r in remaining_bad_examples[:25]:
        print(f"Unit {r['unit']}: {r['word']} -> {r['meaning']}")

# Save updated all_units_data.json
with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nSaved updated data to {data_file}")
