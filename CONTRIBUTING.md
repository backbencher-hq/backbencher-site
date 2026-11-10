# Contributing to backbencher-site

This repository is open to contributions. You do not need permission to open an
issue or a pull request — design, accessibility, copy, documentation, bug fixes
and data syncs are all welcome. Be kind and assume good intent; the
[Code of Conduct](./CODE_OF_CONDUCT.md) applies here.

This repo is the website at <https://backbencher.cc>: the product pages, docs,
tools and language references, editor/LSP pages, support and legal pages. The
product itself lives in
[`backbencher-hq/backbencher-brain`](https://github.com/backbencher-hq/backbencher-brain).

## Fixing the product and the site together

If you fix something in **backbencher-brain** and the fix changes a fact the
website renders — a version, a tool name, a count, a language record, a CLI
command, an editor capability — you are welcome (and encouraged) to send the
matching site change here as well. That can be:

- a **generated-data sync PR** (the regenerated `src/data/*.generated.ts` files),
- a **copy/layout PR** if the page text needs to change with it, or
- both, in one small PR.

Two rules follow from that:

1. **Do not hand-edit a file whose header says it is generated.** Change the
   fact at its source in the product repository, regenerate there, and send the
   regenerated files. If you cannot regenerate, open an issue with the evidence
   you checked instead of patching the data by hand.
2. **License:** by submitting a contribution you agree it is licensed under this
   repository's [MIT license](./LICENSE). The site is MIT open source; only
   send work you have the right to license that way.

Site-only fixes (a broken layout, a typo, a focus bug, a missing alt text) need
no product change: just send the PR.

## Good first contributions

- **Design and layout** — spacing, hierarchy, responsive behaviour, polish. Read
  [`DESIGN.md`](./DESIGN.md) first; open a design proposal issue for anything
  that changes a page's structure or adds a new visual pattern.
- **Accessibility** — keyboard paths, focus, contrast, reduced motion, screen
  reader semantics. The target is WCAG 2.2 AA.
- **Copy** — clarity, typos, better explanations. Product facts must still come
  from the generated data (see below).
- **Bugs** — a page that breaks, a link that dies, a layout that overflows.
- **Product fix mirrors** — the site half of a backbencher-brain fix (above).

## Local development

Requirements: Node.js **>= 20.9** and npm.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # next typegen + tsc --noEmit
npm run build      # production build (static generation validates the data)
```

No database, API server or environment variable is required.

## Design rules

- Follow [`DESIGN.md`](./DESIGN.md): the type scale, the colour tokens, the
  spacing rhythm and the motion budget. Do not add a second visual world.
- Include screenshots at **1440 px and 390 px** in the PR, plus keyboard focus
  and reduced-motion behaviour when relevant.
- Real product evidence over decoration: real captures, real output, real
  numbers. No stock screenshots, no fake terminals, no invented metrics.
- Keep page weight sane: no new font families, no new heavy dependencies
  without discussion, no autoplay video, images optimised.
- Respect `prefers-reduced-motion`.

## Facts and generated data

The site renders product facts: versions, tool names, language counts, install
snippets, editor capabilities. Those live in `src/data/*.generated.ts` and are
generated from the product repository (the number of tools, the language
inventory, the install script and the CLI help are the sources of truth).

- Page copy may explain the data, but it must not hard-code a number that exists
  in the data.
- Legal pages (`src/app/privacy`, `src/app/terms`) are hand-authored here; keep
  them consistent with the product's current licence and privacy behaviour.
- Support answers are generated data too: propose an FAQ change in the product
  repository, where the source answers live.

## Where styles live

- Shared tokens, surfaces and page primitives: `src/app/instrument.css` (global).
- Page-specific layout: `src/app/<route>/<route>.css`, imported by that page and
  prefixed with the route name so it cannot leak across surfaces.
- Do not edit `src/app/globals.css` beyond base resets, the Tailwind entry and
  the skip link.

## Pull requests

- Keep PRs small and focused; one concern per PR.
- Run `npm run typecheck` and `npm run build` before opening.
- Use a clear title and describe **what changed and why**, with before/after
  screenshots for visible changes.
- Sign off your commits (`git commit -s`). Do not add agent attribution footers
  (`Generated with …`, `Co-Authored-By: <agent>`) — this project does not
  attribute commits to tools.
- CI runs `typecheck` and `build`; a deploy is gated on those passing.

## Images and assets

- Prefer real product captures. If a capture is redacted, redact the **source**
  (paths, usernames, tokens) before it enters the repo.
- Optimise images; no untracked binaries, no third-party screenshots without a
  licence note in `public/`.
- Nothing personal, no absolute machine paths, no secrets in any file.

## Security

Do not report vulnerabilities in a public issue. See [SECURITY.md](./SECURITY.md).

## License

By contributing you agree your contribution is licensed under the repository's
[MIT license](./LICENSE).
