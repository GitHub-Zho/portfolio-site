'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

// 滚到底后还想继续下滑 → 世界边界的提醒（节流 4s）
export function WorldEdgeToast() {
  const { isDark } = useDarkMode()
  const [show, setShow] = useState(false)
  const lastRef = useRef(0)
  const touchYRef = useRef(0)
  const hideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const atBottom = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4

    const fire = () => {
      const now = Date.now()
      if (now - lastRef.current < 4000) return
      lastRef.current = now
      setShow(true)
      clearTimeout(hideRef.current)
      hideRef.current = setTimeout(() => setShow(false), 2100)
    }

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 6 && atBottom()) fire()
    }
    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0
      if (touchYRef.current - y > 26 && atBottom()) fire()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      clearTimeout(hideRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="world-edge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '26px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 5000,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: isDark ? RL.bubble : '#E8DCC3',
              color: isDark ? RL.bone : '#3B2F23',
              border: `1px solid ${isDark ? RL.line : 'rgba(59, 47, 35, 0.4)'}`,
              borderRadius: '8px',
              padding: '9px 20px',
              fontFamily: 'var(--font-serif, serif)',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              letterSpacing: '0.06em',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            {isDark ? '出不去的。' : '这里已经是世界的尽头了。'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
