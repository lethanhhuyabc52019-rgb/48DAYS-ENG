import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'

# Define visual question crop coordinates for each unit
# coordinates in relative % of page [ymin_ratio, ymax_ratio]
crops_config = {
    2: {
        0: [ # Page 1: Part 1 (4 questions)
            ("u02_p1_q01", 0.20, 0.42),
            ("u02_p1_q02", 0.42, 0.60),
            ("u02_p1_q03", 0.60, 0.77),
            ("u02_p1_q04", 0.77, 0.96)
        ],
        1: [ # Page 2: Part 2 (4 questions)
            ("u02_p2_q01", 0.18, 0.38),
            ("u02_p2_q02", 0.38, 0.58),
            ("u02_p2_q03", 0.58, 0.76),
            ("u02_p2_q04", 0.76, 0.94)
        ],
        2: [ # Page 3: Part 3 (4 questions)
            ("u02_p3_q01", 0.18, 0.38),
            ("u02_p3_q02", 0.38, 0.58),
            ("u02_p3_q03", 0.58, 0.78),
            ("u02_p3_q04", 0.78, 0.96)
        ]
    },
    3: {
        0: [ # Page 1: Part 2 (3 questions)
            ("u03_p2_q01", 0.45, 0.62),
            ("u03_p2_q02", 0.62, 0.79),
            ("u03_p2_q03", 0.79, 0.96)
        ],
        1: [ # Page 2: Part 2 continued (2 questions)
            ("u03_p2_q04", 0.18, 0.38),
            ("u03_p2_q05", 0.38, 0.58)
        ]
    },
    4: {
        1: [ # Page 2: Part 4 (5 questions)
            ("u04_p4_q01", 0.18, 0.34),
            ("u04_p4_q02", 0.34, 0.50),
            ("u04_p4_q03", 0.50, 0.66),
            ("u04_p4_q04", 0.66, 0.82),
            ("u04_p4_q05", 0.82, 0.98)
        ]
    },
    7: {
        0: [ # Page 1: Part 1 (5 questions)
            ("u07_p1_q01", 0.22, 0.38),
            ("u07_p1_q02", 0.38, 0.54),
            ("u07_p1_q03", 0.54, 0.70),
            ("u07_p1_q04", 0.70, 0.86),
            ("u07_p1_q05", 0.86, 0.99)
        ]
    },
    13: {
        0: [ # Page 1: Part 2 (5 questions)
            ("u13_p2_q01", 0.48, 0.64),
            ("u13_p2_q02", 0.64, 0.80),
            ("u13_p2_q03", 0.80, 0.98)
        ],
        1: [ # Page 2: Part 2 continued (2 questions)
            ("u13_p2_q04", 0.18, 0.36),
            ("u13_p2_q05", 0.36, 0.54)
        ]
    },
    16: {
        0: [ # Page 1: Part 2 (5 questions)
            ("u16_p2_q01", 0.48, 0.64),
            ("u16_p2_q02", 0.64, 0.80),
            ("u16_p2_q03", 0.80, 0.98)
        ],
        1: [ # Page 2: Part 2 continued (2 questions)
            ("u16_p2_q04", 0.18, 0.36),
            ("u16_p2_q05", 0.36, 0.54)
        ]
    },
    20: {
        0: [ # Page 1: Part 1 (5 questions)
            ("u20_p1_q01", 0.22, 0.38),
            ("u20_p1_q02", 0.38, 0.54),
            ("u20_p1_q03", 0.54, 0.70),
            ("u20_p1_q04", 0.70, 0.86),
            ("u20_p1_q05", 0.86, 0.99)
        ]
    }
}

print("=== CROPPING INDIVIDUAL QUESTION CARDS ===")
for u, pages in crops_config.items():
    folder = os.path.join(base_dir, f'NGÀY {u}')
    exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and ('bài thi online' in f.lower() or 'thi online' in f.lower()) and 'đáp án' not in f.lower()][0]
    doc = fitz.open(os.path.join(folder, exam_pdf))
    out_dir = f'assets/exam_images/unit_{u:02d}'
    os.makedirs(out_dir, exist_ok=True)
    
    for page_idx, items in pages.items():
        if page_idx >= len(doc): continue
        page = doc[page_idx]
        w = page.rect.width
        h = page.rect.height
        
        for q_tag, y1_r, y2_r in items:
            clip_rect = fitz.Rect(40, h * y1_r, w - 40, h * y2_r)
            pix = page.get_pixmap(clip=clip_rect, dpi=160)
            img_path = os.path.join(out_dir, f"{q_tag}.png")
            pix.save(img_path)
            print(f"Unit {u:02d} -> Saved {q_tag}.png")

print("Cropping individual question cards completed!")
