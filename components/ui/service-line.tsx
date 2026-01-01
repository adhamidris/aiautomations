"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceLineProps {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export const ServiceLine = ({ number, title, description, tags }: ServiceLineProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative border-b border-white/5 transition-colors duration-300 hover:bg-white/[0.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative z-10 p-6 md:p-8 cursor-pointer">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6 md:gap-12">
             <span className="font-mono text-white/40 text-sm md:text-base tracking-widest">{number}</span>
             <h3 className={cn(
               "text-xl md:text-3xl font-medium tracking-tight transition-colors duration-300",
               isHovered ? "text-white" : "text-white/60"
             )}>
               {title}
             </h3>
          </div>
          <div className={cn(
            "p-2 rounded-full border transition-all duration-300",
            isHovered 
              ? "bg-white border-white rotate-0" 
              : "bg-transparent border-zinc-700 -rotate-45"
          )}>
            <ArrowRight className={cn(
              "w-5 h-5 transition-colors",
              isHovered ? "text-black" : "text-zinc-500"
            )} />
          </div>
        </div>

        <motion.div
           initial={{ height: 0, opacity: 0 }}
           animate={{ 
             height: isHovered ? "auto" : 0,
             opacity: isHovered ? 1 : 0
           }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
           className="overflow-hidden"
        >
          <div className="pt-6 md:pt-8 pl-0 md:pl-[6.5rem] flex flex-col md:flex-row gap-8 items-start justify-between">
            <p className="text-zinc-400 max-w-lg leading-relaxed text-base md:text-lg">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-500 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scan line effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ width: "0%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent z-20"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
