"use client";

import React, { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

export function StickyNav() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of contact form is visible
    );

    const contactSection = document.getElementById("contact");
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => {
      if (contactSection) {
        observer.unobserve(contactSection);
      }
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show navbar after scrolling down 600px (past widely assumed hero height)
    if (latest > 600) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  const shouldShow = visible && (!isMobile || !isContactVisible);

  return (
    <AnimatePresence mode="wait">
      {shouldShow && (
        <motion.div
          initial={{ y: isMobile ? 100 : -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isMobile ? 100 : -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-6 md:bottom-auto md:top-0 left-0 right-0 z-50 flex justify-center md:block pointer-events-none will-change-transform"
        >
          <div className="pointer-events-auto flex items-center justify-between gap-4 md:gap-0 rounded-full md:rounded-none border border-border md:border-x-0 md:border-t-0 md:border-b bg-background/80 backdrop-blur-xl px-6 py-3 md:px-12 lg:px-24 md:py-4 shadow-lg ring-1 ring-border/50 md:ring-0 md:shadow-none w-auto md:w-full max-w-[90%] md:max-w-none mx-auto md:mx-0">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg tracking-tighter text-foreground">
                AI
              </span>
            </div>

            {/* Nav Links - Removed Privacy Policy */}
            <div className="hidden md:flex items-center gap-4">
            </div>

            {/* Creative CTA */}
            <div className="flex items-center gap-3 md:gap-4">
              <ThemeToggle />
              <a
                href="#contact"
                className="group relative overflow-hidden rounded-full bg-foreground px-6 md:px-8 py-2.5 transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
              >
                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.1),55%,transparent)] bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0] bg-no-repeat bg-[position:-100%_0]" />
                <span className="relative flex items-center gap-3 font-heading text-xs md:text-sm font-black tracking-wide text-background">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  BOOK A MEETING
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
