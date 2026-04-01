"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import type { Article } from "@/lib/supabase/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

function SearchResults({ query }: { query: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) {
      setArticles([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setSearched(true);
      })
      .catch(() => {
        setArticles([]);
        setSearched(true);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border overflow-hidden">
            <div className="aspect-[16/9] bg-muted" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (searched && articles.length === 0) {
    return (
      <div className="text-center py-20">
        <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="font-serif text-2xl font-bold mb-2">No results found</p>
        <p className="text-muted-foreground mb-6">
          No articles matched &ldquo;{query}&rdquo;. Try different keywords or browse our categories.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["AI", "Technology", "Science", "Business"].map((cat) => (
            <a
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="px-4 py-2 rounded-full border border-border text-sm hover:bg-muted transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (!searched) return null;

  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        {articles.length} result{articles.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);

  const handleSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/search");
      }
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-8">
          Search Articles
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(input);
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for articles, topics, or keywords..."
            className="w-full pl-12 pr-12 py-4 text-lg bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 ring-accent/30 focus:border-accent/30 transition-all placeholder:text-muted-foreground/50"
            autoFocus
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                router.push("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </form>
      </div>

      <SearchResults query={q} />

      {!q && (
        <div className="text-center py-12">
          <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Search our AI-generated articles across technology, science, and more.
          </p>
        </div>
      )}
    </div>
  );
}
