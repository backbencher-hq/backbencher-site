'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

// The command a visitor copies to start. Client-only so the settled frame is
// the server HTML: the button renders "copy", never a blank state, and a failed
// clipboard call leaves the command readable rather than swapping an error in.
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <span className="instr-cmd">
      <span className="prompt" aria-hidden>
        $
      </span>
      <code>{command}</code>
      <button
        type="button"
        className="instr-copy"
        aria-label={copied ? 'Copied' : `Copy command: ${command}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(command)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
          } catch {
            /* clipboard unavailable (permissions, http) — the command stays readable */
          }
        }}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </span>
  )
}
