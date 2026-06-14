"use client";

import { useEffect, useRef, useState } from "react";
import { StarField } from "@/components/ui/star-field";
import { Meteors } from "@/components/ui/meteors";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import { SectionEdgeAccents } from "@/components/ui/section-edge-accents";


interface WebPortfolioProps {
  subtitle?: string;
  title?: string;
  viewProject?: string;
  projects?: Record<string, string>;
}

type PortfolioProject = {
  title: string;
  category: string;
  tech: string;
  link: string;
  image: string;
  mobileImage: string;
  desktopImagePosition?: string;
  mobileStatus?: string;
  description: string;
}

function getNearestSlideIndex(
  container: HTMLDivElement,
  selector: string
) {
  const slides = Array.from(
    container.querySelectorAll<HTMLElement>(selector)
  );
  if (!slides.length) {
    return { index: 0, slides };
  }

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

  return { index: nearestIndex, slides };
}

function CarouselArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`h-3.5 w-3.5 text-[#f3f4f6] ${direction === "left" ? "rotate-180" : ""}`}
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
  const mobileCardWidth = "min(73vw, 284px)";
  const mobileCarouselInset = `calc((100vw - ${mobileCardWidth}) / 2)`;
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);

  // Need to reconstruct the array properly and inject descriptions
  const projectsList: PortfolioProject[] = [
    {
      title: "BRC Developments",
      category: "Real Estate",
      tech: "WordPress • Elementor • ACF",
      link: "https://brc.srv1127642.hstgr.cloud/",
      image: "/brc.png",
      mobileImage: "/iphone-layout/brc.png",
      desktopImagePosition: "center top",
      description: "A polished local real estate website for BRC Developments, presenting residential projects, company credibility, and property discovery through a clear, conversion-focused WordPress experience."
    },
    {
      title: "Hunters",
      category: "E-Commerce",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://hunterswear.vercel.app/",
      image: "/hunters.png",
      mobileImage: "/iphone-layout/hunters.png",
      desktopImagePosition: "center top",
      description: projects?.hunters || "Urban streetwear e-commerce platform offering premium graphic tees and shorts with a street-culture aesthetic and mobile-optimized shopping."
    },
    {
      title: "Sahari",
      category: "Tourism Website",
      tech: "Django • Tailwind • SQL",
      link: "https://kayatourseg.pythonanywhere.com",
      image: "/desktop-layout/sahari-desktop.png",
      mobileImage: "/iphone-layout/sahari.png",
      desktopImagePosition: "center center",
      description: "A dedicated Kaya Tours experience for Sahari desert expeditions, designed around immersive storytelling, premium visuals, and conversion-focused journey discovery."
    },
    {
      title: "Kaya Tours",
      category: "Tourism Website",
      tech: "Django • Tailwind • SQL",
      link: "https://kayatourseg.pythonanywhere.com",
      image: "/kayatours.png",
      mobileImage: "/iphone-layout/kayatours.png",
      desktopImagePosition: "center top",
      description: projects?.kaya || "Boutique travel platform showcasing curated desert and cultural tours across Egypt with immersive destination experiences."
    },
    // {
    //   title: "Pocket AI",
    //   category: "Pre-Production SaaS",
    //   tech: "Django • Agentic RAG • AI Assistant",
    //   link: "#portfolio",
    //   image: "/desktop-layout/pocket-desktop.png",
    //   mobileImage: "/iphone-layout/pocket.png",
    //   mobileStatus: "Pre-production",
    //   desktopImagePosition: "68% center",
    //   description: "An in-progress SaaS platform built around an agentic RAG assistant, focused on intelligent customer support flows, knowledge-grounded answers, and scalable product UX."
    // },
    {
      title: "PowerCEM",
      category: "Landing Page",
      tech: "Next.js • Static",
      link: "https://powercem-nine.vercel.app/",
      image: "/powercem.png",
      mobileImage: "/iphone-layout/cemex.png",
      desktopImagePosition: "center center",
      description: projects?.powercem || "Professional infrastructure landing page highlighting sustainable cement-based soil stabilization solutions for global construction projects."
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
      desktopImagePosition: "center center",
      description: projects?.nasser || "Elegant digital art gallery presenting curated fine art collections with a clean, immersive browsing experience."
    },
    {
      title: "Novello",
      category: "Healthcare",
      tech: "HTML • CSS • Vanilla JS",
      link: "https://novello.vercel.app/",
      image: "/novello.png",
      mobileImage: "/iphone-layout/novello.png",
      desktopImagePosition: "center top",
      description: projects?.novello || "Premium aesthetic clinic website offering dermatology, laser, and cosmetic services with seamless appointment booking."
    },
    {
      title: "Elle Shines",
      category: "E-Commerce",
      tech: "Next.js • Tailwind • Static",
      link: "https://elle-shines.vercel.app/",
      image: "/elleshines.png",
      mobileImage: "/iphone-layout/elleshines.png",
      desktopImagePosition: "center top",
      description: projects?.elleshines || "Modern skincare e-commerce store featuring professional beauty tools with seamless UX and conversion-optimized design."
    }
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const slides = Array.from(
      container.querySelectorAll<HTMLElement>("[data-desktop-slide='true']")
    );
    if (!slides.length) return;

    const nextIndex = Math.max(
      0,
      Math.min(
        projectsList.length - 1,
        desktopIndex + (direction === "right" ? 1 : -1)
      )
    );

    container.scrollTo({
      left: slides[nextIndex].offsetLeft,
      behavior: "smooth",
    });

    trackEvent({
      action: "portfolio_nav_click",
      category: "portfolio_desktop",
      label: direction,
    })
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const threshold = 8;
      const slides = Array.from(
        container.querySelectorAll<HTMLElement>("[data-desktop-slide='true']")
      );

      setCanScrollLeft(container.scrollLeft > threshold);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - threshold);

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

      setDesktopIndex(nearestIndex);
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
      const { index: nearestIndex, slides } = getNearestSlideIndex(
        container,
        "[data-mobile-slide='true']"
      );
      if (!slides.length) return;

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
          sizes={carousel ? "(max-width: 768px) 340px, (max-width: 1280px) 380px, 420px" : "(max-width: 768px) 100vw, 50vw"}
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
      className="block shrink-0 snap-center"
      style={{ width: mobileCardWidth, scrollSnapStop: "always" }}
    >
      <div className="relative mx-auto aspect-[9/19] rounded-[2.9rem] bg-[#111111] p-[6px] ring-1 ring-black/20">
        <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-[#0d0d0d]">
          <Image
            src={project.mobileImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 73vw, 284px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(10,10,10,0.18)_35%,rgba(10,10,10,0.75)_100%)]" />

          <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
                      {project.title}
                    </div>
                    {project.mobileStatus ? (
                      <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[9px] font-heading uppercase tracking-[0.18em] text-amber-200">
                        {project.mobileStatus}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-white/72">
                    {project.tech}
                  </div>
                </div>

                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );

  const renderDesktopShowcaseSlide = (project: typeof projectsList[number], index: number) => (
    <a
      key={index}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      data-desktop-slide="true"
      onClick={() => {
        trackEvent({
          action: "project_click",
          category: "portfolio_desktop",
          label: project.title,
        })
      }}
      className="group relative block h-full w-full shrink-0 snap-center overflow-hidden"
    >
      <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_center,#f7f4ef_0%,#ebe6de_100%)]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1280px) 900px, (min-width: 768px) 70vw, 100vw"
          style={{ objectPosition: project.desktopImagePosition ?? "center center" }}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-y-0 left-0 z-10 flex w-[30%] min-w-[250px] max-w-[320px] translate-x-[-102%] flex-col justify-between border-r border-white/8 bg-[linear-gradient(180deg,rgba(23,24,28,0.94)_0%,rgba(18,19,23,0.88)_100%)] p-7 text-white opacity-0 backdrop-blur-[6px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-emerald-400/90">
                {project.category}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/28">
                {String(index + 1).padStart(2, "0")} / {String(projectsList.length).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h4 className="text-[2rem] font-bold leading-[0.98] tracking-tight text-white">
                {project.title}
              </h4>
              <p className="mt-4 max-w-[20rem] text-sm leading-7 text-white/68">
                {project.description}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/36">
                Stack
              </div>
              <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.16em] text-white/72">
                {project.tech}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {projectsList.map((item, dotIndex) => (
                <span
                  key={`${project.title}-${item.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${dotIndex === index ? "w-10 bg-white" : "w-1.5 bg-white/22"}`}
                />
              ))}
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black shadow-[0_18px_36px_rgba(0,0,0,0.16)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:bg-[#f7f7f8] group-hover:shadow-[0_22px_42px_rgba(0,0,0,0.2)]">
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
                {viewProject}
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#fcfcfb] pt-0 md:pt-0 pb-28 md:pb-32">

      {/* Star Field & Meteors Background */}
      <StarField density={1500} speed={0.2} className="opacity-12" />
      <Meteors number={8} />

      {/* Technical Background Grid - uses global CSS variable */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#fcfcfb] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-12 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,rgba(252,252,251,0.92)_100%)] pointer-events-none" />
      <SectionEdgeAccents flip railLabel="SHOWCASE" className="opacity-75" />

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
              style={{
                paddingInline: mobileCarouselInset,
                scrollPaddingInline: mobileCarouselInset,
              }}
            >
              {projectsList.map((project, index) => renderMobileProjectCard(project, index))}
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
      </div>

        <div dir="ltr" className="relative z-20 mx-auto hidden w-[min(92vw,95rem)] xl:block">
          <div className="absolute right-0 top-1/2 z-20 flex translate-x-1/2 -translate-y-1/2 flex-col gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-[#272a31] bg-[linear-gradient(180deg,#363940_0%,#17191e_100%)] shadow-[0_12px_22px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.34)] transition-all duration-200 ${canScrollLeft ? "opacity-100 hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#3b3f47_0%,#1b1d22_100%)] hover:shadow-[0_16px_26px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.32)]" : "pointer-events-none scale-95 opacity-35"}`}
              aria-label="Scroll portfolio left"
              disabled={!canScrollLeft}
            >
              <span className="pointer-events-none absolute inset-[2px] rounded-[0.78rem] border border-white/6" />
              <CarouselArrow direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-[0.9rem] border border-[#272a31] bg-[linear-gradient(180deg,#363940_0%,#17191e_100%)] shadow-[0_12px_22px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_1px_rgba(0,0,0,0.34)] transition-all duration-200 ${canScrollRight ? "opacity-100 hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#3b3f47_0%,#1b1d22_100%)] hover:shadow-[0_16px_26px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.32)]" : "pointer-events-none scale-95 opacity-35"}`}
              aria-label="Scroll portfolio right"
              disabled={!canScrollRight}
            >
              <span className="pointer-events-none absolute inset-[2px] rounded-[0.78rem] border border-white/6" />
              <CarouselArrow direction="right" />
            </button>
          </div>

          <div className="mx-auto px-10 2xl:px-14">
            <div className="mx-auto">
              <div className="group/macbook relative rounded-[2rem] bg-[linear-gradient(180deg,#202124_0%,#17181b_100%)] p-3 shadow-[0_38px_90px_rgba(0,0,0,0.2)] ring-1 ring-black/10">
                <div className="absolute left-1/2 top-2.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-700 shadow-[0_0_0_2px_rgba(255,255,255,0.03)]" />
                <div className="relative aspect-[1905/855] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0f1012] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="absolute left-4 top-4 z-20 flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/macbook:-translate-x-2 group-hover/macbook:opacity-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="absolute right-4 top-3.5 z-20 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">
                    {String(desktopIndex + 1).padStart(2, "0")} / {String(projectsList.length).padStart(2, "0")}
                  </div>
                  <div
                    ref={carouselRef}
                    dir="ltr"
                    className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {projectsList.map((project, index) => renderDesktopShowcaseSlide(project, index))}
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-[-2.75rem] right-[-1.5rem] z-30 w-[24%] max-w-[250px] min-w-[180px] rotate-[-4deg] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/macbook:-translate-y-1">
                  <div className="relative mx-auto aspect-[9/19] rounded-[2.65rem] bg-[#121214] p-[6px] shadow-[0_30px_80px_rgba(0,0,0,0.24)] ring-1 ring-black/18">
                    <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#17181b] shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]" />
                    <div className="relative h-full overflow-hidden rounded-[2.3rem] bg-[#0d0d0f]">
                      {projectsList.map((project, index) => (
                        <Image
                          key={`${project.title}-desktop-mobile-preview`}
                          src={project.mobileImage}
                          alt={`${project.title} mobile preview`}
                          fill
                          sizes="240px"
                          loading={index <= 2 ? "eager" : "lazy"}
                          className={`object-cover transition-opacity duration-300 ${index === desktopIndex ? "opacity-100" : "opacity-0"}`}
                        />
                      ))}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_20%,rgba(0,0,0,0.08)_100%)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto h-4 w-[18%] rounded-b-[999px] bg-[linear-gradient(180deg,#d2d4d9_0%,#b2b6be_100%)] shadow-[0_10px_16px_rgba(0,0,0,0.08)]" />
              <div className="mx-auto h-4 w-[58%] rounded-b-[1.4rem] bg-[linear-gradient(180deg,#dfe2e8_0%,#c3c8d0_100%)] shadow-[0_18px_32px_rgba(0,0,0,0.08)]" />
            </div>
          </div>
        </div>
    </section>
  );
}
