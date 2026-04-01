import Link from "next/link";

const categories = [
  { href: "/category/ai", label: "AI" },
  { href: "/category/technology", label: "Technology" },
  { href: "/category/science", label: "Science" },
  { href: "/category/business", label: "Business" },
  { href: "/category/analysis", label: "Analysis" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
                href="#"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Contact
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
