"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Menu, X, ArrowRight } from "lucide-react";

export function Header() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang].nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: t.about },
    { href: "#services", label: t.services },
    { href: "#smob-tool", label: t.tool },
    { href: "#dynamo", label: t.dynamo },
    { href: "#portfolio", label: t.portfolio },
    { href: "#reviews", label: t.reviews },
    { href: "#faq", label: t.faq },
    { href: "#contact", label: t.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 py-3 sm:py-4">
      <div
        className={`max-w-6xl mx-auto rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${
          isScrolled
            ? "apple-glass shadow-2xl"
            : "bg-black/40 backdrop-blur-xl border border-white/10"
        }`}
      >
        {/* Brand Logo */}
        <Link href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/15 group-hover:border-white/30 transition-all shadow-md">
            <Image
              src="/images/logo.webp"
              alt="SMOB"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-white">
              SMOB
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[#A1A1A6] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Apple Segmented Language Switcher & Pill CTA */}
        <div className="hidden sm:flex items-center gap-3.5">
          {/* Apple Segmented Switcher */}
          <div className="flex items-center bg-[#1c1c1e]/80 border border-white/10 rounded-full p-0.5 shadow-inner">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === "en"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-[#86868B] hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("vn")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === "vn"
                  ? "bg-white text-black shadow-sm font-bold"
                  : "text-[#86868B] hover:text-white"
              }`}
            >
              VN
            </button>
          </div>

          {/* Apple Pill Primary CTA */}
          <a
            href="#contact"
            className="apple-pill-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-black bg-white hover:bg-[#E8E8ED] transition-all shadow-md"
          >
            <span>{t.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-[#1c1c1e] border border-white/10 rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded-full font-medium ${
                lang === "en" ? "bg-white text-black font-bold" : "text-[#86868B]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("vn")}
              className={`px-2 py-0.5 rounded-full font-medium ${
                lang === "vn" ? "bg-white text-black font-bold" : "text-[#86868B]"
              }`}
            >
              VN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 rounded-3xl apple-glass p-6 space-y-4 animate-fadeIn border border-white/10">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-medium text-[#E5E5EA] hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-white/10">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-black bg-white hover:bg-slate-200 transition-all"
            >
              <span>{t.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
