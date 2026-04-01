import { createClient } from "@/lib/supabase/server";
import type { Article, Category } from "@/lib/supabase/types";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return null;

  const { data: articles } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false });

  return {
    category: category as Category,
    articles: (articles || []) as Article[],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) return { title: "Category Not Found" };

  return {
    title: data.category.name,
    description:
      data.category.description ||
      `Latest ${data.category.name} news and analysis from Pulse AI.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  if (!data) notFound();

  const { category, articles } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color || "#E11D48" }}
          />
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            {category.name}
          </h1>
        </div>
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        )}
      </header>

      {articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-2xl text-muted-foreground mb-2">
            No articles yet
          </p>
          <p className="text-sm text-muted-foreground">
            Check back soon for new {category.name.toLowerCase()} coverage.
          </p>
        </div>
      )}
    </div>
  );
}
