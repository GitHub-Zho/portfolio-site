'use client'

import { useState } from 'react'
import type { RESUME, RESUME_UI } from '@/lib/resumeContent'
import { ProjectCategories } from '@/components/resume/ProjectCategories'
import { ExperienceReveal } from '@/components/resume/ExperienceReveal'

type Resume = typeof RESUME
type Lang = 'zh' | 'en'

export function ResumeView({
  zh,
  en,
  ui,
}: {
  zh: Resume
  en: Resume
  ui: typeof RESUME_UI
}) {
  const [lang, setLang] = useState<Lang>('zh')
  const r = lang === 'en' ? en : zh
  const t = ui[lang]
  const { contacts } = r

  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <article className="max-w-2xl mx-auto">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <div
            role="group"
            aria-label="language"
            className="inline-flex rounded-full border overflow-hidden text-xs"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {(['zh', 'en'] as const).map((l) => {
              const active = l === lang
              return (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={active}
                  className="px-3 py-1.5 transition-colors"
                  style={{
                    background: active ? 'var(--color-terracotta)' : 'transparent',
                    color: active ? '#fff' : 'var(--color-espresso-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {l === 'zh' ? '中文' : 'EN'}
                </button>
              )
            })}
          </div>
        </div>

        <h1 className="font-serif text-3xl font-medium">{r.name}</h1>
        <p className="text-terracotta mt-1">{r.title}</p>
        <p className="text-sm text-espresso-dim mt-3 leading-relaxed">
          {contacts.phone} · {contacts.phoneAlt} · {contacts.email}
          <br />
          <a href={contacts.github} className="underline hover:text-terracotta" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' · '}
          <a href={contacts.linkedin} className="underline hover:text-terracotta" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">{t.education}</h2>
          <div className="space-y-4">
            {r.education.map((edu) => (
              <div key={edu.school}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-serif text-lg font-medium">{edu.school}</h3>
                  <span className="text-xs text-espresso-dim">{edu.period}</span>
                </div>
                <p className="text-sm text-espresso-dim">{edu.degree}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">{t.skills}</h2>
          <div className="space-y-3">
            {Object.entries(r.skills).map(([category, items]) => (
              <div key={category} className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm text-espresso-dim shrink-0">{category}{lang === 'zh' ? '：' : ':'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {(items as string[]).map((skill) => (
                    <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-cream-dim text-espresso-dim">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">{t.experience}</h2>
          <ExperienceReveal experience={r.experience} />
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">{t.projects}</h2>
          <ProjectCategories projects={r.projects} lang={lang} />
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">{t.awards}</h2>
          <ul className="space-y-1.5 text-sm text-espresso-dim list-disc pl-4">
            {r.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
