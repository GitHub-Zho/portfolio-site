'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { VENTURES } from '@/lib/content'

export function Ventures() {
  return (
    <section className="px-6 sm:px-12 py-20">
      <p className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-10">我在做的事</p>
      <div className="flex flex-wrap gap-3">
        {VENTURES.map((v, i) => (
          <motion.div
            key={v.key}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={v.href}
              className="block px-6 py-4 rounded-full bg-white/70 hover:bg-white shadow-sm transition-colors"
            >
              <span className="font-serif font-medium">{v.title}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
