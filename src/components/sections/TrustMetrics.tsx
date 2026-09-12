"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";

export function TrustMetrics() {
  const { lang } = useLanguage();
  const t = translations[lang].trust;

  return (
    <section className="py-20 sm:py-28 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#30D158] mb-3 inline-block">
            {t.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {t.headline}
          </h2>
        </div>

        {/* 4 Apple Minimalist Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.metrics.map((metric, idx) => (
            <div
              key={metric.label}
              className="apple-glass-card p-8 rounded-3xl flex flex-col justify-between text-left transition-all duration-300"
            >
              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 tabular-nums font-sans">
                  {metric.value}
                </div>
                <h3 className="text-sm font-semibold text-[#E5E5EA] leading-snug mb-2">
                  {metric.label}
                </h3>
              </div>
              <p className="text-xs text-[#86868B] mt-4 pt-3 border-t border-white/5 leading-relaxed">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
