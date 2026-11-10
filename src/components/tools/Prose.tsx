import type { ReactNode } from "react"

// Generated registry prose is written with two lightweight marks — **bold** and
// `code` — and a few of its fields quote the repository file a measurement was
// taken from. Both are presentation accidents when they reach a reader: the
// marks would render as literal asterisks and backticks, and the paths belong to
// the product repository rather than to a page. So the marks become type and the
// paths become what they mean.
//
// This is deliberately not a Markdown parser: only these two marks are honoured,
// so no authored string can introduce markup, and the transformation is a pure
// function of the text it is given.
const MARKS = /(\*\*[^*]+\*\*|`[^`]+`)/g

const INTERNAL_REFERENCES: Array<[RegExp, string]> = [
  [/\bvalidation\/[A-Za-z0-9._/-]+/g, "the recorded evidence"],
  [/\bdocs\/m\d+\/[A-Za-z0-9._/-]+/g, "the product documentation"],
  [/\b(?:script|scripts)\/m\d+\/[A-Za-z0-9._/-]+/g, "the verification scripts"],
  [/\/home\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._ -]+)*/g, "$HOME"],
]

/** The same transformation as `Prose`, as text — for captions, table cells and code plates. */
export function cleanText(text: string): string {
  return INTERNAL_REFERENCES.reduce(
    (out, [pattern, replacement]) => out.replace(pattern, replacement),
    text,
  )
}

export function Prose({ text }: { text: string }): ReactNode {
  const source = cleanText(text)
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  let match: RegExpExecArray | null
  while ((match = MARKS.exec(source))) {
    if (match.index > last) out.push(source.slice(last, match.index))
    const token = match[1]!
    const bold = token.startsWith("**")
    const inner = token.slice(bold ? 2 : 1, bold ? -2 : -1)
    out.push(bold ? <strong key={key++}>{inner}</strong> : <code key={key++}>{inner}</code>)
    last = match.index + token.length
  }
  if (last < source.length) out.push(source.slice(last))
  return <>{out}</>
}
