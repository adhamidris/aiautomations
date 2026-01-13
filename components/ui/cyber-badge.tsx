"use client";

import { cn } from "@/lib/utils";

interface CyberBadgeProps {
  text: string;
  status?: "online" | "audit" | "confidential";
  className?: string;
}

export const CyberBadge = ({ text, status = "online", className }: CyberBadgeProps) => {
  const statusColor = {
    online: "bg-emerald-500",
    audit: "bg-accent",
    confidential: "bg-amber-500",
  }[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-sm border border-border bg-muted/50 px-3 py-1 text-xs font-mono uppercase tracking-widest text-muted-foreground",
      className
    )}>
      <div className={cn("h-1.5 w-1.5 animate-pulse rounded-full", statusColor)} />
      {text}
    </div>
  );
};
