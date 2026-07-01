import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const JOURNAL_DIR = path.join(process.cwd(), 'content/journal')

export interface JournalFrontmatter {
  title: string
  tag: string
  date: string
  summary: string
  cover: string
}

export interface JournalPost extends JournalFrontmatter {
  slug: string
}

export function getAllPosts(): JournalPost[] {
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.mdx'))
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, filename), 'utf8')
    const { data } = matter(raw)
    return { slug, ...(data as JournalFrontmatter) }
  })
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): { frontmatter: JournalFrontmatter; content: string } | null {
  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: data as JournalFrontmatter, content }
}
