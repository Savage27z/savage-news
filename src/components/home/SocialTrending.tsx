"use client";

import { useEffect, useState } from "react";
import { Flame, ExternalLink } from "lucide-react";

interface Hashtag {
  name: string;
  views: string;
  viewsRaw: number;
  platform?: string;
}

interface TrendsData {
  hashtags: Hashtag[];
  trends: { title: string; summary: string }[];
  available: boolean;
}

function PlatformIcon({ platform }: { platform?: string }) {
  if (!platform) return null;
  const p = platform.toLowerCase();

  if (p.includes("tiktok")) {
    return <span className="text-[10px] font-mono text-muted-foreground/60">TT</span>;
  }
  if (p.includes("youtube")) {
    return <span className="text-[10px] font-mono text-muted-foreground/60">YT</span>;
  }
  if (p.includes("instagram")) {
    return <span className="text-[10px] font-mono text-muted-foreground/60">IG</span>;
  }
  return null;
}

export function SocialTrending() {
  const [data, setData] = useState<TrendsData | null>(null);

  useEffect(() => {
    fetch("/api/virlo/trends")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ hashtags: [], trends: [], available: false }));
  }, []);

  if (!data || !data.available || data.hashtags.length === 0) return null;

  const maxViews = Math.max(...data.hashtags.map((h) => h.viewsRaw));

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-4 w-4 text-orange-500" />
        <h3 className="font-mono text-xs uppercase tracking-widest font-medium">
          Trending on Social
        </h3>
      </div>

      <div className="space-y-3">
        {data.hashtags.map((tag, i) => {
          const barWidth = maxViews > 0 ? (tag.viewsRaw / maxViews) * 100 : 0;

          return (
            <div key={`${tag.name}-${i}`} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    #{tag.name.replace(/^#/, "")}
                  </span>
                  <PlatformIcon platform={tag.platform} />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {tag.views} views
                </span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500/60 to-accent/60 transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <a
        href="https://virlo.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        Social data by Virlo <ExternalLink className="h-2.5 w-2.5" />
      </a>
    </div>
  );
}
