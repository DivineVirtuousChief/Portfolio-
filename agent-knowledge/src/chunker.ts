import { createHash } from "node:crypto";
import type { KnowledgeChunk, KnowledgeDocument } from "./types.js";

export interface ChunkOptions {
  maxCharacters?: number;
  overlapCharacters?: number;
}

const stableId = (value: string): string => createHash("sha256").update(value).digest("hex").slice(0, 16);

export function chunkDocument(document: KnowledgeDocument, options: ChunkOptions = {}): KnowledgeChunk[] {
  const max = options.maxCharacters ?? 900;
  const overlap = options.overlapCharacters ?? 120;
  if (max < 100 || overlap < 0 || overlap >= max) {
    throw new Error("Chunk size must be >= 100 and overlap must be >= 0 and smaller than chunk size.");
  }

  const normalized = document.content.replace(/\r\n?/g, "\n").replace(/[\t ]+/g, " ").trim();
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const pieces: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > max) {
      if (current) { pieces.push(current); current = ""; }
      let offset = 0;
      while (offset < paragraph.length) {
        const end = Math.min(offset + max, paragraph.length);
        pieces.push(paragraph.slice(offset, end).trim());
        if (end === paragraph.length) break;
        offset = end - overlap;
      }
      continue;
    }
    const candidate = current ? current + "\n\n" + paragraph : paragraph;
    if (candidate.length <= max) current = candidate;
    else { if (current) pieces.push(current); current = paragraph; }
  }
  if (current) pieces.push(current);

  return pieces.map((text, ordinal) => ({
    id: stableId([document.id, String(ordinal), text].join(":")),
    documentId: document.id,
    title: document.title,
    uri: document.uri,
    text,
    accessScopes: [...(document.accessScopes ?? [])],
    metadata: { ...(document.metadata ?? {}) },
    ordinal
  }));
}
