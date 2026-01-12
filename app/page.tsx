"use client";
import React from "react";
import { HeroKinetic } from "@/components/sections/hero-kinetic";
import { EcosystemGrid } from "@/components/sections/ecosystem-grid";
import { TrustedMarquee } from "@/components/sections/trusted-marquee";
import { ServicesDossier } from "@/components/sections/services-dossier";
import { WebPortfolio } from "@/components/sections/web-portfolio";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/sections/footer";
// import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HeroKinetic />
      <TrustedMarquee />

      <EcosystemGrid />



      <ServicesDossier />
      <WebPortfolio />

      {/* <Testimonials /> */}

      <ContactForm />
      <Footer />
    </div>
  );
}