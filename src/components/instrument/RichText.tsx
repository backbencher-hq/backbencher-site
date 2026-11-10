import type { ReactNode } from "react"

// Generated prose (FAQ answers, tool contracts, docs summaries, editor claims)
// is written with two lightweight marks: **bold** and `code`. They are
// presentation, not content — rendering them as literal asterisks and
// backticks looks like a paste accident. This renderer turns the marks into
// type. `stripRichMarks` is the same transformation as text, for the truth
// gates: a gate may compare a claim modulo presentation, never a different
// claim.
const MARKS = /(\*\*[^*]+\*\*|`[^`]+`)/g

// Some generated prose quotes the internal file that recorded a measurement.
// That path belongs in the product repository, never in a reader-facing page:
// it is noise at best and a dangling reference at worst once the public tree
// stops carrying raw evidence. Rewrite those references to what they mean.
const INTERNAL_REFERENCES: Array<[RegExp, string]> = [
  [/\bvalidation\/[A-Za-z0-9._/-]+/g, "the recorded evidence"],
  [/\bdocs\/m\d+\/[A-Za-z0-9._/-]+/g, "the product documentation"],
  [/\b(?:script|scripts)\/m\d+\/[A-Za-z0-9._/-]+/g, "the verification scripts"],
  [/\/home\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._ -]+)*/g, "$HOME"],
]

export function publicText(text: string): string {
  return INTERNAL_REFERENCES.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text)
}

export function stripRichMarks(text: string): string {
  return publicText(text).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1")
}

export function RichText({ text }: { text: string }) {
  const source = publicText(text)
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = MARKS.exec(source))) {
    if (match.index > last) out.push(source.slice(last, match.index))
    const token = match[1]!
    const inner = token.slice(token.startsWith("**") ? 2 : 1, token.startsWith("**") ? -2 : -1)
    out.push(token.startsWith("**") ? <strong key={key++}>{inner}</strong> : <code key={key++}>{inner}</code>)
    last = match.index + token.length
  }
  if (last < source.length) out.push(source.slice(last))
  return <>{out}</>
}
