'use client'

import { useDarkMode } from '@/context/DarkModeContext'
import { HiddenDoor } from '@/components/dark/HiddenDoor'
import { NameLake } from '@/components/dark/NameLake'
import { RL } from '@/lib/rustyLake'

export function ClosingInvite() {
  const { isDark } = useDarkMode()

  return (
    <section className="relative px-6 sm:px-12 pt-24 pb-40 text-center">
      <p
        className="font-serif italic max-w-lg mx-auto leading-snug relative z-10"
        style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.875rem)',
          color: isDark ? RL.bone : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '没有人真的离开过。' : '如果你也喜欢这样的生活，欢迎常来看看。'}
      </p>

      {/* 世界的边界 */}
      <p
        className="relative z-10 font-serif"
        style={{
          marginTop: '4.5rem',
          fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
          letterSpacing: '0.14em',
          color: isDark ? RL.faint : 'color-mix(in srgb, var(--color-espresso) 34%, transparent)',
          transition: 'color 0.6s',
          userSelect: 'none',
        }}
      >
        {isDark ? '—— 边界之外，还是这里。' : '—— 这个世界，到此为止。'}
      </p>

      {/* 签名句：两个世界共用同一句话（它就是仪式的答案） */}
      <p
        className="relative z-10 font-serif"
        style={{
          marginTop: '1.1rem',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
          letterSpacing: '0.08em',
          fontStyle: isDark ? 'normal' : 'italic',
          color: isDark ? RL.boneDim : 'color-mix(in srgb, var(--color-espresso) 52%, transparent)',
          transition: 'color 0.6s',
        }}
      >
        是我，亦非我，皆是我。
      </p>

      <HiddenDoor />
      <NameLake />
    </section>
  )
}
