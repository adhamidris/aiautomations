"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface MeteorStyle {
  top: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteorStyles, setMeteorStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    const styles = new Array(number).fill(true).map(() => ({
      top: -5,
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * (1 - 0.2) + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * (8 - 3) + 3) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-white/30 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] pointer-events-none",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-l before:from-transparent before:to-white/10 before:-translate-x-[50%]",
            className
          )}
          style={{
            top: -5,
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
          }}
        ></span>
      ))}
    </>
  );
};
