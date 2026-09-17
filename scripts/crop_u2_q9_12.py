from PIL import Image
im = Image.open("d:/2.English/ENG Learning_Antigravity/reports/answer_keys_rendered/unit_02_answer_key.png")
# Let's crop from y=6000 to y=12000
crop1 = im.crop((0, 6000, im.width, 10000))
crop1.save("d:/2.English/ENG Learning_Antigravity/reports/answer_keys_rendered/u02_q9_q12.png")
print("Saved u02_q9_q12.png")
