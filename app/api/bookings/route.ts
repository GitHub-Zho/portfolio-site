import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

// Admin-only: list all bookings, optionally filtered by status
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = request.nextUrl.searchParams.get('status')

  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { timeSlot: { include: { course: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  const { timeSlotId, name, email, phone, message } = await request.json()

  if (!timeSlotId || !name || !email || !phone) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: {
      bookings: { where: { status: { not: 'cancelled' } } },
      course: true,
    },
  })

  if (!timeSlot) {
    return NextResponse.json({ error: '时间段不存在' }, { status: 404 })
  }

  if (timeSlot.bookings.length >= timeSlot.maxStudents) {
    return NextResponse.json({ error: '该时间段已满，换一个时间试试' }, { status: 400 })
  }

  const booking = await prisma.booking.create({
    data: { timeSlotId, name, email, phone, message },
  })

  const emailDetails = {
    name,
    email,
    phone,
    message: message ?? null,
    courseTitle: timeSlot.course.title,
    date: timeSlot.date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }),
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
  }

  // Email failures must never break booking creation — the booking already exists in the DB.
  try {
    await sendBookingConfirmation(emailDetails)
    await sendAdminNotification(emailDetails)
  } catch (err) {
    console.error('Failed to send booking emails:', err)
  }

  return NextResponse.json(booking, { status: 201 })
}
