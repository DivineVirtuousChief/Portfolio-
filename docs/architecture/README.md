# BGLA Governed Agent Knowledge Architecture

**Architecture baseline:** ADR-0001  
**Status:** Target architecture; staged implementation  
**Principle:** VERITAS ANTE ASSERTIONEM — Truth Before Assertion.

## Purpose

This documentation defines the architecture, control boundaries, operational contracts, and evidence required to build an enterprise-grade knowledge infrastructure for AI agents. It separates what is already implemented from target capabilities and production obligations.

## Architecture at a glance

| Tier | Name | Responsibility |
|---|---|---|
| 1 | Security & Governance Foundation | Cross-cutting identity, tenant isolation, authorization, audit, and policy enforcement |
| 2 | Ingestion & Lifecycle Management | Approved connectors, parsing, provenance, quality, freshness, versioning, and revocation |
| 3 | Retrieval & Reasoning Engine | Lexical and semantic retrieval, hybrid fusion, graph traversal, and reranking |
| 4 | Agent Interface & Memory | Authorized context delivery, citation provenance, session state, and governed persistent memory |

**Human & Institutional Authority** owns policy, delegated authority, risk acceptance, retention rules, and approval of consequential actions. It is the governance boundary above and around the technical tiers, not an agent component.

Tier 1 is not a sequential stage. It is enforced at every protected operation in Tiers 2–4.

## Documentation map

- [Architecture and flows](architecture-and-flows.md)
- [Security and authorization model](security-and-authorization.md)
- [Knowledge lifecycle and provenance](knowledge-lifecycle.md)
- [Retrieval and reasoning](retrieval-and-reasoning.md)
- [Agent memory governance](agent-memory-governance.md)
- [Threat model and assurance](threat-model.md)
- [Six-milestone implementation roadmap](implementation-roadmap.md)
- [ADR index](../adr/README.md)
- [ADR-0001: Overall architecture](../adr/0001-bgla-knowledge-architecture.md)
- [ADR-0002: Security context and authorization boundary](../adr/0002-security-context-and-authorization.md)
- [ADR-0003: Provenance and lifecycle invalidation](../adr/0003-provenance-and-lifecycle-invalidation.md)
- [ADR-0004: Agent memory governance](../adr/0004-agent-memory-governance.md)

## Current implementation versus target state

The current module provides deterministic chunking, source metadata, lexical retrieval, scope filtering, citations, provider interfaces, and a structural/temporal SecurityContext validator with tests.

The following remain roadmap work and must not be represented as implemented until delivered and tested: production identity verification, policy decision integration, end-to-end tenant isolation, document connectors, durable stores, embeddings, vector search, hybrid ranking, knowledge graphs, persistent agent memory, cascade deletion, and production evaluation.

## Engineering roadmap

1. [M1 — Tenant-aware authorization](https://github.com/DivineVirtuousChief/Portfolio-/issues/8)
2. [M2 — Connectors and lifecycle propagation](https://github.com/DivineVirtuousChief/Portfolio-/issues/9)
3. [M3 — Semantic and hybrid retrieval](https://github.com/DivineVirtuousChief/Portfolio-/issues/10)
4. [M4 — Authorization-aware knowledge graphs](https://github.com/DivineVirtuousChief/Portfolio-/issues/11)
5. [M5 — Provenance-aware agent memory](https://github.com/DivineVirtuousChief/Portfolio-/issues/12)
6. [M6 — Quality, security, and retrieval evaluation](https://github.com/DivineVirtuousChief/Portfolio-/issues/13)

## Architecture invariants

- Identity and authorization claims originate from trusted server-side components, never model output.
- Tenant and document authorization are enforced before protected content is scored, traversed, reranked, cached, or sent to a model.
- Missing, invalid, expired, or unverifiable security context fails closed.
- Derived artifacts retain source provenance and lifecycle relationships.
- Revocation blocks access immediately; asynchronous physical cleanup must not create an access window.
- Retrieved content is untrusted data, not instructions.
- Agent memory is governed data with owner, purpose, provenance, expiry, and deletion semantics.
- Human and institutional policy owners retain accountability for policy and consequential decisions.

## Definition of production readiness

Production readiness requires more than passing unit tests. It requires an authenticated identity boundary, a policy decision point, tenant-aware adapters for every store, deny-first revocation, auditable lifecycle propagation, measured retrieval quality, privacy controls, operational monitoring, and documented incident/recovery procedures.
