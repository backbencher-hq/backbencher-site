import type { Metadata } from "next"
import Link from "next/link"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"

// A branded dead end on the instrument surface: same nav, same tokens, and the
// six real destinations instead of a bare 404. Excluded from the sitemap and
// kept out of the index; crawlers may still follow the links.

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

const SURFACES: { href: string; label: string; note: string }[] = [
  { href: "/install", label: "Install", note: "The one command to get bb on your machine." },
  { href: "/docs", label: "Docs", note: "First index, how it works, the full CLI reference." },
  { href: "/tools", label: "Tools", note: "The agent tool contracts and what each refuses." },
  { href: "/languages", label: "Languages", note: "What indexing each language buys you." },
  { href: "/editors", label: "Editors", note: "bb_lsp in VS Code, Zed, Helix and JetBrains." },
  { href: "/support", label: "Support", note: "Answers to the questions people actually ask." },
]

export default function NotFound() {
  return (
    <InstrumentShell>
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">404 · page not found</p>
          <h1 className="instr-title">This address doesn’t exist.</h1>
          <p className="instr-page-lead">
            The page may have moved, or the link may be a typo. Nothing is lost — pick a surface
            below, or start from the homepage.
          </p>
          <div className="instr-close-row" style={{ marginTop: 24 }}>
            <Link className="instr-btn" href="/">
              Back to the homepage <span aria-hidden>→</span>
            </Link>
            <Link className="instr-btn-ghost" href="/install">
              Install bb
            </Link>
          </div>
        </div>
        <section className="instr-section">
          <h2 className="instr-section-title">Where you can go instead.</h2>
          <div className="instr-next-grid instr-next-grid-3">
            {SURFACES.map((surface) => (
              <Link className="instr-next" href={surface.href} key={surface.href}>
                <strong>{surface.label} →</strong>
                <span>{surface.note}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </InstrumentShell>
  )
}
