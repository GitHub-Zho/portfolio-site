'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RESUME } from '@/lib/resumeContent'

type Project = typeof RESUME.projects[number]
type Lang = 'zh' | 'en'

interface Category {
  id: string
  label: string
  labelEn: string
  sublabel: string
  sublabelEn: string
  projectIds: string[]
}

const CATEGORIES: Category[] = [
  {
    id: 'agent',
    label: 'Agent / AI',
    labelEn: 'Agent / AI',
    sublabel: '多 Agent 系统 · 生成式 AI',
    sublabelEn: 'Multi-Agent · Generative AI',
    projectIds: ['china-video-bot', 'dreamina', 'event-genai'],
  },
  {
    id: 'cv',
    label: 'CV / 视觉',
    labelEn: 'CV / Vision',
    sublabel: '视频生成 · 联邦学习',
    sublabelEn: 'Video Gen · Federated Learning',
    projectIds: ['pose-video', 'federated'],
  },
  {
    id: 'backend',
    label: '后端 / 系统',
    labelEn: 'Backend / Systems',
    sublabel: '操作系统 · 网络 · Rust',
    sublabelEn: 'OS · Networking · Rust',
    projectIds: ['os-kernel', 'normandy', 'rust-ece1724'],
  },
  {
    id: 'web',
    label: 'Web / 数据',
    labelEn: 'Web / Data',
    sublabel: '产品官网 · 数据工具',
    sublabelEn: 'Product Sites · Data Tools',
    projectIds: ['explore-china', 'salary-apply'],
  },
]

export function ProjectCategories({ projects, lang = 'zh' }: { projects: Project[]; lang?: Lang }) {
  const [activeId, setActiveId] = useState('agent')

  const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]))
  const activeCategory = CATEGORIES.find((c) => c.id === activeId)!
  const activeProjects = activeCategory.projectIds
    .map((id) => projectsById[id])
    .filter(Boolean)

  return (
    <div>
      {/* Category tabs */}
      <div
        role="tablist"
        className="flex flex-wrap gap-2 mb-6"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeId
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onMouseEnter={() => setActiveId(cat.id)}
              onClick={() => setActiveId(cat.id)}
              className="group relative text-left px-4 py-2.5 rounded-lg border transition-colors duration-200"
              style={{
                borderColor: isActive ? 'var(--color-terracotta)' : 'var(--color-border)',
                background: isActive ? 'color-mix(in srgb, var(--color-terracotta) 6%, transparent)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span
                className="block text-sm font-medium transition-colors duration-150"
                style={{ color: isActive ? 'var(--color-terracotta)' : 'var(--color-espresso)' }}
              >
                {lang === 'en' ? cat.labelEn : cat.label}
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
                {lang === 'en' ? cat.sublabelEn : cat.sublabel}
              </span>
            </button>
          )
        })}
      </div>

      {/* Project content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="space-y-7"
        >
          {activeProjects.map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <h3 className="font-serif text-lg font-medium">{proj.name}</h3>
                <span className="text-xs text-espresso-dim shrink-0">{proj.period}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-cream-dim text-espresso-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <ul className="mt-2 space-y-1 text-sm text-espresso-dim list-disc pl-4">
                {proj.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
