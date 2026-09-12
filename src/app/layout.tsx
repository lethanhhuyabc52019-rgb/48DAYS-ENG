import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CleanUrlHandler } from "@/components/ui/CleanUrlHandler";
import { StructuredData } from "@/components/seo/StructuredData";
import Script from "next/script";

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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smobim.online";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SMOB | Revit Automation & BIM Engineering Services",
    template: "%s | SMOB",
  },
  description:
    "Automate Autodesk Revit workflows and save 70%–90% time. Architectural and structural BIM modeling, Dynamo algorithms, and custom Revit API Add-ins.",
  keywords: [
    "Revit Automation",
    "BIM Modeling",
    "Dynamo Scripts",
    "Revit API Tools",
    "AEC Automation",
    "Parametric Revit Families",
    "BIM Outsourcing",
    "Construction Technology",
    "SMOB",
    "Tự động hóa Revit",
    "BIM Vietnam",
  ],
  authors: [{ name: "SMOB Team", url: baseUrl }],
  creator: "SMOB Team",
  publisher: "SMOB BIM Automation",
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  alternates: {
    canonical: "./",
    languages: {
      "en-US": "/?lang=en",
      "vi-VN": "/?lang=vn",
    },
  },
  openGraph: {
    title: "SMOB | Revit Automation & BIM Engineering",
    description:
      "Transform repetitive Revit tasks into 1-click automation. Save 70%–90% engineering time with practical BIM and software solutions.",
    url: baseUrl,
    siteName: "SMOB BIM Automation",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    images: [
      {
        url: "/images/logo.jpg",
        width: 800,
        height: 800,
        alt: "SMOB BIM Automation Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMOB | Revit Automation & BIM Engineering",
    description:
      "Transform repetitive Revit tasks into 1-click automation. Save 70%–90% engineering time with practical BIM and software solutions.",
    images: ["/images/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-black text-[#F5F5F7] antialiased selection:bg-white selection:text-black`}>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HXJ47E8EMZ"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HXJ47E8EMZ');
          `}
        </Script>

        <StructuredData />
        <CleanUrlHandler />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
