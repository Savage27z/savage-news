import * as cheerio from "cheerio";
import { generateJSON } from "@/lib/ai/claude";
import type { DiscoveredTopic } from "./discover";

const USER_AGENT =
  "Mozilla/5.0 (compatible; PulseAI/1.0; +https://pulse-ai-news.vercel.app)";
const MAX_CONTENT_LENGTH = 5000;

export interface ResearchDossier {
  topic: DiscoveredTopic;
  sourceTexts: { url: string; text: string }[];
  analysis: {
    key_facts: string[];
    perspectives: string[];
    expert_quotes: string[];
    data_points: string[];
    timeline: string[];
    implications: string[];
  };
}

async function fetchArticleText(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`[research] ${url} returned ${response.status}, skipping`);
      return "";
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, aside, .ad, .advertisement").remove();

    const articleBody =
      $("article").text() ||
      $('[role="main"]').text() ||
      $("main").text() ||
      $(".post-content").text() ||
      $(".article-body").text() ||
      $(".entry-content").text() ||
      $("body").text();

    const cleaned = articleBody.replace(/\s+/g, " ").trim();
    return cleaned.slice(0, MAX_CONTENT_LENGTH);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[research] Failed to fetch ${url}: ${msg}`);
    return "";
  }
}

export async function researchTopic(
  topic: DiscoveredTopic
): Promise<ResearchDossier> {
  const urls = topic.source_articles.slice(0, 5);
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const text = await fetchArticleText(url);
      return { url, text };
    })
  );

  const sourceTexts = results
    .filter(
      (r): r is PromiseFulfilledResult<{ url: string; text: string }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value)
    .filter((s) => s.text.length > 0);

  const successCount = sourceTexts.length;
  const failCount = urls.length - successCount;
  console.log(
    `[research] "${topic.headline}": fetched ${successCount}/${urls.length} sources (${failCount} failed)`
  );

  const sourceMaterial = sourceTexts.length > 0
    ? sourceTexts
        .map((s) => `Source (${s.url}):\n${s.text}`)
        .join("\n\n---\n\n")
    : `No full articles could be fetched. Working from RSS metadata only:\nHeadline: ${topic.headline}\nKey facts from RSS: ${topic.key_facts.join("; ")}`;

  const socialContext = topic.social_signal
    ? `\nSocial Media Signal: ${topic.social_signal}`
    : "";

  const systemPrompt = `You are a research analyst preparing a comprehensive dossier for a journalist. Extract and organize all relevant information from the source material provided. Be thorough and factual — never invent information.

Return ONLY valid JSON, no other text:
{"key_facts": ["..."], "perspectives": ["..."], "expert_quotes": ["..."], "data_points": ["..."], "timeline": ["..."], "implications": ["..."]}`;

  const userPrompt = `Topic: ${topic.headline}
Angle: ${topic.angle}${socialContext}

SOURCE MATERIAL:
${sourceMaterial}`;

  try {
    const analysis = await generateJSON<ResearchDossier["analysis"]>(
      systemPrompt,
      userPrompt,
      { maxTokens: 4096, temperature: 0.3 }
    );

    return { topic, sourceTexts, analysis };
  } catch (error) {
    console.error(`[research] Analysis failed for "${topic.headline}":`, error);
    return {
      topic,
      sourceTexts,
      analysis: {
        key_facts: topic.key_facts,
        perspectives: [],
        expert_quotes: [],
        data_points: [],
        timeline: [],
        implications: [],
      },
    };
  }
}
