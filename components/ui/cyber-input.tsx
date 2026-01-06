"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CyberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  error?: boolean;
}

export const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, label, prefix = "//", error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="group relative space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-300 uppercase tracking-widest group-focus-within:text-white transition-colors duration-300">
               {prefix} {label}
            </label>
            {/* Optional Status Indicator */}
             <div className={cn(
                "h-1 w-1 rounded-full transition-colors duration-300",
                isFocused ? "bg-white" : "bg-white/20"
             )} />
          </div>
        )}
        
        <div className="relative">
            {/* Hardare Slot Chassis */}
            <div className={cn(
                "relative flex items-center w-full rounded-sm bg-zinc-900/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300",
                "border border-white/20 hover:border-white/30",
                "bg-zinc-900/80",
                isFocused && "border-white bg-white/[0.05] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]",
                error && "border-red-500/50",
                className
            )}>
                {/* Active Line Indicator */}
                <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: isFocused ? 1 : 0.5 }}
                />

                <input
                    type={type}
                    className="flex h-12 w-full bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-zinc-500 font-mono tracking-tight"
                    ref={ref}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
            </div>
            
            {/* Tech Corner Accent */}
            <div className={cn(
                "absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 pointer-events-none transition-colors duration-300",
                isFocused && "border-white"
            )} />
        </div>
      </div>
    );
  }
);
CyberInput.displayName = "CyberInput";


export interface CyberTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  prefix?: string;
  error?: boolean;
}

export const CyberTextArea = React.forwardRef<HTMLTextAreaElement, CyberTextAreaProps>(
  ({ className, label, prefix = "//", error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="group relative space-y-2">
         {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-300 uppercase tracking-widest group-focus-within:text-white transition-colors duration-300">
               {prefix} {label}
            </label>
             <div className={cn(
                "h-1 w-1 rounded-full transition-colors duration-300",
                isFocused ? "bg-white" : "bg-white/20"
             )} />
          </div>
        )}
        
        <div className="relative">
             <div className={cn(
                "relative flex w-full rounded-sm bg-zinc-900/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300",
                "border border-white/20 hover:border-white/30",
                "bg-zinc-900/80",
                isFocused && "border-white bg-white/[0.05] shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]",
                error && "border-red-500/50",
                className
            )}>
                <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-white"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: isFocused ? 1 : 0.5 }}
                />

                <textarea
                    className="flex min-h-[120px] w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-zinc-500 font-mono tracking-tight resize-none"
                    ref={ref}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
            </div>
             <div className={cn(
                "absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 pointer-events-none transition-colors duration-300",
                isFocused && "border-white"
            )} />
        </div>
      </div>
    );
  }
);
CyberTextArea.displayName = "CyberTextArea";
