import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/supabase/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { SourceAttribution } from "@/components/articles/SourceAttribution";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import { ArticleChat } from "@/components/chat/ArticleChat";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Article | null;
}

async function getRelatedArticles(article: Article) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", article.category_id)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3);

  let articles = (data || []) as Article[];

  if (articles.length < 3) {
    const { data: more } = await supabase
      .from("articles")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .neq("id", article.id)
      .not("id", "in", `(${articles.map((a) => a.id).join(",")})`)
      .order("published_at", { ascending: false })
      .limit(3 - articles.length);
    articles = [...articles, ...((more || []) as Article[])];
  }

  return articles;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.published_at || undefined,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.image_url,
    datePublished: article.published_at,
    publisher: { "@type": "Organization", name: "Pulse AI" },
    author: { "@type": "Organization", name: "Pulse AI Editorial" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {article.category && (
            <>
              <Link
                href={`/category/${article.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {article.category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-foreground/50 truncate max-w-[200px]">{article.title}</span>
        </nav>

        <header className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center gap-3 mb-5">
            {article.category && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: article.category.color || "#E11D48",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
            )}
            {article.reading_time && (
              <span className="font-mono text-xs text-muted-foreground">
                {article.reading_time} min read
              </span>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 text-balance">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
            <span>·</span>
            <span>By Pulse AI Editorial</span>
          </div>
        </header>

        {article.image_url && (
          <figure className="max-w-4xl mx-auto mb-10">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
            {article.image_caption && (
              <figcaption className="mt-3 text-sm text-center text-muted-foreground">
                {article.image_caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="max-w-[680px] mx-auto">
          <ArticleContent content={article.content} />

          <div className="mt-12">
            <SourceAttribution sources={article.sources} />
          </div>
        </div>

        <div className="border-t border-border my-16" />

        <div className="max-w-7xl mx-auto">
          <RelatedArticles articles={related} />
        </div>
      </article>

      <ArticleChat
        articleId={article.id}
        articleTitle={article.title}
        articleContent={article.content}
        articleSources={article.sources || []}
      />
    </>
  );
}
