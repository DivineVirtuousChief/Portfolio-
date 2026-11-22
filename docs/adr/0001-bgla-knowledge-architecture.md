# ADR-0001: BGLA Governed Agent Knowledge Architecture

- **Status:** Accepted as the target architecture; implementation is incremental.
- **Date:** 2026-11-22
- **Decision owners:** Human and institutional policy owners.
- **Applies to:** Agent Knowledge Infrastructure and all connected ingestion, retrieval, graph, and memory adapters.

## Context

Agent knowledge systems can leak information when authorization is applied only during ingestion or after retrieval. Documents may be copied into lexical indexes, vector stores, graph projections, caches, summaries, and persistent agent memory. A source permission change must therefore govern every derived representation and every runtime request.

The architecture must preserve source provenance, support exact and semantic retrieval, and keep agent-generated content subordinate to authenticated identity and approved policy.

## Decision

Adopt a four-tier knowledge architecture with Tier 1 operating as a cross-cutting control plane and Human & Institutional Authority defining policy ownership and consequential decision boundaries.

### Tier 1 — Security & Governance Foundation (cross-cutting control plane)

- Role-based and attribute/scope-based authorization.
- Tenant isolation and document-level access control.
- Authenticated, immutable request security context.
- Fail-closed behavior for missing, expired, malformed, or unverifiable context.
- Audit events for access decisions and lifecycle operations.

Tier 1 is enforced at ingestion, indexing, retrieval, graph traversal, reranking, context assembly, caching, and memory read/write/delete operations. It is not a one-time ingestion filter.

### Tier 2 — Ingestion & Lifecycle Management

- Approved document and system connectors.
- Parsing, normalization, deduplication, chunking, and provenance preservation.
- Source approval, versioning, freshness, quality, expiry, and revocation.
- Cascade propagation of updates, permission changes, expiry, and deletion to all derived artifacts.

### Tier 3 — Retrieval & Reasoning Engine

- Semantic vector search.
- Lexical/exact search.
- Hybrid retrieval, filtering, fusion, and reranking.
- Knowledge graph entities, relationships, and bounded multi-hop traversal.
- Authorization checks at each retrieval and graph boundary, before content is exposed or ranked for a caller.

### Tier 4 — Agent Interface & Memory

- Delivery of authorized, citation-bearing context to agents.
- Session and user memory with explicit purpose, retention, and deletion rules.
- Provenance for retained claims and derived memories.
- Memory invalidation when source access, source validity, or retention status changes.

### Human & Institutional Authority

Human and institutional policy owners define approved purposes, roles, access policy, retention, source trust, and escalation requirements. Agents may recommend and execute only within delegated authority. They do not establish their own permissions or override policy. Consequential actions retain the required human approval and accountability.

## Data and query flows

1. **Knowledge flow:** approved source → authenticated connector → parse/normalize → quality and lifecycle checks → authorization-aware indexing → retrieval stores → authorized agent context.
2. **Query flow:** authenticated request → validated SecurityContext → policy evaluation → authorized candidate retrieval → fusion/reranking → citation/provenance checks → context assembly → agent response.
3. **Governance flow:** policy and identity changes → authorization enforcement → audit events → index/cache/graph/memory invalidation or re-evaluation → evidence and review.

## Non-negotiable requirements

1. **Pre-retrieval authorization:** enforce tenant and document access before scoring, graph expansion, reranking, or LLM context assembly. Re-check before returning content; do not rely on post-filtering alone.
2. **Cascade revocation:** source updates, expiry, deletion, and permission revocation propagate to chunks, embeddings, graph projections, caches, summaries, and persistent memories. Where propagation is asynchronous, deny access immediately through a revocation/tombstone gate until cleanup is verified.
3. **Hybrid evidence retrieval:** combine lexical and semantic methods with metadata constraints and graph reasoning; preserve deterministic traceability and source citations.
4. **Evidence-bound memory:** every factual memory records source identifiers, source version, timestamps, derivation/provenance, tenant, and retention state. Unattributed model inference must not be represented as sourced fact.
5. **Independent evaluation:** continuously test retrieval quality, citation correctness, freshness, tenant isolation, authorization leakage, revocation latency, and resistance to prompt injection.

## SecurityContext contract

All Tier 2–4 operations that access tenant-scoped or protected knowledge must receive a validated, server-created `SecurityContext`. The canonical TypeScript contract is `agent-knowledge/src/security-context.ts`.

- Context is created by a trusted authentication/authorization boundary, never by the model or user-supplied prompt text.
- Tenant and subject identifiers are mandatory.
- Expiry and request correlation are mandatory.
- Scope/role claims are trusted only when issued by the configured identity provider and policy service.
- Missing, expired, malformed, or unverifiable context fails closed.
- Raw bearer tokens and credentials are not stored in the context object or logs.

## Consequences

### Positive

- Consistent authorization semantics across indexes and memory.
- Explicit provenance and lifecycle obligations for derived knowledge.
- Clear accountability between agents, operators, and policy owners.
- Provider-neutral interfaces that can support multiple storage/retrieval backends.

### Costs and trade-offs

- Every adapter must support tenant-aware filtering and policy evaluation.
- Revocation requires coordinated invalidation and may need a deny-first tombstone mechanism.
- Graph traversal, reranking, and caches need explicit authorization-aware designs.
- Evaluation and audit infrastructure add operational complexity.

## Acceptance and rollout

The architecture is a target state, not a claim that every capability is already implemented. Roll out through six milestones:

1. Tier 1 security context, policy enforcement, and authorization-leakage tests.
2. Approved connectors and lifecycle/cascade invalidation.
3. Semantic vector search and hybrid retrieval.
4. Knowledge graph integration with per-hop authorization.
5. Provenance-aware agent memory and retention/deletion controls.
6. Freshness, quality, security, and retrieval evaluation.

**Milestone 1 is not complete** until automated tests demonstrate zero cross-tenant and unauthorized retrieval, fail-closed handling, enforcement before ranking/context assembly, and revocation behavior for derived memory. Tests must use synthetic fixtures and must not contain real PHI, secrets, or production confidential data.

## Security boundaries

Retrieved content is untrusted reference data, never executable instructions or policy. Prompt-injection defenses must remain in place, but they do not replace authorization. The system must not treat a citation as proof that a claim is true; source authority, freshness, and quality remain separately evaluated.

## Governing principle

**VERITAS ANTE ASSERTIONEM — Truth Before Assertion.** Intelligence may expand through knowledge, but access remains bounded by authorization, memory by retention policy, and consequential decisions by legitimate human and institutional authority.


## Related architecture documentation and decisions

- [Architecture index and implementation status](../architecture/README.md)
- [Architecture and data flows](../architecture/architecture-and-flows.md)
- [Security and authorization model](../architecture/security-and-authorization.md)
- [Knowledge lifecycle and provenance](../architecture/knowledge-lifecycle.md)
- [Retrieval and reasoning](../architecture/retrieval-and-reasoning.md)
- [Agent memory governance](../architecture/agent-memory-governance.md)
- [Threat model and assurance](../architecture/threat-model.md)
- [ADR-0002: SecurityContext and authorization](0002-security-context-and-authorization.md)
- [ADR-0003: Provenance and lifecycle invalidation](0003-provenance-and-lifecycle-invalidation.md)
- [ADR-0004: Agent memory governance](0004-agent-memory-governance.md)
