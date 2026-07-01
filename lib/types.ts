// Client-side DTO shapes matching the JSON shape returned by app/api/* route handlers
// (dates are serialized as strings over the wire, unlike the Prisma model's Date type)

export interface CourseDTO {
  id: string
  title: string
  description: string
  level: string
  duration: number
  price: number
  maxStudents: number
  imageUrl: string | null
  isActive: boolean
}

export interface TimeSlotDTO {
  id: string
  courseId: string
  date: string
  startTime: string
  endTime: string
  maxStudents: number
  status: string
  remaining: number
}

export interface BookingFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface BookingDTO {
  id: string
  timeSlotId: string
  name: string
  email: string
  phone: string
  message: string | null
  status: string
  createdAt: string
  timeSlot: {
    date: string
    startTime: string
    endTime: string
    course: { title: string }
  }
}
