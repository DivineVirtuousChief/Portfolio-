# BGLA | POWER HEAVENLY INTELLIGENCE

## VERITAS ANTE ASSERTIONEM — Truth Before Assertion

# BGLA GitHub Actions Library Charter

- **Document ID:** BGLA-GOV-CHARTER-GHA-001
- **Version:** 0.1.0
- **Status:** Proposed Draft — Pending Institutional Review and Ratification
- **Authority class:** Governance proposal; not an authorization to deploy
- **Applies to:** Reusable GitHub Actions, reusable workflows, policy-as-code, provenance, and CI evidence

## 1. Purpose

This Charter establishes the proposed governance boundary for a reusable BGLA GitHub Actions library. Its purpose is to make common engineering controls consistent, reviewable, testable, and reusable across BGLA repositories without allowing individual consuming repositories to silently redefine institutional policy.

This document is a proposal. Committing it, executing its checks, or opening a pull request does not constitute institutional adoption, legal authority, or ratification.

## 2. Governing principle

**Human-readable governance defines authority and accountability. Machine-enforceable policy defines testable conditions. Evidence demonstrates what was actually evaluated.**

These layers are related but not interchangeable:

1. Governance documents state the controlling principles, decision rights, and approval requirements.
2. Policy-as-code expresses only those requirements that can be represented as explicit, deterministic predicates.
3. Workflow implementations execute the approved policy against identified inputs.
4. Evidence records the inputs, versions, principal, decision, and execution result.
5. Independent review assesses whether the control design and evidence are sufficient.

A passing workflow is not proof that an institution has approved the underlying policy.

## 3. Scope

The proposed library may provide:

- Reusable workflows for CI, release-readiness, and compliance evaluation.
- Composite actions for identity attribution, policy evaluation, provenance generation, evidence registration, and governance-document validation.
- Versioned machine-readable control sets and schemas.
- Automated tests, synthetic fixtures, threat tests, and implementation documentation.

The library does not, by itself, acquire authority to approve policy, accept organizational risk, authorize production deployment, attest to facts outside its evidence, or certify regulatory compliance.

## 4. Document hierarchy

The intended hierarchy is:

1. **Charter** — institutional purpose, authority boundaries, accountability, and governing principles.
2. **Teaching Sheet** — control intent, interpretation, responsibilities, and implementation expectations.
3. **Module** — technical specifications, schemas, interfaces, and testable requirements.
4. **Implementation** — executable workflows, actions, policies, and tests.

Lower-level documents must not silently override higher-level requirements. A conflict must be surfaced as a blocking governance issue and resolved by an authorized human review; automation must not invent the resolution.

## 5. Authority and separation of duties

- Repository maintainers administer code and repository configuration within their granted permissions.
- Policy owners propose and maintain control definitions through reviewed changes.
- Workflow identities are machine principals. Their identity claims do not confer human approval authority.
- Human approvers retain responsibility for decisions assigned to them by organizational policy.
- Independent reviewers assess evidence and control effectiveness without treating implementation authorship as independent assurance.

A GitHub actor, workflow token, OIDC subject, commit signature, or successful job is evidence of a particular identity or event only to the extent cryptographically and contextually verified. None is automatically equivalent to an authorized institutional decision.

## 6. Fail-closed decision rule

For a required control, the decision must be **BLOCK** when a required predicate is false, unknown, missing, malformed, unsupported, unverifiable, stale beyond its defined validity, or evaluated against an untrusted input.

A control may return **PASS** only when every required predicate has been evaluated and satisfied using the specified evidence and policy version. An exception or risk acceptance must be an explicit, attributable, time-bounded human decision under an approved process; it must never be inferred from a missing result.

## 7. Identity, provenance, and evidence

The target design requires:

- OIDC token validation against an explicitly configured issuer, audience, and subject policy.
- Attribution of repository, workflow, ref, commit SHA, run ID, and authenticated principal where available.
- Build provenance that identifies source revision, builder, materials, parameters, and policy version.
- Cryptographic verification of signatures and subject digests before promotion.
- Evidence records that distinguish successful, blocked, skipped, and not-evaluated controls.

A log line or unsigned JSON file is not a cryptographic attestation. A conventional GitHub Actions artifact with an expiry period is not an immutable or append-only evidence ledger. These limitations must be stated wherever such artifacts are used.

## 8. Release boundary

No workflow may deploy, publish a package, create a release, create a release tag, or merge a pull request unless a separately reviewed implementation explicitly defines that capability and its authorization boundary.

The initial library implementation is limited to validation, test, policy evaluation, provenance/evidence preparation, and release-readiness checks. Production promotion remains disabled until identity verification, policy enforcement, provenance verification, environment protection, and human approval controls have been tested and approved.

## 9. Versioning and change control

- Control sets and action interfaces must be versioned.
- Breaking changes require a new major version and migration notes.
- Production consumers should pin reusable workflows and actions to immutable commit SHAs.
- Third-party actions must be pinned to full commit SHAs and reviewed for updates.
- Policy changes require code review, test fixtures, and a documented rationale.
- A version tag is not an approval or assurance certificate.

## 10. Assurance and limitations

Assurance claims must be limited to evidence actually produced. Tests must include negative cases for invalid identity, wrong audience or subject, missing evidence, unknown policy outcomes, digest mismatch, invalid signature, stale provenance, and unauthorized promotion.

No control is described as independently assured until an independent review has occurred and its scope, evidence, findings, and limitations are recorded.

## 11. Ratification

**Status remains Proposed Draft — Pending Institutional Review and Ratification.**

Ratification requires an authorized institutional decision recorded through a separately defined approval process. GitHub merge status, branch protection, workflow success, or maintainer action alone does not constitute ratification.

---

**VERITAS ANTE ASSERTIONEM — Truth Before Assertion.**
