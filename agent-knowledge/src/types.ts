export interface KnowledgeDocument {
  id: string;
  title: string;
  uri: string;
  content: string;
  /** Empty means public-to-this-knowledge-base; otherwise caller must hold at least one scope. */
  accessScopes?: string[];
  metadata?: Record<string, string>;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  title: string;
  uri: string;
  text: string;
  accessScopes: string[];
  metadata: Record<string, string>;
  ordinal: number;
}

export interface KnowledgeCitation {
  sourceId: string;
  title: string;
  uri: string;
  chunkId: string;
  excerpt: string;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
  citation: KnowledgeCitation;
}

export interface RetrievalOptions {
  query: string;
  /** Caller identity/authorization context. Never derive this from model output. */
  callerScopes: string[];
  limit?: number;
}

export interface Retriever {
  retrieve(options: RetrievalOptions): Promise<RetrievalResult[]>;
}

export interface EmbeddingProvider {
  embed(texts: string[]): Promise<number[][]>;
}

export interface VectorStore {
  upsert(chunks: KnowledgeChunk[], vectors: number[][]): Promise<void>;
  search(vector: number[], limit: number, allowedScopes: string[]): Promise<Array<{ chunk: KnowledgeChunk; score: number }>>;
}
