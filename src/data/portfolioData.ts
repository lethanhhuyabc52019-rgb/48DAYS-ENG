import { ProjectItem } from "@/types";

export const portfolioProjects: ProjectItem[] = [
  {
    id: "riverside-tower",
    category: "modeling",
    title: {
      en: "Riverside Tower B4-2 — Structural BIM Modeling",
      vn: "Riverside Tower B4-2 — Dựng hình Mô hình Kết cấu BIM",
    },
    subtitle: {
      en: "High-Rise Reinforced Concrete Structural Framework & Coordination",
      vn: "Khung kết cấu bê tông cốt thép nhà cao tầng & Phối hợp mô hình",
    },
    services: {
      en: ["Structural Engineering", "BIM Coordination", "Quantity Take-Off"],
      vn: ["Kỹ thuật kết cấu", "Phối hợp mô hình BIM", "Bóc tách khối lượng"],
    },
    tools: ["Autodesk Revit", "Navisworks Manage", "AutoCAD"],
    brief: {
      en: "Develop a fully coordinated structural Revit model from 2D structural drawings, with precise representation of all RC elements — foundations, columns, beams, slabs, shear walls, and stairs — for clash detection and automated quantity take-off, supporting downstream cost estimation.",
      vn: "Phát triển mô hình Revit kết cấu phối hợp hoàn chỉnh từ bản vẽ kết cấu 2D, thể hiện chính xác toàn bộ cấu kiện BTCT — móng, cột, dầm, sàn, vách cứng và cầu thang — phục vụ kiểm tra xung đột và tự động trích xuất khối lượng dự toán.",
    },
    deliverables: {
      en: [
        "Full structural BIM modeling from 2D PDF/DWG drawings: foundations, columns, transfer beams, slabs, core walls, and cast-in-place stairs",
        "Structural grids & levels aligned with the architectural reference model",
        "Revit Structural Model (.rvt) with detailed concrete volume and material schedules",
        "Navisworks clash detection test report between structural elements and MEP corridors",
      ],
      vn: [
        "Dựng mô hình BIM kết cấu hoàn chỉnh từ bản vẽ 2D PDF/DWG: móng, cột, dầm chuyển, sàn, vách lõi và thang bộ",
        "Hệ lưới trục và cao độ tầng được đồng bộ chuẩn xác với mô hình kiến trúc",
        "File mô hình Revit (.rvt) kèm bảng thống kê khối lượng bê tông và vật liệu tự động",
        "Báo cáo kiểm soát xung đột Navisworks giữa kết cấu và hệ thống cơ điện MEP",
      ],
    },
    keyResults: {
      en: [
        "Zero spatial clashes between heavy transfer beams and core shear walls",
        "Automated concrete volume calculation aligned with quantity survey estimates",
        "Production-ready federated model delivered ahead of construction schedule",
      ],
      vn: [
        "Triệt tiêu 100% va chạm không gian giữa dầm chuyển và vách cứng",
        "Bóc tách khối lượng bê tông tự động khớp hoàn toàn với bảng dự toán",
        "Bàn giao mô hình phối hợp chuẩn xác trước tiến độ đề ra",
      ],
    },
    coverImage: "/images/portfolio/project_riverside-tower_01.webp",
    galleryImages: [
      "/images/portfolio/project_riverside-tower_01.webp",
      "/images/portfolio/project_riverside-tower_02.webp",
      "/images/portfolio/project_riverside-tower_03.webp",
      "/images/portfolio/project_riverside-tower_04.webp",
    ],
  },
  {
    id: "international-school",
    category: "modeling",
    title: {
      en: "International School Campus — Multi-Building Structural BIM",
      vn: "Khu Trường Quốc Tế — Mô hình Kết cấu BIM Đa Khối Nhà",
    },
    subtitle: {
      en: "Campus-Scale Federated Model with RC Frames & Long-Span Steel Roofs",
      vn: "Mô hình hợp nhất quy mô khuôn viên trường với khung BTCT & mái thép nhịp lớn",
    },
    services: {
      en: ["Structural Engineering", "Multi-Building BIM Coordination", "Rebar Scheduling Support"],
      vn: ["Kỹ thuật kết cấu", "Phối hợp BIM đa khối nhà", "Hỗ trợ thống kê cốt thép"],
    },
    tools: ["Autodesk Revit", "Navisworks Manage"],
    brief: {
      en: "Create detailed structural Revit models from 2D structural drawings for a school campus spanning 5 distinct building blocks, enabling multi-discipline coordination, rebar scheduling, and constructability review across all blocks in a single federated environment.",
      vn: "Triển khai mô hình kết cấu Revit chi tiết từ bản vẽ 2D cho khuôn viên trường học gồm 5 khối nhà riêng biệt, hỗ trợ phối hợp đa bộ môn, lập bảng thống kê cốt thép và đánh giá tính khả thi thi công trong mô hình hợp nhất.",
    },
    deliverables: {
      en: [
        "Structural modeling of 5 campus building blocks (Classrooms, Gymnasium, Auditorium, Admin, Cafeteria) from 2D documentation",
        "RC frame systems, post-tensioned slabs, and steel truss connections for long-span sports and assembly halls",
        "Pile foundations, grade beams, and integrated retaining wall systems",
        "Structural schedule generation for quantity-surveyor coordination and material procurement",
        "Federated multi-building Revit model (.rvt) linked by shared coordinates",
      ],
      vn: [
        "Dựng mô hình kết cấu 5 khối nhà (Phòng học, Nhà đa năng, Hội trường, Nhà điều hành, Căn tin) từ bản vẽ 2D",
        "Hệ khung BTCT, sàn dự ứng lực và liên kết vì kèo thép nhịp lớn cho khu thể thao và hội trường",
        "Hệ móng cọc, đài giằng móng và tường chắn đất liên kết",
        "Bảng tổng hợp khối lượng kết cấu đồng bộ phục vụ kiểm toán và đặt hàng vật tư",
        "Mô hình Revit liên kết hợp nhất (.rvt) đồng bộ theo tọa độ dùng chung (Shared Coordinates)",
      ],
    },
    keyResults: {
      en: [
        "Seamless federated model integration across 5 independent structural zones",
        "Constructability issues in long-span roof trusses resolved prior to site fabrication",
        "Accurate concrete and structural steel quantities exported directly from the model",
      ],
      vn: [
        "Tích hợp mô hình hợp nhất mượt mà cho cả 5 phân khu độc lập",
        "Xử lý dứt điểm các xung đột giàn mái thép trước khi gia công ngoài xưởng",
        "Xuất bảng khối lượng bê tông và thép kết cấu chính xác trực tiếp từ mô hình",
      ],
    },
    coverImage: "/images/portfolio/project_international-school_01.webp",
    galleryImages: [
      "/images/portfolio/project_international-school_01.webp",
      "/images/portfolio/project_international-school_02.webp",
      "/images/portfolio/project_international-school_03.webp",
      "/images/portfolio/project_international-school_04.webp",
      "/images/portfolio/project_international-school_05.webp",
    ],
  },
  {
    id: "cedar-rest-hotel",
    category: "modeling",
    title: {
      en: "Cedar Rest Hotel — Architectural & Structural BIM",
      vn: "Cedar Rest Hotel — Mô hình BIM Kiến trúc & Kết cấu Phối hợp",
    },
    subtitle: {
      en: "Cross-Discipline Coordination, Curtain Wall Facade & Interior Finishes",
      vn: "Phối hợp đa bộ môn, mặt dựng vách kính & hoàn thiện nội thất",
    },
    services: {
      en: ["Architectural BIM", "Structural Engineering", "Multi-Discipline Coordination"],
      vn: ["BIM Kiến trúc", "Kỹ thuật kết cấu", "Phối hợp đa bộ môn"],
    },
    tools: ["Autodesk Revit", "Navisworks Manage"],
    brief: {
      en: "Develop coordinated architectural and structural Revit models from 2D design drawings, supporting design review workshops, automated clash detection between disciplines, and construction documentation for local permit submission.",
      vn: "Phát triển mô hình Revit kiến trúc và kết cấu đồng bộ từ bản vẽ thiết kế 2D, phục vụ thẩm tra thiết kế, kiểm tra xung đột tự động giữa các bộ môn và xuất hồ sơ xin phép thi công.",
    },
    deliverables: {
      en: [
        "Architectural modeling: exterior walls, interior partitions, floor finishes, roofing, curtain wall facades, doors, windows, ceiling grids, and room definitions with area schedules",
        "Structural modeling: RC foundations, columns, beams, floor & roof slabs, staircases, and retaining walls",
        "Cross-discipline model linking with shared coordinates and clash coordination",
        "Two coordinated Revit models (.rvt) — Architectural & Structural with zero spatial discrepancies",
      ],
      vn: [
        "Mô hình kiến trúc: tường bao, vách ngăn, lớp hoàn thiện sàn, mái, vách kính mặt dựng, cửa, trần và gán phòng kèm diện tích",
        "Mô hình kết cấu: móng BTCT, cột, dầm, sàn tầng, sàn mái, cầu thang và tường chắn",
        "Liên kết mô hình đa bộ môn bằng tọa độ dùng chung và xử lý xung đột",
        "Bộ đôi file mô hình Revit (.rvt) — Kiến trúc & Kết cấu chuẩn xác 100%",
      ],
    },
    keyResults: {
      en: [
        "Complete synchronization between architectural finishes and structural structural levels",
        "Early detection and resolution of facade panel misalignment with edge beams",
        "Approved permit submittal package generated directly from Revit views",
      ],
      vn: [
        "Đồng bộ tuyệt đối giữa lớp hoàn thiện kiến trúc và cao độ dầm sàn kết cấu",
        "Phát hiện và xử lý sớm các vị trí lệch vách kính so với mép dầm biên",
        "Bộ hồ sơ xin phép thi công được xuất trực tiếp từ các view Revit",
      ],
    },
    coverImage: "/images/portfolio/project_cedar-rest-hotel_01.webp",
    galleryImages: [
      "/images/portfolio/project_cedar-rest-hotel_01.webp",
      "/images/portfolio/project_cedar-rest-hotel_02.webp",
      "/images/portfolio/project_cedar-rest-hotel_03.webp",
      "/images/portfolio/project_cedar-rest-hotel_04.webp",
      "/images/portfolio/project_cedar-rest-hotel_05.webp",
    ],
  },
  {
    id: "mira-residence",
    category: "modeling",
    title: {
      en: "Mira Residence — Architectural & Structural BIM",
      vn: "Mira Residence — Mô hình BIM Kiến trúc & Khung Kết cấu",
    },
    subtitle: {
      en: "Detailed Residential Villa Modeling with Integrated Room Schedules",
      vn: "Mô hình biệt thự cao cấp tích hợp bảng hoàn thiện phòng & vật liệu",
    },
    services: {
      en: ["Architecture", "Structural Engineering", "Material Quantification"],
      vn: ["Kiến trúc", "Kỹ thuật kết cấu", "Bóc tách vật tư"],
    },
    tools: ["Autodesk Revit"],
    brief: {
      en: "Create a comprehensive Revit model capturing both architectural and structural design from 2D drawings, supporting interior design visualization, room/area scheduling, and material quantification for construction budgeting.",
      vn: "Tạo lập mô hình Revit toàn diện bao gồm cả thiết kế kiến trúc và kết cấu từ bản vẽ 2D, phục vụ trực quan hóa nội thất, phân bổ không gian phòng và bóc tách vật liệu phục vụ dự toán thi công.",
    },
    deliverables: {
      en: [
        "Full architectural modeling with interior detailing: multi-layer walls, floor types, ceilings, custom doors, windows, balcony railings, and roof system",
        "Structural RC frame modeling: shallow foundations, columns, beams, slabs, and stairs",
        "Auto-populated room schedules, area calculations, and material take-off schedules",
        "Combined coordinated Revit model (.rvt) with clean view templates",
      ],
      vn: [
        "Dựng hình kiến trúc chi tiết: tường đa lớp, cấu tạo sàn, trần thạch cao, cửa, lan can ban công và hệ mái dốc",
        "Mô hình khung kết cấu BTCT: móng nông, cột, dầm, sàn và thang bộ",
        "Tự động tính toán diện tích phòng, lập bảng thống kê hoàn thiện và bóc tách vật tư",
        "Mô hình Revit tổng hợp (.rvt) với hệ thống View Template chuẩn hóa",
      ],
    },
    keyResults: {
      en: [
        "Precision alignment between structural openings and custom architectural joinery",
        "Real-time room finish schedules linked directly to procurement specifications",
        "Clean, error-free geometry ready for photorealistic rendering and contractor review",
      ],
      vn: [
        "Khớp nối chuẩn xác giữa lỗ mở kết cấu và kích thước khuôn cửa kiến trúc",
        "Bảng thống kê vật liệu hoàn thiện liên kết trực tiếp với bảng báo giá",
        "Hình học sạch, không lỗi giao cắt, sẵn sàng cho công tác render và thi công",
      ],
    },
    coverImage: "/images/portfolio/project_mira-residence_01.webp",
    galleryImages: [
      "/images/portfolio/project_mira-residence_01.webp",
      "/images/portfolio/project_mira-residence_02.webp",
      "/images/portfolio/project_mira-residence_03.webp",
      "/images/portfolio/project_mira-residence_04.webp",
    ],
  },
  {
    id: "oak-residence",
    category: "modeling",
    title: {
      en: "Oak Residence — Integrated BIM & Facade Details",
      vn: "Oak Residence — Mô hình BIM Tích hợp & Chi tiết Mặt đứng",
    },
    subtitle: {
      en: "Complex Cladding Envelope, Sloped Roof Systems & Complete RC Frame",
      vn: "Vỏ bao che ốp hoàn thiện phức tạp, hệ mái dốc & khung bê tông cốt thép",
    },
    services: {
      en: ["Architecture", "Structural Engineering", "Construction Documentation"],
      vn: ["Kiến trúc", "Kỹ thuật kết cấu", "Hồ sơ kỹ thuật thi công"],
    },
    tools: ["Autodesk Revit"],
    brief: {
      en: "Deliver an integrated Revit model covering the architectural facade, interior layout, and complete RC structural frame from 2D construction drawings — construction-ready and able to support direct sheet production.",
      vn: "Triển khai mô hình Revit tích hợp chi tiết mặt tiền kiến trúc, bố trí nội thất và toàn bộ khung kết cấu BTCT từ bản vẽ thi công 2D — đảm bảo độ tin cậy để xuất hồ sơ trực tiếp.",
    },
    deliverables: {
      en: [
        "Architectural modeling: exterior envelope with cladding details, complex roof system, interior walls, door/window schedules, and finish specifications",
        "Structural modeling: RC columns, beams, slabs, staircase, and foundation system",
        "Full model coordination, conflict resolution, and 3D visualization for client presentation",
        "Integrated Revit model (.rvt) ready for construction documentation",
      ],
      vn: [
        "Mô hình kiến trúc: hoàn thiện mặt ngoài với chi tiết ốp, hệ mái dốc phức tạp, tường ngăn, bảng thống kê cửa và chỉ định vật liệu",
        "Mô hình kết cấu: hệ cột, dầm, sàn, cầu thang và hệ kết cấu móng BTCT",
        "Xử lý triệt để xung đột hình học và chuẩn hóa 3D cho các buổi trình bày chủ đầu tư",
        "File mô hình Revit tích hợp (.rvt) chuẩn hóa phục vụ triển khai bản vẽ thi công",
      ],
    },
    keyResults: {
      en: [
        "Eliminated complex geometric conflicts between sloped timber/RC roof and exterior eaves",
        "Produced comprehensive door and window schedules with type tags linked to floor plans",
        "Significantly accelerated contractor submittal review process",
      ],
      vn: [
        "Giải quyết triệt để xung đột hình học giữa mái dốc phức tạp và dầm bo viền",
        "Xuất bảng thống kê cửa đi, cửa sổ đồng bộ 100% với ký hiệu trên mặt bằng",
        "Rút ngắn đáng kể thời gian thẩm duyệt hồ sơ với nhà thầu thi công",
      ],
    },
    coverImage: "/images/portfolio/project_oak-residence_01.webp",
    galleryImages: [
      "/images/portfolio/project_oak-residence_01.webp",
      "/images/portfolio/project_oak-residence_02.webp",
      "/images/portfolio/project_oak-residence_03.webp",
      "/images/portfolio/project_oak-residence_04.webp",
    ],
  },
  {
    id: "ranch-house",
    category: "documentation",
    title: {
      en: "Ranch House — Complete 13-Sheet Construction Set",
      vn: "Ranch House — Trọn bộ Hồ sơ Bản vẽ Thi công 13 Sheet",
    },
    subtitle: {
      en: "Professional Architectural Plans, 4 Elevations, Sections & Dormer Details",
      vn: "Mặt bằng hoàn chỉnh, 4 mặt đứng, mặt cắt chi tiết & trích đoạn mái",
    },
    services: {
      en: ["Architectural Documentation", "Sheet Layout & Detailing", "Annotation Standardization"],
      vn: ["Hồ sơ kiến trúc", "Dàn trang & Chi tiết bản vẽ", "Chuẩn hóa Dim & Ký hiệu"],
    },
    tools: ["Autodesk Revit"],
    brief: {
      en: "Produce a complete set of construction documents from a Revit architectural model: plans (basement, first floor, second floor, roof), all 4 elevations, cross and longitudinal sections, dormer details, site plan, and perspective views — formatted with standardized title blocks, dimensions, and annotations.",
      vn: "Triển khai toàn bộ hồ sơ kỹ thuật thi công từ mô hình kiến trúc Revit: mặt bằng các tầng (tầng hầm, tầng 1, tầng 2, mái), 4 mặt đứng, các mặt cắt ngang/dọc, chi tiết cửa mái (dormer), tổng mặt bằng và phối cảnh — dàn trang chuẩn chỉ với khung tên, đường gióng dim và ký hiệu bản vẽ chuyên nghiệp.",
    },
    deliverables: {
      en: [
        "13 professionally drafted construction sheets (A-1 to A-13): 3D Perspective, Basement/First/Second Floor Plans, Roof Plan, 4 Exterior Elevations, Cross & Longitudinal Sections, Dormer Section Details, Site Plan",
        "Full dimensioning chains, spot elevations, room tags, door/window callouts, section cuts, north arrows, and graphic scale bars",
        "13 high-resolution layout sheet exports formatted to architectural standards",
        "Clean, organized Revit model (.rvt) with standard Browser Organization and View Templates",
      ],
      vn: [
        "13 bản vẽ kỹ thuật hoàn chỉnh (A-1 đến A-13): Phối cảnh 3D, Mặt bằng Hầm/Tầng 1/Tầng 2/Mái, 4 Mặt đứng, Mặt cắt dọc/ngang, Chi tiết trích đoạn cửa mái, Tổng mặt bằng",
        "Hệ thống đường gióng kích thước (Dim chuỗi), cao độ cốt sàn, tag phòng, tag cửa, ký hiệu mặt cắt, kim chỉ bắc và thanh tỷ lệ",
        "Bộ 13 sheet xuất ảnh độ phân giải cao chuẩn in ấn khổ lớn",
        "File Revit (.rvt) tổ chức cây Project Browser và View Template khoa học, chuyên nghiệp",
      ],
    },
    keyResults: {
      en: [
        "100% drawing set consistency between 3D model geometry, dimensions, and schedule annotations",
        "Standardized drawing number hierarchy ready for permit submission and site execution",
        "Eliminated manual drafting discrepancies across floor plans and section cuts",
      ],
      vn: [
        "Đồng bộ tuyệt đối 100% giữa mô hình 3D, đường dim và ghi chú bản vẽ",
        "Quy chuẩn mã hiệu bản vẽ khoa học, sẵn sàng cho công tác thẩm tra và thi công",
        "Loại bỏ hoàn toàn sai lệch số liệu giữa mặt bằng và mặt cắt",
      ],
    },
    coverImage: "/images/portfolio/project_ranch-house_01.webp",
    galleryImages: [
      "/images/portfolio/project_ranch-house_01.webp",
      "/images/portfolio/project_ranch-house_02.webp",
      "/images/portfolio/project_ranch-house_03.webp",
      "/images/portfolio/project_ranch-house_04.webp",
      "/images/portfolio/project_ranch-house_05.webp",
      "/images/portfolio/project_ranch-house_06.webp",
      "/images/portfolio/project_ranch-house_07.webp",
      "/images/portfolio/project_ranch-house_08.webp",
      "/images/portfolio/project_ranch-house_09.webp",
      "/images/portfolio/project_ranch-house_10.webp",
      "/images/portfolio/project_ranch-house_11.webp",
      "/images/portfolio/project_ranch-house_12.webp",
      "/images/portfolio/project_ranch-house_13.webp",
    ],
  },
  {
    id: "accent-chair-teak",
    category: "families",
    title: {
      en: "Accent Chair Teak — Parametric Furniture Family",
      vn: "Ghế Bọc Đệm Gỗ Teak — Parametric Furniture Family",
    },
    subtitle: {
      en: "Revit 2024, Family Editor · Parametric Furniture with Material & Dimension Mapping",
      vn: "Revit 2024, Family Editor · Nội thất tham số hóa kèm gán vật liệu & kích thước động",
    },
    services: {
      en: ["Parametric Family Creation", "Furniture Modeling", "Type Catalog Engineering"],
      vn: ["Tạo Family tham số", "Mô hình Nội thất & Đồ gỗ", "Lập trình Type Catalog"],
    },
    tools: ["Autodesk Revit 2024", "Family Editor", "AutoCAD"],
    brief: {
      en: "Develop a production-ready parametric Revit furniture family (.rfa) for the Accent Chair Teak model with dynamic seat width, depth, seat height, backrest angle, cushion thickness, and customizable wood material parameters.",
      vn: "Tạo lập family Revit tham số hoàn chỉnh (.rfa) cho mẫu Ghế bọc đệm gỗ Teak với khả năng tùy biến linh hoạt chiều rộng, chiều sâu, cao độ đệm ngồi, góc nghiêng tựa lưng và bảng thông số vật liệu gỗ/đệm đi kèm.",
    },
    deliverables: {
      en: [
        "Revit Family file (.rfa) with formula-driven dimensional constraints for width, depth, and seat height",
        "Nested cushion and frame solid geometry with material finish parameters (Teak, Walnut, Fabric, Leather)",
        "Clean 2D plan and elevation symbolic lines with standardized architectural lineweights",
        "Shop drawing sheet exports with full dimensional chains and fabrication callouts",
      ],
      vn: [
        "File Family Revit (.rfa) với các ràng buộc tham số hình học: chiều rộng, chiều sâu và độ dày đệm",
        "Hình học khung gỗ và đệm bọc gắn tham số vật liệu hoàn thiện (Gỗ Teak, Óc chó, Vải nỉ, Da bò)",
        "Nét vẽ tượng trưng 2D chuẩn đồ họa trên mặt bằng và mặt đứng kiến trúc",
        "Bản vẽ kỹ thuật chế tạo (Shop Drawing) kèm bảng đường dim kích thước chi tiết cho xưởng sản xuất",
      ],
    },
    keyResults: {
      en: [
        "Lightweight, flexible family geometry that does not slow down large project models",
        "Complete type flexibility without creating dozens of bloated static families",
        "Accurate 2D plan and elevation representation with clean architectural lineweights",
      ],
      vn: [
        "Dung lượng file siêu nhẹ, không gây nặng file dự án",
        "Tùy biến kích thước linh hoạt mà không cần tạo nhiều file tĩnh rác",
        "Hiển thị nét 2D trên mặt bằng và mặt đứng sắc nét, chuẩn đồ họa kiến trúc",
      ],
    },
    coverImage: "/images/families/family_chair-teak_01.webp",
    galleryImages: [
      "/images/families/family_chair-teak_01.webp",
      "/images/families/family_chair-teak_03.webp",
    ],
  },
  {
    id: "gm-shelving-unit",
    category: "families",
    title: {
      en: "GM Shelving Unit @ Office — Parametric Furniture Family",
      vn: "Kệ Tủ Văn Phòng GM — Parametric Furniture Family",
    },
    subtitle: {
      en: "Revit 2024, Family Editor · Parametric Casework with Dynamic Shelf Arrays & Material Parameters",
      vn: "Revit 2024, Family Editor · Tủ kệ tham số với mảng tầng đợt động & gán vật liệu",
    },
    services: {
      en: ["Parametric Family Creation", "Casework Modeling", "Type Catalog Engineering"],
      vn: ["Tạo Family tham số", "Mô hình Tủ kệ Casework", "Lập trình Type Catalog"],
    },
    tools: ["Autodesk Revit 2024", "Family Editor"],
    brief: {
      en: "Create a fully flexible parametric office shelving unit family (.rfa) supporting variable bay widths, overall heights, dynamic shelf count arrays, back-panel visibility toggles, and multi-finish material mapping for modern workplace interior layouts.",
      vn: "Phát triển bộ Family kệ tủ văn phòng GM tham số linh hoạt (.rfa), hỗ trợ tùy chỉnh chiều rộng khoang, chiều cao tổng thể, mảng số tầng đợt tự động, bật/tắt vách lưng và chỉ định vật liệu cho thiết kế nội thất văn phòng.",
    },
    deliverables: {
      en: [
        "Parametric Revit Casework Family (.rfa) with formula-driven dynamic shelf arrays",
        "Configurable height, bay width, upright thickness, and adjustable base levelers",
        "Integrated material parameters for steel uprights, powder-coat finishes, and laminate shelves",
        "Type catalog (.txt) for instant loading of 12 standard commercial office configurations",
      ],
      vn: [
        "Family Revit Casework (.rfa) tích hợp công thức mảng số tầng đợt phân bổ tự động",
        "Tùy biến chiều cao, chiều rộng khoang tủ, độ dày khung và chân tăng chỉnh",
        "Gán tham số vật liệu cho khung sắt sơn tĩnh điện, đợt gỗ MDF Melamine và nẹp chỉ",
        "Bảng Type Catalog (.txt) nạp nhanh 12 quy cách kích thước tiêu chuẩn văn phòng",
      ],
    },
    keyResults: {
      en: [
        "Parametric shelf arrays scale seamlessly without geometric distortion",
        "Instant schedule quantification for material take-offs and procurement",
        "Clean 2D drafting representation for interior plan coordination",
      ],
      vn: [
        "Mảng tầng đợt co giãn mượt mà theo tham số mà không bị biến dạng hình học",
        "Tự động thống kê số lượng đợt gỗ và khung sắt trong Schedule Revit phục vụ dự toán",
        "Nét vẽ 2D mặt bằng sắc nét, tối ưu cho hồ sơ triển khai nội thất",
      ],
    },
    coverImage: "/images/families/family_shelving_unit_3d.webp",
    galleryImages: [
      "/images/families/family_shelving_unit_3d.webp",
      "/images/families/family_shelving_unit_sheet.webp",
    ],
  },
  {
    id: "ada-vanity-unit",
    category: "families",
    title: {
      en: "ADA Vanity @ Retail Public Toilet — Plumbing Fixture Family",
      vn: "Bàn Chậu Rửa ADA Toilet Công Cộng — Plumbing Fixture Family",
    },
    subtitle: {
      en: "Revit 2024, Family Editor · Commercial Sanitary Fixture with ADA Clearances & MEP Connectors",
      vn: "Revit 2024, Family Editor · Thiết bị vệ sinh tiêu chuẩn ADA & Đầu nối MEP",
    },
    services: {
      en: ["Plumbing Fixture Modeling", "Commercial ADA Compliance", "MEP Connector Setup"],
      vn: ["Mô hình Thiết bị vệ sinh", "Chuẩn ADA cho người khuyết tật", "Tích hợp đầu nối MEP"],
    },
    tools: ["Autodesk Revit 2024", "Family Editor"],
    brief: {
      en: "Design a commercial-grade wall-mounted vanity unit family (.rfa) compliant with ADA wheelchair clearance guidelines, incorporating parametric solid-surface countertops, under-mount basins, faucet hardware, and active MEP pipe connectors for retail public restrooms.",
      vn: "Thiết kế family bàn lavabo gắn tường thương mại (.rfa) tuân thủ nghiêm ngặt tiêu chuẩn không gian tiếp cận ADA cho người khuyết tật, mặt đá nhân tạo, chậu âm bàn, vòi rửa và các đầu nối đường ống cấp thoát nước MEP.",
    },
    deliverables: {
      en: [
        "Revit Plumbing Fixture Family (.rfa) with built-in ADA clearance 3D subcategory visualization",
        "Parametric counter length, apron depth, back-splash height, and basin spacing for multi-user layouts",
        "Active MEP connectors for Cold Water, Hot Water, and Sanitary Drainage with flow parameters",
        "High-resolution dimensioned submittal sheet for contractor and plumbing coordination",
      ],
      vn: [
        "Family Revit Plumbing Fixture (.rfa) tích hợp khối không gian kiểm tra khoảng hở ADA 3D",
        "Tham số chiều dài mặt đá, độ dày yếm chắn, gờ chống tràn và khoảng cách giữa các hố chậu",
        "Tích hợp các đầu nối MEP cấp nước lạnh, cấp nước nóng và thoát nước thải kèm lưu lượng",
        "Bản vẽ kỹ thuật chi tiết phục vụ phối hợp thi công lắp đặt thực tế",
      ],
    },
    keyResults: {
      en: [
        "100% ADA code compliance verified directly within Revit 3D views",
        "Fully connected MEP piping systems with accurate fixture unit parameters",
        "Submittal documentation produced with automated schedule parameters",
      ],
      vn: [
        "Đảm bảo 100% tiêu chuẩn ADA kiểm tra trực quan ngay trên mô hình Revit 3D",
        "Kết nối đồng bộ với hệ thống đường ống MEP, tự động nhận diện thông số lưu lượng",
        "Bản vẽ chế tạo và thuyết minh kỹ thuật xuất tự động từ mô hình",
      ],
    },
    coverImage: "/images/families/family_vanity_ada_3d.webp",
    galleryImages: [
      "/images/families/family_vanity_ada_3d.webp",
      "/images/families/family_vanity_ada_sheet.webp",
    ],
  },
  {
    id: "door-wpd-system",
    category: "families",
    title: {
      en: "Panel & Wall Panel Door (WPD) System — Parametric Door Family",
      vn: "Hệ Cửa Đi Panel & Cửa WPD — Parametric Door Family",
    },
    subtitle: {
      en: "Revit 2024, Family Editor · Commercial Door Library with Type Catalogs & 2D Swing Symbology",
      vn: "Revit 2024, Family Editor · Thư viện cửa thương mại kèm Type Catalog & ký hiệu mở 2D",
    },
    services: {
      en: ["Parametric Door Creation", "Type Catalog Engineering", "Architectural Detailing"],
      vn: ["Tạo Family cửa đi", "Lập trình Type Catalog", "Chi tiết hóa kiến trúc"],
    },
    tools: ["Autodesk Revit 2024", "Family Editor", "AutoCAD"],
    brief: {
      en: "Develop a comprehensive Revit door family (.rfa) for flush panel and wall panel doors (WPD), supporting single-leaf, double-leaf, vision panels, adjustable frame depths, and automated 2D swing-arc symbology.",
      vn: "Phát triển bộ Family cửa đi Revit hoàn chỉnh (.rfa) cho các dòng cửa phẳng (Flush Panel) và cửa ốp tấm tường (WPD), hỗ trợ cánh đơn, cánh đôi, ô kính quan sát, tùy biến độ dày khuôn và ký hiệu góc mở 2D tiêu chuẩn.",
    },
    deliverables: {
      en: [
        "Parametric Revit Door Family (.rfa) with dynamic leaf width, height, jamb depth, and wall wrap options",
        "Separate 2D symbolic lines in plan with 90° and 45° swing angles for clean sheet printing",
        "External Type Catalog (.txt) with 24 pre-defined commercial door sizes",
        "Embedded hardware schedule parameters (lockset, closer, hinges, fire rating)",
      ],
      vn: [
        "Family cửa đi Revit tham số (.rfa) với tùy biến chiều rộng cánh, chiều cao, khuôn cửa và nẹp tường",
        "Nét vẽ tượng trưng 2D góc mở 90° và 45° hiển thị chuẩn xác trên mặt bằng in ấn",
        "Bảng Type Catalog (.txt) ngoại vi nạp nhanh 24 kích thước cửa thương mại chuẩn",
        "Tích hợp các tham số phụ kiện khóa, bản lề, tay co thủy lực và giới hạn chống cháy",
      ],
    },
    keyResults: {
      en: [
        "Full door schedule synchronization across all floor plans and sheet annotations",
        "Zero graphic conflicts with adjacent wall finish layers and reveals",
        "High-performance family loading in under 1 second",
      ],
      vn: [
        "Đồng bộ 100% bảng thống kê cửa đi trên toàn bộ mặt bằng và khung tên bản vẽ",
        "Không bị lỗi đồ họa giao cắt với các lớp vữa trát và gạch ốp tường",
        "Tốc độ nạp và chèn family vào dự án chỉ dưới 1 giây",
      ],
    },
    coverImage: "/images/families/family_door-wpd_01.webp",
    galleryImages: [
      "/images/families/family_door-wpd_01.webp",
      "/images/families/family_window-fixed_01.webp",
      "/images/families/family_window-sliding_01.webp",
    ],
  },
];
