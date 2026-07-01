'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { CourseStep } from './CourseStep'
import { TimeSlotStep } from './TimeSlotStep'
import { FormStep } from './FormStep'
import { ConfirmStep } from './ConfirmStep'
import type { CourseDTO, TimeSlotDTO, BookingFormData } from '@/lib/types'

type Step = 'course' | 'time' | 'form' | 'confirm'

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function BookingWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('course')
  const [course, setCourse] = useState<CourseDTO | null>(null)
  const [slot, setSlot] = useState<TimeSlotDTO | null>(null)
  const [form, setForm] = useState<BookingFormData | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 'course' && (
            <CourseStep
              onSelect={(c) => {
                setCourse(c)
                setStep('time')
              }}
            />
          )}
          {step === 'time' && course && (
            <TimeSlotStep
              course={course}
              onBack={() => setStep('course')}
              onSelect={(s) => {
                setSlot(s)
                setStep('form')
              }}
            />
          )}
          {step === 'form' && (
            <FormStep
              onBack={() => setStep('time')}
              onSubmit={(data) => {
                setForm(data)
                setStep('confirm')
              }}
            />
          )}
          {step === 'confirm' && course && slot && form && (
            <ConfirmStep
              course={course}
              slot={slot}
              form={form}
              onBack={() => setStep('form')}
              onConfirmed={() => router.push('/booking/success')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
