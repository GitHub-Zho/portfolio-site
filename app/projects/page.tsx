import Link from 'next/link'
import { MOCK_PROJECTS } from '@/lib/content'

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <Link href="/" className="text-sm text-espresso-dim hover:text-terracotta transition-colors">
        ← 回到首页
      </Link>

      <p className="text-xs tracking-[0.2em] uppercase text-espresso-dim mt-10 mb-10">我的项目</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.url}
            className="block rounded-2xl bg-white/60 hover:bg-white transition-colors p-6"
          >
            <h3 className="font-serif text-lg font-medium">{p.title}</h3>
            <p className="text-sm text-espresso-dim mt-2">{p.desc}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {p.stack.map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-cream-dim text-espresso-dim">
                  {s}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
