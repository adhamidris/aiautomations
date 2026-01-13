"use client";

import React from "react";
import { ServiceLine } from "@/components/ui/service-line";
import { CyberPanel } from "@/components/ui/cyber-panel";

const services = [
  {
    number: "01",
    title: "Web Development",
    description: "Custom web development services. We build responsive, user-friendly, and scalable websites using the latest technologies & SEO friendly frameworks.",
    tags: ["Next.js", "React", "TailwindCSS", "Django", "Python"],
  },
  {
    number: "02",
    title: "SaaS Building",
    description: "Custom SaaS development & MVP services. We build scalable, secure, and user-friendly software solutions using top-notch technologies.",
    tags: ["MVP Architecture", "Scalable Infra", "Auth Systems", "Payment gateways"],
  },
  {
    number: "03",
    title: "AI Integrations & Fine-tuning",
    description: "Custom AI integrations. We Integrate custom AI models and fine-tune them to help you automate and optimize your processes.",
    tags: ["LLM Fine-tuning", "RAG/Knowledge Base LLMs", "Vector DBs", "Custom Agents"],
  },
  {
    number: "04",
    title: "Hosting Management",
    description: "Custom hosting management services. We manage and optimize your hosting environment to ensure maximum performance and security.",
    tags: ["AWS / Vercel", "CI/CD", "Monitoring"],
  },
];

export function ServicesDossier() {
  const [activeService, setActiveService] = React.useState<string | null>(null);

  const handleToggle = React.useCallback((id: string) => {
    setActiveService(prev => prev === id ? null : id);
  }, []);

  return (
    <section className="relative w-full pt-24 pb-48 md:pt-32 md:pb-64 bg-background overflow-hidden">
      {/* Hero-Style Background Grid (Replicated) */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-20 bg-grid" />

      {/* Edge Fade Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-40 pointer-events-none" />

      {/* Top Fade for Smooth Transition */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none" />
      {/* Bottom Fade for Smooth Transition to Portfolio */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
            Full Stack Solutions
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/80 to-foreground">
              Web Development. <br /> SaaS Building.
            </span>
          </h3>
        </div>

        <div className="relative">
          {/* The Dossier List */}
          <div className="border-t border-border">
            {services.map((service) => (
              <ServiceLine
                key={service.number}
                {...service}
                isOpen={activeService === service.number}
                onToggle={handleToggle}
              />
            ))}
          </div>


        </div>
      </div>
    </section>
  );
}
