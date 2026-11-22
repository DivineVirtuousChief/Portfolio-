# BGLA Constitutional Governance Charter

- **Document ID:** BGLA-CHARTER-001
- **Version:** 0.1.0-draft
- **Status:** Proposed baseline — pending formal institutional ratification
- **Applies to:** BGLA-governed AI agents, knowledge infrastructure, tools, data operations, and autonomous or semi-autonomous systems
- **Governing principle:** **VERITAS ANTE ASSERTIONEM — Truth Before Assertion**

> This document is a proposed governance baseline. It is not represented as signed, ratified, legally binding, or independently certified. Formal adoption requires approval by the authorized institutional owner and preservation of the approval record.

## 1. Purpose and constitutional order

This Charter establishes the authority model that precedes implementation of runtime policy, operating envelopes, containment, evidence ledgers, and release gates.

The constitutional implementation order is:

1. Governance Charter and system classification.
2. SovereignAccessControl policy interface.
3. Operating-Envelope specification.
4. Safety and containment requirements.
5. Evidence ledger and traceability model.
6. Independent assurance and authorization gates.

Technical implementation must conform to this order. A runtime service, model, tool, agent, workflow, or repository cannot create or enlarge its own authority.

## 2. Governing principles

1. **Human and institutional authority:** Legitimate human and institutional owners establish policy, delegate bounded authority, accept residual risk, and approve consequential decisions.
2. **Evidence before assertion:** Claims about capability, safety, compliance, and readiness require traceable evidence.
3. **Least privilege:** Each subject, agent, service, and tool receives only the permissions required for an approved purpose.
4. **Tenant and jurisdiction sovereignty:** Protected data and operations remain within approved tenant, legal, contractual, and jurisdictional boundaries.
5. **Fail-closed behavior:** Missing, malformed, expired, conflicting, or unverifiable authority or policy information results in denial or safe suspension.
6. **Separation of duties:** Where risk warrants, the proposer, implementer, approver, operator, and independent assessor must be distinct.
7. **Reversibility and containment:** Delegated execution must have bounded scope, monitoring, interruption, and recovery appropriate to the system's physical and digital properties.
8. **Lifecycle accountability:** Authorization, provenance, retention, revocation, incident handling, and decommissioning remain governed throughout the lifecycle.
9. **No self-authorization:** An agent cannot grant itself permissions, alter its classification, accept its own risk, approve its own release, or override institutional policy.

## 3. Authority model

### 3.1 Human & Institutional Authority

The authorized institutional owner retains accountability for:

- approving intended purpose and system classification;
- defining policy, risk appetite, prohibited uses, and jurisdictional constraints;
- appointing accountable system, data, security, and operational owners;
- approving delegation and consequential state transitions;
- accepting residual risk within formally delegated authority;
- suspending, withdrawing, or revoking authorization;
- approving material changes to this Charter and its associated control standards.

### 3.2 Delegated roles

| Role | Responsibility | Cannot do |
|---|---|---|
| Institutional policy owner | Approve policy, risk appetite, and delegation | Delegate away ultimate institutional accountability |
| System owner | Maintain system purpose, classification, inventory, and operating envelope | Unilaterally approve prohibited or out-of-scope uses |
| Security/policy administrator | Configure identity, ACL, RBAC/ABAC, and policy rules | Grant access without approved authority |
| Human approver | Approve specified consequential actions | Approve outside delegated authority |
| Operator | Execute approved procedures and respond to incidents | Expand scope or bypass controls |
| Independent assessor | Evaluate evidence and control effectiveness | Approve its own implementation as independent assurance |
| Agent or automated service | Execute only explicitly delegated operations | Create permissions, elevate autonomy, accept risk, or override gates |

Role assignments must identify an accountable person or formally governed service identity. Production identity and role resolution must occur through trusted server-side systems.

### 3.3 Human approval

Human approval is mandatory for actions designated by policy as consequential, including actions that are irreversible, safety-critical, externally binding, financially material, legally significant, materially affect an individual's rights, alter security posture, or expand a system's authority.

Approval must be attributable, purpose-bound, time-bounded where appropriate, and recorded. A generic prompt acknowledgement is not sufficient evidence of institutional authorization.

## 4. System autonomy classification

Autonomy classification describes what a system may do, not how risky its use is. The canonical L1–L3 definitions are in [Risk and Autonomy Tier Matrix](architecture/risk-autonomy-tier-matrix.md).

- **L1 — Advisory:** Read-only retrieval, analysis, recommendations, and explanations. A human performs all external or state-changing actions.
- **L2 — Bounded Assist:** The system may prepare drafts, proposed changes, and execution plans. A human approval gate is required before every state-changing operation and every external action.
- **L3 — Governed Automation:** The system may execute only explicitly delegated, pre-approved operations within a valid OperatingEnvelope. It cannot expand its envelope, alter its own classification, or perform actions reserved for human approval.

L1 is the default classification until an authorized owner approves another level. Classification is assigned to a defined system version, deployment, purpose, tenant, and operating context; it is not a permanent blanket permission.

## 5. Risk classification and acceptance

Risk classification is separate from autonomy classification. A low-autonomy system may still create high-impact risk; a highly automated system may be restricted to low-impact tasks. Both classifications must be recorded.

- Inherent risk is assessed before controls.
- Residual risk is assessed after controls and evidence.
- Risk acceptance belongs to an authorized human or institutional owner.
- Critical or prohibited risk cannot be made acceptable merely by assigning a higher autonomy tier or documenting an exception.
- Risk acceptance must identify scope, rationale, evidence, owner, expiry/review date, and compensating controls.

The R0–R4 model and required approval levels are defined in the matrix. Where a risk falls between categories or evidence is insufficient, use the more restrictive category.

## 6. Policy and access sovereignty

All protected operations must be subject to a trusted policy decision and enforcement boundary.

The SovereignAccessControl implementation must support, as applicable:

- authenticated subject and service identity;
- tenant isolation and explicit resource ownership;
- RBAC and ABAC attributes;
- effective scopes and resource ACLs;
- action and purpose constraints;
- jurisdiction and data-residency restrictions;
- policy version, decision reason, and audit correlation;
- expiry, revocation, and fail-closed behavior.

Identity claims, tenant identifiers, roles, scopes, and authorization versions must originate from trusted authentication and policy services. User prompts, model output, tool arguments, and untrusted retrieved content cannot establish authority.

A structural SecurityContext validator is not an identity provider, policy decision point, or proof of authorization.

## 7. Operating-envelope authority

Every L3 deployment, and any L1/L2 deployment with material automated access to protected resources, must have an approved OperatingEnvelope before runtime enforcement is considered complete.

At minimum, the envelope must define:

- envelope and system identifiers;
- accountable owner and approved purpose;
- tenant and allowed jurisdictions;
- classification and risk tier;
- permitted tools, actions, resources, and data classifications;
- memory purpose, retention, and maximum TTL;
- URI metric definition, measurement source, scale, threshold, and response;
- required human-signoff states;
- expiry, revocation, and change-control requirements.

An envelope is a constraint, not a grant of authority. It cannot override law, institutional policy, user consent requirements, resource ACLs, or higher-priority safety controls.

### URI threshold qualification

A numeric threshold such as URI >= 75 may be configured as a deny/quarantine trigger only after the URI metric has a documented definition, unit or scale, calculation method, source, version, and validation evidence. This Charter does not assume that URI is a universal or externally standardized metric. An undefined or unavailable URI value must not be treated as a safe score.

## 8. Safety, containment, and incident authority

Systems must have safety controls proportionate to their risk and operating environment. Controls may include isolation, safe-state transitions, circuit breakers, revocation, quarantine, shutdown, rollback, and recovery procedures.

Containment triggers must be explicit, testable, and auditable. A safety response may suspend operations without waiting for normal approval when required to prevent imminent harm or unauthorized access. Restart or release from quarantine requires the approval defined by the risk tier and incident procedure.

Software shutdown is not presumed to physically contain a biological, chemical, or material system. Physical systems require validated physical containment, recovery, and disposal controls.

## 9. Evidence, provenance, and audit

Every consequential decision and protected operation must be traceable to evidence appropriate to its risk.

The evidence model should link:

`audit_trace_id → source_ids → artifact_hashes → decision_id → approver`

Evidence records should include, as applicable:

- actor and service identity;
- tenant, system, version, and envelope identifiers;
- action, resource, purpose, and jurisdiction;
- policy and classification versions;
- decision, reason code, and timestamp;
- source identifiers and source versions;
- artifact hashes and validation results;
- approval, exception, incident, and corrective-action references.

Logs must not expose secrets, bearer tokens, protected content, or unnecessary personal data. Cryptographic integrity controls do not by themselves prove completeness, truth, legal admissibility, or immutability; key management, access control, retention, independent verification, and storage threat models remain necessary.

## 10. Change control and suspension

A material change requires reassessment before release. Material changes include changes to model or system behavior, tools, permissions, data sources, memory retention, jurisdiction, deployment environment, operating envelope, autonomy level, or intended purpose.

Authorization must be suspended or re-evaluated when:

- identity or policy integrity cannot be established;
- tenant or jurisdiction boundaries are breached;
- the system acts outside its approved envelope;
- a required safety control fails;
- evidence is missing, corrupted, or unverifiable;
- an incident or material change invalidates the prior assessment;
- the approval or envelope expires or is revoked.

Exceptions must be explicit, scoped, time-limited, justified, approved by the correct authority, and recorded. No emergency exception may authorize prohibited activity or silently bypass legal requirements.

## 11. Independent assurance

Independent assurance evaluates whether the system conforms to approved policy and whether controls work as claimed. It must distinguish:

- documented or administratively addressed controls;
- technically implemented and tested controls;
- independently verified control effectiveness;
- residual risks formally accepted by an authorized owner.

A CI pass is evidence that specified automated checks passed; it is not a complete security certification, legal opinion, or production-readiness determination.

## 12. Constitutional implementation sequence and Phase 1 exit gate

| Phase | Required artifact | Exit evidence |
|---|---|---|
| 1 | This Charter and Risk/Autonomy Tier Matrix | Formal ratification, named accountable owner, recorded signatory, approved classification and risk appetite |
| 2 | SovereignAccessControl protocol and SecurityContext | Policy decision and enforcement tests; tenant and resource isolation |
| 3 | OperatingEnvelope schema and validator | Machine-readable bounds and negative tests |
| 4 | Containment policy and circuit breakers | Tested quarantine, safe-state, and recovery triggers |
| 5 | Evidence ledger and traceability model | Verified lineage, integrity, access, and retention controls |
| 6 | Independent assurance and release gates | UAT/CI evidence, red-team results, release authorization, independent review |

**Phase 1 is not complete until the proposed Charter is formally ratified.** Publishing this draft or merging its documentation does not constitute signature, adoption, or approval.

## 13. Ratification record

Complete this section only through an authorized approval process.

| Field | Ratification record |
|---|---|
| Institutional authority | Pending |
| Accountable charter owner | Pending |
| Authorized signatory | Pending |
| Approval date | Pending |
| Approved version/hash | Pending |
| Approval evidence reference | Pending |
| Effective date | Pending |
| Next review date | Pending |

## 14. Governing declaration

BGLA establishes that authority precedes execution, evidence precedes assertion, and accountability persists throughout the lifecycle of every governed system.

No agent, model, service, or automated process may confer authority upon itself. All delegated capabilities remain bounded by approved purpose, identity, policy, operating envelope, and accountable human oversight.

**VERITAS ANTE ASSERTIONEM — Truth Before Assertion.**
