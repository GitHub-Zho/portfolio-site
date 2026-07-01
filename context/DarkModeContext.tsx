'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type DarkModeState = 'light' | 'entering' | 'dark'

const STORAGE_KEY = 'portfolio-dark-mode'

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
  // Restore from localStorage on mount (skip glitch animation on return visits)
  const [mode, setMode] = useState<DarkModeState>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'dark') {
      return 'dark'
    }
    return 'light'
  })
  const [isTrapActive, setIsTrapActive] = useState(false)

  const startEntry = useCallback(() => setMode('entering'), [])
  const activateDark = useCallback(() => {
    setMode('dark')
    localStorage.setItem(STORAGE_KEY, 'dark')
  }, [])

  // Persist mode changes
  useEffect(() => {
    if (mode !== 'dark') localStorage.removeItem(STORAGE_KEY)
  }, [mode])

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
