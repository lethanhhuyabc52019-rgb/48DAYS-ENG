import os
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')

targets = [
    ("temp", r"C:\Windows\Temp"),
    ("%temp%", os.environ.get("TEMP", r"C:\Users\Admin\AppData\Local\Temp")),
    ("prefetch", r"C:\Windows\Prefetch")
]

print("==================================================")
print("TIẾN HÀNH DỌN DẸP HỆ THỐNG THEO QUY TẮC BẮT BUỘC:")
print("1. C:\\Windows\\Temp")
print("2. %TEMP% (C:\\Users\\Admin\\AppData\\Local\\Temp)")
print("3. C:\\Windows\\Prefetch")
print("==================================================")

total_deleted_files = 0
total_deleted_bytes = 0
total_skipped_files = 0

for label, folder in targets:
    if not os.path.exists(folder):
        print(f"[{label}] Thư mục không tồn tại: {folder}")
        continue
        
    print(f"\n[{label}] Đang quét và dọn dẹp: {folder}...")
    deleted_in_folder = 0
    bytes_in_folder = 0
    skipped_in_folder = 0
    
    # Iterate through directory items
    try:
        items = os.listdir(folder)
    except Exception as e:
        print(f"  Không thể truy cập thư mục {folder}: {e}")
        continue
        
    for item in items:
        # Don't delete our own running log files if any
        item_path = os.path.join(folder, item)
        try:
            if os.path.isfile(item_path) or os.path.islink(item_path):
                fsize = os.path.getsize(item_path) if os.path.isfile(item_path) else 0
                os.remove(item_path)
                deleted_in_folder += 1
                bytes_in_folder += fsize
            elif os.path.isdir(item_path):
                # calculate size
                dir_size = 0
                for root, dirs, files in os.walk(item_path):
                    for f in files:
                        try: dir_size += os.path.getsize(os.path.join(root, f))
                        except: pass
                shutil.rmtree(item_path)
                deleted_in_folder += 1
                bytes_in_folder += dir_size
        except (PermissionError, OSError):
            # Safe skip in-use/locked files
            skipped_in_folder += 1
            
    total_deleted_files += deleted_in_folder
    total_deleted_bytes += bytes_in_folder
    total_skipped_files += skipped_in_folder
    
    mb_freed = bytes_in_folder / (1024 * 1024)
    print(f"  ✓ Đã xóa {deleted_in_folder} mục, giải phóng: {mb_freed:.2f} MB (Bỏ qua an toàn: {skipped_in_folder} file đang bận)")

total_mb = total_deleted_bytes / (1024 * 1024)
print("\n==================================================")
print(f"TỔNG KẾT DỌN DẸP:")
print(f"- Tổng số mục đã xóa an toàn: {total_deleted_files}")
print(f"- Tổng dung lượng giải phóng: {total_mb:.2f} MB")
print(f"- Số file hệ thống/ứng dụng đang sử dụng bỏ qua an toàn: {total_skipped_files}")
print("==================================================")
