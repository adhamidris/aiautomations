"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const HeroKinetic = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }) + ":" + now.getMilliseconds().toString().padStart(3, '0'));
        };
        const interval = setInterval(updateTime, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-zinc-950 text-white selection:bg-white/20">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20" 
                 style={{ 
                     backgroundImage: "linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)", 
                     backgroundSize: "4rem 4rem" 
                 }} 
            />
            
            {/* HUD Elements */}
            <div className="pointer-events-none absolute left-8 top-8 z-20 font-mono text-xs text-zinc-500">
                <div>COORD: 34.0522° N, 118.2437° W</div>
                <div>SYS.STATUS: ONLINE</div>
            </div>
            <div className="pointer-events-none absolute right-8 top-8 z-20 font-mono text-xs text-zinc-500 text-right">
                <div>T: {time}</div>
                <div>VELOCITY: LOCAL</div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center">
                <motion.h1 
                    style={{ y: y1 }}
                    className="flex flex-col items-center justify-center text-center font-heading font-black leading-[0.85] tracking-tighter w-full max-w-[100vw] overflow-hidden px-4"
                >
                    <span className="block text-[26vw] sm:text-[22vw] md:text-[16vw] lg:text-[14vw] text-zinc-800 mix-blend-difference hover:text-white transition-colors duration-500">AI</span>
                    <StreamingText />
                </motion.h1>

                {/* Standard Tech CTA */}
                <div className="relative mt-8 md:mt-12 z-20">
                    <button className="group relative flex items-center justify-center px-8 py-4 rounded-full bg-white text-black border border-white transition-all duration-300 hover:bg-zinc-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                         <span className="font-heading text-xs md:text-sm font-black tracking-wide flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            BOOK A MEETING
                         </span>
                    </button>
                </div>
                
                {/* Secondary data */}
                <motion.div 
                    style={{ y: y2 }}
                    className="absolute bottom-8 md:bottom-12 flex w-full max-w-7xl justify-center px-4 md:px-8 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest"
                >
                     <div className="hidden md:flex gap-8">
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
  "SOLUTIONS",
  "AUTOMATIONS",
  "CHAT BOTS"
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
  
    // Consistent sizing for all phrases to ensure professionalism
    const textSizeClass = "text-[14vw] sm:text-[11vw] md:text-[8vw] lg:text-[7vw]";
  
    return (
      <div className="relative h-[16vw] sm:h-[13vw] md:h-[10vw] w-full flex items-center justify-center overflow-visible">
          <span
              className={`block text-zinc-100 mix-blend-difference whitespace-nowrap px-4 ${textSizeClass} font-heading font-black tracking-tighter`}
          >
              {text}
          </span>
      </div>
    );
  };
