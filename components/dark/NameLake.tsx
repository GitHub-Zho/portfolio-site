'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

interface LakeData { count: number; names: string[] }

// 稳定伪随机：同一批名字每次渲染位置一致
function hash(s: string, salt: number) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < s.length; i++) h = ((h ^ s.charCodeAt(i)) * 16777619) >>> 0
  return h
}

// 三层深度：远 / 中 / 近 —— 大小、清晰度、沉浮速度都不同
const LAYERS = [
  { fontSize: '11px', opacity: 0.32, blur: '1.2px' },
  { fontSize: '15px', opacity: 0.52, blur: '0.4px' },
  { fontSize: '21px', opacity: 0.8, blur: '0px' },
] as const

export function NameLake() {
  const { isDark } = useDarkMode()
  const [held, setHeld] = useState(false)
  const [hover, setHover] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [data, setData] = useState<LakeData | null>(null)
  const poolRef = useRef<HTMLDivElement>(null)

  // 进入暗界后取一次湖里的名字
  useEffect(() => {
    if (!isDark || data) return
    fetch('/api/echoes')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ count: 0, names: [] }))
  }, [isDark, data])

  // 松手（在任何位置）湖面收回
  useEffect(() => {
    if (!held) return
    const release = () => setHeld(false)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [held])

  const floats = useMemo(() => {
    if (!data) return []
    return data.names.map((n, i) => {
      const h = hash(n, i * 7 + 3)
      return {
        n,
        layer: LAYERS[i % 3],
        left: 4 + (h % 88),
        top: 8 + ((h >> 5) % 70),
        dur: 5 + ((h >> 9) % 50) / 10,
        delay: -(((h >> 13) % 60) / 10),
      }
    })
  }, [data])

  if (!isDark) return null

  return (
    <>
      {/* 门旁的一汪黑水 —— 按住它，看湖底 */}
      <div
        ref={poolRef}
        aria-hidden="true"
        data-lake
        onPointerDown={(e) => {
          e.preventDefault()
          const r = poolRef.current?.getBoundingClientRect()
          if (r) setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
          setHeld(true)
        }}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: 'absolute',
          left: 'clamp(1rem, 5vw, 3.5rem)',
          bottom: '1.4rem',
          width: '118px',
          height: '42px',
          cursor: 'pointer',
          opacity: hover || held ? 0.9 : 0.45,
          transition: 'opacity 0.5s',
          touchAction: 'none',
          userSelect: 'none',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 42%, #131c1f 0%, #05080a 74%)',
            border: `1px solid ${RL.lineDim}`,
            boxShadow: 'inset 0 3px 12px rgba(0, 0, 0, 0.85)',
          }}
        />
        {/* 缓慢扩散的波纹 */}
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid rgba(214, 205, 178, 0.22)`,
            animation: 'lake-ripple 3.8s ease-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `1px solid rgba(214, 205, 178, 0.16)`,
            animation: 'lake-ripple 3.8s ease-out 1.9s infinite',
          }}
        />
      </div>

      {/* 湖底：来访者的名字之海 */}
      <AnimatePresence>
        {held && (
          <motion.div
            key="lake-water"
            initial={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${origin.x}px ${origin.y}px)` }}
            exit={{ clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` }}
            transition={{ duration: 0.65, ease: [0.3, 0, 0.4, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 6000,
              background: 'radial-gradient(ellipse at 50% 62%, #0a1215 0%, #05080a 68%)',
              overflow: 'hidden',
              fontFamily: 'var(--font-serif, serif)',
              pointerEvents: 'none',
            }}
          >
            {floats.map((f, i) => (
              <span
                key={`${f.n}-${i}`}
                style={{
                  position: 'absolute',
                  left: `${f.left}%`,
                  top: `${f.top}%`,
                  fontSize: f.layer.fontSize,
                  opacity: f.layer.opacity,
                  filter: `blur(${f.layer.blur})`,
                  color: RL.bone,
                  whiteSpace: 'nowrap',
                  animation: `lake-bob ${f.dur}s ease-in-out ${f.delay}s infinite`,
                }}
              >
                {f.n}
              </span>
            ))}

            <p
              style={{
                position: 'absolute',
                bottom: '9%',
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
                letterSpacing: '0.12em',
                color: RL.brass,
              }}
            >
              {data && data.count > 0 ? `已有 ${data.count} 人到过这里。` : '湖里还没有名字。'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
