'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { CourseDTO } from '@/lib/types'

const LEVEL_LABEL: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
}

export function CourseStep({ onSelect }: { onSelect: (course: CourseDTO) => void }) {
  const [courses, setCourses] = useState<CourseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => {
        if (!res.ok) throw new Error('failed')
        return res.json()
      })
      .then(setCourses)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-espresso-dim text-sm">加载课程中…</p>
  if (error) return <p className="text-espresso-dim text-sm">课程加载失败，刷新页面重试一下。</p>

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium mb-6">选一个课程</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {courses.map((course) => (
          <motion.button
            key={course.id}
            onClick={() => onSelect(course)}
            whileTap={{ scale: 0.97 }}
            className="text-left rounded-2xl border border-cream-dim bg-white/60 hover:bg-white hover:border-terracotta transition-colors p-5"
          >
            <p className="text-[11px] uppercase tracking-wider text-terracotta">{LEVEL_LABEL[course.level] ?? course.level}</p>
            <h3 className="font-serif text-lg font-medium mt-1.5">{course.title}</h3>
            <p className="text-sm text-espresso-dim mt-2">{course.description}</p>
            <div className="flex justify-between items-baseline mt-4 text-sm">
              <span className="text-espresso-dim">{course.duration} 分钟</span>
              <span className="font-medium">¥{course.price}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
