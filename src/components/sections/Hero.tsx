"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PlayCircle, Sparkles, BookOpen, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Course Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-white/20 transition-all">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300">
            {t.hero.badge}
          </span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          {t.hero.headlineStart}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
            {t.hero.headlineGradient}
          </span>{" "}
          {t.hero.headlineEnd}
        </h1>

        {/* Subheadline */}
        <p className="max-w-3xl text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          {t.hero.subheadline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-black shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <PlayCircle className="w-5 h-5 fill-black text-cyan-400" />
            <span>{t.hero.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>

          <a
            href="#curriculum"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-slate-300" />
            <span>{t.hero.ctaSecondary}</span>
          </a>
        </div>

        {/* 4 Bento Trust Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md text-left hover:border-blue-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
              {t.hero.stats.units}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.stats.unitsLabel}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md text-left hover:border-cyan-400/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight mb-1">
              {t.hero.stats.questions}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.stats.questionsLabel}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md text-left hover:border-emerald-400/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight mb-1">
              {t.hero.stats.verbs}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.stats.verbsLabel}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md text-left hover:border-orange-400/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-black text-orange-400 tracking-tight mb-1">
              {t.hero.stats.guarantee}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 font-medium">
              {t.hero.stats.guaranteeLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
