import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "World Cup 2026 — Live Dashboard",
  description:
    "Live scores, fixtures, standings, stats and fantasy predictor for the FIFA World Cup.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "WorldCup26" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#022c22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[rgb(var(--bg))]">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-6 animate-fade-in">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
