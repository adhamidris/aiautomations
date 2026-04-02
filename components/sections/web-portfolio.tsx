"use client";

import { useEffect, useRef, useState } from "react";
import { StarField } from "@/components/ui/star-field";
import { Meteors } from "@/components/ui/meteors";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";


interface WebPortfolioProps {
  subtitle?: string;
  title?: string;
  viewProject?: string;
  projects?: Record<string, string>;
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`h-6 w-6 text-white ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
    >
      <path
        d="M10 32H48"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M34 18L48 32L34 46"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WebPortfolio({
  subtitle = "Selected Work",
  title = "Crafting Digital Experiences.",
  viewProject = "View Project",
  projects
}: WebPortfolioProps) {
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mobileIndex, setMobileIndex] = useState(0);

  // Need to reconstruct the array properly and inject descriptions
  const projectsList = [
    {
      title: "Kaya Tours",
      category: "Tourism Website",
      tech: "Django • Tailwind • SQL",
      link: "https://kayatourseg.pythonanywhere.com",
      image: "/kayatours.png",
      mobileImage: "/iphone-layout/kayatours.png",
      description: projects?.kaya || "Boutique travel platform showcasing curated desert and cultural tours across Egypt with immersive destination experiences."
    },
    {
      title: "PowerCEM",
      category: "Landing Page",
      tech: "Next.js • Static",
      link: "https://powercem-nine.vercel.app/",
      image: "/powercem.png",
      mobileImage: "/iphone-layout/cemex.png",
      description: projects?.powercem || "Professional infrastructure landing page highlighting sustainable cement-based soil stabilization solutions for global construction projects."
    },
    {
      title: "Elle Shines",
      category: "E-Commerce",
      tech: "Next.js • Tailwind • Static",
      link: "https://elle-shines.vercel.app/",
      image: "/elleshines.png",
      mobileImage: "/iphone-layout/elleshines.png",
      description: projects?.elleshines || "Modern skincare e-commerce store featuring professional beauty tools with seamless UX and conversion-optimized design."
    },
    {
      title: "Hunters",
      category: "E-Commerce",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://hunterswear.vercel.app/",
      image: "/hunters.png",
      mobileImage: "/iphone-layout/hunters.png",
      description: projects?.hunters || "Urban streetwear e-commerce platform offering premium graphic tees and shorts with a street-culture aesthetic and mobile-optimized shopping."
    },
    // {
    //   title: "Once Upon a Time",
    //   category: "EdTech",
    //   tech: "Next.js • Static",
    //   link: "https://onceuponaatime.vercel.app/",
    //   image: "/onceuponatime.png",
    //   description: projects?.once || "Automated animation creation platform empowering young creators to produce professional-quality animations through an intuitive studio interface."
    // },
    {
      title: "Nassers Gallery",
      category: "Art Gallery",
      tech: "Vite • Static",
      link: "https://nassersgallery.vercel.app/",
      image: "/nassergallery.png",
      mobileImage: "/iphone-layout/nassersgallery.png",
      description: projects?.nasser || "Elegant digital art gallery presenting curated fine art collections with a clean, immersive browsing experience."
    },
    {
      title: "Novello",
      category: "Healthcare",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://novello.vercel.app/",
      image: "/novello.png",
      mobileImage: "/iphone-layout/novello.png",
      description: projects?.novello || "Premium aesthetic clinic website offering dermatology, laser, and cosmetic services with seamless appointment booking."
    }
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = Math.round(container.clientWidth * 0.78);
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const threshold = 8;

      setCanScrollLeft(container.scrollLeft > threshold);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - threshold);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const container = mobileCarouselRef.current;
    if (!container) return;

    const updateMobileIndex = () => {
      const slides = Array.from(
        container.querySelectorAll<HTMLElement>("[data-mobile-slide='true']")
      );
      if (!slides.length) return;

      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(slideCenter - containerCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setMobileIndex(nearestIndex);
    };

    updateMobileIndex();
    container.addEventListener("scroll", updateMobileIndex, { passive: true });
    window.addEventListener("resize", updateMobileIndex);

    return () => {
      container.removeEventListener("scroll", updateMobileIndex);
      window.removeEventListener("resize", updateMobileIndex);
    };
  }, [projectsList.length]);

  const renderProjectCard = (project: typeof projectsList[number], index: number, carousel = false) => (
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
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-500 hover:border-foreground/20 hover:shadow-2xl hover:shadow-emerald-500/10 ${carousel ? "min-w-[340px] snap-start md:min-w-[380px] xl:min-w-[420px]" : ""}`}
    >
      <div className="relative aspect-video w-full bg-muted/50 flex items-center justify-center overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-foreground text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {viewProject} <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>

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
  );

  const renderMobileProjectCard = (project: typeof projectsList[number], index: number) => (
    <a
      key={index}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent({
          action: "project_click",
          category: "portfolio_mobile",
          label: project.title,
        })
      }}
      data-mobile-slide="true"
      className="block w-[min(73vw,284px)] shrink-0 snap-center"
    >
      <div className="relative mx-auto aspect-[9/19] rounded-[2.9rem] bg-[#111111] p-[6px] shadow-[0_24px_70px_rgba(0,0,0,0.22)] ring-1 ring-black/20">
        <div className="absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-[#161616] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]" />
        <div className="absolute right-[35%] top-[18px] z-30 h-2.5 w-2.5 rounded-full bg-[#222] ring-2 ring-[#101010]" />
        <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-[#0d0d0d]">
          <Image
            src={project.mobileImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 73vw, 284px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08)_0%,rgba(10,10,10,0.12)_28%,rgba(10,10,10,0.74)_72%,rgba(10,10,10,0.92)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-7 pt-10 text-white">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-white/75 backdrop-blur-sm">
                {project.category}
              </span>
              <div className="max-w-[12rem]">
                <h3 className="font-heading text-[2.1rem] font-bold leading-[0.95] tracking-tight text-white">
                  {project.title}
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              <p className="max-w-[15rem] text-sm leading-6 text-white/78">
                {project.description}
              </p>

              <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-4">
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
                    Stack
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-white/72">
                    {project.tech}
                  </div>
                </div>

                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_24px_rgba(255,255,255,0.18)]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <section id="portfolio" className="relative w-full pt-0 md:pt-0 pb-28 md:pb-32 bg-background overflow-hidden">

      {/* Star Field & Meteors Background */}
      <StarField density={1500} speed={0.2} className="opacity-20" />
      <Meteors number={12} />

      {/* Technical Background Grid - uses global CSS variable */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,var(--background)_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-16 gap-8 text-center w-full">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-muted-foreground underline decoration-border underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              {subtitle}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
              {title}
            </h3>
          </div>
        </div>

        <div className="md:hidden">
          <div className="-mx-4">
            <div
              ref={mobileCarouselRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="shrink-0 basis-[calc((100vw-min(73vw,284px))/2)]" />
              {projectsList.map((project, index) => renderMobileProjectCard(project, index))}
              <div className="shrink-0 basis-[calc((100vw-min(73vw,284px))/2)]" />
            </div>
          </div>
          <div className="mt-1 flex items-center justify-center gap-2">
            {projectsList.map((project, index) => (
              <span
                key={project.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === mobileIndex ? "w-8 bg-foreground" : "w-1.5 bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>

        <div className="hidden md:grid xl:hidden grid-cols-1 md:grid-cols-2 gap-8">
          {projectsList.map((project, index) => renderProjectCard(project, index))}
        </div>

        <div className="hidden xl:block relative xl:-mx-10 2xl:-mx-14">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            className={`absolute left-0 top-1/2 z-20 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-black shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 ${canScrollLeft ? "opacity-100 hover:scale-105 hover:bg-zinc-900" : "pointer-events-none opacity-0 scale-90"}`}
            aria-label="Scroll portfolio left"
            disabled={!canScrollLeft}
          >
            <CarouselArrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            className={`absolute right-0 top-1/2 z-20 inline-flex h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-black shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all duration-300 ${canScrollRight ? "opacity-100 hover:scale-105 hover:bg-zinc-900" : "pointer-events-none opacity-0 scale-90"}`}
            aria-label="Scroll portfolio right"
            disabled={!canScrollRight}
          >
            <CarouselArrow direction="right" />
          </button>

          <div className="px-12 2xl:px-16">
            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projectsList.map((project, index) => renderProjectCard(project, index, true))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
