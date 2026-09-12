import os
import re
import time
import json
import urllib.request
import urllib.parse

# Pexels curated photo IDs for core English nouns, adjectives and actions
# All from pexels.com (free license, no attribution required)
PEXELS_CURATED = {
    "student": 1438072,
    "teacher": 5212345,
    "doctor": 4173251,
    "nurse": 4386466,
    "engineer": 3862130,
    "lawyer": 5668473,
    "firefighter": 699459,
    "police": 2422290,
    "baby": 3270223,
    "children": 1001914,
    "family": 1128318,
    "friend": 1181519,
    "brother": 1416736,
    "grandfather": 3831645,
    "grandmother": 2050994,
    "parent": 1682497,
    "son": 1682497,
    "daughter": 1462630,
    "car": 112460,
    "bus": 1178448,
    "train": 2790396,
    "plane": 358319,
    "airplane": 358319,
    "bicycle": 100582,
    "ship": 813011,
    "book": 159866,
    "apple": 102104,
    "orange": 161559,
    "banana": 2872755,
    "cake": 2144112,
    "bread": 1775043,
    "coffee": 302899,
    "tea": 1417945,
    "water": 416528,
    "food": 1640777,
    "milk": 248412,
    "rice": 4110257,
    "meat": 65175,
    "fish": 229789,
    "egg": 162712,
    "fruit": 1132047,
    "vegetable": 1435904,
    "dog": 1108099,
    "cat": 45201,
    "bird": 326900,
    "tree": 1632790,
    "flower": 56866,
    "sun": 301599,
    "moon": 47367,
    "star": 956999,
    "sky": 531756,
    "rain": 459451,
    "snow": 688830,
    "park": 158028,
    "garden": 589802,
    "house": 106399,
    "home": 106399,
    "kitchen": 2724749,
    "room": 271624,
    "bedroom": 271624,
    "school": 207691,
    "hospital": 263402,
    "hotel": 258154,
    "library": 2908984,
    "table": 890669,
    "chair": 116910,
    "desk": 1297611,
    "bed": 6585758,
    "sofa": 1866149,
    "door": 277559,
    "window": 1090638,
    "computer": 1714208,
    "phone": 699122,
    "pen": 261763,
    "pencil": 159751,
    "bag": 1152077,
    "clock": 2182727,
    "money": 259027,
    "happy": 3807755,
    "sad": 2228561,
    "tall": 1391498,
    "short": 1391499,
    "big": 1054655,
    "small": 3270223,
    "clean": 4108715,
    "work": 3184291,
    "play": 296301,
    "music": 167491,
    "read": 159866,
    "write": 210661,
    "swim": 863988,
    "sleep": 914910,
    "run": 2402777,
    "drive": 13861,
    "cook": 2284166,
    "wash": 4239091,
    "buy": 230544,
    "city": 466685,
    "country": 158827,
    "sea": 994605,
    "mountain": 618833,
    "river": 709552,
    "beach": 457882,
    "clothes": 996329,
    "jacket": 996329,
    "shoes": 19090,
    "hat": 35185,
    "shirt": 297933,
    "dress": 985635
}

def get_pexels_url(photo_id):
    return f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg?auto=compress&cs=tinysrgb&w=500"

def download_image(url, out_path):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status == 200:
                data = response.read()
                if len(data) > 1000:
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
    return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, "assets", "vocab_images")
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"Target directory: {target_dir}")
    success_count = 0
    
    for word, photo_id in PEXELS_CURATED.items():
        clean_name = re.sub(r'[^a-z0-9]', '_', word.lower()) + ".jpg"
        out_path = os.path.join(target_dir, clean_name)
        if os.path.isfile(out_path) and os.path.getsize(out_path) > 1000:
            print(f"[EXISTS] {word} -> {clean_name}")
            success_count += 1
            continue
            
        url = get_pexels_url(photo_id)
        print(f"[DOWNLOADING] {word} (Pexels ID {photo_id})...", end=" ")
        if download_image(url, out_path):
            size_kb = os.path.getsize(out_path) / 1024
            print(f"OK ({size_kb:.1f} KB)")
            success_count += 1
        else:
            print("FAILED")
        time.sleep(0.05)
        
    print(f"\nDownloaded/verified {success_count}/{len(PEXELS_CURATED)} images from Pexels!")

if __name__ == '__main__':
    main()
