import { prisma } from '@/lib/prisma'
import { TimeSlotManager } from '@/components/admin/TimeSlotManager'

export default async function AdminTimeSlotsPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>
}) {
  const { courseId } = await searchParams
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } })
  const activeCourseId = courseId ?? courses[0]?.id

  const slots = activeCourseId
    ? await prisma.timeSlot.findMany({
        where: { courseId: activeCourseId },
        include: { bookings: { where: { status: { not: 'cancelled' } } } },
        orderBy: { date: 'asc' },
      })
    : []

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium mb-6">时间段管理</h1>
      <TimeSlotManager
        courses={courses.map((c) => ({ id: c.id, title: c.title, maxStudents: c.maxStudents }))}
        activeCourseId={activeCourseId ?? null}
        slots={slots.map((s) => ({
          id: s.id,
          courseId: s.courseId,
          date: s.date.toISOString(),
          startTime: s.startTime,
          endTime: s.endTime,
          maxStudents: s.maxStudents,
          status: s.status,
          remaining: s.maxStudents - s.bookings.length,
        }))}
      />
    </div>
  )
}
