'use client'

import { useState } from 'react'
import type { CourseDTO, TimeSlotDTO, BookingFormData } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })
}

export function ConfirmStep({
  course,
  slot,
  form,
  onBack,
  onConfirmed,
}: {
  course: CourseDTO
  slot: TimeSlotDTO
  form: BookingFormData
  onBack: () => void
  onConfirmed: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSlotId: slot.id, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '提交失败，重试一下')
        setSubmitting(false)
        return
      }
      onConfirmed()
    } catch {
      setError('网络出了点问题，重试一下')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-espresso-dim hover:text-terracotta transition-colors mb-6">
        ← 修改信息
      </button>
      <h2 className="font-serif text-2xl font-medium mb-6">确认一下</h2>

      <div className="rounded-2xl bg-white/60 p-6 max-w-md space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-espresso-dim">课程</span><span className="font-medium">{course.title}</span></div>
        <div className="flex justify-between"><span className="text-espresso-dim">时间</span><span className="font-medium">{formatDate(slot.date)} {slot.startTime}-{slot.endTime}</span></div>
        <div className="flex justify-between"><span className="text-espresso-dim">价格</span><span className="font-medium">¥{course.price}</span></div>
        <div className="h-px bg-cream-dim my-2" />
        <div className="flex justify-between"><span className="text-espresso-dim">姓名</span><span>{form.name}</span></div>
        <div className="flex justify-between"><span className="text-espresso-dim">邮箱</span><span>{form.email}</span></div>
        <div className="flex justify-between"><span className="text-espresso-dim">手机</span><span>{form.phone}</span></div>
        {form.message && <div className="flex justify-between gap-4"><span className="text-espresso-dim shrink-0">备注</span><span className="text-right">{form.message}</span></div>}
      </div>

      {error && <p className="text-sm text-terracotta-dark mt-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="mt-6 px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
      >
        {submitting ? '提交中…' : '确认预约'}
      </button>
    </div>
  )
}
