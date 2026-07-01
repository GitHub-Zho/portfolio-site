'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type DarkModeState = 'light' | 'entering' | 'dark'

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
  const [mode, setMode] = useState<DarkModeState>('light')
  const [isTrapActive, setIsTrapActive] = useState(false)

  const startEntry = useCallback(() => setMode('entering'), [])
  const activateDark = useCallback(() => setMode('dark'), [])

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
