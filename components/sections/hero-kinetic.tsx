"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, Code2 } from "lucide-react";



interface HeroKineticProps {
  phrases?: string[];
  ctaAutomation?: string;
  ctaWebDev?: string;
}

export const HeroKinetic = ({
  phrases,
  ctaAutomation = "SERVICES",
  ctaWebDev = "PORTFOLIO"
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
          <div className="flex items-center p-1 md:p-1.5 rounded-full border border-border bg-background shadow-[0_0_25px_rgba(0,0,0,0.1)]">

            {/* Automation Pill */}
            <a
              href="#services"
              className="group relative px-4 py-2.5 md:px-8 md:py-4 rounded-full hover:bg-muted transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2.5"
            >
              <Bot className="w-3.5 h-3.5 md:w-5 md:h-5 text-violet-600 md:text-muted-foreground md:group-hover:text-violet-600 group-hover:scale-110 transition-all duration-300" />
              <span
                className="font-heading font-black text-xs md:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 md:text-foreground md:bg-clip-border md:bg-none md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:group-hover:from-violet-600 md:group-hover:to-indigo-600 transition-all duration-300 animate-glitch-subtle md:animate-glitch-subtle md:group-hover:animate-none"
                data-text={ctaAutomation}
              >
                {ctaAutomation}
              </span>
            </a>

            {/* Angle Divider */}
            <div className="w-px h-4 md:h-6 bg-border rotate-12 mx-0.5 md:mx-1" />

            {/* Web Dev Pill */}
            <a
              href="#portfolio"
              className="group relative px-4 py-2.5 md:px-8 md:py-4 rounded-full hover:bg-muted transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2.5"
            >
              <span
                className="font-heading font-black text-xs md:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 md:text-foreground md:bg-clip-border md:bg-none md:group-hover:text-transparent md:group-hover:bg-clip-text md:group-hover:bg-gradient-to-r md:group-hover:from-emerald-500 md:group-hover:to-teal-500 transition-all duration-300 animate-glitch-subtle md:animate-glitch-subtle md:group-hover:animate-none"
                data-text={ctaWebDev}
              >
                {ctaWebDev}
              </span>
              <Code2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-emerald-500 md:text-muted-foreground md:group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300" />
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
