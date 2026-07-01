'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { JournalPost } from '@/lib/journal'

export function Journal({ posts }: { posts: JournalPost[] }) {
  return (
    <section className="px-6 sm:px-12 py-20">
      <p className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-10">分享给你</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/journal/${post.slug}`} className="block rounded-2xl overflow-hidden bg-white/60 hover:bg-white transition-colors group">
              <div className="aspect-[4/3]" style={{ background: post.cover }} />
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-wider text-terracotta">{post.tag}</p>
                <h3 className="font-serif mt-1.5 text-base leading-snug group-hover:text-terracotta transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <Link href="/journal" className="inline-block mt-10 text-sm text-espresso-dim hover:text-terracotta transition-colors">
        查看全部 →
      </Link>
    </section>
  )
}
