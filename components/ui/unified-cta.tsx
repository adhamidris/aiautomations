"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export const UnifiedCTA = () => {
  return (
    <div className="group relative mx-auto flex max-w-sm items-center overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 pr-2 shadow-lg backdrop-blur-md transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 hover:bg-white/10">
      <input
        type="email"
        placeholder="Enter your work email"
        className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-zinc-400 focus:outline-none"
        aria-label="Work Email Address"
      />
      <button className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500">
        Start Audit
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};
