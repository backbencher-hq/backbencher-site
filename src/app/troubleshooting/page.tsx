import { redirect } from "next/navigation"
import { REDIRECTS } from "@/lib/redirects"

// /troubleshooting — symptom-based fixes live in the docs page (one source of
// truth). The path is permanently redirected; the old URL stays valid for
// bookmarks and search-engine results.
export default function TroubleshootingPage(): never {
  redirect(REDIRECTS["/troubleshooting"])
}
