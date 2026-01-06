import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

import { MouseGlow } from "@/components/ui/mouse-glow";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { StickyNav } from "@/components/ui/sticky-nav";
import { ThemeProvider } from "@/components/theme-provider";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL("https://autom8ed.netlify.app"),
  title: {
    default: "Automate Your Growth | Marketing Automation Expert",
    template: "%s | Automate Your Growth",
  },
  description: "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autom8ed.netlify.app",
    title: "Automate Your Growth | Marketing Automation Expert",
    description: "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
    siteName: "Automate Your Growth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Automate Your Growth | Marketing Automation Expert",
    description: "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MouseGlow />
          <GrainOverlay />
          <StickyNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
