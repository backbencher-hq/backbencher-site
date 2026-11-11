import type { Metadata } from "next"
import Link from "next/link"
import { TRUTH } from "@/data/truth.generated"
import { PARSERS } from "@/data/brain-languages"
import { DOCS_FACTS } from "@/data/docs.generated"
import { BRAIN_TOOLS, GROUP_ORDER } from "@/data/brain-tools"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import { CopyCommand } from "@/components/instrument/CopyCommand"
import { RichText } from "@/components/instrument/RichText"
import "./docs.css"

// /docs — the Backbencher guide.
//
// WHAT THIS PAGE IS
// -----------------
// One long reference page organised as a reading sequence: install → first
// index → what the indexer does → how it stays fresh → embeddings → the tool
// and CLI references → storage → troubleshooting. The in-page nav is an anchor
// list rather than a separate route per topic, because the material is short
// enough to scroll and every section is a deep-link target (the install page,
// the language records and the redirect table all link into these ids).
//
// Every number, flag and tool row is rendered from generated data
// (data/docs.generated.ts, data/truth.generated.ts, data/brain-tools.ts), so the
// page cannot drift from the CLI surface it documents.
//
// The eleven section ids below are load-bearing: /docs#first-index, #mcp,
// #embeddings and #how-the-index-works are linked from the install page and the
// language records; /docs#troubleshooting is the redirect target for the retired
// /troubleshooting route (/lib/redirects.ts). They must not be renamed.

export const metadata: Metadata = {
  title: "Docs — the Backbencher guide",
  description:
    "Install, first index, what gets indexed, keeping the index fresh, embeddings, the MCP server and the full CLI reference — generated against the real bb surface.",
  alternates: { canonical: "/docs" },
}

// The section order, and the in-page nav. Ids are the public anchors.
const NAVIGATION = [
  ["installation", "Installation"],
  ["first-index", "First index"],
  ["how-the-index-works", "How the index works"],
  ["what-gets-indexed", "What gets indexed"],
  ["keeping-fresh", "Keeping the index fresh"],
  ["embeddings", "Embeddings setup"],
  ["agent-tools", "Agent tools"],
  ["mcp", "MCP server"],
  ["cli-reference", "CLI reference"],
  ["data-and-upgrades", "Data & upgrades"],
  ["troubleshooting", "Troubleshooting"],
  ["next", "Where to go next"],
] as const

// Milestone codes and private-tree paths belong to the product repository, never
// to a reader-facing page. The shared RichText renderer already rewrites
// internal repository paths; generated CLI copy can still
// carry a bare milestone tag (the health --verbose-config line does), so every
// generated string passes through here first.
const MILESTONE = /\s*\(M\d{2}(?:\.[A-Z]\d{1,2})?\)|M\d{2}\.[A-Z]\d{1,2}/g
function publicCopy(text: string): string {
  return text.replace(MILESTONE, "").replace(/\s{2,}/g, " ").trim()
}

// Bytes are rendered from the generated facts, never typed.
const mb = (bytes: number) => `${bytes / (1024 * 1024)} MB`
const mib = (bytes: number) => `${bytes / (1024 * 1024)} MiB`

const INDEXING = DOCS_FACTS.indexing
const FRESHNESS = DOCS_FACTS.freshness
const STORAGE = DOCS_FACTS.storage

// The storage shape is assembled from the generated facts: the indexer records
// these paths relative to <data-dir>, so the page never restates them by hand.
const INDEX_PATH = `${STORAGE.dataDir}/${STORAGE.indexFile.replace("<data-dir>/", "")}`
const CACHE_PATH = `${STORAGE.dataDir}/${STORAGE.parserCache.replace("<data-dir>/", "")}`

// What each derived phase does for a changed file. The gate requires a row for
// every phase the indexer records, so a new phase cannot ship undocumented.
const PHASE_ROW: Record<string, string> = {
  relationships:
    "The re-parsed file's own edges resolve at insert time; cross-file edges from other files pointing into the changed file are repaired; unresolved external targets are re-resolved, scoped to the touched symbols.",
  enrichment: "Re-run scoped to the touched source symbols.",
  gravity:
    "Recomputed for the touched symbols, plus every symbol whose in-degree changed because of the edit.",
  taint: "Resolution re-processes only the flows that are still unresolved.",
  health: "Recomputed (cheap SQL aggregates).",
  analyze:
    "SQLite's own ANALYZE, so the query planner has statistics. Without sqlite_stat1 it guesses: measured on a real 4.8 GB index, that guess cost a full brain_symbol scan per graph hop — about 15s per bb_graph call, and bb_patterns timed out at 45s. With the statistics present the same hops are sub-millisecond. One-time cost around 8s on that index, covered by the single-flight index lock.",
}

// The tool catalogue, grouped the way the display layer groups it. Names and
// summaries are registry facts; the link target is the tool's own entry on the
// tool reference page (/tools#<name> is a real anchor there).
const TOOL_ROWS = GROUP_ORDER.flatMap((group) =>
  BRAIN_TOOLS.filter((tool) => tool.group === group).map((tool) => ({
    name: tool.name,
    group,
    summary: tool.summary,
  })),
)

// Symptom-based fixes. These moved here from their own page (the retired
// /troubleshooting route redirects to this section), so this is the single
// source of symptom-based fixes; every command named below is part of the real
// bb CLI.
const FIXES = [
  {
    label: "Freshness",
    title: "Search results look stale",
    body: "Indexed results state their freshness. Reindex changed files, or re-run the derived phases without a full re-parse:",
    code: "bb index --changed\n# or, when only derived data (relationships, health) is stale:\nbb index --post",
  },
  {
    label: "Recovery",
    title: "Repair a corrupted index",
    body: "Wipes this project's index and rebuilds it in place. Your source files are never touched:",
    code: "bb index --force",
  },
  {
    label: "Interrupted run",
    title: "An index run was interrupted",
    body: "Check where the run stopped, then continue from its checkpoint:",
    code: "bb status\nbb index --resume",
  },
  {
    label: "Embeddings",
    title: "Semantic search is weak or unavailable",
    body: "Without a configured embedding provider, semantic modes fall back to weaker local vectors. Check your setup and its consistency:",
    code: "bb setup show\nbb doctor",
    extra: "Configure a provider with bb setup. bb doctor --fix repairs file-permission problems only (0600 on the config) — it is explicit and changes nothing else.",
  },
  {
    label: "Evidence",
    title: "A tool reports missing or fresh=false data",
    body: "Tool results carry a freshness block (fresh/stale/missing counts plus a remediation command). Run the remediation it names — usually bb index --changed or bb index --post:",
    code: "bb health",
  },
  {
    label: "Diagnostics",
    title: "Verbose diagnostics",
    body: "Show debug logs and per-file worker/WASM lines for any command; suppress informational output with --quiet:",
    code: "bb --verbose stats\nbb --quiet search createSession",
  },
]

export default function DocsPage() {
  return (
    <InstrumentShell active="/docs">
      <div className="instr-wrap instr-page docs-page">
        <div className="instr-page-head" id="top" tabIndex={-1}>
          <p className="instr-eyebrow">Documentation · latest</p>
          <h1 className="instr-title">
            The Backbencher <em>guide.</em>
          </h1>
          <p className="instr-page-lead">
            Install, index your first project, understand what the indexer does with your files, keep
            it fresh, and read the generated CLI reference. Everything here is generated against the
            real bb surface.
          </p>
          <p className="instr-page-meta">
            {DOCS_FACTS.cli.commands.length} commands · {TRUTH.tools.length} MCP tools ·
            generated from the real bb CLI · verified by CI
          </p>
        </div>

        <div className="docs-layout">
          <aside className="docs-sidebar">
            <div className="docs-sidebar-inner">
              <nav aria-label="On this page" className="docs-toc">
                <p className="docs-toc-label">On this page</p>
                <ol>
                  {NAVIGATION.map(([id, label]) => (
                    <li key={id}>
                      <Link href={`#${id}`}>{label}</Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <div className="docs-main">
            {/* ---------------------------------------------------------- */}
            <section id="installation" className="instr-section docs-section">
              <h2 className="instr-section-title">Installation.</h2>
              <p className="instr-section-lead">
                Backbencher runs fully local: the <code>bb</code> CLI, the SQLite index, and the
                analysis all live on your machine. Your source code never leaves it.
              </p>

              <div className="instr-grid">
                <div className="instr-surface primary">
                  <p className="instr-surface-label">Primary · npm</p>
                  <h3>npm</h3>
                  <p>
                    The published artifact every release ships, so the CLI and the package version
                    always agree. Requires Node.js 18 or newer.
                  </p>
                  <div className="instr-cmd-row">
                    <CopyCommand command="npm install -g @backbencher/brain" />
                  </div>
                </div>
                <div className="instr-surface">
                  <p className="instr-surface-label">Shell installer</p>
                  <h3>macOS &amp; Linux</h3>
                  <p>A one-line installer, an alternative to npm.</p>
                  <div className="instr-cmd-row">
                    <CopyCommand command="curl -fsSL https://backbencher.cc/install.sh | bash" />
                  </div>
                </div>
                <div className="instr-surface">
                  <p className="instr-surface-label">PowerShell installer</p>
                  <h3>Windows</h3>
                  <p>A one-line installer, the Windows alternative to npm.</p>
                  <div className="instr-cmd-row">
                    <CopyCommand command="irm https://backbencher.cc/install.ps1 | iex" />
                  </div>
                </div>
              </div>

              <div className="docs-body">
                <p>
                  Both installers prefer npm and install the same package. Only when npm is
                  unavailable do they fall back to a release binary from the{" "}
                  <code>backbencher-hq/backbencher-brain</code> GitHub releases, and only after its
                  sha256 checksum verifies against the release’s <code>checksums.txt</code>. Pin
                  with <code>VERSION=&lt;version&gt;</code> in front of either command (
                  <code>$env:VERSION=&quot;&lt;version&gt;&quot;</code> on Windows); every release
                  on the GitHub releases page names its exact versions and checksums.
                </p>
                <p>
                  Pin the npm package with{" "}
                  <code>npm install -g @backbencher/brain@&lt;version&gt;</code>.
                </p>
                <h3>Verify</h3>
                <pre className="instr-pre">bb --version</pre>
                <p>
                  If <code>bb</code> is not found, check that your npm global prefix (
                  <code>npm prefix -g</code>) or <code>~/.local/bin</code> is on your PATH, then run
                  the absolute path to verify.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="first-index" className="instr-section docs-section">
              <h2 className="instr-section-title">Build the first index.</h2>
              <p className="instr-section-lead">
                Run <code>bb index</code> from the repository root, then <code>bb stats</code> to see
                what landed. The four follow-ups below are what you reach for when the tree, the derived
                data, or a run needs attention.
              </p>

              <pre className="instr-pre">{`cd /path/to/project
bb index
bb stats`}</pre>

              <dl className="docs-cmds">
                <div>
                  <dt>
                    <code>bb index --changed</code>
                  </dt>
                  <dd>Incremental: only missing or changed files are reparsed.</dd>
                </div>
                <div>
                  <dt>
                    <code>bb index --force</code>
                  </dt>
                  <dd>Wipes the existing index for this project and rebuilds it in place.</dd>
                </div>
                <div>
                  <dt>
                    <code>bb index --post</code>
                  </dt>
                  <dd>
                    Re-runs relationship resolution, enrichment, and health phases without reparsing
                    source files — the remediation for stale derived data.
                  </dd>
                </div>
                <div>
                  <dt>
                    <code>bb index --resume</code>
                  </dt>
                  <dd>
                    Continues an interrupted run from its checkpoint: only missing or changed files are
                    processed, then the bounded derived pass runs.
                  </dd>
                </div>
              </dl>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="how-the-index-works" className="instr-section docs-section">
              <h2 className="instr-section-title">How the index works.</h2>
              <p className="instr-section-lead">
                <code>bb index</code> walks your project, parses every file with the right grammar,
                extracts symbols and relationships, and persists them into one local database per
                project — the same store every read surface answers from. Nothing is sent anywhere: the
                index lives on your machine.
              </p>

              <ol className="instr-steps">
                <li className="instr-step">
                  <span className="instr-step-num">01</span>
                  <div>
                    <h3>Parse — a dedicated grammar per family</h3>
                    <p>
                      For {PARSERS.length} of the {TRUTH.languages.classified} registry ids a dedicated
                      analyzer (tree-sitter grammar or hand-written oracle) reads the file with AST
                      precision. The other {TRUTH.languages.classified - PARSERS.length} — TSX, Sass and
                      Terraform — are aliases served by the TypeScript, CSS and HCL analyzers rather
                      than separate languages, so the editor lane can never exceed the analyzer set.
                      See the{" "}
                      <Link href="/languages">language reference</Link> for the per-family depth label.
                    </p>
                  </div>
                </li>
                <li className="instr-step">
                  <span className="instr-step-num">02</span>
                  <div>
                    <h3>Extract — symbols, bounds, relationships</h3>
                    <p>
                      Each analyzer records what it can prove: symbols with a kind and exact byte bounds
                      (functions, classes, modules, selectors, tables — whatever the family has), and the
                      relationships between them — calls, imports, references, instantiations, uses.
                      Cross-language edges carry an explicit evidence label (structural, import-based,
                      usage-contextual, reference-qualified, or inferred), never a silent guess. What a
                      file could not be parsed into is declared, not invented.
                    </p>
                  </div>
                </li>
                <li className="instr-step">
                  <span className="instr-step-num">03</span>
                  <div>
                    <h3>Persist — one relational store per project</h3>
                    <p>
                      Extracted rows land in one local SQLite database per project (the brain): files,
                      symbols, relationships, imports, and index status as first-class tables; agent
                      annotations and semantic embedding vectors stored alongside when configured;
                      security taint flows and project health as derived tables. A migration layer keeps
                      the schema versioned.
                    </p>
                  </div>
                </li>
                <li className="instr-step">
                  <span className="instr-step-num">04</span>
                  <div>
                    <h3>Serve — every door reads the same store</h3>
                    <p>
                      One index, several doors: the{" "}
                      <Link href="/tools">{TRUTH.tools.length} MCP tools</Link> over <code>bb mcp</code>,
                      the CLI (<code>bb search</code>, <code>bb stats</code>, <code>bb health</code>), and
                      the <Link href="/editors">editor integration</Link>, which talks to the same index
                      through the LSP server — hover, symbol navigation, and call-graph views answer from
                      the same rows a tool call reads.
                    </p>
                  </div>
                </li>
                <li className="instr-step">
                  <span className="instr-step-num">05</span>
                  <div>
                    <h3>Guard — freshness and safe writes</h3>
                    <p>
                      Reads resolve freshness against the live working tree and say so when the index is
                      behind (and how to catch up). Writes are guarded: path checks, AST byte bounds,
                      validation, and rollback, with <code>dryRun</code> previews before risky edits.
                      After an edit, the changed file is reindexed so the agent answers from what it just
                      wrote.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="docs-note">
                <p className="docs-note-title">Depth is declared, never assumed</p>
                <p>
                  Symbol kinds, relationship edges, and depth labels on this site are audited against
                  the analyzers. If a family parses deeper or shallower than documented, that is a bug
                  worth reporting.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="what-gets-indexed" className="instr-section docs-section">
              <h2 className="instr-section-title">What gets indexed.</h2>
              <p className="instr-section-lead">
                The indexer walks your project once and then keeps up incrementally. Three layers decide
                what it reads — in this order.
              </p>

              <div className="docs-body">
                <h3>1 · Built-in directory skips</h3>
                <p>
                  Always on, in every project, before any of your own rules are read. These directories
                  never reach the parser:
                </p>
                <div className="docs-chips">
                  {INDEXING.skipDirs.map((dir) => (
                    <code key={dir} className="docs-chip">
                      {dir}
                    </code>
                  ))}
                </div>

                <h3>2 · Your gitignore rules are respected</h3>
                <p>
                  Anything git ignores, the indexer skips — a <code>{INDEXING.ignoreFiles[0]}</code> at
                  any level of the tree is read as it walks, so a project that is already gitignored
                  correctly needs no extra configuration.
                </p>

                <h3>3 · Your .bbignore overrides all of it</h3>
                <p>
                  A project-local <code>{INDEXING.ignoreFiles[1]}</code> file (gitignore syntax) has
                  higher priority than <code>{INDEXING.ignoreFiles[0]}</code> — use it when you want git
                  to track something but the indexer to skip it, like large generated fixtures. After you
                  add it, <code>bb index --changed</code> applies it. If an unexpected directory shows up
                  in your index, that is the fix — and it is a bug worth reporting.
                </p>

                <h3>Size tiers — a guardrail, not a silent cap</h3>
                <p>
                  One generated blob can stall a whole run, so very large files are handled by tier
                  instead of being parsed blindly:
                </p>
                <div className="docs-table-wrap">
                  <div className="docs-table-scroll">
                    <table className="docs-table wide">
                      <thead>
                        <tr>
                          <th scope="col">File size</th>
                          <th scope="col">What the indexer does</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="mono">up to {mb(INDEXING.fullAstBytes)}</td>
                          <td>
                            Full AST parse — symbols with byte bounds, and the relationships between
                            them.
                          </td>
                        </tr>
                        <tr>
                          <td className="mono">
                            {mb(INDEXING.fullAstBytes)}–{mb(INDEXING.structuralBytes)}
                          </td>
                          <td>
                            Structural symbols only, for {INDEXING.structuralFormatsNote} — the formats
                            where a huge file is usually machine-generated.
                          </td>
                        </tr>
                        <tr>
                          <td className="mono">over {mb(INDEXING.structuralBytes)}</td>
                          <td>
                            Skipped, never parsed ({mb(INDEXING.walkSizeLimit)} walk limit). The tiers
                            are tuned, not dogma: if a file you care about is skipped, tell us.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3>How long indexing takes</h3>
                <p>
                  The <strong>first index</strong> is the expensive pass: it parses every discovered
                  file and then runs the derived phases. A{" "}
                  <strong>re-run of an unchanged project</strong> is fast, because files whose size and
                  modification time are unchanged are not re-parsed at all. Progress streams while it
                  runs, and <code>bb status</code> reports per-phase timings of the last run.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="keeping-fresh" className="instr-section docs-section">
              <h2 className="instr-section-title">Keeping the index fresh.</h2>
              <p className="instr-section-lead">
                A code index is only useful while it matches the working tree. Three mechanisms, in the
                order you will normally meet them.
              </p>

              <div className="docs-body">
                <h3>1 · Reads refresh stale files inside a budget</h3>
                <p>
                  When a read path touches files that are stale or missing in the index, it repairs
                  exactly those files within a budget before answering, and says so in an{" "}
                  <code>auto-refreshed N files in Xms</code> line. The budget is{" "}
                  <strong>{FRESHNESS.autoRefresh.maxFiles} files</strong> or{" "}
                  <strong>{mib(FRESHNESS.autoRefresh.maxBytes)} of changed bytes</strong>, whichever
                  comes first, and it is tunable through the environment:
                </p>
                <div className="docs-chips">
                  {FRESHNESS.env.map((name) => (
                    <code key={name} className="docs-chip">
                      {name}
                    </code>
                  ))}
                </div>
                <p>
                  <code>{FRESHNESS.env[0]}=1</code> opts out entirely. If the repair would exceed the
                  budget, or another index run holds the lock, the tool answers from existing data with
                  a staleness footer instead of pretending the index is current.
                </p>

                <h3>2 · Incremental, on purpose</h3>
              </div>

              <div className="instr-grid">
                <div className="instr-surface">
                  <p className="instr-surface-label">Routine sync</p>
                  <h3>Changed files only</h3>
                  <pre className="instr-pre">bb index --changed</pre>
                  <p>
                    Re-parses only files changed since the last index, and runs the bounded derived-data
                    pass so relationships stay current. This is the routine “I edited things, sync my
                    index” command.
                  </p>
                </div>
                <div className="instr-surface">
                  <p className="instr-surface-label">One file</p>
                  <h3>A single file</h3>
                  <pre className="instr-pre">bb index --file src/session.ts</pre>
                  <p>
                    Re-indexes one file’s symbols and relationships. Use it right after an agent
                    creates or edits a function.
                  </p>
                </div>
                <div className="instr-surface">
                  <p className="instr-surface-label">Derived data</p>
                  <h3>Without re-parsing</h3>
                  <pre className="instr-pre">bb index --post</pre>
                  <p>
                    Re-runs the derived phases without re-parsing anything — the remediation when derived
                    data was skipped or went stale (for example after <code>--skip-post-processing</code>
                    ).
                  </p>
                </div>
                <div className="instr-surface">
                  <p className="instr-surface-label">Interrupted run</p>
                  <h3>From the checkpoint</h3>
                  <pre className="instr-pre">bb index --resume</pre>
                  <p>
                    Continues an interrupted run from its checkpoint: only missing or changed files are
                    processed, then the bounded derived pass runs.
                  </p>
                </div>
              </div>

              <div className="docs-body">
                <h3>What a changed file recomputes</h3>
                <p>
                  Only what the changed files touch — never the whole index. This is the exact list,
                  phase by phase:
                </p>
                <div className="docs-table-wrap">
                  <div className="docs-table-scroll">
                    <table className="docs-table wide">
                      <thead>
                        <tr>
                          <th scope="col">Data</th>
                          <th scope="col">Updated for changed files</th>
                          <th scope="col">How</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="mono">symbols</td>
                          <td>yes</td>
                          <td>
                            Changed files are re-parsed by the same analyzers and their symbol rows are
                            rewritten; unchanged files are not touched.
                          </td>
                        </tr>
                        {FRESHNESS.derivedPhases.map((phase) => (
                          <tr key={phase}>
                            <td className="mono">{phase}</td>
                            <td>yes</td>
                            <td>{PHASE_ROW[phase]}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="mono">deleted files</td>
                          <td>yes</td>
                          <td>Purged from the index, including their derived rows.</td>
                        </tr>
                        <tr>
                          <td className="mono">embeddings</td>
                          <td>queued</td>
                          <td>
                            New and changed symbols are queued for the embedding provider during storage;
                            vectors fill in asynchronously with a local fallback when no provider is
                            configured.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p>
                  Two honest edges: embeddings are asynchronous, so semantic search can lag symbol and
                  relationship freshness by a few seconds after an edit; and a derived phase that fails
                  leaves the run’s status <code>partial</code> rather than silently claiming
                  success. A run summary reports what it did as{" "}
                  <code>{`derivedPass: ${FRESHNESS.derivedPassLabels.join(" | ")}`}</code> — a bounded
                  pass covers the touched files, a full pass covers everything, and a deferred pass means
                  the derived data is still owed (run <code>bb index --post</code>).
                </p>
              </div>

              <div className="docs-note">
                <p className="docs-note-title">Only a full rebuild recomputes everything</p>
                <p>
                  <code>bb index --force</code> wipes the project’s index and rebuilds it from
                  scratch. Incremental runs cover every case above, so you should rarely need it.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="embeddings" className="instr-section docs-section">
              <h2 className="instr-section-title">Turn on semantic search.</h2>
              <p className="instr-section-lead">
                Semantic search (<code>bb_ask</code> semantic mode) uses embedding vectors. Without a
                provider key, the indexer still works — semantic search just falls back to weaker local
                vectors, and the CLI tells you so honestly.
              </p>

              <pre className="instr-pre">{`bb setup        # interactive: provider, API key, model
bb setup show   # inspect config — the key is shown as a fingerprint only`}</pre>

              <div className="docs-body">
                <p>Diagnose a broken setup or inconsistent index:</p>
                <pre className="instr-pre">bb doctor</pre>
                <p>
                  <code>bb doctor</code> is read-only. <code>bb doctor --fix</code> repairs
                  file-permission problems only (0600 on the config); it changes nothing else. The first{" "}
                  <code>bb index</code> run also offers the setup wizard interactively — skip it once
                  with <code>bb index --no-setup</code>.
                </p>
              </div>

              <div className="docs-note docs-note-safe">
                <p className="docs-note-title">Keys stay on your machine</p>
                <p>
                  The API key is stored with owner-only permissions (0600) and is never sent to any AI
                  agent — tools see a fingerprint only.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="agent-tools" className="instr-section docs-section">
              <h2 className="instr-section-title">The agent tools.</h2>
              <p className="instr-section-lead">
                Backbencher exposes {TRUTH.tools.length} public MCP tools for indexed discovery,
                analysis, documentation, guarded mutation, diagnostics, security analysis, migration
                planning, and graph export. These are tool calls an MCP client invokes — not shell
                subcommands. Each row carries the tool’s registry summary; the{" "}
                <Link href="/tools">tool reference</Link> adds the full contract — the complete generated
                description, modes, defaults, parameters and examples.
              </p>

              <div className="docs-table-wrap">
                <div className="docs-table-scroll">
                  <table className="docs-table wide">
                    <thead>
                      <tr>
                        <th scope="col">Tool</th>
                        <th scope="col">Group</th>
                        <th scope="col">What it does</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOOL_ROWS.map((tool) => (
                        <tr key={tool.name}>
                          <td className="mono">
                            <Link href={`/tools#${tool.name}`}>{tool.name}</Link>
                          </td>
                          <td className="docs-cell-group">{tool.group}</td>
                          <td>
                            <RichText text={publicCopy(tool.summary)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="docs-more">
                <Link href="/tools">
                  Full schemas, defaults, safety behavior, and limitations{" "}
                  <span aria-hidden>→</span>
                </Link>
              </p>

              <div className="docs-body">
                <p>From the terminal, run any tool with JSON arguments:</p>
                <pre className="instr-pre">
                  {`bb tool bb_search --args '{"mode":"symbol","query":"createSession"}'`}
                </pre>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="mcp" className="instr-section docs-section">
              <h2 className="instr-section-title">Connect an MCP client.</h2>
              <p className="instr-section-lead">
                <code>bb mcp</code> starts the Backbencher MCP server over stdio. Point any MCP client at
                it — Claude Code, Cursor, VS Code, opencode, and others.
              </p>

              <pre className="instr-pre">{`# Claude Code
claude mcp add backbencher -- bb mcp --dir /path/to/project

# Generic MCP client configuration
{
  "mcpServers": {
    "backbencher": {
      "command": "bb",
      "args": ["mcp", "--dir", "/path/to/project"]
    }
  }
}`}</pre>

              <div className="docs-note">
                <p className="docs-note-title">
                  <code>bb mcp</code> starts a server, it does not configure clients
                </p>
                <p>
                  <code>bb mcp</code> is the server process. Client registration happens in your MCP
                  client’s own configuration, as shown above.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="cli-reference" className="instr-section docs-section">
              <h2 className="instr-section-title">The CLI reference.</h2>
              <p className="instr-section-lead">
                All {DOCS_FACTS.cli.commands.length} top-level commands and every flag they accept. This
                reference is generated from the CLI’s own help text, so it cannot list a flag the
                binary does not have — run <code>bb &lt;command&gt; --help</code> for the same output on
                your machine.
              </p>

              <div className="docs-commands">
                {DOCS_FACTS.cli.commands.map((cmd) => (
                  <article key={cmd.name} className="docs-command" id={`cli-${cmd.name}`}>
                    <h3 className="docs-command-usage">
                      {`bb ${cmd.usage.replace(/^bb\s*/, "")}`}
                    </h3>
                    <p className="docs-command-summary">
                      <RichText text={publicCopy(cmd.summary)} />
                    </p>

                    {cmd.args.length > 0 && (
                      <>
                        <p className="docs-meta-label">Arguments</p>
                        <ul className="docs-arg-list">
                          {cmd.args.map((arg) => (
                            <li key={arg.name}>
                              <code>{arg.name}</code> —{" "}
                              <RichText text={publicCopy(arg.description)} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {cmd.subcommands.length > 0 && (
                      <>
                        <p className="docs-meta-label">Subcommands</p>
                        <div className="docs-chips">
                          {cmd.subcommands.map((sub) => (
                            <code key={sub.name} className="docs-chip">
                              {`bb ${cmd.name} ${sub.name}`}
                            </code>
                          ))}
                        </div>
                      </>
                    )}

                    {cmd.flags.length > 0 && (
                      <div className="docs-table-wrap">
                        <div className="docs-table-scroll">
                          <table className="docs-table wide">
                            <thead>
                              <tr>
                                <th scope="col">Flag</th>
                                <th scope="col">What it does</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cmd.flags.map((flag) => (
                                <tr key={flag.flags.join(" ")}>
                                  <td className="mono">
                                    {flag.flags.join(", ")}
                                    {flag.argument ? ` <${flag.argument}>` : ""}
                                  </td>
                                  <td>
                                    <RichText text={publicCopy(flag.description)} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              <div className="docs-body">
                <p>
                  Global flags, accepted by every command:{" "}
                  {DOCS_FACTS.cli.globalFlags.map((flag) => flag.flags.join(", ")).join(" · ")}.
                </p>
                <p>Daily diagnostics:</p>
                <pre className="instr-pre">{`bb stats          # counts
bb status         # is an index running? what did the last run do?
bb health         # is the index healthy and fresh?
bb doctor         # is the embedding setup consistent?`}</pre>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="data-and-upgrades" className="instr-section docs-section">
              <h2 className="instr-section-title">Data, upgrades &amp; uninstall.</h2>
              <p className="instr-section-lead">
                Where the index lives, what an upgrade keeps, and how to clean up.
              </p>

              <div className="docs-body">
                <h3>Where the index lives</h3>
                <p>
                  One directory, keyed per project, outside your repository and outside the installed
                  program:
                </p>
                <dl className="docs-paths">
                  <div>
                    <dt>
                      <code>{INDEX_PATH}</code>
                    </dt>
                    <dd>The index: symbols, relationships, embeddings.</dd>
                  </div>
                  <div>
                    <dt>
                      <code>{CACHE_PATH}</code>
                    </dt>
                    <dd>The parser cache.</dd>
                  </div>
                </dl>
                <p>
                  The <code>&lt;project-id&gt;</code> is a {STORAGE.projectIdNote}, so two checkouts of
                  the same repository at different paths have separate indexes. Override the whole
                  location with <code>{STORAGE.envOverride}</code> — recommended where the home directory
                  is not reliably writable or persistent (sandboxes, CI, editor hosts).
                </p>

                <h3>Upgrading keeps your data</h3>
                <p>
                  New releases run idempotent schema migrations when they open the database: an upgraded{" "}
                  <code>bb</code> either uses the existing index as it is or upgrades it in place — it
                  never wipes it. To move to a new release, run{" "}
                  <code>npm install -g @backbencher/brain@latest</code> (or re-run the installer, which
                  does the same thing through npm);{" "}
                  <code>npm install -g @backbencher/brain@&lt;version&gt;</code> pins a specific release.
                  There is no separate in-place upgrade subcommand.
                </p>

                <h3>Uninstall and reinstall</h3>
                <p>
                  Uninstalling removes the program, not <code>{STORAGE.dataDir}</code>. Reinstall and
                  every index, embedding and history entry is exactly where you left it. You start from
                  zero only if the project moved to a different absolute path — then:
                </p>
                <pre className="instr-pre">bb index --import /path/to/old-brain.db</pre>
                <p>
                  adopts (re-homes) an existing index for the project at its current location. Moving a
                  database between machines works the same way when the codebase fingerprint matches.
                </p>

                <h3>See and reclaim disk space</h3>
                <pre className="instr-pre">{`bb projects                  # every indexed project: DB path, size, counts, last index
bb projects --sort size      # biggest indexes first
bb projects --remove <id>    # delete one project's index + embeddings
bb stats                     # committed counts for the current project`}</pre>
                <p>
                  Removing a project is the only operation that deletes an index. Nothing else in the CLI
                  does, and no command sends your code or your index anywhere.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="troubleshooting" className="instr-section docs-section">
              <h2 className="instr-section-title">Troubleshooting.</h2>
              <p className="instr-section-lead">
                Symptom-based fixes. Each one names a real command that resolves it.
              </p>

              <div className="instr-grid docs-fixes">
                {FIXES.map((fix) => (
                  <div key={fix.title} className="instr-surface docs-fix">
                    <p className="instr-surface-label">{fix.label}</p>
                    <h3>{fix.title}</h3>
                    <p>{fix.body}</p>
                    <pre className="instr-pre">{fix.code}</pre>
                    {fix.extra && <p className="docs-fix-extra">{fix.extra}</p>}
                  </div>
                ))}
              </div>

              <div className="docs-body">
                <p>
                  Still stuck? Send the output of <code>bb health</code> and <code>bb stats</code> to{" "}
                  <Link href="/support#still-have-questions">support</Link>.
                </p>
              </div>

              <div className="docs-note docs-note-safe">
                <p className="docs-note-title">Upgrading keeps your data</p>
                <p>
                  To move to a new release, run{" "}
                  <code>npm install -g @backbencher/brain@latest</code> — it replaces the installed package
                  in place, leaves your index untouched, and there is no separate in-place upgrade
                  subcommand. Details in{" "}
                  <Link href="#data-and-upgrades">Data, upgrades &amp; uninstall</Link>.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------- */}
            <section id="next" className="instr-section docs-section">
              <h2 className="instr-section-title">Where to go next.</h2>
              <p className="instr-section-lead">
                The guide stops where the references begin. These pages go deeper than a guide can.
              </p>
              <div className="instr-next-grid">
                <Link className="instr-next" href="/tools">
                  <strong>Tool reference →</strong>
                  <span>Full schemas, defaults, declared limits and examples for all {TRUTH.tools.length} tools.</span>
                </Link>
                <Link className="instr-next" href="/languages">
                  <strong>Language reference →</strong>
                  <span>What bb records in each family, and where that family’s analyzer stops.</span>
                </Link>
                <Link className="instr-next" href="/editors">
                  <strong>Editor integration →</strong>
                  <span>Hover with evidence tiers, navigation and impact inside your editor.</span>
                </Link>
                <Link className="instr-next" href="/support">
                  <strong>Support →</strong>
                  <span>Questions, bug reports and the support route.</span>
                </Link>
              </div>
            </section>

            <footer className="docs-foot">
              <p>
                Documentation is generated against the current CLI surface and verified by CI. Some
                safety and semantic features depend on index freshness, grammar availability, and an
                active language server.
              </p>
              <p className="docs-foot-links">
                <a href="#top">Back to top ↑</a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </InstrumentShell>
  )
}
