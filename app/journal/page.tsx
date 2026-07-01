import Link from 'next/link'
import { getAllPosts } from '@/lib/journal'

export default async function JournalListPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const posts = getAllPosts().filter((p) => !tag || p.tag === tag)

  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <Link href="/" className="text-sm text-espresso-dim hover:text-terracotta transition-colors">
        ← 回到首页
      </Link>

      <p className="text-xs tracking-[0.2em] uppercase text-espresso-dim mt-10 mb-10">
        分享给你{tag ? ` · ${tag}` : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="block rounded-2xl overflow-hidden bg-white/60 hover:bg-white transition-colors group"
          >
            <div className="aspect-[4/3]" style={{ background: post.cover }} />
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-wider text-terracotta">{post.tag}</p>
              <h3 className="font-serif mt-1.5 text-base leading-snug group-hover:text-terracotta transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-espresso-dim mt-2">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <p className="text-espresso-dim">这个分类下还没有文章。</p>}
    </main>
  )
}
