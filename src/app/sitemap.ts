import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smobim.online";
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
      url: `${baseUrl}/onboarding`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/onboarding?lang=en`,
          vi: `${baseUrl}/onboarding?lang=vn`,
        },
      },
    },
  ];
}
