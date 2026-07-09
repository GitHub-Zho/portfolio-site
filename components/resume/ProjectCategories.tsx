'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RESUME } from '@/lib/resumeContent'

type Project = typeof RESUME.projects[number]

interface Category {
  id: string
  label: string
  sublabel: string
  projectNames: string[]
}

const CATEGORIES: Category[] = [
  {
    id: 'agent',
    label: 'Agent / AI',
    sublabel: '多 Agent 系统 · 生成式 AI',
    projectNames: [
      'China Video Bot — 全自动 AI 短视频生成与发布流水线',
      'Dreamina Agent — 视觉反馈闭环的自动出图 Agent',
      'Event-GenAI — 基于 Agent 的活动推荐系统',
    ],
  },
  {
    id: 'cv',
    label: 'CV / 视觉',
    sublabel: '视频生成 · 联邦学习',
    projectNames: [
      '基于姿态引导的视频生成模型（科研）',
      '面向隐私保护的联邦学习框架',
    ],
  },
  {
    id: 'backend',
    label: '后端 / 系统',
    sublabel: '操作系统 · 网络 · Rust',
    projectNames: [
      '操作系统内核实现（C++）',
      '多人在线射击游戏「诺曼底战役」',
      'Rust 系统级工具实现（多伦多大学 ECE1724）',
    ],
  },
  {
    id: 'web',
    label: 'Web / 数据',
    sublabel: '产品官网 · 数据工具',
    projectNames: [
      'Explore China 2026 — 留学生旅行项目官网',
      '薪资数据采集分析 · 简历自动投递助手',
    ],
  },
]

export function ProjectCategories({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState('agent')

  const projectsByName = Object.fromEntries(projects.map((p) => [p.name, p]))
  const activeCategory = CATEGORIES.find((c) => c.id === activeId)!
  const activeProjects = activeCategory.projectNames
    .map((n) => projectsByName[n])
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
                {cat.label}
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
                {cat.sublabel}
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
            <div key={proj.name}>
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
