export function Footer() {
  return (
    <footer className="border-t border-muted bg-background py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-bold text-foreground">JOE.AUTOMATION</span>. 
            The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  )
}
