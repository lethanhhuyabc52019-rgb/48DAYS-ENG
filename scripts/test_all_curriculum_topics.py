import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def is_curriculum_topic(line):
    if not line: return False
    l = line.strip()
    
    # Exclude choice options e.g. "1. A. $35"
    if re.match(r'^\d+\.\s+[A-D]\.\s+', l, re.I): return False
    # Exclude questions with ? or blanks
    if '?' in l or re.search(r'_{2,}|\.{3,}', l): return False
    
    m = re.match(r'^(\d+(?:\.\d+)*)\.\s+(.+)$', l)
    if not m: return False
    
    num_part = m.group(1)
    text_part = m.group(2).strip()
    
    # List of known Vietnamese curriculum topic keywords
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
    
    # If it contains grammar keywords or explicit Vietnamese connectives in title
    if any(k in t_lower for k in vn_grammar_keywords):
        return True
        
    if re.search(r'\b(?:và|trong|của|với|hoặc|cho|được|như|khi|sau|trước)\b', t_lower):
        # e.g. "2. This, that, these và those", "3. Here và There"
        return True
        
    # Check if pure Vietnamese words (accented letters)
    has_vn_accents = bool(re.search(r'[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', t_lower))
    # If short Vietnamese title without verbs
    if has_vn_accents and len(text_part.split()) <= 6 and not text_part.endswith('.'):
        return True
        
    return False

print("Auditing is_curriculum_topic across all 48 units...")

for unit_num in range(1, 49):
    u = data.get(str(unit_num), {})
    pages = u.get('full_theory_pages', [])
    lines = []
    for p in pages:
        lines.extend([l.strip() for l in p.get('text', '').split('\n') if l.strip()])
    
    topics_found = []
    for l in lines:
        if is_curriculum_topic(l):
            topics_found.append(l)
            
    print(f"\nUnit {unit_num} ({u.get('title')}): {len(topics_found)} curriculum topics")
    for t in topics_found:
        print(f"   -> {t}")
