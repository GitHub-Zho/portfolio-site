'use client'

import { motion } from 'framer-motion'
import { JOURNEY_STEPS } from '@/lib/content'

export function Journey() {
  return (
    <section className="px-6 sm:px-12 py-20 max-w-2xl">
      <p className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-10">我的故事</p>
      <div className="space-y-8">
        {JOURNEY_STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-center gap-4"
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: step.color }} />
            <h3 className="font-serif text-lg sm:text-xl font-medium">{step.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
