'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { JournalPost } from '@/lib/journal'
import { useDarkMode } from '@/context/DarkModeContext'

export function Journal({ posts }: { posts: JournalPost[] }) {
  const { isDark } = useDarkMode()

  return (
    <section className="px-6 sm:px-12 py-20">
      <p
        className="text-xs tracking-[0.2em] uppercase mb-10"
        style={{
          color: isDark ? '#3a3a30' : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-mono)' : undefined,
          transition: 'color 0.6s',
        }}
      >
        {isDark ? '[ 存档 / 已封存 ]' : '分享给你'}
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
                background: isDark ? '#0e0f12' : 'rgba(255,255,255,0.6)',
                border: isDark ? '1px solid #1e1e22' : '1px solid transparent',
                transition: 'background 0.6s, border-color 0.6s',
              }}
            >
              <div
                className="aspect-[4/3]"
                style={{
                  background: post.cover,
                  filter: isDark ? 'grayscale(0.9) brightness(0.35)' : 'none',
                  transition: 'filter 0.6s',
                }}
              />
              <div className="p-5">
                <p
                  className="text-[11px] uppercase tracking-wider"
                  style={{
                    color: isDark ? '#6b1c2b' : 'var(--color-terracotta)',
                    fontFamily: isDark ? 'var(--font-mono)' : undefined,
                    transition: 'color 0.6s',
                  }}
                >
                  {isDark ? `[ ${post.tag} ]` : post.tag}
                </p>
                <h3
                  className="mt-1.5 text-base leading-snug transition-colors"
                  style={{
                    fontFamily: isDark ? 'var(--font-mono)' : 'var(--font-serif, serif)',
                    color: isDark ? '#d0d0c0' : undefined,
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
          color: isDark ? '#3a3a30' : 'var(--color-espresso-dim)',
          fontFamily: isDark ? 'var(--font-mono)' : undefined,
        }}
      >
        {isDark ? '[ 查看全部记录 ]' : '查看全部 →'}
      </Link>
    </section>
  )
}
