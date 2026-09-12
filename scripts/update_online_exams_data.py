# -*- coding: utf-8 -*-
"""
Update and enhance online exam questions for Unit 46, Unit 47 and listening units
according to official Ngoaingu24h / Co Mai Phuong PDF exams.
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'all_units_data.json')

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

# -------------------------------------------------------------
# 1. UNIT 46: KỸ NĂNG NOTE-TAKING
# -------------------------------------------------------------
u46_questions = [
    # Part 1 (mp3.1): Câu 1-4
    {
        "id": "u46_q01", "part": 1,
        "part_title": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "instruction": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "audio_track": "1-4.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "The girl is _____ years old.",
        "options": ["15", "17", "19"],
        "correct_answer": "17",
        "acceptable_variants": ["17", "b"],
        "explanation": "Theo transcript: 'Hi, my name is Clare. I am 17 years old and I am a student.' -> Chọn 17.",
        "transcript": "Hi, my name is Clare. I am 17 years old and I am a student. There are five people in my family: my parents, my two brothers and me. I don't have a sister. My family has recently moved to Paris. I love this city because there are a lot of interesting places here. (Xin chào, tên tôi là Clare. Tôi 17 tuổi và tôi là sinh viên. Gia đình tôi có năm người: bố mẹ tôi, hai anh trai tôi và tôi. Tôi không có chị gái. Gia đình tôi gần đây đã chuyển đến Paris. Tôi yêu thành phố này vì ở đây có rất nhiều địa điểm thú vị.)"
    },
    {
        "id": "u46_q02", "part": 1,
        "part_title": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "instruction": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "audio_track": "1-4.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "How many people are there in her family?",
        "options": ["6", "4", "5"],
        "correct_answer": "5",
        "acceptable_variants": ["5", "c"],
        "explanation": "Theo transcript: 'There are five people in my family: my parents, my two brothers and me.' -> Chọn 5.",
        "transcript": "Hi, my name is Clare. I am 17 years old and I am a student. There are five people in my family: my parents, my two brothers and me. I don't have a sister. My family has recently moved to Paris. I love this city because there are a lot of interesting places here."
    },
    {
        "id": "u46_q03", "part": 1,
        "part_title": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "instruction": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "audio_track": "1-4.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "She doesn’t have a _____.",
        "options": ["brother", "sister", "bedroom"],
        "correct_answer": "sister",
        "acceptable_variants": ["sister", "b"],
        "explanation": "Theo transcript: 'I don't have a sister.' -> Chọn sister.",
        "transcript": "Hi, my name is Clare. I am 17 years old and I am a student. There are five people in my family: my parents, my two brothers and me. I don't have a sister. My family has recently moved to Paris. I love this city because there are a lot of interesting places here."
    },
    {
        "id": "u46_q04", "part": 1,
        "part_title": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "instruction": "Nghe đoạn văn sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.1)",
        "audio_track": "1-4.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Her family lives in _____.",
        "options": ["Paris", "Tokyo", "New York"],
        "correct_answer": "Paris",
        "acceptable_variants": ["Paris", "a"],
        "explanation": "Theo transcript: 'My family has recently moved to Paris.' -> Chọn Paris.",
        "transcript": "Hi, my name is Clare. I am 17 years old and I am a student. There are five people in my family: my parents, my two brothers and me. I don't have a sister. My family has recently moved to Paris. I love this city because there are a lot of interesting places here."
    },
    # Part 2 (mp3.2): Câu 5-8
    {
        "id": "u46_q05", "part": 2,
        "part_title": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "instruction": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "audio_track": "5-8.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "The boy comes from _____.",
        "options": ["Britain", "Japan", "Australia"],
        "correct_answer": "Australia",
        "acceptable_variants": ["Australia", "c"],
        "explanation": "Theo transcript: 'I come from Australia. I am Australian.' -> Chọn Australia.",
        "transcript": "A: Hi. Nice to meet you.\nB: Nice to meet you too.\nA: What's your name?\nB: My name is John.\nA: Where are you from?\nB: I come from Australia. I am Australian.\nA: Where is your house?\nB: It is on Limb Street. It's L-I-M-B.\nA: Oh. How many people are there in your family?\nB: My family has three people: my parents and me.\nA: Who do you live with now?\nB: I have lived with my cousin, David since I went to university.\nA: What do you do in your free time?\nB: I often play badminton with my cousin."
    },
    {
        "id": "u46_q06", "part": 2,
        "part_title": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "instruction": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "audio_track": "5-8.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "His house is on _____ Street.",
        "options": ["Lim", "Limp", "Limb"],
        "correct_answer": "Limb",
        "acceptable_variants": ["Limb", "c"],
        "explanation": "Theo transcript: 'It is on Limb Street. It's L-I-M-B.' -> Chọn Limb.",
        "transcript": "A: Where is your house?\nB: It is on Limb Street. It's L-I-M-B."
    },
    {
        "id": "u46_q07", "part": 2,
        "part_title": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "instruction": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "audio_track": "5-8.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "He now lives with his _____.",
        "options": ["parents", "uncle", "cousin"],
        "correct_answer": "cousin",
        "acceptable_variants": ["cousin", "c"],
        "explanation": "Theo transcript: 'I have lived with my cousin, David since I went to university.' -> Chọn cousin.",
        "transcript": "A: Who do you live with now?\nB: I have lived with my cousin, David since I went to university."
    },
    {
        "id": "u46_q08", "part": 2,
        "part_title": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "instruction": "Nghe đoạn hội thoại sau và sử dụng kỹ năng note-taking để chọn đáp án đúng với mỗi câu hỏi. (mp3.2)",
        "audio_track": "5-8.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "In his free time, he often plays _____.",
        "options": ["volleyball", "chess", "badminton"],
        "correct_answer": "badminton",
        "acceptable_variants": ["badminton", "c"],
        "explanation": "Theo transcript: 'I often play badminton with my cousin.' -> Chọn badminton.",
        "transcript": "A: What do you do in your free time?\nB: I often play badminton with my cousin."
    },
    # Part 3 (mp3.3): Bảng True/False Câu 9-13
    {
        "id": "u46_q09", "part": 3,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "9-13.mp3",
        "type": "TRUE_FALSE",
        "table_index": 1,
        "stem": "The man is American.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Theo transcript: 'Hi, my name is James and I come from Britain. I am British.' -> Người đàn ông là người Anh, không phải người Mỹ -> Chọn False.",
        "transcript": "Hi, my name is James and I come from Britain. I am British. Last year, I quit my job as a pilot and now I am a teacher. I often travel to work by bus. It takes me about 30 minutes to travel from my house to my school. In my free time, I often play tennis and read books."
    },
    {
        "id": "u46_q10", "part": 3,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "9-13.mp3",
        "type": "TRUE_FALSE",
        "table_index": 2,
        "stem": "The man works as a pilot.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Theo transcript: 'Last year, I quit my job as a pilot and now I am a teacher.' -> Anh ấy đã nghỉ làm phi công và hiện là giáo viên -> Chọn False.",
        "transcript": "Hi, my name is James and I come from Britain. I am British. Last year, I quit my job as a pilot and now I am a teacher."
    },
    {
        "id": "u46_q11", "part": 3,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "9-13.mp3",
        "type": "TRUE_FALSE",
        "table_index": 3,
        "stem": "The man travels to work by train.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Theo transcript: 'I often travel to work by bus.' -> Anh ấy đi làm bằng xe buýt, không phải tàu hỏa -> Chọn False.",
        "transcript": "I often travel to work by bus. It takes me about 30 minutes to travel from my house to my school."
    },
    {
        "id": "u46_q12", "part": 3,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "9-13.mp3",
        "type": "TRUE_FALSE",
        "table_index": 4,
        "stem": "It takes the man about 30 minutes to travel to his work.",
        "options": ["True", "False"],
        "correct_answer": "True",
        "acceptable_variants": ["True", "t"],
        "explanation": "Theo transcript: 'It takes me about 30 minutes to travel from my house to my school.' -> Mất khoảng 30 phút -> Chọn True.",
        "transcript": "It takes me about 30 minutes to travel from my house to my school."
    },
    {
        "id": "u46_q13", "part": 3,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "9-13.mp3",
        "type": "TRUE_FALSE",
        "table_index": 5,
        "stem": "The man often reads books in his free time.",
        "options": ["True", "False"],
        "correct_answer": "True",
        "acceptable_variants": ["True", "t"],
        "explanation": "Theo transcript: 'In my free time, I often play tennis and read books.' -> Anh ấy thường đọc sách vào thời gian rảnh -> Chọn True.",
        "transcript": "In my free time, I often play tennis and read books."
    }
]

data['46']['unit_test'] = u46_questions

# -------------------------------------------------------------
# 2. UNIT 47: KỸ NĂNG PARAPHRASING
# -------------------------------------------------------------
u47_questions = [
    # Section 1: Câu 1-3 (Paraphrasing)
    {
        "id": "u47_q01", "part": 1,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "Sam has just bought a new jacket and a T-shirt.",
        "options": [
            "A. Sam doesn’t have a jacket and a T-shirt.",
            "B. Sam has just bought new clothes."
        ],
        "correct_answer": "B. Sam has just bought new clothes.",
        "acceptable_variants": ["B. Sam has just bought new clothes.", "b"],
        "explanation": "Sam vừa mua một chiếc áo khoác và áo phông mới.\nA. Sam không có áo khoác và áo phông.\nB. Sam vừa mua quần áo mới.\n-> Chọn đáp án B."
    },
    {
        "id": "u47_q02", "part": 1,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "We didn’t go to the zoo because it was raining heavily.",
        "options": [
            "A. We cancelled our trip to the zoo because the weather was bad.",
            "B. The zoo was crowded so we didn’t go there."
        ],
        "correct_answer": "A. We cancelled our trip to the zoo because the weather was bad.",
        "acceptable_variants": ["A. We cancelled our trip to the zoo because the weather was bad.", "a"],
        "explanation": "Chúng tôi đã không đến sở thú vì trời mưa rất to.\nA. Chúng tôi hủy chuyến đi sở thú vì thời tiết xấu.\nB. Sở thú đông đúc nên chúng tôi không đến đó.\n-> Chọn đáp án A."
    },
    {
        "id": "u47_q03", "part": 1,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "Peter couldn’t buy a new bike because it cost $100.",
        "options": [
            "A. The bike was expensive, so Peter couldn’t buy it.",
            "B. The bike was cheap, but Peter didn’t buy it."
        ],
        "correct_answer": "A. The bike was expensive, so Peter couldn’t buy it.",
        "acceptable_variants": ["A. The bike was expensive, so Peter couldn’t buy it.", "a"],
        "explanation": "Peter không thể mua một chiếc xe đạp mới vì nó có giá 100 USD.\nA. Chiếc xe đạp đắt tiền nên Peter không thể mua được.\nB. Chiếc xe đạp rẻ nhưng Peter không mua nó.\n-> Chọn đáp án A."
    },
    # Section 2: Câu 4-6 (mp3.1)
    {
        "id": "u47_q04", "part": 2,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "audio_track": "1.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 1 (mp3.1):",
        "options": [
            "A. Sam doesn’t have a jacket and a T-shirt.",
            "B. Sam has just bought new clothes."
        ],
        "correct_answer": "B. Sam has just bought new clothes.",
        "acceptable_variants": ["B. Sam has just bought new clothes.", "b"],
        "explanation": "Transcript: 'My 14-year-old son, Sam, has just bought a new jacket and a T-shirt...' -> Sam vừa mua quần áo mới -> Chọn đáp án B.",
        "transcript": "1. My 14-year-old son, Sam, has just bought a new jacket and a T-shirt. The jacket cost $40 and the T-shirt cost $25. He bought them at the shopping mall near our house. (1. Sam, cậu con trai 14 tuổi của tôi vừa mua một chiếc áo khoác và áo phông mới. Chiếc áo khoác có giá 40 USD và chiếc áo phông có giá 25 USD. Thằng bé mua chúng ở trung tâm mua sắm gần nhà chúng tôi.)"
    },
    {
        "id": "u47_q05", "part": 2,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "audio_track": "1.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 2 (mp3.1):",
        "options": [
            "A. They cancelled our trip to the zoo because the weather was bad.",
            "B. The zoo was crowded so they didn’t go there."
        ],
        "correct_answer": "A. They cancelled our trip to the zoo because the weather was bad.",
        "acceptable_variants": ["A. They cancelled our trip to the zoo because the weather was bad.", "a"],
        "explanation": "Transcript: 'When we got up yesterday, it was raining heavily... we decided to stay at home and watch TV instead.' -> Họ đã hủy chuyến đi sở thú vì thời tiết xấu -> Chọn đáp án A.",
        "transcript": "2. When we got up yesterday, it was raining heavily. We wanted to visit the zoo, but we decided to stay at home and watch TV instead. (2. Hôm qua khi chúng tôi thức dậy thì trời đang mưa rất to. Chúng tôi muốn đi thăm sở thú nhưng thay vào đó chúng tôi quyết định ở nhà và xem TV.)"
    },
    {
        "id": "u47_q06", "part": 2,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.1)",
        "audio_track": "1.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 3 (mp3.1):",
        "options": [
            "A. The bike was expensive, so Peter couldn’t buy it.",
            "B. The bike was cheap, but Peter didn’t buy it."
        ],
        "correct_answer": "A. The bike was expensive, so Peter couldn’t buy it.",
        "acceptable_variants": ["A. The bike was expensive, so Peter couldn’t buy it.", "a"],
        "explanation": "Transcript: 'Peter wanted a new bike... he decided not to buy it and instead used his old bike.' -> Xe đắt nên Peter không mua -> Chọn đáp án A.",
        "transcript": "3. Peter wanted a new bike because his bike was quite old. He bought it 5 years ago. He loved this bike, but it cost $100. So he decided not to buy it and instead used his old bike. (3. Peter muốn một chiếc xe đạp mới vì chiếc xe đạp của anh ấy khá cũ. Anh ấy đã mua nó cách đây 5 năm. Anh ấy thích chiếc xe đạp này nhưng nó có giá 100 USD. Vì vậy, anh quyết định không mua nó và thay vào đó sử dụng chiếc xe đạp cũ của mình.)"
    },
    # Section 3: Câu 7-9 (Paraphrasing)
    {
        "id": "u47_q07", "part": 3,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "Laura enjoys watching cartoons on TV.",
        "options": [
            "A. Laura is interested in watching cartoons on TV.",
            "B. There are some interesting programmes on TV."
        ],
        "correct_answer": "A. Laura is interested in watching cartoons on TV.",
        "acceptable_variants": ["A. Laura is interested in watching cartoons on TV.", "a"],
        "explanation": "Laura thích xem phim hoạt hình trên TV.\nA. Laura thích xem phim hoạt hình trên TV.\nB. Có một số chương trình thú vị trên TV.\n-> Chọn đáp án A."
    },
    {
        "id": "u47_q08", "part": 3,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "If Tom had a brother, he would be very happy.",
        "options": [
            "A. Tom has a brother, so he doesn’t feel happy.",
            "B. Tom doesn’t have a brother, so he doesn’t feel happy."
        ],
        "correct_answer": "B. Tom doesn’t have a brother, so he doesn’t feel happy.",
        "acceptable_variants": ["B. Tom doesn’t have a brother, so he doesn’t feel happy.", "b"],
        "explanation": "Nếu Tom có em trai thì anh ấy sẽ rất hạnh phúc (Câu điều kiện loại 2 giả định trái ngược với hiện tại: Hiện tại Tom không có em trai nên anh không thấy hạnh phúc).\n-> Chọn đáp án B."
    },
    {
        "id": "u47_q09", "part": 3,
        "part_title": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "instruction": "Hãy đọc các câu văn sau và chọn đáp án là cách diễn đạt khác nhưng vẫn giữ nguyên ý nghĩa của câu đã cho.",
        "type": "MULTIPLE_CHOICE",
        "stem": "It takes him about 1 hour to travel from his house to his office.",
        "options": [
            "A. He doesn’t usually drive to his office.",
            "B. He lives quite far from his office."
        ],
        "correct_answer": "B. He lives quite far from his office.",
        "acceptable_variants": ["B. He lives quite far from his office.", "b"],
        "explanation": "Anh ấy mất khoảng 1 giờ để đi từ nhà đến cơ quan (nghĩa là anh ấy sống khá xa văn phòng).\n-> Chọn đáp án B."
    },
    # Section 4: Câu 10-12 (mp3.2)
    {
        "id": "u47_q10", "part": 4,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "audio_track": "2.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 1 (mp3.2):",
        "options": [
            "A. Laura is interested in watching cartoons on TV.",
            "B. There are some interesting programmes on TV."
        ],
        "correct_answer": "A. Laura is interested in watching cartoons on TV.",
        "acceptable_variants": ["A. Laura is interested in watching cartoons on TV.", "a"],
        "explanation": "Transcript: 'Our 6-year-old daughter often watches cartoons on TV. She enjoys watching them after dinner.' -> Chọn đáp án A.",
        "transcript": "1. Our 6-year-old daughter often watches cartoons on TV. She enjoys watching them after dinner. (1. Con gái 6 tuổi của chúng tôi thường xem phim hoạt hình trên TV. Con bé thích xem chúng sau bữa tối.)"
    },
    {
        "id": "u47_q11", "part": 4,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "audio_track": "2.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 2 (mp3.2):",
        "options": [
            "A. Tom has a brother, so he doesn’t feel happy.",
            "B. Tom doesn’t have a brother, so he doesn’t feel happy."
        ],
        "correct_answer": "B. Tom doesn’t have a brother, so he doesn’t feel happy.",
        "acceptable_variants": ["B. Tom doesn’t have a brother, so he doesn’t feel happy.", "b"],
        "explanation": "Transcript: 'If he had a brother, he would feel very happy.' -> Tom không có em trai nên anh không thấy hạnh phúc -> Chọn đáp án B.",
        "transcript": "2. Tom lives with his parents in a small flat. In his free time, he often reads comic books. If he had a brother, he would feel very happy. (2. Tom sống cùng bố mẹ trong một căn hộ nhỏ. Vào thời gian rảnh rỗi, cậu ấy thường đọc truyện tranh. Nếu có anh trai, cậu ấy sẽ cảm thấy rất hạnh phúc.)"
    },
    {
        "id": "u47_q12", "part": 4,
        "part_title": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "instruction": "Hãy nghe 3 đoạn văn sau và lựa chọn đáp án đúng. (mp3.2)",
        "audio_track": "2.mp3",
        "type": "MULTIPLE_CHOICE",
        "stem": "Đoạn văn 3 (mp3.2):",
        "options": [
            "A. He doesn’t usually drive to his office.",
            "B. He lives quite far from his office."
        ],
        "correct_answer": "B. He lives quite far from his office.",
        "acceptable_variants": ["B. He lives quite far from his office.", "b"],
        "explanation": "Transcript: 'It takes me 1 hour to travel from my house to the hospital.' -> Anh ấy sống khá xa bệnh viện -> Chọn đáp án B.",
        "transcript": "3. I work as a doctor and I work at a hospital in the city centre. It often takes me 1 hour to travel from my house to the hospital. I don't mind it because I can live with my parents. (3. Tôi làm bác sĩ và làm việc tại một bệnh viện ở trung tâm thành phố. Tôi thường mất 1 giờ để đi từ nhà đến bệnh viện. Tôi không bận tâm điều đó lắm vì tôi có thể sống với bố mẹ.)"
    },
    # Section 5: Câu 13-17 (mp3.3) - Bảng True/False
    {
        "id": "u47_q13", "part": 5,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "3.mp3",
        "type": "TRUE_FALSE",
        "table_index": 1,
        "stem": "The boy went to the zoo with his parents.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Transcript: 'Last weekend, I had a trip to the zoo with my teacher and my classmates.' -> Cậu bé đi sở thú với cô giáo và các bạn cùng lớp, không phải với bố mẹ -> Chọn False.",
        "transcript": "Hi, my name is Peter, and I am 7 years old. Last weekend, I had a trip to the zoo with my teacher and my classmates. It was very crowded. I saw lions, monkeys, and tigers at the zoo. I didn't like tigers because they were too scary. But I enjoyed feeding monkeys. My friend, John, lost his ticket and he was very sad."
    },
    {
        "id": "u47_q14", "part": 5,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "3.mp3",
        "type": "TRUE_FALSE",
        "table_index": 2,
        "stem": "The boy saw some animals at the zoo.",
        "options": ["True", "False"],
        "correct_answer": "True",
        "acceptable_variants": ["True", "t"],
        "explanation": "Transcript: 'I saw lions, monkeys, and tigers at the zoo.' -> Cậu bé nhìn thấy sư tử, khỉ và hổ -> Chọn True.",
        "transcript": "I saw lions, monkeys, and tigers at the zoo."
    },
    {
        "id": "u47_q15", "part": 5,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "3.mp3",
        "type": "TRUE_FALSE",
        "table_index": 3,
        "stem": "The boy didn’t like tigers.",
        "options": ["True", "False"],
        "correct_answer": "True",
        "acceptable_variants": ["True", "t"],
        "explanation": "Transcript: 'I didn't like tigers because they were too scary.' -> Cậu bé không thích hổ vì chúng quá đáng sợ -> Đúng như khẳng định -> Chọn True.",
        "transcript": "I didn't like tigers because they were too scary."
    },
    {
        "id": "u47_q16", "part": 5,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "3.mp3",
        "type": "TRUE_FALSE",
        "table_index": 4,
        "stem": "The boy didn’t enjoy feeding monkeys.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Transcript: 'But I enjoyed feeding monkeys.' -> Cậu bé thích cho khỉ ăn, câu khẳng định 'didn't enjoy' là sai -> Chọn False.",
        "transcript": "But I enjoyed feeding monkeys."
    },
    {
        "id": "u47_q17", "part": 5,
        "part_title": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "instruction": "Nghe đoạn văn sau và quyết định xem các câu sau là đúng hay sai. Nếu đúng thì ta tick (✓) vào cột T, nếu sai ta tick (✓) vào cột F. (mp3.3)",
        "audio_track": "3.mp3",
        "type": "TRUE_FALSE",
        "table_index": 5,
        "stem": "The boy lost his ticket.",
        "options": ["True", "False"],
        "correct_answer": "False",
        "acceptable_variants": ["False", "f"],
        "explanation": "Transcript: 'My friend, John, lost his ticket and he was very sad.' -> Bạn của cậu ấy là John bị mất vé, không phải cậu bé -> Chọn False.",
        "transcript": "My friend, John, lost his ticket and he was very sad."
    }
]

data['47']['unit_test'] = u47_questions

# -------------------------------------------------------------
# 3. AUTO BIND AUDIO TRACKS FOR ALL OTHER UNITS
# -------------------------------------------------------------
source_root = r"D:\2.English\Tai lieu_ENG\Drive_Download"

for uid, u in data.items():
    if uid in ['46', '47']: continue
    fdir = os.path.join(source_root, f"NGÀY {uid}")
    if not os.path.isdir(fdir): continue
    mp3s = sorted([f for f in os.listdir(fdir) if f.lower().endswith('.mp3')])
    if not mp3s: continue
    
    ut = u.get('unit_test', [])
    for q in ut:
        instr = (q.get('instruction') or '') + ' ' + (q.get('part_title') or '')
        m = re.search(r'mp3\.?(\d+)', instr, re.IGNORECASE)
        if m:
            num = int(m.group(1))
            cand = f"mp3{num}.mp3"
            cand_alt = f"{num}.mp3"
            if cand in mp3s:
                q['audio_track'] = cand
            elif cand_alt in mp3s:
                q['audio_track'] = cand_alt
            elif num <= len(mp3s):
                q['audio_track'] = mp3s[num - 1]
        elif 'nghe' in instr.lower() and mp3s:
            if not q.get('audio_track'):
                q['audio_track'] = mp3s[0]

with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("[OK] Successfully updated all_units_data.json with enhanced Unit 46, 47 and audio tracks!")
