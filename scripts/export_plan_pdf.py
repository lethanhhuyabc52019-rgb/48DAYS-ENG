# -*- coding: utf-8 -*-
import os
import subprocess
import sys

def generate_pdf():
    html_content = r"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Kế Hoạch Học Tiếng Anh Vững Chắc (19/09 - 25/09/2026) - SMOB English Lab</title>
<style>
  @page {
    size: A4 portrait;
    margin: 4mm 8mm 4mm 8mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 10px;
    line-height: 1.32;
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
    padding: 9px 14px;
    border-radius: 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .header-left h1 {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.2px;
    color: #38bdf8;
    margin-bottom: 1px;
  }
  .header-left .subtitle {
    font-size: 10.5px;
    color: #cbd5e1;
    font-weight: 500;
  }
  .header-badge {
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid #38bdf8;
    color: #e0f2fe;
    padding: 4px 9px;
    border-radius: 6px;
    font-size: 9.5px;
    font-weight: 600;
    text-align: right;
    line-height: 1.25;
  }

  /* Strategy Banner */
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    margin-bottom: 6px;
  }
  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px 8px;
  }
  .card-title {
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;
  }
  .card-p {
    font-size: 9.2px;
    color: #475569;
    line-height: 1.28;
  }
  .tag-blue { color: #0284c7; }
  .tag-purple { color: #7c3aed; }
  .tag-amber { color: #d97706; }

  /* Daily Table */
  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
    border-left: 3.5px solid #0284c7;
    padding-left: 6px;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
  }
  .schedule-table th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 4.5px 6px;
    font-size: 9.5px;
    border: 1px solid #cbd5e1;
  }
  .schedule-table td {
    padding: 3.8px 6px;
    border: 1px solid #e2e8f0;
    font-size: 9.5px;
    vertical-align: middle;
  }
  .schedule-table tr:nth-child(even) td {
    background: #f8fafc;
  }
  .day-badge {
    display: inline-block;
    background: #0f172a;
    color: #fff;
    padding: 2px 4.5px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 8.5px;
  }
  .unit-pill {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.5px;
    margin: 1px 1px;
    border: 1px solid #bae6fd;
  }
  .unit-pill-highlight {
    background: #fef3c7;
    color: #b45309;
    border-color: #fde68a;
  }
  .check-box {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 1.5px solid #64748b;
    border-radius: 3px;
    vertical-align: middle;
    margin-right: 2px;
  }

  /* Bottom Grid */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 6px;
    margin-bottom: 5px;
  }
  .tips-card {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 5px 8px;
  }
  .tips-title {
    font-weight: 700;
    color: #b45309;
    font-size: 9.8px;
    margin-bottom: 2px;
  }
  .tips-list {
    padding-left: 13px;
    font-size: 9.2px;
    color: #92400e;
    line-height: 1.28;
  }
  .next-card {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 5px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .next-title {
    font-weight: 700;
    color: #166534;
    font-size: 9.8px;
    margin-bottom: 2px;
  }
  .next-desc {
    font-size: 9.2px;
    color: #15803d;
    line-height: 1.28;
  }

  /* Footer */
  .footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
    font-size: 8.2px;
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
        <h1>SMOB ENGLISH LAB — KẾ HOẠCH HỌC TẬP CHẮC CHẮN (7 NGÀY)</h1>
        <div class="subtitle">Lộ Trình Củng Cố Vững Chắc Unit 1 ➔ Unit 17 (Bắt đầu: Thứ 7, 19/09 ➔ Thứ 6, 25/09/2026)</div>
      </div>
      <div class="header-badge">
        <div>15 - 20 Phút/Ngày • Không Hời Hợt</div>
        <div style="font-size: 8.8px; opacity: 0.9;">Xem Lý Thuyết Trước ➔ Làm Bài Thực Hành ➔ Khắc Phục Câu Sai</div>
      </div>
    </div>
    
    <!-- Strategy Cards -->
    <div class="strategy-grid">
      <div class="card">
        <div class="card-title"><span class="tag-blue">📖 Xem Lướt Lý Thuyết Trước (5p)</span></div>
        <div class="card-p"><strong>Khởi động nhận diện công thức:</strong> Mở tab Ngữ Pháp xem lướt bảng công thức, dấu hiệu nhận biết & ví dụ mẫu (3-5p) để não bộ có điểm tựa vững vàng trước khi làm bài.</div>
      </div>
      <div class="card">
        <div class="card-title"><span class="tag-purple">✏️ Làm Quiz & Đọc Giải Thích (10-12p)</span></div>
        <div class="card-p"><strong>Thực hành trắc nghiệm tự tin:</strong> Vận dụng ngay lý thuyết vừa xem để làm Quiz. Câu nào làm sai, dành 15s đọc kỹ giải thích chi tiết ngay tại chỗ để bịt lỗ hổng triệt để.</div>
      </div>
      <div class="card">
        <div class="card-title"><span class="tag-amber">🛋️ Buổi Tối: Split View & Sổ Câu Sai</span></div>
        <div class="card-p"><strong>Củng cố sâu không áp lực:</strong> Mở Split View xem lại video cô Mai Phương song song với sách, hoặc vào Sổ Tay Câu Sai làm lại các câu bị sai cho đến khi thuộc lòng.</div>
      </div>
    </div>

    <!-- Table Title -->
    <div class="section-title">
      <span>CHI TIẾT LỊCH TRÌNH 7 NGÀY ÔN TẬP VỮNG CHẮC (19/09 – 25/09/2026)</span>
      <span style="font-size: 9px; font-weight: 500; color: #64748b;">Phần mềm: D:\2.English\phan mem hoc\SMOB English Lab.exe</span>
    </div>

    <!-- Table -->
    <table class="schedule-table">
      <thead>
        <tr>
          <th style="width: 14%;">Thời Gian</th>
          <th style="width: 25%;">Chủ Đề Trọng Tâm</th>
          <th style="width: 22%;">Các Unit Quét</th>
          <th style="width: 28%;">Hành Động Cụ Thể (Lý Thuyết & Thực Hành)</th>
          <th style="width: 11%; text-align: center;">Hoàn Thành</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="day-badge">THỨ 7</span><br><strong style="font-size: 8.5px; color: #475569;">19/09/2026</strong></td>
          <td><strong>Củng Cố Nền Móng: TO BE & Hiện Tại Đơn</strong><br><span style="color: #64748b; font-size: 8.5px;">am/is/are, Wh-questions, V-s/-es, Do/Does, don't/doesn't</span></td>
          <td>
            <span class="unit-pill">Unit 01</span> <span class="unit-pill">Unit 02</span><br>
            <span class="unit-pill">Unit 03</span> <span class="unit-pill">Unit 04</span><br>
            <span class="unit-pill">Unit 05</span> <span class="unit-pill">Unit 06</span><br>
            <span class="unit-pill">Unit 07</span> <span class="unit-pill">Unit 08</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Lướt công thức to be & động từ thường (-s/-es, do/does).<br>
            • <strong>Quiz (12p):</strong> Làm trắc nghiệm Unit 1->8.<br>
            • <strong>Tối (10p):</strong> Xem giải thích câu sai trong Sổ tay. Split View Unit 08 nếu cần.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr style="background: #fffdf5;">
          <td><span class="day-badge" style="background: #b45309;">CHỦ NHẬT</span><br><strong style="font-size: 8.5px; color: #b45309;">20/09/2026</strong></td>
          <td><strong>Bản Lề: Từ Loại & Hiện Tại Tiếp Diễn</strong><br><span style="color: #b45309; font-size: 8.5px;">Vị trí Noun/Adj/Adv, be + V-ing, phân biệt HTĐ vs HTTD</span></td>
          <td>
            <span class="unit-pill unit-pill-highlight">Unit 09 (Từ Loại)</span><br>
            <span class="unit-pill">Unit 10</span> <span class="unit-pill">Unit 11</span>
          </td>
          <td>
            • <strong>Lý thuyết (7p):</strong> Đọc kỹ bảng phân biệt Danh - Động - Tính - Trạng & đuôi nhận biết Unit 09.<br>
            • <strong>Quiz (10p):</strong> Làm trắc nghiệm Unit 09 & 10, 11.<br>
            • <strong>Tối (10p):</strong> Quét chọn text tra từ. Xóa câu đã hiểu trong Sổ tay!
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #b45309; font-weight: 700;">Chắc Gốc</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 2</span><br><strong style="font-size: 8.5px; color: #475569;">21/09/2026</strong></td>
          <td><strong>Quá Khứ Đơn & 40 Động Từ BQT</strong><br><span style="color: #64748b; font-size: 8.5px;">V-ed / V2, didn't + V-inf, Did + S + V-inf?</span></td>
          <td>
            <span class="unit-pill">Unit 12</span> <span class="unit-pill">Unit 13</span><br>
            <span class="unit-pill unit-pill-highlight">⭐ 40 từ BQT</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Đọc quy tắc thêm -ed & trợ động từ didn't/did trong quá khứ.<br>
            • <strong>Quiz (10p):</strong> Làm bài tập Unit 12 & 13.<br>
            • <strong>Tối (10p):</strong> Tab BQT lọc ⭐ 40 từ sao vàng. Quẹt 5-10 thẻ Flashcard 3 cột.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 3</span><br><strong style="font-size: 8.5px; color: #475569;">22/09/2026</strong></td>
          <td><strong>Quá Khứ Tiếp Diễn & Phối Hợp Thì</strong><br><span style="color: #64748b; font-size: 8.5px;">was/were + V-ing, hành động xen vào (When/While)</span></td>
          <td>
            <span class="unit-pill">Unit 14</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Mở Split View xem cô Mai Phương giảng When/While và công thức was/were + V-ing.<br>
            • <strong>Quiz (10p):</strong> Làm bài tập Unit 14.<br>
            • <strong>Tối (10p):</strong> Vào Phòng Luyện BQT làm 10 câu trắc nghiệm 3 cột phản xạ.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 4</span><br><strong style="font-size: 8.5px; color: #475569;">23/09/2026</strong></td>
          <td><strong>Thì Hiện Tại Hoàn Thành</strong><br><span style="color: #64748b; font-size: 8.5px;">have/has + V3, since, for, already, yet, ever, never</span></td>
          <td>
            <span class="unit-pill">Unit 15</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Xem bảng công thức have/has + V3 & các dấu hiệu since/for/already/yet.<br>
            • <strong>Quiz (10p):</strong> Làm bài tập Unit 15.<br>
            • <strong>Tối (10p):</strong> Xem bài giảng Unit 15 tốc độ 1.25x/1.5x để tránh bẫy giữa QKĐ và HTHT.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr>
          <td><span class="day-badge">THỨ 5</span><br><strong style="font-size: 8.5px; color: #475569;">24/09/2026</strong></td>
          <td><strong>Hệ Thì Tương Lai: Đơn & Hoàn Thành</strong><br><span style="color: #64748b; font-size: 8.5px;">will + V-inf, will have + V3, by the time / by + mốc</span></td>
          <td>
            <span class="unit-pill">Unit 16</span> <span class="unit-pill">Unit 17</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Đọc tóm tắt thì Tương lai đơn (will) & Tương lai hoàn thành (will have + V3).<br>
            • <strong>Quiz (10p):</strong> Làm bài Quiz Unit 16 & 17.<br>
            • <strong>Tối (10p):</strong> Tổng kết ngắn lý thuyết Unit 17, đánh dấu các từ vựng mới cần nhớ.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #64748b;">Score: ___%</span>
          </td>
        </tr>
        <tr style="background: #f0fdf4;">
          <td><span class="day-badge" style="background: #166534;">THỨ 6</span><br><strong style="font-size: 8.5px; color: #166534;">25/09/2026</strong></td>
          <td><strong style="color: #166534;">TỔNG ÔN CHẮC CHẮN & MOCK TEST 17 UNITS</strong><br><span style="color: #15803d; font-size: 8.5px;">Quét sạch câu sai trong Sổ tay + Mock test phản xạ</span></td>
          <td>
            <span class="unit-pill" style="background: #dcfce7; color: #166534; border-color: #86efac;">Toàn bộ Unit 01 ➔ 17</span>
          </td>
          <td>
            • <strong>Lý thuyết (5p):</strong> Lướt lại bảng tổng hợp ngữ pháp 17 Units.<br>
            • <strong>Test & Sửa câu sai (15p):</strong> Làm lại toàn bộ câu trong Sổ Tay Câu Sai + Thi thử Mock Test 20 câu Unit 1-17 (mục tiêu >= 80%).<br>
            • <strong>Tối:</strong> <strong>TỐT NGHIỆP 17 UNITS!</strong> Nghỉ ngơi trọn vẹn, sẵn sàng chuyển sang Unit 18.
          </td>
          <td style="text-align: center;">
            <span class="check-box"></span> <br><span style="font-size: 8px; color: #166534; font-weight: 700;">Đạt Chuẩn</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bottom Highlights -->
    <div class="bottom-grid">
      <div class="tips-card">
        <div class="tips-title">⚡ 3 NGUYÊN TẮC VÀNG: HIỂU BẢN CHẤT MỚI LÀM BÀI</div>
        <ul class="tips-list">
          <li><strong>Xem lý thuyết trước 3 - 5 phút:</strong> Đừng đoán mò. Nắm chắc công thức và ví dụ mẫu trước để khi làm bài có phản xạ chính xác.</li>
          <li><strong>Đọc kỹ giải thích khi làm sai:</strong> Sai câu nào đọc giải thích câu đó để hiểu bản chất sâu sắc và nhớ lâu gấp 3 lần.</li>
          <li><strong>Làm sạch Sổ Tay Câu Sai:</strong> Dùng bộ lọc 3 danh mục và bấm "✓ Đã Thuộc / Xóa" để triệt tiêu dứt điểm mọi lỗ hổng kiến thức.</li>
        </ul>
      </div>

      <div class="next-card">
        <div>
          <div class="next-title">🚀 MỤC TIÊU TIẾP THEO (TỪ THỨ 7, 26/09)</div>
          <div class="next-desc">Bắt đầu tiếp thu kiến thức mới từ <strong>Unit 18 (Ngữ âm: Nguyên âm & Phụ âm)</strong> và tiến tới Unit 48 với tâm thế hoàn toàn tự tin, nền móng vững chắc!</div>
        </div>
        <div style="font-size: 8.5px; color: #0369a1; font-weight: 600; margin-top: 1px;">
          App: D:\2.English\phan mem hoc\SMOB English Lab.exe
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>SMOB English Lab (48-Day Foundation Course) • Được lập trình cho: lethanhhuyabc52019</span>
    <span>Ngày cập nhật: 19/09/2026 • Áp dụng: 19/09/2026 – 25/09/2026</span>
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
