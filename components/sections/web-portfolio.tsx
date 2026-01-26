"use client";

import { StarField } from "@/components/ui/star-field";
import { Meteors } from "@/components/ui/meteors";
import { ArrowUpRight, Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";


interface WebPortfolioProps {
  subtitle?: string;
  title?: string;
  viewProject?: string;
  projects?: Record<string, string>;
}

export function WebPortfolio({
  subtitle = "Selected Work",
  title = "Crafting Digital Experiences.",
  viewProject = "View Project",
  projects
}: WebPortfolioProps) {

  // Need to reconstruct the array properly and inject descriptions
  const projectsList = [
    {
      title: "Kaya Tours",
      category: "Tourism Website",
      tech: "Django • Tailwind • SQL",
      link: "https://kayatourseg.pythonanywhere.com",
      image: "/kayatours.png",
      description: projects?.kaya || "Full-stack tourism platform built with Django templates and TailwindCSS."
    },
    {
      title: "Hunters",
      category: "E-Commerce",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://hunterswear.vercel.app/",
      image: "/hunters.png",
      description: projects?.hunters || "Gen-Z fashion brand store with a modern, static frontend."
    },
    {
      title: "Once Upon a Time",
      category: "EdTech",
      tech: "Next.js • Static",
      link: "https://onceuponaatime.vercel.app/",
      image: "/onceuponatime.png",
      description: projects?.once || "Interactive storytelling application for children."
    },
    {
      title: "Nassers Gallery",
      category: "Art Gallery",
      tech: "Vite • Static",
      link: "https://nassersgallery.vercel.app/",
      image: "/nassergallery.png",
      description: projects?.nasser || "Digital art gallery showcasing curated collections."
    },
    {
      title: "PowerCEM",
      category: "Landing Page",
      tech: "Next.js • Static",
      link: "https://powercem-j8i0mo2ji-adhamidris-projects.vercel.app/",
      image: "/powercem.png",
      description: projects?.powercem || "next.js static landing page for PowerCEM"
    },
    {
      title: "Novello",
      category: "Healthcare",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://novello.vercel.app/",
      image: "/novello.png",
      description: projects?.novello || "Static website for a beauty clinic."
    }
  ];

  return (
    <section id="portfolio" className="relative w-full pt-0 md:pt-0 pb-24 md:pb-32 bg-background overflow-hidden">

      {/* Star Field & Meteors Background */}
      <StarField density={1500} speed={0.2} className="opacity-20 dark:opacity-50" />
      <Meteors number={12} />

      {/* Technical Background Grid - uses global CSS variable */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--background)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-8 text-center w-full">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {subtitle}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
              {title}
            </h3>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent({
                  action: "project_click",
                  category: "portfolio",
                  label: project.title,
                })
              }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-500 hover:border-foreground/20 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full bg-muted/50 flex items-center justify-center overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-foreground text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {viewProject} <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-500 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-500 transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-border">
                  <span className="text-xs font-mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors duration-300">
                    {project.tech}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
