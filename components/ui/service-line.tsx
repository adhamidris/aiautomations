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
  onToggle: () => void;
}

export const ServiceLine = ({ number, title, description, tags, isOpen, onToggle }: ServiceLineProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive = isHovered || isOpen;

  return (
    <div
      className={cn(
        "relative group transition-all duration-500 border-b border-white/5",
        isActive ? "bg-white/[0.03]" : "bg-transparent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggle}
    >
      {/* Massive Watermark Number */}
      <span className={cn(
        "absolute -top-6 right-0 text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter select-none pointer-events-none transition-all duration-700 ease-out z-0",
        isActive ? "text-white/[0.03] opacity-100 blur-0 scale-100" : "text-transparent opacity-0 blur-xl scale-90"
      )}>
        {number}
      </span>

      <div className="relative z-10 p-6 md:p-10 cursor-pointer">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-1 items-center gap-8 md:gap-12 min-w-0 pr-4">
             {/* Small semantic number */}
             <span className={cn(
                "hidden md:block font-mono text-sm tracking-widest transition-colors duration-300 shrink-0",
                isActive ? "text-accent" : "text-white/20"
             )}>
                {number}
             </span>
             
             <h3 className={cn(
               "text-2xl md:text-4xl font-light tracking-tight transition-all duration-300 break-words",
               isActive ? "text-white translate-x-4" : "text-white/50 translate-x-0"
             )}>
               {title}
             </h3>
          </div>
          
          <div className={cn(
            "p-3 rounded-full transition-all duration-500 shrink-0",
            isActive 
              ? "bg-white rotate-180 scale-110" 
              : "bg-transparent rotate-0 scale-100"
          )}>
            <ArrowDown className={cn(
              "w-5 h-5 transition-colors",
              isActive ? "text-black" : "text-white/30"
            )} />
          </div>
        </div>

        <motion.div
           initial={{ height: 0, opacity: 0 }}
           animate={{ 
             height: isActive ? "auto" : 0,
             opacity: isActive ? 1 : 0
           }}
           transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} // Elegant spring ease
           className="overflow-hidden"
        >
          <div className="pt-8 md:pt-10 pl-0 md:pl-[6.5rem] flex flex-col md:flex-row gap-10 items-start justify-between relative">
             {/* Decorative side line for content */}
             <div className="absolute left-6 md:left-[5rem] top-10 bottom-0 w-px bg-gradient-to-b from-accent/50 to-transparent hidden md:block" />

            <p className="text-zinc-400 max-w-xl leading-relaxed text-lg font-light">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 max-w-xs justify-start md:justify-end">
              {tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40 border border-white/5 rounded-full"
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
};
