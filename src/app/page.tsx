import { createClient } from "@/lib/supabase/server";
import type { Article, Category } from "@/lib/supabase/types";
import { HeroArticle } from "@/components/articles/HeroArticle";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { TrendingBar } from "@/components/home/TrendingBar";
import { DigestSidebar } from "@/components/home/DigestSidebar";
import { CategorySection } from "@/components/home/CategorySection";

async function getHomepageData() {
  const supabase = await createClient();

  const [categoriesRes, featuredRes, articlesRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("articles")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(1),
    supabase
      .from("articles")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(20),
  ]);

  return {
    categories: (categoriesRes.data || []) as Category[],
    featured: (featuredRes.data?.[0] || null) as Article | null,
    articles: (articlesRes.data || []) as Article[],
  };
}

export default async function HomePage() {
  const { categories, featured, articles } = await getHomepageData();

  const nonFeatured = articles.filter((a) => a.id !== featured?.id);

  const articlesByCategory = categories
    .map((cat) => ({
      category: cat,
      articles: articles.filter((a) => a.category_id === cat.id),
    }))
    .filter((group) => group.articles.length > 0);

  return (
    <>
      <TrendingBar categories={categories} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {featured && (
          <section className="mb-12">
            <HeroArticle article={featured} />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-serif text-2xl font-bold">Latest</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <ArticleGrid articles={nonFeatured.slice(0, 6)} />
          </div>
          <div>
            <DigestSidebar articles={articles} />
          </div>
        </div>

        <div className="space-y-12">
          {articlesByCategory.map((group) => (
            <CategorySection
              key={group.category.id}
              category={group.category}
              articles={group.articles}
            />
          ))}
        </div>
      </div>
    </>
  );
}
