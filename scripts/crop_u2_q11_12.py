from PIL import Image
im = Image.open("d:/2.English/ENG Learning_Antigravity/reports/answer_keys_rendered/unit_02_answer_key.png")
crop2 = im.crop((0, 9500, im.width, 13500))
crop2.save("d:/2.English/ENG Learning_Antigravity/reports/answer_keys_rendered/u02_q11_q12.png")
print("Saved u02_q11_q12.png")
