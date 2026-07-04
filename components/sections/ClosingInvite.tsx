'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { HiddenDoor } from '@/components/dark/HiddenDoor'

export function ClosingInvite() {
  const { isDark } = useDarkMode()

  return (
    <section className="relative px-6 sm:px-12 pt-24 pb-40 text-center">
      <p
        className="font-serif italic max-w-lg mx-auto leading-snug relative z-10"
        style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.875rem)',
          fontFamily: isDark ? 'var(--font-mono)' : undefined,
          fontStyle: isDark ? 'normal' : undefined,
          color: isDark ? '#d0d0c0' : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '没有人真的离开过。' : '如果你也喜欢这样的生活，欢迎常来看看。'}
      </p>

      {/* 世界的边界 */}
      <p
        className="relative z-10"
        style={{
          marginTop: '4.5rem',
          fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
          letterSpacing: '0.14em',
          fontFamily: isDark ? 'var(--font-mono)' : undefined,
          color: isDark ? '#3a3a30' : 'color-mix(in srgb, var(--color-espresso) 34%, transparent)',
          transition: 'color 0.6s',
          userSelect: 'none',
        }}
      >
        {isDark ? '—— 边界之外，还是这里。' : '—— 这个世界，到此为止。'}
      </p>

      {/* 签名句：两个世界共用同一句话（它就是谜题的答案） */}
      <p
        className="relative z-10"
        style={{
          marginTop: '1.1rem',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
          letterSpacing: '0.08em',
          fontFamily: isDark ? 'var(--font-mono)' : 'var(--font-serif, serif)',
          fontStyle: isDark ? 'normal' : 'italic',
          color: isDark ? '#4a4a3a' : 'color-mix(in srgb, var(--color-espresso) 52%, transparent)',
          transition: 'color 0.6s',
        }}
      >
        是我，亦非我，皆是我。
      </p>

      <HiddenDoor />
    </section>
  )
}
