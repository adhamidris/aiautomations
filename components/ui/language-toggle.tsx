"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function LanguageToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = pathname?.startsWith("/ar") ? "ar" : "en";
  const nextLang = currentLang === "en" ? "ar" : "en";

  const pathWithoutLocale = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
  const queryString = searchParams.toString();
  const href = `/${nextLang}${pathWithoutLocale}${queryString ? `?${queryString}` : ""}`;

  return (
    <Link
      href={href}
      aria-label={`Switch language to ${nextLang === "ar" ? "Arabic" : "English"}`}
      className="inline-flex items-center justify-center rounded-full px-2.5 py-1.5 font-mono text-[10px] md:text-xs font-semibold tracking-wider text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {nextLang.toUpperCase()}
    </Link>
  );
}
