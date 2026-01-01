"use client";

import { motion } from "framer-motion";
import { CyberPanel } from "@/components/ui/cyber-panel";
import { UnifiedCTA } from "@/components/ui/unified-cta";
import { AuroraBackground } from "@/components/ui/aurora-background";

export const HeroFramed = () => {
  return (
    <AuroraBackground showRadialGradient={false}>
      <div className="relative flex min-h-[90vh] flex-col items-center justify-center p-4 md:p-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-6xl"
        >
          <CyberPanel 
            variant="hero"
            header={{
                badge: { text: "System Audit Available", status: "audit" },
                title: "BOOT_SEQUENCE",
                subtitle: "v2.0.4-stable"
            }}
          >
            {/* Header Content */}
            <div className="relative z-10 max-w-3xl space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-heading text-5xl font-bold tracking-tight text-white sm:text-7xl"
              >
                Automate operations. <br/>
                <span className="text-white/40">Scale without chaos.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto max-w-xl text-lg text-white/50"
              >
                We replace manual workflows with intelligent, autonomous systems. 
                SaaS implementation for high-growth revenue teams.
              </motion.p>
              
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
              >
                  <UnifiedCTA />
              </motion.div>
            </div>

            {/* Floating Proof Badges - Kept as absolute decorators for now */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.8, type: "spring" }}
                 className="absolute left-[8%] top-[25%]"
               >
                 <div className="rotate-[-6deg] bg-black/60 backdrop-blur rounded-sm border border-white/10 p-4">
                     <span className="block text-xs text-white/40 font-mono uppercase">Avg. Time Saved</span>
                     <span className="text-lg font-bold text-white">28hrs / week</span>
                 </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.9, type: "spring" }}
                 className="absolute right-[10%] bottom-[30%]"
               >
                 <div className="rotate-[3deg] bg-black/60 backdrop-blur rounded-sm border border-white/10 p-4">
                     <span className="block text-xs text-white/40 font-mono uppercase">Systems Shipped</span>
                     <span className="text-lg font-bold text-white">140+ Projects</span>
                 </div>
               </motion.div>
            </div>
            
          </CyberPanel>
        </motion.div>
      </div>
    </AuroraBackground>
  );
};
