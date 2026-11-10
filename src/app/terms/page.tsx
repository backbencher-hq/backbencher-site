import type { ReactNode } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import "../privacy/legal.css"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that cover backbencher.cc and the Backbencher software: license, no warranty, acceptable use, and contact details.",
  alternates: { canonical: "/terms" },
}

// Hand-authored legal copy. The MIT position is deliberate: bb is free and open
// source, provided as-is, with no warranty of any kind.
const EFFECTIVE = "September 7, 2026"
const EFFECTIVE_ISO = "2026-09-07"

const SECTIONS: { id: string; h: string; body: ReactNode }[] = [
  {
    id: "what-these-terms-cover",
    h: "What these terms cover",
    body: (
      <p>
        These terms govern your use of the backbencher.cc website and the Backbencher software (
        <strong>bb</strong>), developed by Muhammad Ishaq Khan (ishaq2321). By using either, you
        accept these terms.
      </p>
    ),
  },
  {
    id: "the-website",
    h: "The website",
    body: (
      <p>
        The site describes the product and its documentation honestly — including what the software
        cannot do. Nothing on the site is a guarantee of specific results for your codebase.
      </p>
    ),
  },
  {
    id: "the-software-license",
    h: "The software license",
    body: (
      <>
        <p>
          bb is free and open-source software under the MIT license. You may use, copy, modify and
          distribute it, including for commercial purposes, provided the copyright notice and
          permission notice are kept. The full terms are in the LICENSE file of the{" "}
          <a href="https://github.com/backbencher-hq/backbencher-brain">product repository</a>.
        </p>
        <p>
          The software is provided as-is, without warranty of any kind. Nothing in these terms grants
          trademark rights or implies endorsement.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    h: "Third-party services (embedding providers)",
    body: (
      <p>
        High-quality semantic search is optional and uses an embedding provider you configure with
        your own API key. That provider is a separate service governed by its own terms; Backbencher
        is not affiliated with it. Any usage costs are yours.
      </p>
    ),
  },
  {
    id: "your-responsibility",
    h: "Your responsibility",
    body: (
      <p>
        You are responsible for the code you index and the choices you make with it — including what
        you send to an embedding provider and which providers you trust.
      </p>
    ),
  },
  {
    id: "no-warranty",
    h: "No warranty",
    body: (
      <p>
        bb and this website are provided “as is,” without warranty of any kind, express or implied —
        including fitness for a particular purpose. The engine indexes what it can parse and says so
        when it cannot; treat its output as evidence to verify, not as certainty.
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    h: "Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by law, the developer is not liable for damages arising from
        your use of bb or this website — including data loss from edits made through the software. Use
        the built-in dry-run previews before risky changes, and keep backups of anything important.
      </p>
    ),
  },
  {
    id: "changes-and-termination",
    h: "Changes and termination",
    body: (
      <p>
        These terms may be updated; the effective date above is changed in the same update. You may
        stop using bb at any time by uninstalling it and deleting its local index and configuration.
      </p>
    ),
  },
  {
    id: "contact",
    h: "Contact",
    body: (
      <p>
        Questions about these terms:{" "}
        <a href="mailto:info@backbencher.cc">info@backbencher.cc</a>. Help with the software:{" "}
        <a href="mailto:support@backbencher.cc">support@backbencher.cc</a>.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <InstrumentShell>
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Legal · Terms</p>
          <h1 className="instr-title">Terms of Service</h1>
          <p className="instr-page-lead">
            Plain-language terms for using backbencher.cc and Backbencher (bb).
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
            Also read the <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            Product questions live on the <Link href="/support">Support &amp; FAQ</Link> page.
          </p>
        </footer>
      </div>
    </InstrumentShell>
  )
}
