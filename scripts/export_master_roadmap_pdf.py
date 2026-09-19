# -*- coding: utf-8 -*-
import os
import subprocess
import sys

OUTPUT_PDF = r"D:\2.English\Lo_Trinh_48_Ngay_Thong_Tha_SMOB.pdf"

# 16 weeks data calculation
weeks_data = [
    # (Week_num, Date_range, U1_num, U1_title, U2_num, U2_title, note, is_special)
    (1, "28/09 – 01/10/2026", 18, "Ngữ âm chuẩn (IPA)", 19, "Trọng âm từ 2-3 âm tiết", "Bắt đầu chuẩn hóa phát âm & trọng âm", False),
    (2, "05/10 – 08/10/2026", 20, "Các từ để hỏi (Why, How...)", 21, "Luyện nghe số và tên", "Hoàn tất GĐ 2 • Bắt đầu luyện nghe", False),
    (3, "12/10 – 15/10/2026", 22, "Động từ khuyết thiếu (Modal)", 23, "Liên từ and, but, or, so...", "Cấu trúc câu & nối ý logic", False),
    (4, "19/10 – 22/10/2026", 24, "Liên từ chỉ thời gian", 25, "Liên từ chỉ sự đối lập", "Nắm chắc chuỗi liên từ phức hợp", False),
    (5, "26/10 – 29/10/2026", 26, "Câu điều kiện Loại 1", 27, "Câu điều kiện Loại 2", "Chinh phục 2 loại câu If cơ bản", False),
    (6, "02/11 – 05/11/2026", 28, "Câu điều kiện Loại 3", 29, "Luyện nghe điền từ", "Trọn bộ 3 loại If • Luyện nghe điền từ", False),
    (7, "09/11 – 12/11/2026", 30, "Luyện nghe chép chính tả", 31, "Luyện nghe về giờ", "Phản xạ nghe chính tả & giờ giấc", False),
    (8, "16/11 – 19/11/2026", 32, "Luyện nghe ngày tháng", 33, "Luyện nghe địa điểm", "Bật tai nghe thông tin đời sống", False),
    (9, "23/11 – 26/11/2026", 34, "Luyện nghe tiền bạc", None, None, "⭐ T2-T3: Học Unit 34 • T4-T5: NGHỈ ĐI CHƠI CÔNG TY (26-29/11)", True),
    (10, "30/11 – 03/12/2026", 35, "Đại từ phản thân", 36, "Sự hoà hợp về thì", "Nạp lại năng lượng sau chuyến du lịch", False),
    (11, "07/12 – 10/12/2026", 37, "Tiếng Anh giao tiếp 1", 38, "Liên từ tương hỗ", "Thực hành phản xạ đàm thoại cơ bản", False),
    (12, "14/12 – 17/12/2026", 39, "Luyện nghe quốc gia & châu lục", 40, "Luyện nghe về sở thích", "Mở rộng từ vựng văn hóa đời sống", False),
    (13, "21/12 – 24/12/2026", 41, "Luyện nghe phương tiện", 42, "Luyện nghe thể thao", "Tự tin nghe hiểu các tình huống thực tế", False),
    (14, "28/12 – 31/12/2026", 43, "Luyện nghe nghề nghiệp", 44, "Luyện nghe công nghệ", "Chủ đề công sở & hoàn thành năm 2026", False),
    (15, "04/01 – 07/01/2027", 45, "Tiếng Anh giao tiếp 2", 46, "Kỹ năng Note-taking", "Khởi đầu năm 2027 với kỹ năng nâng cao", False),
    (16, "11/01 – 14/01/2027", 47, "Kỹ năng Paraphrasing", 48, "Thuyết trình & Giới thiệu", "⭐ T4, 13/01 hoàn thành Unit 48 • T5, 14/01 TỐT NGHIỆP 48 NGÀY!", True),
]

html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  @page {{
    size: A4 portrait;
    margin: 3.5mm 5mm 3.5mm 5mm;
  }}
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
    color: #0f172a;
    background: #ffffff;
    font-size: 7.9px;
    line-height: 1.22;
  }}
  .container {{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* HEADER */
  .header {{
    background: linear-gradient(135deg, #091e3a 0%, #1e3a8a 50%, #0284c7 100%);
    color: #ffffff;
    border-radius: 6px;
    padding: 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 6px rgba(14, 116, 144, 0.15);
    margin-bottom: 3.5px;
  }}
  .title-group h1 {{
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .title-group p {{
    font-size: 7.8px;
    color: #bae6fd;
    margin-top: 1.5px;
    font-weight: 500;
  }}
  .badge-pacing {{
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 5px;
    padding: 3px 8px;
    text-align: right;
  }}
  .badge-pacing .tag {{
    font-size: 9px;
    font-weight: 800;
    color: #fef08a;
    display: block;
  }}
  .badge-pacing .sub {{
    font-size: 7px;
    color: #f8fafc;
  }}

  /* PILLARS / TOP 4 CARDS */
  .strategy-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-bottom: 3.5px;
  }}
  .card {{
    border-radius: 5px;
    padding: 3.5px 5.5px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
  }}
  .card-1 {{ border-left: 3px solid #0284c7; background: #f0f9ff; }}
  .card-2 {{ border-left: 3px solid #10b981; background: #ecfdf5; }}
  .card-3 {{ border-left: 3px solid #f59e0b; background: #fffbeb; }}
  .card-4 {{ border-left: 3px solid #8b5cf6; background: #faf5ff; }}

  .card-title {{
    font-size: 7.8px;
    font-weight: 700;
    margin-bottom: 1.5px;
    display: flex;
    align-items: center;
    gap: 3px;
  }}
  .card-1 .card-title {{ color: #0369a1; }}
  .card-2 .card-title {{ color: #047857; }}
  .card-3 .card-title {{ color: #b45309; }}
  .card-4 .card-title {{ color: #6d28d9; }}
  .card-desc {{
    font-size: 7px;
    color: #475569;
    line-height: 1.18;
  }}

  /* 5 PHASES TIMELINE BANNER */
  .phases-bar {{
    display: grid;
    grid-template-columns: 1.05fr 1.6fr 1.55fr 1.75fr 1.45fr;
    gap: 3.5px;
    margin-bottom: 3.5px;
  }}
  .phase-item {{
    border-radius: 4px;
    padding: 2.8px 5px;
    font-size: 7px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
  }}
  .phase-p0 {{ background: #eff6ff; border-color: #93c5fd; }}
  .phase-p1 {{ background: #f0fdf4; border-color: #86efac; }}
  .phase-p2 {{ background: #fefce8; border-color: #fde047; }}
  .phase-p3 {{ background: #fdf2f8; border-color: #fbcfe8; }}
  .phase-p4 {{ background: #faf5ff; border-color: #d8b4fe; }}
  .phase-name {{
    font-weight: 800;
    font-size: 7.4px;
    display: block;
    margin-bottom: 1px;
  }}
  .phase-p0 .phase-name {{ color: #1d4ed8; }}
  .phase-p1 .phase-name {{ color: #15803d; }}
  .phase-p2 .phase-name {{ color: #a16207; }}
  .phase-p3 .phase-name {{ color: #be185d; }}
  .phase-p4 .phase-name {{ color: #7e22ce; }}

  /* MAIN TABLE (16 WEEKS) */
  .table-title {{
    font-size: 8.8px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 3px solid #0284c7;
    padding-left: 5px;
    margin-bottom: 2.5px;
  }}
  .table-title span.sub {{
    font-size: 7px;
    font-weight: normal;
    color: #64748b;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 7.4px;
  }}
  th {{
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    padding: 2.5px 4px;
    text-align: left;
    border: 1px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 6.8px;
  }}
  td {{
    padding: 2.2px 4px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
  }}
  tr:nth-child(even) {{
    background-color: #f8fafc;
  }}
  tr.special-trip {{
    background-color: #fffbeb !important;
  }}
  tr.special-grad {{
    background-color: #f0fdf4 !important;
  }}

  .week-badge {{
    display: inline-block;
    padding: 0.5px 3.5px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 7px;
    background: #e2e8f0;
    color: #1e293b;
  }}
  .week-badge.trip {{
    background: #fef08a;
    color: #854d0e;
    border: 1px solid #facc15;
  }}
  .week-badge.grad {{
    background: #bbf7d0;
    color: #14532d;
    border: 1px solid #4ade80;
  }}

  .unit-pill {{
    display: inline-block;
    padding: 0.5px 3.5px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 7px;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    white-space: nowrap;
  }}
  .unit-pill.gold {{
    background: #fef3c7;
    color: #92400e;
    border-color: #fde68a;
  }}

  .chk-box {{
    width: 9.5px;
    height: 9.5px;
    border: 1px solid #94a3b8;
    border-radius: 2px;
    display: inline-block;
    margin: 0 auto;
  }}

  /* FOOTER HIGHLIGHT */
  .footer-highlight {{
    margin-top: 3px;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #86efac;
    border-radius: 5px;
    padding: 3.5px 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .footer-highlight .left {{
    font-size: 7.4px;
    color: #14532d;
    line-height: 1.22;
  }}
  .footer-highlight .left strong {{
    color: #0f5132;
  }}
  .footer-highlight .right {{
    text-align: right;
    font-size: 7px;
    color: #166534;
  }}
  .footer-highlight .right .tet-badge {{
    background: #dc2626;
    color: #ffffff;
    font-weight: 800;
    padding: 1.5px 6px;
    border-radius: 3px;
    font-size: 7.4px;
    display: inline-block;
    margin-bottom: 1px;
  }}

  /* FOOTER */
  .footer {{
    margin-top: 2.5px;
    padding-top: 2px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 6.8px;
    color: #64748b;
  }}
</style>
</head>
<body>
<div class="container">

  <!-- HEADER -->
  <div class="header">
    <div class="title-group">
      <h1>🚀 SMOB ENGLISH LAB — LỘ TRÌNH 48 NGÀY THẢNH THƠI & VỮNG CHẮC</h1>
      <p>Chiến Lược Hoàn Thành Toàn Bộ 48 Units (19/09/2026 ➔ 14/01/2027) • Nhịp 2 Ngày / 1 Unit • Về Đích Thảnh Thơi Đón Tết 2027</p>
    </div>
    <div class="badge-pacing">
      <span class="tag">⚡ 2 NGÀY / 1 UNIT</span>
      <span class="sub">T2–T5: 15p • T6: Chill • T7–CN: Tự do</span>
    </div>
  </div>

  <!-- TOP 4 STRATEGY CARDS -->
  <div class="strategy-grid">
    <div class="card card-1">
      <div class="card-title">📖 Ngày 1: Nạp Kiến Thức (Input)</div>
      <div class="card-desc">
        Xem tab <b>Ngữ Pháp</b> nắm công thức. Mở <b>Split View</b> nghe cô Mai Phương giảng & quét từ mới. <b>Chưa làm bài</b> để não bộ ngấm tự nhiên.
      </div>
    </div>
    <div class="card card-2">
      <div class="card-title">✍️ Ngày 2: Luyện Tập (Output & Debug)</div>
      <div class="card-desc">
        Vào <b>Quiz</b> làm trắc nghiệm chẩn đoán. Đọc ngay giải thích chi tiết có sẵn. Mở <b>Sổ Tay Câu Sai</b> làm lại và bấm <b>✓ Đã Thuộc / Xóa</b>.
      </div>
    </div>
    <div class="card card-3">
      <div class="card-title">🏖️ Nghỉ Đi Chơi Cty (26–29/11/2026)</div>
      <div class="card-desc">
        T2–T3 (23–24/11) hoàn thành Unit 34. T4 chuẩn bị đồ, <b>T5–CN xả hơi 100% cùng công ty</b>. Tiến độ chỉ xê dịch đúng 2 ngày, không áp lực!
      </div>
    </div>
    <div class="card card-4">
      <div class="card-title">🎆 Về Đích Sớm Đón Tết 2027</div>
      <div class="card-desc">
        Hoàn tất Unit 48 vào <b>12/01/2027</b>. Tổng kết <b>14/01/2027</b>. Còn dư hơn <b>3 tuần</b> trước Tết (06/02/2027) thảnh thơi đón Tết với vốn tiếng Anh tự tin!
      </div>
    </div>
  </div>

  <!-- 5 PHASES BANNER -->
  <div class="phases-bar">
    <div class="phase-item phase-p0">
      <span class="phase-name">GĐ 0: Củng Cố Nền Móng</span>
      19/09 – 25/09 (1 tuần) • Unit 01 ➔ 17: Ôn chắc HTĐ, QKĐ, HTHT, Tương lai.
    </div>
    <div class="phase-item phase-p1">
      <span class="phase-name">GĐ 1: Chuẩn Hóa Âm & Nối Câu</span>
      28/09 – 29/10 (5 tuần) • Unit 18 ➔ 27: IPA, Trọng âm, Khiếm khuyết, If 1 & 2.
    </div>
    <div class="phase-item phase-p2">
      <span class="phase-name">GĐ 2: Phản Xạ Nghe Thực Tế</span>
      02/11 – 25/11 (4 tuần) • Unit 28 ➔ 34: If 3, Nghe số, giờ, ngày tháng, tiền tệ.
    </div>
    <div class="phase-item phase-p3">
      <span class="phase-name">GĐ 3: Giao Tiếp & Công Sở</span>
      30/11 – 31/12 (5 tuần) • Unit 35 ➔ 44: Hòa hợp thì, Giao tiếp 1, Công nghệ...
    </div>
    <div class="phase-item phase-p4">
      <span class="phase-name">GĐ 4: Kỹ Năng & Tốt Nghiệp</span>
      04/01 – 14/01 (2 tuần) • Unit 45 ➔ 48: Note-taking, Paraphrase, Thuyết trình!
    </div>
  </div>

  <!-- MAIN 16 WEEKS TABLE -->
  <div>
    <div class="table-title">
      <span>CHI TIẾT MA TRẬN 16 TUẦN THẢNH THƠI (28/09/2026 ➔ 14/01/2027)</span>
      <span class="sub">Thứ 6 Chill • Thứ 7 & CN tự do • Nhịp 2 ngày/Unit (T2–T3 & T4–T5)</span>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 38px; text-align: center;">Tuần</th>
          <th style="width: 74px;">Thời Gian</th>
          <th style="width: 65px; text-align: center;">Unit Mục Tiêu</th>
          <th style="width: 135px;">Thứ 2 & Thứ 3 (Ngày 1 ➔ Ngày 2)</th>
          <th style="width: 135px;">Thứ 4 & Thứ 5 (Ngày 1 ➔ Ngày 2)</th>
          <th>Ghi Chú & Cột Mốc Trọng Tâm</th>
          <th style="width: 22px; text-align: center;">Xong</th>
        </tr>
      </thead>
      <tbody>
"""

for w in weeks_data:
    wnum, drange, u1, t1, u2, t2, note, special = w
    
    tr_class = ""
    badge_class = ""
    if special and "CÔNG TY" in note:
        tr_class = "special-trip"
        badge_class = "trip"
    elif special and "TỐT NGHIỆP" in note:
        tr_class = "special-grad"
        badge_class = "grad"
    
    if u2 is not None:
        unit_display = f'<span class="unit-pill">Unit {u1:02d}</span> <span class="unit-pill">Unit {u2:02d}</span>'
        t45_display = f'<b>Unit {u2:02d}:</b> {t2}'
    else:
        unit_display = f'<span class="unit-pill gold">Unit {u1:02d}</span>'
        t45_display = f'<span style="color:#b45309; font-weight:700;">🏖️ NGHỈ ĐI CHƠI CÔNG TY (26–29/11)</span>'

    t23_display = f'<b>Unit {u1:02d}:</b> {t1}'

    html_content += f"""
        <tr class="{tr_class}">
          <td style="text-align: center;"><span class="week-badge {badge_class}">T.{wnum:02d}</span></td>
          <td><b>{drange}</b></td>
          <td style="text-align: center;">{unit_display}</td>
          <td>{t23_display}</td>
          <td>{t45_display}</td>
          <td>{note}</td>
          <td style="text-align: center;"><div class="chk-box"></div></td>
        </tr>
    """

html_content += """
      </tbody>
    </table>
  </div>

  <!-- FOOTER HIGHLIGHT -->
  <div class="footer-highlight">
    <div class="left">
      <strong>🎯 TỔNG KẾT HÀNH TRÌNH:</strong> Học thong thả 15 phút/ngày tại công ty • Thứ 6 xả hơi • Cuối tuần cho gia đình • Đi chơi công ty 4 ngày trọn vẹn.<br>
      Đến ngày <strong>14/01/2027</strong> hoàn thành 100% khóa học 48 Ngày, nắm chắc toàn bộ Ngữ pháp, Ngữ âm IPA, Kỹ năng nghe phản xạ và Tự tin thuyết trình!
    </div>
    <div class="right">
      <div class="tet-badge">🎆 TẾT ĐINH MÙI: 06/02/2027</div><br>
      Về đích trước Tết <strong>23 ngày</strong> • Đón năm mới tự tin!
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>SMOB English Lab (48-Day Foundation Course) • Thiết kế lộ trình cá nhân hóa cho: lethanhhuyabc52019</span>
    <span>Lộ trình áp dụng: 28/09/2026 – 14/01/2027 • App: D:\\2.English\\phan mem hoc\\SMOB English Lab.exe</span>
  </div>

</div>
</body>
</html>
"""

def generate_pdf():
    scratch_dir = r"D:\2.English\ENG Learning_Antigravity\scratch"
    os.makedirs(scratch_dir, exist_ok=True)
    html_path = os.path.join(scratch_dir, "master_roadmap_48_days.html")

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    edge_exe = None
    for p in edge_paths:
        if os.path.exists(p):
            edge_exe = p
            break

    if not edge_exe:
        print("Error: Microsoft Edge executable not found.")
        sys.exit(1)

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={OUTPUT_PDF}",
        "--no-pdf-header-footer",
        html_path
    ]
    print(f"Generating Master Roadmap PDF to: {OUTPUT_PDF}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0 and os.path.exists(OUTPUT_PDF):
        size_kb = round(os.path.getsize(OUTPUT_PDF) / 1024, 2)
        print(f"SUCCESS: PDF generated successfully! File size: {size_kb} KB")
    else:
        print("ERROR:", result.stderr)
        sys.exit(1)

if __name__ == "__main__":
    generate_pdf()
