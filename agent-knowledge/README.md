# Agent Knowledge Infrastructure

A provider-neutral TypeScript starter for governed knowledge ingestion and retrieval. It gives agents traceable context rather than asking them to rely only on model parameters.

## Architecture

The canonical target architecture is documented in [ADR-0001](../docs/adr/0001-bgla-knowledge-architecture.md). It defines four tiers, with Tier 1 Security & Governance operating as a cross-cutting control plane, and Human & Institutional Authority as the policy-ownership boundary.

Every protected Tier 2–4 operation must receive a trusted, validated `SecurityContext`. See `src/security-context.ts`. The context is created by the authenticated server boundary, never by model output. Structural validation is not a substitute for identity-provider token verification or a policy decision.

## Architecture documentation

Start with the [BGLA architecture documentation index](../docs/architecture/README.md). The package includes architecture/data flows, security and authorization, knowledge lifecycle, retrieval and reasoning, agent memory governance, and a threat model. The decision record set is [ADR-0001](../docs/adr/0001-bgla-knowledge-architecture.md), [ADR-0002](../docs/adr/0002-security-context-and-authorization.md), [ADR-0003](../docs/adr/0003-provenance-and-lifecycle-invalidation.md), and [ADR-0004](../docs/adr/0004-agent-memory-governance.md).

## Current capabilities

- Document ingestion and deterministic chunking.
- Stable chunk identifiers and source metadata preservation.
- Baseline lexical retrieval with deterministic ranking.
- Access-scope filtering before content is returned.
- Citation-bearing retrieval results.
- Provider interfaces for future embedding and vector-store integrations.
- SecurityContext contract and fail-closed structural/temporal validation.
- Unit tests for provenance, access filtering, chunking, retrieval, and SecurityContext invariants.

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
- `SecurityContext`: trusted identity, tenant, role/scope, expiry, and audit correlation contract.
- `KnowledgeBase`: small in-memory reference implementation.

The included lexical retriever is a transparent baseline, not semantic search. To enable semantic retrieval, implement an embedding provider and vector store, then provide a retriever that satisfies the `Retriever` interface. Production deployments should use durable storage, tenant isolation, encryption, retention controls, and identity-backed authorization.

## Agent safety and governance

1. Retrieved documents are **untrusted data**, not system instructions. Delimit retrieved passages and instruct agents not to follow commands found inside source content.
2. Authorization must be derived from authenticated caller identity and enforced before retrieval results reach the model. Never accept caller scopes supplied by the model.
3. Every protected Tier 2–4 operation must validate a server-created `SecurityContext`; structural validation alone does not authenticate identity or authorize access.
4. Keep credentials, personal data, PHI, and confidential source content out of fixtures and logs.
5. Preserve citations so answers can be traced to source documents and specific chunks.
6. Add source approval, freshness/expiry, versioning, deletion propagation, and audit events before production use.
7. Evaluate retrieval quality and unauthorized disclosure resistance with synthetic test corpora.

## Non-goals

This starter does not include a hosted vector database, embeddings, document connector, agent runtime, or production identity provider. Those are deliberate adapter/integration milestones rather than silently assumed capabilities.
