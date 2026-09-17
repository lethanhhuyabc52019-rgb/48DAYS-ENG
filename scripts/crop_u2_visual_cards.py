import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

folder = r'D:\2.English\Tai lieu_ENG\Drive_Download\NGÀY 2'
exam_pdf = [f for f in os.listdir(folder) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc = fitz.open(os.path.join(folder, exam_pdf))

out_dir = r'assets\exam_images\unit_02'
os.makedirs(out_dir, exist_ok=True)

# Page 1: Part 1 - 4 visual pairs
# Let's inspect text rects on page 1
p1 = doc[0]
rects = []
for block in p1.get_text("blocks"):
    print("Block:", block[:4], "Text:", block[4].replace('\n', ' '))

# We can crop the 4 questions from page 1:
# Let's render the 4 question cards at dpi=150
# Q1: y from 140 to 300
# Q2: y from 300 to 460
# Q3: y from 460 to 620
# Q4: y from 620 to 780
w = p1.rect.width
h = p1.rect.height

pix1 = p1.get_pixmap(clip=fitz.Rect(60, 130, w-60, 300), dpi=150)
pix1.save(os.path.join(out_dir, "u02_p1_q01.png"))

pix2 = p1.get_pixmap(clip=fitz.Rect(60, 300, w-60, 460), dpi=150)
pix2.save(os.path.join(out_dir, "u02_p1_q02.png"))

pix3 = p1.get_pixmap(clip=fitz.Rect(60, 460, w-60, 620), dpi=150)
pix3.save(os.path.join(out_dir, "u02_p1_q03.png"))

pix4 = p1.get_pixmap(clip=fitz.Rect(60, 620, w-60, 780), dpi=150)
pix4.save(os.path.join(out_dir, "u02_p1_q04.png"))

print("Saved u02_p1_q01 to q04 successfully!")

# Page 2: Part 2 - 4 questions
p2 = doc[1]
pix2_1 = p2.get_pixmap(clip=fitz.Rect(60, 150, w-60, 300), dpi=150)
pix2_1.save(os.path.join(out_dir, "u02_p2_q01.png"))

pix2_2 = p2.get_pixmap(clip=fitz.Rect(60, 300, w-60, 450), dpi=150)
pix2_2.save(os.path.join(out_dir, "u02_p2_q02.png"))

pix2_3 = p2.get_pixmap(clip=fitz.Rect(60, 450, w-60, 600), dpi=150)
pix2_3.save(os.path.join(out_dir, "u02_p2_q03.png"))

pix2_4 = p2.get_pixmap(clip=fitz.Rect(60, 600, w-60, 760), dpi=150)
pix2_4.save(os.path.join(out_dir, "u02_p2_q04.png"))

print("Saved u02_p2_q01 to q04 successfully!")

# Page 3: Part 3 - 4 questions
p3 = doc[2]
pix3_1 = p3.get_pixmap(clip=fitz.Rect(60, 150, w-60, 300), dpi=150)
pix3_1.save(os.path.join(out_dir, "u02_p3_q01.png"))

pix3_2 = p3.get_pixmap(clip=fitz.Rect(60, 300, w-60, 460), dpi=150)
pix3_2.save(os.path.join(out_dir, "u02_p3_q02.png"))

pix3_3 = p3.get_pixmap(clip=fitz.Rect(60, 460, w-60, 620), dpi=150)
pix3_3.save(os.path.join(out_dir, "u02_p3_q03.png"))

pix3_4 = p3.get_pixmap(clip=fitz.Rect(60, 620, w-60, 780), dpi=150)
pix3_4.save(os.path.join(out_dir, "u02_p3_q04.png"))

print("Saved u02_p3_q01 to q04 successfully!")
