'use client'

import { useState } from 'react'
import type { BookingFormData } from '@/lib/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d+\-\s]{6,20}$/

export function FormStep({ onSubmit, onBack }: { onSubmit: (data: BookingFormData) => void; onBack: () => void }) {
  const [form, setForm] = useState<BookingFormData>({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Partial<BookingFormData>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Partial<BookingFormData> = {}
    if (!form.name.trim()) next.name = '请填写姓名'
    if (!EMAIL_RE.test(form.email)) next.email = '邮箱格式不对'
    if (!PHONE_RE.test(form.phone)) next.phone = '手机号格式不对'
    setErrors(next)
    if (Object.keys(next).length === 0) onSubmit(form)
  }

  return (
    <div>
      <button onClick={onBack} className="text-sm text-espresso-dim hover:text-terracotta transition-colors mb-6">
        ← 重新选时间
      </button>
      <h2 className="font-serif text-2xl font-medium mb-6">留个联系方式</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <input
            placeholder="姓名"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
          />
          {errors.name && <p className="text-xs text-terracotta-dark mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            placeholder="邮箱"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
          />
          {errors.email && <p className="text-xs text-terracotta-dark mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            placeholder="手机号"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
          />
          {errors.phone && <p className="text-xs text-terracotta-dark mt-1">{errors.phone}</p>}
        </div>
        <textarea
          placeholder="想说点什么（可选）"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta resize-none"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          下一步
        </button>
      </form>
    </div>
  )
}
