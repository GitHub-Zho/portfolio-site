'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

// 「是我，亦非我，皆是我。」— 标点/空格任意变体均接受
const ANSWER = '是我亦非我皆是我'
const normalize = (s: string) => s.replace(/[^一-鿿]/g, '')

// 五幕：问名字 → …… → 问我是谁 → …… → 终问
type Live = 'name' | 'beat1' | 'identity' | 'beat2' | 'final'
// 已完成的幕（可回看）：answer 为 null 表示过渡幕（……）
interface PastStep { prompt: string; answer: string | null }

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function DoorRitual({ isOpen, onClose }: Props) {
  const { startEntry, setVisitorName } = useDarkMode()
  const [live, setLive] = useState<Live>('name')
  const [past, setPast] = useState<PastStep[]>([])
  const [view, setView] = useState(0) // 0..past.length；等于 past.length 时在最新一幕
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [refusal, setRefusal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const echoIdRef = useRef<string | null>(null)
  const identityRef = useRef('')
  const pastRef = useRef<PastStep[]>([])
  const viewRef = useRef(0)

  const frontier = past.length
  const atFrontier = view === frontier

  // 每次开门重新开始仪式
  useEffect(() => {
    if (isOpen) {
      pastRef.current = []
      viewRef.current = 0
      setPast([])
      setView(0)
      setLive('name')
      setInput('')
      setChecking(false)
      setRefusal(false)
    }
  }, [isOpen])

  // 完成一幕：入历史，若正停在最新一幕则跟随前进
  const advance = useCallback((completed: PastStep, next: Live) => {
    const wasAtFrontier = viewRef.current === pastRef.current.length
    pastRef.current = [...pastRef.current, completed]
    setPast(pastRef.current)
    if (wasAtFrontier) {
      viewRef.current = pastRef.current.length
      setView(viewRef.current)
    }
    setLive(next)
  }, [])

  // 过渡幕（……）自动前进
  useEffect(() => {
    if (!isOpen) return
    if (live === 'beat1') {
      const t = setTimeout(() => advance({ prompt: '……', answer: null }, 'identity'), 2000)
      return () => clearTimeout(t)
    }
    if (live === 'beat2') {
      const t = setTimeout(() => advance({ prompt: '……', answer: null }, 'final'), 2000)
      return () => clearTimeout(t)
    }
  }, [live, isOpen, advance])

  // 停在最新问题幕时聚焦输入框
  useEffect(() => {
    if (!isOpen || !atFrontier) return
    if (live === 'name' || live === 'identity' || live === 'final') {
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [live, isOpen, atFrontier])

  // Esc 合上（点页面其他地方不再关闭——复制答案不打断仪式）
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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

  const livePrompt =
    live === 'name' ? '你是谁？'
    : live === 'identity' ? '那么——我是谁？'
    : live === 'final' ? `“${identityRef.current}”……Mr. Jo？那个是我。滑雪的是我，写代码的也是我。那么，我到底是谁？`
    : '……'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = input.trim()
    if (!value || checking) return

    if (live === 'name') {
      submitName(value)
      setInput('')
      advance({ prompt: '你是谁？', answer: value }, 'beat1')
      return
    }
    if (live === 'identity') {
      identityRef.current = value
      patchEcho({ identityAnswer: value })
      setInput('')
      advance({ prompt: '那么——我是谁？', answer: value }, 'beat2')
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
        setTimeout(() => setRefusal(false), 3000)
      }
    }, 1100)
  }

  const goPrev = () => {
    if (viewRef.current > 0) { viewRef.current -= 1; setView(viewRef.current) }
  }
  const goNext = () => {
    if (viewRef.current < pastRef.current.length) { viewRef.current += 1; setView(viewRef.current) }
  }

  const isLiveBeat = live === 'beat1' || live === 'beat2'
  const page = atFrontier ? null : past[view]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{
            opacity: 1,
            y: 0,
            x: refusal ? [-4, 4, -3, 3, 0] : 0,
          }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.45, ease: 'easeOut' }, y: { duration: 0.45 }, x: { duration: 0.4 } }}
          style={{
            position: 'absolute',
            right: 'clamp(1rem, 5vw, 3.5rem)',
            bottom: 'calc(1.25rem + 118px + 22px)',
            width: 'min(340px, calc(100vw - 2rem))',
            zIndex: 20,
            fontFamily: 'var(--font-serif, serif)',
          }}
        >
          {/* 漫画对话泡：近黑底、骨白字 */}
          <div
            style={{
              position: 'relative',
              background: RL.bubble,
              color: RL.bone,
              border: `1px solid ${RL.line}`,
              borderRadius: '10px',
              padding: '1.15rem 1.25rem 0.85rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* 合上（不再点外即关） */}
            <button
              onClick={onClose}
              aria-label="合上"
              style={{
                position: 'absolute', top: '7px', right: '10px',
                background: 'transparent', border: 'none',
                color: RL.boneDim, fontSize: '12px', cursor: 'pointer',
                fontFamily: 'inherit', padding: '2px',
              }}
            >
              ✕
            </button>

            <div style={{ minHeight: '96px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={atFrontier ? `live-${live}` : `past-${view}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {page ? (
                    // ── 回看：已完成的幕（只读，可复制） ──
                    page.answer === null ? (
                      <p style={{ textAlign: 'center', letterSpacing: '0.35em', color: RL.boneDim, padding: '1.6rem 0', userSelect: 'none' }}>
                        ……
                      </p>
                    ) : (
                      <>
                        <p style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)', lineHeight: 1.8, marginBottom: '0.7rem' }}>
                          {page.prompt}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: RL.boneDim, fontStyle: 'italic' }}>
                          「{page.answer}」
                        </p>
                      </>
                    )
                  ) : isLiveBeat ? (
                    // ── 当前：过渡幕 ──
                    <motion.p
                      animate={{ opacity: [0.25, 0.9, 0.25] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ textAlign: 'center', letterSpacing: '0.35em', color: RL.boneDim, padding: '1.6rem 0', userSelect: 'none' }}
                    >
                      ……
                    </motion.p>
                  ) : (
                    // ── 当前：问题幕 ──
                    <>
                      <p style={{ fontSize: live === 'final' ? 'clamp(0.85rem, 2vw, 0.95rem)' : 'clamp(1rem, 2.4vw, 1.15rem)', lineHeight: 1.8, marginBottom: '0.9rem' }}>
                        {livePrompt}
                      </p>

                      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder={live === 'name' ? '写下你的名字' : live === 'identity' ? '写在这里' : ''}
                          autoComplete="off"
                          disabled={checking}
                          maxLength={live === 'name' ? 24 : 64}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            background: 'transparent',
                            border: 'none',
                            borderBottom: `1px solid ${checking ? RL.lineDim : RL.line}`,
                            color: RL.bone,
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
                          aria-label="回答"
                          style={{
                            background: 'transparent',
                            border: `1px solid ${RL.line}`,
                            color: RL.bone,
                            fontFamily: 'inherit',
                            fontSize: '0.8rem',
                            lineHeight: 1,
                            padding: '7px 11px',
                            cursor: checking ? 'default' : 'pointer',
                            borderRadius: '4px',
                            opacity: checking ? 0.45 : 1,
                          }}
                        >
                          ▸
                        </button>
                      </form>

                      <div style={{ minHeight: '1.25rem', marginTop: '0.55rem' }}>
                        <AnimatePresence mode="wait">
                          {checking && (
                            <motion.p
                              key="pause"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0.3, 0.8, 0.3] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.1, repeat: Infinity }}
                              style={{ fontSize: '0.78rem', color: RL.boneDim, letterSpacing: '0.3em' }}
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
                              style={{ fontSize: '0.78rem', color: RL.waxBright }}
                            >
                              ……不。那不全是我。
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {live === 'final' && (
                        <p style={{ fontSize: '0.68rem', color: RL.faint, marginTop: '0.3rem', fontStyle: 'italic' }}>
                          到过世界尽头的人，或许见过它。
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 翻页：回看已说过的话（未到的幕不显示） */}
            {past.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${RL.lineDim}`,
                  marginTop: '0.55rem',
                  paddingTop: '0.5rem',
                  fontSize: '11px',
                }}
              >
                <button
                  onClick={goPrev}
                  disabled={view === 0}
                  style={{
                    background: 'transparent', border: 'none', cursor: view === 0 ? 'default' : 'pointer',
                    color: RL.boneDim, opacity: view === 0 ? 0.25 : 1, fontFamily: 'inherit', padding: '2px 4px',
                  }}
                >
                  ‹ 上一句
                </button>
                <button
                  onClick={goNext}
                  disabled={atFrontier}
                  style={{
                    background: 'transparent', border: 'none', cursor: atFrontier ? 'default' : 'pointer',
                    color: RL.boneDim, opacity: atFrontier ? 0.25 : 1, fontFamily: 'inherit', padding: '2px 4px',
                  }}
                >
                  下一句 ›
                </button>
              </div>
            )}

            {/* 漫画尖角：指向下方的门 */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: '-11px', right: '24px',
                width: 0, height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `11px solid ${RL.line}`,
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', bottom: '-9px', right: '25px',
                width: 0, height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                borderTop: `10px solid ${RL.bubble}`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
