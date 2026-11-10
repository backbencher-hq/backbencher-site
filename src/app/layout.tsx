import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import "./instrument.css"
import { GoatCounter } from "@/components/GoatCounter"
import { TRUTH } from "@/data/truth.generated"

// Warm-dark editorial identity . All three families are self-hosted
// variable fonts (latin subset) — zero external font requests, no FOUT, and
// no dependence on Google's CDN at build or runtime.
const frauncesItalic = localFont({
  src: "../fonts/fraunces-i-latin.woff2",
  variable: "--font-fraunces-italic",
  weight: "100 900",
  style: "italic",
  display: "swap",
})

const hanken = localFont({
  src: "../fonts/hanken-latin.woff2",
  variable: "--font-hanken",
  weight: "100 900",
  display: "swap",
})

const jetbrainsMono = localFont({
  src: "../fonts/jbmono-latin.woff2",
  variable: "--font-jbmono",
  weight: "100 800",
  display: "swap",
})

// Site identity: one grotesque for
// display and body, one mono for code and data. Archivo is self-hosted (latin
// subset, zero external requests) because its tight, industrial caps carry the
// product's "engineered, not decorated" voice at display sizes.
const archivo = localFont({
  src: "../fonts/archivo-latin.woff2",
  variable: "--font-archivo",
  weight: "400 900",
  display: "swap",
})



const TOOL_COUNT = TRUTH.tools.length
const SITE_URL = "https://backbencher.cc"

const DESCRIPTION =
  "bb indexes your repository into a local graph of symbols, imports and call edges. 16 MCP tools answer from it — with the file, line and evidence behind every answer."

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  colorScheme: "dark",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Kept ≤ 60 characters so a search result shows the whole title; keywords
    // live in the description and the lead copy, not stuffed into the title.
    default: "Backbencher — code intelligence that shows its evidence",
    template: "%s | Backbencher",
  },
  description: DESCRIPTION,
  keywords: [
    "Backbencher",
    "bb",
    "local code index",
    "code search",
    "call graph",
    "code intelligence",
    "MCP",
    "tree-sitter",
    "AI coding",
    "developer tools",
  ],
  authors: [{ name: "Backbencher" }],
  // NOTE: no layout-level canonical — canonical must be declared per-page or a
  // page without one silently claims the homepage as canonical (duplicate
  // content). The S1 verifier mutant enforces exactly this failure mode.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Backbencher — local code intelligence that shows its evidence",
    description: `A local code index and ${TOOL_COUNT} MCP tools that answer from stored facts — with the file, line and evidence tier behind every answer.`,
    siteName: "Backbencher",
    images: [
      {
        url: "/social-share.png",
        width: 1200,
        height: 630,
        alt: "Backbencher — local code intelligence that shows its evidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backbencher — local code intelligence that shows its evidence",
    description: `A local code index and ${TOOL_COUNT} MCP tools that answer from stored facts — with the file, line and evidence tier behind every answer.`,
    images: ["/social-share.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${frauncesItalic.variable} ${hanken.variable} ${jetbrainsMono.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-[#0a0b0d] text-[#eae7e1] font-sans selection:bg-[#ff5b33]/40 selection:text-white"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {/* tabIndex so the skip link actually moves focus into the content; the
            nav is repeated above and on every page, which is exactly
            the "bypass blocks" case WCAG 2.4.1 names. */}
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
        <GoatCounter />
      </body>
    </html>
  )
}
