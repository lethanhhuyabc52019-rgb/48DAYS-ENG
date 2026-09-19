# -*- coding: utf-8 -*-
r"""
PyInstaller Packaging Script for SMOB English Lab
Builds a single standalone executable to D:\2.English\phan mem hoc\SMOB English Lab.exe
Cleanly archives older versions and maintains a clean release directory.
"""

import os
import sys
import subprocess
import shutil

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
final_dir = r"D:\2.English\phan mem hoc"
os.makedirs(final_dir, exist_ok=True)

# 0. Terminate running instance if open
try:
    subprocess.run(["taskkill", "/f", "/im", "SMOB English Lab.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    import time; time.sleep(1)
    # WMI termination fallback in case taskkill lacked elevation rights
    try:
        import win32com.client
        wmi = win32com.client.GetObject("winmgmts:")
        procs = wmi.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'SMOB English Lab.exe'")
        for p in procs:
            in_param = p.Methods_("Terminate").InParameters.SpawnInstance_()
            in_param.Properties_("Reason").Value = 0
            p.ExecMethod_("Terminate", in_param)
        if len(procs) > 0:
            time.sleep(1)
    except Exception:
        pass
except Exception:
    pass

# 1. Clean and archive old builds in release folder
archive_dir = os.path.join(final_dir, "archive")
os.makedirs(archive_dir, exist_ok=True)

import time
existing_target = os.path.join(final_dir, "SMOB English Lab.exe")
if os.path.isfile(existing_target):
    try:
        backup_target = os.path.join(archive_dir, f"SMOB_English_Lab_prev.exe")
        if os.path.exists(backup_target):
            try: os.remove(backup_target)
            except Exception: pass
        shutil.move(existing_target, backup_target)
        print(f"Safely archived previous build to: archive/SMOB_English_Lab_prev.exe")
    except Exception as e:
        print(f"Warning moving existing exe: {e}")

for item in os.listdir(final_dir):
    item_path = os.path.join(final_dir, item)
    if os.path.isfile(item_path) and item.lower().endswith('.exe') and item != "SMOB English Lab.exe":
        dest = os.path.join(archive_dir, item)
        if os.path.exists(dest):
            os.remove(dest)
        shutil.move(item_path, dest)
        print(f"Archived previous version: {item} -> archive/{item}")

# 2. Temporary build directories outside git
work_dir = os.path.join(base_dir, "build_tmp")
spec_dir = os.path.join(base_dir, "spec_tmp")
os.makedirs(work_dir, exist_ok=True)
os.makedirs(spec_dir, exist_ok=True)

# 3. Ensure embedded bundle is fresh before packaging
print("Regenerating embedded bundle...")
subprocess.run([sys.executable, os.path.join(base_dir, "scripts", "generate_embedded_bundle.py")], check=True)

target_name = "SMOB English Lab"
print(f"\nStarting PyInstaller packaging for '{target_name}.exe'...")

# Assets to bundle
add_data_args = [
    f'--add-data={os.path.join(base_dir, "index.html")};.',
    f'--add-data={os.path.join(base_dir, "css")};css',
    f'--add-data={os.path.join(base_dir, "js")};js',
    f'--add-data={os.path.join(base_dir, "data")};data',
    f'--add-data={os.path.join(base_dir, "assets")};assets',
]

cmd = [
    sys.executable,
    "-m", "PyInstaller",
    f"--name={target_name}",
    "--onefile",
    "--windowed",
    "--noconsole",
    "--clean",
    f"--icon={os.path.join(base_dir, 'assets', 'icon.ico')}",
    "--hidden-import=bottle",
    "--hidden-import=webview",
    "--exclude-module=PyQt5",
    "--exclude-module=PyQt6",
    "--exclude-module=tkinter",
    "--exclude-module=matplotlib",
    "--exclude-module=scipy",
    "--exclude-module=numpy",
    f"--distpath={final_dir}",
    f"--workpath={work_dir}",
    f"--specpath={spec_dir}",
    *add_data_args,
    os.path.join(base_dir, "desktop_main.py")
]

print("Executing build command...")
process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8', errors='replace')

for line in process.stdout:
    line_clean = line.strip()
    if any(k in line_clean for k in ["Building", "Copying", "Appending", "checking", "Processing", "completed successfully", "INFO:", "ERROR", "Traceback", "File ", "Permission", "Exception", "failed"]):
        print(line_clean)

process.wait()

if process.returncode != 0:
    print(f"\n[ERROR] Build FAILED with return code: {process.returncode}")
    sys.exit(process.returncode)

print("\nPyInstaller packaging completed successfully!")

# 4. Verify single executable exists
exe_path = os.path.join(final_dir, f"{target_name}.exe")
if os.path.isfile(exe_path):
    size_mb = os.path.getsize(exe_path) / (1024 * 1024)
    print(f"SUCCESS: Created standalone executable '{exe_path}' ({size_mb:.2f} MB)")
else:
    print(f"ERROR: '{exe_path}' was not found!")
    sys.exit(1)

# 5. Write README.txt
readme_path = os.path.join(final_dir, "README.txt")
with open(readme_path, "w", encoding="utf-8") as f:
    f.write("SMOB English Lab — 48-Day Foundation Course\n")
    f.write("============================================\n\n")
    f.write("Hướng dẫn sử dụng:\n")
    f.write("1. Click đúp vào file 'SMOB English Lab.exe' để mở ứng dụng học tập.\n")
    f.write("2. Ứng dụng chạy offline 100%, tích hợp sẵn toàn bộ 48 Units (Lý thuyết, Đề thi, Lời giải).\n")
    f.write("3. Video bài giảng và Audio luyện nghe tự động phát trực tiếp trong ứng dụng từ thư mục tài liệu đi kèm.\n")

# 6. Clean temporary build directories
print("Cleaning temporary build directories...")
shutil.rmtree(work_dir, ignore_errors=True)
shutil.rmtree(spec_dir, ignore_errors=True)

# 7. Automatically build Portable Package for office/company use
portable_script = os.path.join(base_dir, "scripts", "create_portable_package.py")
if os.path.isfile(portable_script):
    print("\nCreating Portable Package for Company/Office...")
    subprocess.run([sys.executable, portable_script], check=True)

# 8. List and verify clean output directory
final_items = [f for f in os.listdir(final_dir) if not f.startswith('.')]
print(f"\nFinal release directory items ({final_dir}): {final_items}")
assert f"{target_name}.exe" in final_items, "Target exe not found in release folder!"
print(f"PASSED 100%: Single executable & Portable release verified at {exe_path}")

