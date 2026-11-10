'use client'

import { useEffect } from 'react'

// Native <details> cannot be opened by a URL fragment, so a deep link such as
// /tools#bb_search would land on a closed card. This tiny enhancement opens the
// target's disclosure and scrolls to it; without JavaScript the anchor still
// scrolls (HTML anchor behaviour) and the card header is visible.
export function OpenHashTarget() {
  useEffect(() => {
    const openTarget = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      const disclosure = target.querySelector('details')
      if (disclosure) disclosure.open = true
      target.scrollIntoView({ block: 'start' })
    }
    openTarget()
    window.addEventListener('hashchange', openTarget)
    return () => window.removeEventListener('hashchange', openTarget)
  }, [])
  return null
}
