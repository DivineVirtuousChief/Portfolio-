# Retrieval and Reasoning Architecture

## Retrieval stages

1. Request validation and SecurityContext validation.
2. Policy evaluation and tenant/resource filter construction.
3. Authorized lexical and semantic candidate retrieval.
4. Candidate deduplication and source-version reconciliation.
5. Hybrid fusion and optional reranking.
6. Provenance and quality checks.
7. Final authorization/revocation check.
8. Citation-bearing context assembly.
9. Delivery to the agent as untrusted reference data.

Authorization constraints are part of candidate generation, not a cleanup step after scoring.

## Retrieval modes

- **Lexical:** exact terms, identifiers, phrases, and deterministic baseline matching.
- **Semantic:** embedding similarity for conceptual or paraphrased queries.
- **Hybrid:** merge lexical and semantic candidates, apply metadata constraints, fuse ranks, and rerank within the authorized candidate set.
- **Graph:** traverse entities and relationships with tenant and ACL enforcement at every hop.

A provider-neutral interface should keep the application independent of a specific vector database, embedding model, search engine, or graph provider.

## Ranking and explainability

Record retrieval strategy, model/index version, policy version, candidate source IDs, score components, and final rank in safe telemetry. Do not expose unauthorized candidate details in logs or diagnostics. Ranking scores are relevance signals, not truth or authority scores.

## Knowledge graph safeguards

- Every node and edge carries tenant, ACL, provenance, source version, and lifecycle status.
- Authorize each node and edge before expansion.
- Bound depth, fan-out, query time, and result count.
- Do not allow a visible starting node to reveal restricted adjacent nodes through counts, labels, or path metadata.
- Remove or deny stale graph facts after source revocation.

## Context assembly

Only authorized, active, quality-qualified chunks may enter model context. Each passage should be delimited as quoted/reference material and paired with source citation metadata. Instructions embedded in source documents are data, not agent instructions. Context assembly must enforce token budgets without dropping provenance.

## Evaluation

Use a versioned synthetic benchmark with representative exact lookup, paraphrase, multi-hop, stale-source, ambiguous, and adversarial queries. Measure recall@k, precision@k, reciprocal rank or nDCG, citation correctness, answer support, freshness, latency, and authorization leakage. A higher relevance score never compensates for an authorization failure.
