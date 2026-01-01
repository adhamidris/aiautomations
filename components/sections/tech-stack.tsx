"use client"

import { motion } from "framer-motion"

const technologies = [
  "HubSpot", "Salesforce", "n8n", "Make", "Zapier", "Pipedrive", "ActiveCampaign", "Google Sheets", "Airtable", "Slack"
]

export function TechStack() {
  return (
    <section className="border-y border-muted bg-card/30 py-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8 text-center">
         <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Powering your growth with</p>
      </div>
      
      <div className="relative flex w-full overflow-hidden mask-linear-gradient">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        
        <div className="flex w-full overflow-hidden">
            <motion.div 
            className="flex shrink-0 items-center gap-16 pr-16"
            animate={{ x: "-50%" }}
            transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: 30,
            }}
            style={{ width: "fit-content" }}
            >
            {[...technologies, ...technologies, ...technologies, ...technologies].map((tech, i) => (
                <span key={i} className="font-heading text-3xl font-bold text-muted-foreground/40 hover:text-accent transition-colors cursor-default whitespace-nowrap">
                {tech}
                </span>
            ))}
            </motion.div>
        </div>
      </div>
    </section>
  )
}