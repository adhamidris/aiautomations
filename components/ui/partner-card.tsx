"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PartnerCardProps {
  name: string;
  icon: React.ReactNode;
  category: string;
  description: string | React.ReactNode;
  className?: string;
}

export const PartnerCard = ({ name, icon, category, description, className }: PartnerCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-8 transition-all duration-500 hover:border-white/20 hover:bg-zinc-800/80 hover:shadow-2xl",
        className
      )}
    >
      {/* Micro-grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
          backgroundSize: "4px 4px",
        }}
      />
      
      {/* Hover Gradient Glow */}
      <div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.05), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-sm bg-white/5 border border-white/10 text-white group-hover:text-white group-hover:border-white/30 group-hover:bg-white/10 transition-colors duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-zinc-300 border border-white/5 px-2 py-1 rounded-full bg-white/5 group-hover:text-white group-hover:border-white/10 transition-colors">
            {category}
          </span>
        </div>
        
        <h3 className="text-xl font-heading font-bold text-white group-hover:text-white transition-colors mb-3">
          {name}
        </h3>
        
        <div className="text-sm md:text-base text-zinc-200 leading-relaxed group-hover:text-white transition-colors">
          {description}
        </div>

        {/* Technical Corner Markers */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
