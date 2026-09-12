"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { ArrowRight } from "lucide-react";

export function FinalCtaSection() {
  const { lang } = useLanguage();
  const t = translations[lang].ctaBanner;

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="apple-glass p-10 sm:p-14 lg:p-16 rounded-3xl space-y-6 shadow-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F0A] inline-block">
            {lang === "en" ? "TRANSFORM YOUR WORKFLOW" : "TỐI ƯU HÓA QUY TRÌNH"}
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6] max-w-xl mx-auto leading-relaxed">
            {t.subheadline}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#contact"
              className="apple-pill-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all"
            >
              <span>{t.ctaButton}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#smob-tool"
              className="apple-pill-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all"
            >
              <span>{t.secondaryButton}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
