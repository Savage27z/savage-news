import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pulse-ai-news.vercel.app"
  ),
  title: {
    default: "Pulse AI — AI-Native News for Technology, AI & Science",
    template: "%s | Pulse AI",
  },
  description:
    "AI-powered journalism covering technology, artificial intelligence, and science. Every article researched and written through our automated editorial pipeline.",
  openGraph: {
    type: "website",
    siteName: "Pulse AI",
    locale: "en_US",
    title: "Pulse AI — AI-Native News",
    description:
      "AI-powered journalism covering technology, artificial intelligence, and science.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI",
    description:
      "AI-powered journalism covering technology, AI & science.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
