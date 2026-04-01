import Link from "next/link";
import {
  Rss,
  TrendingUp,
  Search,
  BookOpen,
  PenTool,
  CheckCircle,
  Globe,
} from "lucide-react";

const categories = [
  { href: "/category/ai", label: "AI" },
  { href: "/category/technology", label: "Technology" },
  { href: "/category/science", label: "Science" },
  { href: "/category/business", label: "Business" },
  { href: "/category/analysis", label: "Analysis" },
];

const pipelineSteps = [
  { icon: Rss, label: "RSS Feeds", sublabel: "15+ sources" },
  { icon: TrendingUp, label: "Trends", sublabel: "Virlo social signals" },
  { icon: Search, label: "Discovery", sublabel: "AI topic selection" },
  { icon: BookOpen, label: "Research", sublabel: "Multi-source" },
  { icon: PenTool, label: "Writing", sublabel: "Claude-authored" },
  { icon: CheckCircle, label: "Review", sublabel: "Editorial QA" },
  { icon: Globe, label: "Published", sublabel: "Live on site" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="font-serif text-xl font-bold mb-2">How Every Article Is Made</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Every article on Pulse AI is produced by our AI editorial pipeline — from source
              discovery to publication, fully automated.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-start gap-2 md:gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 px-2 md:px-3 min-w-[72px]">
                  <div className="p-2 rounded-lg bg-muted">
                    <step.icon className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-[11px] font-medium text-center leading-tight">
                    {step.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground text-center leading-tight">
                    {step.sublabel}
                  </span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <span className="text-muted-foreground/30 text-lg hidden md:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-baseline gap-0.5 mb-4">
              <span className="font-serif text-2xl font-bold tracking-tight">PULSE</span>
              <span className="font-mono text-sm font-semibold text-accent">AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              AI-native journalism covering the frontiers of technology, artificial intelligence,
              and science. Every article is researched, written, and fact-checked through our
              multi-step editorial AI pipeline.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest font-medium text-muted-foreground mb-4">
              Categories
            </h3>
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest font-medium text-muted-foreground mb-4">
              Company
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/digest"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Daily Digest
              </Link>
              <Link
                href="/search"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Search
              </Link>
              <Link
                href="#"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pulse AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Powered by AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
