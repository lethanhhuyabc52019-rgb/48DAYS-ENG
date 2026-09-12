import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

def parse_test_questions(u, test_path, test_filename):
    doc = fitz.open(test_path)
    full_text = ""
    for pno in range(len(doc)):
        full_text += f"\n[PAGE_{pno+1}]\n" + doc[pno].get_text()
    
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    questions = []
    cur_pno = 1
    cur_part = "Bài tập thực hành"
    cur_instruction = ""
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        if line.startswith('[PAGE_') and line.endswith(']'):
            try:
                cur_pno = int(line[6:-1])
            except:
                pass
            i += 1
            continue
        
        # Skip header lines
        if any(h in line.lower() for h in ['lấy gốc tiếng anh', 'ngoaingu24h.vn', 'tài liệu độc quyền', 'biên soạn và giảng dạy', 'tuyệt đối không chia sẻ']):
            i += 1
            continue
        
        # Part / Section instruction detection
        if any(keyword in line.lower() for keyword in ['chọn đáp án', 'điền', 'nối', 'viết lại', 'nghe đoạn', 'dựa vào']):
            cur_part = line
            cur_instruction = line
            i += 1
            continue
            
        # Question stem match: "Question 1. ...", "1. ...", "Câu 1. ..."
        m_q = re.match(r'^(Question\s+\d+|Câu\s+\d+|\d+[\.:])\s*(.*)', line, re.IGNORECASE)
        if m_q:
            q_num_str = m_q.group(1)
            stem = m_q.group(2).strip()
            
            # If stem is on next lines
            i += 1
            while i < len(lines) and not re.match(r'^[A-D]\.\s+', lines[i]) and not re.match(r'^(Question\s+\d+|Câu\s+\d+|\d+[\.:])', lines[i]) and not any(kw in lines[i].lower() for kw in ['chọn đáp án', 'điền dạng', 'viết lại']):
                if lines[i].startswith('[PAGE_'): break
                if not any(h in lines[i].lower() for h in ['lấy gốc tiếng anh', 'ngoaingu24h.vn']):
                    stem += " " + lines[i]
                i += 1
            
            # Now look for options A, B, C, D
            options = []
            while i < len(lines) and re.match(r'^[A-D]\.\s*', lines[i]):
                opt_m = re.match(r'^([A-D])\.\s*(.*)', lines[i])
                if opt_m:
                    options.append(opt_m.group(2).strip())
                i += 1
            
            q_type = 'MULTIPLE_CHOICE' if len(options) >= 2 else ('SENTENCE_REWRITE' if 'viết lại' in cur_instruction.lower() else 'FILL_BLANK')
            
            questions.append({
                'id': f"u{u:02d}_q{len(questions)+1:02d}",
                'part_title': cur_part,
                'type': q_type,
                'instruction': cur_instruction or cur_part,
                'stem': stem or line,
                'options': options if options else ['Đúng', 'Sai'],
                'correct_answer': options[0] if options else 'Đáp án từ tài liệu gốc',
                'source_page': cur_pno,
                'source_file': test_filename
            })
            continue
            
        i += 1
        
    doc.close()
    return questions

for u in range(1, 11):
    folder = os.path.join(src_dir, f'NGÀY {u}')
    tests = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi' in f.lower() or 'thi online' in f.lower() or 'bài tập' in f.lower())]
    if tests:
        qs = parse_test_questions(u, os.path.join(folder, tests[0]), tests[0])
        print(f"Unit {u:02d}: {len(qs)} questions parsed. Sample stem: {qs[0]['stem'][:50]} (type: {qs[0]['type']})")
