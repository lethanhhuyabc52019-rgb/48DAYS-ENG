"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, Github, Youtube, Mail, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-white/10 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Philosophy */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              SMOB English Lab
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            {t.footer.brandDesc}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/lethanhhuyabc52019-rgb/48DAYS-ENG"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/30 transition-all"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:lethanhhuyabc52019@gmail.com"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/30 transition-all"
              title="Email Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Col 2: Fast Navigation */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
            {t.footer.linksTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/app" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                Phòng Học Online <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
            <li>
              <a href="#curriculum" className="hover:text-blue-400 transition-colors">
                Lộ Trình 48 Units
              </a>
            </li>
            <li>
              <a href="#verbs" className="hover:text-blue-400 transition-colors">
                398+ Động Từ Bất Quy Tắc
              </a>
            </li>
            <li>
              <a href="#exam" className="hover:text-blue-400 transition-colors">
                Động Cơ Thi Trắc Nghiệm
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-blue-400 transition-colors">
                Giải Đáp Thắc Mắc
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Curriculum Overview */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
            {t.footer.curriculumTitle}
          </h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Giai đoạn 1: Nền tảng cốt lõi (Unit 1-10)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Giai đoạn 2: Các thì căn bản (Unit 11-20)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Giai đoạn 3: Ngữ pháp chuyên sâu (Unit 21-35)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Giai đoạn 4: Đột phá phản xạ (Unit 36-48)
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>{t.footer.copyright}</p>
        <p>Built with Next.js, Tailwind CSS & Antigravity.</p>
      </div>
    </footer>
  );
};
