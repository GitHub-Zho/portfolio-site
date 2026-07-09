'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RESUME } from '@/lib/resumeContent'

type Job = typeof RESUME.experience[number]

export function ExperienceReveal({ experience }: { experience: Job[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = experience[activeIdx]

  return (
    <div>
      {/* Company tabs */}
      <div role="tablist" className="flex flex-wrap gap-2 mb-6">
        {experience.map((job, i) => {
          const isActive = i === activeIdx
          return (
            <button
              key={job.company}
              role="tab"
              aria-selected={isActive}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => setActiveIdx(i)}
              className="text-left px-4 py-2.5 rounded-lg border transition-colors duration-200"
              style={{
                borderColor: isActive ? 'var(--color-terracotta)' : 'var(--color-border)',
                background: isActive
                  ? 'color-mix(in srgb, var(--color-terracotta) 6%, transparent)'
                  : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span
                className="block text-sm font-medium transition-colors duration-150"
                style={{ color: isActive ? 'var(--color-terracotta)' : 'var(--color-espresso)' }}
              >
                {job.short}
              </span>
              <span
                className="block transition-colors duration-150"
                style={{
                  fontSize: 'clamp(0.65rem, 1.2vw, 0.7rem)',
                  color: isActive ? 'var(--color-terracotta)' : 'var(--color-espresso-dim)',
                  opacity: isActive ? 0.8 : 1,
                  marginTop: '1px',
                }}
              >
                {job.period}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detail content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-baseline flex-wrap gap-1 mb-2">
            <h3 className="font-serif text-lg font-medium">{active.role}</h3>
            <span className="text-xs text-espresso-dim shrink-0">{active.period}</span>
          </div>
          <p className="text-sm text-espresso-dim mb-2">{active.company}</p>
          <ul className="space-y-1 text-sm text-espresso-dim list-disc pl-4">
            {active.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
