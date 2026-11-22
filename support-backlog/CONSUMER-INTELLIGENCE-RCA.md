# BGLA Consumer Intelligence & Root Cause Analysis (RCA)

**Status:** implementation slice prepared for review. No consumer-derived GitHub issue is created or published by this module.

## Purpose

Extend the Support-to-Backlog foundation with typed consumer case intelligence, evidence provenance, structured RCA, corrective/preventive action contracts, and traceable draft backlog generation.

## Source case preserved

- Consumer case: `CI-000104`
- Source reference: `support://case-104`
- Original-language statement: `No puedo descargar mi factura. La aplicación muestra un error.`
- Caller-confirmed language: Spanish (`es`)
- Product area: billing portal
- Consumer-reported impact: unable to access invoice
- Evidence references: transcript reference and system-log reference are represented as identifiers only; no raw consumer record is embedded.

## RCA status

**Pending validation.** The session-refresh explanation is a hypothesis, not a confirmed root cause. The implementation requires evidence references, reviewer identity, timestamp, rationale, and a decision before marking a hypothesis validated or rejected. The local domain guard does not authenticate the reviewer or authorize the decision; a trusted service must do that.

## Evidence and provenance rules

- Original-language consumer statements are stored separately from model inferences.
- Translations are distinct evidence items and may point to the original evidence using `translationOfEvidenceId`.
- Evidence references include source reference, capture time, access scope, and optional integrity digest.
- Generated backlog drafts retain source-case references and evidence IDs.
- Missing or cross-tenant evidence references fail closed.
- No raw audio, transcript, PHI, payment data, credentials, or other sensitive content is included in this sample.

## RCA methods

- 5 Whys: ordered steps with evidence IDs and explicit support status.
- Fishbone: candidate factors across people, process, technology, data, environment, policy, and measurement.
- Hypotheses: proposed, under investigation, validated, or rejected; validation requires an explicit review decision.

## CAPA

CorrectiveAction contracts distinguish corrective from preventive work and track owner role, due date, status, and completion evidence. Completion is not the same as verified effectiveness.

## Backlog boundary

The generator produces a draft only. It does not call GitHub, Jira, or another tracker. RCA validation status is preserved in the generated artifact; pending validation is never silently promoted to confirmed root cause.

## Known limitations

- Evidence storage, cryptographic integrity verification, authentication, authorization, tenant-scoped persistence, and audit event storage are not implemented here.
- The reviewer ID is a caller-supplied field, not proof of identity.
- No production RCA engine, causal inference, voice provider, translation service, or customer data connector is included.
- CAPA contracts are defined; workflow persistence and effectiveness verification are not implemented.
- The sample case and telemetry references are illustrative.
