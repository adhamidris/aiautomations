export function Footer() {
  return (
    <footer className="relative w-full bg-black pt-0 md:pt-24 pb-12">
      {/* Upward Fade to Blend with Contact Section */}
      <div className="absolute top-0 left-0 right-0 h-32 -translate-y-full bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Bottom Section: Big Typography */}
        <div className="relative pt-12 flex flex-col md:flex-row justify-center items-end gap-8">
            
            {/* Massive Brand Watermark */}
            <h1 className="font-heading font-black text-[15vw] md:text-[12vw] leading-none text-white select-none pointer-events-none opacity-100">
                AUTOM8ED
            </h1>
        </div>
      </div>
    </footer>
  );
}
