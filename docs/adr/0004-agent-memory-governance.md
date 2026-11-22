# ADR-0004: Governed Agent Memory and Retention

- **Status:** Accepted
- **Date:** 2026-11-22
- **Related:** ADR-0001; Milestone 5 / Issue #12

## Context

Persistent memory can outlive the source, user session, authorization, or purpose that justified its creation. Unlabeled model inference can also be repeated until it appears authoritative.

## Decision

Separate ephemeral session state from persistent user, project, and source-derived memory. Every persistent memory item must have an owner, tenant, purpose, classification, retention policy, expiry/review state, authorization metadata, and provenance or an explicit epistemic label.

Use the labels `source-backed`, `derived`, `user-provided`, and `inferred`. Repetition does not upgrade an inference to a verified fact.

## Controls

- Validate current SecurityContext for every memory operation.
- Apply owner, tenant, purpose, resource ACL, and source permission checks.
- Enforce retention expiry and deletion across replicas and derived stores.
- Deny access immediately after source revocation while invalidation propagates.
- Require explicit human/institutional policy for sensitive memory classes and exceptions.
- Do not let agents extend retention, override deletion, or grant access.

## Consequences

Memory providers must support metadata filtering, lineage, TTL/expiry, deletion, audit, and policy checks. Providers lacking these controls cannot be used for protected persistent memory.

## Validation

Milestone 5 must test tenant/owner isolation, purpose limitation, provenance completeness, inference labeling, expiry, source revocation, and deletion propagation.
