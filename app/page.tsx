"use client";
import React from "react";
import { HeroKinetic } from "@/components/sections/hero-kinetic";
import dynamic from "next/dynamic";

const EcosystemGrid = dynamic(() => import("@/components/sections/ecosystem-grid").then(mod => mod.EcosystemGrid), {
  loading: () => <div className="h-[800px]" />,
});
const TrustedMarquee = dynamic(() => import("@/components/sections/trusted-marquee").then(mod => mod.TrustedMarquee));
const ServicesDossier = dynamic(() => import("@/components/sections/services-dossier").then(mod => mod.ServicesDossier));
const WebPortfolio = dynamic(() => import("@/components/sections/web-portfolio").then(mod => mod.WebPortfolio));
const ContactForm = dynamic(() => import("@/components/sections/contact-form").then(mod => mod.ContactForm));
const Footer = dynamic(() => import("@/components/sections/footer").then(mod => mod.Footer));

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