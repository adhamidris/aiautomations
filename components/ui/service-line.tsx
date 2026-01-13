"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceLineProps {
  number: string;
  title: string;
  description: string;
  tags: string[];
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export const ServiceLine = React.memo(({ number, title, description, tags, isOpen, onToggle }: ServiceLineProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const checkDesktop = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
      }
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const isActive = isDesktop ? isHovered : isOpen;

  return (
    <div
      className={cn(
        "relative group transition-colors duration-500 border-b border-border/50",
        isActive ? "bg-accent/50" : "bg-transparent"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => !isDesktop && onToggle(number)}
    >
      {/* Massive Watermark Number */}
      <span className={cn(
        "absolute -top-6 right-0 text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter select-none pointer-events-none transition-all duration-700 ease-out z-0 will-change-[transform,opacity] transform-gpu",
        isActive ? "text-foreground/5 opacity-100 scale-100" : "text-transparent opacity-0 scale-90"
      )}>
        {number}
      </span>

      <div className="relative z-10 p-6 md:p-10 cursor-pointer">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-1 items-center gap-8 md:gap-12 min-w-0 pr-4">
            {/* Small semantic number */}
            <span className={cn(
              "hidden md:block font-mono text-sm tracking-widest transition-colors duration-300 shrink-0",
              isActive ? "text-accent-foreground" : "text-muted-foreground"
            )}>
              {number}
            </span>

            <h3 className={cn(
              "text-2xl md:text-4xl font-light tracking-tight transition-transform duration-300 break-words origin-left will-change-transform",
              isActive ? "text-foreground translate-x-4" : "text-foreground translate-x-0"
            )}>
              {title}
            </h3>
          </div>

          <div className={cn(
            "p-3 rounded-full transition-transform duration-500 shrink-0",
            isActive
              ? "bg-foreground text-background rotate-180 scale-110"
              : "bg-transparent text-foreground rotate-0 scale-100"
          )}>
            <ArrowDown className="w-5 h-5 transition-colors" />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isActive ? "auto" : 0,
            opacity: isActive ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden will-change-[height,opacity]"
        >
          <div className="pt-8 md:pt-10 pl-0 md:pl-[6.5rem] flex flex-col md:flex-row gap-10 items-start justify-between relative">
            {/* Decorative side line for content */}
            <div className="absolute left-6 md:left-[5rem] top-10 bottom-0 w-px bg-gradient-to-b from-accent/50 to-transparent hidden md:block" />

            <p className="text-muted-foreground max-w-xl leading-relaxed text-lg font-light">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 max-w-xs justify-start md:justify-end">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground border border-border rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kinetic Border Line (Bottom) */}
      <div className={cn(
        "absolute bottom-0 left-0 w-full h-[1px] bg-accent transition-all duration-700 ease-in-out",
        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
      )} />

    </div>
  );
});

ServiceLine.displayName = "ServiceLine";
