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
  title: {
    default: "Pulse AI — AI-Native News for Technology, AI & Science",
    template: "%s | Pulse AI",
  },
  description:
    "Premium AI-generated journalism covering the frontiers of technology, artificial intelligence, and science. In-depth analysis, breaking news, and expert insights.",
  openGraph: {
    title: "Pulse AI — AI-Native News",
    description:
      "Premium AI-generated journalism covering technology, AI & science.",
    type: "website",
    locale: "en_US",
    siteName: "Pulse AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI",
    description:
      "Premium AI-generated journalism covering technology, AI & science.",
  },
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
