"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

function OnboardingHeader() {
  const { step } = useOnboarding();
  const { lang, setLang } = useLanguage();

  return (
    <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[#A1A1A6] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "en" ? "Back to Home" : "Về Trang Chủ"}</span>
        </Link>

        <div className="h-4 w-px bg-white/15 hidden sm:block" />

        <Link href="/" className="hidden sm:flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-white/10">
            <Image src="/images/logo.jpg" alt="SMO-BIM" fill className="object-cover" />
          </div>
          <span className="font-semibold text-sm text-white tracking-tight">
            SMO<span className="text-[#2997FF]">-BIM</span>
          </span>
        </Link>
      </div>

      {/* Progress Pill */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#86868B] font-mono">
          <span>{lang === "en" ? "Step" : "Bước"}</span>
          <span className="font-bold text-white">{step}</span>
          <span>/ 5</span>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-white"
                  : i < step
                  ? "w-2 bg-[#30D158]"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Language switcher */}
        <div className="flex items-center bg-[#1c1c1e] border border-white/10 rounded-full p-0.5 text-xs ml-2">
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
      </div>
    </header>
  );
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-black text-slate-100 flex flex-col justify-between">
        <OnboardingHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {children}
        </main>
        <footer className="py-4 border-t border-white/10 text-center text-xs text-[#6E6E73] bg-black">
          © 2026 SMO-BIM · Confidential Assessment · ISO 19650 & BEP Aligned
        </footer>
      </div>
    </OnboardingProvider>
  );
}
