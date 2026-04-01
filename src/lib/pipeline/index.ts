import { supabaseAdmin } from "@/lib/supabase/admin";
import { fetchAllSources } from "./sources";
import { fetchVirloTrends } from "./virlo";
import { discoverTopics } from "./discover";
import { researchTopic } from "./research";
import { writeArticle } from "./write";
import { editorialReview } from "./editorial";
import { publishArticle, setFeaturedArticle } from "./publish";
import type { PublishedArticle } from "./publish";

export interface PipelineResult {
  runId: string;
  status: "completed" | "failed";
  topicsFound: number;
  articlesGenerated: number;
  error?: string;
}

export async function runPipeline(): Promise<PipelineResult> {
  const { data: run } = await supabaseAdmin
    .from("pipeline_runs")
    .insert({ status: "running" })
    .select()
    .single();

  const runId = run?.id || crypto.randomUUID();
  const logs: { step: string; message: string; timestamp: string }[] = [];

  const addLog = (step: string, message: string) => {
    logs.push({ step, message, timestamp: new Date().toISOString() });
    console.log(`[pipeline][${step}] ${message}`);
  };

  try {
    addLog("init", "Starting pipeline run");

    const [virloSignals, feedItems] = await Promise.all([
      fetchVirloTrends().catch((err) => {
        addLog("virlo", `Failed (non-fatal): ${err.message}`);
        return {
          trendDigest: [] as Record<string, unknown>[],
          topHashtags: [] as { hashtag: string; count: number; total_views: number }[],
          raw: {} as Record<string, unknown>,
        };
      }),
      fetchAllSources(),
    ]);

    addLog("sources", `Fetched ${feedItems.length} RSS items`);
    addLog(
      "virlo",
      `Fetched ${virloSignals.topHashtags.length} relevant hashtags`
    );

    if (feedItems.length === 0) {
      addLog("sources", "No RSS items found — cannot proceed");
      await supabaseAdmin
        .from("pipeline_runs")
        .update({
          status: "completed",
          topics_found: 0,
          articles_generated: 0,
          completed_at: new Date().toISOString(),
          log: logs,
        })
        .eq("id", runId);

      return {
        runId,
        status: "completed",
        topicsFound: 0,
        articlesGenerated: 0,
      };
    }

    const topics = await discoverTopics(feedItems, virloSignals);
    addLog("discover", `Selected ${topics.length} topics`);

    await supabaseAdmin
      .from("pipeline_runs")
      .update({ topics_found: topics.length })
      .eq("id", runId);

    const CONCURRENCY = 3;
    const articles: PublishedArticle[] = [];

    for (let i = 0; i < topics.length; i += CONCURRENCY) {
      const batch = topics.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map(async (topic) => {
          addLog("research", `Researching: "${topic.headline}"`);
          const research = await researchTopic(topic);

          addLog("write", `Writing: "${topic.headline}"`);
          const draft = await writeArticle(topic, research);

          addLog("editorial", `Reviewing: "${draft.title}"`);
          const reviewed = await editorialReview(draft, research);

          if (reviewed.approved && reviewed.quality_score >= 7) {
            return publishArticle(reviewed);
          }
          addLog(
            "editorial",
            `Rejected: "${draft.title}" (score: ${reviewed.quality_score})`
          );
          return null;
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          articles.push(result.value);
          addLog("publish", `Published: "${result.value.title}"`);
        } else if (result.status === "rejected") {
          addLog("error", `Topic processing failed: ${result.reason}`);
        }
      }
    }

    if (articles.length > 0) {
      const best = articles.reduce((a, b) =>
        a.quality_score > b.quality_score ? a : b
      );
      await setFeaturedArticle(best.id);
      addLog("publish", `Featured article: "${best.title}"`);
    }

    await supabaseAdmin
      .from("pipeline_runs")
      .update({
        status: "completed",
        articles_generated: articles.length,
        completed_at: new Date().toISOString(),
        log: logs,
      })
      .eq("id", runId);

    addLog(
      "complete",
      `Pipeline finished: ${articles.length} articles published`
    );

    return {
      runId,
      status: "completed",
      topicsFound: topics.length,
      articlesGenerated: articles.length,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    addLog("fatal", errorMsg);

    await supabaseAdmin
      .from("pipeline_runs")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        log: logs,
        error: errorMsg,
      })
      .eq("id", runId);

    return {
      runId,
      status: "failed",
      topicsFound: 0,
      articlesGenerated: 0,
      error: errorMsg,
    };
  }
}
