'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { VENTURES } from '@/lib/content'
import { useDarkMode } from '@/context/DarkModeContext'

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
          color: isDark ? '#3a3a30' : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-mono)' : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '[ 产出 / 残留物 ]' : '我在做的事'}
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
                background: isDark ? '#0e0f12' : undefined,
                border: isDark ? '1px solid #1e1e22' : '1px solid transparent',
              }}
            >
              <span
                className={isDark ? '' : 'font-serif font-medium'}
                style={{
                  fontFamily: isDark ? 'var(--font-mono)' : undefined,
                  fontSize: isDark ? '13px' : undefined,
                  color: isDark ? '#d0d0c0' : undefined,
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
