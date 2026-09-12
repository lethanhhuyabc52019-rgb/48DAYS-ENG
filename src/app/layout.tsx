import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CleanUrlHandler } from "@/components/ui/CleanUrlHandler";
import { StructuredData } from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://48smobeng.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SMOB English Lab — Khóa Học 48 Ngày Lấy Lại Gốc Tiếng Anh",
    template: "%s | SMOB English Lab",
  },
  description:
    "Nền tảng học tiếng Anh trực tuyến toàn diện 48 ngày: 48 Video bài giảng, Lý thuyết phân tích cấu trúc, 2.000+ câu trắc nghiệm có giải thích chi tiết đáp án và 398+ Flashcards động từ bất quy tắc kèm Audio phát âm bản xứ.",
  keywords: [
    "Khóa học tiếng Anh 48 ngày",
    "Lấy gốc tiếng Anh",
    "Ngữ pháp tiếng Anh căn bản",
    "Trắc nghiệm tiếng Anh có giải thích",
    "Flashcard động từ bất quy tắc",
    "SMOB English Lab",
    "English Foundation Course",
    "Học tiếng Anh online",
  ],
  authors: [{ name: "SMOB English Lab", url: baseUrl }],
  creator: "SMOB English Lab",
  publisher: "SMOB English Lab",
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "/?lang=en",
      "vi-VN": "/?lang=vn",
    },
  },
  openGraph: {
    title: "SMOB English Lab — Bứt Phá Tiếng Anh Trong 48 Ngày",
    description:
      "Lộ trình 48 ngày lấy lại nền tảng tiếng Anh vững chắc: 48 Units video bài giảng, lý thuyết chuẩn mực, 2.000+ bài tập trắc nghiệm có giải thích chi tiết và 398+ động từ bất quy tắc audio.",
    url: baseUrl,
    siteName: "SMOB English Lab",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMOB English Lab — Khóa Học 48 Ngày Lấy Lại Gốc Tiếng Anh",
    description:
      "Lộ trình 48 ngày lấy lại nền tảng tiếng Anh vững chắc: 48 Units video bài giảng, lý thuyết chuẩn mực, trắc nghiệm thông minh và flashcards audio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-black text-[#F5F5F7] antialiased selection:bg-cyan-400 selection:text-black`}
      >
        <StructuredData />
        <CleanUrlHandler />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
