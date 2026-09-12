"use client";

import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { ArrowRight, Sparkles, CheckCircle2, Clock, Cpu } from "lucide-react";

export function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang].hero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    // Defer 14MB video stream slightly so initial HTML/CSS renders in under 50ms
    const timer = setTimeout(() => {
      setVideoSrc("/videos/intro-smob.mp4");
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.playbackRate = 0.95;
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrc]);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24 bg-black">
      {/* Background Fullscreen Video - High Clarity & Cinematic Vivid Look */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        {videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-85 scale-[1.01] filter contrast-105 brightness-95"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Subtle Cinematic Overlays for Perfect Readability */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/65" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Apple Minimalist Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          {t.badges.map((badge) => (
            <span
              key={badge}
              className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide bg-white/5 border border-white/10 text-[#E5E5EA] backdrop-blur-md"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Main Apple Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.12] max-w-4xl mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          {lang === "en" ? (
            <>
              <span className="block">Automate Revit</span>
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F5F7] to-[#D1D1D6]">
                Deliver BIM Work Faster
              </span>
            </>
          ) : (
            <>
              <span className="block">Tự động hóa Revit</span>
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F5F7] to-[#D1D1D6]">
                Tăng tốc triển khai BIM
              </span>
            </>
          )}
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-[#D1D1D6] max-w-2xl leading-relaxed mb-10 font-normal drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
          {t.subheadline}
        </p>

        {/* Apple Pill Button Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-14 sm:mb-16">
          <a
            href="#contact"
            className="apple-pill-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all"
          >
            <span>{t.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#portfolio"
            className="apple-pill-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all"
          >
            <span>{t.ctaSecondary}</span>
          </a>
        </div>

        {/* Minimalist Apple Stats Strip */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="p-4 sm:p-5 rounded-2xl apple-glass-card border border-white/15 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 tabular-nums">
              70%–90%
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {lang === "en" ? "Repetitive task reduction" : "Tiết kiệm thời gian lặp lại"}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl apple-glass-card border border-white/15 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 tabular-nums">
              100%
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {lang === "en" ? "Zero data typing errors" : "Triệt tiêu lỗi nhập số hiệu"}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl apple-glass-card border border-white/15 backdrop-blur-xl flex flex-col justify-between shadow-2xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 tabular-nums">
              &lt; 3s
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {lang === "en" ? "Batch element execution" : "Xử lý hàng nghìn cấu kiện"}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl apple-glass-card border border-[#FF9F0A]/40 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/40">
                {lang === "en" ? "Early Bird" : "Ưu Đãi"}
              </span>
              <span className="text-xs text-[#86868B] line-through tabular-nums">
                {lang === "en" ? "$39" : "499k"}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF9F0A] tracking-tight mb-1 tabular-nums">
              {lang === "en" ? "$9 USD" : "149.000đ"}
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {lang === "en" ? "Lifetime · 50 slots only" : "Sở hữu trọn đời · 50 suất đầu"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
