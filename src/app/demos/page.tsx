import { redirect } from "next/navigation"
import { REDIRECTS } from "@/lib/redirects"

// /demos — retired. The two product films were withdrawn after review (pacing
// and craft, not truth); this path permanently redirects to the editor page,
// where the surviving machine-verified material lives.
export default function DemosPage(): never {
  redirect(REDIRECTS["/demos"])
}
