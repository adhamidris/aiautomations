"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StarFieldProps {
  className?: string;
  speed?: number; // Speed factor
  density?: number; // Number of stars
}

export const StarField = ({ className, speed = 0.5, density = 400 }: StarFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Resize observer to handle window resizes
    const resizeValues = () => {
       width = window.innerWidth;
       height = window.innerHeight;
       // Set actual canvas size to match display size for crisp rendering on high DPI
       const dpr = window.devicePixelRatio || 1;
       canvas.width = width * dpr;
       canvas.height = height * dpr;
       ctx.scale(dpr, dpr);
       
       // Handle style width/height
       canvas.style.width = `${width}px`;
       canvas.style.height = `${height}px`;
    }
    
    window.addEventListener("resize", resizeValues);
    resizeValues();

    // Star initialization
    const stars: { x: number; y: number; opacity: number; speed: number; size: number }[] = [];
    
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        opacity: Math.random(),
        speed: (Math.random() * 0.5 + 0.1) * speed,
        size: Math.random() * 1.5 + 0.5, // 0.5 to 2px
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach((star) => {
        // Update position (slow drift upwards/sideways or just random)
        // Let's do a slow drift to the right and slightly up/down
        // Actually, user said "animated slowly". 
        // Let's make them twinkle and drift very slowly.
        
        star.y -= star.speed; 
        if (star.y < 0) {
           star.y = height;
           star.x = Math.random() * width;
        }

        // Draw star
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        if (star.opacity > 1) star.opacity = 1;
        if (star.opacity < 0.2) star.opacity = 0.2;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeValues);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 h-full w-full pointer-events-none opacity-40 mix-blend-screen", className)}
    />
  );
};
