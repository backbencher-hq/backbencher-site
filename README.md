# backbencher-site

The website at [backbencher.cc](https://backbencher.cc).

This is the canonical home of the site's source. It was extracted from the
product monorepo into its own repository so that the website can be reviewed,
designed and released on its own; the `website/` directory in
[`backbencher-hq/backbencher-brain`](https://github.com/backbencher-hq/backbencher-brain)
is a legacy copy and is not where changes should land.

The product — the indexer, the MCP tools, the language server — lives in
[`backbencher-hq/backbencher-brain`](https://github.com/backbencher-hq/backbencher-brain).
Product facts (versions, tool list, language inventory, CLI help, editor
records) are generated there and committed here as data, so the site cannot
describe a product that does not exist.

Contributions are open and welcome — design, accessibility, copy, bugs, and the
site half of a product fix. See [CONTRIBUTING.md](./CONTRIBUTING.md) and
[DESIGN.md](./DESIGN.md).

## Stack

Next.js 16 (App Router, static prerender), React 19, TypeScript, Tailwind CSS 3.4.
No database, no API server and no environment secret is required.

## Local development

Requirements: Node.js **>= 20.9** and npm.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # next typegen + tsc --noEmit
npm run build      # production build; prerendering validates the generated data
npm start          # serve the production build
```

## Layout

```
src/app/                  routes (App Router); page-local CSS lives beside each page
src/components/           shared components: instrument/ (shell, copy command, rich text)
src/components/tools/     the tool reference card + prose renderer
src/data/                 generated product facts + the editorial language records
src/app/instrument.css    the design system: tokens, surfaces, page primitives
src/app/globals.css       base resets, Tailwind entry and the skip link
public/                   static assets and the two installer scripts
```

## Where the facts come from

Product facts are generated in
[`backbencher-brain`](https://github.com/backbencher-hq/backbencher-brain) and
committed here. **Do not hand-edit a file whose header says it is generated** —
change the product source, regenerate there and sync the result. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow.

| Site data | Product source |
|---|---|
| `src/data/truth.generated.ts` | package version, MCP tool registry, SQLite schema, language registry |
| `src/data/tools.generated.ts` | the MCP tool descriptors |
| `src/data/brain-languages.ts` | the analyzer inventory |
| `src/data/editors.generated.ts` | the editor/LSP integration records (public projection) |
| `src/data/docs.generated.ts` | the real CLI help |
| `src/data/support.generated.ts` | the product FAQ source |
| `src/data/atlas/*.json` | a recorded bb session over the product index (homepage) |

## Deploy

The site is a static Next.js build deployed on Vercel. A deploy is gated on
`typecheck` and `build`; the production build needs no environment variables.

## License

[MIT](./LICENSE). Contributions are accepted under the same license. Third-party
marks and assets keep their own licenses.
