import React from "react";

export const StructuredData: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "SMOB English Lab",
    description:
      "48-Day Foundation English Course: 48 Video lessons, in-depth grammar theory, 2,000+ quizzes with detailed explanations, and 398+ irregular verbs audio flashcards.",
    url: "https://48smobeng.vercel.app",
    course: {
      "@type": "Course",
      name: "48-Day English Foundation Course",
      description:
        "Master English grammar, vocabulary, irregular verbs, and active sentence construction in 48 days.",
      provider: {
        "@type": "Organization",
        name: "SMOB English Lab",
        sameAs: "https://github.com/lethanhhuyabc52019-rgb/48DAYS-ENG",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
