export interface ToolVideoItem {
  id: string; // YouTube Video ID (empty string if coming soon)
  number: string;
  badge: {
    en: string;
    vn: string;
  };
  title: {
    en: string;
    vn: string;
  };
  description: {
    en: string;
    vn: string;
  };
  duration: string;
  highlight: {
    en: string;
    vn: string;
  };
  featureId?: string; // Links to toolFeaturesData
  uploadDate: string;
  isComingSoon?: boolean;
}

export const PLAYLIST_ID = "PLFst51HERnCk";
export const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

export const toolVideos: ToolVideoItem[] = [
  {
    id: "HOQ-PZDGizQ",
    number: "01",
    badge: {
      en: "Featured #01 · Auto-Join",
      vn: "Tiêu Điểm #01 · Auto-Join",
    },
    title: {
      en: "Auto Join 5000+ Revit Elements in 3 Seconds! (100% Accurate Material Takeoffs)",
      vn: "Auto Join 5000+ Cấu Kiện Revit Trong 3 Giây! (Bóc Tách Khối Lượng Chuẩn 100%)",
    },
    description: {
      en: "Watch the proprietary Bounding Box v3.0 priority matrix join floors, columns, beams, and foundations without any UI freezes or manual warning clicks.",
      vn: "Trực quan thuật toán Ma trận ưu tiên Bounding Box v3.0 xử lý giao cắt sàn, cột, dầm, móng tự động. Hoàn toàn không đơ giật, khử sạch hộp thoại cảnh báo.",
    },
    duration: "01:30",
    highlight: {
      en: "Eliminates geometry clashes & speeds up concrete volume scheduling by 90%",
      vn: "Xóa sổ xung đột hình học & tăng tốc bóc tách khối lượng bê tông lên 90%",
    },
    featureId: "join-unjoin",
    uploadDate: "2026-09-05",
    isComingSoon: false,
  },
  {
    id: "-MISgEySRa8",
    number: "02",
    badge: {
      en: "Workflow #02 · Auto Tagging",
      vn: "Tính Năng #02 · Đánh Số Tọa Độ",
    },
    title: {
      en: "Auto-Number Thousands of Piles, Columns & Doors by Coordinates in Seconds",
      vn: "Auto Numbering: Đánh Số Tự Động Theo Tọa Độ Cọc, Cột, Cửa & Phòng",
    },
    description: {
      en: "Eliminate duplicate mark numbers and manual typos. Sort elements Left-to-Right, Top-to-Bottom, or along custom pick sequences.",
      vn: "Đánh số thứ tự hàng nghìn cấu kiện theo tọa độ không gian (Trái qua Phải, Trên xuống Dưới, Zigzag) chuẩn quy ước hồ sơ thi công.",
    },
    duration: "01:54",
    highlight: {
      en: "Zero duplicate mark errors across massive schedule sheets",
      vn: "Loại bỏ hoàn toàn lỗi trùng mã hiệu khi xuất bảng thống kê bản vẽ",
    },
    featureId: "auto-numbering",
    uploadDate: "2026-09-08",
    isComingSoon: false,
  },
  {
    id: "1P1PaXqSJvA",
    number: "03",
    badge: {
      en: "Workflow #03 · Slab Split",
      vn: "Tính Năng #03 · Phân Chia Sàn",
    },
    title: {
      en: "Split Complex Floor Slabs & Pouring Zones in 1 Click (Preserve Slopes & Levels)",
      vn: "Separate Floor: Tách & Phân Chia Mảng Sàn Theo Mạch Ngừng Thi Công",
    },
    description: {
      en: "Quickly subdivide massive multi-island concrete slabs across entire projects while preserving compound layer types, slopes, and level parameters.",
      vn: "Tự động chia tách các mảng sàn bê tông lớn theo mạch ngừng thi công hoặc phân tách các đảo sàn độc lập, giữ nguyên toàn bộ độ dốc và cấu tạo lớp sàn.",
    },
    duration: "00:35",
    highlight: {
      en: "1-Click multi-island slab separation preserving slope arrows & boundary curves",
      vn: "1-Click tách đảo sàn độc lập, giữ nguyên dốc và cao độ thiết kế",
    },
    featureId: "separate-floors",
    uploadDate: "2026-09-10",
    isComingSoon: false,
  },
  {
    id: "Xs0eO1GChdY",
    number: "04",
    badge: {
      en: "Workflow #04 · Elevation Check",
      vn: "Tính Năng #04 · Kiểm Tra Cao Độ",
    },
    title: {
      en: "Detect Elevation Mismatches & Level Errors with 3-Tier Spectrum Color-Coding",
      vn: "Elevation Check: Phát Hiện Lệch Cao Độ & Level Bằng 3 Mức Phổ Màu Trực Quan",
    },
    description: {
      en: "Prevent costly jobsite pouring blunders. Scan vertical offsets between columns, walls, floors, and framing with 3-tier spectrum visual color gradients.",
      vn: "Loại bỏ triệt để rủi ro đổ bê tông sai cao độ ngoài công trường. Tự động quét và phân màu trực quan độ lệch giữa dầm, sàn, cột, vách theo 3 dải phổ màu.",
    },
    duration: "01:46",
    highlight: {
      en: "1-Click 3-tier spectrum color-coding reveals all height discrepancies before site pouring",
      vn: "Phân màu phổ quang 3 cấp độ phát hiện 100% sai lệch cao độ trước khi đổ bê tông",
    },
    featureId: "elevation-check-suite",
    uploadDate: "2026-09-12",
    isComingSoon: false,
  },
  {
    id: "", // Coming soon - No placeholder ID to prevent accidental playback of video 1
    number: "05",
    isComingSoon: true,
    badge: {
      en: "Workflow #05 · Data Clean",
      vn: "Tính Năng #05 · Dọn Dẹp File",
    },
    title: {
      en: "Parameter Purger: Deep Cleaning Unused Metadata & Slashing File Size",
      vn: "Parameter Purger: Quét Sạch Tham Số Rác & Tối Ưu Dung Lượng File Dự Án",
    },
    description: {
      en: "Deep-scans Shared and Project Parameters imported from vendor families. Batch-purges redundant metadata safely without risking system params.",
      vn: "Quét sâu và xóa sạch các Shared/Project Parameter rác từ thư viện ngoại lai, giảm dung lượng file và tăng tốc độ mở mô hình Revit.",
    },
    duration: "Premiere",
    highlight: {
      en: "Reclaims up to 35% file size and eliminates corrupt parameter warnings",
      vn: "Giảm tới 35% dung lượng file và khử cảnh báo xung đột tham số",
    },
    featureId: "parameter-purger",
    uploadDate: "2026-09-20",
  },
];
