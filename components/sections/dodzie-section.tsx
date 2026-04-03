"use client";

import Image from "next/image";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface DodzieSectionProps {
  title: string;
  summary: string;
  points: string[];
  llmsLabel: string;
  primaryCta: string;
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
}: DodzieSectionProps) {
  const handlePrimaryClick = () => {
    trackEvent({
      action: "dodzie_cta_click",
      category: "assistant",
      label: primaryCta,
    });
  };

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
            <div className="rounded-[2rem] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-10">
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
                      <div className="rounded-[1.4rem] bg-[#eef1f4] px-4 py-3 text-sm leading-7 text-foreground/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(15,23,42,0.04)] md:border md:border-black/8 md:px-5 lg:text-lg lg:leading-8">
                        <div className="flex items-start gap-3 text-left">
                          <span className="mt-[0.72rem] h-2.5 w-2.5 shrink-0 rounded-full bg-[#d97728] lg:mt-[0.82rem] lg:h-3 lg:w-3" />
                          <span>
                            {point}
                            {index === 0 ? (
                              <span className="ml-3 inline-flex items-center gap-2 align-middle">
                                <InlineBrandIcon src="/brands/telegram.svg" alt="Telegram" className="lg:h-[18px] lg:w-[18px]" />
                                <ArrowLeftRight className="h-3.5 w-3.5 text-foreground/35 lg:h-4 lg:w-4" />
                                <InlineBrandIcon src="/brands/computer.svg" alt="Computer" size={18} className="lg:h-5 lg:w-5" />
                              </span>
                            ) : index === 2 ? (
                              <span className="ml-3 inline-flex flex-wrap items-center gap-2 align-middle">
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
                    <div className="rounded-[1.4rem] bg-[#eef1f4] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(15,23,42,0.04)] md:border md:border-black/8 md:px-5">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/78 md:text-[15px] lg:text-lg">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#d97728] lg:h-3 lg:w-3" />
                        <span>{llmsLabel}</span>
                        <div className="flex flex-wrap items-center gap-3">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
