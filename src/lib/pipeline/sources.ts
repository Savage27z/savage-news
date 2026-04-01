import RSSParser from "rss-parser";

export interface RSSSource {
  name: string;
  url: string;
  category: string;
}

export interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sourceName: string;
  sourceCategory: string;
}

export const RSS_SOURCES: RSSSource[] = [
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "ai",
  },
  {
    name: "The Decoder",
    url: "https://the-decoder.com/feed/",
    category: "ai",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "ai",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "technology",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "technology",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "technology",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "technology",
  },
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    category: "technology",
  },
  {
    name: "Nature News",
    url: "https://www.nature.com/nature.rss",
    category: "science",
  },
  {
    name: "Science Daily",
    url: "https://www.sciencedaily.com/rss/all.xml",
    category: "science",
  },
  {
    name: "Quanta Magazine",
    url: "https://api.quantamagazine.org/feed/",
    category: "science",
  },
  {
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feeds/feed.rss",
    category: "science",
  },
  {
    name: "Reuters Technology",
    url: "https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best&best-sectors=tech",
    category: "business",
  },
  {
    name: "Bloomberg Tech",
    url: "https://feeds.bloomberg.com/technology/news.rss",
    category: "business",
  },
];

const USER_AGENT =
  "Mozilla/5.0 (compatible; PulseAI/1.0; +https://pulse-ai-news.vercel.app)";

async function fetchSingleFeed(source: RSSSource): Promise<FeedItem[]> {
  const parser = new RSSParser();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(source.url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(
        `[sources] ${source.name} returned ${response.status}, skipping`
      );
      return [];
    }

    const xml = await response.text();
    const feed = await parser.parseString(xml);
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

    const items: FeedItem[] = (feed.items || [])
      .filter((item) => {
        if (!item.pubDate) return true;
        return new Date(item.pubDate).getTime() > twentyFourHoursAgo;
      })
      .map((item) => ({
        title: item.title || "",
        description: (item.contentSnippet || item.content || "").slice(0, 500),
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        sourceName: source.name,
        sourceCategory: source.category,
      }));

    console.log(`[sources] ${source.name}: ${items.length} items (last 24h)`);
    return items;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[sources] ${source.name} failed: ${msg}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAllSources(): Promise<FeedItem[]> {
  const results = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchSingleFeed(source))
  );

  let totalItems = 0;
  let failedSources = 0;
  const allItems: FeedItem[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
      totalItems += result.value.length;
    } else {
      failedSources++;
    }
  }

  console.log(
    `[sources] Total: ${totalItems} items from ${RSS_SOURCES.length - failedSources}/${RSS_SOURCES.length} sources`
  );
  return allItems;
}
