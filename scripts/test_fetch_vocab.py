import os
import re
import time
import json
import urllib.request
import urllib.parse

def fetch_image_for_word(word, out_path):
    # Try Wikipedia PageImages API
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(word.capitalize())}&prop=pageimages&format=json&pithumbsize=400"
    headers = {'User-Agent': 'SMOBEnglishLab/1.0 (Educational App; Contact: support@smob.edu)'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                thumb = p.get('thumbnail', {}).get('source')
                if thumb and (thumb.endswith('.jpg') or thumb.endswith('.jpeg') or thumb.endswith('.png')):
                    # Download thumbnail
                    img_req = urllib.request.Request(thumb, headers=headers)
                    with urllib.request.urlopen(img_req, timeout=8) as img_resp:
                        img_data = img_resp.read()
                        if len(img_data) > 1000:
                            with open(out_path, 'wb') as f:
                                f.write(img_data)
                            return True
    except Exception as e:
        pass
    return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, "assets", "vocab_images")
    os.makedirs(target_dir, exist_ok=True)
    
    test_words = ['banana', 'desk', 'park', 'sofa', 'clock', 'kitchen', 'hotel', 'river', 'mountain', 'beach']
    for w in test_words:
        clean_name = re.sub(r'[^a-z0-9]', '_', w.lower()) + ".jpg"
        out_path = os.path.join(target_dir, clean_name)
        if os.path.isfile(out_path):
            print(f"Exists: {w}")
            continue
        print(f"Fetching {w}...", end=" ")
        ok = fetch_image_for_word(w, out_path)
        print("OK" if ok else "NO THUMB")
        time.sleep(0.3)

if __name__ == '__main__':
    main()
