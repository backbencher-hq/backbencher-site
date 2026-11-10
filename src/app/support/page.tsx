import Link from "next/link"
import type { Metadata } from "next"
import { FAQ_SECTIONS, SUPPORT_QA, SUPPORT_CHANNELS } from "@/data/support.generated"
import type { SupportQA } from "@/data/support.generated"
import { SupportJsonLd } from "@/components/SupportJsonLd"
import { InstrumentShell } from "@/components/instrument/InstrumentShell"
import { RichText } from "@/components/instrument/RichText"
import "./support.css"

// /support — the single support surface: the FAQ, then the still-have-questions
// block. /faq and /contact redirect here. The FAQPage structured data is derived
// from the same array this page renders, so search engines are never told
// anything a reader cannot see. Generated answers are rendered as-is: rewriting
// one here would make the page and its structured data disagree.

export const metadata: Metadata = {
  title: "Support & FAQ",
  description:
    "Answers to common questions about Backbencher — indexing, freshness, embeddings, MCP clients, your data — and how to reach a human when the answer is not here.",
  alternates: { canonical: "/support" },
}

// Section anchors are part of the published URL contract: a deep link into an
// answer has to survive a copy or layout change. A section without a hand-set
// anchor falls back to a slug of its own name, and the uniquifier keeps two
// sections from ever sharing an id.
const SECTION_ANCHORS: Record<string, string> = {
  "The product": "the-product",
  Indexing: "indexing",
  "Re-indexing after changes": "keeping-it-fresh",
  "Updates, uninstalling, and your data": "your-data",
  "MCP / agent integration": "mcp-agent",
}

type FaqItem = { q: string; a: string; num: string; anchor: string }
type FaqSection = { name: string; anchor: string; items: FaqItem[] }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const SECTIONS: FaqSection[] = (() => {
  const used = new Set<string>()
  const unique = (candidate: string, fallback: string): string => {
    const root = candidate || fallback
    let id = root
    let n = 2
    while (used.has(id)) id = `${root}-${n++}`
    used.add(id)
    return id
  }

  const buckets: { name: string; anchor: string; items: SupportQA[] }[] = FAQ_SECTIONS.map(({ name }) => ({
    name,
    anchor: unique(SECTION_ANCHORS[name] ?? slugify(name), "faq"),
    items: [],
  }))

  // A question that was generated under a heading the section list no longer
  // carries would otherwise render nowhere while still appearing in the
  // FAQPage data. It gets a real section instead of vanishing.
  for (const item of SUPPORT_QA) {
    let bucket = buckets.find((candidate) => candidate.name === item.section)
    if (!bucket) {
      bucket = { name: item.section, anchor: unique(slugify(item.section), "faq"), items: [] }
      buckets.push(bucket)
    }
    bucket.items.push(item)
  }

  let n = 0
  return buckets.map((bucket) => ({
    name: bucket.name,
    anchor: bucket.anchor,
    items: bucket.items.map((item) => {
      n += 1
      return {
        q: item.q,
        a: item.a,
        num: String(n).padStart(2, "0"),
        anchor: unique(`q-${slugify(item.q) || "question"}`, "q-question"),
      }
    }),
  }))
})()

const QUESTION_COUNT = SECTIONS.reduce((total, section) => total + section.items.length, 0)

function Channel({ title, body, email }: { title: string; body: string; email: string }) {
  return (
    <div className="instr-surface">
      <h3>{title}</h3>
      <p>{body}</p>
      <a className="support-mail" href={`mailto:${email}`}>
        {email}
      </a>
    </div>
  )
}

export default function SupportPage() {
  return (
    <InstrumentShell active="/support">
      <SupportJsonLd />
      <div className="instr-wrap instr-page">
        <div className="instr-page-head">
          <p className="instr-eyebrow">Support · FAQ</p>
          <h1 className="instr-title">
            Answers first. Then a <em>person.</em>
          </h1>
          <p className="instr-page-lead">
            Straight answers first — including the ones that are easier to dodge — then the people
            behind them.
          </p>
          <p className="instr-page-meta">
            {QUESTION_COUNT} questions · {SECTIONS.length} sections · generated from the product FAQ
          </p>
        </div>

        <nav aria-label="FAQ sections" className="support-index">
          {SECTIONS.map((section, index) => (
            <a
              key={section.anchor}
              href={`#${section.anchor}`}
              aria-label={`${section.name} — ${section.items.length} ${
                section.items.length === 1 ? "question" : "questions"
              }`}
            >
              <span className="support-index-n" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.name}</span>
              <span className="support-index-count" aria-hidden>
                {section.items.length}
              </span>
            </a>
          ))}
        </nav>

        {SECTIONS.map((section) => (
          <section key={section.anchor} id={section.anchor} className="instr-section support-section">
            <h2 className="instr-section-title">{section.name}</h2>
            <div className="support-faq">
              {section.items.map((item) => (
                <details key={item.q} id={item.anchor} className="support-item">
                  <summary>
                    <span className="support-num" aria-hidden>
                      {item.num}
                    </span>
                    <span className="support-q">
                      <RichText text={item.q} />
                    </span>
                    <span className="support-marker" aria-hidden />
                  </summary>
                  <div className="support-a">
                    <p>
                      <RichText text={item.a} />
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section id="still-have-questions" className="instr-section">
          <h2 className="instr-section-title">Still have questions?</h2>
          <p className="instr-section-lead">
            The answer you need is not above? Write to a human — both inboxes are read by the people
            building Backbencher.
          </p>
          <div className="instr-grid support-channels">
            {SUPPORT_CHANNELS.map((channel) => (
              <Channel key={channel.title} title={channel.title} body={channel.body} email={channel.email} />
            ))}
          </div>
          <div className="instr-next-grid support-next">
            <Link className="instr-next" href="/install">
              <strong>Install Backbencher →</strong>
              <span>One npm package, on your machine, with no account to make.</span>
            </Link>
            <Link className="instr-next" href="/docs">
              <strong>Read the docs →</strong>
              <span>The index, the MCP server, the CLI reference and the guarded edits.</span>
            </Link>
            <Link className="instr-next" href="/privacy">
              <strong>Privacy Policy →</strong>
              <span>Exactly what stays on your machine and what leaves it.</span>
            </Link>
            <Link className="instr-next" href="/terms">
              <strong>Terms of Service →</strong>
              <span>The MIT license, the no-warranty terms, and the rest in plain language.</span>
            </Link>
          </div>
          <p className="support-elsewhere">
            Elsewhere:{" "}
            <a href="https://github.com/backbencher-hq/backbencher-brain">GitHub</a>
          </p>
        </section>

        <div className="detail-source support-source">
          <p>
            Every answer above comes from one source: the same data the page&rsquo;s FAQPage
            structured data is built from, so a search result can never say more than this page. The
            counts in the answers were checked against the engine registry when they were generated.
          </p>
        </div>
      </div>
    </InstrumentShell>
  )
}
