import os
import re
import urllib.request

PEXELS_RETRY = {
    "cat": 617278,
    "book": 768125,
    "flower": 1083822,
    "orange": 207085,
    "shoes": 267301,
    "hat": 984619,
    "park": 417074,
    "drive": 977213,
    "egg": 806457,
    "moon": 365633,
    "star": 1341279,
    "country": 2166711,
    "pencil": 159752,
    "read": 768125,
    "dog": 1108099,
    "apple": 102104,
    "banana": 2872755,
    "cake": 2144112,
    "bread": 1775043,
    "garden": 589802,
    "wardrobe": 3932930,
    "wall": 129731,
    "floor": 1090638,
    "uncle": 834863,
    "aunt": 3768131,
    "cousin": 1181519,
    "classmate": 1438072,
    "shopping_centre": 264507,
    "shopping_center": 264507,
    "listen": 3394650,
    "speak": 7516363,
    "ride": 100582,
    "live": 106399,
    "swim": 863988,
    "phone": 699122,
    "teach": 5212345,
    "jog": 2402777,
    "rain": 459451,
    "snow": 688830,
    "wear": 996329,
    "finish": 2608495,
    "sleep": 914910,
    "understand": 1181519,
    "rent": 106399,
    "clean": 4108715,
    "rise": 301599,
    "set": 531756,
    "leave": 2790396,
    "start": 2402777,
    "boil": 416528,
    "see": 1054655,
    "hate": 2228561,
    "have": 259027,
    "picture": 1839919,
    "box": 4498136,
    "lovely": 3807755,
    "busy": 3184291,
    "late": 2182727,
    "kind": 1181519,
    "new": 112460,
    "old": 3831645
}

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(base_dir, "assets", "vocab_images")

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
for word, photo_id in PEXELS_RETRY.items():
    clean_name = re.sub(r'[^a-z0-9]', '_', word.lower()) + ".jpg"
    out_path = os.path.join(target_dir, clean_name)
    if os.path.isfile(out_path) and os.path.getsize(out_path) > 1000:
        continue
    url = f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w=500"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(out_path, 'wb') as f:
                    f.write(data)
                print(f"Downloaded: {clean_name} ({len(data)/1024:.1f} KB)")
    except Exception as e:
        print(f"Error {word}: {e}")

print("Total images now:", len(os.listdir(target_dir)))
