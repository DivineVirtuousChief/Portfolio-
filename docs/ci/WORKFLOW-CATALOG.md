# BGLA GitHub Actions Workflow Library

## Purpose

This library provides cross-cutting CI, security, governance, documentation, triage, and evidence workflows. Workflows use read-only permissions by default. Write access is granted only to issue triage, which creates and applies labels.

## Governance documents

The branch now includes the proposed governance layer:

- [BGLA GitHub Actions Library Charter](../governance/BGLA-GITHUB-ACTIONS-LIBRARY-CHARTER.md) — institutional purpose, authority boundaries, document hierarchy, fail-closed principles, release boundaries, and ratification status.
- [BGLA GitHub Actions Teaching Sheet](../governance/BGLA-GITHUB-ACTIONS-TEACHING-SHEET.md) — target contracts for identity, policy, provenance, compliance evidence, and governance validation.

Both documents are **Proposed Draft — Pending Institutional Review and Ratification**. Their presence in GitHub does not constitute institutional adoption.

## Workflows introduced

| Workflow | Trigger | Function |
|---|---|---|
| Node Package CI | Push, pull request, manual | Discovers Node packages and runs available typecheck, lint, test, and build scripts |
| CodeQL Security Analysis | Push, pull request, weekly, manual | Static analysis for JavaScript and TypeScript |
| Secret Scan | Push, pull request, manual | Scans repository history for exposed credentials |
| Dependency Review | Pull request | Fails on newly introduced high-severity dependency vulnerabilities when enabled |
| API Contract Validation | Contract paths, manual | Lints contracts under api-specs/ and contracts/ |
| Issue Triage | Issue opened or reopened | Applies initial labels using keyword rules |
| Pull Request Governance | Pull request lifecycle | Requires summary, scope, validation, provenance, risk, and governance sections |
| Documentation Quality | Documentation paths, manual | Lints this library's Markdown and templates |
| Release Readiness (No Publishing) | Manual | Runs npm package dry-runs; does not publish |
| CI Evidence Archive | Completion of listed workflows | Stores workflow-run metadata for 30 days |

## Existing module-specific workflows

Other draft feature branches already contain module workflows. They are deliberately not duplicated here:

- openapi-codegen.yml in the OpenAPI generator draft PR.
- agent-knowledge.yml in the agent knowledge draft PR.
- chatops-ci.yml in the ChatOps draft PR.
- support-backlog-ci.yml in the support-to-backlog and Consumer Intelligence draft PRs.

Those PRs remain separate changes. Their workflows are not present on main at the time this library was prepared. Review overlap, action pinning, and permission scopes when integrating the draft PRs.

## Security and operational boundaries

- Third-party actions added by this library are pinned to full commit SHAs.
- Token permissions are declared and minimized.
- No workflow deploys applications, publishes packages, creates GitHub releases, or merges pull requests.
- Issue triage does not assign people, close issues, or make priority decisions.
- The evidence archive is not an immutable audit ledger, signed attestation, or long-term evidence repository.
- Secret scanning and CodeQL depend on GitHub Actions execution and repository feature availability.
- Dependency Review is gated by the repository variable BGLA_DEPENDENCY_REVIEW_ENABLED=true. Enable the repository dependency graph first; until then, the check reports a skip rather than a false pass.
- Dependabot is configured for GitHub Actions updates. Add npm package directories after the corresponding module packages are merged into the default branch.

## Important implementation gap

The existing workflows are a cross-cutting CI and governance foundation. They are **not yet** the five reusable composite actions described in the Teaching Sheet. In particular:

- CI metadata archiving is not signed build provenance.
- Workflow execution is not, by itself, cryptographic identity verification.
- A normal GitHub artifact is not an immutable or append-only compliance ledger.
- No production deployment or release promotion is authorized by this library.

The next implementation module must add and test the five action contracts before describing the library as a complete reusable action suite.

## Repository settings to review

1. Enable Actions and allow the selected pinned actions.
2. Enable the repository dependency graph and Dependabot alerts; then set BGLA_DEPENDENCY_REVIEW_ENABLED=true.
3. Configure branch protection or rulesets separately; a workflow cannot enforce merge protection unless its check is required by repository settings.
4. Review artifact retention and access before treating CI artifacts as regulated evidence.
