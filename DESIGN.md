# DESIGN — backbencher.cc

The visual system the site actually ships. It is the reference for design
contributions; propose a new pattern in an issue before adding one.

## The world

A dark product surface. Graphite grounds, bone type, one ember signal, and real
product evidence presented as an instrument rather than decoration. Editorial
where it helps reading (generous whitespace, hairline rules) and instrument-like
where the product appears (measured data, mono labels, evidence tiers). No
shadows beyond the raised panels, no gradients as ornament, no glass, no stock
imagery, no decorative terminal.

## Type

Four faces, all self-hosted (no external font requests):

- **Archivo** — display and headings. 600 weight, tight tracking, balanced wraps.
- **Hanken Grotesk** — body copy.
- **JetBrains Mono** — code, labels, data, metadata lines.
- **Fraunces italic** — the closing motto only ("Evidence is the answer.").

Scale: display `clamp(36px, 4.6vw, 60px)` for page titles, `clamp(42px, 5vw,
72px)` for the homepage; section titles `clamp(24px, 2.6vw, 32px)`; body 15–17px
at 1.6–1.7 line height; mono labels 9.5–11px with wide tracking; readable code
12.5–13px. Do not introduce type below 9.5px, and never use the serif for
headings — the italic serif is one motif, not the display face.

## Colour

All tokens live in `src/app/instrument.css`, scoped to `.instr`:

- ground `#0a0b0d`, raised surface `#101215`, code plate `#0c0e10`
- ink `#eae7e1`, body `#b3aea5`, muted `#8a847a`
- hairline `rgba(255,255,255,.08)`, stronger rule `rgba(255,255,255,.14)`
- ember `#ff5b33` (signal, links on hover, the one highlight), soft ember `#ffb08a`
- gold `#e7a13e` (freshness / secondary data), steel `#86a9c9` (structural tier)

Text on graphite must clear WCAG AA: 4.5:1 for body-sized text, 3:1 for large
text and focus rings. The measured pairs are in `CONTRIBUTING.md`; re-measure
before adding a colour.

## Layout

- Container 1280px; page head max ~940px; reading measure 62–72ch.
- Page head pattern: mono eyebrow → Archivo title → lead paragraph → mono meta line.
- Sections separated by a hairline, 64px vertical rhythm (48px on small screens).
- Cards use a hairline border and the raised surface; radius 10–12px.
- Tables scroll inside their own wrapper; the document never widens.
- The homepage hero is the one asymmetric grid: statement left, the recorded
  answer panel right; it stacks below 1080px.

## Motion

At most one authored moment per surface; the homepage's map is the only
animated evidence. Everything settles to a static frame and respects
`prefers-reduced-motion: reduce`.

## Accessibility floor (WCAG 2.2 AA)

- One `h1` per page, no skipped heading levels, labelled `nav` landmarks.
- Visible focus ring on every focusable element; native controls for disclosure.
- 4.5:1 text contrast, 3:1 large text/focus; targets >=24px.
- Status changes announced when they are not otherwise visible.
- Deep links (`/tools#bb_search`, docs anchors) are part of the contract.

## Rules

- One visual world. No second palette, no new font families, no heavy dependencies.
- Real product evidence over decoration: real output, real numbers, real captures.
- Numbers come from generated data; never type a product fact into a page.
- Page CSS is local (`src/app/<route>/<route>.css`), tokens are global.
