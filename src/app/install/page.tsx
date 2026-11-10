import type { Metadata } from "next"
import Link from "next/link"
import { TRUTH } from "@/data/truth.generated"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import { CopyCommand } from "@/components/instrument/CopyCommand"

export const metadata: Metadata = {
  title: "Install bb — local code intelligence",
  description:
    "Install the Backbencher CLI with npm, or with the shell and PowerShell installers on macOS, Linux and Windows. Your code never leaves your machine.",
  alternates: { canonical: "/install" },
}

const COMMAND = "npm install -g backbencher-brain"

export default function InstallPage() {
  return (
    <InstrumentShell active="/install">
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Install · bb {TRUTH.version}</p>
          <h1 className="instr-title">
            Install once. Answer <em>locally.</em>
          </h1>
          <p className="instr-page-lead">
            One npm package puts the CLI, the index and the MCP server on your machine. There is no
            account, no cloud index and no API key to start: your source stays on disk, and every
            answer reads from it.
          </p>
          <p className="instr-page-meta">
            npm package backbencher-brain · Node.js &gt;= 18 · macOS · Linux · Windows
          </p>
        </div>

        <section id="methods" className="instr-section">
          <h2 className="instr-section-title">Three ways in.</h2>
          <p className="instr-section-lead">
            npm is the primary path and the version-exact artifact every release publishes. The
            installers prefer npm too; they fall back to a checksum-verified release binary only when
            npm is unavailable.
          </p>
          <div className="instr-grid">
            <div className="instr-surface primary">
              <p className="instr-surface-label">Primary · npm</p>
              <h3>npm</h3>
              <p>Best when you already use Node.js. Version-exact, and the package the CLI upgrades from.</p>
              <div className="instr-cmd-row">
                <CopyCommand command={COMMAND} />
              </div>
              <p className="instr-note">
                bb lands in your npm global prefix — npm prefix -g — so make sure its bin directory is
                on PATH.
              </p>
            </div>
            <div className="instr-surface">
              <p className="instr-surface-label">Shell installer</p>
              <h3>macOS &amp; Linux</h3>
              <p>Downloads the installer, which installs the same npm package and verifies what it runs.</p>
              <div className="instr-cmd-row">
                <CopyCommand command="curl -fsSL https://backbencher.cc/install.sh | bash" />
              </div>
              <p className="instr-note">Falls back to a release binary only when npm is unavailable.</p>
            </div>
            <div className="instr-surface">
              <p className="instr-surface-label">PowerShell installer</p>
              <h3>Windows</h3>
              <p>PowerShell installer for x64 and ARM64; it installs the npm package first, too.</p>
              <div className="instr-cmd-row">
                <CopyCommand command="irm https://backbencher.cc/install.ps1 | iex" />
              </div>
              <p className="instr-note">A release fallback lands in %USERPROFILE%\.local\bin.</p>
            </div>
          </div>
        </section>

        <section id="verify" className="instr-section">
          <h2 className="instr-section-title">Verify it works.</h2>
          <p className="instr-section-lead">
            Four commands, in order. The first confirms the install; the last confirms the index
            answers.
          </p>
          <ol className="instr-steps">
            <li className="instr-step">
              <span className="instr-step-num">01</span>
              <div>
                <h3>Check the version</h3>
                <p>Should print the release you installed.</p>
                <pre className="instr-pre">bb --version</pre>
              </div>
            </li>
            <li className="instr-step">
              <span className="instr-step-num">02</span>
              <div>
                <h3>Check the machine</h3>
                <p>Reports Node, bindings, index paths and anything missing, with a fix for each.</p>
                <pre className="instr-pre">bb doctor</pre>
              </div>
            </li>
            <li className="instr-step">
              <span className="instr-step-num">03</span>
              <div>
                <h3>Index a project</h3>
                <p>Run it from the repository you want to ask about. The index is a local SQLite file.</p>
                <pre className="instr-pre">{`cd your-project
bb index`}</pre>
              </div>
            </li>
            <li className="instr-step">
              <span className="instr-step-num">04</span>
              <div>
                <h3>Ask it something</h3>
                <p>Search returns symbols with their exact bounds; the MCP tools return the graph facts.</p>
                <pre className="instr-pre">{`bb search "resolveEmbeddingConfig"
bb stats`}</pre>
              </div>
            </li>
          </ol>
        </section>

        <section id="included" className="instr-section">
          <h2 className="instr-section-title">What gets installed.</h2>
          <div className="instr-grid">
            <div className="instr-surface">
              <p className="instr-surface-label">The package</p>
              <h3>backbencher-brain@{TRUTH.version}</h3>
              <p>
                The published npm package. The shell and PowerShell installers resolve to the same
                package when npm is available; a release binary is only a fallback and is accepted
                after its checksum verifies.
              </p>
            </div>
            <div className="instr-surface">
              <p className="instr-surface-label">The binary</p>
              <h3>bb</h3>
              <p>
                The CLI, the language server and the MCP server in one executable. No daemon, no
                background service, nothing listening on a port.
              </p>
            </div>
            <div className="instr-surface">
              <p className="instr-surface-label">The index</p>
              <h3>A local SQLite file</h3>
              <p>
                Symbols, imports and relationship edges for the projects you index. It lives in your
                user data directory; it is never uploaded.
              </p>
            </div>
          </div>
          <p className="instr-note">
            Node.js &gt;= 18 is required for npm installs. The installers do not modify shell profiles
            silently: they print the line to add, and each failure names the exact URL or command
            that was tried.
          </p>
        </section>

        <section id="pin" className="instr-section">
          <h2 className="instr-section-title">Pin or upgrade.</h2>
          <p className="instr-section-lead">
            npm installs an exact version when you ask for one; re-run the install to move to a newer
            release. Upgrading keeps your data: the schema migrates in place and the index is never
            wiped.
          </p>
          <div className="instr-grid">
            <div className="instr-surface">
              <p className="instr-surface-label">npm</p>
              <pre className="instr-pre">{`# latest
npm install -g backbencher-brain@latest

# pin this release
npm install -g backbencher-brain@${TRUTH.version}`}</pre>
            </div>
            <div className="instr-surface">
              <p className="instr-surface-label">Shell / PowerShell</p>
              <pre className="instr-pre">{`# pin this release
VERSION=${TRUTH.version} \\
  curl -fsSL https://backbencher.cc/install.sh | bash

# Windows
$env:VERSION="${TRUTH.version}"
irm https://backbencher.cc/install.ps1 | iex`}</pre>
            </div>
          </div>
        </section>

        <section id="next" className="instr-section">
          <h2 className="instr-section-title">Next.</h2>
          <p className="instr-section-lead">
            The install is the smallest step. These are the four pages that make the index useful.
          </p>
          <div className="instr-next-grid">
            <Link className="instr-next" href="/docs#first-index">
              <strong>Index your first project →</strong>
              <span>What bb reads, what it skips, and what the first index proves.</span>
            </Link>
            <Link className="instr-next" href="/docs#mcp">
              <strong>Connect an MCP client →</strong>
              <span>Point Claude Code, Cursor, VS Code or another host at the local server.</span>
            </Link>
            <Link className="instr-next" href="/docs#embeddings">
              <strong>Turn on semantic search →</strong>
              <span>Optional embeddings with a provider you configure, or the local word vectors.</span>
            </Link>
            <Link className="instr-next" href="/editors">
              <strong>Use it in your editor →</strong>
              <span>Hover with evidence tiers, definition, references and impact in bb_lsp.</span>
            </Link>
          </div>
        </section>
      </div>
    </InstrumentShell>
  )
}
