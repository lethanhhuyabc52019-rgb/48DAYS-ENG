import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

def get_unit_files(u):
    folder = os.path.join(src_dir, f'NGÀY {u}')
    if not os.path.isdir(folder):
        return None
    
    pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf')]
    theory = [f for f in pdfs if 'đáp án' not in f.lower() and 'bài thi' not in f.lower() and 'thi online' not in f.lower() and 'bài tập' not in f.lower()]
    test = [f for f in pdfs if 'bài thi' in f.lower() or 'thi online' in f.lower() or 'bài tập' in f.lower()]
    ans = [f for f in pdfs if 'đáp án' in f.lower()]
    
    mp4s = [f for f in os.listdir(folder) if f.endswith('.mp4')]
    webms = [f for f in os.listdir(folder) if f.endswith('.webm')]
    mp3s = [f for f in os.listdir(folder) if f.endswith('.mp3')]
    
    return {
        'folder': folder,
        'theory_file': theory[0] if theory else None,
        'test_file': test[0] if test else None,
        'ans_file': ans[0] if ans else None,
        'mp4s': mp4s,
        'webms': webms,
        'mp3s': mp3s
    }

# Test parsing vocabulary from theory
def parse_theory_vocab_and_grammar(u, theory_path, theory_filename):
    doc = fitz.open(theory_path)
    
    vocab_items = []
    grammar_sections = []
    
    current_section = None
    in_vocab = False
    in_grammar = False
    
    full_text = ""
    pages_text = []
    for pno in range(len(doc)):
        ptxt = doc[pno].get_text()
        pages_text.append(ptxt)
        full_text += f"\n[P_{pno+1}]\n" + ptxt

    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    cur_pno = 1
    cur_cat = "Từ vựng chung"
    
    for l in lines:
        if l.startswith('[P_') and l.endswith(']'):
            try:
                cur_pno = int(l[3:-1])
            except:
                pass
            continue
        
        # Detect main headers
        if re.search(r'^[A-C]\.\s*(VOCABULARY|TỪ VỰNG)', l, re.IGNORECASE):
            in_vocab = True
            in_grammar = False
            continue
        elif re.search(r'^[B-D]\.\s*(PRONUNCIATION|NGỮ ÂM|PHÁT ÂM)', l, re.IGNORECASE):
            in_vocab = False
            in_grammar = False
            continue
        elif re.search(r'^[B-D]\.\s*(GRAMMAR|NGỮ PHÁP|LÝ THUYẾT)', l, re.IGNORECASE):
            in_vocab = False
            in_grammar = True
            continue
            
        if in_vocab:
            # Check subcat e.g. "1. Một số động từ thông dụng"
            m_subcat = re.match(r'^\d+\.\s*(.+)', l)
            if m_subcat and len(l) < 60:
                cur_cat = m_subcat.group(1).strip()
                continue
            
            # Match vocabulary formats:
            # word (meaning)
            # ▪ word (meaning)
            # ✔ word (meaning)
            # word /ipa/ (pos) meaning
            clean_l = re.sub(r'^[▪✔•\-\*]\s*', '', l).strip()
            
            # Format: word (meaning) or word /ipa/ (meaning)
            m1 = re.match(r'^([a-zA-Z\s\-\'/]+)\s*\(([^)]+)\)$', clean_l)
            if m1:
                w = m1.group(1).strip()
                mng = m1.group(2).strip()
                if len(w) > 1 and len(w.split()) <= 4:
                    pos = "từ vựng"
                    if "động từ" in cur_cat.lower(): pos = "động từ"
                    elif "danh từ" in cur_cat.lower(): pos = "danh từ"
                    elif "tính từ" in cur_cat.lower(): pos = "tính từ"
                    elif "trạng từ" in cur_cat.lower(): pos = "trạng từ"
                    elif "liên từ" in cur_cat.lower(): pos = "liên từ"
                    elif "đại từ" in cur_cat.lower(): pos = "đại từ"
                    
                    vocab_items.append({
                        'id': f"u{u:02d}_v{len(vocab_items)+1:02d}",
                        'word': w,
                        'ipa': "",
                        'pos': pos,
                        'meaning': mng,
                        'example': f"Example with {w}.",
                        'translation': f"Ví dụ với từ {w}: {mng}.",
                        'source_page': cur_pno
                    })
                    continue
            
            # Format: word /ipa/ ... meaning
            m2 = re.match(r'^([a-zA-Z\s\-\']+)\s+/([^/]+)/\s*(.*)$', clean_l)
            if m2:
                w = m2.group(1).strip()
                ipa = "/" + m2.group(2).strip() + "/"
                rest = m2.group(3).strip()
                pos = "từ vựng"
                mng = rest
                if rest.startswith('('):
                    pos_end = rest.find(')')
                    if pos_end != -1:
                        pos = rest[1:pos_end]
                        mng = rest[pos_end+1:].strip()
                if len(w) > 1:
                    vocab_items.append({
                        'id': f"u{u:02d}_v{len(vocab_items)+1:02d}",
                        'word': w,
                        'ipa': ipa,
                        'pos': pos,
                        'meaning': mng or cur_cat,
                        'example': f"Example with {w}.",
                        'translation': f"Ví dụ với từ {w}: {mng}.",
                        'source_page': cur_pno
                    })
    
    # Grammar extraction
    # Find all numbered grammar sections
    for pno, ptext in enumerate(pages_text, 1):
        # Look for headers like "1. Cấu trúc", "2. Cách dùng", "1. Danh từ đếm được"
        for line in ptext.split('\n'):
            line = line.strip()
            if re.match(r'^\d+\.\s+[A-ZÀ-Ỹ]', line) and len(line) < 80 and not in_vocab:
                # Find paragraphs under this line
                grammar_sections.append({
                    'id': f"g_{u}_{len(grammar_sections)+1}",
                    'title': line,
                    'formula': "",
                    'rules': [],
                    'examples': [],
                    'source_page': pno
                })
    
    doc.close()
    return vocab_items, grammar_sections

# Test run on units 1 to 5
for u in range(1, 6):
    files = get_unit_files(u)
    if files and files['theory_file']:
        v, g = parse_theory_vocab_and_grammar(u, os.path.join(files['folder'], files['theory_file']), files['theory_file'])
        print(f"Unit {u:02d}: {len(v)} vocab, {len(g)} grammar sections")
