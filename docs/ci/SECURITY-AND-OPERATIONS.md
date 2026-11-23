# Workflow Security and Operations

## Permission model

- General CI, API lint, documentation lint, CodeQL checkout, and secret scanning use read-only repository permissions.
- Dependency Review uses read-only contents and pull-request metadata permissions.
- Issue Triage receives issues: write only because it creates missing labels and applies them to the triggering issue.
- CI Evidence Archive receives actions: read and contents: read. Artifact upload is scoped to the run.
- Release Readiness is manual and read-only.

## Third-party action pinning

Every third-party action reference added by this library uses a full 40-character commit SHA. Dependabot is configured to propose reviewed updates to GitHub Actions references.

## Untrusted pull request code

The workflows do not expose repository secrets to pull-request scripts. Package installation disables lifecycle scripts. CI runs with read-only permissions. Do not add write tokens or deployment secrets to pull-request jobs without a separate threat review.

## Evidence boundaries

The CI Evidence Archive captures run metadata and a link to the upstream workflow. Artifacts expire after 30 days. This is operational traceability, not cryptographic signing, immutable retention, or independent assurance.

## Release boundary

No publishing workflow is included. The manual release-readiness job executes npm pack --dry-run and does not invoke npm publish, GitHub Releases, deployment, or tag creation.
