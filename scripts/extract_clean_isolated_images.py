import sys
import os
import fitz
import io
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'D:\2.English\Tai lieu_ENG\Drive_Download'
assets_dir = r'assets\exam_images'

def extract_xref_to_pil(doc, xref):
    base_image = doc.extract_image(xref)
    image_bytes = base_image["image"]
    return Image.open(io.BytesIO(image_bytes)).convert("RGBA")

def create_side_by_side_pair(img1, img2, label1="", label2="", width=400, height=180):
    # Create white canvas
    canvas = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    
    # Resize img1 to fit left box (160x140)
    img1.thumbnail((150, 140), Image.Resampling.LANCZOS)
    img2.thumbnail((150, 140), Image.Resampling.LANCZOS)
    
    # Paste img1 centered left
    x1 = 20 + (150 - img1.width) // 2
    y1 = 15 + (140 - img1.height) // 2
    canvas.paste(img1, (x1, y1), img1 if img1.mode == 'RGBA' else None)
    
    # Draw arrow in center
    draw = ImageDraw.Draw(canvas)
    cx, cy = width // 2, height // 2
    # Arrow line
    draw.line([(cx - 18, cy), (cx + 18, cy)], fill=(100, 116, 139, 255), width=3)
    # Arrow head
    draw.polygon([(cx + 18, cy), (cx + 8, cy - 6), (cx + 8, cy + 6)], fill=(100, 116, 139, 255))
    
    # Paste img2 centered right
    x2 = width - 170 + (150 - img2.width) // 2
    y2 = 15 + (140 - img2.height) // 2
    canvas.paste(img2, (x2, y2), img2 if img2.mode == 'RGBA' else None)
    
    return canvas.convert("RGB")

print("=== EXTRACTING PURE ISOLATED IMAGES & CREATING CLEAN VISUAL ASSETS ===")

# --- UNIT 2 ---
u2_dir = os.path.join(assets_dir, 'unit_02')
os.makedirs(u2_dir, exist_ok=True)
folder_u2 = os.path.join(base_dir, 'NGÀY 2')
pdf_u2 = [f for f in os.listdir(folder_u2) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u2 = fitz.open(os.path.join(folder_u2, pdf_u2))

# Part 1: Pairs (man->men, woman->women, child->children, tooth->teeth)
p1_pair1 = create_side_by_side_pair(extract_xref_to_pil(doc_u2, 351), extract_xref_to_pil(doc_u2, 352), "man", "men")
p1_pair1.save(os.path.join(u2_dir, "u02_p1_q01.png"))

p1_pair2 = create_side_by_side_pair(extract_xref_to_pil(doc_u2, 353), extract_xref_to_pil(doc_u2, 354), "woman", "women")
p1_pair2.save(os.path.join(u2_dir, "u02_p1_q02.png"))

p1_pair3 = create_side_by_side_pair(extract_xref_to_pil(doc_u2, 355), extract_xref_to_pil(doc_u2, 356), "child", "children")
p1_pair3.save(os.path.join(u2_dir, "u02_p1_q03.png"))

p1_pair4 = create_side_by_side_pair(extract_xref_to_pil(doc_u2, 357), extract_xref_to_pil(doc_u2, 358), "tooth", "teeth")
p1_pair4.save(os.path.join(u2_dir, "u02_p1_q04.png"))
print("✓ Unit 2: Part 1 pairs saved cleanly (no cut-off, with clear arrow)")

# Part 2: Demonstratives (363=father, 364=books, 365=friend, 366=students)
extract_xref_to_pil(doc_u2, 363).convert("RGB").save(os.path.join(u2_dir, "u02_p2_q01.png"))
extract_xref_to_pil(doc_u2, 364).convert("RGB").save(os.path.join(u2_dir, "u02_p2_q02.png"))
extract_xref_to_pil(doc_u2, 365).convert("RGB").save(os.path.join(u2_dir, "u02_p2_q03.png"))
extract_xref_to_pil(doc_u2, 366).convert("RGB").save(os.path.join(u2_dir, "u02_p2_q04.png"))
print("✓ Unit 2: Part 2 demonstratives saved cleanly")

# Part 3: Questions (368=oranges, 369=students/not babies, 370=puppy/not cat, 371=doctor)
extract_xref_to_pil(doc_u2, 368).convert("RGB").save(os.path.join(u2_dir, "u02_p3_q01.png"))
extract_xref_to_pil(doc_u2, 369).convert("RGB").save(os.path.join(u2_dir, "u02_p3_q02.png"))
extract_xref_to_pil(doc_u2, 370).convert("RGB").save(os.path.join(u2_dir, "u02_p3_q03.png"))
extract_xref_to_pil(doc_u2, 371).convert("RGB").save(os.path.join(u2_dir, "u02_p3_q04.png"))
print("✓ Unit 2: Part 3 question visuals saved cleanly")

# --- UNIT 3 ---
u3_dir = os.path.join(assets_dir, 'unit_03')
os.makedirs(u3_dir, exist_ok=True)
folder_u3 = os.path.join(base_dir, 'NGÀY 3')
pdf_u3 = [f for f in os.listdir(folder_u3) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u3 = fitz.open(os.path.join(folder_u3, pdf_u3))
extract_xref_to_pil(doc_u3, 43).convert("RGB").save(os.path.join(u3_dir, "u03_p2_q01.png")) # apples
extract_xref_to_pil(doc_u3, 42).convert("RGB").save(os.path.join(u3_dir, "u03_p2_q02.png")) # book
extract_xref_to_pil(doc_u3, 45).convert("RGB").save(os.path.join(u3_dir, "u03_p2_q03.png")) # pens
extract_xref_to_pil(doc_u3, 49).convert("RGB").save(os.path.join(u3_dir, "u03_p2_q04.png")) # teachers
extract_xref_to_pil(doc_u3, 48).convert("RGB").save(os.path.join(u3_dir, "u03_p2_q05.png")) # car
print("✓ Unit 3: Visual cards saved cleanly")

# --- UNIT 4 ---
u4_dir = os.path.join(assets_dir, 'unit_04')
os.makedirs(u4_dir, exist_ok=True)
folder_u4 = os.path.join(base_dir, 'NGÀY 4')
pdf_u4 = [f for f in os.listdir(folder_u4) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u4 = fitz.open(os.path.join(folder_u4, pdf_u4))
extract_xref_to_pil(doc_u4, 75).convert("RGB").save(os.path.join(u4_dir, "u04_p4_q01.png")) # kitchen
extract_xref_to_pil(doc_u4, 77).convert("RGB").save(os.path.join(u4_dir, "u04_p4_q02.png")) # 8 oclock
extract_xref_to_pil(doc_u4, 79).convert("RGB").save(os.path.join(u4_dir, "u04_p4_q03.png")) # apples on table
extract_xref_to_pil(doc_u4, 81).convert("RGB").save(os.path.join(u4_dir, "u04_p4_q04.png")) # cat under chair
extract_xref_to_pil(doc_u4, 83).convert("RGB").save(os.path.join(u4_dir, "u04_p4_q05.png")) # sunday concert
print("✓ Unit 4: Visual cards saved cleanly")

# --- UNIT 7 ---
u7_dir = os.path.join(assets_dir, 'unit_07')
os.makedirs(u7_dir, exist_ok=True)
folder_u7 = os.path.join(base_dir, 'NGÀY 7')
pdf_u7 = [f for f in os.listdir(folder_u7) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u7 = fitz.open(os.path.join(folder_u7, pdf_u7))
extract_xref_to_pil(doc_u7, 39).convert("RGB").save(os.path.join(u7_dir, "u07_p1_q01.png"))
extract_xref_to_pil(doc_u7, 38).convert("RGB").save(os.path.join(u7_dir, "u07_p1_q02.png"))
extract_xref_to_pil(doc_u7, 40).convert("RGB").save(os.path.join(u7_dir, "u07_p1_q03.png"))
extract_xref_to_pil(doc_u7, 37).convert("RGB").save(os.path.join(u7_dir, "u07_p1_q04.png"))
extract_xref_to_pil(doc_u7, 48).convert("RGB").save(os.path.join(u7_dir, "u07_p1_q05.png"))
print("✓ Unit 7: Visual cards saved cleanly")

# --- UNIT 13 ---
u13_dir = os.path.join(assets_dir, 'unit_13')
os.makedirs(u13_dir, exist_ok=True)
folder_u13 = os.path.join(base_dir, 'NGÀY 13')
pdf_u13 = [f for f in os.listdir(folder_u13) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u13 = fitz.open(os.path.join(folder_u13, pdf_u13))
extract_xref_to_pil(doc_u13, 42).convert("RGB").save(os.path.join(u13_dir, "u13_p2_q01.png"))
extract_xref_to_pil(doc_u13, 43).convert("RGB").save(os.path.join(u13_dir, "u13_p2_q02.png"))
extract_xref_to_pil(doc_u13, 44).convert("RGB").save(os.path.join(u13_dir, "u13_p2_q03.png"))
extract_xref_to_pil(doc_u13, 47).convert("RGB").save(os.path.join(u13_dir, "u13_p2_q04.png"))
extract_xref_to_pil(doc_u13, 48).convert("RGB").save(os.path.join(u13_dir, "u13_p2_q05.png"))
print("✓ Unit 13: Visual cards saved cleanly")

# --- UNIT 16 ---
u16_dir = os.path.join(assets_dir, 'unit_16')
os.makedirs(u16_dir, exist_ok=True)
folder_u16 = os.path.join(base_dir, 'NGÀY 16')
pdf_u16 = [f for f in os.listdir(folder_u16) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u16 = fitz.open(os.path.join(folder_u16, pdf_u16))
extract_xref_to_pil(doc_u16, 47).convert("RGB").save(os.path.join(u16_dir, "u16_p2_q01.png"))
extract_xref_to_pil(doc_u16, 48).convert("RGB").save(os.path.join(u16_dir, "u16_p2_q02.png"))
extract_xref_to_pil(doc_u16, 49).convert("RGB").save(os.path.join(u16_dir, "u16_p2_q03.png"))
extract_xref_to_pil(doc_u16, 50).convert("RGB").save(os.path.join(u16_dir, "u16_p2_q04.png"))
extract_xref_to_pil(doc_u16, 53).convert("RGB").save(os.path.join(u16_dir, "u16_p2_q05.png"))
print("✓ Unit 16: Visual cards saved cleanly")

# --- UNIT 20 ---
u20_dir = os.path.join(assets_dir, 'unit_20')
os.makedirs(u20_dir, exist_ok=True)
folder_u20 = os.path.join(base_dir, 'NGÀY 20')
pdf_u20 = [f for f in os.listdir(folder_u20) if f.endswith('.pdf') and 'bài thi online' in f.lower()][0]
doc_u20 = fitz.open(os.path.join(folder_u20, pdf_u20))
extract_xref_to_pil(doc_u20, 42).convert("RGB").save(os.path.join(u20_dir, "u20_p1_q01.png"))
extract_xref_to_pil(doc_u20, 43).convert("RGB").save(os.path.join(u20_dir, "u20_p1_q02.png"))
extract_xref_to_pil(doc_u20, 44).convert("RGB").save(os.path.join(u20_dir, "u20_p1_q03.png"))
extract_xref_to_pil(doc_u20, 47).convert("RGB").save(os.path.join(u20_dir, "u20_p1_q04.png"))
extract_xref_to_pil(doc_u20, 48).convert("RGB").save(os.path.join(u20_dir, "u20_p1_q05.png"))
print("✓ Unit 20: Visual cards saved cleanly")

print("\nALL ISOLATED ASSETS EXTRACTED AND STANDARDIZED WITH ZERO ARTIFACTS!")
