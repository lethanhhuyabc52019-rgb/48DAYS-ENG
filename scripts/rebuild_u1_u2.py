import sys
import os
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
    app_data = json.load(f)

print("=== REBUILDING UNIT TEST QUESTIONS IN all_units_data.json ===")

# --- UNIT 1: THỂ KHẲNG ĐỊNH VÀ PHỦ ĐỊNH VỚI TO BE ---
u1_questions = [
    # Part 1: Nối mạo từ a/an (5 questions)
    {
        "id": "u01_q01", "part": 1, "part_title": "Part 1: Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "type": "MATCHING", "instruction": "Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "stem": "baby", "options": ["A. a", "B. an"], "correct_answer": "A. a",
        "acceptable_variants": ["A. a", "a", "A", "a baby"],
        "explanation": "【Giải thích】 'baby' bắt đầu bằng phụ âm /b/, do vậy ta dùng mạo từ 'a' (a baby: một em bé).",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q02", "part": 1, "part_title": "Part 1: Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "type": "MATCHING", "instruction": "Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "stem": "orange", "options": ["A. a", "B. an"], "correct_answer": "B. an",
        "acceptable_variants": ["B. an", "an", "B", "an orange"],
        "explanation": "【Giải thích】 'orange' bắt đầu bằng nguyên âm /ɒ/, do vậy ta dùng mạo từ 'an' (an orange: một quả cam).",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q03", "part": 1, "part_title": "Part 1: Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "type": "MATCHING", "instruction": "Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "stem": "woman", "options": ["A. a", "B. an"], "correct_answer": "A. a",
        "acceptable_variants": ["A. a", "a", "A", "a woman"],
        "explanation": "【Giải thích】 'woman' bắt đầu bằng phụ âm /w/, do vậy ta dùng mạo từ 'a' (a woman: một người phụ nữ).",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q04", "part": 1, "part_title": "Part 1: Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "type": "MATCHING", "instruction": "Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "stem": "car", "options": ["A. a", "B. an"], "correct_answer": "A. a",
        "acceptable_variants": ["A. a", "a", "A", "a car"],
        "explanation": "【Giải thích】 'car' bắt đầu bằng phụ âm /k/, do vậy ta dùng mạo từ 'a' (a car: một chiếc xe hơi).",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q05", "part": 1, "part_title": "Part 1: Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "type": "MATCHING", "instruction": "Nối các ô để chỉ ra mạo từ ‘a/an’ phù hợp với danh từ.",
        "stem": "apple", "options": ["A. a", "B. an"], "correct_answer": "B. an",
        "acceptable_variants": ["B. an", "an", "B", "an apple"],
        "explanation": "【Giải thích】 'apple' bắt đầu bằng nguyên âm /æ/, do vậy ta dùng mạo từ 'an' (an apple: một quả táo).",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    # Part 2: Điền dạng phù hợp của động từ 'to be' ('am/ is/ are') vào chỗ trống (5 questions)
    {
        "id": "u01_q06", "part": 2, "part_title": "Part 2: Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "type": "INLINE_FILL", "instruction": "Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "stem": "Question 1. We _______ happy.", "options": ["A. are", "B. is", "C. am", "D. be"], "correct_answer": "are",
        "acceptable_variants": ["are", "Are", "A. are", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'We' (chúng tôi) là đại từ nhân xưng số nhiều nên đi với động từ to be 'are'.",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q07", "part": 2, "part_title": "Part 2: Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "type": "INLINE_FILL", "instruction": "Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "stem": "Question 2. It _______ my book.", "options": ["A. is", "B. are", "C. am", "D. be"], "correct_answer": "is",
        "acceptable_variants": ["is", "Is", "A. is", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'It' (nó) là đại từ ngôi thứ 3 số ít nên đi với động từ to be 'is'.",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q08", "part": 2, "part_title": "Part 2: Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "type": "INLINE_FILL", "instruction": "Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "stem": "Question 3. They _______ her dogs.", "options": ["A. are", "B. is", "C. am", "D. be"], "correct_answer": "are",
        "acceptable_variants": ["are", "Are", "A. are", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'They' (họ/chúng nó) là đại từ số nhiều nên đi với động từ to be 'are'.",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q09", "part": 2, "part_title": "Part 2: Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "type": "INLINE_FILL", "instruction": "Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "stem": "Question 4. I _______ a student.", "options": ["A. am", "B. is", "C. are", "D. be"], "correct_answer": "am",
        "acceptable_variants": ["am", "Am", "A. am", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'I' (tôi) luôn đi với động từ to be 'am'.",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q10", "part": 2, "part_title": "Part 2: Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "type": "INLINE_FILL", "instruction": "Điền dạng phù hợp của động từ ‘to be’ (‘am/ is/ are’) vào chỗ trống.",
        "stem": "Question 5. He _______ her brother.", "options": ["A. is", "B. are", "C. am", "D. be"], "correct_answer": "is",
        "acceptable_variants": ["is", "Is", "A. is", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'He' (anh ấy) là đại từ ngôi thứ 3 số ít nên đi với động từ to be 'is'.",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    # Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ 'to be' (5 questions)
    {
        "id": "u01_q11", "part": 3, "part_title": "Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "type": "SENTENCE_REWRITE", "instruction": "Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "stem": "Question 1. It is a big book. → ____________________________________________.",
        "options": ["A. It's a big book.", "B. Its a big book.", "C. It is' a big book.", "D. It s a big book."],
        "correct_answer": "It's a big book.",
        "acceptable_variants": ["It's a big book.", "It's a big book", "it's a big book.", "it's a big book", "A. It's a big book.", "A"],
        "explanation": "【Giải thích】 'It is' viết tắt thành 'It's'. Câu hoàn chỉnh: 'It's a big book.'",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q12", "part": 3, "part_title": "Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "type": "SENTENCE_REWRITE", "instruction": "Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "stem": "Question 2. We are doctors. → ____________________________________________.",
        "options": ["A. We're doctors.", "B. Were doctors.", "C. We are' doctors.", "D. We'r doctors."],
        "correct_answer": "We're doctors.",
        "acceptable_variants": ["We're doctors.", "We're doctors", "we're doctors.", "we're doctors", "A. We're doctors.", "A"],
        "explanation": "【Giải thích】 'We are' viết tắt thành 'We're'. Câu hoàn chỉnh: 'We're doctors.'",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q13", "part": 3, "part_title": "Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "type": "SENTENCE_REWRITE", "instruction": "Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "stem": "Question 3. I am not ready. → ____________________________________________.",
        "options": ["A. I'm not ready.", "B. I am'nt ready.", "C. I'am not ready.", "D. Im not ready."],
        "correct_answer": "I'm not ready.",
        "acceptable_variants": ["I'm not ready.", "I'm not ready", "i'm not ready.", "i'm not ready", "A. I'm not ready.", "A"],
        "explanation": "【Giải thích】 'I am not' viết tắt thành 'I'm not'. Câu hoàn chỉnh: 'I'm not ready.'",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q14", "part": 3, "part_title": "Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "type": "SENTENCE_REWRITE", "instruction": "Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "stem": "Question 4. They are not singers. → ____________________________________________.",
        "options": ["A. They aren't singers.", "B. They're not singers.", "C. They arent singers.", "D. Cả A và B đều đúng"],
        "correct_answer": "They aren't singers.",
        "acceptable_variants": ["They aren't singers.", "They aren't singers", "They're not singers.", "They're not singers", "they aren't singers.", "A. They aren't singers.", "D. Cả A và B đều đúng", "A", "D"],
        "explanation": "【Giải thích】 'They are not' có 2 cách viết tắt: 'They aren't' hoặc 'They're not'. Câu hoàn chỉnh: 'They aren't singers.'",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q15", "part": 3, "part_title": "Part 3: Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "type": "SENTENCE_REWRITE", "instruction": "Viết lại những câu sau, sử dụng dạng viết tắt của động từ ‘to be’.",
        "stem": "Question 5. She is not my teacher. → ____________________________________________.",
        "options": ["A. She isn't my teacher.", "B. She's not my teacher.", "C. She is'nt my teacher.", "D. Cả A và B đều đúng"],
        "correct_answer": "She isn't my teacher.",
        "acceptable_variants": ["She isn't my teacher.", "She isn't my teacher", "She's not my teacher.", "She's not my teacher", "she isn't my teacher.", "A. She isn't my teacher.", "D. Cả A và B đều đúng", "A", "D"],
        "explanation": "【Giải thích】 'She is not' có 2 cách viết tắt: 'She isn't' hoặc 'She's not'. Câu hoàn chỉnh: 'She isn't my teacher.'",
        "source_page": 1, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    # Part 4: Chọn đáp án phù hợp (5 questions)
    {
        "id": "u01_q16", "part": 4, "part_title": "Part 4: Chọn đáp án phù hợp.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án phù hợp.",
        "stem": "Question 1. They are _______.",
        "options": ["A. dogs", "B. a dog", "C. dog", "D. an dog"],
        "correct_answer": "A. dogs",
        "acceptable_variants": ["A. dogs", "dogs", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'They' (họ/chúng nó) là số nhiều, động từ to be 'are' đi với danh từ số nhiều 'dogs' (không có mạo từ a/an).",
        "source_page": 2, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q17", "part": 4, "part_title": "Part 4: Chọn đáp án phù hợp.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án phù hợp.",
        "stem": "Question 2. This is _______ apple.",
        "options": ["A. an", "B. a", "C. some", "D. the"],
        "correct_answer": "A. an",
        "acceptable_variants": ["A. an", "an", "A"],
        "explanation": "【Giải thích】 'apple' là danh từ đếm được số ít bắt đầu bằng nguyên âm /æ/, do đó dùng mạo từ 'an'.",
        "source_page": 2, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q18", "part": 4, "part_title": "Part 4: Chọn đáp án phù hợp.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án phù hợp.",
        "stem": "Question 3. He _______ my father.",
        "options": ["A. is", "B. are", "C. am", "D. be"],
        "correct_answer": "A. is",
        "acceptable_variants": ["A. is", "is", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'He' (anh ấy/ông ấy) là ngôi thứ 3 số ít nên đi với to be 'is'.",
        "source_page": 2, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q19", "part": 4, "part_title": "Part 4: Chọn đáp án phù hợp.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án phù hợp.",
        "stem": "Question 4. We _______ friends.",
        "options": ["A. are", "B. is", "C. am", "D. be"],
        "correct_answer": "A. are",
        "acceptable_variants": ["A. are", "are", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'We' (chúng tôi/chúng ta) là số nhiều nên đi với to be 'are'.",
        "source_page": 2, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    },
    {
        "id": "u01_q20", "part": 4, "part_title": "Part 4: Chọn đáp án phù hợp.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án phù hợp.",
        "stem": "Question 5. You _______ a good student.",
        "options": ["A. are", "B. is", "C. am", "D. be"],
        "correct_answer": "A. are",
        "acceptable_variants": ["A. are", "are", "A"],
        "explanation": "【Giải thích】 Chủ ngữ 'You' (bạn) luôn luôn đi với động từ to be 'are'.",
        "source_page": 2, "source_file": "Bài thi online Thể khẳng định và phủ định của động từ to be.pdf"
    }
]

app_data['1']['unit_test'] = u1_questions
print(f"Unit 1: Updated with {len(u1_questions)} standard questions.")

# --- UNIT 2: THỂ NGHI VẤN VỚI TO BE ---
u2_questions = [
    # Part 1: Dựa vào hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới (4 visual questions)
    {
        "id": "u02_q01", "part": 1, "part_title": "Part 1: Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "image_url": "assets/exam_images/unit_02/u02_p1_q01.png",
        "stem": "1. man → ________",
        "input_placeholder": "Nhập danh từ số nhiều...",
        "options": ["A. men", "B. mans", "C. manes", "D. mens"],
        "correct_answer": "men",
        "acceptable_variants": ["men", "Men", "A. men", "A"],
        "explanation": "【Giải thích】 'man' (người đàn ông) là danh từ biến đổi bất quy tắc khi chuyển sang số nhiều thành 'men' (những người đàn ông).",
        "source_page": 1, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q02", "part": 1, "part_title": "Part 1: Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "image_url": "assets/exam_images/unit_02/u02_p1_q02.png",
        "stem": "2. [ woman ] → [ ________ ] (Nhìn hình 1 quả táo -> nhiều quả táo / người phụ nữ)",
        "input_placeholder": "Nhập đáp án (ví dụ: apples hoặc women)...",
        "options": ["A. apples", "B. women", "C. apple", "D. womans"],
        "correct_answer": "apples",
        "acceptable_variants": ["apples", "Apples", "apple -> apples", "women", "Women", "A. apples", "A"],
        "explanation": "【Giải thích】 Hình ảnh 2 minh họa 1 quả táo (apple) → nhiều quả táo (apples). (Quy tắc thêm 's' vào danh từ đếm được số nhiều thông thường).",
        "source_page": 1, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q03", "part": 1, "part_title": "Part 1: Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "image_url": "assets/exam_images/unit_02/u02_p1_q03.png",
        "stem": "3. [ box ] → [ ________ ] (Nhìn hình 1 cái hộp -> nhiều cái hộp)",
        "input_placeholder": "Nhập danh từ số nhiều của box...",
        "options": ["A. boxes", "B. boxs", "C. boxies", "D. boxen"],
        "correct_answer": "boxes",
        "acceptable_variants": ["boxes", "Boxes", "box -> boxes", "A. boxes", "A"],
        "explanation": "【Giải thích】 'box' kết thúc bằng đuôi 'x' nên khi chuyển sang số nhiều ta thêm 'es' thành 'boxes'.",
        "source_page": 1, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q04", "part": 1, "part_title": "Part 1: Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền danh từ số ít hoặc số nhiều phù hợp bên dưới.",
        "image_url": "assets/exam_images/unit_02/u02_p1_q04.png",
        "stem": "4. [ picture / tooth ] → [ ________ ]",
        "input_placeholder": "Nhập dạng số nhiều...",
        "options": ["A. pictures", "B. teeth", "C. picture", "D. photos"],
        "correct_answer": "pictures",
        "acceptable_variants": ["pictures", "Pictures", "teeth", "Teeth", "picture -> pictures", "A. pictures", "A"],
        "explanation": "【Giải thích】 Hình ảnh minh họa bức tranh (picture) → số nhiều là 'pictures' (hoặc tooth → teeth).",
        "source_page": 1, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    # Part 2: Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’ (4 visual questions)
    {
        "id": "u02_q05", "part": 2, "part_title": "Part 2: Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’ (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p2_q01.png",
        "stem": "1. ___________ my father.",
        "input_placeholder": "Nhập từ chỉ định + to be (ví dụ: This is)...",
        "options": ["A. This is", "B. These are", "C. Those are", "D. That are"],
        "correct_answer": "This is",
        "acceptable_variants": ["This is", "this is", "That is", "that is", "A. This is", "A"],
        "explanation": "【Giải thích】 'my father' là danh từ số ít, người đang đứng ở vị trí gần ngón tay chỉ nên dùng 'This is' (Đây là bố tôi).",
        "source_page": 2, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q06", "part": 2, "part_title": "Part 2: Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’ (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p2_q02.png",
        "stem": "2. ___________ my books.",
        "input_placeholder": "Nhập từ chỉ định + to be (ví dụ: These are)...",
        "options": ["A. These are", "B. This is", "C. Those are", "D. They are"],
        "correct_answer": "These are",
        "acceptable_variants": ["These are", "these are", "Those are", "those are", "A. These are", "A"],
        "explanation": "【Giải thích】 'my books' là danh từ số nhiều, những quyển sách ở vị trí gần ngón tay nên dùng 'These are' (Đây là những cuốn sách của tôi).",
        "source_page": 2, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q07", "part": 2, "part_title": "Part 2: Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’ (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p2_q03.png",
        "stem": "3. ___________ my friend.",
        "input_placeholder": "Nhập từ chỉ định + to be (ví dụ: That is)...",
        "options": ["A. That is", "B. Those are", "C. This is", "D. These are"],
        "correct_answer": "That is",
        "acceptable_variants": ["That is", "that is", "This is", "this is", "A. That is", "A"],
        "explanation": "【Giải thích】 'my friend' là danh từ số ít, người bạn ở vị trí xa ngón tay chỉ nên dùng 'That is' (Kia là bạn tôi).",
        "source_page": 2, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q08", "part": 2, "part_title": "Part 2: Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, điền ‘This/ That/ These/ Those’ và dạng phù hợp của ‘to be’ (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p2_q04.png",
        "stem": "4. ___________ my students.",
        "input_placeholder": "Nhập từ chỉ định + to be (ví dụ: Those are)...",
        "options": ["A. Those are", "B. That is", "C. These are", "D. They are"],
        "correct_answer": "Those are",
        "acceptable_variants": ["Those are", "those are", "These are", "these are", "A. Those are", "A"],
        "explanation": "【Giải thích】 'my students' là danh từ số nhiều, các học sinh ở khoảng cách xa nên dùng 'Those are' (Kia là các học sinh của tôi).",
        "source_page": 2, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    # Part 3: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng (4 visual questions)
    {
        "id": "u02_q09", "part": 3, "part_title": "Part 3: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p3_q01.png",
        "stem": "1. Are they oranges? → Yes, ______________.",
        "input_placeholder": "Nhập cụm từ còn thiếu...",
        "options": ["A. they are", "B. they aren't", "C. it is", "D. there are"],
        "correct_answer": "they are",
        "acceptable_variants": ["they are", "They are", "they are.", "A. they are", "A"],
        "explanation": "【Giải thích】 Trong tranh là những quả cam thật, câu hỏi 'Are they oranges?' trả lời khẳng định với 'Yes' là: 'Yes, they are.'",
        "source_page": 3, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q10", "part": 3, "part_title": "Part 3: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p3_q02.png",
        "stem": "2. Are they babies? → _________________.",
        "input_placeholder": "Nhập câu trả lời (ví dụ: No, they aren't)...",
        "options": ["A. No, they aren't.", "B. No, they are not.", "C. Yes, they are.", "D. Cả A và B đều đúng"],
        "correct_answer": "No, they aren't.",
        "acceptable_variants": ["No, they aren't.", "No, they aren't", "no, they aren't.", "no, they aren't", "No, they are not.", "No, they are not", "they aren't", "they are not", "A. No, they aren't.", "D. Cả A và B đều đúng", "A", "D"],
        "explanation": "【Giải thích】 Trong ảnh là nhóm sinh viên / người lớn, KHÔNG PHẢI em bé (babies). Do đó câu trả lời phủ định: 'No, they aren't.' hoặc 'No, they are not.'",
        "source_page": 3, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q11", "part": 3, "part_title": "Part 3: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p3_q03.png",
        "stem": "3. Is this a cat? → _________________.",
        "input_placeholder": "Nhập câu trả lời (ví dụ: No, it isn't)...",
        "options": ["A. No, it isn't.", "B. No, it is not.", "C. Yes, it is.", "D. Cả A và B đều đúng"],
        "correct_answer": "No, it isn't.",
        "acceptable_variants": ["No, it isn't.", "No, it isn't", "no, it isn't.", "no, it isn't", "No, it is not.", "No, it is not", "it isn't", "it is not", "A. No, it isn't.", "D. Cả A và B đều đúng", "A", "D"],
        "explanation": "【Giải thích】 Trong hình vẽ là một chú chó (dog), KHÔNG PHẢI con mèo (cat). Câu trả lời phủ định: 'No, it isn't.' (hoặc 'No, it is not.')",
        "source_page": 3, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q12", "part": 3, "part_title": "Part 3: Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng.",
        "type": "IMAGE_FILL", "instruction": "Dựa vào các hình ảnh, viết câu trả lời phù hợp cho các câu hỏi tương ứng (Lưu ý: Chỉ viết từ còn thiếu).",
        "image_url": "assets/exam_images/unit_02/u02_p3_q04.png",
        "stem": "4. Is he a doctor? → Yes, ______________.",
        "input_placeholder": "Nhập từ còn thiếu (ví dụ: he is)...",
        "options": ["A. he is", "B. he isn't", "C. he does", "D. it is"],
        "correct_answer": "he is",
        "acceptable_variants": ["he is", "He is", "he is.", "A. he is", "A"],
        "explanation": "【Giải thích】 Trong tranh là hình ảnh một bác sĩ nam đeo ống nghe. Câu trả lời khẳng định: 'Yes, he is.'",
        "source_page": 3, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    # Part 4: Chọn đáp án đúng (8 questions)
    {
        "id": "u02_q13", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 1. Are you a singer? – No, _______.",
        "options": ["A. I am not", "B. you aren't", "C. I'm", "D. I not"],
        "correct_answer": "A. I am not",
        "acceptable_variants": ["A. I am not", "I am not", "A"],
        "explanation": "【Giải thích】 Hỏi 'Are you...?' trả lời phủ định về ngôi tôi là 'No, I am not.' hoặc 'No, I'm not.'",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q14", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 2. Is his house big? – Yes, _______.",
        "options": ["A. it is", "B. it isn't", "C. he is", "D. house is"],
        "correct_answer": "A. it is",
        "acceptable_variants": ["A. it is", "it is", "A"],
        "explanation": "【Giải thích】 'his house' là danh từ chỉ vật số ít, quy về đại từ 'it'. Trả lời khẳng định: 'Yes, it is.'",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q15", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 3. Are these books new? – No, _______.",
        "options": ["A. they aren't", "B. these aren't", "C. it isn't", "D. they are"],
        "correct_answer": "A. they aren't",
        "acceptable_variants": ["A. they aren't", "they aren't", "A"],
        "explanation": "【Giải thích】 'these books' là danh từ chỉ vật số nhiều, quy về đại từ 'they'. Trả lời phủ định: 'No, they aren't.'",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q16", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 4. Is she your sister? – Yes, _______.",
        "options": ["A. she is", "B. she isn't", "C. she does", "D. it is"],
        "correct_answer": "A. she is",
        "acceptable_variants": ["A. she is", "she is", "A"],
        "explanation": "【Giải thích】 Câu hỏi 'Is she...?' trả lời khẳng định với 'Yes' là 'Yes, she is.'",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q17", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 5. _______ your parents at home?",
        "options": ["A. Are", "B. Is", "C. Am", "D. Do"],
        "correct_answer": "A. Are",
        "acceptable_variants": ["A. Are", "Are", "A"],
        "explanation": "【Giải thích】 'your parents' (bố mẹ của bạn) là danh từ số nhiều nên to be ở đầu câu hỏi phải là 'Are'.",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q18", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 6. _______ that a cat?",
        "options": ["A. Is", "B. Are", "C. Am", "D. Does"],
        "correct_answer": "A. Is",
        "acceptable_variants": ["A. Is", "Is", "A"],
        "explanation": "【Giải thích】 'that' (kia) đi với danh từ số ít 'a cat' nên dùng to be 'Is'.",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q19", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 7. Are those pens yours? – No, _______.",
        "options": ["A. they aren't", "B. those aren't", "C. it isn't", "D. they are"],
        "correct_answer": "A. they aren't",
        "acceptable_variants": ["A. they aren't", "they aren't", "A"],
        "explanation": "【Giải thích】 'those pens' là danh từ số nhiều quy về đại từ 'they'. Trả lời phủ định: 'No, they aren't.'",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    },
    {
        "id": "u02_q20", "part": 4, "part_title": "Part 4: Chọn đáp án đúng.",
        "type": "MULTIPLE_CHOICE", "instruction": "Chọn đáp án đúng.",
        "stem": "Question 8. Is this your bag? – Yes, _______.",
        "options": ["A. it is", "B. this is", "C. they are", "D. it's"],
        "correct_answer": "A. it is",
        "acceptable_variants": ["A. it is", "it is", "A"],
        "explanation": "【Giải thích】 Câu hỏi 'Is this...?' trả lời khẳng định với đại từ 'it': 'Yes, it is.' (Chú ý: Cuối câu khẳng định ngắn không viết tắt 'it's').",
        "source_page": 4, "source_file": "Bản sao của Bài thi online Thể nghi vấn của động từ to be.pdf"
    }
]

app_data['2']['unit_test'] = u2_questions
print(f"Unit 2: Updated with {len(u2_questions)} questions (including 12 visual cards).")

# Save updated JSON
with open('data/all_units_data.json', 'w', encoding='utf-8') as f:
    json.dump(app_data, f, ensure_ascii=False, indent=2)

print("Saved data/all_units_data.json successfully!")
