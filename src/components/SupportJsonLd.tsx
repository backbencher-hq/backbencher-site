import { SUPPORT_QA } from "@/data/support.generated"

// FAQPage structured data for /support — the expandable FAQ rich result in
// search. Derived from the same array the page renders (support.generated.ts),
// so search engines are never told an answer a reader cannot see.
export function SupportJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SUPPORT_QA.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
  // Escape `<` as \u003c: answers quote commands like `bb tool <name>`, and a
  // literal `<` inside a <script> element is how JSON-LD payloads corrupt.
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
