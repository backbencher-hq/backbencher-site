import type { Metadata } from 'next'
import Link from 'next/link'
import { EDITOR_FACTS as F } from '@/data/editors.generated'
import { InstrumentShell } from '@/components/instrument/InstrumentShell'
import './editors.css'

export const metadata: Metadata = {
  title: 'Editors — the bb_lsp language server',
  description:
    'bb_lsp answers hover, definition, references, symbols, call hierarchy and impact from your local Backbencher index, in VS Code, Zed, Helix and JetBrains.',
  alternates: { canonical: '/editors' },
}

const DISPLAY_NAMES: Record<string, string> = {
  typescript: 'TypeScript', javascript: 'JavaScript', python: 'Python', java: 'Java',
  kotlin: 'Kotlin', scala: 'Scala', groovy: 'Groovy', go: 'Go', rust: 'Rust',
  c: 'C', cpp: 'C++', csharp: 'C#', fsharp: 'F#', vb: 'Visual Basic', vba: 'VBA',
  zig: 'Zig', swift: 'Swift', dart: 'Dart', ruby: 'Ruby', php: 'PHP', perl: 'Perl',
  lua: 'Lua', r: 'R', julia: 'Julia', matlab: 'MATLAB', nim: 'Nim', clean: 'Clean',
  haskell: 'Haskell', clojure: 'Clojure', elixir: 'Elixir', erlang: 'Erlang',
  solidity: 'Solidity', hcl: 'HCL', terraform: 'Terraform', tsx: 'TSX',
  html: 'HTML', css: 'CSS', scss: 'SCSS', sass: 'Sass', vue: 'Vue', svelte: 'Svelte',
  json: 'JSON', yaml: 'YAML', toml: 'TOML', markdown: 'Markdown', xml: 'XML',
  graphql: 'GraphQL', protobuf: 'Protobuf', sql: 'SQL', bash: 'Bash',
  powershell: 'PowerShell', make: 'Make', 'objective-c': 'Objective-C',
}

function displayName(id: string): string {
  const known = DISPLAY_NAMES[id]
  if (known) return known
  return id === id.toLowerCase() ? id.toUpperCase() : id
}

const REGISTRY_IDS = F.launchLanguages.length
const ALIAS_IDS = new Set(F.analyzerAliases)
const ALIAS_COUNT = F.analyzerAliases.length
const ANALYZER_ROUTES = REGISTRY_IDS - ALIAS_COUNT
const ALIAS_NAMES = F.analyzerAliases.map(displayName).join(', ')
const OUTSIDE_NAMES = F.outsideEditor.map(displayName).join(', ')

const FEATURES: Array<{ title: string; body: string; editor?: string }> = [
  {
    title: 'Hover that names its evidence',
    body: 'Type, signature and the stored relationship facts for the symbol under the cursor, with its evidence tier and whether the record is fresh or stale. No guessed signature: if the index does not know, the hover says so. Cross-language handoffs are named in the hover where the index stores them.',
  },
  {
    title: 'Go to definition',
    body: 'Jump to the declaration the index stored, not a text match. A position the index does not know returns an empty result rather than a plausible guess.',
  },
  {
    title: 'Find references',
    body: 'Every indexed reference to the symbol, one location per served position. Stored rows that cannot be resolved to a source position are omitted and counted, never invented.',
  },
  {
    title: 'Document and workspace symbols',
    body: 'The symbols of the open file and of the whole index. Workspace results follow the index’s stored gravity ranking: exact names ahead of fuzzy matches.',
  },
  {
    title: 'Call hierarchy',
    body: 'The recorded callers and callees of a symbol, one level at a time — the same edges the graph and impact tools read.',
  },
  {
    title: 'Impact analysis',
    body: 'The bounded reverse-dependency set: what depends on this symbol, over how many files and within how many hops.',
    editor: 'VS Code hover action',
  },
  {
    title: 'Open in graph',
    body: 'The connections view for the hovered symbol, so the neighbourhood is visible without leaving the editor.',
    editor: 'VS Code hover action',
  },
  {
    title: 'Local, always',
    body: 'The server reads the same local SQLite index your CLI and MCP tools use. Nothing is uploaded; no call leaves the machine.',
  },
]

// Editor-specific scope comes from the integration records (languages each
// integration maps), never hand-typed. Steps stay the honest setup text for
// each editor; only the VSIX filename is assembled from the extension facts.
const SETUP: Array<{ id: string; name: string; kind: string; steps: string }> = [
  {
    id: 'vscode',
    name: 'VS Code and VS Code forks',
    kind: 'bundled extension',
    steps: `curl -LO https://github.com/backbencher-hq/backbencher-brain/releases/download/v${F.extension.version}/${F.extension.name}-${F.extension.version}.vsix\ncode --install-extension ${F.extension.name}-${F.extension.version}.vsix`,
  },
  {
    id: 'zed',
    name: 'Zed',
    kind: 'dev extension',
    steps: 'Extensions → Install Dev Extension → the product checkout’s ide/zed/bb-lsp directory, then open a file in an indexed project.',
  },
  {
    id: 'helix',
    name: 'Helix',
    kind: 'languages.toml entry',
    steps: 'Add a languages.toml entry whose server command is: node "<npm root -g>/@backbencher/brain/dist/lsp/server.js"',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains',
    kind: 'LSP4IJ template',
    steps: 'LSP4IJ → Language Servers → Import from custom template → ide/lsp4ij/bb-lsp in the product checkout.',
  },
]

const INTEGRATIONS = new Map(F.integrations.map((integration) => [integration.id, integration]))

function scopeFor(id: string): string {
  const integration = INTEGRATIONS.get(id)
  if (!integration) return 'the same server entry'
  if (integration.languages.length >= REGISTRY_IDS) return `all ${REGISTRY_IDS} registry ids`
  return integration.languages.map(displayName).join(', ')
}

export default function EditorsPage() {
  const ext = F.extension
  const versionRow = F.versionMatrix[0]

  return (
    <InstrumentShell active="/editors">
      <div className="instr-wrap instr-page editors-page">
        <header className="instr-page-head">
          <p className="instr-eyebrow">Editors · the bb_lsp language server</p>
          <h1 className="instr-title editors-title">
            Your editor, answering from the <em>same index.</em>
          </h1>
          <p className="instr-page-lead">
            <code>bb_lsp</code> is Backbencher’s language server: hover that names its evidence
            tier, go-to-definition, find references, document and workspace symbols, call hierarchy,
            impact and graph views — all served from the local index your CLI and MCP tools read. It
            is a <strong>complement</strong> to your editor’s own language server, not a
            replacement: {F.exclusions.join(', ')}.
          </p>
          <p className="instr-page-meta">
            {ext.displayName} v{ext.version} · {REGISTRY_IDS} registry ids · requires bb_lsp ≥{' '}
            {ext.minServerVersion}
          </p>
        </header>

        <section id="features" className="instr-section">
          <h2 className="instr-section-title">What you get in the editor.</h2>
          <p className="instr-section-lead">
            The server answers from stored facts, so every response can show the tier it came from
            and whether the record is fresh. The same rules as the CLI, the MCP tools and the graph.
          </p>
          <div className="editors-features">
            {FEATURES.map((feature) => (
              <div className="editors-feature" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                {feature.editor ? <span className="editors-feature-tag">{feature.editor}</span> : null}
              </div>
            ))}
          </div>
        </section>

        <section id="limits" className="instr-section">
          <h2 className="instr-section-title">What it deliberately does not do.</h2>
          <p className="instr-section-lead">
            bb_lsp is not a compiler front-end and does not pretend to be one. Your editor keeps its
            own language server for the jobs that need a full type system; bb_lsp adds the graph
            facts that server does not have.
          </p>
          <div className="editors-callout">
            <p className="editors-callout-label">Declared exclusions</p>
            <ul className="editors-exclusions">
              {F.exclusions.map((exclusion) => (
                <li key={exclusion}>{exclusion.charAt(0).toUpperCase() + exclusion.slice(1)}</li>
              ))}
            </ul>
            <p className="editors-callout-body">
              Where a first-party language server exists, bb_lsp must not degrade its activation or
              startup — if it does, that is a bug, not a trade-off. It adds graph, navigation and
              evidence facts to that server; it does not replace it.
            </p>
          </div>
        </section>

        <section id="languages" className="instr-section">
          <h2 className="instr-section-title">Every analyzer is in the launch set.</h2>
          <p className="instr-section-lead">
            The launch set is the same analyzer inventory the CLI indexes with: {REGISTRY_IDS}{' '}
            registry ids across {ANALYZER_ROUTES} analyzers, one server and no per-language
            configuration. {ALIAS_COUNT} of those ids — {ALIAS_NAMES} — are alias ids answered by
            their parent analyzer rather than extra languages; {OUTSIDE_NAMES} is outside the
            editor launch set.
          </p>
          <ul className="editors-langs" aria-label={`${REGISTRY_IDS} launch registry ids`}>
            {F.launchLanguages.map((id) => (
              <li className="editors-lang" key={id}>
                <span className="editors-lang-name">{displayName(id)}</span>
                {ALIAS_IDS.has(id) ? <span className="editors-lang-tag">alias</span> : null}
              </li>
            ))}
          </ul>
          <p className="instr-note">
            An alias id shares its parent analyzer’s code path and relationship vocabulary; it
            is a separate registry entry, not a separate language. {ANALYZER_ROUTES} of the{' '}
            {REGISTRY_IDS} ids are analyzers.
          </p>
        </section>

        <section id="setup" className="instr-section">
          <h2 className="instr-section-title">Set it up in your editor.</h2>
          <p className="instr-section-lead">
            Install <code>backbencher-brain</code> first, then index the project once with{' '}
            <code>bb index</code>. bb_lsp ships inside the installed package; each integration below
            launches a server entry on the machine.
          </p>
          <div className="editors-setup">
            {SETUP.map((row) => (
              <div className="editors-setup-card" key={row.id}>
                <div className="editors-setup-head">
                  <h3>{row.name}</h3>
                  <span className="editors-setup-kind">{row.kind}</span>
                </div>
                <pre className="instr-pre">{row.steps}</pre>
                <p className="editors-setup-scope">
                  Scope: <b>{scopeFor(row.id)}</b>
                </p>
              </div>
            ))}
          </div>
          <div className="editors-callout">
            <p className="editors-callout-label">Distribution</p>
            <p className="editors-callout-body">
              The VS Code extension is attached to the GitHub release as{' '}
              <code>bb-lsp-vscode-{F.extension.version}.vsix</code>; it is not on a marketplace yet.
              The {versionRow.extension} extension line requires a server that reports version{' '}
              {versionRow.minServer} or newer, and refuses a server that will not state its version.
            </p>
            <p className="editors-callout-body">
              Editor configuration and the server live in the{' '}
              <a
                href="https://github.com/backbencher-hq/backbencher-brain"
                target="_blank"
                rel="noopener noreferrer"
              >
                product repository
              </a>
              .
            </p>
          </div>
        </section>

        <section id="settings" className="instr-section">
          <h2 className="instr-section-title">Settings.</h2>
          <p className="instr-section-lead">
            {F.settingsDocRows.length} settings from the extension manifest, with the defaults a
            fresh install runs with.
          </p>
          <div
            className="editors-table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Editor settings table"
          >
            <table className="editors-table">
              <caption className="editors-sr-only">
                bb_lsp settings, their defaults and what each one does
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="editors-col-key">
                    Setting
                  </th>
                  <th scope="col" className="editors-col-default">
                    Default
                  </th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                {F.settingsDocRows.map((row) => (
                  <tr key={row.key}>
                    <td className="editors-td-key">{row.key}</td>
                    <td className="editors-td-default">{row.default}</td>
                    <td>{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="instr-note">On a narrow screen the table scrolls sideways inside its panel.</p>
        </section>

        <section id="next" className="instr-section">
          <h2 className="instr-section-title">Keep going.</h2>
          <div className="instr-next-grid">
            <Link className="instr-next" href="/install">
              <strong>Install bb →</strong>
              <span>One npm package puts the CLI, the index and the language server on your machine.</span>
            </Link>
            <Link className="instr-next" href="/docs#mcp">
              <strong>Connect an MCP client →</strong>
              <span>Point your agent host at the same local index the editor reads.</span>
            </Link>
            <Link className="instr-next" href="/languages">
              <strong>The analyzers behind bb_lsp →</strong>
              <span>What each language’s analyzer records and the relationships it builds.</span>
            </Link>
          </div>
        </section>
      </div>
    </InstrumentShell>
  )
}
