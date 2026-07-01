'use client'

import { useEffect, useRef, useState } from 'react'
import { useDarkMode } from '@/context/DarkModeContext'

export function GlitchOverlay() {
  const { mode, activateDark } = useDarkMode()
  const [visible, setVisible] = useState(false)
  const [showNoise, setShowNoise] = useState(false)
  const [flashBg, setFlashBg] = useState('#ffffff')
  const [opacity, setOpacity] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  // Stored outside effect deps so mode→'dark' cleanup doesn't cancel it
  const hideRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (mode !== 'entering') return

    setVisible(true)
    setShowNoise(false)
    setOpacity(1)
    setFlashBg('#ffffff')

    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setFlashBg('#000000'), 110))
    timers.push(setTimeout(() => setFlashBg('#ffffff'), 230))
    timers.push(setTimeout(() => setFlashBg('#000000'), 360))
    timers.push(setTimeout(() => setShowNoise(true), 480))
    timers.push(setTimeout(() => {
      activateDark()       // mode → 'dark': triggers this effect's cleanup
      setOpacity(0)
      setShowNoise(false)  // stops RAF loop
      // Use ref so effect cleanup (from mode change) doesn't cancel this
      hideRef.current = setTimeout(() => setVisible(false), 320)
    }, 950))

    return () => timers.forEach(clearTimeout)
  }, [mode, activateDark])

  // Stop RAF when showNoise is turned off
  useEffect(() => {
    if (!showNoise) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const draw = () => {
      const w = Math.max(1, window.innerWidth)
      const h = Math.max(1, window.innerHeight)
      canvas.width = w
      canvas.height = h
      const d = ctx.createImageData(w, h)
      for (let i = 0; i < d.data.length; i += 4) {
        const v = Math.floor(Math.random() * 255)
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v
        d.data[i + 3] = Math.floor(Math.random() * 190 + 65)
      }
      ctx.putImageData(d, 0, 0)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [showNoise])

  // Unmount cleanup only
  useEffect(() => {
    return () => {
      if (hideRef.current) clearTimeout(hideRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        opacity,
        transition: opacity === 0 ? 'opacity 0.32s ease-out' : 'none',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      {!showNoise && (
        <div style={{ position: 'absolute', inset: 0, background: flashBg }} />
      )}
      {showNoise && (
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />
      )}
    </div>
  )
}
