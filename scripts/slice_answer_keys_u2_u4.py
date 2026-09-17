import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
ROOT = "d:/2.English/ENG Learning_Antigravity"

# Let's inspect the dimensions and crop the top part of answer keys for Unit 2, 3, 4
for u in [2, 3, 4]:
    img_path = os.path.join(ROOT, f"reports/answer_keys_rendered/unit_{u:02d}_answer_key.png")
    im = Image.open(img_path)
    print(f"Unit {u} Answer key size: {im.size}")
    
    # Save slices for viewing if needed
    slice_h = 2500
    for i in range(min(3, im.height // slice_h + 1)):
        box = (0, i * slice_h, im.width, min((i+1) * slice_h, im.height))
        crop_im = im.crop(box)
        crop_path = os.path.join(ROOT, f"reports/answer_keys_rendered/u{u:02d}_slice_{i+1}.png")
        crop_im.save(crop_path)
        print(f"  Saved {crop_path}")
