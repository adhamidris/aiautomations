"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CyberBadge } from "./cyber-badge";

interface CyberPanelProps {
  variant?: "hero" | "split" | "list";
  header?: {
    title?: string;
    subtitle?: string;
    badge?: {
      text: string;
      status: "online" | "audit" | "confidential";
    };
  };
  children: React.ReactNode;
  className?: string;
  paneClassName?: string; // For split layouts logic
}

export const CyberPanel = ({ 
  variant = "list", 
  header, 
  children, 
  className 
}: CyberPanelProps) => {
  
  // Codex Enforced Motion Signature: Heavy, high-mass settle.
  const panelTransition = { 
    type: "spring", 
    stiffness: 120, 
    damping: 28, 
    mass: 1.15 
  } as any;

  const panelPose = {
    initial: { opacity: 0, y: 16, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      initial={panelPose.initial}
      whileInView={panelPose.animate}
      viewport={{ once: true, margin: "-100px" }}
      transition={panelTransition}
      className={cn(
        "relative w-full overflow-hidden rounded-sm border border-border bg-card/40 shadow-2xl backdrop-blur-sm", 
        className
      )}
    >
        {/* Vignette Overlay - Only visible in dark mode via opacity/blend modes or conditional styles if needed.
            For now, we'll make it subtle or use a dark-only class if we want to retain the 'heavy' look in dark mode. 
            However, inline styles don't support dark mode easily without CSS variables. 
            We'll use a Tailwind class for the shadow if possible, or keep it subtle. */}
        <div 
            className="pointer-events-none absolute inset-0 z-0 select-none opacity-20 dark:opacity-50"
            style={{ boxShadow: "inset 0 0 100px 20px var(--background)" }}
        />

        {/* Global Technical Corner Markers */}
        <div className="absolute top-4 left-4 h-2 w-2 border-t border-l border-foreground/40 z-20 pointer-events-none" />
        <div className="absolute top-4 right-4 h-2 w-2 border-t border-r border-foreground/40 z-20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 h-2 w-2 border-b border-l border-foreground/40 z-20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 h-2 w-2 border-b border-r border-foreground/40 z-20 pointer-events-none" />

        {/* Content Layer */}
        <div className="relative z-10 h-full w-full">
            
            {/* Optional Standardized Header */}
            {header && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                        {header.badge && (
                            <CyberBadge text={header.badge.text} status={header.badge.status} />
                        )}
                        {header.title && (
                             <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                {`// ${header.title}`}
                             </span>
                        )}
                    </div>
                    {header.subtitle && (
                         <span className="hidden md:inline-block text-xs font-mono text-muted-foreground/70 truncate max-w-[200px]">
                            ID: {header.subtitle}
                         </span>
                    )}
                </div>
            )}

            {/* Layout Variants */}
            {variant === "split" ? (
                <div className="grid lg:grid-cols-2 gap-0 h-full">
                    {children}
                </div>
            ) : variant === "hero" ? (
                <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center h-full">
                    {children}
                </div>
            ) : (
                // "list" or default
                <div className="w-full">
                    {children}
                </div>
            )}

        </div>
    </motion.div>
  );
};
