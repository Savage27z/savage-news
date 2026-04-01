import Link from "next/link";
import type { Category } from "@/lib/supabase/types";
import { TrendingUp } from "lucide-react";

interface TrendingBarProps {
  categories: Category[];
}

export function TrendingBar({ categories }: TrendingBarProps) {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Trending
            </span>
          </div>
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="shrink-0 font-mono text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
