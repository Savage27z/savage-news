import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/supabase/types";

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9] md:aspect-[21/9]">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-14">
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span
                className="font-mono text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: article.category.color || "#E11D48",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
            )}
            {article.reading_time && (
              <span className="font-mono text-xs text-white/70">
                {article.reading_time} min read
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white max-w-4xl text-balance">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="mt-3 text-base md:text-lg text-white/80 max-w-2xl line-clamp-2">
              {article.subtitle}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">
            <span className="text-sm font-medium text-white/90 group-hover:text-accent transition-colors">
              Read Article →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
