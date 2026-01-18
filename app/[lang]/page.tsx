import React from "react";
import { HeroKinetic } from "@/components/sections/hero-kinetic";
import { EcosystemGrid } from "@/components/sections/ecosystem-grid";
import { TrustedMarquee } from "@/components/sections/trusted-marquee";
import { ServicesDossier } from "@/components/sections/services-dossier";
import { WebPortfolio } from "@/components/sections/web-portfolio";
import { BlogsSection } from "@/components/sections/blogs-section";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/sections/footer";
import { SectionTracker } from "@/components/analytics/section-tracker";
import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import { getAllPosts } from "@/lib/content";

// import { Testimonials } from "@/components/sections/testimonials";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const blogPosts = getAllPosts(lang);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SectionTracker id="hero" name="Hero Section" minDuration={3000}>
        <HeroKinetic
          phrases={dict.hero.phrases}
          ctaAutomation={dict.hero.ctaAutomation}
          ctaWebDev={dict.hero.ctaWebDev}
        />
      </SectionTracker>

      <TrustedMarquee />

      <SectionTracker id="ecosystem" name="Ecosystem Grid">
        <EcosystemGrid
          titleLine1={dict.ecosystem.titleLine1}
          titleLine2={dict.ecosystem.titleLine2}
          subtitle={dict.ecosystem.subtitle}
          ctaTitle={dict.ecosystem.ctaTitle}
          ctaButton={dict.ecosystem.ctaButton}
          partners={dict.ecosystem.partners}
        />
      </SectionTracker>

      <SectionTracker id="services" name="Services Dossier">
        <ServicesDossier
          subtitle={dict.services.subtitle}
          titleLine1={dict.services.titleLine1}
          titleLine2={dict.services.titleLine2}
          items={dict.services.items}
        />
      </SectionTracker>

      <SectionTracker id="portfolio" name="Web Portfolio">
        <WebPortfolio
          subtitle={dict.portfolio.subtitle}
          title={dict.portfolio.title}
          viewProject={dict.portfolio.viewProject}
          projects={dict.portfolio.projects}
        />
      </SectionTracker>

      <SectionTracker id="blogs" name="Blogs Section">
        <BlogsSection
          subtitle={dict.blogs.subtitle}
          title={dict.blogs.title}
          readMore={dict.blogs.readMore}
          posts={blogPosts}
        />
      </SectionTracker>

      {/* <Testimonials /> */}

      <SectionTracker id="contact" name="Contact Form">
        <ContactForm
          badgeIdle={dict.contact.badgeIdle}
          badgeAudit={dict.contact.badgeAudit}
          titleHighlight={dict.contact.titleHighlight}
          titleNormal={dict.contact.titleNormal}
          reponseTime={dict.contact.reponseTime}
          responseTimeHighlight={dict.contact.responseTimeHighlight}
          duringBusinessHours={dict.contact.duringBusinessHours}
          successTitle={dict.contact.successTitle}
          successMessage={dict.contact.successMessage}
          sendAnother={dict.contact.sendAnother}
          form={dict.contact.form}
        />
      </SectionTracker>
      <Footer rights={dict.footer.rights} />
    </div>
  );
}