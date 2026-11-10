import type { BrainTool } from "@/data/brain-tools"
import { cleanText, Prose } from "./Prose"

// One tool's whole record, as generated.
//
// The card stays small while the page is being scanned: the tool's name, the
// registry's own one-line summary, and the flags a reader needs before spending
// a call — whether it can change anything, whether it needs an index, and which
// registry family it belongs to. Everything else is one native disclosure away.
//
// The order inside the disclosure is the order of a decision:
//
//   1. what it does              — the registry description, whole
//   2. what it will not do       — the declared limitations, at full weight
//   3. safety behavior           — the blast radius, stated by the record
//   4. the call and what returns — modes, defaults, parameters, example, returns, errors
//   5. how fresh the answer is   — the record's own staleness sentence
//
// Every string below is read from BRAIN_TOOLS. This file types no tool prose and
// invents no fields: the `evidence`/`performance` measurement blocks and the
// internal reference path are deliberately not rendered — they cite repository
// artifacts a reader of this page cannot open.
//
// `Prose` handles the generating marks and rewrites internal paths, so a card
// cannot leak a repository location into a sentence.

function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}

// The generated lists are string arrays today, but the generator is allowed to
// emit a null for an entry the curation never wrote. Counting and rendering go
// through this predicate so a missing entry is skipped rather than crashing the
// page or being counted as a term the tool does not actually declare.
function present(item: string | null): item is string {
  return typeof item === "string" && item.trim().length > 0
}

function formatValue(value: unknown): string {
  if (value === null) return "null"
  if (typeof value === "object") return JSON.stringify(value) ?? String(value)
  return String(value)
}

function TermList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="tools-list">
      {items.map((item, index) => (
        <li key={index}>
          <Prose text={item} />
        </li>
      ))}
    </ul>
  )
}

export function ToolCard({ tool }: { tool: BrainTool }) {
  const limits = tool.limitations.filter(present)
  const returns = tool.returns.filter(present)
  const errors = tool.errors.filter(present)
  const defaults: Array<[string, unknown]> = Object.entries(tool.defaults ?? {})
  const mutability = tool.mutability === "write" ? "Write-capable" : "Read-only"
  const requiredCount = tool.parameters.filter((parameter) => parameter.required).length
  const examples = tool.examples

  return (
    <article id={tool.name} className="tools-tool">
      <header className="tools-tool-head">
        <h3 className="tools-tool-name">
          {tool.name}
          <a
            className="tools-anchor"
            href={`#${tool.name}`}
            aria-label={`Permalink to ${tool.name}`}
          >
            #
          </a>
        </h3>
        <p className="tools-tool-tags">
          <span className="tools-tag" data-tone={tool.mutability}>
            {mutability}
          </span>
          <span className="tools-tag">{tool.requiresIndex ? "Requires an index" : "No index required"}</span>
          <span className="tools-tag">{tool.category}</span>
        </p>
      </header>

      <p className="tools-tool-summary">
        <Prose text={tool.summary} />
      </p>

      <details className="tools-more">
        <summary className="tools-more-summary">
          <span className="tools-more-title">The contract</span>
          <span className="tools-more-counts">
            {plural(tool.parameters.length, "parameter")} · {plural(tool.modes.length, "mode")} ·{" "}
            {plural(limits.length, "declared limit")}
          </span>
        </summary>

        <div className="tools-contract">
          <h4 className="tools-h4">What it does</h4>
          <p className="tools-prose">
            <Prose text={tool.description} />
          </p>

          <h4 className="tools-h4">What it will not do</h4>
          {limits.length > 0 ? (
            <ul className="tools-limits">
              {limits.map((item, index) => (
                <li key={index}>
                  <Prose text={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="tools-empty">No limitation is declared for this tool in the generated record.</p>
          )}

          <h4 className="tools-h4">Safety behavior</h4>
          <p className="tools-prose">
            <Prose text={tool.safety} />
          </p>

          <h4 className="tools-h4">The shape of the call</h4>

          <div className="tools-call">
            <div className="tools-call-block">
              <p className="tools-kicker">{`Modes (${tool.modes.length})`}</p>
              {tool.modes.length === 0 ? (
                <p className="tools-empty">No modes are declared for this tool.</p>
              ) : (
                <ul className="tools-chips">
                  {tool.modes.map((mode) => (
                    <li key={mode}>
                      <code>{mode}</code>
                    </li>
                  ))}
                </ul>
              )}
              {tool.plannedModes.length > 0 ? (
                <p className="tools-note">
                  Planned, not executable today:{" "}
                  {tool.plannedModes.map((mode) => (
                    <code key={mode}>{mode}</code>
                  ))}
                </p>
              ) : null}
            </div>

            <div className="tools-call-block">
              <p className="tools-kicker">{`Runtime defaults (${defaults.length})`}</p>
              {defaults.length === 0 ? (
                <p className="tools-empty">No defaults are declared for this tool.</p>
              ) : (
                <dl className="tools-defaults">
                  {defaults.map(([key, value]) => (
                    <div className="tools-default" key={key}>
                      <dt>
                        <code>{key}</code>
                      </dt>
                      <dd>{formatValue(value)}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          <p className="tools-kicker">
            {`Parameters · ${tool.parameters.length}${requiredCount > 0 ? ` (${requiredCount} required)` : ""}`}
          </p>
          {tool.parameters.length === 0 ? (
            <p className="tools-empty">This tool takes no parameters.</p>
          ) : (
            <div
              className="tools-table-wrap"
              role="region"
              aria-label={`${tool.name} parameters`}
              tabIndex={0}
            >
              <table className="tools-table">
                <caption className="tools-sr">{`${tool.name} parameters`}</caption>
                <thead>
                  <tr>
                    <th scope="col">Parameter</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.parameters.map((parameter) => (
                    <tr key={parameter.name}>
                      <td>
                        <code className="tools-param-name">{parameter.name}</code>
                      </td>
                      <td>
                        <code className="tools-param-type">{parameter.type}</code>
                      </td>
                      <td>
                        <span className="tools-required" data-required={parameter.required}>
                          {parameter.required ? "Required" : "Optional"}
                        </span>
                      </td>
                      <td className="tools-param-description">
                        <Prose text={parameter.description} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="tools-kicker">{`Example input${examples.length > 1 ? ` (${examples.length})` : ""}`}</p>
          {examples.length === 0 ? (
            <p className="tools-empty">No example is declared for this tool.</p>
          ) : (
            <div className="tools-examples">
              {examples.map((example, index) => (
                <figure className="tools-example" key={index}>
                  <figcaption>
                    {examples.length === 1 ? "Example input" : `Example input ${index + 1} of ${examples.length}`}
                  </figcaption>
                  <pre className="tools-pre" tabIndex={0}>
                    <code>{cleanText(JSON.stringify(example, null, 2) ?? String(example))}</code>
                  </pre>
                </figure>
              ))}
            </div>
          )}

          <p className="tools-kicker">{`Returns (${returns.length})`}</p>
          {returns.length === 0 ? (
            <p className="tools-empty">No returns are declared for this tool.</p>
          ) : (
            <TermList items={returns} />
          )}

          <p className="tools-kicker">{`Errors (${errors.length})`}</p>
          {errors.length === 0 ? (
            <p className="tools-empty">No errors are declared for this tool.</p>
          ) : (
            <TermList items={errors} />
          )}

          <p className="tools-kicker">Relationship to other tools</p>
          <p className="tools-prose">
            <Prose text={tool.relations} />
          </p>

          <p className="tools-kicker">Index freshness</p>
          <p className="tools-prose">
            <Prose text={tool.staleness} />
          </p>
        </div>
      </details>
    </article>
  )
}
