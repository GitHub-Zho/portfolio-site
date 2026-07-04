'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'

export function ResumeSwipeHint() {
  const router = useRouter()
  const { isDark } = useDarkMode()

  if (isDark) return null

  return (
    <motion.button
      onClick={() => router.push('/resume')}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 text-xs text-espresso-dim hover:text-terracotta transition-colors cursor-pointer select-none bg-transparent border-0 p-0"
    >
      <span>看看我的职业档案</span>
      <motion.span
        aria-hidden="true"
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
      >
        →
      </motion.span>
    </motion.button>
  )
}
