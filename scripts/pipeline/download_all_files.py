import os
import sys
import io
import time
import openpyxl

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import gdown

TARGET_DIR = r"D:\2.English\Tai lieu_ENG\Drive_Download"
LOG_FILE = os.path.join(TARGET_DIR, "download_log.txt")
SHEET_FILE = r"C:\Users\Admin\.gemini\antigravity-ide\brain\4d98faf6-7d4d-4d70-8579-afc4f2a66e57\scratch\sheet.xlsx"

os.makedirs(TARGET_DIR, exist_ok=True)

def log(msg):
    timestamp = time.strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{timestamp} {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass

log("=== BẮT ĐẦU DOWNLOAD DỮ LIỆU GOOGLE SHEETS ===")
log(f"Thư mục đích: {TARGET_DIR}")

wb = openpyxl.load_workbook(SHEET_FILE, data_only=False)
s = wb['48 ngày lấy gốc']

items = []
# 1. Header item
items.append({
    "name": "FILE TỔNG HỢP (TÀI LIỆU + ĐỀ KIỂM TRA + ĐÁP ÁN)",
    "url": None,
    "row": 7
})

# 2. FILE 1 to FILE 48 from Column E
for row in range(8, 120):
    val_e = s.cell(row=row, column=5).value
    hl_e = s.cell(row=row, column=5).hyperlink
    url = hl_e.target if hl_e else None
    
    if val_e and 'FILE' in str(val_e).upper():
        items.append({
            "name": str(val_e).strip(),
            "url": url,
            "row": row
        })

log(f"Tổng số mục cần xử lý: {len(items)}")

success_count = 0
error_count = 0
downloaded_files = []

for idx, item in enumerate(items, 1):
    name = item["name"]
    url = item["url"]
    row = item["row"]
    
    log(f"\n[{idx}/{len(items)}] Đang xử lý: {name} (Row {row})")
    
    if not url:
        log(f" -> Bỏ qua: {name} không chứa link Google Drive (Header).")
        continue
        
    log(f" -> Link Drive: {url}")
    
    # Snapshot existing files before download
    before_files = set(os.listdir(TARGET_DIR))
    
    try:
        # Download folder content directly into TARGET_DIR
        res = gdown.download_folder(url, output=TARGET_DIR, quiet=True)
        
        # Check newly created files
        after_files = set(os.listdir(TARGET_DIR))
        new_files = list(after_files - before_files)
        
        if new_files:
            log(f" -> HOÀN THÀNH {name}: Đã tải {len(new_files)} file:")
            for nf in new_files:
                fpath = os.path.join(TARGET_DIR, nf)
                size_kb = round(os.path.getsize(fpath) / 1024, 1)
                log(f"    + {nf} ({size_kb} KB)")
                downloaded_files.append((nf, size_kb))
            success_count += 1
        else:
            # Check if files already existed or if res returned files
            log(f" -> [Thông báo] Thư mục đã được xử lý (kết quả: {res})")
            success_count += 1
            
    except Exception as e:
        log(f" -> [LỖI] Không thể tải {name}: {str(e)}")
        error_count += 1

log("\n=== TỔNG KẾT TASK DOWNLOAD ===")
log(f"Tổng số mục xử lý: {len(items)}")
log(f"Thành công: {success_count}")
log(f"Lỗi/Bỏ qua: {error_count}")
log(f"Tổng số file hiện có trong {TARGET_DIR}: {len(os.listdir(TARGET_DIR))}")
