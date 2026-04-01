import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ articles: [] });
  }

  const searchTerms = q
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/[^\w]/g, ""))
    .filter(Boolean)
    .join(" & ");

  if (!searchTerms) {
    return NextResponse.json({ articles: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .textSearch("fts", searchTerms)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) {
    const { data: fallback } = await supabaseAdmin
      .from("articles")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .order("published_at", { ascending: false })
      .limit(20);

    return NextResponse.json({ articles: fallback || [] });
  }

  return NextResponse.json({ articles: data || [] });
}
