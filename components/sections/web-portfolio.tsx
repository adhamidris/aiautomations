"use client";

import { StarField } from "@/components/ui/star-field";
import { ArrowUpRight, Smartphone, Monitor } from "lucide-react";

export function WebPortfolio() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-black overflow-hidden">
      
      {/* Star Field Background */}
      <StarField density={800} speed={0.2} className="opacity-10" />
      
      {/* Radial Gradient for depth (optional, based on screenshot which is purely black/starry but implied depth) */}


      {/* Top Fade */}



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-8 text-center w-full">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-zinc-300 underline decoration-zinc-400/30 underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              Selected Work
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Crafting Digital Experiences.
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mx-auto">
              We build immersive, high-performance web applications that drive growth. 
              Here is a glimpse of our latest work in action.
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Optional: Navigation buttons or indicators could go here */}
          </div>
        </div>

        {/* Project Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Desktop Preview (Large) - Hidden on Mobile */}
          <div className="hidden md:block lg:col-span-8 relative group">
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-zinc-900/50 shadow-2xl shadow-black/50 aspect-video group-hover:border-white/20 transition-colors duration-500">
               {/* Video Placeholder - Replace src with actual video */}
               <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500">
                  <div className="text-center">
                    <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span className="text-sm font-mono uppercase tracking-wider">Desktop Preview</span>
                  </div>
                  {/* <video 
                      ref={videoRef}
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      src="/path/to/desktop-video.mp4" 
                   /> */}
               </div>
               
               {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
                  <div>
                    <h4 className="text-white font-bold text-xl">E-Commerce Platform</h4>
                    <p className="text-zinc-400 text-sm">Next.js • Shopify • Tailwind</p>
                  </div>
                  <button className="bg-white text-zinc-900 p-3 rounded-full hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
            </div>
          </div>

           {/* Mobile Preview (Vertical) - Visible on Mobile Only (or side by side on large desktop if desired, but request asked for mobile preview on mobile screens) 
              Actually, the request says: "for mobile the video will be mobile preview...". 
              To satisfy "video should fit across desktop screens" vs "mobile preview on mobile screens", 
              we can switch visibility based on breakpoint.
           */}
           
           <div className="block md:hidden relative">
              <div className="relative rounded-[2rem] overflow-hidden border-[8px] border-zinc-900 shadow-2xl aspect-[9/19] mx-auto max-w-[300px] bg-zinc-950">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-900 rounded-b-xl z-20"></div>

                 {/* Video Placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span className="text-xs font-mono uppercase tracking-wider">Mobile Preview</span>
                    </div>
                     {/* <video 
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                        src="/path/to/mobile-video.mp4" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                     /> */}
                 </div>

                 {/* Mobile Overlay */}
                 <div className="absolute bottom-6 left-4 right-4 p-4 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <div>
                         <h4 className="text-white font-bold text-sm">Finance App</h4>
                         <p className="text-zinc-400 text-xs">PWA • React</p>
                      </div>
                       <button className="bg-white/10 text-white p-2 rounded-full">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Description / Content Side (Desktop Only Layout Adjustment) 
               Since the desktop video takes 8 cols, we have 4 cols left. We can put some stats or details here.
           */}
           <div className="hidden lg:flex lg:col-span-4 flex-col justify-center h-full pl-8 border-l border-white/5">
              <div className="mb-8">
                 <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-mono mb-2">Client</h4>
                 <p className="text-white text-xl font-semibold">FinTech Global</p>
              </div>
              <div className="mb-8">
                 <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-mono mb-2">Challenge</h4>
                 <p className="text-zinc-300">
                    Build a real-time trading dashboard with sub-millisecond latency and mobile-first responsiveness.
                 </p>
              </div>
              <div className="mb-8">
                <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-mono mb-2">Outcome</h4>
                <div className="flex gap-4">
                  <div>
                    <span className="block text-3xl font-bold text-white">40%</span>
                    <span className="text-zinc-500 text-sm">Faster Load</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-bold text-white">2x</span>
                    <span className="text-zinc-500 text-sm">User Retention</span>
                  </div>
                </div>
              </div>
              
              <button className="group flex items-center gap-2 text-white font-medium hover:text-zinc-300 transition-colors">
                View Case Study 
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
           </div>
           
        </div>
        
        {/* Mobile Info (Shown below video on mobile) */}
         <div className="md:hidden mt-12 grid grid-cols-1 gap-8">
             <div>
                 <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-mono mb-2">Client</h4>
                 <p className="text-white text-lg font-semibold">FinTech Global</p>
              </div>
              <div>
                 <h4 className="text-zinc-400 text-sm uppercase tracking-wider font-mono mb-2">Challenge</h4>
                 <p className="text-zinc-300">
                    Build a real-time trading dashboard with sub-millisecond latency.
                 </p>
              </div>
              <button className="w-full py-4 border border-white/10 rounded-lg text-white font-medium hover:bg-white/5 transition-colors">
                 View Case Study
              </button>
         </div>

      </div>
    </section>
  );
}
