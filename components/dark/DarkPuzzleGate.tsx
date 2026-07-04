'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'

// 「是我，亦非我，皆是我。」— 页脚签名句，标点/空格任意变体均接受
const ANSWER = '是我亦非我皆是我'

// 只保留 CJK 字符：去掉所有标点、空格、全半角符号
function normalize(s: string) {
  return s.replace(/[^一-鿿]/g, '')
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DarkPuzzleGate({ isOpen, onClose }: Props) {
  const { startEntry } = useDarkMode()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setInput('')
      setError(false)
      setChecking(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (checking || !input.trim()) return
    setChecking(true)
    setError(false)
    // 刻意的核验停顿——档案系统不会立刻回答你
    setTimeout(() => {
      setChecking(false)
      if (normalize(input) === ANSWER) {
        onClose()
        setTimeout(() => startEntry(), 80)
      } else {
        setError(true)
        setShakeKey(k => k + 1)
        setTimeout(() => setError(false), 2500)
      }
    }, 1100)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="puzzle-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 8000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(7, 8, 10, 0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            key={`puzzle-card-${shakeKey}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              x: shakeKey > 0 ? [-5, 5, -4, 4, -2, 2, 0] : 0,
            }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
              x: { duration: 0.45, ease: 'easeOut' },
            }}
            style={{
              background: '#0e0f12',
              border: '1px solid #1e1e22',
              borderRadius: '12px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              width: '90%',
              maxWidth: '440px',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: '#2a2a28',
              letterSpacing: '0.12em',
              marginBottom: '2rem',
            }}>
              [ SYS ] ECHO CHAMBER PROTOCOL · ACTIVE
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
                style={{ width: '2px', height: '20px', background: '#d0d0c0', flexShrink: 0 }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(13px, 2vw, 15px)',
                color: '#d0d0c0',
              }}>
                访问核验
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(13px, 2.2vw, 16px)',
              color: '#8f8f80',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              你是谁？
            </p>

            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="回答..."
                autoComplete="off"
                disabled={checking}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#131315',
                  border: `1px solid ${error ? '#6b1c2b' : '#1e1e22'}`,
                  color: '#d0d0c0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: checking ? 0.5 : 1,
                }}
              />

              <AnimatePresence mode="wait">
                {checking && (
                  <motion.p
                    key="checking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#4a4a3a',
                      marginTop: '8px',
                    }}
                  >
                    核验中...
                  </motion.p>
                )}
                {error && !checking && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: '#6b1c2b',
                      marginTop: '8px',
                    }}
                  >
                    错误。答案就在这个世界里。
                  </motion.p>
                )}
              </AnimatePresence>

              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#2a2a28',
                marginTop: '10px',
              }}>
                提示：它写在世界的尽头。
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
