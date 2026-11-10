import type { MetadataRoute } from "next"
import { RETIRED_ROUTES } from "@/lib/redirects"
import { FAMILY_SLUGS } from "@/data/language-depth/slugs"

// The real route list. It is kept in sync with the routes on disk: a page added
// without an entry here would be invisible to search, so this list is reviewed
// with any route change. `lastModified` is deliberately not emitted — a pinned
// date goes stale and a build-time `now` is fake freshness, so the honest choice
// is to omit the optional field until a content-date pipeline exists.
//
// Retired routes (lib/redirects.ts) are listed for route parity with the disk but
// filtered out of the sitemap: a sitemap lists canonical URLs only.
const ROUTES: { path: string; priority: number; changeFrequency: "monthly" | "weekly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/install", priority: 0.9, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/languages", priority: 0.8, changeFrequency: "monthly" },
  { path: "/editors", priority: 0.8, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  // Retired paths: kept for route parity with the disk, excluded from the sitemap.
  { path: "/demos", priority: 0.3, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.3, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.3, changeFrequency: "monthly" },
  { path: "/troubleshooting", priority: 0.3, changeFrequency: "monthly" },
  // Legal pages: indexable on purpose (a privacy policy nobody can find reads
  // as evasion), lowest priority — they are not discovery targets.
  { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
]

// The per-language detail pages. They are one route on disk (`[slug]`) that
// statically expands to one page per display family, so they cannot be listed
// as literals above without hand-maintaining 45 lines that would silently rot
// whenever a family is added to the dataset. The URL contract itself is declared
// once in data/language-depth/slugs.ts and is what the pages are generated from,
// so the sitemap and the route table cannot disagree about which languages have
// a page.
//
// These are indexable documents with real, unique content — a language page
// answers "what does bb record for my code" and is exactly the query someone
// arrives with — so they belong in the sitemap, below the surfaces a reader
// lands on deliberately.
const LANGUAGE_ROUTES: { path: string; priority: number; changeFrequency: "monthly" }[] =
  Object.values(FAMILY_SLUGS).map((slug) => ({
    path: `/languages/${slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
  }))

const BASE = "https://backbencher.cc"

export default function sitemap(): MetadataRoute.Sitemap {
  return [...ROUTES, ...LANGUAGE_ROUTES]
    .filter((r) => !(RETIRED_ROUTES as readonly string[]).includes(r.path))
    .map((r) => ({
      url: `${BASE}${r.path}`,
        changeFrequency: r.changeFrequency,
      priority: r.priority,
    }))
}
