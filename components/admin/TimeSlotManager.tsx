'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { TimeSlotDTO } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' })
}

export function TimeSlotManager({
  courses,
  activeCourseId,
  slots,
}: {
  courses: { id: string; title: string; maxStudents: number }[]
  activeCourseId: string | null
  slots: TimeSlotDTO[]
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const activeCourse = courses.find((c) => c.id === activeCourseId)

  async function cancelSlot(id: string) {
    setBusy(id)
    await fetch(`/api/timeslots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setBusy(null)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeCourseId) return
    const form = new FormData(e.currentTarget)
    setBusy('new')
    await fetch('/api/timeslots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: activeCourseId,
        date: form.get('date'),
        startTime: form.get('startTime'),
        endTime: form.get('endTime'),
        maxStudents: activeCourse?.maxStudents ?? 4,
      }),
    })
    setBusy(null)
    router.refresh()
    e.currentTarget.reset()
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/admin/timeslots?courseId=${c.id}`}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              activeCourseId === c.id ? 'bg-terracotta text-white' : 'bg-white/60 hover:bg-white'
            }`}
          >
            {c.title}
          </Link>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        {slots.map((s) => (
          <div key={s.id} className="rounded-lg bg-white/60 p-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">{formatDate(s.date)}</span>
              <span className="text-espresso-dim ml-3">{s.startTime}-{s.endTime}</span>
              <span className="text-espresso-dim ml-3">
                {s.status === 'cancelled' ? '已取消' : `剩 ${s.remaining}/${s.maxStudents}`}
              </span>
            </div>
            {s.status !== 'cancelled' && (
              <button
                disabled={busy === s.id}
                onClick={() => cancelSlot(s.id)}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-cream-dim transition-colors disabled:opacity-50"
              >
                取消
              </button>
            )}
          </div>
        ))}
        {slots.length === 0 && <p className="text-espresso-dim text-sm">这个课程还没有时间段。</p>}
      </div>

      {activeCourseId && (
        <form onSubmit={handleAdd} className="rounded-xl bg-white/60 p-5 max-w-md flex gap-3 items-end flex-wrap">
          <div>
            <label className="text-xs text-espresso-dim block mb-1">日期</label>
            <input name="date" type="date" required className="rounded-lg border border-cream-dim bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-espresso-dim block mb-1">开始</label>
            <input name="startTime" type="time" required defaultValue="09:00" className="rounded-lg border border-cream-dim bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-espresso-dim block mb-1">结束</label>
            <input name="endTime" type="time" required defaultValue="11:00" className="rounded-lg border border-cream-dim bg-white px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={busy === 'new'} className="text-sm px-5 py-2.5 rounded-full bg-terracotta text-white hover:bg-terracotta-dark transition-colors disabled:opacity-50">
            {busy === 'new' ? '添加中…' : '+ 添加'}
          </button>
        </form>
      )}
    </div>
  )
}
