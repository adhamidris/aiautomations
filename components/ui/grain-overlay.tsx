"use client";

export const GrainOverlay = () => {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-05 mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.4" />
        </svg>
      </div>
    </>
  );
};
