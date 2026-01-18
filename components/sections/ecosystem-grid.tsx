"use client";
import React, { useRef } from "react";

import { PartnerCard } from "@/components/ui/partner-card";
import { Meteors } from "@/components/ui/meteors";
import { BrandIcons } from "@/components/ui/brand-icons";
import { StarField } from "@/components/ui/star-field";


const PremiumBullet = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 shrink-0 mt-0.5 md:mt-1">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-foreground">
      <rect x="3.5" y="0.5" width="1" height="7" fill="currentColor" />
      <rect x="0.5" y="3.5" width="7" height="1" fill="currentColor" />
    </svg>
  </span>
);

interface PartnerData {
  id: string;
  name: string;
  category: string;
  description: string[];
}

interface EcosystemGridProps {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaTitle?: string;
  ctaButton?: string;
  partners?: Record<string, { name: string; description: string[] }>;
}

export const EcosystemGrid = ({
  titleLine1 = "No Repeated Tasks.",
  titleLine2 = "Automate Everything.",
  subtitle = "Automations",
  ctaTitle = "Have another operation you would like automated?",
  ctaButton = "TELL US MORE",
  partners
}: EcosystemGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-construct the partners array using passed dict or defaults
  // We keep the icons/layout logic here but use text from props
  const partnersList = [
    {
      id: "meta",
      name: partners?.meta.name || "Social Media Management",
      icon: <BrandIcons.Meta className="w-8 h-8 text-foreground" />,
      category: "Social Media",
      description: partners?.meta.description || [
        "Content creation & scheduling.",
        "Ads management & analytics.",
        "AI Customers Communications."
      ],
    },
    {
      id: "google",
      name: partners?.google.name || "Google Sheets",
      icon: <BrandIcons.Google className="w-8 h-8 text-foreground" />,
      category: "Data",
      description: partners?.google.description || [
        "Integrate AI into your sheets.",
        "Automated sheet data-based actions.",
        "Data Analysis and reporting."
      ],
    },
    {
      id: "whatsapp",
      name: partners?.whatsapp.name || "WhatsApp",
      icon: <BrandIcons.Whatsapp className="w-8 h-8 text-foreground" />,
      category: "Communication",
      description: partners?.whatsapp.description || [
        "Automated customer support.",
        "Instant order notifications.",
        "24/7 AI chatbots."
      ],
    },
    {
      id: "wordpress",
      name: partners?.wordpress.name || "WordPress",
      icon: <BrandIcons.Wordpress className="w-8 h-8 text-foreground" />,
      category: "CMS",
      description: partners?.wordpress.description || [
        "Automated content & blog publishing.",
        "SEO metadata & schema optimization."
      ],
    },
    {
      id: "research",
      name: partners?.research.name || "Research & Insights",
      icon: <BrandIcons.MarketResearch className="w-8 h-8 text-foreground" />,
      category: "Data",
      description: partners?.research.description || [
        "Frequency-based insights generation.",
        "AI-driven market research.",
        "Competitive analysis & trends."
      ],
    },
  ];

  return (
    <section id="services" className="relative w-full py-24 md:py-32 bg-background overflow-hidden" ref={containerRef}>
      <StarField density={1500} speed={0.2} className="opacity-20 dark:opacity-50" />
      <Meteors number={12} />
      {/* Technical Background Grid - uses global CSS variable */}
      <div className="absolute inset-0 bg-grid opacity-60 dark:opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--background)_100%)] pointer-events-none z-0" />

      {/* Bottom Fade for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24 relative z-20">
          <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {subtitle}
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            {titleLine1}<br />
            <span className="block mt-2">
              {titleLine2}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {partnersList.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              icon={partner.icon}
              category={partner.category}
              className="h-full"
              description={
                <span className="flex flex-col gap-1">
                  {partner.description.map((item, i) => (
                    <span key={i} className="flex items-start"><PremiumBullet /> {item}</span>
                  ))}
                </span>
              }
            />
          ))}

          {/* Custom CTA Card */}
          <div className="flex flex-col items-center justify-center text-center h-full min-h-[220px] p-8">
            <h3 className="text-2xl font-light tracking-tight text-foreground mb-6">
              {ctaTitle}
            </h3>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              <span className="text-xs font-mono uppercase tracking-widest font-semibold">{ctaButton}</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


