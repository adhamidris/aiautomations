"use client";

import React from "react";
import { ServiceLine } from "@/components/ui/service-line";


interface ServicesDossierProps {
  subtitle?: string;
  titleLine1?: string;
  titleLine2?: string;
  ctaText?: string;
  items?: { title: string; description: string }[];
}

export function ServicesDossier({
  subtitle = "Full Stack Solutions",
  titleLine1 = "Web Development.",
  titleLine2 = "SaaS & MVPs.",
  ctaText = "BOOK A MEETING",
  items
}: ServicesDossierProps) {
  const [activeService, setActiveService] = React.useState<string | null>(null);

  const handleToggle = React.useCallback((id: string) => {
    setActiveService(prev => prev === id ? null : id);
  }, []);

  const serviceData = [
    {
      number: "01",
      title: items?.[0].title || "Web Development",
      description: items?.[0].description || "Custom web development services. We build responsive, user-friendly, and scalable websites using the latest technologies & SEO friendly frameworks.",
    },
    {
      number: "02",
      title: items?.[1].title || "SaaS & MVPs",
      description: items?.[1].description || "Custom SaaS development & MVP services. We build scalable, secure, and user-friendly software solutions using top-notch technologies.",
    },
    {
      number: "03",
      title: items?.[2].title || "AI Integrations",
      description: items?.[2].description || "Custom AI integrations tailored to your workflows, helping you automate operations and improve efficiency.",
    },
    {
      number: "04",
      title: items?.[3].title || "RAG",
      description: items?.[3].description || "End-to-end RAG systems for your business knowledge, including data ingestion, retrieval pipelines, and reliable AI answers grounded in your documents.",
    },
    {
      number: "05",
      title: items?.[4].title || "Hosting Management",
      description: items?.[4].description || "Custom hosting management services. We manage and optimize your hosting environment to ensure maximum performance and security.",
    },
  ];

  return (
    <section className="relative w-full pt-12 pb-48 md:pt-20 md:pb-64 bg-background overflow-hidden">
      {/* Hero-Style Background Grid (Replicated) */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-20 bg-grid" />

      {/* Edge Fade Mask */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-40 pointer-events-none" />

      {/* Top Fade for Smooth Transition */}
      <div className="absolute top-0 left-0 right-0 h-40 md:h-48 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none" />
      {/* Bottom Fade for Smooth Transition to Portfolio */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16 md:mb-24 relative z-20">
          <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {subtitle}
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {titleLine1} <br /> {titleLine2}
          </h3>
        </div>

        <div className="relative">
          {/* The Dossier List */}
          <div className="border-t border-border">
            {serviceData.map((service) => (
              <ServiceLine
                key={service.number}
                number={service.number}
                title={service.title}
                description={service.description}
                ctaText={ctaText}
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
