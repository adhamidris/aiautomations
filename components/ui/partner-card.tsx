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
  const divRef = React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-md p-8 transition-all duration-500 hover:border-foreground/20 hover:bg-card hover:shadow-2xl",
        className
      )}
    >
      {/* Micro-grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "4px 4px",
        }}
      />

      {/* Hover Gradient Glow (Desktop: Mouse / Mobile: Fixed) */}
      <div
        className="absolute -inset-px transition-opacity duration-300 pointer-events-none hidden md:block"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--card-spotlight), transparent 40%)`,
        }}
      />
      {/* Mobile-Only Permanent Glow to reveal texture */}
      <div
        className="absolute -inset-px pointer-events-none md:hidden opacity-100"
        style={{
          background: `radial-gradient(300px circle at 50% 0%, var(--card-spotlight), transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="text-foreground transition-colors duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded-full bg-muted/50 group-hover:text-foreground group-hover:border-foreground/20 transition-colors">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-light tracking-tight text-foreground transition-colors mb-3">
          {name}
        </h3>

        <div className="text-base font-light text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
          {description}
        </div>

        {/* Technical Corner Markers */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
