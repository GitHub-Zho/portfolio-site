'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { VENTURES } from '@/lib/content'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

export function Ventures() {
  const { isDark } = useDarkMode()

  function saveScroll() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('homeScrollY', String(window.scrollY))
    }
  }

  return (
    <section className="px-6 sm:px-12 py-20">
      <p
        className="text-xs tracking-[0.2em] uppercase mb-10"
        style={{
          color: isDark ? RL.brass : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-serif, serif)' : undefined,
          letterSpacing: isDark ? '0.3em' : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '产出 · 残留物' : '我在做的事'}
      </p>
      <div className="flex flex-wrap gap-3">
        {VENTURES.map((v, i) => (
          <motion.div
            key={v.key}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={v.href}
              onClick={saveScroll}
              className={`block px-6 py-4 rounded-full shadow-sm transition-colors ${
                isDark ? '' : 'bg-white/70 hover:bg-white'
              }`}
              style={{
                background: isDark ? RL.surface : undefined,
                border: isDark ? `1px solid ${RL.lineDim}` : '1px solid transparent',
              }}
            >
              <span
                className="font-serif font-medium"
                style={{
                  fontSize: isDark ? '0.9rem' : undefined,
                  color: isDark ? RL.bone : undefined,
                }}
              >
                {isDark ? (v.darkTitle ?? v.title) : v.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
