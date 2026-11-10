// The one declaration of every retired route and where it now lives.
//
// Three consumers read this file and nothing else declares a redirect:
//   · the stub pages (app/faq, app/contact, app/troubleshooting, app/demos),
//     which redirect to REDIRECTS[their own path];
//   · app/sitemap.ts, which excludes RETIRED_ROUTES (a sitemap lists canonical
//     URLs only) while still listing them for route parity with the disk;
//   · the rendered site, which links the canonical destination instead.
//
// A retired path is never deleted outright: the URL stays valid for bookmarks
// and search results pointing at it.
export const REDIRECTS = {
  // FAQ and contact became one surface: the support page.
  "/faq": "/support",
  "/contact": "/support",
  // Troubleshooting content moved into the docs page so there is one
  // source of truth for symptom-based fixes.
  "/troubleshooting": "/docs#troubleshooting",
  // /demos is retired: the two product films were withdrawn after review
  // (pacing and craft, not truth). The surviving machine-verified material
  // now lives on the editor page.
  "/demos": "/editors",
} as const

export type RetiredRoute = keyof typeof REDIRECTS

export const RETIRED_ROUTES = Object.keys(REDIRECTS) as RetiredRoute[]
