const VIRLO_BASE = "https://api.virlo.ai/v1";

export interface VirloSignals {
  trendDigest: Record<string, unknown>[];
  topHashtags: { hashtag: string; count: number; total_views: number }[];
  raw: Record<string, unknown>;
}

export async function fetchVirloTrends(): Promise<VirloSignals> {
  const token = process.env.VIRLO_API_KEY;
  if (!token) {
    console.log("[virlo] No API key configured, skipping social signals");
    return { trendDigest: [], topHashtags: [], raw: {} };
  }

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [trendsRes, hashtagsRes] = await Promise.allSettled([
      fetch(`${VIRLO_BASE}/trends/digest`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(
        `${VIRLO_BASE}/hashtags?start_date=${weekAgo.toISOString().split("T")[0]}&end_date=${now.toISOString().split("T")[0]}&limit=50&order_by=views&sort=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        }
      ),
    ]);

    const trends =
      trendsRes.status === "fulfilled" && trendsRes.value.ok
        ? await trendsRes.value.json()
        : { data: [] };
    const hashtags =
      hashtagsRes.status === "fulfilled" && hashtagsRes.value.ok
        ? await hashtagsRes.value.json()
        : { data: [] };

    const techKeywords = [
      "ai",
      "tech",
      "coding",
      "robot",
      "science",
      "space",
      "quantum",
      "crypto",
      "blockchain",
      "startup",
      "chatgpt",
      "openai",
      "google",
      "apple",
      "meta",
      "nvidia",
      "programming",
      "data",
      "cyber",
      "climate",
      "energy",
      "biotech",
      "crispr",
      "neuralink",
      "ev",
      "autonomous",
    ];

    const relevantHashtags = (
      hashtags.data || []
    ).filter((h: { hashtag?: string }) =>
      techKeywords.some((kw) => h.hashtag?.toLowerCase().includes(kw))
    );

    console.log(
      `[virlo] Fetched ${(trends.data || []).length} trends, ${relevantHashtags.length} relevant hashtags`
    );

    return {
      trendDigest: trends.data || [],
      topHashtags: relevantHashtags,
      raw: { trends: trends.data, hashtags: hashtags.data },
    };
  } catch (error) {
    console.error("[virlo] Failed to fetch trends:", error);
    return { trendDigest: [], topHashtags: [], raw: {} };
  }
}
