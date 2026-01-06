import React, { useRef, useState, useEffect } from "react";

import { PartnerCard } from "@/components/ui/partner-card";
import { Meteors } from "@/components/ui/meteors";
import { BrandIcons } from "@/components/ui/brand-icons";


const PremiumBullet = () => (
    <span className="inline-flex items-center justify-center w-5 h-5 mr-2 shrink-0 mt-0.5 md:mt-1">
        <svg  width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-white">
            <rect x="3.5" y="0.5" width="1" height="7" fill="currentColor"/>
            <rect x="0.5" y="3.5" width="7" height="1" fill="currentColor"/>
        </svg>
    </span>
);


const PARTNERS = [
  {
    id: "meta",
    name: "Social Media Management",
    icon: <BrandIcons.Meta className="w-8 h-8 text-white" />,
    category: "Social Media",
    description: (
      <span className="flex flex-col gap-1">
        <span className="flex items-start"><PremiumBullet /> Content creation & scheduling.</span>
        <span className="flex items-start"><PremiumBullet /> Ads management & analytics.</span>
        <span className="flex items-start"><PremiumBullet /> AI Customers Communications.</span>
      </span>
    ),
  },
  {
    id: "google",
    name: "Google Sheets",
    icon: <BrandIcons.Google className="w-8 h-8 text-white" />,
    category: "Data",
    description: (
      <span className="flex flex-col gap-1">
        <span className="flex items-start"><PremiumBullet /> Integrate AI into your sheets.</span>
        <span className="flex items-start"><PremiumBullet /> Automated sheet data-based actions.</span>
        <span className="flex items-start"><PremiumBullet /> Data Analysis and reporting.</span>
      </span>
    ),
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: <BrandIcons.Whatsapp className="w-8 h-8 text-white" />,
    category: "Communication",
    description: (
      <span className="flex flex-col gap-1">
        <span className="flex items-start"><PremiumBullet /> Automated customer support.</span>
        <span className="flex items-start"><PremiumBullet /> Instant order notifications.</span>
        <span className="flex items-start"><PremiumBullet /> 24/7 AI chatbots.</span>
      </span>
    ),
  },
   {
    id: "wordpress",
    name: "WordPress",
    icon: <BrandIcons.Wordpress className="w-8 h-8 text-white" />,
    category: "CMS",
    description: (
      <span className="flex flex-col gap-1">
        <span className="flex items-start"><PremiumBullet /> Automated content & blog publishing.</span>
        <span className="flex items-start"><PremiumBullet /> SEO metadata & schema optimization.</span>
      </span>
    ),
  },
  {
    id: "research",
    name: "Research & Insights",
    icon: <BrandIcons.MarketResearch className="w-8 h-8 text-white" />,
    category: "Data",
    description: (
       <span className="flex flex-col gap-1">
        <span className="flex items-start"><PremiumBullet /> Frequency-based insights generation.</span>
        <span className="flex items-start"><PremiumBullet /> AI-driven market research.</span>
        <span className="flex items-start"><PremiumBullet /> Competitive analysis & trends.</span>
      </span>
    ),
  },

];

export const EcosystemGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <section className="relative w-full py-24 md:py-32 bg-transparent overflow-hidden" ref={containerRef}>
            <Meteors number={12} />
            {/* Dark Technical Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#000000_100%)] pointer-events-none" />
             
             {/* Bottom Fade for Smooth Transition */}
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-0 pointer-events-none" />


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                     <h2 className="text-white/70 underline decoration-zinc-400/30 underline-offset-4 decoration-1 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                        Automations
                     </h2>
                     <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Say No to Repeated Tasks<br/>
                        <TypewriterText />
                     </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                     {PARTNERS.map((partner) => (
                        <PartnerCard key={partner.id} {...partner} className="h-full" />
                     ))}
                     
                     {/* Custom CTA Card */}
                     <div className="flex flex-col items-center justify-center text-center h-full min-h-[220px] p-8">
                        <h3 className="text-xl font-heading text-white mb-6">
                            Have another operation you would like automated?
                        </h3>
                        <a href="#contact" className="group inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300">
                            <span className="text-sm font-mono uppercase tracking-widest">TELL US MORE</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </a>
                     </div>
                </div>
            </div>
        </section>
    );
};

const TypewriterText = () => {
    const textToType = "Automate Everything.";
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            setText(prev => isDeleting 
                ? textToType.substring(0, prev.length - 1) 
                : textToType.substring(0, prev.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 100);

            if (!isDeleting && text === textToType) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setTypingSpeed(500); // Pause before start
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, typingSpeed, textToType]);

    return (
        <span className="block mt-2 min-h-[1.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white">
            {text}
        </span>
    );
};
