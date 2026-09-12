import json

def run():
    with open('data/all_units_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Unit 21 Vocab: Luyện nghe số và tên
    u21_vocab = [
        {"id": "u21_v1", "word": "hundred", "ipa": "/ˈhʌndrəd/", "pos": "noun", "meaning": "trăm", "example": "There are one hundred people in the hall.", "translation": "Có một trăm người trong hội trường.", "source_page": 1},
        {"id": "u21_v2", "word": "thousand", "ipa": "/ˈθaʊznd/", "pos": "noun", "meaning": "nghìn, ngàn", "example": "It costs two thousand dollars.", "translation": "Nó có giá hai nghìn đô la.", "source_page": 1},
        {"id": "u21_v3", "word": "million", "ipa": "/ˈmɪljən/", "pos": "noun", "meaning": "triệu", "example": "Over five million people live in this city.", "translation": "Hơn năm triệu người sống ở thành phố này.", "source_page": 1},
        {"id": "u21_v4", "word": "billion", "ipa": "/ˈbɪljən/", "pos": "noun", "meaning": "tỷ", "example": "The world population is over eight billion.", "translation": "Dân số thế giới là hơn tám tỷ người.", "source_page": 1},
        {"id": "u21_v5", "word": "telephone number", "ipa": "/ˈtelɪfəʊn ˈnʌmbə(r)/", "pos": "noun", "meaning": "số điện thoại", "example": "What is your telephone number?", "translation": "Số điện thoại của bạn là gì?", "source_page": 2},
        {"id": "u21_v6", "word": "address", "ipa": "/əˈdres/", "pos": "noun", "meaning": "địa chỉ", "example": "Please write down your full address.", "translation": "Vui lòng viết lại địa chỉ đầy đủ của bạn.", "source_page": 2},
        {"id": "u21_v7", "word": "postcode", "ipa": "/ˈpəʊstkəʊd/", "pos": "noun", "meaning": "mã bưu điện / mã vùng", "example": "Remember to include the postcode on the envelope.", "translation": "Hãy nhớ điền mã bưu điện trên phong bì.", "source_page": 2},
        {"id": "u21_v8", "word": "first", "ipa": "/fɜːst/", "pos": "ordinal", "meaning": "thứ nhất, đầu tiên", "example": "She is the first person to arrive.", "translation": "Cô ấy là người đầu tiên đến.", "source_page": 2},
        {"id": "u21_v9", "word": "second", "ipa": "/ˈsekənd/", "pos": "ordinal", "meaning": "thứ hai", "example": "This is our second lesson.", "translation": "Đây là bài học thứ hai của chúng ta.", "source_page": 2},
        {"id": "u21_v10", "word": "third", "ipa": "/θɜːd/", "pos": "ordinal", "meaning": "thứ ba", "example": "He won the third prize in the competition.", "translation": "Anh ấy đạt giải ba trong cuộc thi.", "source_page": 2},
        {"id": "u21_v11", "word": "date of birth", "ipa": "/deɪt əv bɜːθ/", "pos": "noun", "meaning": "ngày sinh", "example": "Enter your date of birth in the form.", "translation": "Điền ngày sinh của bạn vào biểu mẫu.", "source_page": 3},
        {"id": "u21_v12", "word": "spell", "ipa": "/spel/", "pos": "verb", "meaning": "đánh vần", "example": "Could you please spell your surname?", "translation": "Bạn có thể vui lòng đánh vần họ của mình không?", "source_page": 3}
    ]

    # Unit 30 Vocab: Luyện nghe chép chính tả
    u30_vocab = [
        {"id": "u30_v1", "word": "friend", "ipa": "/frend/", "pos": "noun", "meaning": "bạn bè, người bạn", "example": "She is my best friend at school.", "translation": "Cô ấy là bạn thân nhất của tôi ở trường.", "source_page": 1},
        {"id": "u30_v2", "word": "badminton", "ipa": "/ˈbædmɪntən/", "pos": "noun", "meaning": "môn cầu lông", "example": "We often play badminton in the afternoon.", "translation": "Chúng tôi thường chơi cầu lông vào buổi chiều.", "source_page": 1},
        {"id": "u30_v3", "word": "volleyball", "ipa": "/ˈvɒlibɔːl/", "pos": "noun", "meaning": "bóng chuyền", "example": "She likes playing volleyball on the beach.", "translation": "Cô ấy thích chơi bóng chuyền trên bãi biển.", "source_page": 1},
        {"id": "u30_v4", "word": "football", "ipa": "/ˈfʊtbɔːl/", "pos": "noun", "meaning": "bóng đá", "example": "He loves watching football matches on Sunday.", "translation": "Anh ấy thích xem các trận bóng đá vào Chủ Nhật.", "source_page": 1},
        {"id": "u30_v5", "word": "teacher", "ipa": "/ˈtiːtʃə(r)/", "pos": "noun", "meaning": "giáo viên", "example": "Mr. Luke is an English teacher at a university.", "translation": "Thầy Luke là giáo viên tiếng Anh tại một trường đại học.", "source_page": 1},
        {"id": "u30_v6", "word": "university", "ipa": "/ˌjuːnɪˈvɜːsəti/", "pos": "noun", "meaning": "trường đại học", "example": "She studies medicine at the university.", "translation": "Cô ấy theo học ngành y tại trường đại học.", "source_page": 1},
        {"id": "u30_v7", "word": "shopping", "ipa": "/ˈʃɒpɪŋ/", "pos": "noun", "meaning": "việc mua sắm", "example": "In my free time, I often go shopping.", "translation": "Vào thời gian rảnh rỗi, tôi thường đi mua sắm.", "source_page": 1},
        {"id": "u30_v8", "word": "family", "ipa": "/ˈfæməli/", "pos": "noun", "meaning": "gia đình", "example": "There are five people in my family.", "translation": "Có năm người trong gia đình tôi.", "source_page": 1},
        {"id": "u30_v9", "word": "doctor", "ipa": "/ˈdɒktə(r)/", "pos": "noun", "meaning": "bác sĩ", "example": "Both of her parents are doctors in this hospital.", "translation": "Cả bố mẹ cô ấy đều là bác sĩ ở bệnh viện này.", "source_page": 1},
        {"id": "u30_v10", "word": "student", "ipa": "/ˈstjuːdnt/", "pos": "noun", "meaning": "học sinh, sinh viên", "example": "He is a second-year student in college.", "translation": "Cậu ấy là sinh viên năm thứ hai đại học.", "source_page": 1},
        {"id": "u30_v11", "word": "dinner", "ipa": "/ˈdɪnə(r)/", "pos": "noun", "meaning": "bữa tối", "example": "We have dinner together at 7 P.M.", "translation": "Chúng tôi ăn tối cùng nhau lúc 7 giờ tối.", "source_page": 1},
        {"id": "u30_v12", "word": "cheap", "ipa": "/tʃiːp/", "pos": "adj", "meaning": "rẻ, không đắt", "example": "The car is quite cheap and reliable.", "translation": "Chiếc xe khá rẻ và đáng tin cậy.", "source_page": 1},
        {"id": "u30_v13", "word": "cute", "ipa": "/kjuːt/", "pos": "adj", "meaning": "dễ thương, xinh xắn", "example": "My sister has a very cute cat named Jerry.", "translation": "Chị gái tôi có một chú mèo rất dễ thương tên là Jerry.", "source_page": 1},
        {"id": "u30_v14", "word": "feed", "ipa": "/fiːd/", "pos": "verb", "meaning": "cho ăn", "example": "She usually feeds her pet at 5 P.M.", "translation": "Cô ấy thường cho thú cưng ăn lúc 5 giờ chiều.", "source_page": 1}
    ]

    data['21']['vocabulary'] = u21_vocab
    data['30']['vocabulary'] = u30_vocab

    with open('data/all_units_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Enriched Unit 21 and Unit 30 vocab!")

if __name__ == '__main__':
    run()
