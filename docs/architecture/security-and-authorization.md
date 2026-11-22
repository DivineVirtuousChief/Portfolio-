# Security and Authorization Model

## Security objectives

1. Prevent cross-tenant disclosure.
2. Prevent document-level unauthorized access.
3. Ensure identity and permissions cannot be forged by an agent or prompt.
4. Prevent stale indexes and derived memory from bypassing revocation.
5. Produce auditable access decisions without leaking protected content.

## SecurityContext

The TypeScript contract is [`SecurityContext`](../../agent-knowledge/src/security-context.ts). It carries tenant and subject identifiers, roles, effective scopes, authorization version, request correlation, issuance/expiry times, and authentication method.

The current `assertValidSecurityContext` function checks structural and temporal invariants only. It is not a JWT/SAML/OIDC verifier, authorization engine, policy decision point, or proof that claims are trustworthy.

### Issuance rules

- Create the context only after authentication and policy evaluation at a trusted server boundary.
- Resolve tenant membership and effective permissions from authoritative identity/policy sources.
- Do not accept tenant IDs, roles, scopes, or authorization versions from model output.
- Do not accept client-supplied context as authoritative.
- Keep bearer tokens, secrets, and raw credentials out of the context.
- Use short-lived contexts and define clock-skew behavior.
- Bind context to a request and, where needed, audience/service identity.

## Authorization decision model

A protected operation is allowed only when all required predicates hold:

`authenticated(subject) AND active(tenant) AND member(subject, tenant) AND permitted(subject, action, resource, purpose) AND context_valid`

The policy engine should support at least:
- subject identity and service identity;
- tenant boundary;
- roles and effective scopes;
- resource/document ACLs;
- action (read, ingest, update, delete, export, administer);
- purpose or workload context where required;
- source classification and lifecycle state;
- policy version and decision timestamp.

Deny is the default. A broad role must not implicitly bypass tenant boundaries. Administrative cross-tenant access, if permitted at all, must be explicit, separately authorized, time-bound, justified, and audited.

## Enforcement points

Authorization must be enforced:
- before ingestion reads or transforms protected source content;
- before writes to tenant-scoped indexes;
- before lexical/vector candidate scoring;
- before graph node/edge expansion;
- before reranking and context assembly;
- before cache hits are returned;
- before memory reads, writes, summaries, or exports;
- again at the final response boundary for sensitive actions.

Post-filtering alone is insufficient because unauthorized content may already influence scores, traces, caches, model context, or side channels.

## Cache and index requirements

Cache keys must include tenant and effective authorization context or policy version. A cache hit must still be subject to current authorization and revocation state. Vector and graph stores must expose tenant-aware filtering and must not depend on client-side filtering after retrieval. Store isolation, namespace isolation, and application policy checks should be layered where supported.

## Revocation semantics

Permission revocation is effective at the authoritative policy boundary immediately. The system must deny subsequent reads before asynchronous cleanup finishes. Tombstones or deny lists should be consulted by query paths until all projections are reconciled. Revocation latency, cleanup completion, and exceptions must be measured and audited.

## Audit requirements

Record request ID, subject/service, tenant, action, resource identifier, policy version, decision, decision reason code, timestamp, and enforcement point. Avoid logging document bodies, PHI, secrets, access tokens, or sensitive prompts. Restrict audit-log access and apply retention rules.

## Security testing

Use synthetic fixtures to test:
- cross-tenant isolation;
- document ACL enforcement;
- empty/missing/expired context;
- forged scopes and tenant claims;
- policy-service outage;
- revoked access with stale index/cache/memory copies;
- graph traversal through unauthorized intermediate nodes;
- prompt injection in retrieved passages;
- timing and error behavior that could reveal protected resource existence.
