# -*- coding: utf-8 -*-
"""
build_complete_authoritative_theory_db.py
=========================================
Builds and cleans the 100% authoritative Ground Truth Database for all in-theory exercises.
- Fixes Unit 9 (He sings beautifully, She is a great teacher...)
- Fixes Unit 35 (Reflexive pronouns: himself, herself, myself, etc.)
- Fixes Unit 33 (Listening dialogues & locations)
- Fixes Unit 19 (Word stress)
- Fixes all 36 items with `{stem}` with authentic Vietnamese translations.
- Converts all Markdown (**...**, *...*, $\implies$) to clean, elegant HTML.
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
THEORY_FILE = os.path.join(DATA_DIR, "theory_quizzes_data.json")

with open(THEORY_FILE, "r", encoding="utf-8") as f:
    db = json.load(f)

print(f"Initial items in database: {len(db)}")

def clean_format(text):
    if not text:
        return ""
    t = str(text)
    t = t.replace(r"$\implies$", "➜").replace(r"$\rightarrow$", "➜").replace(r"\rightarrow", "➜").replace(r"\implies", "➜")
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", t)
    return t

stem_translations = {
    'tq_4_1_2': 'Họ đang ở đâu? – Họ đang ở sân bay.',
    'tq_4_2_0': 'Khi nào lớp học toán diễn ra? – Vào lúc 9 giờ sáng.',
    'tq_4_2_2': 'Quần bò của tôi ở đâu? – Chúng ở trong tủ quần áo.',
    'tq_4_2_5': 'Cái gối của cô ấy ở đâu? – Nó ở trên sàn nhà.',
    'tq_4_2_7': 'Họ đang ở đâu? – Họ đang ở siêu thị.',
    'tq_4_2_11': 'Những chiếc mũ của bạn ở đâu? – Chúng ở trên bàn.',
    'tq_4_2_12': 'Những chiếc tất của anh ấy ở đâu? – Chúng ở trên sàn nhà.',
    'tq_4_2_13': 'Mẹ của bạn ở đâu? – Bà ấy đang ở trong trung tâm mua sắm.',
    'tq_4_2_14': 'Các anh em họ của cậu ấy ở đâu? – Họ đang ở nhà ga xe lửa.',
    'tq_5_1_3': 'Anh ấy có hai người anh em trai.',
    'tq_5_2_7': 'Bà của tôi có một chú chó lớn.',
    'tq_6_1_0': 'Luke không sống cùng bố mẹ cậu ấy.',
    'tq_6_3_0': 'John không thích bơi lội.',
    'tq_6_3_2': 'Con trai tôi không thức dậy lúc 6 giờ 30.',
    'tq_26_2_0': 'Nếu ngày mai trời mưa, chúng tôi sẽ không ra ngoài.',
    'tq_26_2_6': 'Tôi sẽ mang theo ô phòng trường hợp trời mưa.',
    'tq_27_1_0': 'Nếu anh ấy không bị ốm, anh ấy đã tham dự cuộc họp.',
    'tq_27_2_11': 'Nếu cậu ấy không bị ốm, cậu ấy đã có thể đến trường.',
    'tq_27_2_14': 'Nếu trời không lạnh, chúng tôi đã ra ngoài chơi.',
    'tq_38_1_0': 'Hoặc bạn hoặc tôi phải đi.',
    'tq_38_1_1': 'Cả Sam và Linda đều bị muộn.',
    'tq_38_1_2': 'Cô ấy không những xinh đẹp mà còn thân thiện.',
    'tq_38_1_3': 'Căn hộ của họ không lớn cũng không nhỏ.',
    'tq_38_2_0': 'Cả David lẫn Phillips đều không giành được huy chương vàng.',
    'tq_38_2_1': 'Anh ấy có thể nói lưu loát cả tiếng Anh và tiếng Trung.',
    'tq_38_2_2': 'Chúng ta có thể ăn ở nhà hoặc ra ngoài ăn.',
    'tq_38_2_4': 'Bạn có thể uống trà sữa hoặc nước cam.',
    'tq_38_2_5': 'Họ không những dọn dẹp nhà bếp mà còn cắt cỏ.',
    'tq_38_2_7': 'Khu vườn không những rộng mà còn rực rỡ sắc màu.',
    'tq_38_2_8': 'Cả Tom và Martin đều diễn xuất rất tốt.',
    'tq_38_2_9': 'Cuốn tiểu thuyết không những dài mà còn nhàm chán.',
    'tq_38_2_10': 'Cậu ấy có thể chọn chiếc cốc màu vàng hoặc chiếc cốc màu trắng.',
    'tq_38_2_11': 'Bố tôi không thích cà phê cũng không thích trà.',
    'tq_38_2_12': 'Cả Mark lẫn Mike đều không thể đọc rõ từ này.',
    'tq_38_2_13': 'Xe của anh ấy vừa đẹp lại vừa đắt tiền.',
    'tq_38_2_14': 'Tim không những tốt bụng mà còn rất thân thiện.'
}

# Clean existing items
for k, v in db.items():
    expl = v.get('explanation', '')
    if '{stem}' in expl:
        vn = stem_translations.get(k, '')
        if not vn:
            vn = v.get('stem', '')
        expl = expl.replace('*{stem}*', f'<em>{vn}</em>').replace('{stem}', vn)
    v['explanation'] = clean_format(expl)

# 3. UNIT 9 ITEMS
u9_items = {
    'tq_9_1_0': {
        'unit': 9,
        'quizId': 'tq_9_1',
        'idx': 0,
        'num': 1,
        'type': 'CHOICE',
        'stem': 'He sings ________.',
        'options': [{'key': 'A', 'text': 'beautiful'}, {'key': 'B', 'text': 'beautifully'}],
        'correct_key': 'B',
        'correct_text': 'beautifully',
        'explanation': '📌 <strong>Trạng từ bổ nghĩa cho động từ</strong>: Sau động từ thường "sings", ta dùng trạng từ chỉ cách thức <strong>beautifully</strong> để bổ nghĩa cho động từ đó.<br>📖 <strong>Dịch nghĩa</strong>: <em>Anh ấy hát rất hay (đầy truyền cảm).</em><br>💡 "beautiful" là tính từ, chỉ đứng trước danh từ hoặc sau to be/linking verbs.'
    },
    'tq_9_1_1': {
        'unit': 9,
        'quizId': 'tq_9_1',
        'idx': 1,
        'num': 2,
        'type': 'CHOICE',
        'stem': 'She is a great _______.',
        'options': [{'key': 'A', 'text': 'teacher'}, {'key': 'B', 'text': 'teach'}],
        'correct_key': 'A',
        'correct_text': 'teacher',
        'explanation': '📌 <strong>Cụm danh từ (Noun phrase)</strong>: Cấu trúc mạo từ (a) + tính từ (great) + danh từ (<strong>teacher</strong>).<br>📖 <strong>Dịch nghĩa</strong>: <em>Cô ấy là một giáo viên tuyệt vời.</em><br>💡 "teach" là động từ (dạy học).'
    },
    'tq_9_1_2': {
        'unit': 9,
        'quizId': 'tq_9_1',
        'idx': 2,
        'num': 3,
        'type': 'CHOICE',
        'stem': 'My students are _______.',
        'options': [{'key': 'A', 'text': 'friendly'}, {'key': 'B', 'text': 'friend'}],
        'correct_key': 'A',
        'correct_text': 'friendly',
        'explanation': '📌 <strong>Tính từ sau To Be</strong>: Động từ "are" cần một tính từ theo sau đóng vai trò vị ngữ miêu tả đặc điểm. <strong>friendly</strong> là tính từ (thân thiện).<br>📖 <strong>Dịch nghĩa</strong>: <em>Học sinh của tôi rất thân thiện.</em><br>💡 "friend" là danh từ (người bạn).'
    },
    'tq_9_1_3': {
        'unit': 9,
        'quizId': 'tq_9_1',
        'idx': 3,
        'num': 4,
        'type': 'CHOICE',
        'stem': 'This homework is _______.',
        'options': [{'key': 'A', 'text': 'easily'}, {'key': 'B', 'text': 'easy'}],
        'correct_key': 'B',
        'correct_text': 'easy',
        'explanation': '📌 <strong>Tính từ sau To Be</strong>: Sau động từ to be "is", ta dùng tính từ <strong>easy</strong> (dễ dàng) để đóng vai trò vị ngữ.<br>📖 <strong>Dịch nghĩa</strong>: <em>Bài tập về nhà này rất dễ.</em><br>💡 "easily" là trạng từ chỉ cách thức.'
    }
}

u9_practice = [
    ('1. Her mother is happy.', 'Her (Tính từ sở hữu) - mother (Danh từ) - is (Động từ to be) - happy (Tính từ)', 'Mẹ của cô ấy rất vui vẻ.'),
    ('2. They have a lovely flat.', 'They (Đại từ) - have (Động từ thường) - a (Mạo từ) - lovely (Tính từ) - flat (Danh từ)', 'Họ có một căn hộ đáng yêu.'),
    ('3. He drives carefully.', 'He (Đại từ) - drives (Động từ thường) - carefully (Trạng từ)', 'Anh ấy lái xe cẩn thận.'),
    ('4. The book is very great.', 'The (Mạo từ) - book (Danh từ) - is (Động từ to be) - very (Trạng từ chỉ mức độ) - great (Tính từ)', 'Cuốn sách rất tuyệt vời.'),
    ('5. The weather is nice.', 'The (Mạo từ) - weather (Danh từ) - is (Động từ to be) - nice (Tính từ)', 'Thời tiết rất đẹp.'),
    ('6. His room is tidy.', 'His (Tính từ sở hữu) - room (Danh từ) - is (Động từ to be) - tidy (Tính từ)', 'Căn phòng của anh ấy rất gọn gàng.'),
    ('7. He sings well.', 'He (Đại từ) - sings (Động từ thường) - well (Trạng từ)', 'Anh ấy hát rất hay.'),
    ('8. The homework is easy.', 'The (Mạo từ) - homework (Danh từ) - is (Động từ to be) - easy (Tính từ)', 'Bài tập về nhà rất dễ.'),
    ('9. Her daughter is careless.', 'Her (Tính từ sở hữu) - daughter (Danh từ) - is (Động từ to be) - careless (Tính từ)', 'Con gái cô ấy rất bất cẩn.'),
    ('10. The boy is quite active.', 'The (Mạo từ) - boy (Danh từ) - is (Động từ to be) - quite (Trạng từ chỉ mức độ) - active (Tính từ)', 'Cậu bé khá năng động.')
]

for idx, (st, ans, vn) in enumerate(u9_practice):
    k = f'tq_9_2_{idx}'
    u9_items[k] = {
        'unit': 9,
        'quizId': 'tq_9_2',
        'idx': idx,
        'num': idx + 1,
        'type': 'INPUT',
        'stem': st,
        'options': [],
        'correct_text': ans,
        'acceptable_variants': [ans, ans.lower(), ans.replace(' - ', ' | ')],
        'explanation': f'📌 <strong>Phân tích từ loại</strong>: {ans}.<br>📖 <strong>Dịch nghĩa</strong>: <em>{vn}</em>'
    }

for k, v in u9_items.items():
    db[k] = v

# 4. UNIT 35 ITEMS
u35_quiz1 = [
    ('1. He hurt ______.', [{'key': 'A', 'text': 'himself'}, {'key': 'B', 'text': 'themselves'}], 'A', 'himself', 'Chủ ngữ ngôi thứ 3 số ít "He" ➜ đại từ phản thân tương ứng là <strong>himself</strong>.', 'Anh ấy tự làm đau chính mình.'),
    ('2. She cut _______.', [{'key': 'A', 'text': 'yourself'}, {'key': 'B', 'text': 'herself'}], 'B', 'herself', 'Chủ ngữ ngôi thứ 3 số ít "She" ➜ đại từ phản thân tương ứng là <strong>herself</strong>.', 'Cô ấy tự làm đứt tay mình.'),
    ('3. He drives to work by _______.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'himself'}], 'B', 'himself', 'Cụm "by + đại từ phản thân" mang nghĩa tự mình làm. Chủ ngữ "He" ➜ <strong>by himself</strong>.', 'Anh ấy tự lái xe đi làm một mình.'),
    ('4. I washed the dishes by _______.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'yourself'}], 'A', 'myself', 'Chủ ngữ ngôi thứ nhất "I" ➜ đại từ phản thân tương ứng là <strong>myself</strong>.', 'Tôi đã tự rửa bát đĩa một mình.')
]

for idx, (st, opts, ck, ct, expl, vn) in enumerate(u35_quiz1):
    k = f'tq_35_1_{idx}'
    db[k] = {
        'unit': 35,
        'quizId': 'tq_35_1',
        'idx': idx,
        'num': idx + 1,
        'type': 'CHOICE',
        'stem': st,
        'options': opts,
        'correct_key': ck,
        'correct_text': ct,
        'explanation': f'📌 <strong>Đại từ phản thân</strong>: {expl}<br>📖 <strong>Dịch nghĩa</strong>: <em>{vn}</em>'
    }

u35_practice = [
    ('1. They cleaned the bathroom by ______.', [{'key': 'A', 'text': 'themselves'}, {'key': 'B', 'text': 'himself'}], 'A', 'themselves', 'Chủ ngữ "They" (họ) ➜ dùng <strong>themselves</strong>.', 'Họ đã tự mình dọn dẹp phòng tắm.'),
    ('2. He hurt ______ when he was playing football.', [{'key': 'A', 'text': 'himself'}, {'key': 'B', 'text': 'yourself'}], 'A', 'himself', 'Chủ ngữ "He" (anh ấy) ➜ dùng <strong>himself</strong>.', 'Cậu ấy tự làm mình bị thương khi đang chơi bóng đá.'),
    ('3. He lives by ______ in a big house.', [{'key': 'A', 'text': 'herself'}, {'key': 'B', 'text': 'himself'}], 'B', 'himself', 'Chủ ngữ "He" ➜ cụm "by himself" nghĩa là sống một mình.', 'Ông ấy sống một mình trong một ngôi nhà lớn.'),
    ('4. My daughter is 4 years old. She can dress by ______.', [{'key': 'A', 'text': 'herself'}, {'key': 'B', 'text': 'myself'}], 'A', 'herself', 'Chủ ngữ "She" (con gái tôi) ➜ dùng <strong>herself</strong>.', 'Con gái tôi 4 tuổi. Bé có thể tự mặc quần áo một mình.'),
    ('5. I made ______ a lovely cake.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'yourself'}], 'A', 'myself', 'Chủ ngữ "I" ➜ dùng <strong>myself</strong> (tôi tự làm cho chính mình).', 'Tôi đã tự làm cho mình một chiếc bánh ngọt rất đẹp.'),
    ('6. They blame _______.', [{'key': 'A', 'text': 'themselves'}, {'key': 'B', 'text': 'yourself'}], 'A', 'themselves', 'Chủ ngữ "They" (họ) ➜ dùng <strong>themselves</strong> (tự trách bản thân họ).', 'Họ tự trách bản thân mình.'),
    ('7. The software will install _______.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'itself'}], 'B', 'itself', 'Chủ ngữ chỉ sự vật "The software" (phần mềm) ➜ dùng <strong>itself</strong>.', 'Phần mềm sẽ tự động cài đặt.'),
    ('8. We bought _______ a pizza.', [{'key': 'A', 'text': 'ourselves'}, {'key': 'B', 'text': 'himself'}], 'A', 'ourselves', 'Chủ ngữ "We" (chúng tôi) ➜ dùng <strong>ourselves</strong>.', 'Chúng tôi đã tự mua cho mình một chiếc bánh pizza.'),
    ('9. They prepared the meal by _______.', [{'key': 'A', 'text': 'himself'}, {'key': 'B', 'text': 'themselves'}], 'B', 'themselves', 'Chủ ngữ "They" ➜ cụm "by themselves" (tự tay họ chuẩn bị).', 'Họ đã tự mình chuẩn bị bữa ăn.'),
    ('10. I will introduce ________.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'herself'}], 'A', 'myself', 'Chủ ngữ "I" ➜ dùng <strong>myself</strong> (tự giới thiệu bản thân tôi).', 'Tôi sẽ tự giới thiệu về bản thân mình.'),
    ('11. My son washed the apples by _______.', [{'key': 'A', 'text': 'yourselves'}, {'key': 'B', 'text': 'himself'}], 'B', 'himself', 'Chủ ngữ "My son" (con trai tôi - ngôi 3 số ít) ➜ dùng <strong>himself</strong>.', 'Con trai tôi đã tự mình rửa những quả táo.'),
    ('12. They are enjoying ______ in Da Nang.', [{'key': 'A', 'text': 'themselves'}, {'key': 'B', 'text': 'yourselves'}], 'A', 'themselves', 'Cụm "enjoy oneself" (tận hưởng kỳ nghỉ). Chủ ngữ "They" ➜ <strong>enjoying themselves</strong>.', 'Họ đang tận hưởng kỳ nghỉ vui vẻ tại Đà Nẵng.'),
    ('13. John teaches ______ English.', [{'key': 'A', 'text': 'himself'}, {'key': 'B', 'text': 'itself'}], 'A', 'himself', 'Chủ ngữ "John" ➜ cụm "teach oneself" nghĩa là tự học ➜ <strong>himself</strong>.', 'John tự học tiếng Anh một mình.'),
    ('14. Her daughter cycles to school by _______.', [{'key': 'A', 'text': 'herself'}, {'key': 'B', 'text': 'myself'}], 'A', 'herself', 'Chủ ngữ "Her daughter" (con gái bà ấy) ➜ dùng <strong>herself</strong>.', 'Con gái cô ấy tự đạp xe đến trường một mình.'),
    ('15. He moved this box by______.', [{'key': 'A', 'text': 'myself'}, {'key': 'B', 'text': 'himself'}], 'B', 'himself', 'Chủ ngữ "He" ➜ dùng <strong>himself</strong>.', 'Anh ấy đã tự mình khiêng chiếc hộp này.')
]

for idx, (st, opts, ck, ct, expl, vn) in enumerate(u35_practice):
    k = f'tq_35_2_{idx}'
    db[k] = {
        'unit': 35,
        'quizId': 'tq_35_2',
        'idx': idx,
        'num': idx + 1,
        'type': 'CHOICE',
        'stem': st,
        'options': opts,
        'correct_key': ck,
        'correct_text': ct,
        'explanation': f'📌 <strong>Đại từ phản thân</strong>: {expl}<br>📖 <strong>Dịch nghĩa</strong>: <em>{vn}</em>'
    }

# 5. UNIT 33 LISTENING ITEMS
u33_items = [
    ('tq_33_1_0', 33, 'tq_33_1', 0, 1, 'Where is John?', [{'key': 'A', 'text': 'At the cinema'}, {'key': 'B', 'text': 'At the library'}], 'B', 'At the library', 'Theo Audio Script: Man: Where is John? - Woman: He’s at the library.', 'John đang ở đâu? – Cậu ấy đang ở thư viện.'),
    ('tq_33_1_1', 33, 'tq_33_1', 1, 2, 'Where is the woman going?', [{'key': 'A', 'text': 'To the book shop'}, {'key': 'B', 'text': 'To the pharmacy'}], 'A', 'To the book shop', 'Theo Audio Script: Man: Where are you going? - Woman: I’m going to the book shop.', 'Người phụ nữ đang đi đâu? – Tôi đang đi tới hiệu sách.'),
    ('tq_33_1_2', 33, 'tq_33_1', 2, 3, 'Where was Linda last night?', [{'key': 'A', 'text': 'At the museum'}, {'key': 'B', 'text': 'At the restaurant'}], 'B', 'At the restaurant', 'Theo Audio Script: Boy: Where was Linda last night? - Girl: She was at the restaurant.', 'Tối qua Linda ở đâu? – Cô ấy ở nhà hàng.'),
    ('tq_33_2_0', 33, 'tq_33_2', 0, 1, 'Where did they meet?', [{'key': 'A', 'text': 'At the post office'}, {'key': 'B', 'text': 'At the cinema'}], 'B', 'At the cinema', 'Theo Audio Script: Man: Where did they meet? - Woman: At the cinema.', 'Họ đã gặp nhau ở đâu? – Ở rạp chiếu phim.'),
    ('tq_33_2_1', 33, 'tq_33_2', 1, 2, 'Where is David cycling?', [{'key': 'A', 'text': 'To the library'}, {'key': 'B', 'text': 'To the gallery'}], 'B', 'To the gallery', 'Theo Audio Script: Boy: He’s cycling to the gallery.', 'David đang đạp xe tới đâu? – Cậu ấy đang đạp xe tới phòng triển lãm.'),
    ('tq_33_2_2', 33, 'tq_33_2', 2, 3, 'Where did Tom see the tiger?', [{'key': 'A', 'text': 'On TV'}, {'key': 'B', 'text': 'At the zoo'}], 'A', 'On TV', 'Theo Audio Script: Woman: Where did Tom see the tiger? - Man: On TV.', 'Tom nhìn thấy con hổ ở đâu? – Trên TV.'),
    ('tq_33_3_0', 33, 'tq_33_3', 0, 1, 'Where were they last week?', [{'key': 'A', 'text': 'At the post office'}, {'key': 'B', 'text': 'At the police station'}], 'B', 'At the police station', 'Theo Audio Script: Girl: They were at the police station.', 'Tuần trước họ ở đâu? – Họ ở sở cảnh sát.'),
    ('tq_33_3_1', 33, 'tq_33_3', 1, 2, 'Where did Phillips see the elephant?', [{'key': 'A', 'text': 'At the zoo'}, {'key': 'B', 'text': 'At the circus'}], 'A', 'At the zoo', 'Theo Audio Script: Boy: He saw it at the zoo.', 'Phillips nhìn thấy con voi ở đâu? – Cậu ấy thấy ở sở thú.'),
    ('tq_33_3_2', 33, 'tq_33_3', 2, 3, 'Where is Tim?', [{'key': 'A', 'text': 'At the pharmacy'}, {'key': 'B', 'text': 'At the hospital'}], 'A', 'At the pharmacy', 'Theo Audio Script: Boy: He’s at the pharmacy.', 'Tim đang ở đâu? – Cậu ấy đang ở hiệu thuốc.'),
    ('tq_33_6_0', 33, 'tq_33_6', 0, 1, 'Where is Sally?', [{'key': 'A', 'text': 'At the bank'}, {'key': 'B', 'text': 'At the supermarket'}], 'A', 'At the bank', 'Theo Audio Script: Girl: She has gone to the bank.', 'Sally đang ở đâu? – Cô ấy vừa mới đi ra ngân hàng.'),
    ('tq_33_6_1', 33, 'tq_33_6', 1, 2, 'Where is Betty?', [{'key': 'A', 'text': 'At the museum'}, {'key': 'B', 'text': 'At the post office'}], 'B', 'At the post office', 'Theo Audio Script: Boy: She’s at the post office now.', 'Betty đang ở đâu? – Chị ấy đang ở bưu điện.'),
    ('tq_33_6_2', 33, 'tq_33_6', 2, 3, 'Where is Victoria?', [{'key': 'A', 'text': 'At the restaurant'}, {'key': 'B', 'text': 'At the zoo'}], 'A', 'At the restaurant', 'Theo Audio Script: She is having dinner at the restaurant.', 'Victoria đang ở đâu? – Cô ấy đang ở nhà hàng.')
]

for k, uid, qz, idx, num, st, opts, ck, ct, expl, vn in u33_items:
    db[k] = {
        'unit': uid,
        'quizId': qz,
        'idx': idx,
        'num': num,
        'type': 'CHOICE',
        'stem': st,
        'options': opts,
        'correct_key': ck,
        'correct_text': ct,
        'explanation': f'🎧 <strong>Phân tích bài nghe</strong>: {expl}<br>📖 <strong>Dịch nghĩa</strong>: <em>{vn}</em>'
    }

# 6. UNIT 19 STRESS ITEMS
u19_stresses = [
    (1, 'meeting /ˈmiːtɪŋ/', '1', 'meeting là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈmiːtɪŋ/.'),
    (2, 'answer /ˈɑːnsə(r)/', '1', 'answer là danh từ/động từ có trọng âm rơi vào âm tiết thứ 1: /ˈɑːnsə(r)/.'),
    (3, 'attend /əˈtend/', '2', 'attend là động từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 2: /əˈtend/.'),
    (4, 'finish /ˈfɪnɪʃ/', '1', 'finish là động từ có đuôi -ish, trọng âm rơi vào âm tiết thứ 1: /ˈfɪnɪʃ/.'),
    (5, 'window /ˈwɪndəʊ/', '1', 'window là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈwɪndəʊ/.'),
    (6, 'summer /ˈsʌmə(r)/', '1', 'summer là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈsʌmə(r)/.'),
    (7, 'flower /ˈflaʊə(r)/', '1', 'flower là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈflaʊə(r)/.'),
    (8, 'weather /ˈweðə(r)/', '1', 'weather là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈweðə(r)/.'),
    (9, 'movie /ˈmuːvi/', '1', 'movie là danh từ 2 âm tiết, trọng âm rơi vào âm tiết thứ 1: /ˈmuːvi/.'),
    (10, 'open /ˈəʊpən/', '1', 'open là động từ/tính từ 2 âm tiết có âm tiết thứ 2 là /ən/ nhẹ, trọng âm rơi vào âm 1: /ˈəʊpən/.')
]

for num, st, ans, expl in u19_stresses:
    idx = num - 1
    k = f'tq_19_1_{idx}'
    db[k] = {
        'unit': 19,
        'quizId': 'tq_19_1',
        'idx': idx,
        'num': num,
        'type': 'INPUT',
        'stem': st,
        'options': [],
        'correct_text': ans,
        'acceptable_variants': [ans, f'âm tiết {ans}', f'âm {ans}'],
        'explanation': f'🗣️ <strong>Quy tắc trọng âm</strong>: {expl}'
    }

with open(THEORY_FILE, 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print(f"Enriched database saved successfully! Total items: {len(db)}")
