import type { ReactNode } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import "./legal.css"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How backbencher.cc and the Backbencher software handle data: cookieless analytics, a local-first index, and what leaves your machine with embedding providers.",
  alternates: { canonical: "/privacy" },
}

// Only claims that are true today. The effective date is pinned rather than
// auto-rolling, so the page stays reviewable; bump it in the same commit as any
// content change.
const EFFECTIVE = "September 7, 2026"
const EFFECTIVE_ISO = "2026-09-07"

// Hand-authored copy — kept verbatim from the paper version. Only the
// presentation moved to the instrument system; an anchor is added per section
// so a specific claim can be linked directly.
const SECTIONS: { id: string; h: string; body: ReactNode }[] = [
  {
    id: "short-version",
    h: "Short version",
    body: (
      <ul>
        <li>
          The website uses a cookieless, privacy-friendly analytics counter (GoatCounter) — no
          accounts, no cookies, no personal identifiers collected by us.
        </li>
        <li>
          The bb software is local-first: indexing, storage, and analysis happen on your machine.
          There is no Backbencher cloud.
        </li>
        <li>
          The only optional network calls are embedding-provider requests you configure yourself
          with your own API key.
        </li>
        <li>
          Your embedding keys are stored in your config with owner-only permissions and are
          displayed as fingerprints only.
        </li>
      </ul>
    ),
  },
  {
    id: "who-is-behind-this",
    h: "Who is behind this",
    body: (
      <p>
        Backbencher (also called <strong>bb</strong>) and backbencher.cc are developed by Muhammad
        Ishaq Khan (ishaq2321). Questions about this policy go to{" "}
        <a href="mailto:info@backbencher.cc">info@backbencher.cc</a>.
      </p>
    ),
  },
  {
    id: "the-website",
    h: "The website (backbencher.cc)",
    body: (
      <>
        <p>
          The site runs GoatCounter (account <code>bbstats</code>) for page-view counts. GoatCounter
          is cookieless: it does not set tracking cookies and we collect no names, email addresses,
          or account data on the site. The counter receives standard request information (page path
          and title, referrer, browser/user-agent, approximate country) so we can see which pages
          people actually read.
        </p>
        <p>
          You can opt out at any time at{" "}
          <a href="https://www.goatcounter.com/optout">goatcounter.com/optout</a>, or block the
          counter script — the site works fully without it.
        </p>
      </>
    ),
  },
  {
    id: "the-software",
    h: "The bb software — what stays on your machine",
    body: (
      <>
        <p>
          When you index a project, the parsed symbols, relationships, and derived data are written
          to a local, per-project database on your machine. The CLI configuration lives in{" "}
          <code>~/.bb/config.json</code> with owner-only permissions (0600). Embedding provider keys
          are stored there and are shown as fingerprints, not plaintext, by inspection commands like{" "}
          <code>bb setup show</code>.
        </p>
        <p>We do not operate any service that receives your index, your config, or your keys.</p>
      </>
    ),
  },
  {
    id: "what-leaves-your-machine",
    h: "What leaves your machine",
    body: (
      <>
        <p>Exactly two kinds of network activity exist, both under your control:</p>
        <ul>
          <li>
            <strong>Installer downloads</strong> — when you install or rerun the installer, it
            downloads the release binary from backbencher.cc (or the URL you point it at).
          </li>
          <li>
            <strong>Embedding provider requests</strong> — only if you enable high-quality semantic
            search by configuring a provider key with <code>bb setup</code>. The content being
            embedded is sent to that provider in small vector requests under that provider’s own
            terms, not to us. If you do not configure a key, semantic search falls back to weaker
            local vectors and nothing is sent.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "email",
    h: "Email",
    body: (
      <p>
        Messages you send to <a href="mailto:support@backbencher.cc">support@backbencher.cc</a> or{" "}
        <a href="mailto:info@backbencher.cc">info@backbencher.cc</a> are used only to respond to you
        and to improve the product. We do not sell or share them.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    h: "Changes to this policy",
    body: (
      <p>
        If this policy changes, the effective date above is updated in the same change. Significant
        changes are called out here rather than buried.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <InstrumentShell>
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Legal · Privacy</p>
          <h1 className="instr-title">Privacy Policy</h1>
          <p className="instr-page-lead">
            This covers backbencher.cc and the Backbencher software (bb). It is short on purpose — if
            a claim here is not true, that is a bug worth reporting.
          </p>
          <p className="legal-effective">
            <span className="legal-effective-label">Effective</span>
            <time dateTime={EFFECTIVE_ISO}>{EFFECTIVE}</time>
          </p>
        </div>

        <div className="reading legal-body">
          <nav aria-label="On this page" className="legal-toc">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.h}
              </a>
            ))}
          </nav>
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="legal-section">
              <h2>{section.h}</h2>
              {section.body}
            </section>
          ))}
        </div>

        <footer className="legal-foot">
          <p>
            Also read the <Link href="/terms">Terms of Service</Link>.
          </p>
          <p>
            Product questions live on the <Link href="/support">Support &amp; FAQ</Link> page.
          </p>
        </footer>
      </div>
    </InstrumentShell>
  )
}
