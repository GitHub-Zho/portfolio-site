import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/journal'
import { VideoEmbed } from '@/components/ui/VideoEmbed'

// Journal posts are file-based (content/journal/*.mdx) and only change on redeploy,
// so prerender every known slug at build time instead of rendering on each request.
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  }
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { frontmatter, content } = post

  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <Link href="/journal" className="text-sm text-espresso-dim hover:text-terracotta transition-colors">
        ← 所有文章
      </Link>

      <article className="max-w-2xl mx-auto mt-10">
        <p className="text-[11px] uppercase tracking-wider text-terracotta">{frontmatter.tag}</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium mt-2 leading-snug">{frontmatter.title}</h1>
        <p className="text-sm text-espresso-dim mt-3">{frontmatter.date}</p>

        <div className="aspect-[16/9] rounded-xl mt-8 mb-10" style={{ background: frontmatter.cover }} />

        <div className="prose-journal">
          <MDXRemote source={content} components={{ VideoEmbed }} />
        </div>
      </article>
    </main>
  )
}
