# ADR-0002: Trusted Security Context and Authorization Boundary

- **Status:** Accepted
- **Date:** 2026-11-22
- **Related:** ADR-0001; Milestone 1 / Issue #8

## Context

The original retrieval baseline accepts caller scopes as a method argument. This is useful for a minimal reference implementation but is not an enterprise identity boundary. A production system must bind requests to authenticated subjects and tenants, evaluate current policy, and prevent caller- or model-controlled claims from granting access.

## Decision

Adopt a short-lived, server-created SecurityContext as the standard authorization context passed into every protected Tier 2–4 operation. The TypeScript contract is defined in `agent-knowledge/src/security-context.ts`.

The trusted gateway must authenticate the caller, resolve tenant membership, evaluate policy, and populate the context. Services validate the context and consult the configured policy enforcement/decision mechanism for resource-level access. The context is not a bearer credential and must not contain raw tokens.

## Required semantics

- Tenant and subject are mandatory.
- Roles and scopes originate only from trusted identity/policy sources.
- Context is request-correlated and expires.
- Unknown, invalid, expired, or unverifiable context is denied.
- Resource-level ACL and action checks are distinct from structural context validation.
- Cross-tenant administrative access requires explicit delegated policy and audit.
- Cache, index, graph, and memory operations must apply the same policy semantics.

## Rejected alternatives

- **Model-supplied roles/scopes:** rejected because prompts and model output are untrusted.
- **Ingestion-only ACL filtering:** rejected because permissions can change and derived artifacts persist.
- **Post-retrieval filtering only:** rejected because unauthorized content can affect ranking, traces, caches, or context.
- **Long-lived ambient service credentials:** rejected as the sole user authorization mechanism because they erase end-user boundaries.

## Consequences

The system requires a trusted identity gateway and policy service before production use. Existing scope-only APIs are transitional and must be adapted behind an authenticated boundary before they are treated as production-safe. The current validator checks shape and time only; it does not verify signatures or make policy decisions.

## Validation

Milestone 1 must prove fail-closed behavior, zero cross-tenant and unauthorized retrieval, pre-scoring enforcement, and revocation behavior using synthetic tests.
