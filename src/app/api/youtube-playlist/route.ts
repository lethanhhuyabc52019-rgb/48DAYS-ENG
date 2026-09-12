import { NextResponse } from "next/server";
import { toolVideos, PLAYLIST_ID, ToolVideoItem } from "@/data/toolVideosData";

// Curated dictionary to enrich YouTube playlist items with bilingual AEC copy & feature links
const CURATED_METADATA: Record<string, Partial<ToolVideoItem>> = {
  "HOQ-PZDGizQ": {
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
  },
  "-MISgEySRa8": {
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
  },
  "1P1PaXqSJvA": {
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
  },
  "Xs0eO1GChdY": {
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
  },
};

// Clean XML entities helper
function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Clean title helper: remove "| SMOB #01", etc.
function sanitizeTitle(rawTitle: string): string {
  return rawTitle.replace(/\|\s*SMOB\s*#\d+/i, "").trim();
}

export async function GET() {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
    const res = await fetch(feedUrl, {
      next: { revalidate: 1800 }, // Cache for 30 minutes, automatically re-syncs in the background
    });

    if (!res.ok) {
      // Return static fallback if external network is unavailable
      return NextResponse.json({
        success: true,
        source: "fallback",
        videos: toolVideos,
      });
    }

    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    if (entries.length === 0) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        videos: toolVideos,
      });
    }

    // Parse each video entry from the official YouTube feed
    const parsedVideos = entries
      .map((entry) => {
        const videoId =
          entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1]?.trim() || "";
        const rawTitle = decodeXmlEntities(
          entry.match(/<title>(.*?)<\/title>/)?.[1] || ""
        );
        const published =
          entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim() || "";
        const rawDesc = decodeXmlEntities(
          entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] || ""
        );

        // Extract episode number from title (e.g. #04 or #4 or SMOB #04)
        const epMatch = rawTitle.match(/#0?(\d+)/);
        const epNum = epMatch ? parseInt(epMatch[1], 10) : null;

        return {
          videoId,
          rawTitle,
          published,
          rawDesc,
          epNum,
        };
      })
      .filter((v) => v.videoId.length > 0);

    // Sort chronologically (Episode 1, 2, 3, 4...)
    parsedVideos.sort((a, b) => {
      if (a.epNum && b.epNum) return a.epNum - b.epNum;
      return new Date(a.published).getTime() - new Date(b.published).getTime();
    });

    // Build the finalized list of ToolVideoItems
    const syncedVideos: ToolVideoItem[] = parsedVideos.map((item, idx) => {
      const epNumberStr = item.epNum
        ? String(item.epNum).padStart(2, "0")
        : String(idx + 1).padStart(2, "0");

      const curated = CURATED_METADATA[item.videoId];
      const cleanTitle = sanitizeTitle(item.rawTitle);

      if (curated) {
        return {
          id: item.videoId,
          number: curated.number || epNumberStr,
          badge: curated.badge || {
            en: `Workflow #${epNumberStr}`,
            vn: `Tính Năng #${epNumberStr}`,
          },
          title: curated.title || {
            en: cleanTitle,
            vn: cleanTitle,
          },
          description: curated.description || {
            en: item.rawDesc.slice(0, 160),
            vn: item.rawDesc.slice(0, 160),
          },
          duration: curated.duration || "Demo",
          highlight: curated.highlight || {
            en: "1-Click automated Revit workflow acceleration",
            vn: "Tăng tốc tự động hóa quy trình Revit chuyên sâu trong 1-click",
          },
          featureId: curated.featureId,
          uploadDate: item.published.slice(0, 10),
          isComingSoon: false,
        };
      }

      // Automatically handle future videos added to the playlist
      return {
        id: item.videoId,
        number: epNumberStr,
        badge: {
          en: `Workflow #${epNumberStr}`,
          vn: `Tính Năng #${epNumberStr}`,
        },
        title: {
          en: cleanTitle,
          vn: cleanTitle,
        },
        description: {
          en: item.rawDesc.slice(0, 180) || "Official workflow demo from SMOB BIM Automation.",
          vn: item.rawDesc.slice(0, 180) || "Video trình diễn tính năng thực chiến từ SMOB BIM Automation.",
        },
        duration: "Demo",
        highlight: {
          en: "Latest official workflow walkthrough added to YouTube playlist",
          vn: "Video thực chiến mới nhất vừa phát hành trên danh sách phát",
        },
        uploadDate: item.published.slice(0, 10),
        isComingSoon: false,
      };
    });

    // Append scheduled upcoming items (e.g. #05) if the playlist hasn't published it yet
    const comingSoonItems = toolVideos.filter((v) => v.isComingSoon);
    for (const upcoming of comingSoonItems) {
      // Only include if not already published with a matching feature or title
      const alreadyPublished = syncedVideos.some(
        (sv) => sv.featureId === upcoming.featureId
      );
      if (!alreadyPublished) {
        syncedVideos.push({
          ...upcoming,
          number: String(syncedVideos.length + 1).padStart(2, "0"),
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "youtube_rss",
      count: syncedVideos.length,
      videos: syncedVideos,
    });
  } catch (error) {
    console.error("Error fetching YouTube playlist feed:", error);
    return NextResponse.json({
      success: true,
      source: "fallback_error",
      videos: toolVideos,
    });
  }
}
