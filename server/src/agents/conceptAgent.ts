import { openai } from "../config/openai";

export async function extractConcepts(text: string) {
  const prompt = `
Extract important concepts, technical terms, datasets, and methods mentioned in this paper.

Return ONLY a JSON object:

{
  "concepts": string[]
}

Rules:
- Return ONLY JSON (no markdown)
- Concepts must be meaningful research terms
- Remove duplicates
- Avoid extremely generic words (e.g., "image", "training")

Text:
${text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    response_format: { type: "json_object" } as const,
  });

  let content = response.choices[0].message.content?.trim() || "{}";

  const parsed = JSON.parse(content);
  parsed.concepts = [...new Set(parsed.concepts || [])];

  return parsed;
}
