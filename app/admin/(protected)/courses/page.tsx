import { prisma } from '@/lib/prisma'
import { CourseManager } from '@/components/admin/CourseManager'

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium mb-6">课程管理</h1>
      <CourseManager
        courses={courses.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          level: c.level,
          duration: c.duration,
          price: c.price,
          maxStudents: c.maxStudents,
          imageUrl: c.imageUrl,
          isActive: c.isActive,
        }))}
      />
    </div>
  )
}
