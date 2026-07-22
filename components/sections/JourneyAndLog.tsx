'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { JOURNEY_STEPS } from '@/lib/content'
import { journalEntries } from '@/data/journalEntries'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

/* ── Journal entry (inner scroll-snap item) ── */
function LogEntry({
  date, text, tier, containerRef,
}: {
  date: string; text: string; tier: number
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { isDark } = useDarkMode()
  const isActive = useInView(ref, { root: containerRef, margin: '-28% 0px -28% 0px' })
  const isHaunted = tier >= 4

  return (
    <div
      ref={ref}
      style={{
        height: '100%',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 0.25rem',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.2,
          scale: isActive ? 1 : 0.93,
          y: isActive ? 0 : 14,
          filter: isActive ? 'blur(0px)' : 'blur(1px)',
        }}
        transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.p
          animate={isDark && isActive && isHaunted ? { opacity: [0.6, 1, 0.7, 1] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: isDark ? 'var(--font-serif, serif)' : 'var(--font-sans)',
            fontStyle: isDark ? 'italic' : undefined,
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            color: isDark ? RL.brass : 'var(--color-terracotta)',
            letterSpacing: isDark ? '0.12em' : '0.04em',
            marginBottom: '0.6rem',
          }}
        >
          {date}
        </motion.p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            color: isDark ? (isHaunted ? 'rgba(214,205,178,0.92)' : RL.bone) : 'var(--color-espresso)',
            lineHeight: 1.7,
            maxWidth: '42ch',
            whiteSpace: 'pre-line',
          }}
        >
          {text}
        </p>
      </motion.div>
    </div>
  )
}

/* ── Combined section ── */
export function JourneyAndLog() {
  const { isDark } = useDarkMode()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="px-6 sm:px-12 py-20">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 320px) 1fr',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'start',
        }}
        className="journey-log-grid"
      >
        {/* ── LEFT: Journey ── */}
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-10"
            style={{
              color: isDark ? RL.brass : 'var(--color-espresso-dim)',
              fontFamily: isDark ? 'var(--font-serif, serif)' : undefined,
              letterSpacing: isDark ? '0.3em' : undefined,
              transition: 'color 0.6s',
            }}
          >
            {isDark ? '轨迹 · 回放' : '我的故事'}
          </p>
          <div className="space-y-8">
            {JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: isDark ? 'rgba(122, 46, 43, 0.8)' : step.color,
                    transition: 'background 0.6s',
                  }}
                />
                <h3
                  className="font-serif font-medium"
                  style={{
                    fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                    color: isDark ? RL.boneDim : undefined,
                    transition: 'color 0.6s',
                  }}
                >
                  {step.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Log / Journal Timeline ── */}
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: isDark ? '0.3em' : '0.2em',
              textTransform: 'uppercase',
              color: isDark ? RL.brass : 'var(--color-espresso-dim)',
              fontFamily: isDark ? 'var(--font-serif, serif)' : 'var(--font-sans)',
              marginBottom: '1.25rem',
              transition: 'color 0.6s',
            }}
          >
            {isDark ? '记录 · 存档' : '记录'}
          </p>

          {/* Scroll-snap container — height = 4 entries worth of reading */}
          <div
            ref={containerRef}
            style={{
              height: 'clamp(320px, 55vh, 520px)',
              overflowY: 'scroll',
              scrollSnapType: 'y mandatory',
              scrollbarWidth: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {[...journalEntries]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <LogEntry
                  key={entry.date}
                  date={entry.date}
                  text={isDark ? entry.dark : entry.light}
                  tier={entry.darkTier}
                  containerRef={containerRef as React.RefObject<HTMLDivElement>}
                />
              ))}
          </div>

          <style>{`
            .journey-log-grid > div:last-child div[style*="overflowY"]::-webkit-scrollbar { display: none; }
            @media (max-width: 500px) {
              .journey-log-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
