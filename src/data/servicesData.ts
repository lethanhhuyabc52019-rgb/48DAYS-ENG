import { ServiceItem } from "@/types";

export const servicesData: ServiceItem[] = [
  {
    id: "bim-modeling",
    iconName: "Layers",
    title: {
      en: "BIM Modeling (ARC & STR)",
      vn: "Dựng Hình Mô Hình BIM (Kiến Trúc & Kết Cấu)",
    },
    shortDesc: {
      en: "Architectural and structural Revit modeling from 2D PDF/DWG drawings, coordinated multi-discipline models, clash detection, and quantity take-off support. Detail level customized to each client and project requirement.",
      vn: "Dựng model kiến trúc và kết cấu bằng Revit từ bản vẽ 2D PDF/DWG, model phối hợp đa bộ môn, hỗ trợ bóc tách khối lượng và clash detection. Mức độ chi tiết model được tùy biến theo đúng yêu cầu từng khách hàng và dự án.",
    },
    details: {
      en: [
        "Full RC framing: foundations, columns, transfer beams, slabs, core walls, stairs",
        "Architectural envelope: multi-layer partitions, curtain walls, custom doors & windows",
        "Multi-discipline model linking with shared coordinates for federated review",
        "Automated quantity take-off schedules for concrete, rebar, finishes, and areas",
      ],
      vn: [
        "Kết cấu BTCT toàn diện: móng cọc/móng bè, cột, dầm chuyển, sàn, vách lõi, cầu thang",
        "Kiến trúc hoàn thiện: tường đa lớp, vách kính mặt dựng, hệ thống cửa và trần",
        "Liên kết mô hình đa bộ môn bằng Shared Coordinates phục vụ phối hợp không gian",
        "Tự động trích xuất bảng thống kê khối lượng bê tông, vật liệu hoàn thiện và diện tích",
      ],
    },
    badge: {
      en: "Production Grade",
      vn: "Chuẩn Sản Xuất",
    },
  },
  {
    id: "parametric-families",
    iconName: "Box",
    title: {
      en: "Parametric Revit Families (.rfa)",
      vn: "Thư Viện Parametric Revit Family",
    },
    shortDesc: {
      en: "Custom parametric doors, windows, furniture, casework, MEP fixtures, and equipment libraries with type catalogs, material mapping, and accurate 2D/3D symbolic representation.",
      vn: "Tạo family cửa đi, cửa sổ, nội thất, thiết bị vệ sinh, tủ kệ, type catalog (.txt), gán vật liệu chuẩn, ký hiệu 2D/3D sắc nét sẵn sàng sử dụng ngay cho dự án.",
    },
    details: {
      en: [
        "Lightweight geometry optimized to prevent project model bloat",
        "Fully constrained dimensional parameters with dynamic type catalogs",
        "Standardized 2D architectural swing symbols and elevation line weights",
        "Embedded manufacturer data codes and specification links",
      ],
      vn: [
        "Hình học tối ưu dung lượng siêu nhẹ, không làm nặng file dự án",
        "Gán đầy đủ tham số kích thước linh hoạt kèm bảng Type Catalog đi kèm",
        "Ký hiệu 2D góc mở cửa và nét vẽ quy chuẩn đúng đồ họa kiến trúc",
        "Tích hợp mã hiệu nhà sản xuất và liên kết tài liệu thông số kỹ thuật",
      ],
    },
    badge: {
      en: "Lightweight & Dynamic",
      vn: "Siêu nhẹ & Linh hoạt",
    },
  },
  {
    id: "construction-docs",
    iconName: "FileSpreadsheet",
    title: {
      en: "Construction Documentation Sets",
      vn: "Triển Khai Hồ Sơ Bản Vẽ",
    },
    shortDesc: {
      en: "Complete construction sheet packages: floor plans, elevations, sections, schedules, detail callouts, title blocks, and print-ready drawing exports formatted to strict drafting standards.",
      vn: "Triển khai trọn bộ hồ sơ bản vẽ thi công: mặt bằng các tầng, 4 mặt đứng, các mặt cắt dọc/ngang, chi tiết trích đoạn, khung tên, dim chuỗi, tag ký hiệu và xuất file in ấn chuẩn xác.",
    },
    details: {
      en: [
        "Systematic sheet numbering, view title templates, and browser organization",
        "Dense, professional dimension strings, spot elevations, and room finish tags",
        "Synchronized door, window, finish, and material take-off schedules",
        "High-resolution batch export to PDF, DWG, and image formats at standard scales",
      ],
      vn: [
        "Tổ chức cây thư mục Project Browser, View Template và mã hiệu bản vẽ khoa học",
        "Đường gióng kích thước chuẩn chỉ, cốt cao độ sàn và ký hiệu hoàn thiện phòng",
        "Bảng thống kê cửa, vật liệu và chi tiết liên kết trực tiếp với mô hình 3D",
        "Xuất hàng loạt bộ bản vẽ PDF, DWG độ phân giải cao theo tỷ lệ chuẩn (1:50, 1:100, 1:200)",
      ],
    },
    badge: {
      en: "Print-Ready Output",
      vn: "Hồ Sơ Sẵn Sàng In",
    },
  },
  {
    id: "dynamo-automation",
    iconName: "Cpu",
    title: {
      en: "Dynamo Automation Workflows",
      vn: "Lập Trình Dynamo Tự Động Hóa",
    },
    shortDesc: {
      en: "Custom Dynamo visual programming scripts for deep data processing, bi-directional Excel-Revit synchronization, automated geometry creation from CAD, and model standardization.",
      vn: "Viết Dynamo script theo yêu cầu để xử lý dữ liệu ngầm, quản lý tham số, kết nối Excel-Revit hai chiều, tự động hóa hình học từ CAD và chuẩn hóa dữ liệu mô hình toàn dự án.",
    },
    details: {
      en: [
        "Automated column & grid placement from AutoCAD DWG drawing files",
        "Multi-chain orthogonal auto-dimensioning across complex floor plans in seconds",
        "Bi-directional Excel integration for batch parameter editing and sheet index sync",
        "Geometry optimization and rule-based clash avoidance algorithms",
      ],
      vn: [
        "Tự động tạo cột và lưới trục chuẩn xác từ file bản vẽ AutoCAD DWG",
        "Tự động ghi chuỗi kích thước (Dim) mặt bằng cột phức tạp chỉ trong vài giây",
        "Đồng bộ tham số và danh mục bản vẽ hai chiều giữa Revit và Excel",
        "Thuật toán tối ưu hóa hình học và hạn chế xung đột theo luật thiết kế",
      ],
    },
    badge: {
      en: "70-90% Time Saved",
      vn: "Tiết kiệm 70-90% thời gian",
    },
  },
  {
    id: "revit-api-tools",
    iconName: "Code2",
    title: {
      en: "Custom Revit API Tools & Add-ins",
      vn: "Phát Triển Revit API Add-in Riêng",
    },
    shortDesc: {
      en: "Bespoke 1-click C#/.NET Revit add-ins for proprietary company workflows, automated QA/QC compliance checks, batch view/sheet generators, and maximum BIM team productivity.",
      vn: "Phát triển Revit add-in 1-click bằng C#/.NET cho workflow nội bộ của doanh nghiệp, tự động kiểm soát chất lượng QA/QC, batch processing, đặt tên chuẩn hóa và tối ưu năng suất đội ngũ BIM.",
    },
    details: {
      en: [
        "Custom Ribbon tabs, intuitive dockable panels, and responsive dialog interfaces",
        "Automated model auditing tools to detect missing parameters and unhosted elements",
        "High-speed background processing without Revit freezing or interruptive dialogs",
        "Packaged MSI/EXE installers ready for company-wide deployment",
      ],
      vn: [
        "Thanh Ribbon riêng biệt, giao diện bảng điều khiển trực quan, dễ thao tác",
        "Bộ công cụ tự động quét lỗi mô hình, phát hiện thiếu thông số và đối tượng sai vị trí",
        "Thuật toán xử lý ngầm tốc độ cao, không đơ máy và không hiện popup cảnh báo gián đoạn",
        "Đóng gói bộ cài đặt chuyên nghiệp triển khai đồng loạt cho toàn công ty",
      ],
    },
    badge: {
      en: "1-Click Execution",
      vn: "Vận hành 1-Click",
    },
  },
];
