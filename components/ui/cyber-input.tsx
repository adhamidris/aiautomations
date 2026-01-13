"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CyberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

export const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="group relative space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground group-focus-within:text-foreground transition-colors duration-300">
              {label}
            </label>
          </div>
        )}

        <div className="relative">
          <div className={cn(
            "relative flex items-center w-full rounded-md bg-muted/50 shadow-sm overflow-hidden transition-all duration-300",
            "border border-border hover:border-foreground/20",
            isFocused && "border-foreground/40 ring-1 ring-foreground/10 bg-muted",
            error && "border-red-500/50",
            className
          )}>
            <input
              id={inputId}
              type={type}
              className="flex h-12 w-full bg-transparent px-4 py-2 text-[16px] md:text-base text-foreground focus:outline-none placeholder:text-muted-foreground font-sans tracking-normal"
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
        </div>
      </div>
    );
  }
);
CyberInput.displayName = "CyberInput";


export interface CyberTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

export const CyberTextArea = React.forwardRef<HTMLTextAreaElement, CyberTextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="group relative space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={inputId} className="text-sm font-medium text-muted-foreground group-focus-within:text-foreground transition-colors duration-300">
              {label}
            </label>
          </div>
        )}

        <div className="relative">
          <div className={cn(
            "relative flex w-full rounded-md bg-muted/50 shadow-sm overflow-hidden transition-all duration-300",
            "border border-border hover:border-foreground/20",
            isFocused && "border-foreground/40 ring-1 ring-foreground/10 bg-muted",
            error && "border-red-500/50",
            className
          )}>
            <textarea
              id={inputId}
              className="flex min-h-[120px] w-full bg-transparent px-4 py-3 text-[16px] md:text-base text-foreground focus:outline-none placeholder:text-muted-foreground font-sans tracking-normal resize-none"
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
        </div>
      </div>
    );
  }
);
CyberTextArea.displayName = "CyberTextArea";
