import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-heading text-xl font-bold tracking-tighter text-white">
          AUTOM<span className="text-accent">8ED</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            Services
          </Link>
          <Link href="#process" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            Process
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-white">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Client Login
          </Button>
          <Link href="#contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white/90 text-black border border-white hover:bg-white h-9 rounded-md px-3">
            Book Audit
          </Link>
        </div>
      </div>
    </header>
  )
}
