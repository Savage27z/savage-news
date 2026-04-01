import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";
import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Calendar } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Today's Brief",
  description: "A scannable summary of today's top technology, AI, and science stories from Pulse AI.",
};

async function getDigestArticles() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayArticles } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .gte("published_at", today.toISOString())
    .order("published_at", { ascending: false })
    .limit(8);

  if (todayArticles && todayArticles.length > 0) {
    return { articles: todayArticles as Article[], isToday: true };
  }

  const { data: recent } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(8);

  return { articles: (recent || []) as Article[], isToday: false };
}

export default async function DigestPage() {
  const { articles, isToday } = await getDigestArticles();

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-accent" />
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
            Daily Digest
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Today&apos;s Brief
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time className="text-sm">{todayFormatted}</time>
        </div>

        {!isToday && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              No new articles today yet. Here are the most recent stories from our newsroom.
            </p>
          </div>
        )}
      </header>

      <div className="border-l-2 border-accent/20 pl-6 space-y-0">
        {articles.map((article, i) => (
          <div
            key={article.id}
            className="relative pb-8 last:pb-0 group"
          >
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-background group-hover:bg-accent transition-colors" />

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
              <span className="font-mono text-[10px] text-muted-foreground">
                #{i + 1}
              </span>
            </div>

            <Link
              href={`/article/${article.slug}`}
              className="block group/link"
            >
              <h2 className="font-serif text-xl font-semibold leading-snug mb-2 group-hover/link:text-accent transition-colors">
                {article.title}
              </h2>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {article.summary}
            </p>

            <Link
              href={`/article/${article.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              Read full article <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20">
          <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-serif text-2xl text-muted-foreground mb-2">
            No articles available
          </p>
          <p className="text-sm text-muted-foreground">
            Our AI pipeline is working on fresh content. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
