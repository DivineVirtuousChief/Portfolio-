# ADR-0003: Provenance and Deny-First Lifecycle Invalidation

- **Status:** Accepted
- **Date:** 2026-11-22
- **Related:** ADR-0001; Milestone 2 / Issue #9; Milestone 5 / Issue #12

## Context

Knowledge is copied into chunks, embeddings, graph facts, caches, summaries, and memories. Updating or deleting the original source without invalidating derived artifacts can expose stale or unauthorized information.

## Decision

Every derived artifact must carry source lineage and lifecycle metadata. Source update, expiry, revocation, and deletion events use an authoritative deny-first tombstone followed by asynchronous, idempotent propagation to all registered projections.

## Required lineage

At minimum: tenant ID, source ID, source version, canonical locator, source content hash, transformation type/version, artifact ID, creation time, lifecycle state, and event correlation. Multi-source artifacts retain all contributing sources.

## Event semantics

- Events have unique IDs and monotonically comparable source versions or equivalent concurrency controls.
- Consumers are idempotent and reject stale/out-of-order events.
- Tombstone state blocks reads immediately.
- Physical deletion and index cleanup may be asynchronous but must be reconciled.
- Legal holds are explicit, authorized, and do not grant read access.
- Re-ingestion cannot resurrect a deleted version without a new approved source state.

## Consequences

Adapters need lineage storage, event processing, retry handling, tombstone checks, and reconciliation jobs. Operational metrics must include denial latency, cleanup time, failed events, and orphan artifact count.

## Validation

Milestone 2 and Milestone 5 tests must demonstrate that source revocation/deletion blocks dependent chunks, embeddings, graph projections, caches, summaries, and memory. Tests must include duplicate, delayed, and out-of-order events.
