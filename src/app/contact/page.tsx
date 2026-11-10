import { redirect } from "next/navigation"
import { REDIRECTS } from "@/lib/redirects"

// /contact — contact channels live on /support (FAQ first, then the
// still-have-questions block). The path is permanently redirected; the old URL
// stays valid for bookmarks and search-engine results.
export default function ContactPage(): never {
  redirect(REDIRECTS["/contact"])
}
