"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, Sparkles, Globe, Menu, X, PlayCircle } from "lucide-react";

export const Header: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-300">
      <div
        className={`w-full max-w-7xl rounded-full transition-all duration-300 border flex items-center justify-between px-5 py-3 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl"
            : "bg-black/40 backdrop-blur-md border-white/10"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                SMOB English Lab
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                48 Days
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              48-Day Foundation Course
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-white transition-colors">
            {t.nav.about}
          </a>
          <a href="#curriculum" className="hover:text-white transition-colors">
            {t.nav.curriculum}
          </a>
          <a href="#verbs" className="hover:text-white transition-colors">
            {t.nav.verbs}
          </a>
          <a href="#exam" className="hover:text-white transition-colors">
            {t.nav.exam}
          </a>
          <a href="#reviews" className="hover:text-white transition-colors">
            {t.nav.testimonials}
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            {t.nav.faq}
          </a>
        </nav>

        {/* Actions & CTA */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === "vi" ? "EN" : "VN"}</span>
          </button>

          {/* Primary CTA - Go to Classroom Web App */}
          <Link
            href="/app"
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-black hover:opacity-95 hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform active:scale-95"
          >
            <PlayCircle className="w-4 h-4 fill-black text-blue-500" />
            <span>{t.nav.startLearning}</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 left-4 right-4 bg-black/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl z-50 flex flex-col gap-4 animate-fadeIn">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.about}
          </a>
          <a
            href="#curriculum"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.curriculum}
          </a>
          <a
            href="#verbs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.verbs}
          </a>
          <a
            href="#exam"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.exam}
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.testimonials}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-semibold text-slate-200 hover:text-blue-400 py-2 border-b border-white/10"
          >
            {t.nav.faq}
          </a>
          <Link
            href="/app"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-full text-center font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/20 mt-2"
          >
            {t.nav.startLearning}
          </Link>
        </div>
      )}
    </header>
  );
};
