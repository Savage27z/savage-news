"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/ai", label: "AI" },
  { href: "/category/technology", label: "Technology" },
  { href: "/category/science", label: "Science" },
  { href: "/category/business", label: "Business" },
  { href: "/category/analysis", label: "Analysis" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-background p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-0.5"
            >
              <span className="font-serif text-xl font-bold tracking-tight">PULSE</span>
              <span className="font-mono text-sm font-semibold text-accent">AI</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-6 py-4 border-t border-border">
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About Pulse AI
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
