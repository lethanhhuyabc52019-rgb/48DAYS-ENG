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
    # If it's a standalone PRACTICE or BÀI TẬP or Quiz
    return bool(re.match(r'^(?:Quiz\s*\d*|PRACTICE|BÀI TẬP(?:\s*\d*|\s*[:\-])|Bài tập(?:\s*\d*|\s*[:\-])|PRACTICE\s*\d*)', line, re.I))

def is_curriculum_topic(line):
    if not line: return False
    # If it has question options (e.g. 1. A. $35, 1. A. Laura) -> NOT a topic
    if re.match(r'^\d+\.\s+[A-D]\.\s+', line, re.I): return False
    # If it has question mark or multiple blanks/dots -> NOT a topic
    if '?' in line or re.search(r'_{2,}|\.{3,}', line): return False
    # If it's an English sentence (starts with capital English word followed by more words)
    # A curriculum topic in this course is ALWAYS Vietnamese heading or a specific grammar concept
    # E.g. "1. Danh từ", "2. This, that, these và those", "3. Trạng từ", "1.1. Định nghĩa"
    
    # Check if numbered heading like "1. Danh từ" or "2. Cách dùng"
    m = re.match(r'^(\d+(?:\.\d+)*)\.\s+([A-Z\u00C0-\u1EF9].*)$', line)
    if not m: return False
    
    text_part = m.group(2).strip()
    
    # If textPart looks like an English sentence (e.g. "The book is very great.", "She is tall.", "They have a lovely flat.")
    # Common English words starting an exercise sentence:
    first_word = text_part.split()[0].rstrip('.,:;!?')
    english_starters = {
        'The', 'A', 'An', 'This', 'That', 'These', 'Those', 'Here', 'There',
        'I', 'You', 'He', 'She', 'It', 'We', 'They',
        'My', 'Your', 'His', 'Her', 'Our', 'Their', 'Its',
        'How', 'What', 'Where', 'When', 'Why', 'Which', 'Who', 'Whose',
        'Is', 'Are', 'Am', 'Was', 'Were', 'Do', 'Does', 'Did', 'Can', 'Could', 'Will', 'Would', 'Shall', 'Should', 'May', 'Might', 'Must',
        'Have', 'Has', 'Had', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'She\'s', 'He\'s', 'It\'s', 'They\'re', 'We\'re', 'I\'m', 'You\'re', 'There\'s',
        'Today', 'Yesterday', 'Tomorrow', 'Last', 'Next', 'Every', 'In', 'On', 'At', 'For', 'With', 'Without',
        'Mr', 'Mrs', 'Miss', 'Ms', 'Doctor', 'Peter', 'Mary', 'Tom', 'John', 'David', 'Laura', 'James', 'Trang', 'Nam', 'Lan', 'Mai',
        'Look', 'Listen', 'Read', 'Write', 'Choose', 'Fill', 'Match', 'Complete', 'Check'
    }
    
    if first_word in english_starters:
        # Check if it's a grammar title like "2. This, that, these và those" or "3. Here và There"
        if re.search(r'\bvà\b|\btrong\b|\bcủa\b|\blà\b|\bđược\b', text_part, re.I):
            return True
        return False
        
    # If textPart contains English verb forms or sentence punctuation
    if text_part.endswith('.') and len(text_part.split()) >= 3:
        # Check if Vietnamese words present
        has_vn = bool(re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', text_part, re.I))
        if not has_vn:
            return False

    return True

# Check description vs question line boundary
def is_instruction_line(line):
    if not line: return False
    l = line.strip()
    # If line is clearly a question, option, dialogue, or content item
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
        
    # Instruction indicators
    instruction_keywords = [
        'hãy', 'chọn', 'điền', 'khoanh', 'lựa chọn', 'chuyển', 'chia', 'xác định',
        'nối', 'nghe', 'đọc', 'viết', 'chép', 'tìm', 'hoàn thành', 'dựa vào',
        'sắp xếp', 'đánh dấu', 'quyết định', 'sử dụng', 'tick', 'phút', 'lần', 'mp3',
        'câu sau', 'dưới đây', 'sau đây', 'bài tập', 'đoạn văn', 'hội thoại', 'bảng thông tin'
    ]
    l_lower = l.lower()
    return any(k in l_lower for k in instruction_keywords)

total_quizzes = 0
units_with_issues = []

for unit_num in range(1, 49):
    u = data.get(str(unit_num), {})
    pages = u.get('full_theory_pages', [])
    lines = []
    for p in pages:
        lines.extend([l.strip() for l in p.get('text', '').split('\n') if l.strip() and not is_header_or_watermark(l)])
    
    i = 0
    unit_quizzes = []
    while i < len(lines):
        line = lines[i]
        
        # Check if line is a standalone PRACTICE that is immediately followed by a sub-quiz (e.g. "Bài tập 1")
        if re.match(r'^(?:PRACTICE|LUYỆN TẬP)$', line, re.I):
            # Check next line
            if i + 1 < len(lines) and re.match(r'^(?:Bài tập\s*\d*|Quiz\s*\d*|BÀI TẬP\s*\d*)', lines[i+1], re.I):
                # This PRACTICE is a section header, not an individual quiz
                i += 1
                continue

        if is_quiz_or_practice(line):
            # If line is like "Bài tập 1: Hãy nghe...", split title and desc if present
            quiz_title = line
            quiz_desc = ""
            
            colon_m = re.match(r'^(Bài tập\s*\d+|Quiz\s*\d*|PRACTICE\s*\d*|BÀI TẬP\s*\d*)\s*:\s*(.+)$', line, re.I)
            if colon_m:
                quiz_title = colon_m.group(1).strip()
                quiz_desc = colon_m.group(2).strip()
                
            i += 1
            desc_lines = [quiz_desc] if quiz_desc else []
            
            # Smart capture instruction lines directly following header
            while i < len(lines):
                cur_l = lines[i]
                if not cur_l:
                    i += 1
                    continue
                if is_major_section(cur_l) or is_quiz_or_practice(cur_l) or is_curriculum_topic(cur_l):
                    break
                if '(Để khoảng trống' in cur_l:
                    i += 1
                    continue
                if is_instruction_line(cur_l):
                    desc_lines.append(cur_l)
                    i += 1
                else:
                    break
                
            final_desc = " ".join(filter(None, desc_lines)).strip()
            
            # Now collect questions
            q_lines = []
            while i < len(lines):
                cur_l = lines[i]
                if not cur_l:
                    i += 1
                    continue
                if is_major_section(cur_l) or is_quiz_or_practice(cur_l) or is_curriculum_topic(cur_l) or re.match(r'^[IVXLCDM]+\.\s+', cur_l) or re.match(r'^\d+\.\d+(?:\.\d+)*\.?\s+', cur_l):
                    break
                q_lines.append(cur_l)
                i += 1
                
            unit_quizzes.append({
                'title': quiz_title,
                'desc': final_desc,
                'q_count_lines': len(q_lines),
                'sample': q_lines[:4]
            })
            total_quizzes += 1
            continue
            
        i += 1
        
    print(f"Unit {unit_num:2d} ({u.get('title')}): {len(unit_quizzes)} quizzes found.")
    for q_idx, q in enumerate(unit_quizzes):
        print(f"   [{q_idx+1}] {q['title']} | Desc: \"{q['desc'][:60]}\" | {q['q_count_lines']} raw lines")
        if q['q_count_lines'] == 0:
            print(f"       ⚠️ EMPTY QUESTIONS! Check why!")

print(f"\nTotal Quizzes across 48 units: {total_quizzes}")


