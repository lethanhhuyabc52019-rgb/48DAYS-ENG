# -*- coding: utf-8 -*-
"""
ENRICH REMAINING MISSING IPA
Fills standard IPA for proper names, school subjects, and grammar particles across Units 9, 19, 29, 31, 32, 45, 46.
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_file = os.path.join(base_dir, 'data', 'all_units_data.json')

with open(data_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

IPA_MAP = {
    'his': '/hɪz/', 'house': '/haʊs/', 'is': '/ɪz/', 'big': '/bɪɡ/',
    'he': '/hiː/', 'has': '/hæz/', 'cat': '/kæt/', 'she': '/ʃiː/',
    'small': '/smɔːl/', 'tall': '/tɔːl/', 'the': '/ðə/',
    'geography': '/dʒiˈɒɡrəfi/', 'chemistry': '/ˈkemɪstri/',
    'biology': '/baɪˈɒlədʒi/', 'history': '/ˈhɪstri/',
    'end': '/end/', 'take off': '/teɪk ɒf/',
    'name': '/neɪm/', 'phone number': '/fəʊn ˈnʌmbə(r)/',
    'mobile number': '/ˈməʊbaɪl ˈnʌmbə(r)//', 'class number': '/klɑːs ˈnʌmbə(r)/',
    'girl': '/ɡɜːl/', 'boy': '/bɔɪ/', 'man': '/mæn/', 'woman': '/ˈwʊmən/',
    'sam': '/sæm/', 'beth': '/beθ/', 'laura': '/ˈlɔːrə/', 'peter': '/ˈpiːtə(r)/',
    'phillips': '/ˈfɪlɪps/', 'david': '/ˈdeɪvɪd/', 'susan': '/ˈsuːzn/',
    'linda': '/ˈlɪndə/', 'sally': '/ˈsæli/', 'tom': '/tɒm/', 'mary': '/ˈmeəri/',
    'apple': '/ˈæpl/', 'henry': '/ˈhenri/',
    'linh': '/lɪŋ/', 'tuan': '/twɑːn/', 'fiona': '/fiˈəʊnə/', 'quang': '/kwæŋ/',
    'trang': '/træŋ/', 'tim': '/tɪm/', 'luke': '/luːk/', 'vic': '/vɪk/',
    'phat': '/fæt/', 'mitchell': '/ˈmɪtʃl/', 'jerry': '/ˈdʒeri/',
    'mark': '/mɑːk/', 'simon': '/ˈsaɪmən/',
    'ion': '/-ʃn/', 'ish': '/-ɪʃ/', 'ic': '/-ɪk/', 'ate': '/-eɪt/',
    'oon': '/-uːn/', 'ee': '/-iː/'
}

fixed = 0
for u_id in ['9', '19', '29', '31', '32', '45', '46']:
    vocab = data.get(u_id, {}).get('vocabulary', [])
    for v in vocab:
        if not v.get('ipa'):
            w_clean = v.get('word', '').strip().lower()
            if w_clean in IPA_MAP:
                v['ipa'] = IPA_MAP[w_clean]
                fixed += 1

with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Fixed IPA for {fixed} entries in data/all_units_data.json")
