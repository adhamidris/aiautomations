import { cn } from "@/lib/utils";

interface SectionEdgeAccentsProps {
  className?: string;
  flip?: boolean;
  rail?: boolean;
  railLabel?: string;
}

export function SectionEdgeAccents({
  className,
  flip = false,
  rail = true,
  railLabel = "SYSTEM",
}: SectionEdgeAccentsProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 hidden overflow-hidden md:block", className)}>
      <div
        className={cn(
          "absolute top-16 h-72 w-72 opacity-[0.15] motion-safe:animate-edge-float",
          flip ? "right-[-8rem]" : "left-[-8rem]"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.14)_0.7px,transparent_1.2px)] bg-[size:10px_10px] [mask-image:radial-gradient(circle,black_18%,rgba(0,0,0,0.85)_38%,transparent_74%)]" />
      </div>

      <div
        className={cn(
          "absolute bottom-24 h-48 w-48 opacity-[0.08] motion-safe:animate-edge-float-delayed",
          flip ? "left-[-5rem]" : "right-[-5rem]"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12)_0.7px,transparent_1.15px)] bg-[size:9px_9px] [mask-image:radial-gradient(circle,black_14%,rgba(0,0,0,0.72)_38%,transparent_72%)]" />
      </div>

      {rail ? (
        <div
          className={cn(
            "absolute inset-y-14 flex items-center gap-3 opacity-70",
            flip ? "left-6 flex-row-reverse" : "right-6"
          )}
        >
          <div className="relative h-full w-px bg-gradient-to-b from-transparent via-black/10 to-transparent">
            <span className="absolute left-1/2 top-[18%] h-2 w-2 -translate-x-1/2 rounded-full border border-black/10 bg-background shadow-[0_0_0_4px_rgba(255,255,255,0.86)]" />
            <span className="absolute left-1/2 top-[58%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/18" />
          </div>
          <span className="origin-center rotate-180 text-[10px] font-mono uppercase tracking-[0.32em] text-black/26 [writing-mode:vertical-rl]">
            {railLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
