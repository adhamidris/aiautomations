"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Meteors } from "@/components/ui/meteors";

const testimonials = [
  {
    quote: "The automation reduced our operational overhead by 40% within the first quarter. It's not just a tool; it's a fundamental shift in how we operate.",
    name: "Alex V.",
    title: "CTO, FinTech Systems",
  },
  {
    quote: "We replaced three legacy workflow engines with a single Joe Automation pipeline. The efficiency gains are mathematically impossible to ignore.",
    name: "Sarah Chen",
    title: "VP of Engineering, Nexus AI",
  },
  {
    quote: "Scalability was our bottleneck. Now it's our competitive advantage. The system handles 10x our previous load without a single hiccup.",
    name: "Marcus R.",
    title: "Director of Ops, ScaleUp Inc.",
  },
  {
    quote: "A masterclass in process architecture. It feels less like software and more like a high-performance engine for our business logic.",
    name: "Dr. Elena K.",
    title: "Founder, DataFlow Dynamics",
  },
  {
    quote: "I've reviewed dozens of automation platforms. This is the only one that feels built for serious, high-velocity engineering teams.",
    name: "James L.",
    title: "Principal Architect, CloudNative",
  },
];

export const Testimonials = ({
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        getDirection();
        getSpeed();
        setStart(true);
      }
    }

    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty("--animation-direction", "forwards");
        } else {
          containerRef.current.style.setProperty("--animation-direction", "reverse");
        }
      }
    };

    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };

    addAnimation();
  }, [direction, speed]);

  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-black">
      
      <Meteors number={12} />

      {/* Top Fade Blend */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-zinc-950 to-black z-10 pointer-events-none" />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-white/[0.02] blur-[100px] rounded-full pointer-events-none z-0" />
      
      {/* Bottom Fade Blend */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-950 to-black z-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 mb-16 text-center">
            <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                [ TRUSTED BY INDUSTRY LEADERS ]
            </h2>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 max-w-8xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] opacity-0 transition-opacity duration-1000",
          start && "opacity-100",
          className
        )}
      >
        <div
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 gap-12 py-4 w-max flex-nowrap",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
        >
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="relative w-[400px] max-w-full flex-shrink-0 py-4 md:w-[500px]"
            >
                {/* Tech Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                <blockquote className="relative z-20 pl-10">
                    <p className="font-heading text-xl md:text-2xl leading-[1.4] text-white font-normal mb-6 tracking-tight">
                    &quot;{item.quote}&quot;
                    </p>
                    <div className="relative z-20 flex flex-col items-start">
                        <span className="font-mono text-sm text-zinc-300 font-bold uppercase tracking-wider">
                            {item.name}
                        </span>
                        <span className="font-mono text-xs text-zinc-500 mt-1">
                            {item.title}
                        </span>
                    </div>
                </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
