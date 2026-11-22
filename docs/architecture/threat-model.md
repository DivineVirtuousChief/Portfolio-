# Threat Model and Assurance Plan

## Scope

This threat model covers source connectors, ingestion workers, lexical/vector/graph stores, caches, retrieval services, context assembly, agent memory, and tool/action boundaries.

## Assets

- Tenant and subject identity claims.
- Source documents and metadata.
- Chunks, embeddings, graph facts, caches, summaries, and memory.
- Authorization policies and revocation state.
- Citations, audit events, and evaluation evidence.
- Connector credentials and service identities.

## Threat scenarios and required mitigations

| Threat | Example | Required mitigation |
|---|---|---|
| Cross-tenant leakage | Query returns another tenant's chunk | Tenant isolation in policy and every storage adapter; adversarial CI tests |
| ACL bypass | Unauthorized chunk enters model context | Pre-retrieval authorization and final context re-check |
| Prompt injection | Source text instructs agent to reveal secrets | Treat retrieved content as untrusted data; isolate instructions from evidence |
| Stale authorization | Revoked document remains in vector index | Deny-first tombstones and cascade invalidation |
| Identity spoofing | Model supplies elevated scopes | Server-issued SecurityContext only; trusted token validation |
| Cache side channel | Cache key omits tenant/policy version | Tenant/policy-aware cache keys and reauthorization on cache hit |
| Graph inference | Restricted edge exposed through path metadata | Per-hop authorization and bounded traversal |
| Memory persistence abuse | Prompt causes unauthorized long-term write | Memory policy, purpose limitation, provenance, approval gates |
| Connector compromise | Source credentials exfiltrated | Secret manager, least privilege, rotation, isolated workers |
| Audit leakage | Sensitive text written to logs | Metadata-only logs, redaction, access control, retention |
| Provider failure | Policy service unavailable | Fail closed for protected access; controlled degraded mode |
| Data resurrection | Retry reindexes deleted content | Versioned idempotent events and authoritative tombstones |

## Assurance gates

### Design review
- Threat model reviewed for every new connector, store, model, and memory adapter.
- Trust boundaries and data classification documented.
- Authorization and deletion semantics specified before integration.

### CI and automated tests
- Cross-tenant and ACL tests are blocking.
- Revocation tests include stale index, cache, graph, and memory projections.
- Prompt-injection fixtures are synthetic.
- Dependency and secret scanning are enabled by repository policy where available.

### Operational assurance
- Monitor denied access, policy errors, revocation lag, orphan artifacts, and connector failures.
- Alert on unexpected tenant mismatch, policy-version drift, and failed deletion reconciliation.
- Maintain incident response, credential rotation, backup restoration, and audit retention procedures.

## Residual risk

No single test suite proves the absence of all disclosure. Passing tests provide bounded evidence against defined scenarios. Production assurance requires independent review, representative workload testing, operational monitoring, and periodic revalidation.
