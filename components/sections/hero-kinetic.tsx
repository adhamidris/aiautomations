"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";


export const HeroKinetic = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const blur = useTransform(scrollY, [0, 400], ["blur(0px)", "blur(12px)"]);

    return (
        <section className="relative w-full bg-zinc-950 text-white selection:bg-white/20 overflow-x-hidden min-h-[100dvh] md:h-screen md:overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-10" 
                 style={{ 
                     backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)", 
                     backgroundSize: "4rem 4rem" 
                 }} 
            />
            
            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] py-20 md:h-full md:py-0">
                <motion.h1 
                    style={{ y: y1, filter: blur }}
                    className="flex flex-col items-center justify-center text-center font-heading font-black leading-[0.85] tracking-tighter w-full max-w-[100vw] px-4"
                >
                    <div className="relative flex items-center justify-center w-full max-w-5xl mx-auto py-4 sm:py-8 lg:py-12">
                        {/* Fixed Spotlight Glow */}

                        <Image 
                            src="/autom8ed.png" 
                            alt="Autom8ed" 
                            width={1371} 
                            height={350}
                            priority
                            className="w-[85vw] sm:w-[65vw] md:w-[50vw] lg:w-[45vw] h-auto object-contain"
                        />
                    </div>
                    <StreamingText />
                </motion.h1>

                {/* Standard Tech CTA */}
                <div className="relative mt-8 md:mt-12 z-20">
                    <a 
                        href="#contact"
                        className="group relative flex items-center justify-center px-8 py-4 rounded-full bg-white text-black border border-white transition-all duration-300 hover:bg-zinc-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                    >
                         <span className="font-heading text-xs md:text-sm font-black tracking-wide flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            BOOK A MEETING
                         </span>
                    </a>
                </div>
                
                {/* Secondary data */}
                <motion.div 
                    style={{ y: y2, filter: blur }}
                    className="absolute bottom-8 md:bottom-12 flex w-full max-w-7xl justify-center px-4 md:px-8 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest"
                >
                     <div className="flex gap-4 md:gap-8">
                         <span>[01] Build</span>
                         <span>[02] Automate</span>
                         <span>[03] Review</span>
                     </div>
                </motion.div>
            </div>
        </section>
    );
};

const PHRASES = [
  "AI SOLUTIONS",
  "WORKFLOWS",
  "CHATBOTS"
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
    const textSizeClass = "text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw]";
  
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
