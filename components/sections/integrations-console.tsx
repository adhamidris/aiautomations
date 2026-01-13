"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Database, MessageSquare, Zap, BarChart, ShoppingCart, Mail } from "lucide-react";

const TOOLS = [
  { id: "hubspot", name: "HubSpot", icon: <Database />, category: "CRM" },
  { id: "slack", name: "Slack", icon: <MessageSquare />, category: "Comms" },
  { id: "n8n", name: "n8n", icon: <Zap />, category: "Automation" },
  { id: "salesforce", name: "Salesforce", icon: <BarChart />, category: "CRM" },
  { id: "stripe", name: "Stripe", icon: <ShoppingCart />, category: "Finance" },
  { id: "gmail", name: "Gmail", icon: <Mail />, category: "Email" },
];

export const IntegrationsConsole = () => {
      return (        <section className="py-24 bg-background px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-secondary font-medium tracking-wide text-indigo-400 uppercase text-xs mb-4">
                        System Architecture
                    </h2>
                    <h3 className="text-3xl font-heading font-semibold text-foreground">
                        Wired for performance.
                    </h3>
                </div>

                <div 
                    className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden shadow-2xl"
                >
                    {TOOLS.map((tool) => (
                        <div
                            key={tool.id}
            className="group relative flex flex-col items-center justify-center p-12 bg-card transition-colors cursor-crosshair overflow-hidden"
          >
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                                    "bg-muted text-muted-foreground"
                                )}>
                                    {tool.icon}
                                </div>
                                <span className={cn("font-medium transition-colors text-muted-foreground")}>
                                    {tool.name}
                                </span>
                                <span className="text-xs text-muted-foreground/80 mt-1">{tool.category}</span>
                            </div>
                             
                             {/* Connector Dot */}
                             <div className={cn(
                                 "absolute h-1.5 w-1.5 rounded-full bottom-4 right-4 transition-colors duration-300 z-10",
                                    "bg-muted-foreground/30"
                             )} />
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-muted-foreground font-mono px-2">
                    <span>STATUS: ONLINE</span>
                    <span>LATENCY: 12ms</span>
                </div>
            </div>
        </section>
    );
};
