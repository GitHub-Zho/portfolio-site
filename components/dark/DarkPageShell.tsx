'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { GlitchOverlay } from '@/components/transitions/GlitchOverlay'
import { TrapEffect } from '@/components/transitions/TrapEffect'
import { WorldEdgeToast } from '@/components/ui/WorldEdgeToast'
import { RL } from '@/lib/rustyLake'

export function DarkPageShell({ children }: { children: React.ReactNode }) {
  const { isDark, isTrapActive } = useDarkMode()

  return (
    <main
      className="min-h-screen"
      style={{
        background: isDark ? RL.bg : 'var(--color-cream)',
        color: isDark ? RL.bone : 'var(--color-espresso)',
        transition: 'background 0.15s, color 0.15s',
        animation: isTrapActive ? 'dark-shake 0.45s ease-in-out' : 'none',
      }}
    >
      {/* 胶片颗粒感（锈湖调：比扫描线更柔） */}
      {isDark && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.028) 4px, rgba(0,0,0,0.028) 6px)',
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
      <WorldEdgeToast />
      {children}
    </main>
  )
}
