'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { CourseDTO } from '@/lib/types'

const LEVEL_LABEL: Record<string, string> = { beginner: '初级', intermediate: '中级', advanced: '高级' }

export function CourseManager({ courses }: { courses: CourseDTO[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function toggleActive(course: CourseDTO) {
    setBusy(course.id)
    await fetch(`/api/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !course.isActive }),
    })
    setBusy(null)
    router.refresh()
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy('new')
    await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.get('title'),
        description: form.get('description'),
        level: form.get('level'),
        duration: Number(form.get('duration')),
        price: Number(form.get('price')),
        maxStudents: Number(form.get('maxStudents')),
      }),
    })
    setBusy(null)
    setShowForm(false)
    router.refresh()
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {courses.map((c) => (
          <div key={c.id} className="rounded-xl bg-white/60 p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{c.title}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cream-dim text-espresso-dim">
                  {LEVEL_LABEL[c.level] ?? c.level}
                </span>
                {!c.isActive && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cream-dim text-espresso-dim">已下架</span>
                )}
              </div>
              <p className="text-sm text-espresso-dim mt-1">
                {c.duration} 分钟 · ¥{c.price} · 最多 {c.maxStudents} 人
              </p>
            </div>
            <button
              disabled={busy === c.id}
              onClick={() => toggleActive(c)}
              className="text-sm px-4 py-2 rounded-full bg-white hover:bg-cream-dim transition-colors disabled:opacity-50"
            >
              {c.isActive ? '下架' : '上架'}
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm px-5 py-2.5 rounded-full bg-terracotta text-white hover:bg-terracotta-dark transition-colors"
        >
          + 新课程
        </button>
      ) : (
        <form onSubmit={handleCreate} className="rounded-xl bg-white/60 p-5 max-w-md space-y-3">
          <input name="title" placeholder="课程名称" required className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm" />
          <textarea name="description" placeholder="课程描述" required rows={2} className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm resize-none" />
          <select name="level" className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm">
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
          <div className="flex gap-3">
            <input name="duration" type="number" placeholder="时长(分钟)" required className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm" />
            <input name="price" type="number" placeholder="价格" required className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm" />
            <input name="maxStudents" type="number" placeholder="最大人数" required defaultValue={4} className="w-full rounded-lg border border-cream-dim bg-white px-4 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={busy === 'new'} className="text-sm px-5 py-2.5 rounded-full bg-terracotta text-white hover:bg-terracotta-dark transition-colors disabled:opacity-50">
              {busy === 'new' ? '保存中…' : '保存'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm px-5 py-2.5 rounded-full bg-white hover:bg-cream-dim transition-colors">
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
