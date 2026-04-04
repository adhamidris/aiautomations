"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function getActiveSectionId() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

  if (!sections.length) {
    return "";
  }

  const viewportCenter = window.innerHeight / 2;
  let bestId = "";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);

    if (rect.bottom > 0 && rect.top < window.innerHeight && distance < bestDistance) {
      bestDistance = distance;
      bestId = section.id;
    }
  }

  return bestId;
}

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = pathname?.startsWith("/ar") ? "ar" : "en";
  const nextLang = currentLang === "en" ? "ar" : "en";

  const pathWithoutLocale = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const queryString = searchParams.toString();
  const baseHref = `/${nextLang}${pathWithoutLocale}${queryString ? `?${queryString}` : ""}`;

  const handleSwitch = useCallback(() => {
    const activeSectionId = getActiveSectionId();
    const fallbackHash = window.location.hash.replace(/^#/, "");
    const targetHash = activeSectionId || fallbackHash;
    const nextHref = targetHash ? `${baseHref}#${targetHash}` : baseHref;

    router.push(nextHref, { scroll: false });
  }, [baseHref, router]);

  return (
    <button
      type="button"
      onClick={handleSwitch}
      aria-label={`Switch language to ${nextLang === "ar" ? "Arabic" : "English"}`}
      className="inline-flex items-center justify-center rounded-full px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold tracking-wider text-foreground transition-colors hover:bg-zinc-100"
    >
      {nextLang.toUpperCase()}
    </button>
  );
}
