"use client";
import React from "react";
import { HeroKinetic } from "@/components/sections/hero-kinetic";
import { EcosystemGrid } from "@/components/sections/ecosystem-grid";
import { TrustedMarquee } from "@/components/sections/trusted-marquee";
import { ServicesDossier } from "@/components/sections/services-dossier";
import { WebPortfolio } from "@/components/sections/web-portfolio";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/sections/footer";
import { SectionTracker } from "@/components/analytics/section-tracker";

// import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SectionTracker id="hero" name="Hero Section" minDuration={3000}>
        <HeroKinetic />
      </SectionTracker>

      <TrustedMarquee />

      <SectionTracker id="ecosystem" name="Ecosystem Grid">
        <EcosystemGrid />
      </SectionTracker>

      <SectionTracker id="services" name="Services Dossier">
        <ServicesDossier />
      </SectionTracker>

      <SectionTracker id="portfolio" name="Web Portfolio">
        <WebPortfolio />
      </SectionTracker>

      {/* <Testimonials /> */}

      <SectionTracker id="contact" name="Contact Form">
        <ContactForm />
      </SectionTracker>
      <Footer />
    </div>
  );
}