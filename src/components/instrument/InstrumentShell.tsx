import type { ReactNode } from 'react'
import Link from 'next/link'

// The instrument shell every converted page renders: one nav, one footer, one
// surface. Pages own their content and pass `active` so the current route is
// announced (aria-current) instead of just coloured.
const NAV_LINKS = [
  { href: '/docs', label: 'Docs' },
  { href: '/tools', label: 'Tools' },
  { href: '/languages', label: 'Languages' },
  { href: '/editors', label: 'Editors' },
  { href: '/support', label: 'Support' },
]

export function InstrumentShell({ children, active }: { children: ReactNode; active?: string }) {
  return (
    <div className="instr">
      <header className="instr-nav">
        <div className="instr-wrap">
          <Link href="/" className="instr-brand">
            <span className="instr-mark" aria-hidden>
              bb
            </span>
            backbencher
          </Link>
          <nav aria-label="Primary" className="instr-nav-links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} aria-current={active === link.href ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="instr-nav-right">
            <a
              className="instr-gh"
              href="https://github.com/backbencher-hq/backbencher-brain"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <Link className="instr-btn-ghost" href="/install">
              Install bb
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="instr-foot">
        <div className="instr-wrap">
          <div className="instr-foot-brand">
            <span className="instr-mark" aria-hidden style={{ width: 20, height: 20, fontSize: 10 }}>
              bb
            </span>
            © 2026 Backbencher · MIT · local-first
          </div>
          <nav aria-label="Footer" className="instr-foot-links">
            <Link href="/docs">Docs</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/languages">Languages</Link>
            <Link href="/editors">Editors</Link>
            <Link href="/install">Install</Link>
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <span>·</span>
            <a href="https://github.com/backbencher-hq/backbencher-brain" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
