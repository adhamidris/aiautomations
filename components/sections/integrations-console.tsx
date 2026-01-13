"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Database, MessageSquare, Zap, BarChart, ShoppingCart, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const TOOLS = [
  { id: "hubspot", name: "HubSpot", icon: <Database />, category: "CRM" },
  { id: "slack", name: "Slack", icon: <MessageSquare />, category: "Comms" },
  { id: "n8n", name: "n8n", icon: <Zap />, category: "Automation" },
  { id: "salesforce", name: "Salesforce", icon: <BarChart />, category: "CRM" },
  { id: "stripe", name: "Stripe", icon: <ShoppingCart />, category: "Finance" },
  { id: "gmail", name: "Gmail", icon: <Mail />, category: "Email" },
];

export const IntegrationsConsole = () => {
      const [activeTool, setActiveTool] = useState<string | null>(null);
    
      const handleToolClick = (toolId: string) => {
        setActiveTool(toolId);
        trackEvent({
            action: "select_tool",
            category: "integrations",
            label: toolId,
        });
      };
    
      return (        <section className="py-24 bg-zinc-950 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-secondary font-medium tracking-wide text-indigo-400 uppercase text-xs mb-4">
                        System Architecture
                    </h2>
                    <h3 className="text-3xl font-heading font-semibold text-white">
                        Wired for performance.
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                    {TOOLS.map((tool) => (
                        <div
                            key={tool.id}
            className="group relative flex flex-col items-center justify-center p-12 bg-zinc-950 hover:bg-zinc-925 transition-colors cursor-crosshair z-0"
            onMouseEnter={() => handleToolClick(tool.id)}
          >
                             {/* Wiring Highlight */}
                            <AnimatePresence>
                                {activeTool === tool.id && (
                                    <motion.div
                                        layoutId="highlight"
                                        className="absolute inset-0 bg-indigo-500/5 z-[-1]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </AnimatePresence>

                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                                activeTool === tool.id ? "bg-indigo-500 text-white scale-110" : "bg-zinc-900 text-zinc-500"
                            )}>
                                {tool.icon}
                            </div>
                            <span className={cn("font-medium transition-colors", activeTool === tool.id ? "text-white" : "text-zinc-500")}>
                                {tool.name}
                            </span>
                             <span className="text-xs text-zinc-600 mt-1">{tool.category}</span>
                             
                             {/* Connector Dot */}
                             <div className={cn(
                                 "absolute h-1.5 w-1.5 rounded-full bottom-4 right-4 transition-colors duration-300",
                                    activeTool === tool.id ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "bg-zinc-800"
                             )} />
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-zinc-600 font-mono px-2">
                    <span>STATUS: ONLINE</span>
                    <span>LATENCY: 12ms</span>
                </div>
            </div>
        </section>
    );
};
