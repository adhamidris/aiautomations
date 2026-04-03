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
    <section className="relative w-full overflow-hidden bg-[#fcfcfb] pt-12 pb-48 md:pt-20 md:pb-64">
      {/* Top transition carry-over from hero */}
      <div className="absolute inset-x-0 top-0 z-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.76)_24%,rgba(252,252,251,0.2)_68%,transparent_100%)] pointer-events-none md:h-60" />
      <div className="absolute left-1/2 top-0 z-0 h-36 w-[72vw] max-w-[760px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.035)_34%,transparent_72%)] blur-3xl pointer-events-none md:h-44" />
      <div className="absolute inset-x-0 top-0 z-0 h-56 bg-grid bg-[position:0_24px] opacity-55 [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_10%,rgba(0,0,0,0.72)_34%,transparent_100%)] pointer-events-none md:h-72" />
      <div className="absolute inset-x-0 top-0 z-0 h-56 bg-[linear-gradient(to_right,rgba(0,0,0,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.022)_1px,transparent_1px)] bg-[size:50px_50px] bg-[position:0_24px] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.14)_10%,rgba(0,0,0,0.62)_38%,transparent_100%)] pointer-events-none md:h-72" />

      {/* Section surface shaping */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.18)_62%,rgba(255,255,255,0.5)_100%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 z-0 h-32 bg-gradient-to-t from-[#fcfcfb] to-transparent pointer-events-none" />

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
