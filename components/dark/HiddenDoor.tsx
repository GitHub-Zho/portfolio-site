'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useDarkMode } from '@/context/DarkModeContext'
import { DarkPuzzleGate } from '@/components/dark/DarkPuzzleGate'

// Hover ~2.8s to fully open; press (mobile long-press) opens faster.
// Disengaging decays progress back — the door swings shut on its own.
const HOVER_OPEN_MS = 2800
const PRESS_OPEN_MS = 1600
const DECAY = 1.8

// One crack-of-light flash per page load (module-level: resets on refresh,
// consistent with the dark world's own refresh-reset semantics).
let crackFlashShown = false

export function HiddenDoor() {
  const { isDark, triggerTrap } = useDarkMode()
  const reducedMotion = useReducedMotion()
  const doorRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [inView, setInView] = useState(false)
  const [crackFlash, setCrackFlash] = useState(false)
  const [pullIn, setPullIn] = useState<{ x: number; y: number } | null>(null)
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false)

  const hoverRef = useRef(false)
  const pressRef = useRef(false)
  const progressRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const runningRef = useRef(false)
  const openedRef = useRef(false)

  const step = useCallback((ts: number) => {
    const dt = Math.min(ts - lastTsRef.current || 16, 64)
    lastTsRef.current = ts
    const engaged = hoverRef.current || pressRef.current
    const openMs = pressRef.current ? PRESS_OPEN_MS : HOVER_OPEN_MS
    let p = progressRef.current + (engaged ? dt / openMs : -(dt / HOVER_OPEN_MS) * DECAY)
    p = Math.min(1, Math.max(0, p))
    progressRef.current = p
    setProgress(p)

    if (p >= 1 && !openedRef.current) {
      openedRef.current = true
      runningRef.current = false
      const rect = doorRef.current?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 60
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight - 90
      setPullIn({ x, y })
      // Puzzle appears once the darkness has swallowed the viewport
      setTimeout(() => setIsPuzzleOpen(true), 620)
      return
    }
    if (engaged || p > 0) {
      rafRef.current = requestAnimationFrame(step)
    } else {
      runningRef.current = false
    }
  }, [])

  const ensureLoop = useCallback(() => {
    if (runningRef.current || openedRef.current) return
    runningRef.current = true
    lastTsRef.current = performance.now()
    rafRef.current = requestAnimationFrame(step)
  }, [step])

  // Native pointer events (not React synthetic, not a gesture library):
  // reliable on touch + mouse, and reachable by synthetic events in tests.
  useEffect(() => {
    const el = doorRef.current
    if (!el) return

    const onEnter = (e: PointerEvent) => {
      if (isDark) { triggerTrap(); return }
      if (e.pointerType === 'mouse') { hoverRef.current = true; ensureLoop() }
    }
    const onLeave = () => { hoverRef.current = false }
    const onDown = (e: PointerEvent) => {
      if (isDark) { triggerTrap(); return }
      e.preventDefault()
      pressRef.current = true
      ensureLoop()
    }
    const onUp = () => { pressRef.current = false }
    const onCtx = (e: Event) => e.preventDefault() // long-press must not open a context menu

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('contextmenu', onCtx)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('contextmenu', onCtx)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
    }
  }, [isDark, triggerTrap, ensureLoop])

  // Discovery: brighten slightly when the world's end scrolls into view,
  // and flash a sliver of light through the crack — once per page load.
  useEffect(() => {
    const el = doorRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && !crackFlashShown && !isDark) {
          crackFlashShown = true
          setCrackFlash(true)
          setTimeout(() => setCrackFlash(false), 800)
        }
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [isDark])

  // Entering the dark world: the door is shut again, and stays shut.
  useEffect(() => {
    if (!isDark) return
    hoverRef.current = false
    pressRef.current = false
    progressRef.current = 0
    openedRef.current = false
    setProgress(0)
  }, [isDark])

  function handlePuzzleClose() {
    setIsPuzzleOpen(false)
    setPullIn(null)
    openedRef.current = false
    progressRef.current = 0
    hoverRef.current = false
    pressRef.current = false
    setProgress(0)
  }

  const openDeg = isDark ? 0 : progress * 75
  const frameColor = isDark ? '#2a2a28' : '#3A2E28'
  const baseOpacity = isDark ? 0.3 : inView ? 0.12 : 0.07
  const opacity = isDark
    ? baseOpacity
    : Math.max(baseOpacity, Math.min(0.95, 0.12 + progress * 1.1))

  return (
    <>
      <div
        ref={doorRef}
        aria-hidden="true"
        data-door
        style={{
          position: 'absolute',
          right: 'clamp(1rem, 5vw, 3.5rem)',
          bottom: '1.25rem',
          width: '64px',
          height: '118px',
          opacity,
          transition: 'opacity 0.6s ease',
          cursor: isDark || progress > 0.04 ? 'pointer' : 'default',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          zIndex: 1,
        }}
      >
        {/* The dark behind the door, revealed as it opens */}
        <div
          style={{
            position: 'absolute',
            inset: '3px',
            background: 'linear-gradient(180deg, #0b1013 0%, #07080a 55%, #101a18 100%)',
            opacity: Math.min(1, progress * 1.6),
          }}
        />
        {/* Cold dark leaking out around the frame (not light — dark) */}
        <div
          style={{
            position: 'absolute',
            inset: '-28px',
            background:
              'radial-gradient(ellipse at 35% 50%, rgba(10,16,20,0.55), rgba(26,58,53,0.18) 45%, transparent 72%)',
            filter: 'blur(10px)',
            opacity: progress * 0.9,
            pointerEvents: 'none',
          }}
        />
        {/* Door frame */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `1.5px solid ${frameColor}`,
            borderRadius: '3px 3px 0 0',
          }}
        />
        {/* Door panel — hinged on the left, swings toward the viewer */}
        <div style={{ position: 'absolute', inset: '3px', perspective: '260px' }}>
          <div
            data-door-panel
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'left center',
              transform: reducedMotion ? 'none' : `rotateY(${-openDeg}deg)`,
              opacity: reducedMotion ? 1 - progress : 1,
              background: isDark ? '#0e0f12' : 'var(--color-cream, #FBF6F0)',
              border: `1px solid ${frameColor}`,
              borderRadius: '2px 2px 0 0',
            }}
          >
            {/* Inset panel line */}
            <div
              style={{
                position: 'absolute',
                inset: '10px 9px',
                border: `1px solid ${frameColor}`,
                opacity: 0.5,
                borderRadius: '1px',
              }}
            />
            {/* Handle */}
            <div
              style={{
                position: 'absolute',
                right: '7px',
                top: '50%',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                border: `1.2px solid ${frameColor}`,
                transform: 'translateY(-50%)',
              }}
            />
          </div>
        </div>
        {/* One-time crack of light at the opening edge */}
        <AnimatePresence>
          {crackFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.35, 1] }}
              style={{
                position: 'absolute',
                right: '2px',
                top: '6%',
                bottom: '6%',
                width: '2px',
                background: 'linear-gradient(180deg, transparent, #9fc4bd, transparent)',
                boxShadow: '0 0 12px 2px rgba(159,196,189,0.55)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Pull-in: the dark behind the door swallows the viewport */}
      <AnimatePresence>
        {pullIn && (
          <motion.div
            key="door-pullin"
            initial={{ clipPath: `circle(0px at ${pullIn.x}px ${pullIn.y}px)` }}
            animate={{ clipPath: `circle(160vmax at ${pullIn.x}px ${pullIn.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.6, 0, 0.8, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 7000, background: '#050607' }}
          />
        )}
      </AnimatePresence>

      <DarkPuzzleGate isOpen={isPuzzleOpen} onClose={handlePuzzleClose} />
    </>
  )
}
