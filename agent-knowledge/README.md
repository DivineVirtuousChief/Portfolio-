# Agent Knowledge Infrastructure

A provider-neutral TypeScript starter for governed knowledge ingestion and retrieval. It gives agents traceable context rather than asking them to rely only on model parameters.

## Current capabilities

- Document ingestion and deterministic chunking.
- Stable chunk identifiers and source metadata preservation.
- Baseline lexical retrieval with deterministic ranking.
- Access-scope filtering before content is returned.
- Citation-bearing retrieval results.
- Provider interfaces for future embedding and vector-store integrations.
- Unit tests for provenance, access filtering, chunking, and retrieval.

## Quick start

```bash
cd agent-knowledge
npm install
npm run check
```

## Example

```ts
import { KnowledgeBase } from "./src/index.js";

const knowledge = new KnowledgeBase();
knowledge.ingest({
  id: "security-standard-01",
  title: "Security Standard",
  uri: "https://docs.example.test/security-standard",
  content: "Privileged access must be approved and audited.",
  accessScopes: ["security-team"]
});

const results = await knowledge.retrieve({
  query: "privileged access approval",
  callerScopes: ["security-team"],
  limit: 3
});

// Pass retrieved excerpts and citations to the agent as reference context.
```

## Architecture and extension points

- `KnowledgeDocument`: source content, URI, metadata, and access scopes.
- `chunkDocument`: normalization and chunk creation.
- `Retriever`: provider-neutral retrieval contract.
- `EmbeddingProvider` and `VectorStore`: integration contracts for semantic retrieval.
- `KnowledgeBase`: small in-memory reference implementation.

The included lexical retriever is a transparent baseline, not semantic search. To enable semantic retrieval, implement an embedding provider and vector store, then provide a retriever that satisfies the `Retriever` interface. Production deployments should use durable storage, tenant isolation, encryption, retention controls, and identity-backed authorization.

## Agent safety and governance

1. Retrieved documents are **untrusted data**, not system instructions. Delimit retrieved passages and instruct agents not to follow commands found inside source content.
2. Authorization must be derived from authenticated caller identity and enforced before retrieval results reach the model. Never accept caller scopes supplied by the model.
3. Keep credentials, personal data, PHI, and confidential source content out of fixtures and logs.
4. Preserve citations so answers can be traced to source documents and specific chunks.
5. Add source approval, freshness/expiry, versioning, deletion propagation, and audit events before production use.
6. Evaluate retrieval quality and unauthorized disclosure resistance with synthetic test corpora.

## Non-goals

This starter does not include a hosted vector database, embeddings, document connector, agent runtime, or production identity provider. Those are deliberate adapter/integration milestones rather than silently assumed capabilities.
