'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { JournalPost } from '@/lib/journal'
import { useDarkMode } from '@/context/DarkModeContext'
import { RL } from '@/lib/rustyLake'

export function Journal({ posts }: { posts: JournalPost[] }) {
  const { isDark } = useDarkMode()

  return (
    <section className="px-6 sm:px-12 py-20">
      <p
        className="text-xs tracking-[0.2em] uppercase mb-10"
        style={{
          color: isDark ? RL.brass : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-serif, serif)' : undefined,
          letterSpacing: isDark ? '0.3em' : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '存档 · 已封存' : '分享给你'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={`/journal/${post.slug}`}
              className="block rounded-2xl overflow-hidden transition-colors group"
              style={{
                background: isDark ? RL.surface : 'rgba(255,255,255,0.6)',
                border: isDark ? `1px solid ${RL.lineDim}` : '1px solid transparent',
                transition: 'background 0.6s, border-color 0.6s',
              }}
            >
              <div
                className="aspect-[4/3]"
                style={{
                  background: post.cover,
                  filter: isDark ? 'sepia(0.55) brightness(0.32) contrast(0.92)' : 'none',
                  transition: 'filter 0.6s',
                }}
              />
              <div className="p-5">
                <p
                  className="text-[11px] uppercase tracking-wider"
                  style={{
                    color: isDark ? RL.brass : 'var(--color-terracotta)',
                    fontFamily: isDark ? 'var(--font-serif, serif)' : undefined,
                    fontStyle: isDark ? 'italic' : undefined,
                    transition: 'color 0.6s',
                  }}
                >
                  {post.tag}
                </p>
                <h3
                  className="mt-1.5 text-base leading-snug transition-colors font-serif"
                  style={{
                    color: isDark ? RL.bone : undefined,
                  }}
                >
                  {post.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <Link
        href="/journal"
        className="inline-block mt-10 text-sm transition-colors"
        style={{
          color: isDark ? RL.boneDim : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-serif, serif)' : undefined,
        }}
      >
        {isDark ? '翻阅全部档案 →' : '查看全部 →'}
      </Link>
    </section>
  )
}
