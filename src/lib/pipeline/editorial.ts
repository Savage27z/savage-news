import { generateJSON } from "@/lib/ai/claude";
import type { ArticleDraft } from "./write";

export interface EditorialResult {
  approved: boolean;
  quality_score: number;
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  editorial_notes: string;
  category: ArticleDraft["category"];
  topic: ArticleDraft["topic"];
  research: ArticleDraft["research"];
}

interface EditorialReviewResult {
  approved: boolean;
  quality_score: number;
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  editorial_notes: string;
}

const SYSTEM_PROMPT = `You are the editor-in-chief at Pulse AI. Review this article against the source material provided. Your job is to:
1. Verify all claims are supported by the sources
2. Flag any unsupported or potentially inaccurate statements
3. Improve the headline and subtitle if they can be stronger
4. Tighten the prose — remove filler, strengthen verbs, sharpen the lede
5. Rate the overall quality from 1-10 (only articles scoring 7+ should be published)
6. Return the final edited version

Return ONLY valid JSON, no other text:
{"approved": boolean, "quality_score": number, "title": "...", "subtitle": "...", "content": "...", "summary": "...", "editorial_notes": "..."}`;

export async function editorialReview(
  draft: ArticleDraft,
  research: ArticleDraft["research"]
): Promise<EditorialResult> {
  const sourceMaterial = research.sourceTexts
    .map((s) => `Source (${s.url}):\n${s.text.slice(0, 2000)}`)
    .join("\n\n---\n\n");

  const userPrompt = `ARTICLE TO REVIEW:

Title: ${draft.title}
Subtitle: ${draft.subtitle}
Category: ${draft.category}

${draft.content}

---

SOURCE MATERIAL FOR FACT-CHECKING:
${sourceMaterial || "Original RSS data was used; full source texts unavailable."}

KEY FACTS FROM RESEARCH:
${research.analysis.key_facts.map((f) => `- ${f}`).join("\n")}`;

  try {
    const result = await generateJSON<EditorialReviewResult>(
      SYSTEM_PROMPT,
      userPrompt,
      { maxTokens: 4096, temperature: 0.3 }
    );

    const approved = result.approved && result.quality_score >= 7;

    console.log(
      `[editorial] "${result.title}" — score: ${result.quality_score}/10, ${approved ? "APPROVED" : "REJECTED"}`
    );

    return {
      ...result,
      approved,
      category: draft.category,
      topic: draft.topic,
      research: draft.research,
    };
  } catch (error) {
    console.error(`[editorial] Review failed for "${draft.title}":`, error);
    throw error;
  }
}
