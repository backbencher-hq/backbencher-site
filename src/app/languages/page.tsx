import type { Metadata } from "next"
import Link from "next/link"
import { PARSERS, RELATIONSHIP_TYPES } from "@/data/brain-languages"
import { DEPTH_COVERAGE } from "@/data/language-depth"
import { languageHref } from "@/data/language-depth/slugs"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"

export const metadata: Metadata = {
  title: "Languages — 50 analyzers, one index",
  description:
    "Every language Backbencher indexes, the relationship vocabulary each analyzer constructs, and the three alias registry ids that share a parent analyzer.",
  alternates: { canonical: "/languages" },
}

const REGISTRY_IDS = PARSERS.reduce((total, parser) => total + parser.ids.length, 0)
const ALIASES = PARSERS.filter((parser) => parser.ids.length > 1)
const VOCABULARY = RELATIONSHIP_TYPES.map((type) => ({
  type,
  families: PARSERS.filter((parser) => parser.emits.includes(type)).length,
})).sort((a, b) => b.families - a.families)

export default function LanguagesPage() {
  return (
    <InstrumentShell active="/languages">
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Languages · {PARSERS.length} hand-written analyzers</p>
          <h1 className="instr-title">
            Fifty languages. One <em>index.</em>
          </h1>
          <p className="instr-page-lead">
            Every language below has its own analyzer writing into the same local graph — no generic
            fallback a language can drop onto. Open one to see the extensions it claims, the registry
            ids it answers to, the symbols it records and the relationship types it constructs.
          </p>
          <p className="instr-page-meta">
            {PARSERS.length} analyzers · {REGISTRY_IDS} registry ids · {RELATIONSHIP_TYPES.length}{" "}
            relationship types · {DEPTH_COVERAGE.authored} authored depth records
          </p>
        </div>

        <section id="register" className="instr-section">
          <h2 className="instr-section-title">The register.</h2>
          <p className="instr-section-lead">
            One card per display family. The dot is the language’s own mark, the line under the
            name is the extensions the analyzer claims, and the count is how many of the{" "}
            {RELATIONSHIP_TYPES.length} relationship types that analyzer can actually construct.
          </p>
          <div className="instr-lang-grid">
            {PARSERS.map((parser) => (
              <Link className="instr-lang-card" key={parser.name} href={languageHref(parser.name)}>
                <span className="instr-lang-title">
                  <i className="instr-lang-dot" style={{ background: parser.color }} aria-hidden />
                  {parser.name}
                </span>
                <span className="ext">{parser.ext}</span>
                <span className="emits">
                  {parser.emits.length} of {RELATIONSHIP_TYPES.length} relationship types
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="vocabulary" className="instr-section">
          <span id="relationship-vocabulary" className="instr-anchor" aria-hidden="true" />
          <h2 className="instr-section-title">What an analyzer can say.</h2>
          <p className="instr-section-lead">
            Fourteen relationship types, and the number of analyzers that construct each one. A format
            with no invocation syntax produces no <code>calls</code> edge — that is a fact about the
            format, not a gap in the tool.
          </p>
          <div className="instr-vocab">
            {VOCABULARY.map((row) => (
              <div className="instr-vocab-row" key={row.type}>
                <span className="instr-vocab-name">{row.type}</span>
                <span className="instr-vocab-bar" aria-hidden>
                  <span style={{ width: `${(row.families / PARSERS.length) * 100}%` }} />
                </span>
                <span className="instr-vocab-count">{row.families}</span>
              </div>
            ))}
          </div>
          <p className="instr-note">
            Derived at build time from each analyzer module’s own emitted set. A bar shorter
            than {PARSERS.length} means the format itself does not carry that relationship.
          </p>
        </section>

        <section id="aliases" className="instr-section">
          <h2 className="instr-section-title">Three alias ids.</h2>
          <p className="instr-section-lead">
            A registry id does not have to be a language. Three ids resolve to a parent analyzer
            instead of adding a branch — same code path, same relationship vocabulary.
          </p>
          <div className="instr-grid">
            {ALIASES.map((parser) => {
              const aliases = parser.ids.filter((id) => id !== parser.ids[0])
              return (
                <div className="instr-surface" key={parser.name}>
                  <p className="instr-surface-label">Alias route</p>
                  <h3>{parser.name}</h3>
                  <p>
                    The {parser.name} analyzer also answers to{" "}
                    {aliases.map((id) => `“${id}”`).join(" and ")}, resolved by the same tree-sitter
                    grammar and the same emitted vocabulary.
                  </p>
                  <pre className="instr-pre">{parser.ids.join(" · ")}</pre>
                </div>
              )
            })}
          </div>
        </section>

        <section id="source" className="instr-section">
          <h2 className="instr-section-title">Where this register comes from.</h2>
          <p className="instr-section-lead">
            Extensions, registry ids and the recorded symbols are read from the table the engine’s
            own <code>SUPPORTED_LANGUAGES</code> registry generates; the relationship types are derived
            from the analyzer modules in <code>src/ast</code> rather than typed in beside them. If a
            card here disagrees with the code in front of you, that is a bug worth reporting.
          </p>
          <div className="instr-next-grid">
            <Link className="instr-next" href="/docs#how-the-index-works">
              <strong>How the index is built →</strong>
              <span>Parsing, storage and the 16 tables the index writes.</span>
            </Link>
            <Link className="instr-next" href="/docs#first-index">
              <strong>Index your first project →</strong>
              <span>What bb reads, what it skips, and what the first index proves.</span>
            </Link>
            <Link className="instr-next" href="/editors">
              <strong>Languages in your editor →</strong>
              <span>The same analyzers behind bb_lsp in VS Code, Zed, Helix and JetBrains.</span>
            </Link>
          </div>
        </section>
      </div>
    </InstrumentShell>
  )
}
