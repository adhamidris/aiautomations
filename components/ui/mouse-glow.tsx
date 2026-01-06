"use client";

import React, { useEffect, useState } from "react";

export const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <>
      {/* Desktop: Follows Mouse */}
      <div
        className="hidden md:block pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03), transparent 80%)`,
        }}
      />
      
      {/* Mobile: Static Ambient Breath */}
      <div 
        className="md:hidden pointer-events-none fixed inset-0 z-30 animate-breathing"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02), transparent 70%)`,
        }}
      />
    </>
  );
};
