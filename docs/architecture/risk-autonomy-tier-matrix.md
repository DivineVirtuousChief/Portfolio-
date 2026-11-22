# BGLA Risk & Autonomy Tier Matrix

- **Document ID:** BGLA-MATRIX-001
- **Version:** 0.1.0-draft
- **Status:** Proposed baseline — pending Charter ratification
- **Parent:** [BGLA Constitutional Governance Charter](../CHARTER.md)

## 1. Classification model

BGLA uses two independent classification axes:

1. **Autonomy level (L1–L3):** what the system is permitted to do.
2. **Risk tier (R0–R4):** the potential impact of failure, misuse, compromise, or unintended action.

The axes must never be collapsed into one score. A system receives both classifications. The more restrictive requirement governs. Risk classification must consider intended use, affected parties, data sensitivity, scale, reversibility, exposure, and foreseeable misuse.

Until formally approved, these tiers are a proposed BGLA internal governance model, not a regulatory classification or externally certified standard.

## 2. Autonomy levels

| Level | Name | Permitted behavior | Prohibited behavior | Human control |
|---|---|---|---|---|
| L1 | Advisory | Read-only retrieval, analysis, summarization, recommendations | External actions, writes, state transitions, tool execution that changes state | Human performs every action |
| L2 | Bounded Assist | Draft artifacts, proposed changes, plans, and review packages; read-only tool use where authorized | Any state-changing operation or external action without prior human approval; self-approval | Human approval before every state-changing operation and external action |
| L3 | Governed Automation | Execute a narrow allowlist of pre-approved operations inside a valid OperatingEnvelope | Self-expansion, policy changes, privilege escalation, envelope modification, prohibited actions, bypass of human gates | Human approves delegation and retained sign-off states; continuous controls and revocation |

### Autonomy invariants

- L1 is the default until a system owner obtains approval for a different level.
- Classification applies to a specific deployment, version, purpose, tenant, and environment.
- An agent cannot assign or elevate its own autonomy level.
- L3 is not unrestricted autonomy; it is constrained execution under delegated authority.
- Human approval cannot legalize an otherwise prohibited action.
- A change in model, tools, data, permissions, purpose, or environment triggers classification review.

## 3. Risk tiers

The following tiers are proposed qualitative categories. Assign the highest tier reasonably implicated by credible impact scenarios. If evidence is incomplete or classification is disputed, use the more restrictive tier.

| Risk tier | Description | Illustrative impact | Minimum governance response |
|---|---|---|---|
| R0 — Minimal | Bounded, reversible activity with negligible impact and no protected data | Formatting public information; local draft organization | Documented owner, basic testing, ordinary access controls |
| R1 — Low | Limited impact, readily reversible, narrow data and user scope | Internal recommendations using non-sensitive data | Named owner, least privilege, logging, routine review |
| R2 — Moderate | Meaningful operational, privacy, financial, or service impact; recoverable with planned intervention | Internal workflow updates; handling confidential business data | Documented risk assessment, explicit scope, tested rollback, designated human approval for material changes |
| R3 — High | Significant harm, rights impact, sensitive data exposure, material financial/legal consequences, or difficult recovery | Decisions affecting individuals, privileged production operations, regulated or sensitive workflows | Formal risk review, separation of duties, independent security/safety assessment, explicit human authorization for consequential actions |
| R4 — Critical / restricted | Potential for severe, widespread, irreversible, safety-critical, or catastrophic harm | Physical actuation with serious safety consequences; uncontrolled propagation; high-consequence autonomous decisions | Prohibited by default pending exceptional institutional and legal review; independent assurance, validated containment, explicit senior authorization, continuous monitoring, and documented recovery |

R4 designation does not mean an activity becomes permitted after paperwork. Applicable law, policy, safety requirements, and prohibited-use rules remain controlling.

## 4. Combined autonomy and risk controls

| Combination | Default posture | Approval and controls |
|---|---|---|
| L1 + R0/R1 | Permitted after basic registration | Read-only scope, owner, ordinary monitoring |
| L1 + R2 | Controlled | Data authorization, privacy review, output limitations, audit |
| L1 + R3/R4 | Restricted | Formal review; no consequential reliance without qualified human review |
| L2 + R0/R1 | Permitted within approved scope | Draft-only or reversible workflow; human gate for writes |
| L2 + R2 | Controlled | Named approver, explicit action preview, rollback, audit |
| L2 + R3 | Restricted | Independent review and explicit human authorization for each consequential action |
| L2 + R4 | Prohibited by default | Exceptional review; no delegation by implication |
| L3 + R0 | Eligible for bounded automation | Approved allowlist, envelope, monitoring, revocation |
| L3 + R1 | Controlled automation | Tested envelope, identity and policy enforcement, audit, rollback |
| L3 + R2 | Restricted automation | Formal approval, independent control review, constrained tools, continuous monitoring, human gates |
| L3 + R3 | Exceptional / generally human-gated | Senior authorization, independent assurance, narrow scope, human approval for consequential actions |
| L3 + R4 | Prohibited by default | No autonomous execution absent exceptional legal and institutional authorization and validated safety case |

These combinations are baseline guidance. A domain-specific law, policy, or safety standard may impose stricter controls.

## 5. Consequential-action triggers

Human approval is required before an action that:

- changes a protected or production system's security posture;
- creates, expands, or revokes privileged access;
- crosses tenant, jurisdiction, or data-classification boundaries;
- publishes, transmits, or externally commits information;
- makes or materially influences a legal, financial, employment, healthcare, or rights-affecting decision;
- changes an individual's record or status in a consequential way;
- initiates an irreversible or difficult-to-reverse operation;
- actuates physical, biological, chemical, or environmental processes;
- changes model autonomy, policy, tools, operating envelope, or retention rules.

A system's configured list of human-signoff states is additive; it cannot narrow this baseline or override applicable policy.

## 6. Mandatory classification record

Every governed deployment must record:

| Field | Required content |
|---|---|
| system_id / deployment_id | Stable system and deployment identifiers |
| owner | Accountable human system owner |
| purpose | Approved intended use and excluded uses |
| autonomy_level | L1, L2, or L3 |
| risk_tier | R0, R1, R2, R3, or R4 |
| tenant and jurisdiction | Approved tenant and allowed jurisdictions |
| data classification | Data categories the system may access or produce |
| permitted tools/actions | Explicit allowlist |
| human approval states | Consequential actions and required approver |
| operating envelope | Versioned envelope reference and expiry |
| risk assessment | Inherent and residual risk, rationale, mitigations |
| evidence references | Test, review, validation, and assurance artifacts |
| approval | Approver, timestamp, scope, expiry, and decision reference |
| review trigger | Expiry, incident, material change, or policy update |

## 7. URI threshold handling

A URI threshold is not a substitute for risk classification. If the Phase 3 OperatingEnvelope uses a value such as `max_uri_threshold = 75.0`, the implementation must first document:

- the full name and meaning of URI;
- what is measured and why it predicts a relevant risk;
- the numeric scale, directionality, and aggregation method;
- the source, calculation version, and measurement time window;
- validation evidence, false-positive/false-negative behavior, and threshold owner;
- the response to missing, stale, invalid, or threshold-exceeding values.

If the approved contract defines `URI >= 75` as a containment trigger, equality is included: values at or above the threshold deny or quarantine the operation. Until the metric is defined and validated, the numeric value is a proposed configuration only, not an established safety standard. Missing or invalid values fail closed for operations that depend on URI.

## 8. Reclassification and review

Reassess autonomy and risk when any of the following occurs:

- new model, model version, or materially changed behavior;
- new tools, permissions, data sources, or external integrations;
- expansion to another tenant, jurisdiction, population, or use case;
- changes to memory, retention, or data classification;
- security incident, safety incident, near miss, or control failure;
- material changes in scale, reversibility, exposure, or impact;
- expiration of approval or operating envelope.

A reclassification cannot take effect until approved by the authority required for the new classification.

## 9. Decision rule

The effective permission set is the intersection of:

`Institutional Policy ∩ Authenticated Identity ∩ Resource ACL ∩ Approved Purpose ∩ Jurisdiction ∩ Autonomy Level ∩ OperatingEnvelope ∩ Safety Controls`

Any deny, missing mandatory input, conflict, or unverifiable claim results in denial or safe suspension.

**VERITAS ANTE ASSERTIONEM — Truth Before Assertion.**
