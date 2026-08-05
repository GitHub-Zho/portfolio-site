'use client'

import { useState } from 'react'
import type { RESUME, RESUME_UI } from '@/lib/resumeContent'
import { ProjectCategories } from '@/components/resume/ProjectCategories'
import { ExperienceReveal } from '@/components/resume/ExperienceReveal'

type Resume = typeof RESUME
type Lang = 'zh' | 'en'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.02 1.74 2.66 1.24 3.31.95.1-.73.4-1.24.73-1.53-2.51-.29-5.15-1.25-5.15-5.61 0-1.24.44-2.25 1.17-3.04-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.11 1.16a10.8 10.8 0 0 1 5.66 0c2.16-1.46 3.1-1.16 3.1-1.16.62 1.56.24 2.71.12 3 .72.79 1.16 1.8 1.16 3.04 0 4.37-2.65 5.31-5.17 5.6.4.35.77 1.04.77 2.1v3.11c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <span aria-hidden="true" className="grid h-3.5 w-3.5 place-items-center rounded-[2px] bg-current text-[9px] font-bold leading-none text-cream">
      in
    </span>
  )
}

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
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <a
              href={contacts.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub（新窗口打开）"
              className="inline-flex items-center gap-1 rounded-full border border-terracotta/20 bg-terracotta/[0.055] px-2 py-0.5 font-medium text-terracotta transition-all duration-200 hover:-translate-y-px hover:border-terracotta/50 hover:bg-terracotta/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
            <a
              href={contacts.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn（新窗口打开）"
              className="inline-flex items-center gap-1 rounded-full border border-terracotta/20 bg-terracotta/[0.055] px-2 py-0.5 font-medium text-terracotta transition-all duration-200 hover:-translate-y-px hover:border-terracotta/50 hover:bg-terracotta/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
          </span>
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
