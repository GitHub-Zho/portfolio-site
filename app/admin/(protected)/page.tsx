import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookingsTable } from '@/components/admin/BookingsTable'

const STATUSES = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待确认' },
  { value: 'confirmed', label: '已确认' },
  { value: 'cancelled', label: '已取消' },
]

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { timeSlot: { include: { course: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium mb-6">预约管理</h1>

      <div className="flex gap-2 mb-6">
        {STATUSES.map((s) => (
          <Link
            key={s.value}
            href={s.value ? `/admin?status=${s.value}` : '/admin'}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              (status ?? '') === s.value ? 'bg-terracotta text-white' : 'bg-white/60 hover:bg-white'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <BookingsTable
        bookings={bookings.map((b) => ({
          id: b.id,
          timeSlotId: b.timeSlotId,
          name: b.name,
          email: b.email,
          phone: b.phone,
          message: b.message,
          status: b.status,
          createdAt: b.createdAt.toISOString(),
          timeSlot: {
            date: b.timeSlot.date.toISOString(),
            startTime: b.timeSlot.startTime,
            endTime: b.timeSlot.endTime,
            course: { title: b.timeSlot.course.title },
          },
        }))}
      />
    </div>
  )
}
