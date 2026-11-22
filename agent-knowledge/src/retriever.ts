import type { KnowledgeChunk, RetrievalOptions, RetrievalResult, Retriever } from "./types.js";

const tokenize = (text: string): string[] =>
  text.toLocaleLowerCase().match(/[a-z0-9_-]{2,}/g) ?? [];

function canRead(chunk: KnowledgeChunk, callerScopes: string[]): boolean {
  return chunk.accessScopes.length === 0 || chunk.accessScopes.some(scope => callerScopes.includes(scope));
}

/** Deterministic lexical baseline. Replace/augment with an embedding-backed Retriever for semantic search. */
export class LexicalRetriever implements Retriever {
  constructor(private readonly chunks: KnowledgeChunk[]) {}

  async retrieve(options: RetrievalOptions): Promise<RetrievalResult[]> {
    const queryTerms = [...new Set(tokenize(options.query))];
    if (!queryTerms.length) return [];
    const eligible = this.chunks.filter(chunk => canRead(chunk, options.callerScopes));
    const results = eligible.map(chunk => {
      const terms = tokenize(chunk.text + " " + chunk.title);
      const frequencies = new Map<string, number>();
      for (const term of terms) frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
      const score = queryTerms.reduce((sum, term) => sum + Math.log1p(frequencies.get(term) ?? 0), 0);
      return { chunk, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));

    return results.slice(0, Math.max(1, options.limit ?? 5)).map(({ chunk, score }) => ({
      chunk,
      score,
      citation: {
        sourceId: chunk.documentId,
        title: chunk.title,
        uri: chunk.uri,
        chunkId: chunk.id,
        excerpt: chunk.text.slice(0, 280)
      }
    }));
  }
}
