import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Public: only active courses. Admin (logged in): all courses, including deactivated ones.
export async function GET() {
  const session = await auth()
  const courses = await prisma.course.findMany({
    where: session ? undefined : { isActive: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(courses)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, level, duration, price, maxStudents, imageUrl } = await request.json()
  if (!title || !description || !level || !duration || !price || !maxStudents) {
    return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
  }

  const course = await prisma.course.create({
    data: { title, description, level, duration, price, maxStudents, imageUrl },
  })

  return NextResponse.json(course, { status: 201 })
}
