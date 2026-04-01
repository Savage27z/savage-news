import type { Article } from "@/lib/supabase/types";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  variant?: "default" | "compact" | "horizontal";
}

export function ArticleGrid({ articles, variant = "default" }: ArticleGridProps) {
  if (variant === "compact") {
    return (
      <div className="divide-y divide-border">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
