import { Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full bg-black pt-0 md:pt-24 pb-12">
      {/* Upward Fade to Blend with Contact Section */}
      <div className="absolute top-0 left-0 right-0 h-32 -translate-y-full bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        <div className="relative pt-12 flex flex-col items-center justify-center gap-8">
            
            {/* Social Icons */}
            <div className="flex items-center gap-6 md:gap-8 mb-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                    <Linkedin className="w-6 h-6 md:w-8 md:h-8" />
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                    <Twitter className="w-6 h-6 md:w-8 md:h-8" />
                </a>
                <a 
                  href="https://www.instagram.com/autom8ed_solutions?igsh=MW9rejgwcTV6cnBjeA%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                >
                    <Instagram className="w-6 h-6 md:w-8 md:h-8" />
                </a>
            </div>

            {/* Massive Brand Watermark */}
            <h1 className="font-heading font-black text-[15vw] md:text-[12vw] leading-none text-white select-none pointer-events-none opacity-100">
                AUTOM8ED
            </h1>
        </div>
      </div>
    </footer>
  );
}
