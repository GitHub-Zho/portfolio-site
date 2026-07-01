'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'
import { journalEntries } from '@/data/journalEntries'

function Entry({
  date,
  text,
  tier,
  containerRef,
}: {
  date: string
  text: string
  tier: number
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { isDark } = useDarkMode()
  const isActive = useInView(ref, {
    root: containerRef,
    margin: '-28% 0px -28% 0px',
  })

  const isHauntedTier = tier >= 4

  return (
    <div
      ref={ref}
      className="journal-entry"
      style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        scrollSnapAlign: 'center',
      }}
    >
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.18,
          scale: isActive ? 1 : 0.91,
          y: isActive ? 0 : 22,
          filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
        }}
        transition={{ duration: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.p
          animate={isDark && isActive && isHauntedTier ? {
            opacity: [0.6, 1, 0.7, 1],
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: isDark ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)',
            color: isDark ? '#6b1c2b' : 'var(--color-terracotta)',
            letterSpacing: isDark ? '0.1em' : '0.04em',
            marginBottom: '0.875rem',
            textTransform: isDark ? 'none' : undefined,
          }}
        >
          {isDark ? `[ ${date} ]` : date}
        </motion.p>

        <p
          style={{
            fontFamily: isDark ? 'var(--font-mono)' : 'var(--font-serif)',
            fontSize: 'clamp(1rem, 2.8vw, 1.35rem)',
            color: isDark
              ? isHauntedTier ? 'rgba(208, 208, 192, 0.9)' : '#d0d0c0'
              : 'var(--color-espresso)',
            lineHeight: isDark ? 1.85 : 1.65,
            maxWidth: '55ch',
            whiteSpace: 'pre-line',
          }}
        >
          {text}
        </p>
      </motion.div>
    </div>
  )
}

export function JournalTimeline() {
  const { isDark } = useDarkMode()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      style={{
        paddingTop: '5rem',
        paddingBottom: '2rem',
        transition: 'background 0.8s ease',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: isDark ? '#3a3a30' : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-mono)' : 'var(--font-sans)',
          marginBottom: '1.5rem',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '[ 记录 / 存档 ]' : '记录'}
      </p>

      <div
        ref={containerRef}
        style={{
          height: '60vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
        }}
      >
        {journalEntries.map((entry, i) => (
          <Entry
            key={i}
            date={entry.date}
            text={isDark ? entry.dark : entry.light}
            tier={entry.darkTier}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        ))}
      </div>

      <style>{`
        div[style*="overflowY: scroll"]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
