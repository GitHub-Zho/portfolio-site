import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendBookingStatusUpdate } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled']

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/bookings/[id]'>) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { status } = await request.json()

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: '非法状态' }, { status: 400 })
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { timeSlot: { include: { course: true } } },
  })

  if (status === 'confirmed' || status === 'cancelled') {
    try {
      await sendBookingStatusUpdate(
        {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          message: booking.message,
          courseTitle: booking.timeSlot.course.title,
          date: booking.timeSlot.date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }),
          startTime: booking.timeSlot.startTime,
          endTime: booking.timeSlot.endTime,
        },
        status
      )
    } catch (err) {
      console.error('Failed to send status update email:', err)
    }
  }

  return NextResponse.json(booking)
}
