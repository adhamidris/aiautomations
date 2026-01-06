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

export const metadata: Metadata = {
  title: "Automate Your Growth | Marketing Automation Expert",
  description: "Specializing in HubSpot, n8n, Zapier, Make, and Salesforce automation.",
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
