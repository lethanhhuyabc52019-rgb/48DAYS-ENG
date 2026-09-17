import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def is_header_or_watermark(line):
    if not line: return True
    l = line.lower().strip()
    if l.startswith('--- trang') or l.startswith('--- page'): return True
    if 'lấy gốc tiếng anh & luyện thi toeic' in l: return True
    if 'biên soạn và giảng dạy: cô vũ thị mai phương' in l: return True
    if 'vì quyền lợi chính đáng của chính các em' in l: return True
    if 'tuyệt đối không chia sẻ tài liệu' in l: return True
    if 'tài liệu độc quyền đi kèm khóa học' in l: return True
    if '48 ngày lấy gốc toàn diện tiếng anh' in l: return True
    if re.match(r'^cô vũ thị mai phương$', l, re.I): return True
    if re.match(r'^unit\s+\d+[:\.]?', l, re.I): return True
    return False

def is_major_section(line):
    return bool(re.match(r'^[A-E]\.\s+(?:VOCABULARY|PRONUNCIATION|GRAMMAR|PRACTICE|TỪ VỰNG|PHÁT ÂM|NGỮ PHÁP|LUYỆN TẬP|GIỚI THIỆU|THUYẾT TRÌNH|LUYỆN TẬP KỸ NĂNG|LISTENING|BÀI TẬP)|^Scripts\b|^TRANSCRIPT\b|^Audio Script\b', line, re.I))

def is_quiz_or_practice(line):
    return bool(re.match(r'^(?:Quiz\s*\d*|PRACTICE|BÀI TẬP(?:\s*\d*|\s*[:\-])|Bài tập(?:\s*\d*|\s*[:\-])|PRACTICE\s*\d*)', line, re.I))

def is_curriculum_topic(line):
    if not line: return False
    l = line.strip()
    
    # Exclude choice options e.g. "1. A. $35", "1. A. Laura"
    if re.match(r'^\d+\.\s+[A-D]\.\s+', l, re.I): return False
    # Exclude questions with ? or blanks
    if '?' in l or re.search(r'_{2,}|\.{3,}', l): return False
    # Exclude English sentences
    first_word_match = re.match(r'^\d+\.\s*([A-Za-z\’\']+)', l)
    if first_word_match:
        fw = first_word_match.group(1).capitalize()
        english_starters = {
            'The', 'A', 'An', 'This', 'That', 'These', 'Those', 'Here', 'There',
            'I', 'You', 'He', 'She', 'It', 'We', 'They',
            'My', 'Your', 'His', 'Her', 'Our', 'Their', 'Its',
            'How', 'What', 'Where', 'When', 'Why', 'Which', 'Who', 'Whose',
            'Is', 'Are', 'Am', 'Was', 'Were', 'Do', 'Does', 'Did', 'Can', 'Could', 'Will', 'Would', 'Shall', 'Should', 'May', 'Might', 'Must',
            'Have', 'Has', 'Had', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Look', 'Listen', 'Read', 'Write', 'Choose', 'Fill', 'Match', 'Complete', 'Check'
        }
        if fw in english_starters:
            if not re.search(r'\b(?:và|trong|của)\b', l, re.I):
                return False

    # Must match "1. Tiêu đề" or "1.1. Tiêu đề"
    m = re.match(r'^(\d+(?:\.\d+)*)\.\s+(.+)$', l)
    if not m: return False
    
    text_part = m.group(2).strip()
    
    # Translation exercise items (e.g. "1. Môn thể thao yêu thích của tôi là câu cá.", "1. 5 giờ đúng")
    if re.match(r'^(?:\d+\s+giờ|\$\d+|giáo viên của|mẹ của|xe ô tô của|cuốn sách của|chị gái của|bố của|bạn của|nhà của|con chó của|trường học của|môn thể thao yêu thích|anh rể của|chị của|sở thích của tôi là|nghề nghiệp của)\b', text_part, re.I):
        return False
        
    if text_part.endswith('.') and len(text_part.split()) >= 4:
        # Full exercise sentence
        if re.search(r'\blà\b|\bthích\b|\bchơi\b|\bđang\b|\bở\b', text_part, re.I):
            return False

    vn_grammar_keywords = [
        'danh từ', 'tính từ', 'trạng từ', 'động từ', 'đại từ', 'mạo từ', 'giới từ', 'liên từ',
        'thì ', 'thì', 'cách dùng', 'định nghĩa', 'vị trí', 'cấu trúc', 'quy tắc', 'dấu hiệu',
        'hậu tố', 'tiền tố', 'khẳng định', 'phủ định', 'nghi vấn', 'câu hỏi', 'câu điều kiện',
        'câu bị động', 'câu gián tiếp', 'so sánh', 'bất quy tắc', 'trợ động từ', 'nguyên âm', 'phụ âm',
        'số ít', 'số nhiều', 'đếm được', 'không đếm được', 'sở hữu', 'phản thân', 'chỉ định',
        'tân ngữ', 'chủ ngữ', 'thời gian', 'nơi chốn', 'phương tiện', 'sở thích', 'nghề nghiệp',
        'công nghệ', 'quốc gia', 'quốc tịch', 'châu lục', 'tiếng anh', 'giao tiếp', 'kỹ năng',
        'thuyết trình', 'giới thiệu', 'bước', 'phần', 'bài học', 'tổng hợp', 'lưu ý', 'bảng'
    ]
    
    t_lower = text_part.lower()
    if any(k in t_lower for k in vn_grammar_keywords):
        return True
        
    if re.search(r'\b(?:và|trong|của|với|hoặc|cho|được|như|khi|sau|trước)\b', t_lower):
        return True
        
    has_vn_accents = bool(re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', t_lower))
    if has_vn_accents and len(text_part.split()) <= 6 and not text_part.endswith('.'):
        return True
        
    return False

def is_instruction_line(line):
    if not line: return False
    l = line.strip()
    if re.match(r'^(?:Question\s+\d+|\d+\.\s+|Mẫu\s*[:\-]|T$|F$|[A-D]\.\s+)', l, re.I):
        return False
    if re.match(r'^(?:Man|Woman|Girl|Boy|Speaker|Person\s*\d+|A|B)\s*:', l, re.I):
        return False
    if re.match(r'^(?:Name|Age|Address|Nationality|Hobby|Phone|Job|Price|Time|Class)\s*:', l, re.I):
        return False
    if re.match(r'^(?:Hi,|Hello|Good morning|Dear)\b', l, re.I):
        return False
    if re.match(r'^_{3,}|^\.{3,}', l):
        return False
        
    instruction_keywords = [
        'hãy', 'chọn', 'điền', 'khoanh', 'lựa chọn', 'chuyển', 'chia', 'xác định',
        'nối', 'nghe', 'đọc', 'viết', 'chép', 'tìm', 'hoàn thành', 'dựa vào',
        'sắp xếp', 'đánh dấu', 'quyết định', 'sử dụng', 'tick', 'phút', 'lần', 'mp3',
        'câu sau', 'dưới đây', 'sau đây', 'bài tập', 'đoạn văn', 'hội thoại', 'bảng thông tin',
        'từ loại', 'thể phủ định', 'thể nghi vấn', 'dạng đúng'
    ]
    l_lower = l.lower()
    return any(k in l_lower for k in instruction_keywords)

print("Running complete 48 units verification...")

total_quizzes = 0
all_units_results = []

for unit_num in range(1, 49):
    u = data.get(str(unit_num), {})
    pages = u.get('full_theory_pages', [])
    lines = []
    for p in pages:
        lines.extend([l.strip() for l in p.get('text', '').split('\n') if l.strip() and not is_header_or_watermark(l)])
    
    i = 0
    unit_quizzes = []
    dropped_lines = []
    
    while i < len(lines):
        line = lines[i]
        
        # Check standalone PRACTICE followed by Bài tập 1
        if re.match(r'^(?:PRACTICE|LUYỆN TẬP)$', line, re.I):
            if i + 1 < len(lines) and re.match(r'^(?:Bài tập\s*\d*|Quiz\s*\d*|BÀI TẬP\s*\d*)', lines[i+1], re.I):
                i += 1
                continue

        if is_quiz_or_practice(line):
            quiz_title = line
            quiz_desc = ""
            
            colon_m = re.match(r'^(Bài tập\s*\d+|Quiz\s*\d*|PRACTICE\s*\d*|BÀI TẬP\s*\d*)\s*:\s*(.+)$', line, re.I)
            if colon_m:
                quiz_title = colon_m.group(1).strip()
                quiz_desc = colon_m.group(2).strip()
                
            i += 1
            desc_lines = [quiz_desc] if quiz_desc else []
            
            while i < len(lines):
                cur_l = lines[i]
                if not cur_l:
                    i += 1; continue
                if is_major_section(cur_l) or is_quiz_or_practice(cur_l) or is_curriculum_topic(cur_l):
                    break
                if '(Để khoảng trống' in cur_l:
                    i += 1; continue
                if is_instruction_line(cur_l):
                    desc_lines.append(cur_l)
                    i += 1
                else:
                    break
                
            final_desc = " ".join(filter(None, desc_lines)).strip()
            
            q_lines = []
            while i < len(lines):
                cur_l = lines[i]
                if not cur_l:
                    i += 1; continue
                if is_major_section(cur_l) or is_quiz_or_practice(cur_l) or is_curriculum_topic(cur_l) or re.match(r'^[IVXLCDM]+\.\s+', cur_l) or re.match(r'^\d+\.\d+(?:\.\d+)*\.?\s+', cur_l):
                    break
                q_lines.append(cur_l)
                i += 1
                
            unit_quizzes.append({
                'title': quiz_title,
                'desc': final_desc or "Lựa chọn hoặc điền đáp án chính xác theo yêu cầu bài học.",
                'q_lines': q_lines
            })
            total_quizzes += 1
            continue
            
        i += 1
        
    print(f"Unit {unit_num:2d} ({u.get('title')}): {len(unit_quizzes)} quizzes.")
    for qi, q in enumerate(unit_quizzes):
        print(f"   [{qi+1}] {q['title']} -> Desc: \"{q['desc'][:50]}\" | {len(q['q_lines'])} question lines")

print(f"\n==========================================")
print(f"Total Quizzes Across All 48 Units: {total_quizzes}")
print(f"==========================================")
