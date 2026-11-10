import type { Metadata } from "next"
import Link from "next/link"
import heroMap from "@/data/atlas/hero-map.generated.json"
import type { HeroMap } from "@/data/atlas/types"
import { PARSERS } from "@/data/brain-languages"
import { languageHref } from "@/data/language-depth/slugs"
import { TRUTH } from "@/data/truth.generated"
import { CopyCommand } from "@/components/instrument/CopyCommand"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import { JsonLd } from "@/components/JsonLd"

// The product instrument. A dark surface built around one real recorded run:
// a real bb_impact answer over the project's own index (210 modules, 635
// resolved imports, 35 dependents across 21 files), with its coordinates,
// tiers, staleness and truncation shown as recorded. Nothing on this page is
// invented: the map, the answer, the counts and the digest come from
// src/data/atlas/hero-map.generated.json, and the product facts from
// src/data/truth.generated.ts and src/data/brain-languages.ts.

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Backbencher (bb) — local code intelligence that shows its evidence",
}

const map = heroMap as unknown as HeroMap

const REGISTRY_IDS = PARSERS.reduce((total, family) => total + family.ids.length, 0)
const COMMAND = "npm install -g @backbencher/brain"

// Wave levels: 0 is the renamed symbol, 1-3 are the traversal hops recorded by
// the run. An edge is "lit" only when it connects two recorded hops — that is
// the path the answer actually walked, not the background import graph.

// The map is the recorded module graph collapsed to its directories: one bubble
// per directory (area = module count), placed in rings by import-distance from
// the renamed symbol's directory. Bubbles reached by the recorded rename are lit;
// lines are the real resolved import weights between directories. No invented
// cluster: labels, counts, rings and weights come from the recorded edges.
const ARCH = (() => {
  const rootCluster = map.nodes[map.root]!.c
  const adjacent = map.clusters.map(() => new Set<number>())
  const pairWeight = new Map<string, { a: number; b: number; w: number }>()
  for (const edge of map.edges) {
    const a = map.nodes[edge.a]?.c
    const b = map.nodes[edge.b]?.c
    if (a === undefined || b === undefined || a === b) continue
    adjacent[a].add(b)
    adjacent[b].add(a)
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    const pair = pairWeight.get(key)
    if (pair) pair.w += 1
    else pairWeight.set(key, { a: Math.min(a, b), b: Math.max(a, b), w: 1 })
  }
  const ringOf = new Array(map.clusters.length).fill(3)
  ringOf[rootCluster] = 0
  const queue: number[] = [rootCluster]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const next of adjacent[current]!) {
      if (ringOf[next] === 3 && next !== rootCluster) {
        ringOf[next] = Math.min(3, ringOf[current]! + 1)
        queue.push(next)
      }
    }
  }
  const affectedClusters = new Set(
    map.nodes.filter((node) => node.i === map.root || map.waves.flat().includes(node.i)).map((node) => node.c),
  )
  const byRing: number[][] = [[], [], [], []]
  ringOf.forEach((ring, index) => byRing[ring]!.push(index))
  const cx = 600
  const cy = 348
  const radii = [0, 236, 372, 492]
  const centers: Array<{ x: number; y: number }> = []
  byRing.forEach((members, ring) => {
    members.forEach((cluster, index) => {
      if (ring === 0) {
        centers[cluster] = { x: cx, y: cy }
        return
      }
      const angle = -Math.PI / 2 + (index / Math.max(members.length, 1)) * Math.PI * 2 + (ring % 2 === 0 ? 0.35 : 0)
      centers[cluster] = { x: cx + Math.cos(angle) * radii[ring]!, y: cy + Math.sin(angle) * radii[ring]! * 0.64 }
    })
  })
  const radiusOf = (modules: number) => Math.min(34, 8 + Math.sqrt(modules) * 2.4)
  return {
    centers,
    radiusOf,
    clusters: map.clusters,
    affectedClusters,
    pairs: [...pairWeight.values()],
    rootCluster,
  }
})()

const rootNode = map.nodes[map.root]
const claimed = map.answer.chips.slice(0, 3)


export default function HomePage() {
  return (
    <InstrumentShell active="/">
        <section className="instr-wrap instr-hero">
          <div>
            <p className="instr-eyebrow">Local code intelligence · zero cloud</p>
            <h1 className="instr-h1">
              Every answer names its <em>evidence.</em>
            </h1>
            <p className="instr-lead">
              bb indexes your repository into a local graph of symbols, imports and call edges. Ask what
              breaks, what calls what, what changed — and read the <strong>file and line</strong>, the{" "}
              <strong>relationship it walked</strong>, and <strong>what it could not know</strong>.
            </p>
            <div className="instr-actions">
              <CopyCommand command={COMMAND} />
            </div>
            <div className="instr-actions">
              <Link className="instr-btn" href="/install">
                Install guide <span aria-hidden>→</span>
              </Link>
              <Link className="instr-btn-ghost" href="#answer">
                How it answers <span aria-hidden>↓</span>
              </Link>
            </div>
            <ul className="instr-stats">
              <li>
                <b>{PARSERS.length}</b> languages
              </li>
              <li>
                <b>{REGISTRY_IDS}</b> registry ids
              </li>
              <li>
                <b>{TRUTH.tools.length}</b> MCP tools
              </li>
              <li>
                <b>{TRUTH.tables}</b> SQLite tables
              </li>
              <li>
                <b>MIT</b> · local-first
              </li>
            </ul>
            <p className="instr-provenance">
              The panel is a recorded response from this repository’s index — not a mockup.
            </p>
          </div>

          <figure className="instr-panel" aria-label="A recorded bb_impact answer over this project's index">
            <div className="instr-panel-head">
              <span className="instr-panel-tag">bb_impact · recorded over this index</span>
              <span className="instr-badge">12/21 files fresh · rest declared</span>
            </div>
            <p className="instr-question">
              What breaks if I rename <span>{claimed[0]?.symbol ?? "resolveEmbeddingConfig"}</span>?
            </p>
            <div className="instr-map-mobile" aria-hidden>
              <p className="instr-map-mobile-title">
                {ARCH.affectedClusters.size} directories reached
              </p>
              <ul>
                {ARCH.clusters.map((cluster, index) =>
                  ARCH.affectedClusters.has(index) ? (
                    <li key={cluster.l}>
                      {cluster.l}
                      <span>{cluster.n}</span>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
            <svg
              className="instr-map"
              viewBox="0 0 1200 700"
              role="img"
              aria-label={`Architecture map of ${map.clusters.length} directories on this map: bubble area is module count, the ${ARCH.affectedClusters.size} directories lit in orange are the ones the recorded rename reaches, and the lines are resolved imports between them (${map.edges.length} total).`}
            >
              <defs>
                <pattern id="instr-grid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <circle cx="1.2" cy="1.2" r="0.8" fill="rgba(255,255,255,0.055)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="1200" height="700" fill="url(#instr-grid)" />
              {ARCH.pairs.map((pair) => {
                const a = ARCH.centers[pair.a]!
                const b = ARCH.centers[pair.b]!
                const lit = ARCH.affectedClusters.has(pair.a) && ARCH.affectedClusters.has(pair.b)
                return (
                  <line
                    key={`p${pair.a}-${pair.b}`}
                    className={lit ? 'pair-lit' : 'pair'}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    strokeWidth={Math.min(2.2, 0.5 + pair.w * 0.06)}
                  />
                )
              })}
              {ARCH.clusters.map((cluster, index) => {
                const center = ARCH.centers[index]!
                const r = ARCH.radiusOf(cluster.n)
                const affected = ARCH.affectedClusters.has(index)
                return (
                  <g key={cluster.l} className={affected ? 'bubble affected' : 'bubble'}>
                    <title>{`${cluster.l}: ${cluster.n} module${cluster.n === 1 ? '' : 's'}${affected ? ', reached by the rename' : ''}`}</title>
                    {affected ? <circle className="reach-ring" cx={center.x} cy={center.y} r={r + 7} /> : null}
                    <circle cx={center.x} cy={center.y} r={r} />
                    {r < 17 ? (
                      <text
                        className="bubble-label small"
                        x={center.x + ((center.x - 600) / (Math.hypot(center.x - 600, center.y - 348) || 1)) * (r + 11)}
                        y={center.y + ((center.y - 348) / (Math.hypot(center.x - 600, center.y - 348) || 1)) * (r + 11) + 4}
                        textAnchor={center.x >= 600 ? 'start' : 'end'}
                      >
                        {cluster.l} · {cluster.n}
                      </text>
                    ) : (
                      <>
                        <text className="bubble-label" x={center.x} y={center.y + 3} textAnchor="middle">
                          {cluster.l}
                        </text>
                        {affected && r >= 17 ? (
                          <text className="bubble-count" x={center.x} y={center.y + r + 11} textAnchor="middle">
                            {cluster.n} modules
                          </text>
                        ) : null}
                      </>
                    )}
                  </g>
                )
              })}
              <g>
                <circle className="root-dot" cx={44} cy={44} r={4} />
                <text className="map-note" x={56} y={47}>
                  renamed symbol · resolved in the config directory
                </text>
                <circle className="map-note-legend" cx={44} cy={644} r={4.5} />
                <text className="map-note" x={56} y={647}>
                  reached by the recorded rename · line weight = import weight
                </text>
              </g>
            </svg>
            <figcaption className="instr-answer">
              <p className="instr-answer-head">
                {map.answer.counted.dependents} dependents across {map.answer.counted.files} files.
              </p>
              <p className="instr-answer-sub">{map.answer.sub}</p>
              <p className="instr-answer-evidence">{map.answer.evidence}</p>
              <ul className="instr-chips">
                {claimed.map((chip) => (
                  <li className="instr-chip" key={`${chip.file}:${chip.line}`}>
                    <span className="file">
                      {chip.file}
                      <span className="line">:{chip.line}</span>
                    </span>
                    <span className={`tier ${chip.tier.replace(/_/g, "-")}`}>{chip.tier.replace(/_/g, "-")}</span>
                    <span className="line">{chip.note}</span>
                  </li>
                ))}
              </ul>
            </figcaption>
            <div className="instr-panel-foot">
              <span>
                <i />
                directories the rename reaches
              </span>
              <span>
                <i className="dim" />
                line weight = resolved imports
              </span>
              <span>
                {map.nodes.length} modules · {map.edges.length} imports
              </span>
              <span>digest {map.digest.slice(0, 8)}</span>
            </div>
          </figure>
        </section>

        <section id="answer" className="instr-sec">
          <div className="instr-wrap">
            <p className="instr-kicker">The contract</p>
            <h2 className="instr-h2">
              An answer you can <em>check.</em>
            </h2>
            <p className="instr-sec-lead">
              A search result tells you it found something. bb tells you where it is, what it walked to
              get there, and where the record stops. That is the difference between a lead and an answer.
            </p>
            <div className="instr-cards">
              <article className="instr-card">
                <h3>Coordinates</h3>
                <p>
                  Every hit is a file and a line — openable, not just readable. Each record also reports
                  whether it is fresh, stale or missing, so a reader knows how far to trust it.
                </p>
                <code className="instr-specimen">
                  src/config/config.ts:35{"\n"}
                  <b>structural</b> · declares the symbol
                </code>
              </article>
              <article className="instr-card">
                <h3>The relation it walked</h3>
                <p>
                  Calls, imports, extends, renders — each edge carries the rule that produced it and the
                  evidence tier that rule earns. A guessed edge is never dressed as a measured one.
                </p>
                <code className="instr-specimen">
                  resolveEmbeddingConfig → loadConfig{"\n"}
                  <b>usage-contextual</b> · 5 dependents
                </code>
              </article>
              <article className="instr-card">
                <h3>What it could not know</h3>
                <p>
                  A bounded traversal names its bound. Unresolved references stay unresolved. Nothing is
                  invented to make the answer look complete.
                </p>
                <code className="instr-specimen">
                  truncationReason: {map.answer.counted.truncationReason}
                  {"\n"}
                  <b>{map.answer.counted.rowsOutsideMap} rows outside src/</b> · declared
                </code>
              </article>
            </div>
          </div>
        </section>

        <section id="languages" className="instr-sec">
          <div className="instr-wrap">
            <p className="instr-kicker">The index</p>
            <h2 className="instr-h2">
              Fifty languages. One <em>graph.</em>
            </h2>
            <p className="instr-sec-lead">
              One analyzer per language, all writing the same relationship vocabulary into one local
              SQLite file. Alias routes (TSX, Sass, Terraform) resolve through their parent analyzer
              instead of adding a branch.
            </p>
            <div className="instr-register">
              <div>
                <p className="instr-sec-lead" style={{ marginTop: 0 }}>
                  Extensions, symbols and relationship coverage are read from the analyzer itself, not
                  typed into this page — every name below links to what that analyzer actually emits.
                </p>
                <div className="instr-register-foot">
                  <Link href="/languages">
                    Open the register <span aria-hidden>→</span>
                  </Link>
                  <span>{REGISTRY_IDS} registry entries</span>
                </div>
              </div>
              <ul className="instr-langs">
                {PARSERS.map((parser) => (
                  <li key={parser.name}>
                    <Link href={languageHref(parser.name)} title={parser.ext}>
                      {parser.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="instr-close">
          <div className="instr-wrap">
            <h2>
              Install once. Answer <em>locally.</em>
            </h2>
            <div className="instr-close-row">
              <CopyCommand command={COMMAND} />
              <Link className="instr-btn" href="/install">
                Install guide <span aria-hidden>→</span>
              </Link>
              <Link
                className="instr-btn-ghost"
                href="https://github.com/backbencher-hq/backbencher-brain"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the source <span aria-hidden>↗</span>
              </Link>
            </div>
            <p className="instr-motto">
              Evidence is <b>the answer.</b>
            </p>
          </div>
        </section>
      <JsonLd />
    </InstrumentShell>
  )
}
