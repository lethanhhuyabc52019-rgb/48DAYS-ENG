import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. FIX UNIT 9 WITH EXACT 20 QUESTIONS FROM OFFICIAL ANSWER KEY
u9_questions = [
    # --- PART 1: 5 Questions ---
    {
        "id": "u09_q01",
        "part": 1,
        "part_title": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "stem": "Chọn cách sắp xếp đúng giữa tính từ và danh từ:",
        "options": ["A. flowers beautiful", "B. beautiful flowers"],
        "correct_answer": "B. beautiful flowers",
        "acceptable_variants": ["B. beautiful flowers", "beautiful flowers", "B"],
        "explanation": "【Giải thích】 'beautiful' là tính từ (đẹp), 'flowers' là danh từ (hoa). Trong tiếng Anh, tính từ đứng trước danh từ để bổ nghĩa, vậy ta được 'beautiful flowers' (hoa đẹp).",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q02",
        "part": 1,
        "part_title": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "stem": "Chọn cách sắp xếp đúng giữa trạng từ chỉ mức độ và tính từ:",
        "options": ["A. very good", "B. good very"],
        "correct_answer": "A. very good",
        "acceptable_variants": ["A. very good", "very good", "A"],
        "explanation": "【Giải thích】 'very' là trạng từ (rất), 'good' là tính từ (tốt). Trạng từ chỉ mức độ đứng trước tính từ, vậy ta được 'very good' (rất tốt).",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q03",
        "part": 1,
        "part_title": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "stem": "Chọn cách sắp xếp đúng giữa tính từ và danh từ:",
        "options": ["A. nice weather", "B. weather nice"],
        "correct_answer": "A. nice weather",
        "acceptable_variants": ["A. nice weather", "nice weather", "A"],
        "explanation": "【Giải thích】 'nice' là tính từ (đẹp), 'weather' là danh từ (thời tiết). Tính từ đứng trước danh từ, vậy ta được 'nice weather' (thời tiết đẹp).",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q04",
        "part": 1,
        "part_title": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "stem": "Chọn cách sắp xếp đúng giữa động từ thường và trạng từ:",
        "options": ["A. fast go", "B. go fast"],
        "correct_answer": "B. go fast",
        "acceptable_variants": ["B. go fast", "go fast", "B"],
        "explanation": "【Giải thích】 'go' là động từ (đi), 'fast' là trạng từ (nhanh). Trạng từ đứng sau động từ thường, vậy ta được 'go fast' (đi nhanh).",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q05",
        "part": 1,
        "part_title": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra cách sắp xếp từ loại phù hợp.",
        "stem": "Chọn cách sắp xếp đúng giữa trạng từ và tính từ:",
        "options": ["A. easy quite", "B. quite easy"],
        "correct_answer": "B. quite easy",
        "acceptable_variants": ["B. quite easy", "quite easy", "B"],
        "explanation": "【Giải thích】 'quite' là trạng từ (khá), 'easy' là tính từ (dễ dàng). Trạng từ đứng trước tính từ, vậy ta được 'quite easy' (khá dễ dàng).",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },

    # --- PART 2: 8 Questions (Question 1-8 in PDF) ---
    {
        "id": "u09_q06",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "She does her homework <u>carefully</u>.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "C. Trạng từ",
        "acceptable_variants": ["C. Trạng từ", "Trạng từ", "C"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'carefully' có đuôi '-ly' và đứng sau bổ nghĩa cho động từ 'does', nên nó là trạng từ. Tạm dịch: Cô ấy làm bài tập về nhà rất cẩn thận.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q07",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "My sister lives in a <u>big</u> city.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "A. Tính từ",
        "acceptable_variants": ["A. Tính từ", "Tính từ", "A"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'big' đứng trước danh từ 'city', vậy nó là một tính từ. Tạm dịch: Chị gái của tôi sống ở một thành phố lớn.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q08",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "The weather is <u>nice</u> in the spring.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "A. Tính từ",
        "acceptable_variants": ["A. Tính từ", "Tính từ", "A"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'nice' đứng sau to be 'is', nên nó là một tính từ. Tạm dịch: Vào mùa xuân, thời tiết rất đẹp.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q09",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "Her mother washes the <u>dishes</u> every day.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "B. Danh từ",
        "acceptable_variants": ["B. Danh từ", "Danh từ", "B"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'dishes' đứng sau mạo từ 'the', nên nó là một danh từ. Tạm dịch: Mẹ của cô ấy rửa bát đĩa mỗi ngày.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q10",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "Quang and Hung are <u>great</u> friends.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "A. Tính từ",
        "acceptable_variants": ["A. Tính từ", "Tính từ", "A"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'great' đứng trước danh từ 'friends', nên nó là một tính từ. Tạm dịch: Quang và Hùng là những người bạn tuyệt vời.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q11",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "Our children are very <u>active</u>.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "A. Tính từ",
        "acceptable_variants": ["A. Tính từ", "Tính từ", "A"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'active' có đuôi '-ive' và đứng sau trạng từ 'very', nên nó là một tính từ. Tạm dịch: Những đứa con của họ rất năng động.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q12",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "They are beautiful <u>pictures</u>.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "B. Danh từ",
        "acceptable_variants": ["B. Danh từ", "Danh từ", "B"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'pictures' đứng sau tính từ 'beautiful', nên nó là một danh từ. Tạm dịch: Chúng là những bức tranh đẹp.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q13",
        "part": 2,
        "part_title": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án để chỉ ra những từ được gạch chân trong câu sau đây thuộc từ loại nào.",
        "stem": "The homework is <u>quite</u> easy.",
        "options": ["A. Tính từ", "B. Danh từ", "C. Trạng từ"],
        "correct_answer": "C. Trạng từ",
        "acceptable_variants": ["C. Trạng từ", "Trạng từ", "C"],
        "explanation": "【Giải thích】 Từ loại: Ta thấy 'quite' đứng trước tính từ 'easy', nên nó là một trạng từ chỉ mức độ. Tạm dịch: Bài tập về nhà khá dễ dàng.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },

    # --- PART 3: 7 Questions (Question 1-7 in PDF) ---
    {
        "id": "u09_q14",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "Kien is an (A) student (B) in my class. (active)",
        "options": ["A", "B"],
        "correct_answer": "A",
        "acceptable_variants": ["A", "Vị trí (A)", "A. (A)"],
        "explanation": "【Giải thích】 Từ 'active' là tính từ, 'student' là danh từ. Tính từ đứng trước danh từ, do đó 'active' đặt tại vị trí (A) -> 'an active student'. Tạm dịch: Kiên là một học sinh năng động trong lớp tôi.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q15",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "The water is (A) hot (B). (very)",
        "options": ["A", "B"],
        "correct_answer": "A",
        "acceptable_variants": ["A", "Vị trí (A)", "A. (A)"],
        "explanation": "【Giải thích】 'hot' là tính từ, trạng từ 'very' đứng trước tính từ 'hot', do đó đặt tại vị trí (A) -> 'very hot'. Tạm dịch: Nước rất nóng.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q16",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "He doesn’t understand this (A) question (B). (easy)",
        "options": ["A", "B"],
        "correct_answer": "A",
        "acceptable_variants": ["A", "Vị trí (A)", "A. (A)"],
        "explanation": "【Giải thích】 'easy' là tính từ, 'question' là danh từ. Tính từ đứng trước danh từ, do đó 'easy' đặt tại vị trí (A) -> 'this easy question'. Tạm dịch: Anh ấy không hiểu câu hỏi dễ này.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q17",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "(A) Jimmy swims (B). (quickly)",
        "options": ["A", "B"],
        "correct_answer": "B",
        "acceptable_variants": ["B", "Vị trí (B)", "B. (B)"],
        "explanation": "【Giải thích】 'quickly' là trạng từ, đứng sau động từ thường 'swims', do đó đặt tại vị trí (B) -> 'Jimmy swims quickly'. Tạm dịch: Jimmy bơi nhanh.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q18",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "The film is (A) good (B). (quite)",
        "options": ["A", "B"],
        "correct_answer": "A",
        "acceptable_variants": ["A", "Vị trí (A)", "A. (A)"],
        "explanation": "【Giải thích】 'quite' là trạng từ, đứng trước tính từ 'good', do đó đặt tại vị trí (A) -> 'quite good'. Tạm dịch: Bộ phim khá hay.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q19",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "(A) They drive (B). (carelessly)",
        "options": ["A", "B"],
        "correct_answer": "B",
        "acceptable_variants": ["B", "Vị trí (B)", "B. (B)"],
        "explanation": "【Giải thích】 'carelessly' là trạng từ, đứng sau động từ thường 'drive', do đó đặt tại vị trí (B) -> 'They drive carelessly'. Tạm dịch: Họ lái xe bất cẩn.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    },
    {
        "id": "u09_q20",
        "part": 3,
        "part_title": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "type": "MULTIPLE_CHOICE",
        "instruction": "Chọn đáp án chỉ ra vị trí phù hợp trong câu của mỗi từ trong ngoặc tương ứng.",
        "stem": "My grandparents have (A) two (B) cats. (small)",
        "options": ["A", "B"],
        "correct_answer": "B",
        "acceptable_variants": ["B", "Vị trí (B)", "B. (B)"],
        "explanation": "【Giải thích】 'small' là tính từ, đứng trước danh từ 'cats', do đó đặt tại vị trí (B) -> 'two small cats'. Tạm dịch: Ông bà tôi có hai chú mèo nhỏ.",
        "source_page": 1,
        "source_file": "Bản sao của Bài thi online Từ loại.pdf",
        "answer_source": "OFFICIAL_KEY"
    }
]

data['9']['unit_test'] = u9_questions
print(f"Updated Unit 9 with {len(u9_questions)} authentic questions.")

# 2. CLEAN STEMS ACROSS ALL 48 UNITS
cleaned_count = 0
for u_id in range(1, 49):
    u_str = str(u_id)
    u_data = data.get(u_str, {})
    tests = u_data.get('unit_test', [])
    
    for q in tests:
        stem = q.get('stem', '')
        orig_stem = stem
        
        # Strip leading dots and spaces like ". ", " . ", "...", ".. "
        stem = re.sub(r'^\s*[\.]+\s*', '', stem)
        
        # Clean weird ellipses inside stems e.g. " ...______ " -> " ______ "
        stem = re.sub(r'\.{2,}\s*_{2,}', '______', stem)
        stem = re.sub(r'\.{3,}', '...', stem)
        
        # Remove repeated leading "Question X." if already inside stem to prevent double Question 1. Question 1.
        stem = re.sub(r'^(?:Question|Câu)\s*\d+[\.:\s]*', '', stem, flags=re.IGNORECASE).strip()
        
        # Strip any lingering leading dot again
        stem = re.sub(r'^\s*[\.]+\s*', '', stem)
        
        if stem != orig_stem:
            q['stem'] = stem
            cleaned_count += 1

print(f"Cleaned stems for {cleaned_count} questions across all 48 units.")

# Save back to data/all_units_data.json
with open('data/all_units_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved clean data to data/all_units_data.json successfully!")
