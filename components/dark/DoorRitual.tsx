'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'

// 「是我，亦非我，皆是我。」— 标点/空格任意变体均接受
const ANSWER = '是我亦非我皆是我'
const normalize = (s: string) => s.replace(/[^一-鿿]/g, '')

// 五幕：问名字 → …… → 问我是谁 → …… → 终问
type Act = 'name' | 'beat1' | 'identity' | 'beat2' | 'final'

const PAPER = {
  bg: '#E8DCC3',
  ink: '#3B2F23',
  inkDim: 'rgba(59, 47, 35, 0.55)',
  accent: '#7A2E2B',
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DoorRitual({ isOpen, onClose }: Props) {
  const { startEntry, setVisitorName } = useDarkMode()
  const [act, setAct] = useState<Act>('name')
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [refusal, setRefusal] = useState(false) // 答错后的那行小字
  const [shakeKey, setShakeKey] = useState(0)
  const paperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const echoIdRef = useRef<string | null>(null)
  const identityRef = useRef('')

  // 每次开门重新开始仪式
  useEffect(() => {
    if (isOpen) {
      setAct('name')
      setInput('')
      setChecking(false)
      setRefusal(false)
    }
  }, [isOpen])

  // 幕间过渡（……）自动前进
  useEffect(() => {
    if (!isOpen) return
    if (act === 'beat1') {
      const t = setTimeout(() => setAct('identity'), 2000)
      return () => clearTimeout(t)
    }
    if (act === 'beat2') {
      const t = setTimeout(() => setAct('final'), 2000)
      return () => clearTimeout(t)
    }
    // 输入幕：聚焦
    const t = setTimeout(() => inputRef.current?.focus(), 450)
    return () => clearTimeout(t)
  }, [act, isOpen])

  // 点纸外任意处 / Esc：门合上，仪式中断
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (paperRef.current?.contains(t)) return
      if ((t as Element).closest?.('[data-door]')) return
      onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  const submitName = useCallback(async (name: string) => {
    setVisitorName(name)
    try {
      const res = await fetch('/api/echoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) echoIdRef.current = (await res.json()).id
    } catch { /* 仪式不因网络中断 */ }
  }, [setVisitorName])

  const patchEcho = useCallback((data: Record<string, unknown>) => {
    if (!echoIdRef.current) return
    fetch(`/api/echoes/${echoIdRef.current}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => { /* 同上 */ })
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = input.trim()
    if (!value || checking) return

    if (act === 'name') {
      submitName(value)
      setInput('')
      setAct('beat1')
      return
    }
    if (act === 'identity') {
      identityRef.current = value
      patchEcho({ identityAnswer: value })
      setInput('')
      setAct('beat2')
      return
    }
    // final：真正的验证，带一拍停顿
    setChecking(true)
    setRefusal(false)
    setTimeout(() => {
      setChecking(false)
      if (normalize(value) === ANSWER) {
        patchEcho({ completed: true })
        onClose()
        setTimeout(() => startEntry(), 280)
      } else {
        setRefusal(true)
        setShakeKey(k => k + 1)
        setTimeout(() => setRefusal(false), 3000)
      }
    }, 1100)
  }

  const prompt =
    act === 'name' ? '你是谁？'
    : act === 'identity' ? '那么——我是谁？'
    : `“${identityRef.current}”……Mr. Jo？那个是我。滑雪的是我，写代码的也是我。那么，我到底是谁？`

  const placeholder =
    act === 'name' ? '写下你的名字' : act === 'identity' ? '说说看' : ''

  const isBeat = act === 'beat1' || act === 'beat2'

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 'clamp(1rem, 5vw, 3.5rem)',
            bottom: 'calc(1.25rem + 118px + 16px)',
            width: 'min(340px, calc(100vw - 2rem))',
            zIndex: 20,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${act}-${shakeKey}`}
              ref={paperRef}
              initial={{ opacity: 0, y: 26, scaleY: 0.6 }}
              animate={{
                opacity: 1, y: 0, scaleY: 1,
                x: shakeKey > 0 && refusal ? [-4, 4, -3, 3, -1, 0] : 0,
              }}
              exit={{ opacity: 0, y: 10, scaleY: 0.85 }}
              transition={{
                opacity: { duration: 0.65, ease: 'easeOut' },
                y: { duration: 0.65, ease: 'easeOut' },
                scaleY: { duration: 0.65, ease: 'easeOut' },
                x: { duration: 0.4 },
              }}
              style={{
                transformOrigin: 'bottom right',
                background: PAPER.bg,
                color: PAPER.ink,
                border: `1px solid ${PAPER.ink}`,
                boxShadow: `inset 0 0 0 3px ${PAPER.bg}, inset 0 0 0 4px ${PAPER.inkDim}, 0 10px 28px rgba(20, 14, 8, 0.35)`,
                borderRadius: '2px',
                padding: isBeat ? '1.1rem 1.4rem' : '1.4rem 1.5rem 1.2rem',
                rotate: '-0.5deg',
                fontFamily: 'var(--font-serif, serif)',
              }}
            >
              {/* 顶部小饰角 */}
              <div aria-hidden="true" style={{ textAlign: 'center', fontSize: '8px', color: PAPER.inkDim, marginBottom: isBeat ? '0.35rem' : '0.8rem', letterSpacing: '0.5em' }}>
                ◆
              </div>

              {isBeat ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.35] }}
                  transition={{ duration: 2, times: [0, 0.3, 0.75, 1] }}
                  style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.35em', color: PAPER.inkDim, userSelect: 'none' }}
                >
                  ……
                </motion.p>
              ) : (
                <>
                  <p style={{ fontSize: act === 'final' ? 'clamp(0.85rem, 2vw, 0.95rem)' : 'clamp(1rem, 2.4vw, 1.15rem)', lineHeight: 1.8, marginBottom: '1.1rem' }}>
                    {prompt}
                  </p>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={placeholder}
                      autoComplete="off"
                      disabled={checking}
                      maxLength={act === 'name' ? 24 : 64}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: `1px solid ${checking ? PAPER.inkDim : PAPER.ink}`,
                        color: PAPER.ink,
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        padding: '4px 2px',
                        outline: 'none',
                        opacity: checking ? 0.45 : 1,
                        transition: 'opacity 0.3s',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={checking}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${PAPER.inkDim}`,
                        boxShadow: `inset 0 0 0 2px ${PAPER.bg}, inset 0 0 0 3px rgba(59,47,35,0.25)`,
                        color: PAPER.ink,
                        fontFamily: 'inherit',
                        fontSize: '0.8rem',
                        padding: '5px 12px',
                        cursor: checking ? 'default' : 'pointer',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {act === 'name' ? '递上去' : act === 'identity' ? '说出来' : '回答'}
                    </button>
                  </form>

                  <div style={{ minHeight: '1.3rem', marginTop: '0.6rem' }}>
                    <AnimatePresence mode="wait">
                      {checking && (
                        <motion.p
                          key="pause"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, repeat: Infinity }}
                          style={{ fontSize: '0.78rem', color: PAPER.inkDim, letterSpacing: '0.3em' }}
                        >
                          ……
                        </motion.p>
                      )}
                      {refusal && !checking && (
                        <motion.p
                          key="refusal"
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          style={{ fontSize: '0.78rem', color: PAPER.accent }}
                        >
                          ……不。那不全是我。
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {act === 'final' && (
                    <p style={{ fontSize: '0.68rem', color: PAPER.inkDim, marginTop: '0.4rem', fontStyle: 'italic' }}>
                      到过世界尽头的人，或许见过它。
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}
