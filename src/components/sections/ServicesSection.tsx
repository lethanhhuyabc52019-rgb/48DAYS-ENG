"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { servicesData } from "@/data/servicesData";
import { Layers, Cpu, Code2, Box, FileSpreadsheet, Check, ArrowRight } from "lucide-react";

export function ServicesSection() {
  const { lang } = useLanguage();
  const t = translations[lang].services;

  const iconMap: Record<string, React.ElementType> = {
    Layers,
    Cpu,
    Code2,
    Box,
    FileSpreadsheet,
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
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

        {/* 5 Balanced Services Grid (3 on Top Row, 2 on Bottom Row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {servicesData.map((service, idx) => {
            const Icon = iconMap[service.iconName] || Layers;
            // Top 3 cards span 2 columns each (2*3 = 6), Bottom 2 cards span 3 columns each (3*2 = 6)
            const isTopRow = idx < 3;
            const isLastOnTablet = idx === 4;

            return (
              <div
                key={service.id}
                className={`apple-glass-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between text-left transition-all duration-300 group border border-white/10 hover:border-white/20 ${
                  isTopRow ? "lg:col-span-2" : "lg:col-span-3"
                } ${isLastOnTablet ? "md:col-span-2 lg:col-span-3" : ""}`}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#2997FF]" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] text-[#A1A1A6] border border-white/10">
                      {service.badge[lang]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {service.title[lang]}
                  </h3>

                  <p className="text-sm text-[#A1A1A6] leading-relaxed mb-6">
                    {service.shortDesc[lang]}
                  </p>

                  {/* Bullet Details */}
                  <div className="space-y-2.5 pt-4 border-t border-white/5">
                    {service.details[lang].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#E5E5EA]">
                        <Check className="w-3.5 h-3.5 text-[#30D158] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2997FF] hover:text-white transition-colors"
                  >
                    <span>{lang === "en" ? "Consult on this service" : "Tư vấn dịch vụ này"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
