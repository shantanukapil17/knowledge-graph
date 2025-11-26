import { openai } from "../config/openai";

export async function extractPaperMetadata(text: string) {
const prompt = `
You are an expert academic paper analyzer.

Extract metadata from this paper and return ONLY a JSON object with fields:

{
  "title": string,
  "authors": string[],
  "year": number | null,
  "key_contributions": string[],
  "methods": string[],
  "datasets": string[],
  "metrics": string[]
}

Rules:
- Return ONLY raw JSON (no markdown, no backticks)
- Do NOT explain anything
- If unsure about a field, return null or an empty array
- Keep arrays concise and meaningful

Text:
${text}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" } as const,
  });

  const content = response.choices[0].message.content?.trim() || "{}";

  return JSON.parse(content);
}
