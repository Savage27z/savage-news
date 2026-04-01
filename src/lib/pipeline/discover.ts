import { generateJSON } from "@/lib/ai/claude";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { FeedItem } from "./sources";
import type { VirloSignals } from "./virlo";

export interface DiscoveredTopic {
  headline: string;
  category: "ai" | "technology" | "science" | "business" | "analysis";
  newsworthiness_score: number;
  angle: string;
  source_articles: string[];
  key_facts: string[];
  social_signal: string;
}

interface DiscoverResult {
  topics: DiscoveredTopic[];
}

export async function discoverTopics(
  feedItems: FeedItem[],
  virloSignals: VirloSignals
): Promise<DiscoveredTopic[]> {
  const { data: existingArticles } = await supabaseAdmin
    .from("articles")
    .select("title, slug")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const existingTitles = (existingArticles || [])
    .map((a: { title: string; slug: string }) => `- ${a.title} (${a.slug})`)
    .join("\n");

  const rssItemsSummary = feedItems
    .slice(0, 100)
    .map(
      (item) =>
        `[${item.sourceName}] ${item.title}\n  ${item.description.slice(0, 200)}\n  URL: ${item.link}`
    )
    .join("\n\n");

  const virloTrendsSummary =
    virloSignals.trendDigest.length > 0 || virloSignals.topHashtags.length > 0
      ? `Trend Digest:\n${JSON.stringify(virloSignals.trendDigest.slice(0, 10), null, 2)}\n\nTop Tech Hashtags:\n${virloSignals.topHashtags
          .slice(0, 20)
          .map(
            (h) =>
              `#${h.hashtag} — ${h.total_views?.toLocaleString() || "N/A"} views`
          )
          .join("\n")}`
      : "No social media trend data available for this run.";

  const systemPrompt = `You are a news editor deciding what to cover today. You have two inputs:

1. RSS FEEDS — articles from major tech/science publications (last 24 hours)
2. SOCIAL MEDIA TRENDS — what's trending on TikTok, YouTube, and Instagram right now (from Virlo)
3. ALREADY COVERED — these topics have already been published on our site. Do NOT select duplicates.

Topics that appear in both traditional media AND social media trends are especially valuable — they combine editorial importance with proven audience interest.

Select the top 3-5 most newsworthy topics. Return ONLY valid JSON, no other text:
{"topics": [{"headline": "Working title for the story", "category": "ai|technology|science|business|analysis", "newsworthiness_score": 9, "angle": "The unique angle Pulse AI should take", "source_articles": ["url1", "url2", "url3"], "key_facts": ["fact1", "fact2"], "social_signal": "Trending on TikTok with #hashtag, Xm views this week or empty string if no social signal"}]}`;

  const userPrompt = `RSS FEEDS (last 24 hours):\n${rssItemsSummary}\n\nSOCIAL MEDIA TRENDS:\n${virloTrendsSummary}\n\nALREADY COVERED:\n${existingTitles || "None yet — this is the first run."}`;

  try {
    const result = await generateJSON<DiscoverResult>(
      systemPrompt,
      userPrompt,
      { maxTokens: 4096, temperature: 0.7 }
    );

    const topics = (result.topics || []).filter(
      (t) => t.headline && t.category && t.newsworthiness_score
    );

    console.log(
      `[discover] Selected ${topics.length} topics: ${topics.map((t) => t.headline).join(", ")}`
    );
    return topics;
  } catch (error) {
    console.error("[discover] Failed to discover topics:", error);
    throw error;
  }
}
