import { chunkDocument } from "./chunker.js";
import { LexicalRetriever } from "./retriever.js";
import type { KnowledgeChunk, KnowledgeDocument, RetrievalOptions, RetrievalResult } from "./types.js";

export class KnowledgeBase {
  private readonly chunks = new Map<string, KnowledgeChunk>();

  ingest(document: KnowledgeDocument): KnowledgeChunk[] {
    if (!document.id.trim() || !document.title.trim() || !document.uri.trim()) {
      throw new Error("Document id, title, and URI are required.");
    }
    const chunks = chunkDocument(document);
    for (const chunk of chunks) this.chunks.set(chunk.id, chunk);
    return chunks;
  }

  async retrieve(options: RetrievalOptions): Promise<RetrievalResult[]> {
    return new LexicalRetriever([...this.chunks.values()]).retrieve(options);
  }

  get size(): number { return this.chunks.size; }
}
