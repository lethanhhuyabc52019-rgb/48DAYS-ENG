# -*- coding: utf-8 -*-
"""
Create Portable Package for SMOB English Lab to bring to company / office machines.
Creates SMOB_English_Lab_Portable.zip containing:
1. SMOB English Lab.exe (latest 54.8 MB standalone)
2. Huong_Dan_Su_Dung_May_Cong_Ty.txt
"""

import os
import sys
import zipfile
import shutil

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
release_dir = r"D:\2.English\phan mem hoc"
exe_path = os.path.join(release_dir, "SMOB English Lab.exe")

if not os.path.isfile(exe_path):
    print(f"ERROR: File {exe_path} does not exist. Please run build_exe.py first.")
    sys.exit(1)

# 1. Create clean UTF-8 instruction file
instruction_content = """======================================================================
  SMOB ENGLISH LAB (48-DAY FOUNDATION COURSE) — BẢN PORTABLE CÔNG TY
======================================================================

Chào bạn! Đây là bản Portable độc lập của phần mềm SMOB English Lab, 
được thiết kế tối ưu hóa 100% để bạn có thể mang theo học tập trên máy tính công ty,
laptop cá nhân hoặc bất kỳ máy tính Windows 10/11 nào mà không lo bị hạn chế quyền.

----------------------------------------------------------------------
1. CÁCH SỬ DỤNG TRÊN MÁY TÍNH CÔNG TY (PLUG & PLAY):
----------------------------------------------------------------------
- Hoàn toàn KHÔNG cần quyền Administrator (Admin) để cài đặt.
- KHÔNG cần cài đặt bất kỳ phần mềm phụ trợ nào (không cần Python, Node.js, v.v.).
- Giải nén file ZIP hoặc copy trực tiếp file 'SMOB English Lab.exe' vào máy tính (ổ D, Desktop, hoặc USB).
- Click đúp vào 'SMOB English Lab.exe' để mở ứng dụng và học ngay lập tức.
- Ứng dụng chạy OFFLINE 100%, an toàn tuyệt đối cho bảo mật doanh nghiệp,
  không yêu cầu kết nối Internet và không gửi bất kỳ dữ liệu nào ra ngoài.

----------------------------------------------------------------------
2. HƯỚNG DẪN NẾU GẶP CẢNH BÁO WINDOWS SMARTSCREEN:
----------------------------------------------------------------------
Vì đây là phần mềm nội bộ (chưa mua chứng chỉ số từ Microsoft),
Windows 10/11 có thể hiện màn hình xanh "Windows protected your PC":
  -> Bước 1: Click vào dòng chữ "More info" (Thông tin thêm).
  -> Bước 2: Click vào nút "Run anyway" (Vẫn chạy).
Chỉ cần thực hiện 1 lần đầu tiên, các lần sau sẽ mở trực tiếp mượt mà.

----------------------------------------------------------------------
3. TÍNH NĂNG TÍCH HỢP SẴN TRONG FILE EXE:
----------------------------------------------------------------------
- Toàn bộ giáo trình 48 Units (Lý thuyết ngữ pháp, Bộ từ vựng, Flashcards).
- Kho 398+ Động từ bất quy tắc chuẩn quốc tế kèm phiên âm IPA 3 cột.
- Phòng Luyện Tập & Kiểm Tra chuẩn Quizlet (Trắc nghiệm, Đúng/Sai, Tự gõ từ,
  điều hướng 2 chiều câu trước/sau, nộp bài xong mới hiện đáp án & giải thích).
- Hệ thống phát âm chuẩn tiếng Anh (Speech Engine) tích hợp sẵn.
- Chế độ Giao diện Sáng (Light Mode) / Tối (Dark Mode) chuẩn phong cách Apple.
- Chế độ Silent Mode: Cực kỳ phù hợp để học tại văn phòng công ty trong giờ nghỉ
  (đọc lý thuyết tóm tắt, lướt flashcard, làm quiz trắc nghiệm ngắn 3-5 phút).

----------------------------------------------------------------------
4. LỘ TRÌNH HỌC GỢI Ý TẠI CÔNG TY (KÈM THEO):
----------------------------------------------------------------------
- File 'Lo_Trinh_48_Ngay_Hoc_Tai_Cong_Ty.txt' đi kèm thiết kế lộ trình tinh gọn:
  + Tuần 1: Quét thần tốc chẩn đoán nền tảng Unit 1 đến Unit 17 (15-20 phút/ngày).
  + Tuần 2 - 8: Bắt đầu tiếp thu kiến thức mới từ Unit 18 đến Unit 48.
  + Cuối tuần (T7, CN): Nghỉ ngơi trọn vẹn dành cho công việc chuyên môn.

----------------------------------------------------------------------
5. NẾU BẠN MUỐN XEM VIDEO BÀI GIẢNG TRÊN MÁY CÔNG TY:
----------------------------------------------------------------------
- Thư mục video gốc (Drive_Download) nặng khoảng 3.8 GB chứa 48 video bài giảng.
- Nếu muốn xem video: Bạn chỉ cần chép thư mục 'Drive_Download' vào cùng thư mục
  với file 'SMOB English Lab.exe' (ví dụ trên USB hoặc ổ cứng máy công ty).
- Ứng dụng sẽ tự động phát hiện và phát video bài giảng trực tiếp trong app!
- Nếu không có video: Bạn vẫn học bình thường toàn bộ Lý thuyết, Từ vựng,
  Đề thi, Trắc nghiệm và Động từ bất quy tắc mà không bị ảnh hưởng gì.

Chúc bạn học tập hiệu quả và chinh phục tiếng Anh thành công!
======================================================================
"""

readme_path = os.path.join(release_dir, "Huong_Dan_Su_Dung_May_Cong_Ty.txt")
with open(readme_path, "w", encoding="utf-8") as f:
    f.write(instruction_content)
print(f"Created: {readme_path}")

# Also update the root README.txt with clean UTF-8
with open(os.path.join(release_dir, "README.txt"), "w", encoding="utf-8") as f:
    f.write(instruction_content)

# 2. Export Learning Roadmap for company
roadmap_src = os.path.join(base_dir, "LO_TRINH_48_NGAY.md")
roadmap_dest = os.path.join(release_dir, "Lo_Trinh_48_Ngay_Hoc_Tai_Cong_Ty.txt")
if os.path.isfile(roadmap_src):
    with open(roadmap_src, "r", encoding="utf-8") as f:
        roadmap_content = f.read()
    with open(roadmap_dest, "w", encoding="utf-8") as f:
        f.write(roadmap_content)
    print(f"Created: {roadmap_dest}")

# 3. Build Portable ZIP archive
zip_path = os.path.join(release_dir, "SMOB_English_Lab_Portable.zip")
print(f"\nCompressing to '{zip_path}'...")

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
    print("Adding SMOB English Lab.exe...")
    zipf.write(exe_path, arcname="SMOB English Lab.exe")
    print("Adding Huong_Dan_Su_Dung_May_Cong_Ty.txt...")
    zipf.write(readme_path, arcname="Huong_Dan_Su_Dung_May_Cong_Ty.txt")
    if os.path.isfile(roadmap_dest):
        print("Adding Lo_Trinh_48_Ngay_Hoc_Tai_Cong_Ty.txt...")
        zipf.write(roadmap_dest, arcname="Lo_Trinh_48_Ngay_Hoc_Tai_Cong_Ty.txt")

zip_size_mb = os.path.getsize(zip_path) / (1024 * 1024)
print(f"\nSUCCESS: Portable package created at:")
print(f"  {zip_path} ({zip_size_mb:.2f} MB)")

