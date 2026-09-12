"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Video, BookMarked, CheckCircle2, Volume2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const AboutSolution: React.FC = () => {
  const { t } = useLanguage();

  const getPillarIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Video className="w-6 h-6 text-blue-400" />;
      case 1:
        return <BookMarked className="w-6 h-6 text-cyan-400" />;
      case 2:
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      default:
        return <Volume2 className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.solution.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.solution.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.solution.subtitle}
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.solution.pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/[0.06] hover:border-blue-500/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getPillarIcon(index)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {pillar.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all"
          >
            <span>Trải nghiệm 4 trụ cột trong phòng học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
