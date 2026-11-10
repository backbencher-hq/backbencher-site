import { redirect } from "next/navigation"
import { REDIRECTS } from "@/lib/redirects"

// /faq — the FAQ lives on /support. This path is permanently redirected; the old URL stays
// valid for bookmarks and search-engine results.
export default function FaqPage(): never {
  redirect(REDIRECTS["/faq"])
}
