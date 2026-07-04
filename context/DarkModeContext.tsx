'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type DarkModeState = 'light' | 'entering' | 'dark'

// Module-level: survives client-side navigation (the JS bundle stays loaded),
// resets on browser refresh — refresh is the only way out of the dark world.
// Deliberately NOT localStorage: the dark world must stay a discovered state,
// and persisting it would trap visitors forever (refresh is the sole exit).
let persistedMode: DarkModeState = 'light'

interface DarkModeCtx {
  mode: DarkModeState
  isDark: boolean
  startEntry: () => void
  activateDark: () => void
  triggerTrap: () => void
  isTrapActive: boolean
}

const Ctx = createContext<DarkModeCtx | null>(null)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  // Only a completed 'dark' state carries across navigation; a mid-transition
  // 'entering' does not (the glitch sequence shouldn't resume half-played).
  const [mode, setMode] = useState<DarkModeState>(persistedMode === 'dark' ? 'dark' : 'light')
  const [isTrapActive, setIsTrapActive] = useState(false)

  const startEntry = useCallback(() => setMode('entering'), [])
  const activateDark = useCallback(() => {
    persistedMode = 'dark'
    setMode('dark')
  }, [])

  const triggerTrap = useCallback(() => {
    if (isTrapActive) return
    setIsTrapActive(true)
    setTimeout(() => setIsTrapActive(false), 1800)
  }, [isTrapActive])

  return (
    <Ctx.Provider value={{ mode, isDark: mode === 'dark', startEntry, activateDark, triggerTrap, isTrapActive }}>
      {children}
    </Ctx.Provider>
  )
}

export function useDarkMode() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDarkMode must be inside DarkModeProvider')
  return ctx
}
