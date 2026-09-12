export interface Translations {
  nav: {
    about: string;
    curriculum: string;
    features: string;
    verbs: string;
    exam: string;
    testimonials: string;
    faq: string;
    startLearning: string;
    switchLang: string;
  };
  hero: {
    badge: string;
    headlineStart: string;
    headlineGradient: string;
    headlineEnd: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      units: string;
      unitsLabel: string;
      questions: string;
      questionsLabel: string;
      verbs: string;
      verbsLabel: string;
      guarantee: string;
      guaranteeLabel: string;
    };
  };
  problem: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
      tag: string;
    }[];
  };
  solution: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      title: string;
      desc: string;
      highlight: string;
    }[];
  };
  curriculum: {
    badge: string;
    title: string;
    subtitle: string;
    stages: {
      stage: number;
      name: string;
      range: string;
      desc: string;
      unitsSample: string[];
    }[];
  };
  verbStudio: {
    badge: string;
    title: string;
    subtitle: string;
    flashcardTitle: string;
    flipHint: string;
    listenPronunciation: string;
    nextVerb: string;
    prevVerb: string;
    quizTitle: string;
  };
  examEngine: {
    badge: string;
    title: string;
    subtitle: string;
    features: {
      title: string;
      desc: string;
    }[];
  };
  workflow: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      desc: string;
    }[];
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      quote: string;
      author: string;
      role: string;
      result: string;
    }[];
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    button: string;
    guarantee: string;
  };
  footer: {
    brandDesc: string;
    linksTitle: string;
    curriculumTitle: string;
    contactTitle: string;
    copyright: string;
  };
}

export const translations: Record<"vi" | "en", Translations> = {
  vi: {
    nav: {
      about: "Phương Pháp",
      curriculum: "Lộ Trình 48 Ngày",
      features: "Tính Năng",
      verbs: "Động Từ Bất Quy Tắc",
      exam: "Bộ Đề Thi",
      testimonials: "Học Viên",
      faq: "Hỏi Đáp",
      startLearning: "Vào Phòng Học Ngay",
      switchLang: "English",
    },
    hero: {
      badge: "KHÓA HỌC 48 NGÀY LẤY LẠI GỐC TIẾNG ANH TOÀN DIỆN",
      headlineStart: "Bứt Phá Tiếng Anh Trong",
      headlineGradient: "48 Ngày Thực Chiến",
      headlineEnd: "Chuẩn Quốc Tế",
      subheadline:
        "Nền tảng học trực tuyến tự động hóa thông minh: 48 Video bài giảng, Lý thuyết phân tích cấu trúc, 2.000+ câu trắc nghiệm có giải thích chi tiết từng đáp án và Flashcards 398+ động từ bất quy tắc kèm Audio phát âm bản xứ.",
      ctaPrimary: "Bắt Đầu Học Ngay (Miễn Phí)",
      ctaSecondary: "Khám Phá Lộ Trình 48 Units",
      stats: {
        units: "48",
        unitsLabel: "Units Bài Học Từng Ngày",
        questions: "2.000+",
        questionsLabel: "Câu Trắc Nghiệm Có Giải Thích",
        verbs: "398+",
        verbsLabel: "Động Từ Bất Quy Tắc Kèm Audio",
        guarantee: "100%",
        guaranteeLabel: "Lấy Lại Nền Tảng Vững Chắc",
      },
    },
    problem: {
      badge: "RÀO CẢN THƯỜNG GẶP",
      title: "Tại Sao Bạn Học Mãi Vẫn Chưa Nắm Vững Tiếng Anh?",
      subtitle:
        "Hầu hết người mất gốc tiếng Anh đều gặp phải những vòng lặp bế tắc sau đây:",
      items: [
        {
          title: "Mất Gốc Không Biết Bắt Đầu Từ Đâu",
          desc: "Kiến thức ngữ pháp rời rạc, không có lộ trình chia nhỏ theo từng ngày cụ thể khiến bạn dễ choáng ngợp.",
          tag: "Thiếu Lộ Trình",
        },
        {
          title: "Học Vẹt Ngữ Pháp Không Ứng Dụng Được",
          desc: "Chỉ đọc lý thuyết xuông mà không được làm bài tập trắc nghiệm phản xạ ngay lập tức.",
          tag: "Học Thụ Động",
        },
        {
          title: "Làm Sai Nhưng Không Biết Vì Sao Sai",
          desc: "Đa số tài liệu chỉ cho đáp án A/B/C/D mà không có phần phân tích nguyên nhân ngữ pháp vì sao đúng/sai.",
          tag: "Không Có Giải Thích",
        },
        {
          title: "Hay Quên Động Từ Bất Quy Tắc Khi Chia Thì",
          desc: "Gặp khó khăn khi tra cứu V1, V2, V3 và không biết phát âm chuẩn xác từng từ.",
          tag: "Quên Động Từ",
        },
        {
          title: "Thiếu Công Cụ Tự Đánh Giá Tiến Độ",
          desc: "Không biết mình đã nắm được bao nhiêu %, điểm yếu ở Unit nào để ôn luyện lại kịp thời.",
          tag: "Mất Kiểm Soát",
        },
        {
          title: "Nản Chí Bỏ Cuộc Giữa Chừng",
          desc: "Không có hệ thống quản lý học tập khoa học nhắc nhở mục tiêu hoàn thành mỗi ngày.",
          tag: "Thiếu Động Lực",
        },
      ],
    },
    solution: {
      badge: "PHƯƠNG PHÁP SMOB ENGLISH LAB",
      title: "Hệ Thống 4 Trụ Cột Đột Phá Giúp Bạn Làm Chủ Trong 48 Ngày",
      subtitle:
        "Phương pháp học tập khoa học được tích hợp hoàn chỉnh trong một nền tảng duy nhất:",
      pillars: [
        {
          title: "1. Video Bài Giảng Trực Quan",
          desc: "Mỗi Unit bắt đầu bằng video bài giảng súc tích, giải thích cốt lõi bản chất ngữ pháp dễ hiểu chỉ trong 15-20 phút.",
          highlight: "Học Nhanh - Nhớ Lâu",
        },
        {
          title: "2. Bản Đồ Lý Thuyết & Cấu Trúc Ngữ Pháp",
          desc: "Bảng tóm tắt công thức chuẩn mực, ví dụ song ngữ Anh - Việt thực tế và các lưu ý tránh bẫy ngữ pháp.",
          highlight: "Cấu Trúc Chuẩn Hóa",
        },
        {
          title: "3. Bộ Máy Thi Trắc Nghiệm & Giải Thích Chi Tiết",
          desc: "Luyện tập 20-50 câu trắc nghiệm mỗi Unit, tự động chấm điểm tức thì và hiển thị lời giải chi tiết từng phương án.",
          highlight: "Chấm Điểm & Phân Tích",
        },
        {
          title: "4. Flashcards 398+ Động Từ Kèm Audio TTS",
          desc: "Luyện nhớ V1, V2, V3 với hiệu ứng lật thẻ 3D, âm thanh giọng đọc chuẩn bản xứ và chế độ kiểm tra Quizlet phản xạ.",
          highlight: "Audio Bản Xứ Chuẩn",
        },
      ],
    },
    curriculum: {
      badge: "LỘ TRÌNH 48 NGÀY TOÀN DIỆN",
      title: "Hành Trình 48 Units Được Thiết Kế Khoa Học",
      subtitle:
        "Từ người mất gốc đến người tự tin sử dụng ngữ pháp và cấu trúc câu thành thạo:",
      stages: [
        {
          stage: 1,
          name: "Giai Đoạn 1: Nền Tảng Cốt Lõi (Unit 1 - 10)",
          range: "Ngày 01 - 10",
          desc: "Làm chủ động từ To Be, đại từ nhân xưng, tính từ sở hữu, câu hỏi Who/What/Where và cấu trúc câu cơ bản.",
          unitsSample: [
            "Unit 1: Thể khẳng định & phủ định với To Be",
            "Unit 2: Thể nghi vấn của động từ To Be",
            "Unit 3: Câu hỏi Who và What",
            "Unit 4: Đại từ chỉ định This/That/These/Those",
            "Unit 5: Danh từ số ít & Danh từ số nhiều",
          ],
        },
        {
          stage: 2,
          name: "Giai Đoạn 2: Các Thì Cốt Lõi & Từ Loại (Unit 11 - 20)",
          range: "Ngày 11 - 20",
          desc: "Thì hiện tại đơn, hiện tại tiếp diễn, quá khứ đơn, tương lai đơn, giới từ chỉ thời gian & nơi chốn.",
          unitsSample: [
            "Unit 11: Thì hiện tại đơn với Động từ thường",
            "Unit 12: Thể phủ định & nghi vấn thì hiện tại đơn",
            "Unit 13: Thì hiện tại tiếp diễn",
            "Unit 14: Phân biệt Hiện tại đơn vs Hiện tại tiếp diễn",
            "Unit 15: Quá khứ đơn với To Be (Was/Were)",
          ],
        },
        {
          stage: 3,
          name: "Giai Đoạn 3: Ngữ Pháp Chuyên Sâu & Mệnh Đề (Unit 21 - 35)",
          range: "Ngày 21 - 35",
          desc: "So sánh hơn & so sánh nhất, động từ khuyết thiếu (Can, Must, Should), câu điều kiện If, câu bị động cơ bản.",
          unitsSample: [
            "Unit 21: Tính từ và Trạng từ",
            "Unit 22: So sánh hơn của Tính từ ngắn & dài",
            "Unit 23: So sánh nhất & Cấu trúc đặc biệt",
            "Unit 24: Động từ khuyết thiếu Can / Could / May",
            "Unit 25: Câu điều kiện If loại 1 và loại 2",
          ],
        },
        {
          stage: 4,
          name: "Giai Đoạn 4: Đột Phá Phản Xạ & Luyện Đề (Unit 36 - 48)",
          range: "Ngày 36 - 48",
          desc: "Câu bị động nâng cao, câu gián tiếp, mệnh đề quan hệ, bài thi tổng hợp đánh giá năng lực toàn diện.",
          unitsSample: [
            "Unit 36: Câu bị động các thì nâng cao",
            "Unit 38: Mệnh đề quan hệ Who / Whom / Which / That",
            "Unit 40: Câu tường thuật gián tiếp",
            "Unit 45: Bài kiểm tra tổng hợp Comprehensive Mock Test",
            "Unit 48: Tổng kết & Đột phá phản xạ giao tiếp",
          ],
        },
      ],
    },
    verbStudio: {
      badge: "BỘ CÔNG CỤ FLASHCARD ĐỘNG TỪ",
      title: "Trải Nghiệm Luyện 398+ Động Từ Bất Quy Tắc Ngay Tại Đây",
      subtitle:
        "Bấm vào thẻ để lật xem V2/V3 và bấm biểu tượng loa để nghe phát âm tiếng Anh chuẩn:",
      flashcardTitle: "Thẻ Học Động Từ Tương Tác",
      flipHint: "Chạm hoặc click vào thẻ để lật mặt sau",
      listenPronunciation: "Nghe Phát Âm Chuẩn",
      nextVerb: "Động Từ Tiếp Theo",
      prevVerb: "Động Từ Trước",
      quizTitle: "Kiểm Tra Nhanh Phản Xạ",
    },
    examEngine: {
      badge: "BỘ MÁY THI TRẮC NGHIỆM THÔNG MINH",
      title: "Làm Đề Thi Thật — Có Đồng Hồ Bấm Giờ & Lời Giải Chi Tiết",
      subtitle:
        "Mỗi bài kiểm tra được thiết kế sát theo cấu trúc đề chuẩn quốc tế giúp bạn làm quen áp lực phòng thi:",
      features: [
        {
          title: "Đồng Hồ Đếm Ngược Chuẩn Xác",
          desc: "Tùy chọn thời gian 15, 30 hoặc 45 phút giúp rèn luyện tốc độ làm bài tối ưu.",
        },
        {
          title: "Chấm Điểm Tự Động & Thống Kê Ngay",
          desc: "Xem ngay số câu đúng/sai, % hoàn thành và bảng điểm tổng kết sau khi nộp bài.",
        },
        {
          title: "Giải Thích Từng Phương Án",
          desc: "Hệ thống hiển thị phân tích ngữ pháp vì sao phương án đó đúng, các phương án còn lại sai ở điểm nào.",
        },
        {
          title: "Lưu Lịch Sử & Bookmark Câu Khó",
          desc: "Đánh dấu các câu làm sai để ôn tập lại riêng biệt mà không mất thời gian tìm kiếm.",
        },
      ],
    },
    workflow: {
      badge: "QUY TRÌNH HỌC TẬP MỖI NGÀY",
      title: "Chỉ Cần 30-45 Phút Mỗi Ngày Theo 4 Bước Đơn Giản",
      subtitle:
        "Duy trì thói quen học tập đều đặn để đạt hiệu quả bứt phá sau 48 ngày:",
      steps: [
        {
          number: "01",
          title: "Xem Video Bài Giảng (15p)",
          desc: "Mở Unit trong ngày, xem video bài giảng để nắm bắt ngữ cảnh và tư duy ngữ pháp.",
        },
        {
          number: "02",
          title: "Đọc Bảng Tổng Hợp Lý Thuyết (10p)",
          desc: "Đọc cấu trúc công thức, ghi nhớ các lưu ý quan trọng và ví dụ mẫu.",
        },
        {
          number: "03",
          title: "Làm Trắc Nghiệm & Đọc Giải Thích (15p)",
          desc: "Làm bài tập trắc nghiệm của Unit, nộp bài để xem điểm và phân tích đáp án.",
        },
        {
          number: "04",
          title: "Ôn Flashcard & Luyện Nghe Audio (5p)",
          desc: "Luyện 5-10 động từ bất quy tắc, bấm nghe phát âm để chuẩn hóa ngữ âm.",
        },
      ],
    },
    testimonials: {
      badge: "KẾT QUẢ THỰC TẾ",
      title: "Học Viên Đã Bứt Phá Như Thế Nào?",
      subtitle: "Hàng ngàn học viên đã lấy lại gốc tiếng Anh tự tin sau 48 ngày:",
      items: [
        {
          quote:
            "Trước đây mình rất sợ ngữ pháp vì học đâu quên đó. Học theo lộ trình 48 ngày của SMOB English Lab, mỗi ngày 1 Unit rõ ràng và có bài tập giải thích cực kỳ chi tiết, mình đã tự tin vượt qua kỳ thi B1 dễ dàng!",
          author: "Nguyễn Minh Tuấn",
          role: "Sinh viên ĐH Bách Khoa",
          result: "Đạt 650+ TOEIC từ mất gốc",
        },
        {
          quote:
            "Tính năng Flashcard 398+ động từ có audio phát âm và bài thi bấm giờ cực kỳ hữu ích. Mình làm trắc nghiệm mỗi tối trên điện thoại, giao diện tối mượt mà như Apple vậy!",
          author: "Lê Hoàng Yến",
          role: "Chuyên viên Marketing",
          result: "Tự tin giao tiếp & viết Email",
        },
        {
          quote:
            "Giải thích đáp án là tính năng đắt giá nhất. Mình làm sai câu nào là biết ngay lý do tại sao, không còn phải mò mẫm hay tra cứu lung tung nữa.",
          author: "Trần Đức Anh",
          role: "Kỹ sư Xây dựng",
          result: "Nắm vững toàn bộ 12 thì",
        },
      ],
    },
    faq: {
      badge: "HỎI & ĐÁP",
      title: "Câu Hỏi Thường Gặp Về Khóa Học 48 Ngày",
      subtitle:
        "Tất cả những điều bạn cần biết trước khi bắt đầu hành trình học tập:",
      items: [
        {
          question: "Người hoàn toàn mất gốc có theo học được không?",
          answer:
            "Hoàn toàn được! Giáo trình 48 ngày được thiết kế từ con số 0 (Unit 1 bắt đầu từ động từ To Be và cấu trúc khẳng định/phủ định cơ bản nhất), có dịch song ngữ và giải thích cặn kẽ.",
        },
        {
          question: "Tôi có thể học trên điện thoại hoặc máy tính bảng không?",
          answer:
            "Có. Toàn bộ nền tảng SMOB English Lab được tối ưu hóa responsive 100% trên điện thoại (iOS, Android), máy tính bảng và máy tính để bàn.",
        },
        {
          question: "Khóa học này có mất phí không?",
          answer:
            "Nền tảng được cung cấp học trực tuyến hoàn toàn mở cho cộng đồng học viên lấy gốc tiếng Anh nhanh chóng và hiệu quả.",
        },
        {
          question: "Mỗi ngày tôi cần dành bao nhiêu thời gian để học?",
          answer:
            "Chỉ cần 30 - 45 phút mỗi ngày theo đúng 4 bước (Video -> Lý thuyết -> Trắc nghiệm -> Flashcard) là bạn sẽ hoàn thành xuất sắc lộ trình 48 ngày.",
        },
        {
          question: "Làm thế nào để vào phòng học trực tuyến ngay bây giờ?",
          answer:
            "Bạn chỉ cần bấm nút 'Vào Phòng Học Ngay' hoặc 'Bắt Đầu Học Ngay' ở đầu trang để truy cập ngay vào hệ thống 48 bài học tương tác.",
        },
      ],
    },
    finalCta: {
      title: "Sẵn Sàng Làm Chủ Tiếng Anh Sau 48 Ngày?",
      subtitle:
        "Bắt đầu ngay hôm nay từ Unit 1. Không cần đăng ký rườm rà, bấm vào phòng học là bắt đầu ngay!",
      button: "Vào Phòng Học Trực Tuyến Ngay →",
      guarantee: "✓ 48 Units đầy đủ • ✓ 2.000+ Trắc nghiệm • ✓ Miễn phí 100%",
    },
    footer: {
      brandDesc:
        "SMOB English Lab — Nền tảng học 48 Ngày Lấy Gốc Tiếng Anh Toàn Diện, kết hợp video bài giảng, lý thuyết chuẩn mực, trắc nghiệm thông minh và flashcard audio.",
      linksTitle: "Học Tập",
      curriculumTitle: "Lộ Trình",
      contactTitle: "Liên Hệ & Mã Nguồn",
      copyright: "© 2026 SMOB English Lab. Toàn bộ quyền được bảo lưu.",
    },
  },
  en: {
    nav: {
      about: "Methodology",
      curriculum: "48-Day Roadmap",
      features: "Features",
      verbs: "Irregular Verbs",
      exam: "Mock Exams",
      testimonials: "Reviews",
      faq: "FAQ",
      startLearning: "Enter Classroom Now",
      switchLang: "Tiếng Việt",
    },
    hero: {
      badge: "48-DAY COMPREHENSIVE ENGLISH FOUNDATION COURSE",
      headlineStart: "Master English in",
      headlineGradient: "48 Practical Days",
      headlineEnd: "With Precision",
      subheadline:
        "An intelligent automated online learning platform: 48 Video lessons, In-depth grammar theory, 2,000+ quiz questions with detailed explanations, and 398+ Irregular Verb Flashcards with native audio pronunciation.",
      ctaPrimary: "Start Learning Now (Free)",
      ctaSecondary: "Explore 48 Units Curriculum",
      stats: {
        units: "48",
        unitsLabel: "Daily Structured Units",
        questions: "2,000+",
        questionsLabel: "Quizzes with Explanations",
        verbs: "398+",
        verbsLabel: "Irregular Verbs with Audio",
        guarantee: "100%",
        guaranteeLabel: "Solid Foundation Guaranteed",
      },
    },
    problem: {
      badge: "COMMON STRUGGLES",
      title: "Why Do Most English Learners Get Stuck?",
      subtitle:
        "Most beginners face these repetitive bottlenecks when trying to build their foundation:",
      items: [
        {
          title: "Lost Without a Clear Roadmap",
          desc: "Fragmented grammar rules without day-by-day structured micro-goals lead to overwhelm.",
          tag: "No Clear Path",
        },
        {
          title: "Passive Rote Learning",
          desc: "Reading rules without instant active recall and interactive quiz practice.",
          tag: "Passive Study",
        },
        {
          title: "No Answer Explanations",
          desc: "Standard tests only show A/B/C/D without breaking down WHY an answer is correct or incorrect.",
          tag: "Zero Analysis",
        },
        {
          title: "Forgetting Irregular Verbs",
          desc: "Struggling to remember V1, V2, V3 forms and lacking correct native pronunciation.",
          tag: "Verb Amnesia",
        },
        {
          title: "Lack of Progress Tracking",
          desc: "Unable to see your completion percentage or pinpoint which unit needs review.",
          tag: "No Analytics",
        },
        {
          title: "Giving Up Halfway",
          desc: "Without an engaging, seamless daily learning routine, motivation quickly fades.",
          tag: "Burnout",
        },
      ],
    },
    solution: {
      badge: "SMOB LAB METHODOLOGY",
      title: "The 4-Pillar System to Master English in 48 Days",
      subtitle:
        "A proven, science-backed learning ecosystem integrated into a single unified platform:",
      pillars: [
        {
          title: "1. Visual Video Lectures",
          desc: "Each unit starts with a concise, crystal-clear video explaining grammar principles in 15-20 minutes.",
          highlight: "Fast Comprehension",
        },
        {
          title: "2. Theory & Grammar Maps",
          desc: "Structured formula tables, real bilingual examples, and practical rule-of-thumb tips.",
          highlight: "Standardized Rules",
        },
        {
          title: "3. Smart Quiz Engine with Explanations",
          desc: "Practice 20-50 questions per unit with instant auto-grading and deep answer explanations.",
          highlight: "Instant Feedback",
        },
        {
          title: "4. 398+ Verb Flashcards with Audio",
          desc: "Master V1, V2, V3 with 3D flip effects, native TTS pronunciation, and Quizlet-style reflex drills.",
          highlight: "Native Audio Drills",
        },
      ],
    },
    curriculum: {
      badge: "48-DAY CURRICULUM",
      title: "Scientifically Structured 48 Units",
      subtitle:
        "From complete beginner to confident grammar mastery and active sentence construction:",
      stages: [
        {
          stage: 1,
          name: "Stage 1: Core Foundation (Units 1 - 10)",
          range: "Day 01 - 10",
          desc: "Master To Be, personal pronouns, possessive adjectives, Who/What questions, and base sentence structures.",
          unitsSample: [
            "Unit 1: Affirmative & Negative with To Be",
            "Unit 2: Interrogative forms of To Be",
            "Unit 3: Who and What Questions",
            "Unit 4: Demonstrative Pronouns (This/That/These/Those)",
            "Unit 5: Singular & Plural Nouns",
          ],
        },
        {
          stage: 2,
          name: "Stage 2: Core Tenses & Parts of Speech (Units 11 - 20)",
          range: "Day 11 - 20",
          desc: "Present Simple, Present Continuous, Past Simple, Future Simple, and prepositions.",
          unitsSample: [
            "Unit 11: Present Simple with Action Verbs",
            "Unit 12: Negative & Questions in Present Simple",
            "Unit 13: Present Continuous Tense",
            "Unit 14: Present Simple vs. Present Continuous",
            "Unit 15: Past Simple with To Be (Was/Were)",
          ],
        },
        {
          stage: 3,
          name: "Stage 3: Advanced Grammar & Clauses (Units 21 - 35)",
          range: "Day 21 - 35",
          desc: "Comparative/Superlative adjectives, modal verbs (Can, Must, Should), If conditionals, and passive voice.",
          unitsSample: [
            "Unit 21: Adjectives and Adverbs",
            "Unit 22: Comparative of Short & Long Adjectives",
            "Unit 23: Superlatives & Special Structures",
            "Unit 24: Modal Verbs (Can / Could / May)",
            "Unit 25: Conditional Sentences (Types 1 & 2)",
          ],
        },
        {
          stage: 4,
          name: "Stage 4: Fluency Mastery & Mock Exams (Units 36 - 48)",
          range: "Day 36 - 48",
          desc: "Advanced passive forms, indirect speech, relative clauses, and comprehensive mock assessments.",
          unitsSample: [
            "Unit 36: Advanced Passive Voice across Tenses",
            "Unit 38: Relative Clauses (Who / Whom / Which / That)",
            "Unit 40: Reported Speech",
            "Unit 45: Comprehensive Mock Test",
            "Unit 48: Final Review & Speaking Reflex Mastery",
          ],
        },
      ],
    },
    verbStudio: {
      badge: "VERB FLASHCARD SUITE",
      title: "Practice 398+ Irregular Verbs Right Here",
      subtitle:
        "Click the card to flip for V2/V3 and press the speaker icon to listen to native audio:",
      flashcardTitle: "Interactive Verb Card",
      flipHint: "Touch or click card to flip to back",
      listenPronunciation: "Play Native Audio",
      nextVerb: "Next Verb",
      prevVerb: "Previous Verb",
      quizTitle: "Quick Reflex Quiz",
    },
    examEngine: {
      badge: "INTELLIGENT QUIZ ENGINE",
      title: "Real Exam Mode — Timed Countdown & Deep Analysis",
      subtitle:
        "Every test mirrors real-world test conditions to prepare you for test day:",
      features: [
        {
          title: "Accurate Countdown Timer",
          desc: "Choose 15, 30, or 45-minute sessions to train optimal pacing and focus.",
        },
        {
          title: "Instant Auto-Grading & Scores",
          desc: "Get immediate score reports, correct/incorrect counts, and percentage breakdowns.",
        },
        {
          title: "Comprehensive Explanations",
          desc: "Deep grammatical breakdowns explaining why the correct choice works and why other choices fail.",
        },
        {
          title: "History & Difficult Questions Bookmarking",
          desc: "Flag difficult questions to review them later in dedicated review sessions.",
        },
      ],
    },
    workflow: {
      badge: "DAILY LEARNING WORKFLOW",
      title: "Just 30-45 Minutes a Day in 4 Simple Steps",
      subtitle:
        "Build a consistent study habit for guaranteed progress over 48 days:",
      steps: [
        {
          number: "01",
          title: "Watch Video Lesson (15m)",
          desc: "Open the daily unit, watch the video to grasp concepts and context.",
        },
        {
          number: "02",
          title: "Review Grammar Map (10m)",
          desc: "Read core formulas, common pitfalls, and bilingual examples.",
        },
        {
          number: "03",
          title: "Take Quiz & Check Explanations (15m)",
          desc: "Complete the unit quiz, submit for instant scoring and explanations.",
        },
        {
          number: "04",
          title: "Drill Flashcards & Audio (5m)",
          desc: "Review 5-10 irregular verbs with audio pronunciation drills.",
        },
      ],
    },
    testimonials: {
      badge: "REAL RESULTS",
      title: "How Students Transformed Their English",
      subtitle: "Thousands of learners rebuilt their confidence after 48 days:",
      items: [
        {
          quote:
            "I used to dread grammar because I forgot everything quickly. With SMOB English Lab's 48-day plan and detailed quiz explanations, I passed my B1 exam with flying colors!",
          author: "Minh Tuan Nguyen",
          role: "Engineering Student",
          result: "Scored 650+ TOEIC from zero",
        },
        {
          quote:
            "The 398+ irregular verbs flashcard with audio pronunciation is a lifesaver. I practice on my phone every evening, the dark UI feels just like an Apple app!",
          author: "Hoang Yen Le",
          role: "Marketing Specialist",
          result: "Fluent in emails and meetings",
        },
        {
          quote:
            "The answer explanation feature is priceless. When I get a question wrong, I know immediately why, no more guessing or searching blindly.",
          author: "Duc Anh Tran",
          role: "Civil Engineer",
          result: "Mastered all 12 tenses",
        },
      ],
    },
    faq: {
      badge: "FREQUENTLY ASKED QUESTIONS",
      title: "Common Questions About the 48-Day Course",
      subtitle: "Everything you need to know before starting your journey:",
      items: [
        {
          question: "Is this suitable for absolute beginners?",
          answer:
            "Absolutely! The curriculum starts from ground zero (Unit 1 covers basic To Be affirmative and negative forms) with bilingual explanations.",
        },
        {
          question: "Can I learn on mobile and tablet?",
          answer:
            "Yes. The entire SMOB English Lab platform is 100% responsive across mobile (iOS/Android), tablets, and desktop computers.",
        },
        {
          question: "Is there any cost for this platform?",
          answer:
            "The platform is freely available online to help learners build their English foundation effectively.",
        },
        {
          question: "How much time is required each day?",
          answer:
            "Just 30-45 minutes per day following our 4-step system (Video -> Theory -> Quiz -> Flashcard).",
        },
        {
          question: "How do I start learning right now?",
          answer:
            "Simply click 'Enter Classroom Now' or 'Start Learning Now' at the top to access all 48 interactive units immediately.",
        },
      ],
    },
    finalCta: {
      title: "Ready to Master English in 48 Days?",
      subtitle:
        "Start today with Unit 1. No tedious registration required — click and start studying immediately!",
      button: "Enter Online Classroom Now →",
      guarantee: "✓ Full 48 Units • ✓ 2,000+ Quizzes • ✓ 100% Free",
    },
    footer: {
      brandDesc:
        "SMOB English Lab — 48-Day English Foundation Platform combining video lessons, standardized theory, smart quizzes, and audio flashcards.",
      linksTitle: "Learning",
      curriculumTitle: "Curriculum",
      contactTitle: "Contact & Source Code",
      copyright: "© 2026 SMOB English Lab. All rights reserved.",
    },
  },
};
