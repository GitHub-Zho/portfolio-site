import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Public: only available slots for a given course. Admin (logged in): all statuses too.
export async function GET(request: NextRequest) {
  const session = await auth()
  const { searchParams } = request.nextUrl
  const courseId = searchParams.get('courseId')
  const from = searchParams.get('from')

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
  }

  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      courseId,
      ...(session ? {} : { status: 'available' }),
      ...(from ? { date: { gte: new Date(from) } } : {}),
    },
    include: { bookings: { where: { status: { not: 'cancelled' } } } },
    orderBy: { date: 'asc' },
  })

  const result = timeSlots.map((slot) => ({
    id: slot.id,
    courseId: slot.courseId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    maxStudents: slot.maxStudents,
    status: slot.status,
    remaining: slot.maxStudents - slot.bookings.length,
  }))

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId, date, startTime, endTime, maxStudents } = await request.json()
  if (!courseId || !date || !startTime || !endTime || !maxStudents) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const slot = await prisma.timeSlot.create({
    data: { courseId, date: new Date(date), startTime, endTime, maxStudents },
  })

  return NextResponse.json(slot, { status: 201 })
}
