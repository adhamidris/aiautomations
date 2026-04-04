"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, Code2, Cpu } from "lucide-react";



interface HeroKineticProps {
  phrases?: string[];
  ctaAutomation?: string;
  ctaWebDev?: string;
  ctaAssistants?: string;
}

export const HeroKinetic = ({
  phrases,
  ctaAutomation = "SERVICES",
  ctaWebDev = "PORTFOLIO",
  ctaAssistants = "ASSISTANTS"
}: HeroKineticProps) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative w-full bg-background text-foreground selection:bg-foreground/20 overflow-x-hidden min-h-[100svh] md:h-screen md:overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-grid opacity-90" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle_at_center,black_45%,transparent_95%)]" />

      {/* Ambient Ceiling Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[360px] w-[80vw] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/7 via-foreground/3 to-transparent blur-3xl pointer-events-none z-0 will-change-transform" />

      {/* Direct Spotlight - Root Level */}
      <div className="absolute left-1/2 top-[15%] z-0 h-[320px] w-[70vw] max-w-[600px] -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-[120px] pointer-events-none will-change-transform" />
      <div className="absolute inset-x-0 top-0 z-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.16)_45%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.3)_38%,rgba(255,255,255,0.82)_78%,var(--background)_100%)] pointer-events-none md:h-40" />
      <div className="absolute inset-x-[14%] bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] py-20 md:h-full md:py-0">
        <motion.h1
          style={{ y: y1 }}
          className="flex flex-col items-center justify-center text-center font-heading font-black leading-[0.85] tracking-tighter w-full max-w-[100vw] px-4 will-change-transform"
        >
          <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto py-4 sm:py-8 lg:py-12">
            {/* Fixed Spotlight Glow */}

            <h1 dir="ltr" className="font-heading font-black text-[14vw] md:text-[12vw] leading-none text-foreground select-none pointer-events-none opacity-100 tracking-tighter flex flex-col items-center md:flex-row md:items-baseline md:justify-center w-full px-4">
              <span>AUTOM8ED</span>
              <span className="self-end md:self-auto text-[0.25em] md:text-[0.15em] text-muted-foreground font-mono tracking-normal opacity-80 animate-glitch mt-0 md:mt-0" data-text=".space">.space</span>
            </h1>
          </div>
          <StreamingText phrases={phrases} />
        </motion.h1>

        {/* Standard Tech CTA */}
        <div className="relative mt-8 md:mt-12 z-20">
          <div className="grid grid-cols-2 gap-2 md:hidden">
            <a
              href="#services"
              className="group relative flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-muted"
            >
              <Bot className="h-4 w-4 text-violet-600 transition-all duration-300 group-hover:scale-110" />
              <span
                className="animate-glitch-subtle font-heading text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600"
                data-text={ctaAutomation}
              >
                {ctaAutomation}
              </span>
            </a>

            <a
              href="#portfolio"
              className="group relative flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-muted"
            >
              <span
                className="animate-glitch-subtle font-heading text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500"
                data-text={ctaWebDev}
              >
                {ctaWebDev}
              </span>
              <Code2 className="h-4 w-4 text-emerald-500 transition-all duration-300 group-hover:scale-110" />
            </a>

            <a
              href="#assistant"
              className="group relative col-span-2 mx-auto flex w-full max-w-[12rem] items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-[#fff4e7]"
            >
              <Cpu className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover:scale-110" />
              <span
                className="animate-glitch-subtle font-heading text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"
                data-text={ctaAssistants}
              >
                {ctaAssistants}
              </span>
            </a>
          </div>

          <div className="hidden items-center rounded-full border border-border bg-background p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.1)] md:flex">
            <a
              href="#services"
              className="group relative flex items-center justify-center gap-2.5 rounded-full px-8 py-4 transition-all duration-300 hover:bg-muted"
            >
              <Bot className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-violet-600" />
              <span
                className="animate-glitch-subtle font-heading text-base font-black tracking-wider text-foreground transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-none"
                data-text={ctaAutomation}
              >
                {ctaAutomation}
              </span>
            </a>

            <div className="mx-1 h-6 w-px rotate-12 bg-border" />

            <a
              href="#portfolio"
              className="group relative flex items-center justify-center gap-2.5 rounded-full px-8 py-4 transition-all duration-300 hover:bg-muted"
            >
              <span
                className="animate-glitch-subtle font-heading text-base font-black tracking-wider text-foreground transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-none"
                data-text={ctaWebDev}
              >
                {ctaWebDev}
              </span>
              <Code2 className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500" />
            </a>

            <div className="mx-1 h-6 w-px rotate-12 bg-border" />

            <a
              href="#assistant"
              className="group relative flex items-center justify-center gap-2.5 rounded-full px-8 py-4 transition-all duration-300 hover:bg-[#fff5eb]"
            >
              <Cpu className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500" />
              <span
                className="animate-glitch-subtle font-heading text-base font-black tracking-wider text-foreground transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-none"
                data-text={ctaAssistants}
              >
                {ctaAssistants}
              </span>
            </a>
          </div>
        </div>

        {/* Secondary data */}
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-8 md:bottom-12 flex w-full max-w-7xl justify-center px-4 md:px-8 text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest"
        >
        </motion.div>
      </div>
    </section>
  );
};

const DEFAULT_PHRASES = [
  "WEB DEVELOPMENT",
  "AI INTEGRATIONS",
  "RAG"
];

const StreamingText = ({ phrases = DEFAULT_PHRASES }: { phrases?: string[] }) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 100);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Pause before start
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]); // Dependencies for effect loop

  // Consistent sizing to match logo width:
  // Logo: w-[85vw] sm:w-[65vw] md:w-[50vw] lg:w-[45vw]
  // Text approx: 85/10 ~ 8.5vw (mobile), 45/10 ~ 4.5vw (desktop) if matching width exactly.
  // But keeping it slightly larger for hierarchy.
  const textSizeClass = "text-[7vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw]";

  return (
    <div className="relative h-[16vw] sm:h-[13vw] md:h-[10vw] w-full flex items-center justify-center overflow-visible">
      <span
        className={`block text-foreground whitespace-nowrap px-4 ${textSizeClass} font-heading font-bold tracking-tight uppercase`}

      >
        {text}
      </span>
    </div>
  );
};
