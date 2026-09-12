"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { LeadFormSchema, LeadFormData } from "@/lib/validation";
import {
  Mail,
  Linkedin,
  Youtube,
  Facebook,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export function ContactBookingSection() {
  const { lang } = useLanguage();
  const t = translations[lang].contact;
  const f = t.form;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      service: f.serviceOptions[0],
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setSubmitError(null);
    try {
      const emailSubject = `[SMOB Client Request] — ${data.service} — ${data.name}`;
      const emailBody = `Họ và tên: ${data.name}\nSố điện thoại: ${data.phone}\nEmail: ${data.email}\nDịch vụ: ${data.service}\n\nNội dung yêu cầu:\n${data.message}\n\n---\nThời gian gửi: ${new Date().toLocaleString()}`;

      // 1. Send directly in background to smob.bim@gmail.com via FormSubmit AJAX API
      try {
        await fetch("https://formsubmit.co/ajax/smob.bim@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: emailSubject,
            _template: "table",
            name: data.name,
            phone: data.phone,
            email: data.email,
            service: data.service,
            message: data.message,
          }),
        });
      } catch (err) {
        console.warn("Background form API dispatch warning:", err);
      }

      // 2. Open mailto client fallback for instant direct email
      const mailtoUrl = `mailto:smob.bim@gmail.com?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = mailtoUrl;
      }

      // 3. Persist locally for instant tracking
      const leadId = `SMOB-${Date.now().toString(36).toUpperCase()}`;
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("smob_leads") || "[]");
        stored.push({ ...data, leadId, timestamp: new Date().toISOString() });
        localStorage.setItem("smob_leads", JSON.stringify(stored));
      }

      setIsSubmitted(true);
      reset();
    } catch {
      setSubmitError("An error occurred. Please reach out to smob.bim@gmail.com directly.");
    }
  };

  const channelIcons = [Mail, Linkedin, Youtube, Facebook];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            {t.tag}
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6]">
            {t.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left">
          {/* Left Column: Direct Contacts & Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="apple-glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.directChannels}
              </h3>

              <div className="space-y-3">
                {t.channels.map((channel, idx) => {
                  const Icon = channelIcons[idx % channelIcons.length];
                  return (
                    <a
                      key={channel.name}
                      href={channel.link}
                      target={channel.link.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="p-4 rounded-2xl bg-[#0e0e14] border border-white/5 hover:border-white/20 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] text-[#6E6E73] font-mono">{channel.name}</div>
                          <div className="text-sm font-medium text-white group-hover:text-[#2997FF] transition-colors">
                            {channel.value}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6E6E73] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </a>
                  );
                })}
              </div>

              {/* SLA Response Guarantee */}
              <div className="p-4 rounded-2xl bg-[#0e0e14] border border-white/5 flex items-center gap-3 text-xs text-[#A1A1A6]">
                <Clock className="w-4 h-4 text-[#30D158] shrink-0" />
                <span>
                  {lang === "en"
                    ? "Guaranteed response within 24 business hours."
                    : "Cam kết phản hồi trong vòng 24 giờ làm việc."}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: React Hook Form + Zod Validated Form */}
          <div className="lg:col-span-7">
            <div className="apple-glass p-8 sm:p-10 rounded-3xl shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-[#30D158]/10 flex items-center justify-center text-[#30D158] mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{f.successTitle}</h3>
                  <p className="text-[#A1A1A6] text-sm max-w-sm mx-auto leading-relaxed">
                    {f.successDesc}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="apple-pill-btn mt-6 px-6 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {lang === "en" ? "Send Another Message" : "Gửi yêu cầu khác"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {submitError && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#A1A1A6]">
                        {f.name} <span className="text-[#FF453A]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder={f.namePlaceholder}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border text-white text-sm focus:outline-none transition-colors ${
                          errors.name ? "border-red-500/50" : "border-white/10 focus:border-white"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 font-mono">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone / Zalo */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#A1A1A6]">
                        {f.phone} <span className="text-[#FF453A]">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder={f.phonePlaceholder}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border text-white text-sm focus:outline-none transition-colors ${
                          errors.phone ? "border-red-500/50" : "border-white/10 focus:border-white"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-400 font-mono">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      {f.email} <span className="text-[#FF453A]">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder={f.emailPlaceholder}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border text-white text-sm focus:outline-none transition-colors ${
                        errors.email ? "border-red-500/50" : "border-white/10 focus:border-white"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-400 font-mono">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Primary Service Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      {f.service}
                    </label>
                    <select
                      {...register("service")}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border border-white/10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    >
                      {f.serviceOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#14141e] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Project Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      {f.message} <span className="text-[#FF453A]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      {...register("message")}
                      placeholder={f.messagePlaceholder}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border text-white text-sm focus:outline-none transition-colors resize-none ${
                        errors.message ? "border-red-500/50" : "border-white/10 focus:border-white"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-red-400 font-mono">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Apple Pill Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="apple-pill-btn w-full py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{f.submit}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
