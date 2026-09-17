import os
import glob
from PIL import Image

ROOT = "d:/2.English/ENG Learning_Antigravity"
# Let's inspect Unit 3 answer key
im3 = Image.open(os.path.join(ROOT, "reports/answer_keys_rendered/unit_03_answer_key.png"))
print("Unit 3 answer key size:", im3.size)
# Slice Unit 3 answer key into 3 parts
im3.crop((0, 0, im3.width, 5000)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u03_part1.png"))
im3.crop((0, 5000, im3.width, 10000)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u03_part2.png"))
im3.crop((0, 10000, im3.width, im3.height)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u03_part3.png"))

# Let's inspect Unit 4 answer key
im4 = Image.open(os.path.join(ROOT, "reports/answer_keys_rendered/unit_04_answer_key.png"))
print("Unit 4 answer key size:", im4.size)
im4.crop((0, 0, im4.width, 5000)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u04_part1.png"))
im4.crop((0, 5000, im4.width, 10000)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u04_part2.png"))
im4.crop((0, 10000, im4.width, im4.height)).save(os.path.join(ROOT, "reports/answer_keys_rendered/u04_part3.png"))
print("Saved slices for Unit 3 and 4")
