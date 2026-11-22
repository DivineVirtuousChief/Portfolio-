# Knowledge Lifecycle, Provenance, and Cascade Invalidation

## Lifecycle states

A source and its derived artifacts should move through explicit states:

```text
DISCOVERED -> PENDING_APPROVAL -> APPROVED -> INGESTING -> ACTIVE
                                                |          |
                                                v          v
                                            QUARANTINED  STALE
                                                           |
                                                           v
                                                     EXPIRED / REVOKED
                                                           |
                                                           v
                                                        DELETED
```

State transitions must be authorized, auditable, and versioned. A source may be quarantined for parser failure, malware, unsupported format, quality failure, or provenance inconsistency.

## Canonical source record

At minimum, maintain:
- stable source ID and tenant ID;
- source system and connector identity;
- canonical URI or source locator;
- owner and approval status;
- source version, ETag or content hash;
- classification and access policy reference;
- created, discovered, ingested, updated, and checked timestamps;
- freshness policy and expiry;
- parser/normalizer version;
- lifecycle state and last event ID.

## Derived artifact lineage

Every chunk, embedding, graph fact, cache entry, summary, and memory item must be traceable to one or more source IDs and versions. Record transformation type/version, creation time, and content hash where appropriate. Multi-source derivations must retain the complete source set rather than selecting a single convenient citation.

## Idempotency and event processing

Lifecycle events need unique event IDs, source version, tenant, event type, effective timestamp, and policy reference. Consumers must be idempotent. Duplicate delivery must not recreate deleted content or roll back a newer source version. Out-of-order events must be rejected or reconciled against authoritative source version/state.

## Deny-first cascade

When a source is revoked, expires, or is deleted:
1. Commit an authoritative deny/tombstone record.
2. Block query and memory access to all dependent artifacts immediately.
3. Emit an invalidation event to each registered projection.
4. Remove or quarantine chunks, embeddings, graph nodes/edges, caches, summaries, and memory.
5. Collect acknowledgements and retry failures.
6. Reconcile source-to-derived lineage and verify no accessible orphan remains.
7. Record completion evidence and any residual risk.

Physical deletion may be asynchronous; access denial must not be.

## Freshness and quality

Freshness is policy-specific: some knowledge requires event-driven updates, some scheduled polling, and some manual recertification. Quality checks can include parse completeness, source authority, duplication, encoding, schema validation, document integrity, and content review. A failed check must quarantine or downgrade content rather than silently index it.

## Retention and legal hold

Retention is determined by institutional policy, contractual obligations, applicable law, and data classification. Legal holds must be explicit and authorized. A hold may suspend deletion but must not grant broader read access. Deletion requests must be propagated to replicas and derived stores subject to documented legal holds and approved exceptions.

## Operational measures

Track ingestion success, parse failure, duplicate rate, source age, stale artifact count, invalidation queue depth, revocation-to-denial latency, cleanup completion time, orphan artifact count, and reconciliation drift.
