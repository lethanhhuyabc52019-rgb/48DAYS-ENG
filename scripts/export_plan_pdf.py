# -*- coding: utf-8 -*-
import os
import subprocess
import sys

def generate_pdf():
    html_content = r"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Kế Hoạch Học Tiếng Anh Tuần 1 - SMOB English Lab</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 12mm 8mm 12mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 11px;
    line-height: 1.42;
  }
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  /* Header */
  .header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 14px 18px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .header-left h1 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.2px;
    color: #38bdf8;
    margin-bottom: 2px;
  }
  .header-left .subtitle {
    font-size: 11.5px;
    color: #cbd5e1;
    font-weight: 500;
  }
  .header-badge {
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid #38bdf8;
    color: #e0f2fe;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 10.5px;
    font-weight: 600;
    text-align: right;
  }

  /* Strategy Banner */
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
  }
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
  }
  .card-title {
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 3px;
  }
  .card-p {
    font-size: 10px;
    color: #475569;
    line-height: 1.35;
  }
  .tag-blue { color: #0284c7; }
  .tag-purple { color: #7c3aed; }
  .tag-green { color: #059669; }

  /* Daily Table */
  .section-title {
    font-size: 12.5px;
    font-weight: 700;
    color: #0f172a;
    border-left: 3.5px solid #0284c7;
    padding-left: 8px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  .schedule-table th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    font-size: 10.5px;
    border: 1px solid #cbd5e1;
  }
  .schedule-table td {
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    font-size: 10.5px;
    vertical-align: middle;
  }
  .schedule-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .day-badge {
    display: inline-block;
    background: #0f172a;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 9.5px;
  }
  .unit-pill {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5px;
    margin: 1px 1px;
  }
  .check-box {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1.5px solid #64748b;
    border-radius: 3px;
    vertical-align: middle;
    margin-right: 3px;
  }

  /* Bottom Grid */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 8px;
    margin-bottom: 8px;
  }
  .tips-card {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 8px 10px;
  }
  .tips-title {
    font-weight: 700;
    color: #b45309;
    font-size: 10.5px;
    margin-bottom: 3px;
  }
  .tips-list {
    padding-left: 14px;
    font-size: 10px;
    color: #92400e;
    line-height: 1.35;
  }
  .next-card {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .next-title {
    font-weight: 700;
    color: #166534;
    font-size: 10.5px;
    margin-bottom: 3px;
  }
  .next-desc {
    font-size: 10px;
    color: #15803d;
    line-height: 1.35;
  }

  /* Footer */
  .footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    font-size: 9px;
    color: #64748b;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>
<div class="container">
  <div>
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1>SMOB ENGLISH LAB — KẾ HOẠCH TUẦN 1</h1>
        <div class="subtitle">Lộ Trình Tái Khởi Động: Quét Cấp Tốc Unit 1 ➔ Unit 17 (Bắt đầu: Thứ 2, 14/09/2026)</div>
      </div>
      <div class="header-badge">
        <div>15 Phút/Ngày • Không Áp Lực</div>
        <div style="font-size: 9.5px; opacity: 0.85;">Active Recall • Văn Phòng Yên Tĩnh</div>
      </div>
    </div>
    
    <!-- Strategy Cards -->
    <div class="strategy-grid">
      <div class="card">
        <div class="card-title"><span class="tag-blue">🏢 Ban Ngày (Công ty - 15p)</span></div>
        <div class="card-p"><strong>Làm thẳng Quiz trắc nghiệm:</strong> Không cần đọc lý thuyết trước. Câu nào sai đọc giải thích 10s để nhớ sâu ngay tại chỗ. Tắt tiếng hoàn toàn.</div>
      </div>
      <div class="card">
        <div class="card-title"><span class="tag-purple">🛋️ Buổi Tối (Ở nhà - 10-15p)</span></div>
        <div class="card-p"><strong>Tiếp nhận thụ động:</strong> Bấm xem video bài giảng Unit bị sai nhiều hoặc lướt 5-10 thẻ Flashcard BQT. <em>Nếu mệt: Cho phép nghỉ 100%!</em></div>
      </div>
      <div class="card">
        <div class="card-title"><span class="tag-green">💻 Cuối Tuần (Thứ 7 & CN)</span></div>
        <div class="card-p"><strong>Nghỉ Tiếng Anh hoàn toàn:</strong> Dành 100% năng lượng cho chuyên môn kỹ thuật: Revit, Dynamo, phát triển Add-in SMOB và quay video.</div>
      </div>
    </div>

    <!-- Table Title -->
    <div class="section-title">
      <span>CHI TIẾT LỊCH TRÌNH 5 NGÀY QUÉT CHẨN ĐOÁN (14/09 – 18/09/2026)</span>
      <span style="font-size: 10px; font-weight: 500; color: #64748b;">Phần mềm: D:\2.English\phan mem hoc\SMOB English Lab.exe</span>
    </div>

    <!-- Table -->
    <table class="schedule-table">
      <thead>
        <tr>
          <th style="width: 14%;">Thời Gian</th>
          <th style="width: 25%;">Chủ Đề Trọng Tâm</th>
          <th style="width: 22%;">Các Unit Quét</th>
          <th style="width: 27%;">Hành Động Cụ Thể (Ngày & Tối)</th>
          <th style="width: 12%; text-align: center;">Hoàn Thành</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="day-badge">THỨ 2</span><br><strong style="font-size: 9.5px; color: #475569;">14/09/2026</strong></td>
          <td><strong>Hệ TO BE & Wh- Questions</strong><br><span style="color: #64748b; font-size: 9.5px;">am/is/are, isn't/aren't, Who, What, Where, When</span></td>
          <td>
            <span class="unit-pill">Unit 01</span> <span class="unit-pill">Unit 02</span><br>
            <span class="unit-pill">Unit 03</span> <span class="unit-pill">Unit 04</span>
          </td>
          <td>
            • <strong>Ngày (15p):</strong> Làm Quiz 4 Unit.<br>
            • <strong>Tối (10p):</strong> Xem video Unit 01 hoặc lướt 5 Flashcard.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 3</span><br><strong style="font-size: 9.5px; color: #475569;">15/09/2026</strong></td>
          <td><strong>Động Từ Thường & Hiện Tại Đơn</strong><br><span style="color: #64748b; font-size: 9.5px;">Quy tắc -s/-es, trợ động từ don't/doesn't, Do/Does</span></td>
          <td>
            <span class="unit-pill">Unit 05</span> <span class="unit-pill">Unit 06</span><br>
            <span class="unit-pill">Unit 07</span> <span class="unit-pill">Unit 08</span>
          </td>
          <td>
            • <strong>Ngày (15p):</strong> Làm Quiz 4 Unit.<br>
            • <strong>Tối (10p):</strong> Xem video tổng hợp Unit 08 (HTĐ).
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 4</span><br><strong style="font-size: 9.5px; color: #475569;">16/09/2026</strong></td>
          <td><strong>Từ Loại & Hiện Tại Tiếp Diễn</strong><br><span style="color: #64748b; font-size: 9.5px;">Vị trí Noun/Adj/Adv, be + V-ing, phân biệt HTĐ & HTTD</span></td>
          <td>
            <span class="unit-pill">Unit 09</span> <span class="unit-pill">Unit 10</span><br>
            <span class="unit-pill">Unit 11</span>
          </td>
          <td>
            • <strong>Ngày (15p):</strong> Làm Quiz 3 Unit.<br>
            • <strong>Tối (10p):</strong> Xem video Unit 11 (Phân biệt HTĐ vs HTTD).
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 5</span><br><strong style="font-size: 9.5px; color: #475569;">17/09/2026</strong></td>
          <td><strong>Hệ Quá Khứ & 40 Động Từ BQT</strong><br><span style="color: #64748b; font-size: 9.5px;">V-ed / V2, didn't + V-inf, was/were + V-ing</span></td>
          <td>
            <span class="unit-pill">Unit 12</span> <span class="unit-pill">Unit 13</span><br>
            <span class="unit-pill">Unit 14</span>
          </td>
          <td>
            • <strong>Ngày (18p):</strong> Làm Quiz 3 Unit + 3p lướt ⭐ 40 từ BQT.<br>
            • <strong>Tối (10p):</strong> Xem video Unit 12 hoặc quẹt Flashcard.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 6</span><br><strong style="font-size: 9.5px; color: #475569;">18/09/2026</strong></td>
          <td><strong>Hiện Tại Hoàn Thành & Tương Lai</strong><br><span style="color: #64748b; font-size: 9.5px;">have/has + V3, will + V-inf, will have + V3</span></td>
          <td>
            <span class="unit-pill">Unit 15</span> <span class="unit-pill">Unit 16</span><br>
            <span class="unit-pill">Unit 17</span>
          </td>
          <td>
            • <strong>Ngày (15p):</strong> Làm Quiz 3 Unit + xem Bảng theo dõi.<br>
            • <strong>Tối:</strong> TỔNG KẾT TUẦN 1 — Nghỉ ngơi xả hơi!
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr style="background: #f0fdf4;">
          <td><span class="day-badge" style="background: #166534;">THỨ 7 & CN</span><br><strong style="font-size: 9.5px; color: #166534;">19 – 20/09</strong></td>
          <td><strong style="color: #166534;">Chuyên Môn Kỹ Thuật (BIM / SMOB)</strong><br><span style="color: #15803d; font-size: 9.5px;">Revit Add-in, Dynamo, quay video chia sẻ tool</span></td>
          <td colspan="2">
            • Nghỉ học tiếng Anh 100% để não bộ reset.<br>
            • Dành toàn bộ thời gian cho công việc & dự án chuyên môn kỹ thuật cá nhân.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 9px; color: #166534; font-weight: 700;">SMOB Tool</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bottom Highlights -->
    <div class="bottom-grid">
      <div class="tips-card">
        <div class="tips-title">⚡ 3 NGUYÊN TẮC VÀNG DUY TRÌ THÓI QUEN KHÔNG BỎ CUỘC</div>
        <ul class="tips-list">
          <li><strong>Cố định mốc 15 phút:</strong> Làm ngay 15 phút đầu giờ sáng hoặc sau giờ ngủ trưa tại văn phòng.</li>
          <li><strong>Đừng cầu toàn 100 điểm:</strong> Mục tiêu tuần này là chẩn đoán lỗ hổng. Sai càng nhiều thì phát hiện điểm yếu để bù đắp càng nhanh!</li>
          <li><strong>Nguyên tắc Không Đứt Chuỗi:</strong> Nếu hôm nào bận đột xuất, chỉ cần làm đúng 1 bài Quiz (3 phút) để giữ streak!</li>
        </ul>
      </div>

      <div class="next-card">
        <div>
          <div class="next-title">🚀 MỤC TIÊU TUẦN 2 (TIẾP THEO)</div>
          <div class="next-desc">Bắt đầu tiếp thu kiến thức mới từ <strong>Unit 18 ➔ Unit 48</strong> theo tiến độ 1 bài/ngày với tâm thế hoàn toàn tự tin và phản xạ nhạy bén.</div>
        </div>
        <div style="font-size: 9.5px; color: #0369a1; font-weight: 600; margin-top: 3px;">
          App: D:\2.English\phan mem hoc\SMOB English Lab.exe
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>SMOB English Lab (48-Day Foundation Course) • Được tạo tự động bởi Antigravity</span>
    <span>Ngày lập kế hoạch: 13/09/2026 • Áp dụng: 14/09/2026 – 20/09/2026</span>
  </div>
</div>
</body>
</html>"""

    scratch_dir = r"D:\2.English\ENG Learning_Antigravity\scratch"
    os.makedirs(scratch_dir, exist_ok=True)
    html_path = os.path.join(scratch_dir, "plan_week_1.html")
    pdf_path = r"D:\2.English\Ke_Hoach_Hoc_Tieng_Anh_Tuan_1_SMOB.pdf"

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
        f"--print-to-pdf={pdf_path}",
        "--no-pdf-header-footer",
        html_path
    ]
    print(f"Generating PDF to: {pdf_path}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0 and os.path.exists(pdf_path):
        size_kb = round(os.path.getsize(pdf_path) / 1024, 2)
        print(f"SUCCESS: PDF generated successfully! File size: {size_kb} KB")
    else:
        print("ERROR:", result.stderr)
        sys.exit(1)

if __name__ == "__main__":
    generate_pdf()
