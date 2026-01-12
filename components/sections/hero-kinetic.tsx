"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, Code2, Sparkles } from "lucide-react";


export const HeroKinetic = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full bg-zinc-950 text-white selection:bg-white/20 overflow-x-hidden min-h-[100dvh] md:h-screen md:overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)",
          backgroundSize: "4rem 4rem"
        }}
      />

      {/* Ambient Ceiling Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent blur-3xl pointer-events-none z-0 will-change-transform" />

      {/* Direct Spotlight - Root Level */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[70vw] max-w-[600px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none z-40 will-change-transform" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] py-20 md:h-full md:py-0">
        <motion.h1
          style={{ y: isMobile ? 0 : y1 }}
          className="flex flex-col items-center justify-center text-center font-heading font-black leading-[0.85] tracking-tighter w-full max-w-[100vw] px-4 will-change-transform"
        >
          <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto py-4 sm:py-8 lg:py-12">
            {/* Fixed Spotlight Glow */}

            <h1 className="font-heading font-black text-[14vw] md:text-[12vw] leading-none text-white select-none pointer-events-none opacity-100 tracking-tighter flex flex-col items-center md:flex-row md:items-baseline md:justify-center w-full px-4">
              <span>AUTOM8ED</span>
              <span className="self-end md:self-auto text-[0.25em] md:text-[0.15em] text-zinc-400 font-mono tracking-normal opacity-80 animate-glitch mt-0 md:mt-0" data-text=".space">.space</span>
            </h1>
          </div>
          <StreamingText />
        </motion.h1>

        {/* Standard Tech CTA */}
        <div className="relative mt-8 md:mt-12 z-20">
          <div className="flex items-center p-1 md:p-1.5 rounded-full border border-white/80 bg-white shadow-[0_0_25px_rgba(255,255,255,0.2)]">

            {/* Automation Pill */}
            <a
              href="#services"
              className="group relative px-3 py-2 md:px-6 md:py-3 rounded-full hover:bg-zinc-50 transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2.5"
            >
              <Bot className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 group-hover:text-violet-600 group-hover:scale-110 transition-all duration-300" />
              <span
                className="font-heading font-black text-[10px] md:text-sm tracking-wider text-zinc-950 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 transition-all duration-300 animate-glitch-subtle group-hover:animate-none"
                data-text="AUTOMATION"
              >
                AUTOMATION
              </span>
            </a>

            {/* Angle Divider */}
            <div className="w-px h-4 md:h-6 bg-zinc-200 rotate-12 mx-0.5 md:mx-1" />

            {/* Web Dev Pill */}
            <a
              href="#portfolio"
              className="group relative px-3 py-2 md:px-6 md:py-3 rounded-full hover:bg-zinc-50 transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2.5"
            >
              <span
                className="font-heading font-black text-[10px] md:text-sm tracking-wider text-zinc-950 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300 animate-glitch-subtle group-hover:animate-none"
                data-text="WEB DEVELOPMENT"
              >
                WEB DEVELOPMENT
              </span>
              <Code2 className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-300" />
            </a>

          </div>
        </div>

        {/* Secondary data */}
        <motion.div
          style={{ y: isMobile ? 0 : y2 }}
          className="absolute bottom-8 md:bottom-12 flex w-full max-w-7xl justify-center px-4 md:px-8 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest"
        >
        </motion.div>
      </div>
    </section>
  );
};

const PHRASES = [
  "WEB DEVELOPMENT",
  "AI INTEGRATIONS",
  "WORKFLOWS",
  "RAG"
];

const StreamingText = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % PHRASES.length;
      const fullText = PHRASES[i];

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
  }, [text, isDeleting, loopNum, typingSpeed]); // Dependencies for effect loop

  // Consistent sizing to match logo width:
  // Logo: w-[85vw] sm:w-[65vw] md:w-[50vw] lg:w-[45vw]
  // Text approx: 85/10 ~ 8.5vw (mobile), 45/10 ~ 4.5vw (desktop) if matching width exactly.
  // But keeping it slightly larger for hierarchy.
  const textSizeClass = "text-[7vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw]";

  return (
    <div className="relative h-[16vw] sm:h-[13vw] md:h-[10vw] w-full flex items-center justify-center overflow-visible">
      <span
        className={`block text-white whitespace-nowrap px-4 ${textSizeClass} font-heading font-bold tracking-tight uppercase`}

      >
        {text}
      </span>
    </div>
  );
};
