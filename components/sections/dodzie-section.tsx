"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface DodzieSectionProps {
  title: string;
  summary: string;
  points: string[];
  llmsLabel: string;
  primaryCta: string;
  demoTitle: string;
  demoVideos: {
    label: string;
    src: string;
  }[];
}

function LlmBadge({
  label,
  src,
  toneClassName,
  iconSizeClassName = "h-4 w-4",
  textSizeClassName = "text-xs",
}: {
  label: string;
  src: string;
  toneClassName: string;
  iconSizeClassName?: string;
  textSizeClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${textSizeClassName} ${toneClassName}`}>
      <Image
        src={src}
        alt={label}
        width={16}
        height={16}
        className={`${iconSizeClassName} shrink-0`}
      />
      {label}
    </span>
  );
}

function InlineBrandIcon({
  src,
  alt,
  size = 16,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block shrink-0 align-middle ${className}`}
    />
  );
}

export function DodzieSection({
  title,
  summary,
  points,
  llmsLabel,
  primaryCta,
  demoTitle,
  demoVideos,
}: DodzieSectionProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [mobileViewportHeight, setMobileViewportHeight] = useState<number | null>(null);

  const activeVideo = demoVideos[activeVideoIndex];

  const handlePrimaryClick = () => {
    trackEvent({
      action: "dodzie_cta_click",
      category: "assistant",
      label: primaryCta,
    });
  };

  const handleVideoChange = (nextIndex: number) => {
    const boundedIndex = (nextIndex + demoVideos.length) % demoVideos.length;
    setActiveVideoIndex(boundedIndex);

    trackEvent({
      action: "dodzie_demo_change",
      category: "assistant",
      label: demoVideos[boundedIndex]?.label ?? `video_${boundedIndex + 1}`,
    });
  };

  const openDemo = () => {
    setMobileViewportHeight(null);
    setIsDemoOpen(true);
    trackEvent({
      action: "dodzie_demo_open",
      category: "assistant",
      label: demoTitle,
    });
  };

  const closeDemo = () => {
    setMobileViewportHeight(null);
    setIsDemoOpen(false);
    trackEvent({
      action: "dodzie_demo_close",
      category: "assistant",
      label: demoTitle,
    });
  };

  useEffect(() => {
    if (!isDemoOpen) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isDemoOpen]);

  useEffect(() => {
    if (!isDemoOpen) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) return;

    const syncViewportHeight = () => {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight;
      setMobileViewportHeight(Math.round(nextHeight));
    };

    syncViewportHeight();

    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("scroll", syncViewportHeight);
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
    };
  }, [isDemoOpen]);

  return (
    <section id="assistant" className="relative w-full overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-0 pb-20 sm:px-6 lg:px-8 lg:pt-0 lg:pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(15rem,18rem)_1fr] xl:grid-cols-[minmax(16rem,20rem)_1fr] xl:gap-16">
          <div className="relative mx-auto hidden w-full max-w-[16rem] lg:mx-0 lg:block lg:sticky lg:top-24 lg:max-w-[18rem]">
            <Image
              src="/dodzie/dodziefin-cropped.png"
              alt="Dodzie AI assistant character"
              width={587}
              height={1452}
              priority
              className="mx-auto h-auto w-full"
            />
          </div>

          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
              <h3 className="mx-auto max-w-[11ch] text-center text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-5xl lg:mx-0 lg:text-left xl:text-6xl">
                {title}
              </h3>
              <div className="mx-auto mt-6 w-full max-w-[14rem] lg:hidden">
                <Image
                  src="/dodzie/dodzieautom8ed-cropped.png"
                  alt="Dodzie AI assistant character"
                  width={527}
                  height={924}
                  priority
                  className="mx-auto h-auto w-full"
                />
              </div>
              <p className="mx-auto mt-6 text-center text-base leading-8 text-foreground/74 lg:hidden">
                <span className="block">AI Assistant built into your setup</span>
                <span className="block">Connected to your tools</span>
                <span className="block">Ready to act</span>
              </p>
              <p className="mt-6 hidden max-w-[40rem] text-base leading-8 text-foreground/74 lg:block lg:text-lg">
                {summary}
              </p>

              <div className="mt-8">
                <div className="space-y-3">
                  {points.map((point, index) => (
                    <div key={point}>
                      <div className="relative overflow-hidden rounded-[1.4rem] bg-[#eef1f4] px-4 py-3 text-sm leading-7 text-foreground/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(15,23,42,0.04)] md:border md:border-black/8 md:px-5 lg:text-lg lg:leading-8">
                        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-start md:gap-3 md:text-left">
                          <span className="mt-[0.72rem] hidden h-2.5 w-2.5 shrink-0 rounded-full bg-[#d97728] md:inline-block lg:mt-[0.82rem] lg:h-3 lg:w-3" />
                          <span className="block">
                            {point}
                            {index === 0 ? (
                              <span className="mt-2 flex items-center justify-center gap-2 md:ml-3 md:mt-0 md:inline-flex md:align-middle">
                                <InlineBrandIcon src="/brands/telegram.svg" alt="Telegram" className="lg:h-[18px] lg:w-[18px]" />
                                <ArrowLeftRight className="h-3.5 w-3.5 text-foreground/35 lg:h-4 lg:w-4" />
                                <InlineBrandIcon src="/brands/computer.svg" alt="Computer" size={18} className="lg:h-5 lg:w-5" />
                              </span>
                            ) : index === 2 ? (
                              <span className="mt-2 flex flex-wrap items-center justify-center gap-2 md:ml-3 md:mt-0 md:inline-flex md:align-middle">
                                <InlineBrandIcon src="/brands/outlook.svg" alt="Outlook" className="lg:h-[18px] lg:w-[18px]" />
                                <InlineBrandIcon src="/brands/gmail.svg" alt="Gmail" className="lg:h-[18px] lg:w-[18px]" />
                                <InlineBrandIcon src="/brands/google-analytics.svg" alt="Google Analytics" className="lg:h-[18px] lg:w-[18px]" />
                                <InlineBrandIcon src="/brands/chrome.svg" alt="Chrome" className="lg:h-[18px] lg:w-[18px]" />
                                <InlineBrandIcon src="/brands/excel.svg" alt="Excel" className="lg:h-[18px] lg:w-[18px]" />
                                <InlineBrandIcon src="/brands/word.svg" alt="Word" className="lg:h-[18px] lg:w-[18px]" />
                              </span>
                            ) : null}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <div className="relative overflow-hidden rounded-[1.4rem] bg-[#eef1f4] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(15,23,42,0.04)] md:border md:border-black/8 md:px-5">
                      <div className="flex flex-col items-center gap-2 text-center text-sm text-foreground/78 md:flex-row md:flex-wrap md:items-center md:gap-3 md:text-left md:text-[15px] lg:text-lg">
                        <span className="hidden h-2.5 w-2.5 shrink-0 rounded-full bg-[#d97728] md:inline-block lg:h-3 lg:w-3" />
                        <span>{llmsLabel}</span>
                        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                          <LlmBadge
                            label="OpenAI"
                            src="/brands/openai.svg"
                            toneClassName="bg-zinc-100 text-zinc-800"
                            iconSizeClassName="h-4 w-4 lg:h-[18px] lg:w-[18px]"
                            textSizeClassName="text-xs lg:text-sm"
                          />
                          <LlmBadge
                            label="DeepSeek"
                            src="/brands/deepseek.svg"
                            toneClassName="bg-sky-50 text-sky-700"
                            iconSizeClassName="h-4 w-4 lg:h-[18px] lg:w-[18px]"
                            textSizeClassName="text-xs lg:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 pl-5 md:pl-6 lg:pl-0">
                <a
                  href="#contact"
                  onClick={handlePrimaryClick}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-background transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {primaryCta}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={openDemo}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f4f6f8] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {demoTitle}
                </button>
              </div>

              <div
                className={`fixed inset-x-0 top-0 z-50 overflow-hidden lg:absolute lg:inset-0 ${isDemoOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                aria-hidden={!isDemoOpen}
                onClick={closeDemo}
                style={
                  mobileViewportHeight
                    ? { height: `${mobileViewportHeight}px` }
                    : undefined
                }
              >
                <div
                  className={`absolute inset-0 transition-all duration-300 ${isDemoOpen ? "bg-white/76 opacity-100 backdrop-blur-xl" : "opacity-0"}`}
                />

                <div
                  className="absolute inset-0 flex items-center justify-center px-5 lg:px-8 lg:py-10"
                  style={{
                    paddingTop: "max(1.25rem, env(safe-area-inset-top))",
                    paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
                  }}
                >
                  <div
                    className={`flex w-full max-w-[38rem] flex-col items-center justify-center gap-4 px-2 py-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex-row lg:gap-10 lg:px-8 lg:py-8 ${isDemoOpen ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"}`}
                  >
                    <div
                      className="order-2 flex w-full max-w-[17rem] shrink-0 flex-wrap justify-center gap-2 lg:order-1 lg:w-[9.75rem] lg:flex-col lg:flex-nowrap lg:justify-start"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {demoVideos.map((video, index) => {
                        const isActive = index === activeVideoIndex;

                        return (
                          <button
                            key={video.src}
                            type="button"
                            onClick={() => handleVideoChange(index)}
                            className={`rounded-[1.15rem] px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 lg:min-w-0 lg:text-left ${isActive ? "bg-foreground text-background shadow-[0_10px_20px_rgba(15,23,42,0.16)]" : "bg-white text-foreground/62 ring-1 ring-black/8 hover:text-foreground"}`}
                          >
                            <span className="block lg:hidden">
                              {video.label}
                            </span>
                            <span className="hidden text-[10px] opacity-60 lg:block">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="mt-1 hidden lg:block">
                              {video.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className="order-1 relative aspect-[9/19] w-full max-w-[220px] rounded-[2.95rem] bg-[#111111] p-[6px] shadow-[0_24px_50px_rgba(0,0,0,0.22)] ring-1 ring-black/20 sm:max-w-[238px] lg:order-2 lg:max-w-[290px]"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div
                        className="relative h-full isolate overflow-hidden rounded-[2.55rem] bg-black"
                        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                      >
                        <video
                          key={activeVideo.src}
                          className="absolute inset-0 block h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          disablePictureInPicture
                          style={{
                            borderRadius: "2.55rem",
                            WebkitTransform: "translateZ(0)",
                          }}
                        >
                          <source src={activeVideo.src} type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
