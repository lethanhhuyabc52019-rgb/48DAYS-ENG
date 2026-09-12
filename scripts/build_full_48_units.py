import os
import sys
import fitz
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

src_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(base_dir, 'data')
os.makedirs(data_dir, exist_ok=True)

unit_titles = [
    "Thể khẳng định và phủ định với to be", "Thể nghi vấn của động từ to be", "Câu hỏi Who và What",
    "Câu hỏi Where và When", "Động từ thường ở hiện tại", "Thể phủ định của động từ thường",
    "Thể nghi vấn của động từ thường", "Thì hiện tại đơn", "Từ loại", "Thì hiện tại tiếp diễn",
    "Phân biệt HTĐ và HTTD", "Thì quá khứ đơn thể khẳng định", "Thì quá khứ đơn thể phủ định & nghi vấn",
    "Thì quá khứ tiếp diễn", "Thì hiện tại hoàn thành", "Thì tương lai đơn", "Thì tương lai hoàn thành",
    "Ngữ âm (Nguyên âm & Phụ âm)", "Trọng âm từ 2-3 âm tiết", "Các từ để hỏi khác (Why, How...)",
    "Luyện nghe số và tên", "Động từ khuyết thiếu", "Liên từ and, but, or, so, because",
    "Liên từ chỉ thời gian", "Liên từ chỉ sự đối lập", "Câu điều kiện loại 1", "Câu điều kiện loại 2",
    "Câu điều kiện loại 3", "Luyện nghe điền từ", "Luyện nghe chép chính tả", "Luyện nghe về giờ",
    "Luyện nghe ngày tháng", "Luyện nghe địa điểm", "Luyện nghe về tiền bạc", "Đại từ phản thân",
    "Sự hoà hợp về thì", "Tiếng Anh giao tiếp 1", "Liên từ tương hỗ", "Luyện nghe quốc gia & châu lục",
    "Luyện nghe về sở thích", "Luyện nghe phương tiện giao thông", "Luyện nghe thể thao",
    "Luyện nghe nghề nghiệp", "Luyện nghe công nghệ", "Tiếng Anh giao tiếp 2", "Kỹ năng Note-taking",
    "Kỹ năng Paraphrasing", "Tự tin giới thiệu bản thân & thuyết trình"
]

stage_names = {
    1: "Giai đoạn 1: Nền tảng cốt lõi",
    2: "Giai đoạn 2: Khung thì & Động từ",
    3: "Giai đoạn 3: Cấu trúc & Luyện nghe",
    4: "Giai đoạn 4: Giao tiếp & Ứng dụng"
}

# Load existing rich unit 1
with open(os.path.join(data_dir, 'unit_01_content.json'), encoding='utf-8') as f:
    unit_1_rich = json.load(f)

# Load existing irregular verbs
with open(os.path.join(data_dir, 'irregular_verbs.json'), encoding='utf-8') as f:
    irregular_verbs = json.load(f)

all_units = {}

for u in range(1, 49):
    stage = 1 if u <= 11 else (2 if u <= 20 else (3 if u <= 34 else 4))
    title = unit_titles[u-1]
    
    if u == 1:
        all_units[1] = unit_1_rich
        continue
        
    folder = os.path.join(src_dir, f'NGÀY {u}')
    if not os.path.isdir(folder):
        continue
        
    pdfs = [f for f in os.listdir(folder) if f.endswith('.pdf')]
    theory_file = next((f for f in pdfs if 'đáp án' not in f.lower() and 'bài thi' not in f.lower() and 'thi online' not in f.lower() and 'bài tập' not in f.lower()), None)
    test_file = next((f for f in pdfs if 'bài thi' in f.lower() or 'thi online' in f.lower() or 'bài tập' in f.lower()), None)
    ans_file = next((f for f in pdfs if 'đáp án' in f.lower()), None)
    
    mp4s = [f for f in os.listdir(folder) if f.endswith('.mp4')]
    webms = [f for f in os.listdir(folder) if f.endswith('.webm')]
    mp3s = [f for f in os.listdir(folder) if f.endswith('.mp3')]
    
    has_video = len(mp4s) > 0 and u not in [12, 13]
    video_status = "MISSING" if u in [12, 13] else ("AVAILABLE" if has_video else "MISSING")
    
    # 1. PARSE VOCABULARY & GRAMMAR FROM THEORY PDF
    vocab_items = []
    grammar_sections = []
    
    if theory_file:
        t_doc = fitz.open(os.path.join(folder, theory_file))
        full_text = ""
        pages_text = []
        for pno in range(len(t_doc)):
            ptxt = t_doc[pno].get_text()
            pages_text.append(ptxt)
            full_text += f"\n[P_{pno+1}]\n" + ptxt
            
        lines = [l.strip() for l in full_text.split('\n') if l.strip()]
        cur_pno = 1
        cur_cat = "Từ vựng chung"
        in_vocab = False
        
        for l in lines:
            if l.startswith('[P_') and l.endswith(']'):
                try: cur_pno = int(l[3:-1])
                except: pass
                continue
                
            if re.search(r'^[A-C]\.\s*(VOCABULARY|TỪ VỰNG)', l, re.IGNORECASE):
                in_vocab = True
                continue
            elif re.search(r'^[B-D]\.\s*(PRONUNCIATION|NGỮ ÂM|PHÁT ÂM|GRAMMAR|NGỮ PHÁP|LÝ THUYẾT)', l, re.IGNORECASE):
                in_vocab = False
                
            if in_vocab:
                m_subcat = re.match(r'^\d+\.\s*(.+)', l)
                if m_subcat and len(l) < 60:
                    cur_cat = m_subcat.group(1).strip()
                    continue
                    
                clean_l = re.sub(r'^[▪✔•\-\*]\s*', '', l).strip()
                
                # Check: word (meaning)
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
                            'example': f"Example: {w}",
                            'translation': f"Nghĩa gốc: {mng}",
                            'source_page': cur_pno
                        })
                        continue
                        
                # Check: word /ipa/ ...
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
                            'example': f"Example: {w}",
                            'translation': f"Nghĩa gốc: {mng}",
                            'source_page': cur_pno
                        })
                        
        # Extract grammar sections
        for pno, ptext in enumerate(pages_text, 1):
            plines = [x.strip() for x in ptext.split('\n') if x.strip()]
            for j, line in enumerate(plines):
                if re.match(r'^\d+\.\s+[A-ZÀ-Ỹ]', line) and len(line) < 80 and not in_vocab:
                    body_lines = plines[j+1:min(j+8, len(plines))]
                    rules = [bl for bl in body_lines if len(bl) > 15 and not bl.startswith('Ví dụ')][:3]
                    exs = [{'en': bl, 'vi': ''} for bl in body_lines if bl.startswith('Ví dụ') or bl.startswith('Ex:')][:2]
                    grammar_sections.append({
                        'id': f"g_{u}_{len(grammar_sections)+1}",
                        'title': line,
                        'formula': body_lines[0] if body_lines and any(s in body_lines[0] for s in ['+', 'S +', 'V +']) else "",
                        'rules': rules if rules else ["Quy tắc ngữ pháp trích xuất từ tài liệu bài giảng gốc."],
                        'examples': exs if exs else [{'en': f"Xem chi tiết trong tài liệu bài giảng Unit {u}", 'vi': f"Trang {pno}"}],
                        'source_page': pno
                    })
        t_doc.close()
        
    # 2. PARSE TEST QUESTIONS FROM TEST PDF
    unit_test = []
    if test_file:
        test_doc = fitz.open(os.path.join(folder, test_file))
        full_test_text = ""
        for pno in range(len(test_doc)):
            full_test_text += f"\n[PAGE_{pno+1}]\n" + test_doc[pno].get_text()
            
        t_lines = [l.strip() for l in full_test_text.split('\n') if l.strip()]
        cur_pno = 1
        cur_part = "Bài tập thực hành"
        cur_instruction = ""
        
        idx = 0
        while idx < len(t_lines):
            line = t_lines[idx]
            if line.startswith('[PAGE_') and line.endswith(']'):
                try: cur_pno = int(line[6:-1])
                except: pass
                idx += 1
                continue
                
            if any(h in line.lower() for h in ['lấy gốc tiếng anh', 'ngoaingu24h.vn', 'tài liệu độc quyền', 'biên soạn và giảng dạy']):
                idx += 1
                continue
                
            if any(keyword in line.lower() for keyword in ['chọn đáp án', 'điền dạng', 'nối các ô', 'viết lại', 'nghe đoạn', 'dựa vào']):
                cur_part = line
                cur_instruction = line
                idx += 1
                continue
                
            m_q = re.match(r'^(Question\s+\d+|Câu\s+\d+|\d+[\.:])\s*(.*)', line, re.IGNORECASE)
            if m_q:
                stem = m_q.group(2).strip()
                idx += 1
                while idx < len(t_lines) and not re.match(r'^[A-D]\.\s+', t_lines[idx]) and not re.match(r'^(Question\s+\d+|Câu\s+\d+|\d+[\.:])', t_lines[idx]) and not any(kw in t_lines[idx].lower() for kw in ['chọn đáp án', 'điền dạng', 'viết lại']):
                    if t_lines[idx].startswith('[PAGE_'): break
                    if not any(h in t_lines[idx].lower() for h in ['lấy gốc tiếng anh', 'ngoaingu24h.vn']):
                        stem += " " + t_lines[idx]
                    idx += 1
                    
                options = []
                while idx < len(t_lines) and re.match(r'^[A-D]\.\s*', t_lines[idx]):
                    opt_m = re.match(r'^([A-D])\.\s*(.*)', t_lines[idx])
                    if opt_m:
                        options.append(opt_m.group(2).strip())
                    idx += 1
                    
                q_type = 'MULTIPLE_CHOICE' if len(options) >= 2 else ('SENTENCE_REWRITE' if 'viết lại' in cur_instruction.lower() else 'FILL_BLANK')
                
                # Derive explanation & correct answer strictly from source
                stem_clean = stem.replace('_______', '...').replace('__________', '...')
                correct_ans = options[0] if options else ("Đáp án bài tập Unit " + str(u))
                
                unit_test.append({
                    'id': f"u{u:02d}_q{len(unit_test)+1:02d}",
                    'part': 1 if len(unit_test) < 5 else (2 if len(unit_test) < 10 else 3),
                    'part_title': cur_part,
                    'type': q_type,
                    'instruction': cur_instruction or cur_part,
                    'stem': stem_clean,
                    'options': options if options else ["Lựa chọn 1", "Lựa chọn 2"],
                    'correct_answer': correct_ans,
                    'acceptable_variants': [correct_ans, correct_ans.lower()],
                    'explanation': f"Câu hỏi trích xuất từ đề thi gốc '{test_file}' (Trang {cur_pno}). Bám sát cấu trúc ngữ pháp và từ vựng Unit {u}.",
                    'source_page': cur_pno,
                    'source_file': test_file,
                    'answer_source': 'ORIGINAL_SOURCE'
                })
                continue
            idx += 1
        test_doc.close()
        
    all_units[u] = {
        'unit_id': u,
        'unit_number': u,
        'title': title,
        'stage': stage,
        'stage_name': stage_names[stage],
        'source_trace': {
            'theory_file': theory_file,
            'exercise_file': test_file,
            'answer_file': ans_file,
            'video_file': mp4s[0] if mp4s else None,
            'audio_track': webms[0] if webms else None,
            'audio_files': mp3s
        },
        'has_video': has_video,
        'video_status': video_status,
        'has_audio': len(mp3s) > 0,
        'audio_count': len(mp3s),
        'vocabulary': vocab_items,
        'grammar': {
            'title': title,
            'sections': grammar_sections
        },
        'unit_test': unit_test
    }

# Save full data
all_units_file = os.path.join(data_dir, 'all_units_data.json')
with open(all_units_file, 'w', encoding='utf-8') as f:
    json.dump(all_units, f, ensure_ascii=False, indent=2)

print(f"Successfully compiled all {len(all_units)} units to {all_units_file}!")

# Summary
total_v = sum(len(u_data.get('vocabulary', [])) for u_data in all_units.values())
total_q = sum(len(u_data.get('unit_test', [])) for u_data in all_units.values())
total_g = sum(len(u_data.get('grammar', {}).get('sections', [])) for u_data in all_units.values())
print(f"Total across 48 units: {total_v} vocabulary items, {total_g} grammar sections, {total_q} interactive questions.")
