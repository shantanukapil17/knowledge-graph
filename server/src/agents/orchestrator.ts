import { extractPaperMetadata } from "./paperAgent";
import { extractConcepts } from "./conceptAgent";
import { extractRelationships } from "./relationshipAgent";
import { dbInsertNode, dbInsertEdge } from "../db/queries";

export async function processPaper(text: string) {

  const metaText = text.slice(0, 8000);
  const conceptText = text.slice(0, 8000);
  const relText = text.slice(0, 5000);

  const [meta, concepts, relationships] = await Promise.all([
    extractPaperMetadata(metaText).catch(() => null),
    extractConcepts(conceptText).catch(() => ({ concepts: [] })),
    extractRelationships(relText).catch(() => []),
  ]);
  const title = meta?.title || "Untitled Paper";
  const paperNode = await dbInsertNode("paper", title, meta || {});
  const conceptList = concepts?.concepts || [];
  for (const c of conceptList) {
    if (!c?.trim()) continue;

    const conceptNode = await dbInsertNode("concept", c, {});
    await dbInsertEdge(paperNode.id, conceptNode.id, "mentions", {});
  }
  const relList = Array.isArray(relationships) ? relationships : [];
  for (const r of relList) {
    if (!r?.source || !r?.target || !r?.relation) continue;

    const s = await dbInsertNode("concept", r.source, {});
    const t = await dbInsertNode("concept", r.target, {});
    await dbInsertEdge(s.id, t.id, r.relation, {});
  }
  return paperNode;
}
