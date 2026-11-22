# OpenAPI Client Generator

Generate JavaScript and TypeScript API clients from a Swagger/OpenAPI contract.

This starter uses **OpenAPI Generator CLI** because the requirement includes both plain JavaScript and TypeScript outputs. Orval is a strong TypeScript-focused alternative, but is not selected as the sole engine for a plain-JavaScript target. See [ADR-001](../docs/decisions/ADR-001-openapi-generator-selection.md).

## Requirements

- Node.js 20 or newer
- Java 11 or newer on PATH (required by the generator JAR)
- npm

## Quick start

~~~bash
npm install
npm run validate
npm run generate:all
~~~

Generated clients are written to `generated/javascript/` and `generated/typescript-fetch/`. The generator engine version is pinned in `openapitools.json`; the first run may download the CLI JAR.

## Commands

~~~bash
npm run generate:javascript
npm run generate:typescript
npm run generate:all
~~~

The runner validates the specification before generation. It refuses to overwrite an existing generated directory unless you explicitly pass `--force`:

~~~bash
node scripts/generate.mjs all --force
node scripts/generate.mjs all --input ./path/to/openapi.yaml
~~~

Only the two managed output directories are eligible for replacement. Keep hand-written code outside `generated/`.

## Generator targets

| Output | Generator |
|---|---|
| Plain JavaScript client | `javascript` |
| TypeScript Fetch client | `typescript-fetch` |

Feature coverage differs between generators. Review their official feature matrices before relying on advanced OpenAPI constructs.

## Security

- Treat specification files as untrusted input.
- Never put API keys, bearer tokens, or production credentials in specifications or generated files.
- Supply credentials at runtime using the generated client's documented configuration.
- Test against synthetic or non-production environments first.
- Review generated code before committing or publishing it.
- Do not assume vendor extensions or every OpenAPI feature are supported identically by both targets.

## Sample

`openapi/petstore.yaml` is a minimal synthetic fixture. Replace it with an approved contract when adapting this starter to a real API.

## References

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [OpenAPI Generator installation](https://openapi-generator.tech/docs/installation/)
- [JavaScript generator](https://openapi-generator.tech/docs/generators/javascript/)
- [TypeScript Fetch generator](https://openapi-generator.tech/docs/generators/typescript-fetch/)
- [Orval documentation](https://orval.dev/docs/)
