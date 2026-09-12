import json
import os

def run():
    json_path = 'data/all_units_data.json'
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # ============================
    # UNIT 30 TESTS
    # ============================
    # 6 audio parts, total 19 questions
    u30_tests = [
        # Part 1: mp3.1 (Sam)
        {
            "id": "u30_q1",
            "q_no": 1,
            "part": 1,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "This is Sam. She is my (1) ________. She is 8 years old. She likes (2) ________ and volleyball.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "friend",
            "explanation": "Đoạn nghe: This is Sam. She is my friend. She is 8 years old. She likes badminton and volleyball. (Đây là Sam. Cô ấy là bạn tôi. Cô ấy 8 tuổi. Cô ấy thích cầu lông và bóng chuyền.)",
            "transcript": "This is Sam. She is my friend. She is 8 years old. She likes badminton and volleyball.",
            "transcript_vi": "Đây là Sam. Cô ấy là bạn tôi. Cô ấy 8 tuổi. Cô ấy thích cầu lông và bóng chuyền."
        },
        {
            "id": "u30_q2",
            "q_no": 2,
            "part": 1,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "This is Sam. She is my (1) ________. She is 8 years old. She likes (2) ________ and volleyball.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "badminton",
            "explanation": "Đoạn nghe: This is Sam. She is my friend. She is 8 years old. She likes badminton and volleyball. (Đây là Sam. Cô ấy là bạn tôi. Cô ấy 8 tuổi. Cô ấy thích cầu lông và bóng chuyền.)",
            "transcript": "This is Sam. She is my friend. She is 8 years old. She likes badminton and volleyball.",
            "transcript_vi": "Đây là Sam. Cô ấy là bạn tôi. Cô ấy 8 tuổi. Cô ấy thích cầu lông và bóng chuyền."
        },
        # Part 2: mp3.2 (Peter)
        {
            "id": "u30_q3",
            "q_no": 3,
            "part": 2,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "This is Peter. He is my (1) _________. He is at (2) ________ now. He loves (3) ________.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "son",
            "explanation": "Đoạn nghe: This is Peter. He is my son. He is at school now. He loves football. (Đây là Peter. Cậu ấy là con trai tôi. Bây giờ thằng bé đang ở trường. Cậu ấy thích bóng đá.)",
            "transcript": "This is Peter. He is my son. He is at school now. He loves football.",
            "transcript_vi": "Đây là Peter. Cậu ấy là con trai tôi. Bây giờ thằng bé đang ở trường. Cậu ấy thích bóng đá."
        },
        {
            "id": "u30_q4",
            "q_no": 4,
            "part": 2,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "This is Peter. He is my (1) _________. He is at (2) ________ now. He loves (3) ________.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "school",
            "explanation": "Đoạn nghe: This is Peter. He is my son. He is at school now. He loves football.",
            "transcript": "This is Peter. He is my son. He is at school now. He loves football.",
            "transcript_vi": "Đây là Peter. Cậu ấy là con trai tôi. Bây giờ thằng bé đang ở trường. Cậu ấy thích bóng đá."
        },
        {
            "id": "u30_q5",
            "q_no": 5,
            "part": 2,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "This is Peter. He is my (1) _________. He is at (2) ________ now. He loves (3) ________.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "football",
            "explanation": "Đoạn nghe: This is Peter. He is my son. He is at school now. He loves football.",
            "transcript": "This is Peter. He is my son. He is at school now. He loves football.",
            "transcript_vi": "Đây là Peter. Cậu ấy là con trai tôi. Bây giờ thằng bé đang ở trường. Cậu ấy thích bóng đá."
        },
        # Part 3: mp3.3 (Luke)
        {
            "id": "u30_q6",
            "q_no": 6,
            "part": 3,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.3)",
            "audio_track": "3.mp3",
            "stem": "My name is Luke. I am a (1) ________. I teach at a (2) ________. In my free time, I often go (3) ________.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "teacher",
            "explanation": "Đoạn nghe: My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping. (Tên tôi là Luke. Tôi là một giáo viên. Tôi dạy ở một trường đại học. Vào thời gian rảnh rỗi, tôi thường đi mua sắm.)",
            "transcript": "My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping.",
            "transcript_vi": "Tên tôi là Luke. Tôi là một giáo viên. Tôi dạy ở một trường đại học. Vào thời gian rảnh rỗi, tôi thường đi mua sắm."
        },
        {
            "id": "u30_q7",
            "q_no": 7,
            "part": 3,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.3)",
            "audio_track": "3.mp3",
            "stem": "My name is Luke. I am a (1) ________. I teach at a (2) ________. In my free time, I often go (3) ________.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "university",
            "explanation": "Đoạn nghe: My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping.",
            "transcript": "My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping.",
            "transcript_vi": "Tên tôi là Luke. Tôi là một giáo viên. Tôi dạy ở một trường đại học. Vào thời gian rảnh rỗi, tôi thường đi mua sắm."
        },
        {
            "id": "u30_q8",
            "q_no": 8,
            "part": 3,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.3)",
            "audio_track": "3.mp3",
            "stem": "My name is Luke. I am a (1) ________. I teach at a (2) ________. In my free time, I often go (3) ________.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "shopping",
            "explanation": "Đoạn nghe: My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping.",
            "transcript": "My name is Luke. I am a teacher. I teach at a university. In my free time, I often go shopping.",
            "transcript_vi": "Tên tôi là Luke. Tôi là một giáo viên. Tôi dạy ở một trường đại học. Vào thời gian rảnh rỗi, tôi thường đi mua sắm."
        },
        # Part 4: mp3.4 (Laura)
        {
            "id": "u30_q9",
            "q_no": 9,
            "part": 4,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.4)",
            "audio_track": "4.mp3",
            "stem": "Hi, my name is Laura. There are five people in my (1) ________. My parents are (2) ________. I have a brother. He is a (3) ________. We often have (4) ________ at 7 P.M. every day.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "family",
            "explanation": "Đoạn nghe: Hi, my name is Laura. There are five people in my family. My parents are doctors. I have a brother. He is a student. We often have dinner at 7 P.M. every day. (Xin chào, tên tôi là Laura. Có năm người trong gia đình của tôi. Bố mẹ tôi là bác sĩ. Tôi có một người anh trai. Anh là một sinh viên. Chúng tôi thường ăn tối lúc 7 giờ tối hàng ngày.)",
            "transcript": "Hi, my name is Laura. There are five people in my family. My parents are doctors. I have a brother. He is a student. We often have dinner at 7 P.M. every day.",
            "transcript_vi": "Xin chào, tên tôi là Laura. Có năm người trong gia đình của tôi. Bố mẹ tôi là bác sĩ. Tôi có một người anh trai. Anh là một sinh viên. Chúng tôi thường ăn tối lúc 7 giờ tối hàng ngày."
        },
        {
            "id": "u30_q10",
            "q_no": 10,
            "part": 4,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.4)",
            "audio_track": "4.mp3",
            "stem": "Hi, my name is Laura. There are five people in my (1) ________. My parents are (2) ________. I have a brother. He is a (3) ________. We often have (4) ________ at 7 P.M. every day.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "doctors",
            "explanation": "Đoạn nghe: My parents are doctors.",
            "transcript": "Hi, my name is Laura. There are five people in my family. My parents are doctors. I have a brother. He is a student. We often have dinner at 7 P.M. every day.",
            "transcript_vi": "Xin chào, tên tôi là Laura. Có năm người trong gia đình của tôi. Bố mẹ tôi là bác sĩ. Tôi có một người anh trai. Anh là một sinh viên. Chúng tôi thường ăn tối lúc 7 giờ tối hàng ngày."
        },
        {
            "id": "u30_q11",
            "q_no": 11,
            "part": 4,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.4)",
            "audio_track": "4.mp3",
            "stem": "Hi, my name is Laura. There are five people in my (1) ________. My parents are (2) ________. I have a brother. He is a (3) ________. We often have (4) ________ at 7 P.M. every day.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "student",
            "explanation": "Đoạn nghe: He is a student.",
            "transcript": "Hi, my name is Laura. There are five people in my family. My parents are doctors. I have a brother. He is a student. We often have dinner at 7 P.M. every day.",
            "transcript_vi": "Xin chào, tên tôi là Laura. Có năm người trong gia đình của tôi. Bố mẹ tôi là bác sĩ. Tôi có một người anh trai. Anh là một sinh viên. Chúng tôi thường ăn tối lúc 7 giờ tối hàng ngày."
        },
        {
            "id": "u30_q12",
            "q_no": 12,
            "part": 4,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.4)",
            "audio_track": "4.mp3",
            "stem": "Hi, my name is Laura. There are five people in my (1) ________. My parents are (2) ________. I have a brother. He is a (3) ________. We often have (4) ________ at 7 P.M. every day.",
            "blank_no": 4,
            "type": "FILL_IN_BLANK",
            "correct_answer": "dinner",
            "explanation": "Đoạn nghe: We often have dinner at 7 P.M. every day.",
            "transcript": "Hi, my name is Laura. There are five people in my family. My parents are doctors. I have a brother. He is a student. We often have dinner at 7 P.M. every day.",
            "transcript_vi": "Xin chào, tên tôi là Laura. Có năm người trong gia đình của tôi. Bố mẹ tôi là bác sĩ. Tôi có một người anh trai. Anh là một sinh viên. Chúng tôi thường ăn tối lúc 7 giờ tối hàng ngày."
        },
        # Part 5: mp3.5 (Brother car)
        {
            "id": "u30_q13",
            "q_no": 13,
            "part": 5,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.5)",
            "audio_track": "5.mp3",
            "stem": "My brother has recently bought a new (1) ________. It is quite (2) ________. He likes it very much. He drives to (3) ________ every day.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "car",
            "explanation": "Đoạn nghe: My brother has recently bought a new car. It is quite cheap. He likes it very much. He drives to work every day. (Anh trai tôi gần đây đã mua một chiếc xe hơi mới. Nó khá rẻ. Anh ấy rất thích nó. Anh ấy lái xe đi làm hàng ngày.)",
            "transcript": "My brother has recently bought a new car. It is quite cheap. He likes it very much. He drives to work every day.",
            "transcript_vi": "Anh trai tôi gần đây đã mua một chiếc xe hơi mới. Nó khá rẻ. Anh ấy rất thích nó. Anh ấy lái xe đi làm hàng ngày."
        },
        {
            "id": "u30_q14",
            "q_no": 14,
            "part": 5,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.5)",
            "audio_track": "5.mp3",
            "stem": "My brother has recently bought a new (1) ________. It is quite (2) ________. He likes it very much. He drives to (3) ________ every day.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "cheap",
            "explanation": "Đoạn nghe: It is quite cheap.",
            "transcript": "My brother has recently bought a new car. It is quite cheap. He likes it very much. He drives to work every day.",
            "transcript_vi": "Anh trai tôi gần đây đã mua một chiếc xe hơi mới. Nó khá rẻ. Anh ấy rất thích nó. Anh ấy lái xe đi làm hàng ngày."
        },
        {
            "id": "u30_q15",
            "q_no": 15,
            "part": 5,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.5)",
            "audio_track": "5.mp3",
            "stem": "My brother has recently bought a new (1) ________. It is quite (2) ________. He likes it very much. He drives to (3) ________ every day.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "work",
            "explanation": "Đoạn nghe: He drives to work every day.",
            "transcript": "My brother has recently bought a new car. It is quite cheap. He likes it very much. He drives to work every day.",
            "transcript_vi": "Anh trai tôi gần đây đã mua một chiếc xe hơi mới. Nó khá rẻ. Anh ấy rất thích nó. Anh ấy lái xe đi làm hàng ngày."
        },
        # Part 6: mp3.6 (Jerry cat)
        {
            "id": "u30_q16",
            "q_no": 16,
            "part": 6,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.6)",
            "audio_track": "6.mp3",
            "stem": "My sister has a (1) ________. His name is Jerry. She usually (2) ________ him at 5.00 P.M. every day. He is very (3) ________. In my free time, I often (4) ________ with him.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "cat",
            "explanation": "Đoạn nghe: My sister has a cat. His name is Jerry. She usually feeds him at 5.00 P.M. every day. He is very cute. In my free time, I often play with him. (Chị tôi có một con mèo. Tên của nó là Jerry. Cô ấy thường cho nó ăn lúc 5 giờ chiều hàng ngày. Nó rất dễ thương. Lúc rảnh rỗi tôi thường chơi với nó.)",
            "transcript": "My sister has a cat. His name is Jerry. She usually feeds him at 5.00 P.M. every day. He is very cute. In my free time, I often play with him.",
            "transcript_vi": "Chị tôi có một con mèo. Tên của nó là Jerry. Cô ấy thường cho nó ăn lúc 5 giờ chiều hàng ngày. Nó rất dễ thương. Lúc rảnh rỗi tôi thường chơi với nó."
        },
        {
            "id": "u30_q17",
            "q_no": 17,
            "part": 6,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.6)",
            "audio_track": "6.mp3",
            "stem": "My sister has a (1) ________. His name is Jerry. She usually (2) ________ him at 5.00 P.M. every day. He is very (3) ________. In my free time, I often (4) ________ with him.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "feeds",
            "explanation": "Đoạn nghe: She usually feeds him at 5.00 P.M. every day.",
            "transcript": "My sister has a cat. His name is Jerry. She usually feeds him at 5.00 P.M. every day. He is very cute. In my free time, I often play with him.",
            "transcript_vi": "Chị tôi có một con mèo. Tên của nó là Jerry. Cô ấy thường cho nó ăn lúc 5 giờ chiều hàng ngày. Nó rất dễ thương. Lúc rảnh rỗi tôi thường chơi với nó."
        },
        {
            "id": "u30_q18",
            "q_no": 18,
            "part": 6,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.6)",
            "audio_track": "6.mp3",
            "stem": "My sister has a (1) ________. His name is Jerry. She usually (2) ________ him at 5.00 P.M. every day. He is very (3) ________. In my free time, I often (4) ________ with him.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "cute",
            "explanation": "Đoạn nghe: He is very cute.",
            "transcript": "My sister has a cat. His name is Jerry. She usually feeds him at 5.00 P.M. every day. He is very cute. In my free time, I often play with him.",
            "transcript_vi": "Chị tôi có một con mèo. Tên của nó là Jerry. Cô ấy thường cho nó ăn lúc 5 giờ chiều hàng ngày. Nó rất dễ thương. Lúc rảnh rỗi tôi thường chơi với nó."
        },
        {
            "id": "u30_q19",
            "q_no": 19,
            "part": 6,
            "part_title": "Nghe đoạn văn sau đây và điền vào những từ còn thiếu. (mp3.6)",
            "audio_track": "6.mp3",
            "stem": "My sister has a (1) ________. His name is Jerry. She usually (2) ________ him at 5.00 P.M. every day. He is very (3) ________. In my free time, I often (4) ________ with him.",
            "blank_no": 4,
            "type": "FILL_IN_BLANK",
            "correct_answer": "play",
            "explanation": "Đoạn nghe: In my free time, I often play with him.",
            "transcript": "My sister has a cat. His name is Jerry. She usually feeds him at 5.00 P.M. every day. He is very cute. In my free time, I often play with him.",
            "transcript_vi": "Chị tôi có một con mèo. Tên của nó là Jerry. Cô ấy thường cho nó ăn lúc 5 giờ chiều hàng ngày. Nó rất dễ thương. Lúc rảnh rỗi tôi thường chơi với nó."
        }
    ]

    # ============================
    # UNIT 48 TESTS
    # ============================
    # 2 audio parts, total 15 questions
    u48_tests = [
        # Part 1: mp3.1 (David intro)
        {
            "id": "u48_q1",
            "q_no": 1,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "apartment",
            "explanation": "Đoạn nghe: I live in a small apartment in New York.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q2",
            "q_no": 2,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "doctors",
            "explanation": "Đoạn nghe: My parents are doctors.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q3",
            "q_no": 3,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "engineer",
            "explanation": "Đoạn nghe: I am an engineer.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q4",
            "q_no": 4,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 4,
            "type": "FILL_IN_BLANK",
            "correct_answer": "summer",
            "explanation": "Đoạn nghe: Our family often has a holiday together in the summer.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q5",
            "q_no": 5,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 5,
            "type": "FILL_IN_BLANK",
            "correct_answer": "fond",
            "explanation": "Đoạn nghe: I am fond of watching TV and playing games.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q6",
            "q_no": 6,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 6,
            "type": "FILL_IN_BLANK",
            "correct_answer": "cooking",
            "explanation": "Đoạn nghe: I also enjoy cooking.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        {
            "id": "u48_q7",
            "q_no": 7,
            "part": 1,
            "part_title": "Nghe đoạn giới thiệu bản thân sau và điền những từ còn thiếu vào chỗ trống. (mp3.1)",
            "audio_track": "1.mp3",
            "stem": "Hi, my name is David. I’m 25 years old and I am American. I live in a small (1) ________ in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are (2) ________. My sister is a tailor and I am an (3) ________. Our family often has a holiday together in the (4) ________. I am (5) ________ of watching TV and playing games. I also enjoy (6) ________. I am quite outgoing while my sister is (7) ________.",
            "blank_no": 7,
            "type": "FILL_IN_BLANK",
            "correct_answer": "introvert",
            "explanation": "Đoạn nghe: I am quite outgoing while my sister is introvert.",
            "transcript": "Hi, my name is David. I'm 25 years old and I am American. I live in a small apartment in New York. There are 4 people in my family: my father, my mother, my brother and me. My parents are doctors. My sister is a tailor and I am an engineer. Our family often has a holiday together in the summer. I am fond of watching TV and playing games. I also enjoy cooking. I am quite outgoing while my sister is introvert.",
            "transcript_vi": "Xin chào, tên tôi là David. Tôi 25 tuổi và tôi là người Mỹ. Tôi sống trong một căn hộ nhỏ ở New York. Gia đình tôi có 4 người: bố tôi, mẹ tôi, anh trai tôi và tôi. Bố mẹ tôi là bác sĩ. Chị gái tôi là thợ may còn tôi là kỹ sư. Gia đình chúng tôi thường có kỳ nghỉ cùng nhau vào mùa hè. Tôi thích xem TV và chơi game. Tôi cũng thích nấu ăn. Tôi khá hướng ngoại trong khi chị gái tôi lại hướng nội."
        },
        # Part 2: mp3.2 (Lucy presentation)
        {
            "id": "u48_q8",
            "q_no": 8,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 1,
            "type": "FILL_IN_BLANK",
            "correct_answer": "talk",
            "explanation": "Đoạn nghe: Today I'm going to talk about learning English.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q9",
            "q_no": 9,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 2,
            "type": "FILL_IN_BLANK",
            "correct_answer": "parts",
            "explanation": "Đoạn nghe: There are two parts in my presentation.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q10",
            "q_no": 10,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 3,
            "type": "FILL_IN_BLANK",
            "correct_answer": "Firstly",
            "explanation": "Đoạn nghe: Firstly, learning English is very important.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q11",
            "q_no": 11,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 4,
            "type": "FILL_IN_BLANK",
            "correct_answer": "different",
            "explanation": "Đoạn nghe: When we talk to a person from a different country, we must use English.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q12",
            "q_no": 12,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 5,
            "type": "FILL_IN_BLANK",
            "correct_answer": "feelings",
            "explanation": "Đoạn nghe: If our English is not good, it is very difficult to express our feelings and opinions.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q13",
            "q_no": 13,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 6,
            "type": "FILL_IN_BLANK",
            "correct_answer": "Secondly",
            "explanation": "Đoạn nghe: Secondly, what can we do if we want to improve our English?",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q14",
            "q_no": 14,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 7,
            "type": "FILL_IN_BLANK",
            "correct_answer": "listen",
            "explanation": "Đoạn nghe: Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        },
        {
            "id": "u48_q15",
            "q_no": 15,
            "part": 2,
            "part_title": "Nghe bài thuyết trình dưới đây và điền những từ còn thiếu vào chỗ trống. (mp3.2)",
            "audio_track": "2.mp3",
            "stem": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I’m going to (1) ________ about learning English. There are two (2) ________ in my presentation. (3) ________, learning English is very important. When we talk to a person from a (4) ________ country, we must use English. If our English is not good, it is very difficult to express our (5) ________ and opinions. (6) ________, what can we do if we want to improve our English? Well, we can (7) ________ to English podcasts, read news and books in English, and talk to our friends in English too. That’s all. Thank you for listening. If you have any (8) ________, I’ll be happy to answer them now.",
            "blank_no": 8,
            "type": "FILL_IN_BLANK",
            "correct_answer": "questions",
            "explanation": "Đoạn nghe: If you have any questions, I'll be happy to answer them now.",
            "transcript": "Good morning, everyone. My name is Lucy and I am a student at class B4. Today I'm going to talk about learning English. There are two parts in my presentation. Firstly, learning English is very important. When we talk to a person from a different country, we must use English. If our English is not good, it is very difficult to express our feelings and opinions. Secondly, what can we do if we want to improve our English? Well, we can listen to English podcasts, read news and books in English, and talk to our friends in English too. That's all. Thank you for listening. If you have any questions, I'll be happy to answer them now.",
            "transcript_vi": "Chào buổi sáng mọi người. Tên em là Lucy và em là học sinh lớp B4. Hôm nay em sẽ nói về việc học tiếng Anh. Có 2 phần trong bài trình bày của em. Đầu tiên, việc học tiếng Anh rất quan trọng. Khi chúng ta nói chuyện với một người đến từ một quốc gia khác, chúng ta phải sử dụng tiếng Anh. Nếu tiếng Anh của chúng ta không tốt thì rất khó để bày tỏ cảm xúc và quan điểm của mình. Thứ hai, chúng ta có thể làm gì nếu chúng ta muốn cải thiện tiếng Anh của mình? Chúng ta có thể nghe podcast bằng tiếng Anh, đọc tin tức và sách bằng tiếng Anh cũng như nói chuyện với bạn bè bằng tiếng Anh. Đó là tất cả những gì em muốn truyền đạt. Cảm ơn mọi người đã lắng nghe. Nếu có bất kỳ câu hỏi nào, em rất sẵn lòng trả lời ngay bây giờ."
        }
    ]

    # Update Unit 30
    if '30' in data:
        data['30']['unit_test'] = u30_tests
        data['30']['source_trace']['test_file'] = 'Bản sao của Bài thi online Luyện nghe chép chính tả.pdf'
        data['30']['source_trace']['answer_file'] = 'Bản sao của đáp án NGÀY 30. LUYỆN NGHE CHÉP CHÍNH TẢ        .pdf'
        print("Updated Unit 30:", len(u30_tests), "questions")

    # Update Unit 48
    if '48' in data:
        data['48']['unit_test'] = u48_tests
        data['48']['source_trace']['test_file'] = 'Bản sao của Bài thi Online Tự tin giới thiệu bản thân và thuyết trình bằng tiếng anh.pdf'
        data['48']['source_trace']['answer_file'] = 'Bản sao của đáp án NGÀY 48. TỰ TIN GIỚI THIỆU BẢN THÂN VÀ THUYẾT TRÌNH BẰNG TIẾNG ANH        .pdf'
        print("Updated Unit 48:", len(u48_tests), "questions")

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved all_units_data.json successfully!")

if __name__ == '__main__':
    run()
