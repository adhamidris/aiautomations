"use client";

import React from "react";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Intelligence",
    links: ["Workflow Automation", "Lead Intelligence", "CRM Architecture", "Growth Systems"],
  },
  {
    title: "Company",
    links: ["About System", "Manifesto", "Careers", "Contact Uplink"],
  },
  {
    title: "Legal",
    links: ["Privacy Protocol", "Terms of Service", "Cookie Policy"],
  },
];

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-black pt-24 pb-12">
      {/* Upward Fade to Blend with Contact Section */}
      <div className="absolute top-0 left-0 right-0 h-32 -translate-y-full bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Top Section: Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
            
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        JOE AUTOMATIONS
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                        Replacing manual labor with intelligent, autonomous systems. 
                        Deploying capital-efficient revenue infrastructure.
                    </p>
                </div>
                <CyberBadge text="SYSTEM_OPERATIONAL" status="online" />
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                {FOOTER_LINKS.map((column) => (
                    <div key={column.title} className="space-y-6">
                        <h4 className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest">
                            {column.title}
                        </h4>
                        <ul className="space-y-4">
                            {column.links.map((link) => (
                                <li key={link}>
                                    <a href="#" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                                        {link}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom Section: Big Typography */}
        <div className="relative border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-2">
                 <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    © {new Date().getFullYear()} Joe Automations Inc.
                </p>
                <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                    All Systems Nominal.
                </p>
            </div>
            
            {/* Massive Brand Watermark */}
            <h1 className="font-heading font-black text-[15vw] md:text-[12vw] leading-none text-zinc-900 select-none pointer-events-none opacity-50 md:opacity-100 mix-blend-difference">
                JOE<span className="text-zinc-800">AUTO</span>
            </h1>
        </div>
      </div>
    </footer>
  );
}
