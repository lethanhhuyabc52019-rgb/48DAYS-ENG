"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Award, BookCheck, Users2, Sparkles } from "lucide-react";

export const TrustMetrics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center p-4">
          <BookCheck className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-4xl font-extrabold text-white tracking-tight">48 Units</div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Lộ Trình Chuẩn Hóa Từng Ngày</p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Award className="w-8 h-8 text-cyan-400 mb-2" />
          <div className="text-4xl font-extrabold text-cyan-400 tracking-tight">2.000+</div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Câu Trắc Nghiệm Có Giải Thích</p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Sparkles className="w-8 h-8 text-emerald-400 mb-2" />
          <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">398+</div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Động Từ Bất Quy Tắc Audio</p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <Users2 className="w-8 h-8 text-orange-400 mb-2" />
          <div className="text-4xl font-extrabold text-orange-400 tracking-tight">100%</div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Lấy Lại Nền Tảng Tự Tin</p>
        </div>
      </div>
    </section>
  );
};
