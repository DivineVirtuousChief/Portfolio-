# BGLA | POWER HEAVENLY INTELLIGENCE

## VERITAS ANTE ASSERTIONEM — Truth Before Assertion

# Teaching Sheet: Governed GitHub Actions Library

- **Document ID:** BGLA-GOV-TEACH-GHA-001
- **Version:** 0.1.0
- **Status:** Proposed Draft — Pending Charter Ratification
- **Parent:** BGLA-GOV-CHARTER-GHA-001

## 1. Learning and implementation objective

Consuming repositories should call shared, reviewed controls rather than independently copy identity, policy, provenance, or evidence logic. The library is the common implementation point; each repository supplies its application-specific tests, artifacts, and declared control set.

## 2. Five proposed control actions

| Action | Responsibility | Required blocking behavior |
|---|---|---|
| `verify-identity` | Validate GitHub OIDC JWT issuer, audience, subject, and run context; emit a normalized principal record | Block if token, claims, trust policy, or run attribution cannot be verified |
| `policy-gate` | Evaluate a versioned control set against schema-validated evidence | Block on false, unknown, missing, malformed, unsupported, or unverifiable required predicates |
| `attest-build` | Generate provenance for a specific subject digest and build context; sign and verify it using an approved trust mechanism | Block promotion if provenance or signature is absent, invalid, or mismatched |
| `compliance-register` | Record control decision, evidence references, policy version, principal, run context, and timestamp | Block if the required record cannot be durably written and independently checked; do not claim append-only guarantees without enforcing storage controls |
| `validate-governance` | Validate required metadata, document IDs, versions, status, and parent-child references | Block if controlling documents are missing, malformed, or inconsistent |

These are target contracts, not claims that all five actions are already implemented in this repository.

## 3. Proposed reusable workflows

### CI

`verify-identity → validate-governance → test → policy-gate → attest-build`

The CI workflow validates source and produces provenance. It does not deploy.

### Release readiness

`verify-identity → policy-gate → verify-provenance → compliance-register → human approval`

The initial implementation stops before deployment or publication. Promotion is a future capability requiring a separate authorization design.

### Compliance evaluation

Scheduled or manually dispatched evaluation of declared controls. It records pass, block, skip, and not-evaluated states. It has no deployment authority.

## 4. Minimum interface contracts

Every action must include:

- `action.yml` with explicit inputs, outputs, and runtime.
- A README describing purpose, trust assumptions, permissions, failure behavior, and examples.
- Input validation and deterministic output semantics.
- Positive and negative tests using synthetic fixtures.
- A threat-model section covering untrusted pull-request inputs and token exposure.
- A versioned compatibility statement.

Outputs are evidence of the action's execution, not independent proof of institutional compliance.

## 5. Policy decision semantics

Use three distinct outcomes:

- **PASS:** all required predicates were evaluated and satisfied.
- **BLOCK:** at least one required predicate failed or could not be verified.
- **NOT_EVALUATED:** the control was not run or its prerequisites were unavailable.

A skipped check must never be represented as PASS. A warning is not a substitute for a required gate. Exceptions require an explicit human authorization record with scope, rationale, approver, and expiry.

## 6. Security baseline

- Set workflow-level and job-level permissions explicitly; default to read-only.
- Grant `id-token: write` only to the job that requests OIDC.
- Do not pass `secrets: inherit` unless the called workflow demonstrably needs each inherited secret.
- Pin third-party actions to full 40-character commit SHAs.
- Treat pull-request content, artifacts, issue text, and generated files as untrusted input.
- Do not use privileged `pull_request_target` workflows to execute untrusted branch code.
- Separate build and deployment identities; do not grant deployment credentials to ordinary CI.
- Verify artifact digests and attestation signatures before any future promotion.
- Keep production environments protected by repository rules and required human reviewers.

## 7. Evidence integrity

A compliance record should identify at minimum: control ID, control-set version, decision, evaluation timestamp, repository, workflow, run ID, source SHA, principal reference, evidence digest(s), and evaluator version.

An append-only claim requires an independently enforced storage property, such as write-once retention or a separately controlled ledger with verifiable chaining. A normal GitHub artifact or mutable file is not append-only merely because the workflow only appends to it.

## 8. Current repository implementation boundary

The existing branch already contains cross-cutting workflows for Node package CI, CodeQL, secret scanning, dependency review, API contract validation, issue triage, PR governance, documentation quality, release-readiness dry runs, and CI-run metadata archiving.

Those workflows are useful library infrastructure, but they do not by themselves implement the five proposed actions above. In particular, metadata archiving is not signed provenance, and current CI success is not proof of OIDC identity verification or immutable evidence retention.

## 9. Acceptance criteria for the next implementation module

- [ ] Five action directories have documented, versioned contracts.
- [ ] OIDC validation tests cover issuer, audience, subject, expiry, and repository/ref mismatch.
- [ ] Policy tests prove unknown and missing values block.
- [ ] Provenance is bound to a subject digest and cryptographically verified.
- [ ] Evidence records preserve decision and source context; storage guarantees are accurately described.
- [ ] Governance validation checks hierarchy and required metadata.
- [ ] All reusable workflows have minimal permissions and no implicit deployment authority.
- [ ] Negative tests demonstrate that failed controls cannot reach promotion steps.
- [ ] CI results are reported from actual GitHub Actions runs, not inferred from configuration.

---

**VERITAS ANTE ASSERTIONEM — Truth Before Assertion.**
