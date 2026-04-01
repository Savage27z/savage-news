import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/article/${article.slug}`} className="group block py-3">
        <div className="flex items-start gap-3">
          {article.category && (
            <span
              className="shrink-0 mt-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: article.category.color || "#E11D48" }}
            />
          )}
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {article.category && (
                <span className="font-mono uppercase tracking-wider">
                  {article.category.name}
                </span>
              )}
              <span>·</span>
              {article.published_at && <span>{formatDate(article.published_at)}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="flex gap-4 items-start">
          {article.image_url && (
            <div className="relative shrink-0 w-32 h-24 md:w-48 md:h-32 rounded-lg overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {article.category && (
                <span
                  className="font-mono text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: article.category.color || "#E11D48",
                    color: "#fff",
                  }}
                >
                  {article.category.name}
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {article.published_at && <span>{formatDate(article.published_at)}</span>}
              {article.reading_time && (
                <>
                  <span>·</span>
                  <span>{article.reading_time} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg">
        {article.image_url && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {article.category && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: article.category.color || "#E11D48",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
            )}
            {article.reading_time && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {article.reading_time} min read
              </span>
            )}
          </div>
          <h3 className="font-serif text-xl font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
