import { generateJSON } from "@/lib/ai/claude";
import type { DiscoveredTopic } from "./discover";
import type { ResearchDossier } from "./research";

export interface ArticleDraft {
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  category: "ai" | "technology" | "science" | "business" | "analysis";
  topic: DiscoveredTopic;
  research: ResearchDossier;
}

interface WriteResult {
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  category: string;
}

const SYSTEM_PROMPT = `You are a senior journalist at Pulse AI, a prestigious technology and science publication. You write with the depth of MIT Technology Review, the clarity of The Economist, and the engagement of The Verge.

Your articles must:
- Open with a compelling lede that hooks the reader immediately
- Provide essential context within the first two paragraphs
- Present multiple perspectives when the topic is debated
- Include specific data points, numbers, and concrete examples
- Attribute information to original sources naturally in the text
- Explain technical concepts accessibly without dumbing them down
- End with forward-looking implications or analysis
- Use subheadings (##) to break up sections every 3-4 paragraphs
- Maintain an authoritative but approachable tone
- Be between 800-1500 words
- NEVER fabricate quotes, data, or sources — only use information from the research dossier provided
- If social media trend data is provided, you may reference it naturally (e.g., "The topic has gained significant traction on social media, with related hashtags accumulating over X million views this week")
- Write in Markdown format

Return ONLY valid JSON with this exact structure, no other text:
{"title": "...", "subtitle": "...", "content": "...", "summary": "...", "category": "ai|technology|science|business|analysis"}`;

export async function writeArticle(
  topic: DiscoveredTopic,
  research: ResearchDossier
): Promise<ArticleDraft> {
  const dossier = `
TOPIC: ${topic.headline}
ANGLE: ${topic.angle}
CATEGORY: ${topic.category}
${topic.social_signal ? `SOCIAL SIGNAL: ${topic.social_signal}` : ""}

KEY FACTS:
${research.analysis.key_facts.map((f) => `- ${f}`).join("\n")}

PERSPECTIVES:
${research.analysis.perspectives.map((p) => `- ${p}`).join("\n")}

EXPERT QUOTES:
${research.analysis.expert_quotes.map((q) => `- ${q}`).join("\n")}

DATA POINTS:
${research.analysis.data_points.map((d) => `- ${d}`).join("\n")}

TIMELINE:
${research.analysis.timeline.map((t) => `- ${t}`).join("\n")}

IMPLICATIONS:
${research.analysis.implications.map((i) => `- ${i}`).join("\n")}

SOURCE URLS:
${topic.source_articles.map((u) => `- ${u}`).join("\n")}
`.trim();

  try {
    const result = await generateJSON<WriteResult>(SYSTEM_PROMPT, dossier, {
      maxTokens: 4096,
      temperature: 0.7,
    });

    console.log(`[write] Drafted: "${result.title}"`);

    return {
      title: result.title,
      subtitle: result.subtitle,
      content: result.content,
      summary: result.summary,
      category: (result.category as ArticleDraft["category"]) || topic.category,
      topic,
      research,
    };
  } catch (error) {
    console.error(`[write] Failed to write article for "${topic.headline}":`, error);
    throw error;
  }
}
