"use client";

import { motion } from "framer-motion";

const COMPANIES = [
  "NEXUS_CORP",
  "VECTOR_DYNAMICS",
  "CYBER_SYSTEMS",
  "OMEGA_LABS",
  "SYNTH_NETWORK",
  "PRIME_LOGIC",
  "AURA_TECH",
  "QUANTUM_CORE",
  "FLUX_INDUSTRIES",
  "ECHO_BASE",
];

// Duplicated for seamless loop
const MARQUEE_CONTENT = [...COMPANIES, ...COMPANIES];

export function TrustedMarquee() {
  return (
    <section className="w-full border-y border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden py-6 relative">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10 flex items-center">
        
        {/* Static Label */}
        <div className="hidden md:block pr-8 border-r border-white/10 mr-8 shrink-0">
             <span className="text-xs font-mono text-white/30 tracking-widest uppercase">
                TRUSTED_BY_SYSTEMS://
             </span>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative mask-image-fade"> 
            {/* Gradient Masks for edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none md:hidden" />

            <motion.div
                className="flex gap-16 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 40,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {MARQUEE_CONTENT.map((company, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default">
                        {/* Placeholder Icon */}
                        <div className="w-2 h-2 rounded-sm bg-white/10 rotate-45 group-hover:bg-accent transition-colors duration-300" />
                        <span className="text-sm font-heading font-bold text-white/30 tracking-widest group-hover:text-white transition-colors duration-300">
                            {company}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
}
