import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});


import { GrainOverlay } from "@/components/ui/grain-overlay";
import { StickyNav } from "@/components/ui/sticky-nav";
import { ThemeProvider } from "@/components/theme-provider";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL("https://autom8ed.space"),
  title: {
    default: "AUTOM8ED | Web Development & AI Solutions",
    template: "%s | AUTOM8ED",
  },
  description: "Specializing in Web Development, SaaS Building, AI Integrations, Fine-tuning, and RAG Solutions.",
  keywords: [
    "Web Development", 
    "SaaS Building",
    "AI Integration", 
    "LLM Fine-tuning",
    "RAG", 
    "Next.js", 
    "React", 
    "TypeScript", 
    "Tailwind CSS"
  ],
  authors: [{ name: "Adham" }],
  creator: "Adham",
  alternates: {
    canonical: "https://autom8ed.space",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autom8ed.space",
    title: "AUTOM8ED | Web Development & AI Solutions",
    description: "Specializing in Web Development, SaaS Building, AI Integrations, Fine-tuning, and RAG Solutions.",
    siteName: "AUTOM8ED",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUTOM8ED | Web Development & AI Solutions",
    description: "Specializing in Web Development, SaaS Building, AI Integrations, Fine-tuning, and RAG Solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-180x180.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#0B0B0B"
      }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <JsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >


          <GrainOverlay />
          <StickyNav />
          {children}
        </ThemeProvider>
        <AnalyticsWrapper gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
