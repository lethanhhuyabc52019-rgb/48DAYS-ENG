"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { faqData } from "@/data/toolFeaturesData";
import { Plus, Minus, HelpCircle } from "lucide-react";

export function FaqSection() {
  const { lang } = useLanguage();
  const t = translations[lang].faq;
  const [openIndices, setOpenIndices] = useState<number[]>([0, 3]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#2997FF] bg-[#2997FF]/10 border border-[#2997FF]/20 mb-2.5 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2.5">
            {t.headline}
          </h2>

          <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-xl mx-auto">
            {t.subheadline}
          </p>
        </div>

        {/* Compact Minimalist Accordion List */}
        <div className="space-y-2.5">
          {faqData.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`apple-glass-card rounded-2xl overflow-hidden transition-all duration-200 border ${
                  isOpen ? "border-white/20 bg-white/[0.04]" : "border-white/10 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-white leading-snug">
                    {item.question[lang]}
                  </span>
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#A1A1A6]">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4.5 pt-0 text-xs sm:text-[13px] text-[#A1A1A6] leading-relaxed border-t border-white/5 animate-fadeIn">
                    {item.answer[lang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
