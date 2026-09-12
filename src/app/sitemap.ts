import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://48smobeng.vercel.app";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}?lang=en`,
          vi: `${baseUrl}?lang=vn`,
        },
      },
    },
    {
      url: `${baseUrl}/app`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
