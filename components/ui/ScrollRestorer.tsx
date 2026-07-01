'use client'

import { useEffect } from 'react'

export function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem('homeScrollY')
    if (saved) {
      window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' })
      sessionStorage.removeItem('homeScrollY')
    }
  }, [])

  return null
}
