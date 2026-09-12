"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PlayCircle, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const FinalCtaSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 bg-white/[0.03] border border-white/15 rounded-3xl p-10 sm:p-16 backdrop-blur-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bắt Đầu Ngay Hôm Nay</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {t.finalCta.title}
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-8">
          {t.finalCta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            href="/app"
            className="w-full sm:w-auto px-10 py-5 rounded-full font-bold text-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-black shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <PlayCircle className="w-6 h-6 fill-black" />
            <span>{t.finalCta.button}</span>
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          {t.finalCta.guarantee}
        </p>
      </div>
    </section>
  );
};
