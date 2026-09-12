"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { toolVideos, PLAYLIST_URL, ToolVideoItem } from "@/data/toolVideosData";
import {
  Play,
  ExternalLink,
  Sparkles,
  Youtube,
  Clock,
  Volume2,
} from "lucide-react";

interface InteractiveVideoStudioProps {
  onSelectFeature?: (featureId: string) => void;
}

export function InteractiveVideoStudio({ onSelectFeature }: InteractiveVideoStudioProps) {
  const { lang } = useLanguage();
  const t = translations[lang].tool.videoShowcase;
  const [videos, setVideos] = useState<ToolVideoItem[]>(toolVideos);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync latest playlist videos dynamically from YouTube RSS feed via Next.js API
  useEffect(() => {
    let isMounted = true;
    async function syncPlaylist() {
      try {
        const res = await fetch("/api/youtube-playlist");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.videos?.length > 0) {
            setVideos(data.videos);
          }
        }
      } catch (err) {
        console.warn("Using offline/fallback playlist dataset:", err);
      }
    }
    syncPlaylist();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeVideo: ToolVideoItem = videos[activeVideoIndex] || videos[0] || toolVideos[0];

  const handleVideoSelect = (index: number) => {
    setActiveVideoIndex(index);
    // Immediately play the newly selected video
    setIsPlaying(true);

    const selectedVid = videos[index];
    if (selectedVid?.featureId && onSelectFeature) {
      onSelectFeature(selectedVid.featureId);
    }
  };

  // Structured Data Schema for Google Video Rich Snippets (SEO & GEO)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": lang === "vn" ? "SMOB Tool: Chuỗi Video Tự Động Hóa Revit" : "SMOB Tool: Revit Automation Video Showcase",
    "description": lang === "vn" 
      ? "Danh sách video demo và hướng dẫn các tính năng tự động hóa Revit chuyên sâu của SMOB Add-in."
      : "Official video walkthrough and feature demonstrations of the SMOB Revit Automation Add-in.",
    "itemListElement": videos
      .filter((video) => !video.isComingSoon && Boolean(video.id))
      .map((video, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "VideoObject",
          "name": video.title[lang],
          "description": video.description[lang],
          "thumbnailUrl": [
            `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
          ],
          "uploadDate": video.uploadDate,
          "duration": `PT${video.duration.replace(":", "M")}S`,
          "embedUrl": `https://www.youtube.com/embed/${video.id}`,
          "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
          "publisher": {
            "@type": "Organization",
            "name": "SMOB BIM Automation",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.youtube.com/@smobim",
            },
          },
        },
      })),
  };

  return (
    <div className="space-y-8">
      {/* Invisible Schema Script for Googlebot Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Showcase Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug mb-3">
          {t.headline}
        </h3>

        <p className="text-sm sm:text-base text-[#A1A1A6] max-w-2xl mx-auto">
          {t.subheadline}
        </p>
      </div>

      {/* Video Studio Card Container */}
      <div className="apple-glass rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/15 bg-gradient-to-b from-[#12121a]/90 to-[#0a0a10]/95 backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left / Main Stage: 16:9 Cinema Player (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] group">
              {activeVideo.isComingSoon || !activeVideo.id ? (
                /* Scheduled Premiere Glass Card */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#12121e] via-[#0d0d16] to-[#08080c]">
                  {/* Ambient Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,149,0,0.12)_0%,transparent_70%)] pointer-events-none" />

                  {/* Top Status */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF9500]/15 border border-[#FF9500]/30 text-[#FF9500] backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-pulse" />
                      {activeVideo.badge[lang]}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-white/5 border border-white/10 text-[#A1A1A6]">
                      {t.scheduledBadge}
                    </span>
                  </div>

                  {/* Icon & Message */}
                  <div className="relative z-10 max-w-md space-y-3">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-[#FF9500]/10 border border-[#FF9500]/30 backdrop-blur-md flex items-center justify-center text-[#FF9500] shadow-[0_0_30px_rgba(255,149,0,0.2)]">
                      <Clock className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h4 className="text-base sm:text-xl font-bold text-white tracking-tight">
                      {t.scheduledTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
                      {t.scheduledNotice}
                    </p>
                    <div className="pt-2">
                      <a
                        href={PLAYLIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#30D158] hover:bg-[#28b84d] text-black shadow-lg transition-all"
                      >
                        <Youtube className="w-4 h-4 fill-black" />
                        <span>{t.subscribeBtn}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : isPlaying ? (
                /* Active YouTube Iframe Player with unique dynamic key */
                <iframe
                  key={`${activeVideo.id}-${activeVideo.number}-${activeVideoIndex}`}
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={activeVideo.title[lang]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                /* High Performance Facade Poster (Zero JS drag until click) */
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center select-none"
                >
                  {/* YouTube High-Res Poster */}
                  <Image
                    src={`https://img.youtube.com/vi/${activeVideo.id}/maxresdefault.jpg`}
                    alt={activeVideo.title[lang]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 750px"
                    className="object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 ease-out"
                    priority
                  />

                  {/* Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 border border-white/20 text-white backdrop-blur-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
                      {activeVideo.badge[lang]}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 border border-white/10 text-[#A1A1A6] backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeVideo.duration}
                    </span>
                  </div>

                  {/* Center Apple Play Button */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:bg-[#30D158] group-hover:text-black group-hover:border-[#30D158] transition-all duration-300">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 drop-shadow-md bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {t.clickToPlay}
                    </span>
                  </div>

                  {/* Bottom Highlight Strip */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10">
                    <p className="text-xs sm:text-sm font-semibold text-white line-clamp-1 drop-shadow-md">
                      {activeVideo.title[lang]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Meta & Actions Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#30D158]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeVideo.highlight[lang]}</span>
                </div>
                <p className="text-xs text-[#86868B] max-w-xl leading-relaxed">
                  {activeVideo.description[lang]}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all duration-200"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000]" />
                  <span>{t.playlistBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#86868B]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right / Playlist Drawer (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {t.playlistTitle}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-[#30D158] bg-[#30D158]/10 border border-[#30D158]/20">
                {videos.length} {lang === "vn" ? "Video Thực Chiến" : "Video Episodes"}
              </span>
            </div>

            {/* Playlist Scrollable Items */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {videos.map((video, idx) => {
                const isCurrent = idx === activeVideoIndex;

                return (
                  <button
                    key={`${video.id || "soon"}-${video.number}-${idx}`}
                    onClick={() => handleVideoSelect(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 group ${
                      isCurrent
                        ? "bg-[#1f1f2e] border-[#30D158]/50 shadow-[0_4px_20px_rgba(48,209,88,0.15)] ring-1 ring-[#30D158]/40"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                    }`}
                  >
                    {/* Thumbnail Mini Preview */}
                    <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                      {video.isComingSoon || !video.id ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.03] text-[#FF9500]">
                          <Clock className="w-5 h-5 opacity-90" />
                          <span className="text-[9px] font-mono text-[#A1A1A6] mt-0.5">Soon</span>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                            alt={video.title[lang]}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                          {isCurrent ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[#30D158]">
                              <Volume2 className="w-5 h-5 animate-pulse" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-mono bg-black/80 text-white">
                            {video.duration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title & Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isCurrent
                              ? "bg-[#30D158] text-black"
                              : video.isComingSoon
                              ? "bg-[#FF9500]/20 text-[#FF9500] border border-[#FF9500]/30"
                              : "bg-white/10 text-[#86868B]"
                          }`}
                        >
                          #{video.number}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-[#30D158] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-ping" />
                            {video.isComingSoon ? t.scheduledBadge : t.nowPlaying}
                          </span>
                        )}
                        {!isCurrent && video.isComingSoon && (
                          <span className="text-[9px] font-mono text-[#FF9500] bg-[#FF9500]/10 px-1 py-0.2 rounded">
                            {t.scheduledBadge}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-xs font-semibold line-clamp-2 leading-snug ${
                          isCurrent ? "text-white" : "text-[#D1D1D6] group-hover:text-white"
                        }`}
                      >
                        {video.title[lang]}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom YouTube Subscribe / View Channel Banner */}
            <div className="pt-2">
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#FF0000]/10 hover:bg-[#FF0000]/15 border border-[#FF0000]/25 text-[#FF453A] flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>{t.channelTitle} ↗</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
