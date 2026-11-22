# ADR-001: Select a generator for JavaScript and TypeScript API clients

- **Status:** Accepted for the starter implementation; subject to validation during the first working release.
- **Date:** 2026-11-22
- **Related issue:** [#4 — Generate JavaScript and TypeScript Clients](https://github.com/DivineVirtuousChief/Portfolio-/issues/4)

## Context

The feature requires clients in both plain JavaScript and TypeScript from Swagger/OpenAPI JSON or YAML. The repository has no existing application framework or generator, so the first increment should be a reproducible starter rather than a custom parser and template engine.

## Options evaluated

| Criterion | OpenAPI Generator | Orval |
|---|---|---|
| Plain JavaScript client | Documented stable `javascript` generator | TypeScript client generation focus; no equivalent plain-JavaScript target documented |
| TypeScript client | Documented stable `typescript-fetch` generator | Type-safe TypeScript clients |
| JSON/YAML input | Yes | Yes |
| Runtime | Java-based CLI; npm wrapper available | Node.js toolchain; Orval 8 docs specify Node.js 22.18+ |
| Best fit | Multiple language targets and broad generator catalog | TypeScript-first frontend clients, hooks, and mocks |

## Decision

Use **OpenAPI Generator CLI** for the initial implementation because it documents distinct `javascript` and `typescript-fetch` client generators. Pin the engine version in `openapitools.json` and isolate generated output from hand-written source.

Orval remains a strong alternative if the project later prioritizes TypeScript-only frontend integration, query-library hooks, or mock generation. It is not selected as the sole engine because the current requirement explicitly includes plain JavaScript output.

## Consequences

### Benefits

- One contract can produce both requested language targets.
- Generator engine version is pinned.
- Established generators avoid maintaining custom templates.
- A synthetic sample contract supports repeatable smoke testing.

### Trade-offs

- The CLI requires a Java runtime; the npm wrapper does not remove that requirement.
- JavaScript and TypeScript generators may differ in feature coverage and conventions.
- Generated code must be reviewed and tested; valid input does not guarantee support for every OpenAPI feature.
- The starter does not yet provide a hosted UI, package publishing, or production API integration.

## Validation plan

1. Install dependencies and confirm the pinned CLI starts.
2. Validate the committed Petstore fixture.
3. Generate both clients from the same fixture.
4. Inspect operation methods, models, package metadata, and authentication behavior.
5. Add automated smoke checks for JavaScript syntax and TypeScript type-checking before declaring the feature complete.

## References

- [CLI installation](https://openapi-generator.tech/docs/installation/)
- [JavaScript generator](https://openapi-generator.tech/docs/generators/javascript/)
- [TypeScript Fetch generator](https://openapi-generator.tech/docs/generators/typescript-fetch/)
- [Orval overview](https://orval.dev/docs/)
- [Orval installation](https://orval.dev/docs/installation/)
