'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { GlitchOverlay } from '@/components/transitions/GlitchOverlay'
import { TrapEffect } from '@/components/transitions/TrapEffect'

export function DarkPageShell({ children }: { children: React.ReactNode }) {
  const { isDark, isTrapActive } = useDarkMode()

  return (
    <main
      className="min-h-screen"
      style={{
        background: isDark ? '#07080a' : 'var(--color-cream)',
        color: isDark ? '#d0d0c0' : 'var(--color-espresso)',
        transition: 'background 0.15s, color 0.15s',
        animation: isTrapActive ? 'dark-shake 0.45s ease-in-out' : 'none',
      }}
    >
      {/* Scanlines — always on in dark mode */}
      {isDark && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.045) 3px, rgba(0,0,0,0.045) 4px)',
          }}
        />
      )}
      {/* Vignette */}
      {isDark && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      )}

      <GlitchOverlay />
      <TrapEffect />
      {children}
    </main>
  )
}
