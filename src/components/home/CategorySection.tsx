import Link from "next/link";
import type { Article, Category } from "@/lib/supabase/types";
import { ArticleCard } from "../articles/ArticleCard";
import { ChevronRight } from "lucide-react";

interface CategorySectionProps {
  category: Category;
  articles: Article[];
}

export function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color || "#E11D48" }}
          />
          <h2 className="font-serif text-2xl font-bold">{category.name}</h2>
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
        {articles.slice(0, 4).map((article) => (
          <div key={article.id} className="min-w-[300px] max-w-[350px] shrink-0">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
