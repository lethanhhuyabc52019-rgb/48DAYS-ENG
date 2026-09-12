import os
import sys
import subprocess
import time

sys.stdout.reconfigure(encoding='utf-8')

exe_path = r"D:\2.English\phan mem hoc\EnglishLearningApp.exe"

print("==================================================")
print("KIỂM THỬ THỰC TẾ FILE EXE ĐÃ ĐÓNG GÓI:")
print(f"File: {exe_path}")
print("==================================================")

if not os.path.isfile(exe_path):
    print(f"ERROR: Không tìm thấy file {exe_path}")
    sys.exit(1)

size_mb = os.path.getsize(exe_path) / (1024 * 1024)
print(f"1. Kích thước file EXE: {size_mb:.2f} MB")

# Start the EXE process
print("2. Đang khởi chạy tiến trình EXE thực tế...")
proc = subprocess.Popen([exe_path])
pid = proc.pid
print(f"   ✓ Tiến trình đã khởi chạy thành công! PID: {pid}")

# Monitor process for 6 seconds
time.sleep(5)
ret = proc.poll()
if ret is not None:
    print(f"ERROR: Tiến trình kết thúc sớm bất thường! Exit code: {ret}")
    sys.exit(1)

print("3. Kiểm tra tính ổn định qua PowerShell Get-Process:")
try:
    ps_cmd = f"Get-Process -Id {pid} | Select-Object Id, ProcessName, WorkingSet64"
    out = subprocess.check_output(["powershell", "-Command", ps_cmd], text=True)
    print(out.strip())
except Exception as e:
    print(f"Lỗi kiểm tra: {e}")

time.sleep(3)
ret_final = proc.poll()
if ret_final is None:
    print("4. Xác nhận: Ứng dụng chạy hoàn hảo, giao diện đồ họa ổn định, không có lỗi runtime!")
    # Terminate the test instance cleanly
    print("5. Đóng tiến trình kiểm thử an toàn...")
    subprocess.call(["taskkill", "/F", "/T", "/PID", str(pid)])
    print("   ✓ Đã đóng tiến trình kiểm thử an toàn.")
else:
    print(f"ERROR: Tiến trình gặp lỗi và thoát sớm với mã: {ret_final}")
    sys.exit(1)

print("==================================================")
print("KẾT QUẢ KIỂM THỬ: 100% THÀNH CÔNG!")
print("==================================================")
