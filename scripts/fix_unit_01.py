import json

DATA_FILE = 'data/all_units_data.json'

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

u1 = data['1']['unit_test']

# Q6-Q10: Part 2: Điền dạng phù hợp của to be (am/is/are)
p2 = [
    ('We _______ happy.', 'are', ['are'], '【Động từ To Be】 Chủ ngữ "We" là đại từ số nhiều đi với "are". Dịch: Chúng tôi hạnh phúc.'),
    ('It _______ my book.', 'is', ['is'], '【Động từ To Be】 Chủ ngữ "It" là ngôi thứ ba số ít đi với "is". Dịch: Đó là quyển sách của tôi.'),
    ('They _______ her dogs.', 'are', ['are'], '【Động từ To Be】 Chủ ngữ "They" là số nhiều đi với "are". Dịch: Chúng là những chú chó của cô ấy.'),
    ('I _______ a student.', 'am', ['am'], '【Động từ To Be】 Chủ ngữ "I" đi với "am". Dịch: Tôi là một học sinh.'),
    ('He _______ her brother.', 'is', ['is'], '【Động từ To Be】 Chủ ngữ "He" là ngôi thứ ba số ít đi với "is". Dịch: Anh ấy là anh trai cô ấy.')
]

for idx, (stem, ans, vars_, expl) in enumerate(p2, start=5):
    u1[idx]['stem'] = stem
    u1[idx]['options'] = []
    u1[idx]['correct_answer'] = ans
    u1[idx]['acceptable_variants'] = vars_
    u1[idx]['valid_alternatives'] = vars_
    u1[idx]['explanation'] = expl

# Q11-Q15: Part 3: Viết lại câu sử dụng dạng viết tắt của to be
p3 = [
    ('It is a big book.', "It's a big book.", ["It's a big book.", "It's a big book", "it's a big book."], "【Dạng viết tắt của To Be】 'It is' viết tắt thành 'It's': 'It's a big book.'."),
    ('We are not teachers.', "We aren't teachers.", ["We aren't teachers.", "We aren't teachers", "We're not teachers.", "We're not teachers"], "【Dạng viết tắt của To Be phủ định】 'We are not' có thể viết tắt là 'We aren't' hoặc 'We're not': 'We aren't teachers.'."),
    ('They are small apples.', "They're small apples.", ["They're small apples.", "They're small apples", "they're small apples."], "【Dạng viết tắt của To Be】 'They are' viết tắt thành 'They're': 'They're small apples.'."),
    ('He is short.', "He's short.", ["He's short.", "He's short", "he's short."], "【Dạng viết tắt của To Be】 'He is' viết tắt thành 'He's': 'He's short.'."),
    ('She is in the car.', "She's in the car.", ["She's in the car.", "She's in the car", "she's in the car."], "【Dạng viết tắt của To Be】 'She is' viết tắt thành 'She's': 'She's in the car.'.")
]

for idx, (stem, ans, vars_, expl) in enumerate(p3, start=10):
    u1[idx]['stem'] = stem
    u1[idx]['options'] = []
    u1[idx]['correct_answer'] = ans
    u1[idx]['acceptable_variants'] = vars_
    u1[idx]['valid_alternatives'] = vars_
    u1[idx]['explanation'] = expl

# Q16-Q20: Part 4: Chọn đáp án phù hợp (MCQ)
p4 = [
    ('She _______ short; she is tall.', ['A. are', 'B. am', 'C. isn’t'], 2, '【To Be phủ định】 Vế sau khẳng định "she is tall" => vế trước phủ định. Chủ ngữ "She" đi với "isn\'t". Dịch: Cô ấy không thấp; cô ấy cao.'),
    ('I _______ a teacher. I am a student.', ['A. is not', 'B. am not', 'C. aren’t'], 1, '【To Be phủ định】 Chủ ngữ "I" đi với "am not". Dịch: Tôi không phải là giáo viên. Tôi là một học sinh.'),
    ('My brother is happy. He _______ sad.', ['A. isn’t', 'B. are', 'C. am not'], 0, '【To Be phủ định】 Vế trước "My brother is happy" => vế sau "He isn\'t sad". Chủ ngữ "He" đi với "isn\'t".'),
    ('They are not her books; they _______ my books.', ['A. is', 'B. are', 'C. am'], 1, '【To Be khẳng định】 Chủ ngữ "they" đi với "are". Dịch: Chúng không phải sách của cô ấy; chúng là sách của tôi.'),
    ('It _______ a big car. It’s a small car.', ['A. aren’t', 'B. am not', 'C. is not'], 2, '【To Be phủ định】 Chủ ngữ "It" đi với "is not". Dịch: Đó không phải là một chiếc xe lớn. Nó là một chiếc xe nhỏ.')
]

for idx, (stem, opts, cor_idx, expl) in enumerate(p4, start=15):
    opt_letter = chr(65 + cor_idx)
    clean_val = opts[cor_idx].split('. ')[1]
    u1[idx]['stem'] = stem
    u1[idx]['options'] = opts
    u1[idx]['correct_answer'] = f'{opt_letter}. {clean_val}'
    u1[idx]['acceptable_variants'] = [f'{opt_letter}. {clean_val}', opt_letter, opt_letter.lower(), clean_val, clean_val.lower()]
    u1[idx]['valid_alternatives'] = list(u1[idx]['acceptable_variants'])
    u1[idx]['explanation'] = expl

with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Unit 1 updated successfully to match exam PDF!')
