import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://autom8ed.space"),
  title: {
    default: "AUTOM8ED | Web Development & AI Solutions",
    template: "%s | AUTOM8ED",
  },
  description:
    "Specializing in Web Development, SaaS & MVPs, AI Integrations, RAG as a Service, and Hosting Management.",
  keywords: [
    "Web Development",
    "SaaS & MVPs",
    "AI Integration",
    "RAG as a Service",
    "RAG",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
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
    description:
      "Specializing in Web Development, SaaS & MVPs, AI Integrations, RAG as a Service, and Hosting Management.",
    siteName: "AUTOM8ED",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUTOM8ED | Web Development & AI Solutions",
    description:
      "Specializing in Web Development, SaaS & MVPs, AI Integrations, RAG as a Service, and Hosting Management.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-180x180.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#0B0B0B",
      },
    ],
  },
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  )
}
