import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: options?.maxTokens ?? 4096,
    temperature: options?.temperature ?? 0.7,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<T> {
  const raw = await generateWithClaude(systemPrompt, userPrompt, options);

  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw];
  const jsonStr = (jsonMatch[1] || raw).trim();

  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    console.warn(
      "[claude] JSON parse failed, retrying with explicit instruction..."
    );
    const retryRaw = await generateWithClaude(
      systemPrompt,
      `${userPrompt}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the raw JSON object — no markdown, no code blocks, no explanation. Start with { and end with }.`,
      options
    );
    const retryMatch = retryRaw.match(/```(?:json)?\s*([\s\S]*?)```/) || [
      null,
      retryRaw,
    ];
    return JSON.parse((retryMatch[1] || retryRaw).trim()) as T;
  }
}
