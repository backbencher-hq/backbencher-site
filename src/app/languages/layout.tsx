import type { Metadata } from "next"
import { TRUTH } from "@/data/truth.generated"
import { PARSERS, RELATIONSHIP_TYPES } from "@/data/brain-languages"

// /languages is a plain server-rendered route; its metadata lives here so the
// counts come from generated truth rather than typed numbers. The page is named
// "Languages & analyzers" because it is as much about what reads each grammar as
// about the grammar list.

export const metadata: Metadata = {
  // The leading literal "Languages & analyzers" is the page's public name; the
  // count moved into the description so the <title> fits a search result.
  title: `Languages & analyzers — ${PARSERS.length} languages`,
  description: `An index of the ${PARSERS.length} language families bb reads — each analyzer's recorded symbols, its ${RELATIONSHIP_TYPES.length} relationship types, and where it stops.`,
  alternates: { canonical: "/languages" },
}

export default function LanguagesLayout({ children }: { children: React.ReactNode }) {
  return children
}
