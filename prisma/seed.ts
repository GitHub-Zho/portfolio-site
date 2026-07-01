import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const COURSES = [
  { title: '初级滑雪私教', level: 'beginner', description: '占位描述 — 替换为真实课程介绍', duration: 120, price: 600, maxStudents: 4 },
  { title: '中级滑雪私教', level: 'intermediate', description: '占位描述 — 替换为真实课程介绍', duration: 150, price: 800, maxStudents: 3 },
  { title: '高级滑雪私教', level: 'advanced', description: '占位描述 — 替换为真实课程介绍', duration: 180, price: 1200, maxStudents: 2 },
]

// Next 2 weekends (Sat + Sun), one morning slot per day
function nextWeekendDates(count: number): Date[] {
  const dates: Date[] = []
  const d = new Date()
  while (dates.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() === 6 || d.getDay() === 0) dates.push(new Date(d))
  }
  return dates
}

async function main() {
  for (const course of COURSES) {
    const created = await prisma.course.create({ data: course })
    const dates = nextWeekendDates(4) // 2 weekends × 2 days
    for (const date of dates) {
      await prisma.timeSlot.create({
        data: {
          courseId: created.id,
          date,
          startTime: '09:00',
          endTime: '11:00',
          maxStudents: course.maxStudents,
        },
      })
    }
  }
  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
