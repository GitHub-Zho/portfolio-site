'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { CourseDTO, TimeSlotDTO } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })
}

export function TimeSlotStep({ course, onSelect, onBack }: { course: CourseDTO; onSelect: (slot: TimeSlotDTO) => void; onBack: () => void }) {
  const [slots, setSlots] = useState<TimeSlotDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/timeslots?courseId=${course.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('failed')
        return res.json()
      })
      .then(setSlots)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [course.id])

  return (
    <div>
      <button onClick={onBack} className="text-sm text-espresso-dim hover:text-terracotta transition-colors mb-6">
        ← 重新选课程
      </button>
      <h2 className="font-serif text-2xl font-medium mb-1">选一个时间</h2>
      <p className="text-sm text-espresso-dim mb-6">{course.title}</p>

      {loading && <p className="text-espresso-dim text-sm">加载时间段中…</p>}
      {error && <p className="text-espresso-dim text-sm">时间段加载失败，刷新页面重试一下。</p>}
      {!loading && !error && slots.length === 0 && (
        <p className="text-espresso-dim text-sm">这个课程暂时没有可约时间，换一个课程看看。</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {slots.map((slot) => {
          const full = slot.remaining <= 0
          return (
            <motion.button
              key={slot.id}
              disabled={full}
              onClick={() => !full && onSelect(slot)}
              whileTap={full ? undefined : { scale: 0.97 }}
              className={`text-left rounded-xl border p-4 transition-colors ${
                full
                  ? 'border-cream-dim bg-cream-dim/50 text-espresso-dim/50 cursor-not-allowed'
                  : 'border-cream-dim bg-white/60 hover:bg-white hover:border-terracotta'
              }`}
            >
              <div className="font-medium">{formatDate(slot.date)}</div>
              <div className="text-sm text-espresso-dim mt-1">
                {slot.startTime} - {slot.endTime}
              </div>
              <div className="text-xs mt-2" style={{ color: full ? undefined : 'var(--color-terracotta)' }}>
                {full ? '已满' : `剩 ${slot.remaining} 个名额`}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
