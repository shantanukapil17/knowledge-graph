import { openai } from "../config/openai";

export async function extractRelationships(text: string) {
  const prompt = `
You are analyzing semantic relationships between concepts in this paper.

Extract ONLY relationships between concepts or between papers.

Return JSON array of objects:

[
  {
    "source": string,
    "target": string,
    "relation": string
  }
]

Allowed relation values:
- "improves_on"
- "extends"
- "related_to"
- "inspired_by"
- "variant_of"

Rules:
- Return ONLY JSON (no markdown)
- Return an empty array [] if no relationships found
- Keep relationships concise and factual

Text:
${text}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" } as const,
    });

    let content = response.choices[0].message.content?.trim() || "{}";

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (err) {
    console.error("Relationship agent failed, using fallback []", err);
    return [];
  }
}
