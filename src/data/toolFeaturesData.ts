import { ToolFeature, ComparisonRow, FaqItem } from "@/types";

export const toolFeatures: ToolFeature[] = [
  {
    id: "separate-floors",
    number: "01",
    icon: "Split",
    title: {
      en: "Separate Floor — Instant Slab Subdivision",
      vn: "Separate Floor — Tách & Phân Chia Sàn Tự Động",
    },
    problem: {
      en: "Subdividing massive concrete floor slabs along construction joints or separating multi-island floors into individual elements is slow and breaks level references.",
      vn: "Phân chia sàn bê tông lớn theo mạch ngừng thi công hoặc tách các mảng sàn rời rạc thành từng sàn riêng biệt thủ công rất mất thời gian và dễ làm mất cốt cao độ.",
    },
    solution: {
      en: "Instantly separates disjoint slab islands and splits floors by boundary curves with 2 ultra-fast scanning scopes: Active View or Entire Project.",
      vn: "Tự động phát hiện và phân tách các đảo sàn rời rạc, hỗ trợ chia sàn theo đường biên với 2 chế độ quét trực quan: Active View (View hiện hành) hoặc Entire Project (Toàn dự án).",
    },
    value: {
      en: "Splits dozens of complex slabs in 1 click while preserving level offsets, slope definitions, and compound layer types.",
      vn: "Tách hàng chục mảng sàn phức tạp chỉ trong 1 click, giữ nguyên Level offset, độ dốc và cấu tạo lớp sàn.",
    },
    capabilities: {
      en: [
        "Rapid scanning by Active View (default) or Entire Project",
        "Automatic disjoint boundary island detection and extraction",
        "Preserves compound structural layers, slope arrows, and parameters",
      ],
      vn: [
        "Quét nhanh theo Active View (mặc định) hoặc Toàn bộ dự án",
        "Tự động phân tách các đảo sàn độc lập (Disjoint Islands)",
        "Giữ nguyên thuộc tính cao độ, Type sàn và tham số kết cấu",
      ],
    },
  },
  {
    id: "join-unjoin",
    number: "02",
    icon: "Layers",
    title: {
      en: "Auto Join Geometry — Priority Matrix Auto-Joiner",
      vn: "Auto Join Geometry — Tự Động Xử Lý Giao Cắt Thông Minh",
    },
    problem: {
      en: "Volume overlap conflicts between Floors, Columns, Beams, Walls, and Foundations distort concrete quantities and produce messy drawing section cuts.",
      vn: "Xung đột thể tích giữa Sàn, Cột, Dầm, Tường, Móng khiến bảng khối lượng bê tông bị sai lệch và nét cắt bản vẽ bị rối.",
    },
    solution: {
      en: "Auto-detects geometric intersections and executes joins following a customizable Priority Matrix (e.g. Floor cuts Column, Column cuts Beam, Beam cuts Wall) with 1-click Batch Unjoin.",
      vn: "Tự động nhận diện giao cắt và Join hình học theo Ma trận thứ tự ưu tiên (Sàn cắt Cột, Cột cắt Dầm, Dầm cắt Tường, Móng...) kèm chế độ Batch Unjoin.",
    },
    value: {
      en: "Re-engineered spatial bounding box v3.0 processes 5000+ elements in <3s with silent warning suppression — zero freezing.",
      vn: "Thuật toán Bounding Box v3.0 xử lý >5.000 cấu kiện < 3s, khử popup cảnh báo âm thầm, không đơ máy.",
    },
    capabilities: {
      en: [
        "Configurable multi-category priority hierarchy matrix",
        "High-speed Batch Unjoin feature when redesigning structural grids",
        "100% accurate concrete schedule volume extraction",
      ],
      vn: [
        "Tùy chỉnh ma trận thứ tự ưu tiên cắt gọt giữa các Category",
        "Tính năng Tách rời liên kết (Batch Unjoin) nhanh chóng khi cần sửa mô hình",
        "Đảm bảo khối lượng bê tông bóc tách chính xác tuyệt đối",
      ],
    },
  },
  {
    id: "parameter-purger",
    number: "03",
    icon: "Trash2",
    title: {
      en: "Parameter Purger — Deep Parameter Cleaner",
      vn: "Parameter Purger — Dọn Dẹp Tham Số Rác Mô Hình",
    },
    problem: {
      en: "Accumulated junk Shared and Project Parameters from external vendor families bloat project files and cause parameter conflicts.",
      vn: "Dự án tích tụ hàng trăm Shared Parameters, Project Parameters rác từ các Family tải trên mạng làm nặng file và xung đột dữ liệu.",
    },
    solution: {
      en: "Deep-scans project and family definitions, identifies unused or unreferenced parameters, and batch-purges unwanted metadata safely.",
      vn: "Quét sâu toàn bộ mô hình và thư viện Family, lọc theo từ khóa và xóa sạch các tham số rác không sử dụng chỉ trong 1 thao tác.",
    },
    value: {
      en: "Dramatically slashes Revit file size and purifies BIM databases before final handover.",
      vn: "Giảm mạnh dung lượng file Revit, loại bỏ triệt để rác dữ liệu trước khi bàn giao.",
    },
    capabilities: {
      en: [
        "Scans Project Parameters, Shared Parameters, and Family Parameters",
        "Smart filter by keyword, GUID, and utilization status",
        "Fail-safe protection rules for critical built-in system parameters",
      ],
      vn: [
        "Quét cả Project Parameters, Shared Parameters và Family Parameters",
        "Bộ lọc thông minh theo tên, GUID và trạng thái sử dụng",
        "Cơ chế bảo vệ tham số hệ thống an toàn tuyệt đối",
      ],
    },
  },
  {
    id: "auto-numbering",
    number: "04",
    icon: "Hash",
    title: {
      en: "Auto Numbering — Coordinate-Based Tagging",
      vn: "Auto Numbering — Đánh Số & Ký Hiệu Cấu Kiện Tự Động",
    },
    problem: {
      en: "Manual keying of element mark numbers across thousands of piles, columns, doors, and rooms is slow and riddled with duplicate tag errors.",
      vn: "Nhập tay từng số hiệu cho hàng nghìn cọc, cột, cửa, phòng vừa mất thời gian vừa dễ xảy ra trùng lặp hoặc sót cấu kiện.",
    },
    solution: {
      en: "Algorithmic auto-numbering supporting Piles, Columns, Beams, Doors, Windows, Rooms, Parking Bays, and MEP equipment with flexible directional sorting.",
      vn: "Tự động đánh số cho mọi Category (Cọc, Cột, Dầm, Cửa, Phòng, Bãi đỗ xe, MEP...) theo tọa độ không gian (Trái sang Phải, Trên xuống Dưới, Zigzag hoặc theo thứ tự Pick chọn).",
    },
    value: {
      en: "Tags thousands of elements in under 3 seconds with 100% numbering integrity.",
      vn: "Đánh số hàng nghìn cấu kiện trong vài giây, loại bỏ hoàn toàn lỗi trùng số hiệu khi bóc tách khối lượng.",
    },
    capabilities: {
      en: [
        "Directional sorting rules: Left-to-Right, Top-to-Bottom, Zigzag, Pick-order",
        "Custom formatting: Prefixes, Suffixes, leading zeros (001, 002...), increment steps",
        "Dynamic string tokens: Level-Room-Number combination codes",
      ],
      vn: [
        "Đa dạng quy luật sắp xếp: Trái sang Phải, Trên xuống Dưới, Zigzag, Theo thứ tự chọn",
        "Định dạng linh hoạt: Tiền tố, Hậu tố, định dạng số đếm 001, 002..., bước nhảy",
        "Kết hợp thông minh: Mã hiệu tầng - Phòng - Số thứ tự (Level-Room-Number)",
      ],
    },
  },
  {
    id: "batch-rename",
    number: "05",
    icon: "Tag",
    title: {
      en: "Batch Rename — Live-Preview Renaming Suite",
      vn: "Batch Rename — Bộ Công Cụ Đổi Tên Hàng Loạt Chuyên Nghiệp",
    },
    problem: {
      en: "Pressing F2 to rename dozens of views, sheets, levels, and materials to match project BIM execution plans (BEP) is exhausting.",
      vn: "Bấm F2 đổi tên từng view, sheet, family, vật tư theo tiêu chuẩn dự án (BEP / ISO 19650) tốn rất nhiều thời gian.",
    },
    solution: {
      en: "Bulk rename Views, Sheets, Families, Types, Levels, Grids, Materials, and Rooms with Find & Replace, Prefix/Suffix, Case formatting, and Regex.",
      vn: "Đổi tên hàng loạt cho Views, Sheets, Families, Types, Levels, Grids, Materials, Rooms với đầy đủ tính năng Tìm & Thay thế, Thêm Prefix/Suffix, Đổi chữ HOA/thường và Regex.",
    },
    value: {
      en: "Features a Real-Time Live Preview table to inspect old vs new names before applying.",
      vn: "Tích hợp bảng Live Preview xem trước kết quả thời gian thực trước khi áp dụng, đảm bảo chính xác 100%.",
    },
    capabilities: {
      en: [
        "Live before/after comparison table prevents unintended changes",
        "Supports standard casing transformations (UPPERCASE, lowercase, Title Case)",
        "Advanced string replacements with regex support",
      ],
      vn: [
        "Bảng so sánh Tên cũ vs Tên mới trực quan, không lo đổi nhầm",
        "Hỗ trợ chuyển đổi nhanh định dạng chữ HOA, thường, Title Case",
        "Tìm kiếm và thay thế chuỗi ký tự nâng cao hỗ trợ Regex",
      ],
    },
  },
  {
    id: "save-family",
    number: "06",
    icon: "Package",
    title: {
      en: "Save Family — 1-Click Library Batch Export",
      vn: "Save Family — Xuất & Phân Loại Thư Viện Hàng Loạt",
    },
    problem: {
      en: "Extracting all loadable families from large project files requires opening and saving each one individually — consuming hours of tedious work.",
      vn: "Khi cần lấy toàn bộ Family từ file dự án lớn, việc mở từng Family rồi lưu thủ công tốn hàng giờ đồng hồ.",
    },
    solution: {
      en: "Exports every Loadable Family (.rfa) into clean local folders grouped automatically by Revit category (Doors, Windows, Columns, Framing, Furniture).",
      vn: "Xuất toàn bộ Loadable Family (.rfa) trong dự án ra ổ cứng chỉ với 1 click, tự động tạo cây thư mục và gom nhóm theo đúng Category.",
    },
    value: {
      en: "Saves 8+ hours when establishing company-wide template libraries.",
      vn: "Tiết kiệm 8+ giờ khi xây dựng kho thư viện mẫu (Template Library) cho doanh nghiệp.",
    },
    capabilities: {
      en: [
        "Automatic categorization by Revit system classes",
        "Clean file name sanitization without weird prefix garbage",
        "Instant backup of project content before model purging",
      ],
      vn: [
        "Tự động gom nhóm theo danh mục chuẩn của Revit",
        "Chuẩn hóa tên file sạch, dễ quản lý",
        "Sao lưu tức thì toàn bộ thư viện trước khi dọn dẹp file",
      ],
    },
  },
  {
    id: "join-control",
    number: "07",
    icon: "Link2Off",
    title: {
      en: "Join Control — Batch Disallow / Allow Joins",
      vn: "Join Control — Khóa / Mở Nút Giao Cấu Kiện",
    },
    problem: {
      en: "Revit automatically snaps and miter-joins wall ends and structural framing out-of-spec, distorting design geometry and centerlines.",
      vn: "Revit tự động giật đầu dầm/tường làm vát mép hoặc lệch tim trục ngoài ý muốn, gây sai hình học thiết kế.",
    },
    solution: {
      en: "Select hundreds of walls or structural framing beams and batch switch Disallow Join / Allow Join states at both ends instantly.",
      vn: "Quét chọn hàng loạt Tường (Walls) hoặc Dầm kết cấu (Framing) và chuyển đổi đồng loạt trạng thái Disallow Join hoặc Allow Join ở cả 2 đầu.",
    },
    value: {
      en: "Locks exact engineering positions and prevents unintentional geometric distortions.",
      vn: "Khóa cứng vị trí hình học chuẩn xác, kiểm soát nút giao cấu kiện tuyệt đối.",
    },
    capabilities: {
      en: [
        "Dual-end simultaneous lock/unlock control",
        "Filter by selection set, level, or active floor plan view",
        "Preserves framing cardinal insertion points",
      ],
      vn: [
        "Kiểm soát khóa/mở cùng lúc 2 đầu cấu kiện",
        "Lọc linh hoạt theo vùng chọn hoặc theo từng tầng",
        "Bảo toàn tim trục và điểm định vị dầm kết cấu",
      ],
    },
  },
  {
    id: "view-filters",
    number: "08",
    icon: "Filter",
    title: {
      en: "View Filters — Multi-View Filter Sync",
      vn: "View Filters — Quản Lý Bộ Lọc Hiển Thị Đa View",
    },
    problem: {
      en: "Applying and tweaking graphic override filters one by one across dozens of views in Visibility/Graphics (VG) is repetitive and prone to inconsistency.",
      vn: "Bật/tắt và sao chép bộ lọc hiển thị (View Filters) thủ công trên từng view làm việc qua bảng Visibility/Graphics rất mất thời gian.",
    },
    solution: {
      en: "Batch enable, disable, and copy graphic filters across dozens of active views and sheets simultaneously.",
      vn: "Quản lý, bật/tắt và đồng bộ cài đặt Filter từ view này sang hàng loạt view khác chỉ trong vài giây.",
    },
    value: {
      en: "Standardizes graphic color coding and line weights project-wide in seconds.",
      vn: "Đồng bộ màu sắc hiển thị và chuẩn đồ họa bản vẽ cho toàn dự án nhanh chóng.",
    },
    capabilities: {
      en: [
        "Bulk toggle visibility states across view collections",
        "Copy filter overrides without overriding entire View Templates",
        "Instant visual check for clash highlight filters",
      ],
      vn: [
        "Bật/tắt đồng loạt trạng thái hiển thị trên nhiều view",
        "Sao chép thiết lập Filter mà không ảnh hưởng tới View Template",
        "Kiểm soát trực quan các bộ lọc phân màu kiểm tra xung đột",
      ],
    },
  },
  {
    id: "duplicate",
    number: "09",
    icon: "Copy",
    title: {
      en: "Duplicate — Batch View & Sheet Duplicator",
      vn: "Duplicate — Nhân Bản View & Sheet Chuyên Sâu",
    },
    problem: {
      en: "Setting up new design phase sheets (-SD, -DD, -CD) and creating corresponding floor views manually is exceptionally slow.",
      vn: "Chuẩn bị hồ sơ theo các giai đoạn thiết kế (-SD, -DD, -CD) và nhân bản từng sheet thủ công làm chậm tiến độ phát hành bản vẽ.",
    },
    solution: {
      en: "Duplicates views in bulk (Duplicate, With Detailing, or As Dependent) with automated prefix/suffix rules and duplicates sheets preserving viewport layouts.",
      vn: "Nhân bản hàng loạt View theo nhiều chế độ kèm tiền tố/hậu tố tự động; nhân bản Sheet giữ nguyên khung tên và vị trí sắp xếp Viewport.",
    },
    value: {
      en: "Prepares complete drawing submittal sets 10× faster than manual drafting.",
      vn: "Dàn trang và chuẩn bị hồ sơ bản vẽ nhanh gấp 10 lần so với làm thủ công.",
    },
    capabilities: {
      en: [
        "Automated phase prefix/suffix insertion (-FOR APPROVAL, -CD)",
        "Retains 2D drafting details and annotations accurately",
        "Sheet-level duplication with title block synchronization",
      ],
      vn: [
        "Tự động thêm tiền tố/hậu tố theo giai đoạn phát hành",
        "Giữ nguyên ghi chú 2D và đường gióng chi tiết",
        "Nhân bản khung tên và giữ nguyên bố cục dàn trang bản vẽ",
      ],
    },
  },
  {
    id: "reset-view",
    number: "10",
    icon: "RotateCcw",
    title: {
      en: "Reset View — Instant View State Recovery",
      vn: "Reset View — Khôi Phục Hiển Thị View Tức Thì",
    },
    problem: {
      en: "Forgotten Temporary Hide/Isolate states (Sunglasses) lead to missing elements in exported drawing sets and costly submittal re-prints.",
      vn: "Quên tắt chế độ ẩn tạm thời (Kính mát) dẫn đến in thiếu cấu kiện, xuất sai hồ sơ phát hành và tốn chi phí in lại.",
    },
    solution: {
      en: "1-Click instant reset of temporary isolate modes, crop regions, and visual overrides back to standard working configuration.",
      vn: "1 Click khôi phục ngay lập tức trạng thái ẩn/hiện tạm thời (Temporary Hide/Isolate), đưa Crop Region về trạng thái chuẩn.",
    },
    value: {
      en: "Eliminates embarrassing missing-element drawing issuance mistakes.",
      vn: "Ngăn ngừa 100% rủi ro in sót cấu kiện hoặc sai lệch hồ sơ phát hành.",
    },
    capabilities: {
      en: [
        "Batch reset across active view or entire project sheet sets",
        "Recalibrates crop boundary box limits",
        "Ensures drawing compliance prior to PDF batch publishing",
      ],
      vn: [
        "Khôi phục nhanh cho view hiện hành hoặc toàn bộ view dự án",
        "Chuẩn hóa lại đường biên khung nhìn (Crop Region)",
        "Đảm bảo an toàn tuyệt đối trước khi xuất file in ấn",
      ],
    },
  },
  {
    id: "elevation-check-suite",
    number: "11",
    icon: "Ruler",
    title: {
      en: "Elevation Check Suite — 3-Tier Spectrum Color-Coding & QA/QC",
      vn: "Elevation Check Suite — Bộ Kiểm Tra Cao Độ 3 Cấp & Phân Màu Trực Quan",
    },
    problem: {
      en: "Floors, footings, framing beams, and walls modeled with subtle elevation offsets, inverted top/bottom levels, or wrong datum references are difficult to spot in large 3D models.",
      vn: "Sàn, móng, dầm, vách bị đặt lệch cốt, sai Offset âm/dương hoặc gán nhầm Reference Level rất khó phát hiện bằng mắt thường trên mô hình lớn.",
    },
    solution: {
      en: "1-Click automated spectrum color-coding: Base Elevation (Floors/Framing Top vs Columns/Walls Bottom), Wall Top Elevation (Green spectrum), Top Elevation (Blue-Violet spectrum), and 1-Click Reset Elevation Filter.",
      vn: "Phân màu tự động 1-click theo 3 dải phổ: Base Elevation (Top Sàn/Dầm vs Bottom Cột/Tường theo phổ Đỏ-Cam), Wall Top Elevation (phổ Xanh lá), Top Elevation (phổ Xanh dương-Tím), và 1-Click Reset khôi phục màu gốc.",
    },
    value: {
      en: "Eliminates 100% of costly on-site elevation mismatch blunders in seconds before drawing issue.",
      vn: "Phát hiện và triệt tiêu 100% rủi ro sai lệch cao độ ngoài công trường chỉ trong vài giây trước khi phát hành hồ sơ.",
    },
    capabilities: {
      en: [
        "Base Elevation: Color-codes Bottom of Columns/Walls vs Top of Slabs/Framing",
        "Wall Top & Top Elevation: High-visibility multi-category spectrum shaders",
        "1-Click Reset Elevation Filter: Instantly clears graphic overrides back to original",
      ],
      vn: [
        "Base Elevation: Phân màu đáy Cột/Tường so với mặt trên Sàn/Dầm/Móng",
        "Wall Top & Top Elevation: Trực quan hóa đỉnh Tường và đỉnh toàn bộ cấu kiện kết cấu",
        "1-Click Reset Filter: Xóa bộ lọc kiểm tra cao độ, khôi phục màu vật liệu gốc tức thì",
      ],
    },
  },
  {
    id: "license-about",
    number: "12",
    icon: "KeyRound",
    title: {
      en: "License & About — Hardware-Locked Security & Update Hub",
      vn: "License & About — Bản Quyền Khóa Máy & Trung Tâm Cập Nhật",
    },
    problem: {
      en: "Generic plugins lose activations after PC reinstallation or Revit upgrades with no transparent channel for instant update verification.",
      vn: "Các plugin thông thường hay bị mất bản quyền khi cài lại máy, không có cơ chế tự động nhận diện và thiếu nút kiểm tra cập nhật.",
    },
    solution: {
      en: "Proportional zero-scrollbar About dialog with 1-click live update check against server, paired with permanent hardware-locked machine licensing.",
      vn: "Cửa sổ About chuẩn tỉ lệ 560 × 445px tích hợp nút Kiểm tra Cập nhật trực tiếp kết nối server, đi kèm bản quyền Hardware-Locked an toàn vĩnh viễn.",
    },
    value: {
      en: "Permanent multi-engine compatibility across Revit 2020–2026 on your machine with 1-click updates.",
      vn: "Bản quyền vĩnh viễn gắn liền với máy tính, tự động nhận diện mọi phiên bản Revit 2020–2026 chỉ trong 1 click.",
    },
    capabilities: {
      en: [
        "1-Click live server update check with instant release status",
        "Unique Hardware Machine Code (SMOB-HW-XXXX) binding",
        "Official 3D Isometric branding and direct support contact",
      ],
      vn: [
        "Nút Kiểm tra cập nhật trực tiếp kết nối máy chủ",
        "Mã bản quyền khóa cứng theo thiết bị duy nhất (Machine Code)",
        "Nhận diện logo 3D Isometric chính thức và liên hệ hỗ trợ tức thì",
      ],
    },
  },
];

export const comparisonTableData: ComparisonRow[] = [
  {
    task: {
      en: "Join Geometries (Auto Join)",
      vn: "Join hình học cấu kiện (Auto Join)",
    },
    manual: {
      en: "Click each intersection one-by-one (takes days)",
      vn: "Click từng cấu kiện thủ công (mất nhiều ngày)",
    },
    smobim: {
      en: "Auto-joins by rule priority matrix in seconds",
      vn: "Tự động Join theo luật ưu tiên (vài chục giây)",
    },
    improvement: {
      en: "90% Faster",
      vn: "Nhanh hơn 90%",
    },
  },
  {
    task: {
      en: "Batch Rename (Views / Sheets / Families)",
      vn: "Đổi tên hàng loạt (Views / Sheets / Families)",
    },
    manual: {
      en: "Press F2 to rename individual items one by one",
      vn: "Bấm F2 đổi tên từng đối tượng thủ công",
    },
    smobim: {
      en: "Processes hundreds of items with Live Preview in 1 click",
      vn: "Xử lý hàng trăm đối tượng trong 1 click có Live Preview",
    },
    improvement: {
      en: "95% Faster",
      vn: "Nhanh hơn 95%",
    },
  },
  {
    task: {
      en: "Element Auto Numbering (Piles, Columns, Doors)",
      vn: "Đánh số cấu kiện (Cọc, Cột, Cửa, Phòng)",
    },
    manual: {
      en: "Manual typing; prone to duplicates and skipped numbers",
      vn: "Nhập tay từng số; dễ trùng lặp và sót cấu kiện",
    },
    smobim: {
      en: "Automated coordinate & direction-based numbering",
      vn: "Đánh số tự động theo tọa độ, hướng và thứ tự",
    },
    improvement: {
      en: "100% Accuracy",
      vn: "Chính xác 100%",
    },
  },
  {
    task: {
      en: "Extract Family Library (Save Family)",
      vn: "Trích xuất thư viện Family (Save Family)",
    },
    manual: {
      en: "Open each family file individually -> Save As",
      vn: "Mở từng Family trong file -> Bấm Save As từng cái",
    },
    smobim: {
      en: "1-Click exports and categorizes entire library",
      vn: "1 Click xuất sạch kho thư viện chuẩn hóa theo danh mục",
    },
    improvement: {
      en: "Saves 8+ Hours",
      vn: "Tiết kiệm 8+ giờ",
    },
  },
  {
    task: {
      en: "Elevation Offset Verification (QA/QC)",
      vn: "Kiểm tra cao độ sàn (Elevation Check)",
    },
    manual: {
      en: "Cut endless section lines to measure offsets manually",
      vn: "Cắt hàng loạt mặt cắt để đo từng vị trí",
    },
    smobim: {
      en: "Automated full-floor scan detects offset errors instantly",
      vn: "Quét tự động toàn bộ tầng, phát hiện lệch cốt ngay",
    },
    improvement: {
      en: "Zero On-Site Errors",
      vn: "Triệt tiêu lỗi công trường",
    },
  },
];

export const faqData: FaqItem[] = [
  {
    question: {
      en: "What specific Revit tasks can SMOB automate?",
      vn: "Những tác vụ Revit nào có thể tự động hóa với SMOB?",
    },
    answer: {
      en: "SMOB automates almost all repetitive tasks in Autodesk Revit: batch element joining/unjoining with priority rules, coordinate-based renumbering (piles, columns, doors, rooms), batch renaming with live preview, multi-view filter synchronization, full loadable family library extraction, batch view and sheet duplication with viewport retention, and automated floor elevation offset auditing.",
      vn: "SMOB tự động hóa hầu hết các tác vụ lặp lại tốn thời gian: tự động join/unjoin hình học theo ma trận ưu tiên, đánh số tự động theo tọa độ (cọc, cột, cửa, phòng, MEP), đổi tên hàng loạt có xem trước thời gian thực, đồng bộ View Filters, trích xuất toàn bộ thư viện Family ra ổ cứng, nhân bản view/sheet giữ nguyên bố cục và kiểm tra sai lệch cao độ sàn tự động.",
    },
  },
  {
    question: {
      en: "Do you build custom Dynamo scripts or bespoke Revit API Add-ins for specific project needs?",
      vn: "SMOB có nhận viết Dynamo script hoặc phát triển Revit Add-in theo yêu cầu không?",
    },
    answer: {
      en: "Yes, absolutely! In addition to the packaged SMOB Add-in, we develop custom Dynamo visual programming scripts, Python algorithms, and dedicated C#/.NET Revit Add-ins tailored to your firm's unique workflows, custom parameter standards, Excel bi-directional integration, and internal QA/QC requirements.",
      vn: "Chắc chắn có! Bên cạnh bộ công cụ SMOB Add-in đóng gói sẵn, chúng tôi chuyên nhận lập trình Dynamo script, thuật toán Python và phát triển Revit Add-in riêng bằng C#/.NET theo đúng quy trình nội bộ, hệ thống tham số chuẩn hóa, kết nối Excel 2 chiều và tiêu chuẩn kiểm soát chất lượng (QA/QC) của doanh nghiệp bạn.",
    },
  },
  {
    question: {
      en: "Can SMOB model full architectural and structural BIM projects directly from 2D PDF / DWG drawings?",
      vn: "SMOB có nhận dựng mô hình BIM hoàn chỉnh từ bản vẽ 2D PDF / DWG không?",
    },
    answer: {
      en: "Yes. Our core engineering team has extensive production experience delivering complex reinforced concrete structures, high-rise towers, multi-building campuses, hotels, and luxury villas end-to-end directly from 2D CAD and PDF sets, ensuring coordinated geometry, zero clashes, and accurate quantity take-off data.",
      vn: "Có. Đội ngũ kỹ sư của chúng tôi có kinh nghiệm thực chiến dày dặn trong việc dựng mô hình BIM kiến trúc & kết cấu trọn gói từ bản vẽ 2D CAD/PDF cho các dự án cao tầng, trường học nhiều khối nhà, khách sạn và biệt thự dân dụng, đảm bảo hình học chuẩn xác, không xung đột và bóc tách khối lượng tin cậy.",
    },
  },
  {
    question: {
      en: "Can SMOB comply with our internal company BIM standards and Project BIM Execution Plan (BEP)?",
      vn: "SMOB có thể làm theo tiêu chuẩn BIM (BIM Standard / BEP) của công ty tôi không?",
    },
    answer: {
      en: "Yes. We rigorously adopt your naming conventions, parameter naming schemas, shared parameter files, title block layouts, View Templates, and browser organization to ensure the final models and drawings integrate seamlessly with your firm's standard deliverables.",
      vn: "Hoàn toàn tuân thủ. Chúng tôi tiếp nhận và áp dụng nghiêm ngặt các quy chuẩn đặt tên, cây thư mục Project Browser, hệ thống Shared Parameters, khung tên và View Template theo đúng tiêu chuẩn nội bộ hoặc BEP dự án của bạn để bàn giao mô hình đồng bộ 100%.",
    },
  },
  {
    question: {
      en: "Is the SMOB Add-in a monthly subscription or a one-time lifetime license?",
      vn: "SMOB Add-in có phải trả phí duy trì hàng tháng không?",
    },
    answer: {
      en: "SMOB Add-in is 100% lifetime ownership. There are NO recurring monthly or annual subscription fees. You pay once (Early-bird special: 149.000 VNĐ / $9 USD) and use it permanently.",
      vn: "SMOB Add-in sở hữu vĩnh viễn với hình thức thanh toán một lần duy nhất. Không có bất kỳ khoản phí duy trì hàng tháng hay hàng năm nào (Giá ưu đãi ra mắt chỉ 149.000 VNĐ hoặc $9 USD cho 50 suất đầu tiên).",
    },
  },
  {
    question: {
      en: "What is included in the $9 USD / 149.000 VNĐ early-bird lifetime package?",
      vn: "Gói ưu đãi 149.000 VNĐ / 9 USD dùng vĩnh viễn bao gồm những gì?",
    },
    answer: {
      en: "The package includes all 12 core Revit productivity modules: Separate Floor, Smart Auto Join & Batch Unjoin Geometry, 3-Tier Elevation Check Suite (Base, Wall Top, Top + Reset Filter), Parameter Purger, Auto Numbering, Batch Rename Master, Save Family, Join Control (End Join), View Filters Sync, Duplicate, Reset View, and License & About Manager with 1-click update checks and continuous releases.",
      vn: "Gói bao gồm toàn bộ 12 module công cụ tăng năng suất Revit cốt lõi: Tách sàn (Separate Floor), Tự động Join & Batch Unjoin hình học thông minh, Bộ kiểm tra cao độ 3 cấp (Elevation Check Suite: Base, Wall Top, Top + Reset Filter), Dọn dẹp tham số (Parameter Purger), Đánh số tự động (Auto Numbering), Đổi tên hàng loạt (Batch Rename Master), Trích xuất thư viện (Save Family), Khóa nút giao (Join Control), Đồng bộ View Filters, Nhân bản View/Sheet (Duplicate), Khôi phục hiển thị (Reset View) và Trình quản lý bản quyền & About với nút kiểm tra cập nhật tức thì.",
    },
  },
  {
    question: {
      en: "How quickly can we kick off a BIM modeling or automation development project?",
      vn: "Bao lâu thì có thể bắt đầu triển khai dự án cùng SMOB?",
    },
    answer: {
      en: "We can start immediately upon reviewing your input drawings, parameter specifications, and project scope. Following a brief 30-minute discovery consultation, we provide a detailed proposal and delivery schedule within 24 hours.",
      vn: "Chúng tôi có thể bắt đầu ngay sau khi tiếp nhận và rà soát tài liệu đầu vào (bản vẽ 2D, tiêu chuẩn thông số và phạm vi công việc). Sau buổi trao đổi nhanh 30 phút, SMOB sẽ gửi kế hoạch thực hiện chi tiết trong vòng 24 giờ.",
    },
  },
  {
    question: {
      en: "Do you provide team training and operational handover documentation?",
      vn: "SMOB có bàn giao tài liệu hướng dẫn sử dụng và hỗ trợ đào tạo team không?",
    },
    answer: {
      en: "Yes. Every custom automation script, API add-in, and complex BIM model is delivered with clear video demonstrations, user guides, and parameter mapping documents. We also offer interactive handover sessions to ensure your team is 100% self-sufficient.",
      vn: "Có. Mọi sản phẩm script tự động hóa, Revit Add-in hoặc mô hình BIM đều được bàn giao kèm video hướng dẫn, tài liệu quy chuẩn tham số rõ ràng và các buổi hướng dẫn trực tiếp để đảm bảo đội ngũ của bạn làm chủ công nghệ hoàn toàn.",
    },
  },
];
