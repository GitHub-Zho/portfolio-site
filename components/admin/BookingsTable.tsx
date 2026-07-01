'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { BookingDTO } from '@/lib/types'

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-sand/30 text-espresso',
  confirmed: 'bg-sage/30 text-espresso',
  cancelled: 'bg-cream-dim text-espresso-dim',
}
const STATUS_LABEL: Record<string, string> = {
  pending: '待确认',
  confirmed: '已确认',
  cancelled: '已取消',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
}

export function BookingsTable({ bookings }: { bookings: BookingDTO[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    router.refresh()
  }

  if (bookings.length === 0) {
    return <p className="text-espresso-dim text-sm">这个分类下没有预约。</p>
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div key={b.id} className="rounded-xl bg-white/60 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-medium">{b.name}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_STYLE[b.status] ?? ''}`}>
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <p className="text-sm text-espresso-dim mt-1">
              {b.timeSlot.course.title} · {formatDate(b.timeSlot.date)} {b.timeSlot.startTime}-{b.timeSlot.endTime}
            </p>
            <p className="text-xs text-espresso-dim mt-1">{b.email} · {b.phone}</p>
            {b.message && <p className="text-xs text-espresso-dim mt-1">备注：{b.message}</p>}
          </div>

          {b.status === 'pending' && (
            <div className="flex gap-2">
              <button
                disabled={updating === b.id}
                onClick={() => updateStatus(b.id, 'confirmed')}
                className="text-sm px-4 py-2 rounded-full bg-terracotta text-white hover:bg-terracotta-dark transition-colors disabled:opacity-50"
              >
                确认
              </button>
              <button
                disabled={updating === b.id}
                onClick={() => updateStatus(b.id, 'cancelled')}
                className="text-sm px-4 py-2 rounded-full bg-white hover:bg-cream-dim transition-colors disabled:opacity-50"
              >
                取消
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
