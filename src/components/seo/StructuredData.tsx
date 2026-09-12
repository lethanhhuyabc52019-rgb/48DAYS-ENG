import React from "react";
import { faqData } from "@/data/toolFeaturesData";

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smobim.online";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "SMOB BIM Automation",
    alternateName: ["SMO-BIM", "SMOB"],
    url: baseUrl,
    logo: `${baseUrl}/images/logo.jpg`,
    description:
      "Automate Autodesk Revit workflows and save 70%–90% time. Architectural and structural BIM modeling, Dynamo algorithms, and custom Revit API Add-ins.",
    email: "smob.bim@gmail.com",
    sameAs: [
      "https://www.youtube.com/@smobim",
      "https://www.linkedin.com/in/smobim",
      "https://www.facebook.com/share/152gYtXgKzp/?mibextid=wwXIfr",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "smob.bim@gmail.com",
      contactType: "customer support",
      availableLanguage: ["English", "Vietnamese"],
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/#software`,
    name: "SMOB Suite — Revit Automation Add-in",
    operatingSystem: "Windows 10, Windows 11 (Autodesk Revit 2020–2026)",
    applicationCategory: "BusinessApplication",
    downloadUrl: `${baseUrl}/downloads/SMOB_Setup.zip`,
    softwareVersion: "2026.12.8 Pro",
    offers: {
      "@type": "Offer",
      price: "149000",
      priceCurrency: "VND",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      description: "Early-Bird Lifetime Access · Limited 50 Slots · Free Updates",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.en,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
