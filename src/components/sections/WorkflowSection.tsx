"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";

export function WorkflowSection() {
  const { lang } = useLanguage();
  const t = translations[lang].workflow;

  return (
    <section id="workflow" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            {t.tag}
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6]">
            {t.subheadline}
          </p>
        </div>

        {/* 4 Step Process Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.steps.map((step) => (
            <div
              key={step.num}
              className="apple-glass-card p-8 rounded-3xl flex flex-col justify-between text-left transition-all duration-300"
            >
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-white/25 block mb-5 tabular-nums">
                  {step.num}
                </span>

                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A1A1A6] leading-relaxed mb-6">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs">
                <div className="text-[#86868B] text-[11px] uppercase font-semibold tracking-wider mb-1">
                  {lang === "en" ? "Outcome" : "Kết quả"}:
                </div>
                <div className="text-[#30D158] font-medium leading-snug">
                  ✓ {step.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
