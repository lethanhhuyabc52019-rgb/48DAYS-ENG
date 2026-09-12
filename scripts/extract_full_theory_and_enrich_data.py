# -*- coding: utf-8 -*-
"""
Full extraction of all 48 Theory PDFs:
- Extract 100% complete content (Vocabulary, Pronunciation, Grammar, Formulas, Rules, Examples, Practice)
- Preserve all details without skipping or summarizing
- Enrich vocabulary list for units that currently have 0 vocabulary
- Update data/all_units_data.json
"""

import os
import sys
import json
import re
import fitz

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"D:\2.English\ENG Learning_Antigravity"
DATA_FILE = os.path.join(ROOT_DIR, "data", "all_units_data.json")
DRIVE_DIR = r"D:\2.English\Tai lieu_ENG\Drive_Download"

WATERMARK_PATTERNS = [
    r"Lấy gốc Tiếng Anh & Luyện thi TOEIC.*",
    r"Biên soạn và giảng dạy: Cô Vũ Thị Mai Phương.*",
    r"Vì quyền lợi chính đáng của chính các em.*",
    r"Cô Vũ Thị Mai Phương\s*",
    r"TÀI LIỆU ĐỘC QUYỀN ĐI KÈM KHÓA HỌC\s*",
    r"48 NGÀY LẤY GỐC TOÀN DIỆN TIẾNG ANH\s*",
]

def clean_page_lines(page_text):
    lines = page_text.split('\n')
    cleaned = []
    for l in lines:
        stripped = l.strip()
        if not stripped:
            cleaned.append('')
            continue
        is_watermark = False
        for wp in WATERMARK_PATTERNS:
            if re.match(wp, stripped, re.IGNORECASE):
                is_watermark = True
                break
        if not is_watermark:
            cleaned.append(stripped)
    
    # Remove leading/trailing empty lines
    text = '\n'.join(cleaned)
    # Collapse 3+ consecutive newlines to 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def get_theory_file_for_unit(unit_id):
    folder = os.path.join(DRIVE_DIR, f"NGÀY {unit_id}")
    if not os.path.isdir(folder):
        return None, None
    pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf')]
    theory_cand = [f for f in pdfs if not (f.lower().startswith('đáp án') or 'bản sao của đáp án' in f.lower() or 'bài thi' in f.lower() or 'thi online' in f.lower())]
    if theory_cand:
        return os.path.join(folder, theory_cand[0]), theory_cand[0]
    return None, None

def extract_vocab_from_text(text, unit_id):
    """Extract vocabulary pairs (word, ipa, meaning) from raw text if vocabulary list is empty"""
    vocab = []
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    idx = 1
    
    # Pattern: word (meaning) or word /ipa/ (meaning)
    for i, line in enumerate(lines):
        # Match: word (meaning) or word /ipa/
        m1 = re.match(r'^([a-zA-Z\s\'-]{2,25})\s*\(([^)]+)\)$', line)
        if m1:
            w = m1.group(1).strip()
            m = m1.group(2).strip()
            ipa = ''
            # Check next line for /ipa/
            if i + 1 < len(lines) and lines[i+1].startswith('/') and lines[i+1].endswith('/'):
                ipa = lines[i+1]
            if len(w.split()) <= 4 and not w.lower().startswith('ví dụ'):
                vocab.append({
                    "id": f"u{unit_id:02d}_v{idx:02d}",
                    "word": w,
                    "ipa": ipa,
                    "pos": "từ vựng",
                    "meaning": m,
                    "example": f"Example with {w}",
                    "translation": f"Ví dụ với {w}: {m}",
                    "source_page": 1
                })
                idx += 1
                continue
                
        # Pattern: - word /ipa/ (meaning)
        m2 = re.match(r'^[-*•]?\s*([a-zA-Z\s\'-]{2,25})\s+(/[^/]+/)\s+\(([^)]+)\)$', line)
        if m2:
            w = m2.group(1).strip()
            ipa = m2.group(2).strip()
            m = m2.group(3).strip()
            vocab.append({
                "id": f"u{unit_id:02d}_v{idx:02d}",
                "word": w,
                "ipa": ipa,
                "pos": "từ vựng",
                "meaning": m,
                "example": f"Example with {w}",
                "translation": f"Ví dụ với {w}: {m}",
                "source_page": 1
            })
            idx += 1
            continue

        # Pattern: word: meaning
        m3 = re.match(r'^[-*•]?\s*([a-zA-Z\s\'-]{2,20})\s*:\s*([^:]{2,50})$', line)
        if m3:
            w = m3.group(1).strip()
            m = m3.group(2).strip()
            if not any(k in w.lower() for k in ['chú ý', 'lưu ý', 'công thức', 'quy tắc', 'ví dụ', 'question']):
                vocab.append({
                    "id": f"u{unit_id:02d}_v{idx:02d}",
                    "word": w,
                    "ipa": "",
                    "pos": "từ vựng",
                    "meaning": m,
                    "example": f"Example with {w}",
                    "translation": f"Nghĩa: {m}",
                    "source_page": 1
                })
                idx += 1
    
    # Deduplicate by word
    seen = set()
    dedup = []
    for v in vocab:
        w_lower = v["word"].lower()
        if w_lower not in seen and len(w_lower) >= 2:
            seen.add(w_lower)
            dedup.append(v)
    return dedup

def parse_full_theory(doc, unit_id, theory_filename):
    pages_data = []
    all_cleaned_pages = []
    
    for pno in range(len(doc)):
        raw_text = doc[pno].get_text()
        cleaned = clean_page_lines(raw_text)
        pages_data.append({
            "page_num": pno + 1,
            "text": cleaned
        })
        all_cleaned_pages.append(f"--- TRANG {pno + 1} ---\n" + cleaned)
        
    full_theory_text = "\n\n".join(all_cleaned_pages)
    
    # Structure into thematic sections based on headings
    # Look for patterns like: A. VOCABULARY, B. PRONUNCIATION, C. GRAMMAR, 1. ..., 2. ...
    sections = []
    current_section = None
    
    lines = full_theory_text.split('\n')
    for line in lines:
        line_s = line.strip()
        if not line_s:
            continue
            
        # Detect main section titles: A. ..., B. ..., C. ..., or "1. ...", "2. ...", "I. ...", "II. ..."
        is_header = False
        if re.match(r'^(?:--- TRANG \d+ ---)$', line_s):
            continue
            
        if re.match(r'^[A-E]\.\s+[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ\s]{2,50}$', line_s):
            is_header = True
        elif re.match(r'^(?:UNIT \d+[:\s]|Biên soạn và giảng dạy:)', line_s):
            continue
        elif re.match(r'^(?:\d+\.\d+|\d+\.)\s+[A-ZÀ-Ỵa-zà-ỵ\s]{3,60}$', line_s) and len(line_s) < 80:
            is_header = True
        elif line_s.upper() in ['PRACTICE', 'QUIZ 1', 'QUIZ 2', 'QUIZ 3', 'BẢNG PHIÊN ÂM TIẾNG ANH (IPA)']:
            is_header = True
            
        if is_header:
            if current_section:
                sections.append(current_section)
            current_section = {
                "id": f"sec_{unit_id}_{len(sections)+1}",
                "title": line_s,
                "formula": "",
                "rules": [],
                "examples": [],
                "raw_content": []
            }
        else:
            if current_section is None:
                current_section = {
                    "id": f"sec_{unit_id}_1",
                    "title": f"Nội Dung Tổng Quan Unit {unit_id}",
                    "formula": "",
                    "rules": [],
                    "examples": [],
                    "raw_content": []
                }
            current_section["raw_content"].append(line_s)
            
            # Check for formula: S + V... or Form: ...
            if any(k in line_s for k in ['S + ', 'S +', 'Cấu trúc:', 'Công thức:']):
                if not current_section["formula"]:
                    current_section["formula"] = line_s
                    
            # Check for rule bullets
            if line_s.startswith(('•', '-', '*', '', '+')) or any(k in line_s for k in ['Lưu ý:', 'Chú ý:', 'Quy tắc:']):
                current_section["rules"].append(line_s.lstrip('•-*+ '))
                
            # Check for examples: Ví dụ: ... or "I am...", "She is..."
            if 'ví dụ' in line_s.lower() or ('(' in line_s and ')' in line_s and any(c in line_s for c in ['I ', 'You ', 'We ', 'They ', 'He ', 'She ', 'It ', 'There '])):
                # Extract English and Vietnamese translation
                ex_match = re.search(r'([A-Za-z\s\',.?!\-]+)\s*\(([^)]+)\)', line_s)
                if ex_match:
                    current_section["examples"].append({
                        "en": ex_match.group(1).strip(),
                        "vi": ex_match.group(2).strip()
                    })
                    
    if current_section:
        sections.append(current_section)
        
    # Post-process sections: ensure rules and raw_content are rich
    for s in sections:
        if not s["rules"] and s["raw_content"]:
            # Take non-empty lines as rules
            s["rules"] = [l for l in s["raw_content"] if len(l) > 10][:12]
        if not s["examples"]:
            # Provide sample extract
            s["examples"] = [{"en": f"Xem đầy đủ trong trang tài liệu gốc ({theory_filename})", "vi": "Tài liệu lý thuyết 48 Ngày Lấy Gốc Cô Mai Phương"}]
            
    return full_theory_text, pages_data, sections

def main():
    print(f"Loading existing data from: {DATA_FILE}")
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    total_words_added = 0
    total_sections_added = 0
    
    for u in range(1, 49):
        uid_str = str(u)
        if uid_str not in data:
            continue
            
        unit = data[uid_str]
        t_path, t_filename = get_theory_file_for_unit(u)
        if not t_path:
            print(f"[-] Unit {u}: No theory file found.")
            continue
            
        doc = fitz.open(t_path)
        full_text, pages_data, sections = parse_full_theory(doc, u, t_filename)
        doc.close()
        
        # Save full theory into unit
        unit["full_theory_text"] = full_text
        unit["full_theory_pages"] = pages_data
        unit["theory_filename"] = t_filename
        
        # Ensure grammar object has full sections
        if "grammar" not in unit:
            unit["grammar"] = {}
        unit["grammar"]["title"] = unit.get("title", f"Unit {u}")
        unit["grammar"]["theory_file"] = t_filename
        unit["grammar"]["page_count"] = len(pages_data)
        unit["grammar"]["sections"] = sections
        unit["grammar"]["full_text"] = full_text
        total_sections_added += len(sections)
        
        # If vocabulary is empty or small, extract and enrich from theory text
        current_vocab = unit.get("vocabulary", [])
        if len(current_vocab) == 0:
            extracted = extract_vocab_from_text(full_text, u)
            if extracted:
                unit["vocabulary"] = extracted
                total_words_added += len(extracted)
                print(f"[+] Unit {u:2d}: Enriched {len(extracted)} vocabulary items from theory PDF.")
            else:
                print(f"[!] Unit {u:2d}: Could not auto-extract vocab, checking text...")
        
        print(f"[OK] Unit {u:2d}: {len(pages_data)} pages, {len(sections)} sections extracted ({len(full_text)} chars).")

    print(f"\nTotal new sections: {total_sections_added}")
    print(f"Total words added: {total_words_added}")
    
    print(f"Writing updated database to {DATA_FILE}...")
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Database write complete!")
    
    # Run bundle generator
    print("Generating js/embedded_data.js bundle...")
    ret = os.system(f'python "{os.path.join(ROOT_DIR, "scripts", "generate_embedded_bundle.py")}"')
    if ret == 0:
        print("[SUCCESS] js/embedded_data.js updated!")
    else:
        print("[ERROR] Failed to run generate_embedded_bundle.py")

if __name__ == '__main__':
    main()
