export interface DynamoItem {
  id: string;
  number: string;
  title: {
    en: string;
    vn: string;
  };
  image: string;
}

export const dynamoData: DynamoItem[] = [
  {
    id: "dynamo-sheets",
    number: "01",
    title: {
      en: "Batch Automated Sheet Creation & View Placement",
      vn: "Tự Động Tạo Hàng Loạt Bản Vẽ (Sheets) & Căn Chỉnh Viewport",
    },
    image: "/images/dynamo/dynamo_auto_sheet.webp",
  },
  {
    id: "dynamo-renumber",
    number: "02",
    title: {
      en: "Batch Automated Renumbering & Parameter Formatter",
      vn: "Tự Động Đổi Tên & Đánh Số Tham Số Hàng Loạt",
    },
    image: "/images/dynamo/dynamo_auto_renumber.webp",
  },
  {
    id: "dynamo-join",
    number: "03",
    title: {
      en: "Automated Geometry Join & Conflict Resolver",
      vn: "Tự Động Join Hình Học Cấu Kiện & Xử Lý Giao Cắt",
    },
    image: "/images/dynamo/dynamo_auto_join.webp",
  },
  {
    id: "dynamo-excel",
    number: "04",
    title: {
      en: "Live Two-Way Excel & Revit Parameter Sync",
      vn: "Đồng Bộ 2 Chiều Dữ Liệu Tham Số Excel & Revit",
    },
    image: "/images/dynamo/dynamo_excel_sync.webp",
  },
  {
    id: "dynamo-facade",
    number: "05",
    title: {
      en: "Parametric Facade Patterns & Generative Geometry",
      vn: "Tạo Lập Mặt Đứng Tham Số & Vỏ Bao Che Phức Tạp",
    },
    image: "/images/dynamo/dynamo_parametric_facade.webp",
  },
];
