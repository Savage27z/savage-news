import { NextResponse } from "next/server";

const TECH_KEYWORDS = [
  "ai", "artificialintelligence", "machinelearning", "deeplearning", "chatgpt",
  "openai", "tech", "technology", "coding", "programming", "developer",
  "software", "cybersecurity", "blockchain", "crypto", "web3", "startup",
  "science", "space", "quantum", "robotics", "automation", "data",
  "cloud", "saas", "fintech", "biotech", "neuralnetwork", "llm", "gpt",
];

function isTechRelated(tag: string): boolean {
  const lower = tag.toLowerCase().replace(/#/g, "");
  return TECH_KEYWORDS.some(
    (kw) => lower.includes(kw) || kw.includes(lower)
  );
}

function formatViews(views: number): string {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

export async function GET() {
  const apiKey = process.env.VIRLO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { hashtags: [], trends: [], available: false },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  }

  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    const [hashtagsRes, trendsRes] = await Promise.allSettled([
      fetch(
        `https://api.virlo.ai/v1/hashtags?start_date=${startDate}&end_date=${endDate}&limit=40&order_by=views&sort=desc`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 3600 },
        }
      ),
      fetch("https://api.virlo.ai/v1/trends/digest", {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 },
      }),
    ]);

    let hashtags: { name: string; views: string; viewsRaw: number; platform?: string }[] = [];
    let trends: { title: string; summary: string }[] = [];

    if (hashtagsRes.status === "fulfilled" && hashtagsRes.value.ok) {
      const data = await hashtagsRes.value.json();
      const items = Array.isArray(data) ? data : data.data || data.hashtags || [];
      hashtags = items
        .filter((h: { name?: string; hashtag?: string }) =>
          isTechRelated(h.name || h.hashtag || "")
        )
        .slice(0, 8)
        .map((h: { name?: string; hashtag?: string; views?: number; total_views?: number; platform?: string }) => ({
          name: h.name || h.hashtag || "",
          views: formatViews(h.views || h.total_views || 0),
          viewsRaw: h.views || h.total_views || 0,
          platform: h.platform,
        }));
    }

    if (trendsRes.status === "fulfilled" && trendsRes.value.ok) {
      const data = await trendsRes.value.json();
      const items = Array.isArray(data) ? data : data.data || data.trends || [];
      trends = items.slice(0, 5).map((t: { title?: string; summary?: string; description?: string }) => ({
        title: t.title || "",
        summary: t.summary || t.description || "",
      }));
    }

    return NextResponse.json(
      { hashtags, trends, available: true },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json(
      { hashtags: [], trends: [], available: false },
      { headers: { "Cache-Control": "public, s-maxage=300" } }
    );
  }
}
