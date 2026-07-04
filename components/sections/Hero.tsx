'use client'

import { motion } from 'framer-motion'
import { ResumeSwipeHint } from '@/components/ui/ResumeSwipeHint'
import { useDarkMode } from '@/context/DarkModeContext'

export function Hero() {
  const { isDark } = useDarkMode()

  return (
    <section
      className={`px-6 sm:px-12 pt-10 pb-24 transition-colors duration-700 ${
        isDark ? 'bg-transparent' : ''
      }`}
    >
      <nav className="flex justify-between text-sm mb-20">
        <span
          className="font-medium"
          style={{
            fontFamily: isDark ? 'var(--font-mono)' : undefined,
            color: isDark ? '#d0d0c0' : undefined,
          }}
        >
          {isDark ? '███ Jo' : 'Mr. Jo'}
        </span>
        <span
          style={{
            color: isDark ? '#3a3a30' : undefined,
            fontFamily: isDark ? 'var(--font-mono)' : undefined,
            fontSize: isDark ? '11px' : undefined,
          }}
          className={isDark ? '' : 'text-espresso-dim'}
        >
          {isDark ? '[ 记录 / 存档 / ████ ]' : '关于 · 故事 · 在做的事'}
        </span>
      </nav>

      {isDark ? <DarkHeroContent /> : <LightHeroContent />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10"
      >
        <ResumeSwipeHint />
      </motion.div>
    </section>
  )
}

function LightHeroContent() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-serif italic text-lg text-terracotta mb-4"
      >
        嘿，我在这儿 —
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif font-medium leading-[1.15] max-w-2xl"
        style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4rem)' }}
      >
        这是我的记录。
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-6 max-w-md text-espresso-dim leading-relaxed"
      >
        世界很大，一辈子很长，走走停停，向着星辰大海。
      </motion.p>
    </>
  )
}

function DarkHeroContent() {
  return (
    <>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
          color: '#4a4a3a',
          letterSpacing: '0.08em',
          marginBottom: '1.25rem',
        }}
      >
        [ 系统注记 ]
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="glitch-title"
        data-text="也许，这才是真实的世界。"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)',
          fontWeight: 500,
          lineHeight: 1.25,
          color: '#d0d0c0',
          position: 'relative',
          maxWidth: '24ch',
        }}
      >
        也许，这才是真实的世界。
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
          color: '#3a3a30',
          lineHeight: 1.8,
          marginTop: '1.5rem',
          maxWidth: '44ch',
          animation: 'dark-breathe 4.5s ease-in-out infinite',
        }}
      >
        你已经进来了。
      </motion.p>
    </>
  )
}
