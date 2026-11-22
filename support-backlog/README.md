# BGLA Support-to-Backlog Generator

A governed TypeScript foundation for turning customer-support reports into traceable draft bugs, user stories, and support tasks.

## Current implementation

- Typed support-case and backlog-draft contracts.
- Baseline redaction for common bearer tokens, credential-like fields, email addresses, and phone numbers.
- Deterministic keyword-based classification.
- Draft generation with source references and Given/When/Then acceptance-criteria scaffolding.
- Fail-closed human approval guard for tracker publication.

## Planned, not yet implemented

- OpenAPI document parsing and operation matching.
- Similarity-based duplicate detection.
- GitHub Issues and Jira API adapters.
- Customer-support platform connectors.
- Persistent evidence ledger and authenticated approval identity.
- Comprehensive PII/PHI detection and tenant-aware storage.

## Safety boundary

Generated work items are drafts. The approval guard is a local policy function, not an authentication system. The redactor is a baseline filter and does not guarantee removal of all personal, health, or confidential information. Do not send raw customer records or protected health information to this prototype.

## Development

```bash
npm install
npm run typecheck
npm test
```

**VERITAS ANTE ASSERTIONEM** — Truth before assertion.
