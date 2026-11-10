import Link from "next/link"
import { BRAIN_TOOLS, GROUP_META, GROUP_ORDER, toolsInGroup } from "@/data/brain-tools"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import { OpenHashTarget } from "@/components/instrument/OpenHashTarget"
import { Prose } from "@/components/tools/Prose"
import { ToolCard } from "@/components/tools/ToolCard"
import "./tools.css"

// /tools — the agent tool reference.
//
// The page is a register, not a pitch. It does not argue for the product and it
// shares no sentence with the homepage: the homepage orients, this page is where
// a reader who has picked a tool finds out what it commits to and what it
// refuses.
//
// It reads in two passes:
//
//   · The register — every tool under the family it is filed in, each row a jump
//     link to that tool's contract. The family grouping and the one-line
//     summaries are the only navigation copy; nothing here rates a tool.
//   · The contracts — one card per tool, carrying the registry's whole record.
//     The card is collapsed to a name, a summary and three flags, so sixteen of
//     them are still one screen of scanning; opening one reveals the generated
//     contract. The disclosures are native <details>, so selection needs no
//     client JavaScript and works from the keyboard.
//
// Deep links: every tool's card carries its name as an anchor id, so
// /tools#bb_impact is a real URL and lands on that tool. The register links to
// the same ids. Both survive without JavaScript; nothing about the page depends
// on a fragment being present.
//
// Every fact rendered below comes from src/data/brain-tools and its generated
// source src/data/tools.generated.ts. The page hand-types no tool fact: counts
// in the page head are derived from BRAIN_TOOLS at render time.

const TOOL_COUNT = BRAIN_TOOLS.length
const READ_ONLY = BRAIN_TOOLS.filter((tool) => tool.mutability === "read").length
const WRITE_CAPABLE = TOOL_COUNT - READ_ONLY
const PARAMETERS = BRAIN_TOOLS.reduce((total, tool) => total + tool.parameters.length, 0)
const LIMITS = BRAIN_TOOLS.reduce(
  (total, tool) =>
    total + tool.limitations.filter((item) => typeof item === "string" && item.trim().length > 0).length,
  0,
)
const GROUPS = GROUP_ORDER.map((group) => ({
  group,
  blurb: GROUP_META[group].blurb,
  tools: toolsInGroup(group),
})).filter((entry) => entry.tools.length > 0)

export default function ToolsPage() {
  return (
    <InstrumentShell active="/tools">
      <OpenHashTarget />
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Tools · {TOOL_COUNT} MCP tools</p>
          <h1 className="instr-title">
            Every tool, and what it <em>refuses.</em>
          </h1>
          <p className="instr-page-lead">
            Every entry is the tool’s own registry record, rendered as stored: what it
            returns, the bounds it declares, and the limits its reference records — including
            the measurements that caught it answering wrongly. Entries marked write-capable can
            change your source, your index, or the notes stored in it; every other entry only reads.
            Nothing here is written to make a tool look capable.
          </p>
          <p className="instr-page-meta">
            {TOOL_COUNT} tools · {READ_ONLY} read-only · {WRITE_CAPABLE} write-capable · {PARAMETERS}{" "}
            declared parameters · {LIMITS} declared limits
          </p>
        </div>

        <section id="register" className="instr-section">
          <h2 className="instr-section-title">The register.</h2>
          <p className="instr-section-lead">
            Every tool the local server exposes, under the family it is filed in. Each row is a
            jump link to that tool’s contract further down this page, and every tool name is
            a stable address: <code>/tools#bb_impact</code> is a real URL, so a reference to a tool
            can be sent rather than described.
          </p>
          <nav aria-label="All tools" className="tools-register">
            {GROUPS.map(({ group, blurb, tools }) => (
              <div className="tools-register-group" key={group}>
                <p className="tools-register-label">
                  {group}
                  <span className="n">{tools.length}</span>
                </p>
                <p className="tools-register-blurb">{blurb}</p>
                <ul className="tools-register-list">
                  {tools.map((tool) => (
                    <li key={tool.name}>
                      <a className="tools-register-row" href={`#${tool.name}`}>
                        <span className="tools-register-name">{tool.name}</span>
                        <span className="tools-tag" data-tone={tool.mutability}>
                          {tool.mutability === "write" ? "Write-capable" : "Read-only"}
                        </span>
                        <span className="tools-register-purpose">
                          <Prose text={tool.summary} />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </section>

        <section id="contracts" className="instr-section">
          <h2 className="instr-section-title">The contracts.</h2>
          <p className="instr-section-lead">
            Open a tool to read its whole record: the description, the declared limits, the safety
            note, the parameters it accepts, an example call, and what comes back. The disclosures
            are native, so the page works from the keyboard and without JavaScript.
          </p>
          {GROUPS.map(({ group, tools }) => (
            <div className="tools-group" key={group}>
              <p className="tools-group-label">
                {group}
                <span className="n">{tools.length}</span>
              </p>
              <div className="tools-tool-list">
                {tools.map((tool) => (
                  <ToolCard key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="source" className="instr-section">
          <h2 className="instr-section-title">Where this record comes from.</h2>
          <p className="instr-section-lead">
            Every fact above is generated from the same tool manifest the MCP server and the CLI
            expose, and from the shipped reference pages. Where a tool behaves differently from what
            is written here, that is a bug worth reporting rather than a documentation nit. Wiring
            the server is one command: <code>bb mcp</code>.
          </p>
          <div className="instr-next-grid">
            <Link className="instr-next" href="/docs#agent-tools">
              <strong>Agent tools in the guide →</strong>
              <span>How a tool contract is meant to be read, and how to wire a client to the local server.</span>
            </Link>
            <Link className="instr-next" href="/install">
              <strong>Install bb →</strong>
              <span>One npm package puts the CLI, the index and the MCP server on your machine.</span>
            </Link>
            <Link className="instr-next" href="/languages">
              <strong>What the index covers →</strong>
              <span>Every language analyzer behind the facts these tools answer with.</span>
            </Link>
          </div>
        </section>
      </div>
    </InstrumentShell>
  )
}
