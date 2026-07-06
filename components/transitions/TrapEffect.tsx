'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'

export function TrapEffect() {
  const { isTrapActive } = useDarkMode()

  return (
    <AnimatePresence>
      {isTrapActive && (
        <motion.div
          key="trap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: 'clamp(1.6rem, 5vw, 3.2rem)',
              color: 'rgba(214, 205, 178, 0.14)',
              letterSpacing: '0.1em',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            回不去了...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
