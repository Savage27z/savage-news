import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { articleId, messages, articleTitle, articleContent, articleSources } =
    await request.json();

  if (!articleId || !messages?.length) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const sourcesText = articleSources
    ?.map((s: { name: string; url: string }) => `${s.name}: ${s.url}`)
    .join("\n") || "No sources available";

  const systemPrompt = `You are a knowledgeable AI assistant for Pulse AI, a technology and science news publication. You are discussing a specific article with a reader.

The article is titled: "${articleTitle || "Unknown"}"

Article content:
${articleContent || "Content not available"}

Source materials: ${sourcesText}

Rules:
- Answer questions based on the article content and your general knowledge
- If asked about something not covered in the article, say so and provide what you know
- Be concise but thorough — 2-4 paragraphs max per response
- If the reader asks for simpler explanations, provide them
- Cite specific parts of the article when relevant
- Maintain a friendly, expert tone`;

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
