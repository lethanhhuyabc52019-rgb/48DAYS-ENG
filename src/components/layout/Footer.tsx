"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Mail, Linkedin, Youtube, Facebook, ArrowUp } from "lucide-react";

export function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-white/10 text-[#86868B] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="#" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/15">
                <Image
                  src="/images/logo.webp"
                  alt="SMOB"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                SMOB
              </span>
            </Link>

            <p className="text-sm text-[#A1A1A6] leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="mailto:smob.bim@gmail.com"
                className="w-9 h-9 rounded-full bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#A1A1A6] hover:text-white hover:border-white/30 transition-all"
                aria-label="Email SMOB"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/smobim"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#A1A1A6] hover:text-white hover:border-white/30 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@smobim"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#A1A1A6] hover:text-white hover:border-white/30 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/152gYtXgKzp/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-[#A1A1A6] hover:text-white hover:border-white/30 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="text-left">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#smob-tool" className="hover:text-white transition-colors">
                  {t.nav.tool}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  {t.nav.portfolio}
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  {t.nav.workflow}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-left">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.servicesTitle}
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === "en" ? "BIM Modeling" : "Dựng hình BIM"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === "en" ? "Dynamo Automation" : "Dynamo Automation"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === "en" ? "Revit API Add-ins" : "Revit API Add-in"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === "en" ? "Parametric Families" : "Parametric Families"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {lang === "en" ? "Documentation Sets" : "Hồ sơ Bản vẽ"}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="text-left">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              {lang === "en" ? "Contact" : "Liên Hệ"}
            </h4>
            <div className="space-y-3 text-[13px]">
              <div className="flex flex-col">
                <span className="text-xs text-[#6E6E73]">Email</span>
                <a href="mailto:smob.bim@gmail.com" className="text-white hover:text-[#2997FF] font-medium">
                  smob.bim@gmail.com
                </a>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#6E6E73]">Status</span>
                <span className="text-[#30D158] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
                  {lang === "en" ? "Ready for Consultation" : "Sẵn sàng tiếp nhận dự án"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p>{t.footer.legal}</p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1e] text-[#A1A1A6] hover:text-white transition-colors"
          >
            <span>{lang === "en" ? "Back to top" : "Về đầu trang"}</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
