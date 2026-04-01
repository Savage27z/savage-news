import type { Article } from "@/lib/supabase/types";
import { ArticleCard } from "../articles/ArticleCard";
import { Zap, Info } from "lucide-react";
import Link from "next/link";

interface DigestSidebarProps {
  articles: Article[];
}

export function DigestSidebar({ articles }: DigestSidebarProps) {
  return (
    <aside className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-accent" />
          <h2 className="font-mono text-xs uppercase tracking-widest font-medium">
            Today&apos;s Brief
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="divide-y divide-border">
            {articles.slice(0, 5).map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-accent" />
          <h3 className="font-mono text-xs uppercase tracking-widest font-medium">
            About Pulse AI
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Pulse AI is an AI-native newsroom delivering in-depth coverage of technology,
          artificial intelligence, and science. Every article is generated through our
          multi-step editorial pipeline.
        </p>
        <Link
          href="/about"
          className="text-sm font-medium text-accent hover:underline"
        >
          Learn more →
        </Link>
      </div>
    </aside>
  );
}
