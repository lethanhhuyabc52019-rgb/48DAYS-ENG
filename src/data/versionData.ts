export interface ReleaseVersion {
  version: string;
  badge: { en: string; vn: string };
  isLatest: boolean;
  releaseDate: { en: string; vn: string };
  revitSupport: string[];
  setupFileName: string;
  setupFileSize: string;
  setupDownloadUrl: string;
  uninstallFileName: string;
  uninstallFileSize: string;
  uninstallDownloadUrl: string;
  highlights: { en: string; vn: string }[];
  changelog: {
    type: "new" | "enhanced" | "fix" | "security";
    title: { en: string; vn: string };
    desc: { en: string; vn: string };
  }[];
}

export const releaseVersions: ReleaseVersion[] = [
  {
    version: "v2026.12.8 Pro",
    badge: { en: "Latest Stable", vn: "Bản mới nhất" },
    isLatest: true,
    releaseDate: { en: "September 2026", vn: "Tháng 09/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "Advanced Auto-Numbering Engine v2.5 with Dynamic Prefix/Suffix & Directional Sorting",
        vn: "Nâng cấp thuật toán Auto-Numbering v2.5: Tiền tố/Hậu tố linh hoạt và sắp xếp đa hướng",
      },
      {
        en: "Enhanced 3-Tier Elevation Check Suite (Base, Wall Top & Top Elevation)",
        vn: "Tối ưu hóa bộ công cụ Elevation Check 3 cấp: Phân tích cao độ theo dải màu trực quan",
      },
      {
        en: "Enterprise-Grade Obfuscated Binary Architecture for Maximum IP Protection",
        vn: "Bảo vệ mã nguồn lõi bằng kiến trúc Obfuscated đạt chuẩn bảo mật phần mềm",
      },
      {
        en: "Zero-Scrollbar About Window & Proportional Card Layout (560 × 445px)",
        vn: "Tinh chỉnh giao diện About chuẩn tỉ lệ 560 × 445px, không thanh cuộn rườm rà",
      },
      {
        en: "High-Performance Auto-Join & Batch Unjoin Geometry v3.0 (>5000 elements < 3s)",
        vn: "Thuật toán Auto-Join & Batch Unjoin v3.0 siêu tốc (xử lý >5.000 cấu kiện < 3s)",
      },
      {
        en: "Unified All-In-One ZIP Package with Bundled Cleaner Uninstaller",
        vn: "Bộ cài All-In-One ZIP tích hợp sẵn công cụ gỡ cài đặt sạch sẽ SMOB_Uninstall.exe",
      },
    ],
    changelog: [
      {
        type: "enhanced",
        title: {
          en: "Auto-Numbering Engine Optimization v2.5",
          vn: "Tối Ưu Hóa Module Đánh Số Tự Động (Auto-Numbering v2.5)",
        },
        desc: {
          en: "Upgraded renumbering algorithm supporting custom prefix/suffix masks, coordinate vector sorting (Left-to-Right, Top-to-Bottom, or Z-level order), and batch element parameter writing in single transaction.",
          vn: "Nâng cấp thuật toán đánh số cấu kiện tự động với tiền tố/hậu tố tùy biến, sắp xếp theo ma trận tọa độ không gian và ghi tham số hàng loạt trong một transaction duy nhất.",
        },
      },
      {
        type: "security",
        title: {
          en: "Enterprise Obfuscation & License Protection",
          vn: "Mã Hóa & Chống Dịch Ngược Mã Nguồn Lõi (Code Protection)",
        },
        desc: {
          en: "Applied deep symbol renaming and control flow obfuscation to protect core intellectual property and prevent reverse-engineering of automation algorithms.",
          vn: "Ứng dụng cơ chế làm rối mã nguồn sâu (Obfuscar Mapping) giúp bảo vệ tối đa thuật toán lõi và chống dịch ngược phần mềm.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Elevation Check Suite Refinements",
          vn: "Hoàn Thiện Bộ Phân Màu Cao Độ (Elevation Check Suite)",
        },
        desc: {
          en: "Refined color palettes and visual thresholds for Base Elevation, Wall Top, and Top Elevation views with instant 1-click filter reset.",
          vn: "Tinh chỉnh dải màu trực quan và ngưỡng phân cấp cho Base Elevation, Wall Top và Top Elevation kèm tính năng khôi phục màu chỉ trong 1 click.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "All-in-One Multi-Revit Packaging (2020–2026)",
          vn: "Đóng Gói Cài Đặt Đồng Bộ Đa Phiên Bản Revit (2020–2026)",
        },
        desc: {
          en: "Integrated automated manifest registration across Revit 2020 through 2026, bundled inside a lightweight 1.6 MB ZIP archive.",
          vn: "Tự động đăng ký add-in manifest trên toàn bộ phiên bản Revit từ 2020 đến 2026, đóng gói siêu nhẹ chỉ 1.6 MB.",
        },
      },
    ],
  },
  {
    version: "v2026.12.5 Pro",
    badge: { en: "Previous Version", vn: "Bản tiền nhiệm" },
    isLatest: false,
    releaseDate: { en: "September 2026", vn: "Tháng 09/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "Official 3D Isometric Brand Logo Integration in About Window & Setup.exe",
        vn: "Cập nhật Logo nhận diện thương hiệu SMOB 3D Isometric & tích hợp Setup.exe",
      },
      {
        en: "Zero-Scrollbar About Window & Proportional Card Layout (560 × 445px)",
        vn: "Tinh chỉnh giao diện About chuẩn tỉ lệ 560 × 445px, không thanh cuộn rườm rà",
      },
      {
        en: "Full Elevation Check Suite: Base, Wall Top & Top Elevation Color-Coding",
        vn: "Bộ công cụ Elevation Check: Kiểm tra cao độ Base, Wall Top, Top theo dải màu trực quan",
      },
      {
        en: "Streamlined Separate Floors (Floor Splitter) with Active View & Entire Project scoping",
        vn: "Tối giản hóa tính năng Tách Sàn: Quét nhanh theo Active View hoặc Toàn bộ Dự án",
      },
      {
        en: "High-Performance Auto-Join & Batch Unjoin Geometry v3.0 (>5000 elements < 3s)",
        vn: "Thuật toán Auto-Join & Batch Unjoin v3.0 siêu tốc (xử lý >5.000 cấu kiện < 3s)",
      },
      {
        en: "Unified All-In-One Installer for Autodesk Revit 2020 through Revit 2026",
        vn: "Bộ cài All-In-One tích hợp hỗ trợ đầy đủ Autodesk Revit 2020 đến Revit 2026",
      },
    ],
    changelog: [
      {
        type: "new",
        title: {
          en: "3-Tier Structural Elevation Check Suite",
          vn: "Bộ Công Cụ Kiểm Tra Cao Độ Kết Cấu 3 Cấp (Elevation Check Suite)",
        },
        desc: {
          en: "Introduced dedicated 1-click elevation color-coding tools: Base Elevation (Floor/Framing Top vs Column/Wall Bottom in Red-Orange spectrum), Wall Top Elevation (Green spectrum), and Top Elevation (Blue-Violet spectrum) with 1-click Reset Elevation Filter.",
          vn: "Bổ sung bộ công cụ phân màu cao độ 1-click trực quan: Base Elevation (Top Sàn/Dầm vs Bottom Cột/Tường theo phổ Đỏ-Cam), Wall Top Elevation (phổ Xanh lá), và Top Elevation (phổ Xanh dương-Tím), đi kèm nút Reset khôi phục hiển thị ban đầu tức thì.",
        },
      },
      {
        type: "new",
        title: {
          en: "Official 3D Isometric Brand Logo Integration",
          vn: "Tích hợp Logo nhận diện thương hiệu SMOB 3D Isometric chính thức",
        },
        desc: {
          en: "Embedded high-resolution isometric 3D brand logo into the About modal and directly integrated into the Setup.exe compiler pipeline.",
          vn: "Nhúng logo 3D Isometric chính thức độ phân giải cao vào hộp thoại About và biên dịch trực tiếp vào bộ cài đặt Setup.exe.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Zero-Scrollbar About Window & Proportional Layout (560 × 445px)",
          vn: "Cân đối giao diện About chuẩn tỉ lệ 560 × 445px (Zero Scrollbar)",
        },
        desc: {
          en: "Refactored dialog layout into clean proportional cards with perfect vertical rhythm, zero scrollbars, direct Update Check against server, and permanent hardware-locked license status.",
          vn: "Tối ưu hóa bố cục giao diện thẻ tỷ lệ chuẩn 560 × 445px, loại bỏ hoàn toàn thanh cuộn chuột, tích hợp nút Kiểm tra Cập nhật server và hiển thị mã bản quyền khóa máy vĩnh viễn.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Separate Floors (Floor Splitter) Engine Optimization",
          vn: "Tối ưu hóa tính năng Tách Sàn (Separate Floors)",
        },
        desc: {
          en: "Rapid spatial separation of disjoint slab panels and boundary line subdivisions with 2 intuitive options: Active View (default) or Entire Project, preserving level offsets and compound layer structures.",
          vn: "Phân tách các đảo sàn độc lập và chia nhỏ sàn theo đường biên siêu tốc với 2 phạm vi trực quan: Active View (mặc định) hoặc Toàn bộ Dự án, bảo toàn hoàn hảo cao độ và cấu tạo lớp sàn.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Auto-Join & Batch Unjoin Geometry Engine v3.0",
          vn: "Nâng cấp thuật toán Auto-Join & Batch Unjoin Geometry v3.0",
        },
        desc: {
          en: "Optimized spatial bounding box tree solver. Handles complex multi-category intersection priorities (Floor > Column > Beam > Wall > Foundations) across 5,000+ elements in under 3 seconds with background warning suppression.",
          vn: "Nâng cấp thuật toán cây Bounding Box không gian. Tự động xử lý ma trận ưu tiên giao cắt (Sàn > Cột > Dầm > Tường > Móng) trên hơn 5.000 cấu kiện chỉ trong 3 giây, tự động tắt các popup cảnh báo ngầm.",
        },
      },
      {
        type: "security",
        title: {
          en: "Dedicated Clean Uninstaller Suite",
          vn: "Bộ Gỡ Cài Đặt SMOB_Uninstall.exe Chuẩn Hóa",
        },
        desc: {
          en: "Provides single-click clean removal of add-in manifests, cached binaries, and ribbon registries without disturbing third-party plugins.",
          vn: "Cung cấp công cụ SMOB_Uninstall.exe giúp gỡ sạch sẽ toàn bộ file manifest, cache và ribbon registry chỉ trong 1 click mà không ảnh hưởng đến các plugin Revit khác.",
        },
      },
    ],
  },
  {
    version: "v2026.11.0 Pro",
    badge: { en: "Previous Version", vn: "Bản tiền nhiệm" },
    isLatest: false,
    releaseDate: { en: "August 2026", vn: "Tháng 08/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "Official 3D Isometric Brand Logo Integration in About Window & Setup",
        vn: "Cập nhật Logo nhận diện thương hiệu SMOB 3D Isometric & tích hợp Setup.exe",
      },
      {
        en: "Zero-Scrollbar About Window & Proportional Layout (560 × 445px)",
        vn: "Tinh chỉnh giao diện About chuẩn tỉ lệ 560 × 445px, không tràn viền",
      },
      {
        en: "Streamlined Separate Floors (Floor Splitter) with Active View & Entire Project scoping",
        vn: "Tối giản hóa tính năng Tách Sàn: Quét nhanh theo Active View hoặc Toàn bộ Dự án",
      },
      {
        en: "Unified All-In-One Installer for Revit 2020 through Revit 2026",
        vn: "Bộ cài All-In-One tích hợp cho Autodesk Revit 2020 đến Revit 2026",
      },
      {
        en: "Direct single-click .exe installer & dedicated uninstaller",
        vn: "Bộ cài trực tiếp .EXE không cần giải nén & file gỡ cài đặt tiện lợi",
      },
    ],
    changelog: [
      {
        type: "new",
        title: {
          en: "Official 3D Isometric Brand Logo Integration",
          vn: "Cập nhật Logo nhận diện thương hiệu SMOB 3D Isometric",
        },
        desc: {
          en: "Embedded high-resolution isometric 3D logo into the About modal and directly integrated into the Setup.exe package.",
          vn: "Tích hợp logo 3D Isometric chính thức vào cửa sổ thông tin About và nhúng trực tiếp vào bộ cài Setup.exe.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Zero-Scrollbar About Window & UI Polish",
          vn: "Tinh chỉnh giao diện About cân đối (Zero Scrollbar)",
        },
        desc: {
          en: "Optimized dialog frame to 560 × 445px with proportional card styling, clean typography, eliminating overflow scrollbars, and refining the Update Check action.",
          vn: "Cân chỉnh tỉ lệ cửa sổ 560 × 445px, các khối Card co giãn chuẩn xác, loại bỏ hoàn toàn thanh cuộn chuột và tinh gọn nút Kiểm tra Cập nhật.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Streamlined Floor Splitter (Separate Floors)",
          vn: "Tối giản hóa tính năng Tách Sàn (Separate Floors)",
        },
        desc: {
          en: "Simplified scanning scope to 2 intuitive options: Active View (default) or Entire Project for lightning-fast slab subdivision.",
          vn: "Tối giản hóa phạm vi quét còn 2 lựa chọn trực quan: Active View (mặc định) hoặc Toàn bộ Dự án để tách sàn siêu tốc.",
        },
      },
      {
        type: "security",
        title: {
          en: "Dedicated SMOB Uninstaller Suite",
          vn: "Tích hợp SMOB_Uninstall.exe chuẩn hóa",
        },
        desc: {
          en: "Provides dedicated clean uninstallation routine to cleanly wipe ribbon manifests and cached binaries in 1 click without affecting other plugins.",
          vn: "Đi kèm file SMOB_Uninstall.exe giúp gỡ cài đặt sạch sẽ, xóa toàn bộ cache và file Manifest chỉ trong 1 click mà không ảnh hưởng plugin khác.",
        },
      },
    ],
  },
  {
    version: "v2026.10.0 Pro",
    badge: { en: "Previous Version", vn: "Bản tiền nhiệm" },
    isLatest: false,
    releaseDate: { en: "August 2026", vn: "Tháng 08/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "Unified All-In-One Installer for Revit 2020 through Revit 2026",
        vn: "Bộ cài All-In-One tích hợp cho Autodesk Revit 2020 đến Revit 2026",
      },
      {
        en: "Ultra-Fast Auto-Join Geometry Engine v3.0 (5000+ elements < 3s)",
        vn: "Thuật toán Auto-Join v3.0 siêu tốc (xử lý >5.000 cấu kiện < 3s)",
      },
      {
        en: "Clean Save Family library extractor & Parameter Purger",
        vn: "Xuất Family chuẩn hóa không kèm rác & Dọn dẹp Shared Parameter",
      },
      {
        en: "Floor Splitter & Automated Grid Dimensioning module",
        vn: "Tính năng Floor Splitter chia sàn & Tự động tạo Dim lưới trục",
      },
      {
        en: "Direct single-click .exe installer & dedicated uninstaller",
        vn: "Bộ cài trực tiếp .EXE không cần giải nén & file gỡ cài đặt tiện lợi",
      },
    ],
    changelog: [
      {
        type: "new",
        title: {
          en: "Revit 2020–2026 Multi-Engine Direct Installer",
          vn: "Bộ cài trực tiếp đa phiên bản Revit 2020–2026",
        },
        desc: {
          en: "Single executable setup automatically detects all installed Revit versions (2020–2026) on Windows and registers the add-in manifests with zero manual configuration.",
          vn: "Bộ cài .exe tự động quét và nhận diện tất cả phiên bản Revit (2020–2026) trên máy tính, đăng ký file Manifest .addin chuẩn xác chỉ trong 1 click.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Auto-Join Geometry Engine Optimization",
          vn: "Nâng cấp thuật toán Auto-Join Geometry",
        },
        desc: {
          en: "Re-engineered spatial bounding box indexer. Solves complex beam-column-slab intersection priority logic with 4x performance gain on multi-story towers.",
          vn: "Tối ưu hóa thuật toán Bounding Box không gian, tăng tốc độ xử lý ưu tiên dầm-cột-sàn-vách gấp 4 lần trên các dự án cao tầng.",
        },
      },
      {
        type: "new",
        title: {
          en: "Floor Splitter by Boundary Curves",
          vn: "Module Floor Splitter chia sàn theo ranh giới",
        },
        desc: {
          en: "Split complex structural and architectural floor slabs along construction joint curves while preserving level offsets, slopes, and floor types.",
          vn: "Tự động phân chia sàn bê tông và sàn kiến trúc theo mạch ngừng thi công hoặc đường line chỉ định, giữ nguyên độ dốc và cấu tạo sàn.",
        },
      },
      {
        type: "security",
        title: {
          en: "Dedicated SMOB Uninstaller Suite",
          vn: "Tích hợp SMOB_Uninstall.exe chuẩn hóa",
        },
        desc: {
          en: "Provides dedicated clean uninstallation routine to cleanly wipe ribbon manifests and cached binaries in 1 click without affecting other plugins.",
          vn: "Đi kèm file SMOB_Uninstall.exe giúp gỡ cài đặt sạch sẽ, xóa toàn bộ cache và file Manifest chỉ trong 1 click mà không ảnh hưởng plugin khác.",
        },
      },
    ],
  },
  {
    version: "v2026.9.2",
    badge: { en: "Stable Release", vn: "Bản ổn định" },
    isLatest: false,
    releaseDate: { en: "July 2026", vn: "Tháng 07/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "Parameter Purger for model cleanup & lightweight file size",
        vn: "Dọn dẹp các Shared Parameters rác, giảm dung lượng file",
      },
      {
        en: "Coordinate-based automated renumbering algorithm",
        vn: "Đánh số tự động cấu kiện theo tọa độ X, Y, Z thực tế",
      },
    ],
    changelog: [
      {
        type: "new",
        title: {
          en: "Parameter Purger Module",
          vn: "Module Parameter Purger",
        },
        desc: {
          en: "Scan, identify, and safely purge unreferenced shared parameters and unused schedule definitions.",
          vn: "Quét và dọn sạch các tham số rác không sử dụng, giúp mô hình hoạt động mượt mà hơn.",
        },
      },
      {
        type: "enhanced",
        title: {
          en: "Batch Renumbering by X-Y Coordinate Vectors",
          vn: "Đánh số tự động theo ma trận tọa độ",
        },
        desc: {
          en: "Sorts piles, columns, and rooms top-to-bottom and left-to-right with customizable prefix, suffix, and leading zeroes.",
          vn: "Tự động sắp xếp và đánh số cọc, cột, phòng theo hướng trái sang phải, trên xuống dưới với tiền tố linh hoạt.",
        },
      },
    ],
  },
  {
    version: "v2026.8.0",
    badge: { en: "Initial Release", vn: "Bản phát hành đầu" },
    isLatest: false,
    releaseDate: { en: "June 2026", vn: "Tháng 06/2026" },
    revitSupport: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    setupFileName: "SMOB_Setup.zip",
    setupFileSize: "1.6 MB",
    setupDownloadUrl: "/downloads/SMOB_Setup.zip",
    uninstallFileName: "SMOB_Uninstall.exe",
    uninstallFileSize: "6.1 KB",
    uninstallDownloadUrl: "/downloads/SMOB_Uninstall.exe",
    highlights: [
      {
        en: "First public release with Autodesk Fluent Ribbon Tab integration",
        vn: "Bản phát hành đầu tiên với thanh công cụ Ribbon chuẩn Autodesk",
      },
      {
        en: "Multi-View Filter Synchronizer & Viewport Duplicate with placement",
        vn: "Đồng bộ View Filters và nhân bản Viewport giữ nguyên tọa độ",
      },
    ],
    changelog: [
      {
        type: "new",
        title: {
          en: "Autodesk Revit Ribbon Tab Architecture",
          vn: "Giao diện Ribbon Tab chuẩn Autodesk",
        },
        desc: {
          en: "Custom UI tab integrated directly into Revit UI with vector icons and instant tooltips.",
          vn: "Tích hợp trực tiếp lên giao diện Revit với icon vector sắc nét và phím tắt thao tác nhanh.",
        },
      },
    ],
  },
];

export const systemRequirements = {
  os: "Windows 10 / Windows 11 (64-bit)",
  revit: "Autodesk Revit® 2020, 2021, 2022, 2023, 2024, 2025, 2026",
  framework: ".NET Framework 4.8 / .NET Core Desktop Runtime (Auto-detected)",
  ram: "8 GB RAM (16 GB Recommended for large BIM models)",
  storage: "50 MB free disk space",
};
