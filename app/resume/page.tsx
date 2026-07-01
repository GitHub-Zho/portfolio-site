import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { verifyResumeToken, COOKIE_NAME } from '@/lib/resumeAccess'
import { RESUME } from '@/lib/resumeContent'
import { PasswordGate } from '@/components/resume/PasswordGate'
import { ProjectCategories } from '@/components/resume/ProjectCategories'
import { ExperienceReveal } from '@/components/resume/ExperienceReveal'

export const metadata: Metadata = {
  title: '简历',
  robots: { index: false, follow: false },
}

export default async function ResumePage() {
  const cookieStore = await cookies()
  const authorized = await verifyResumeToken(cookieStore.get(COOKIE_NAME)?.value)

  if (!authorized) return <PasswordGate />

  const { contacts } = RESUME

  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <article className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-medium">{RESUME.name}</h1>
        <p className="text-terracotta mt-1">{RESUME.title}</p>
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
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">教育</h2>
          <div className="space-y-4">
            {RESUME.education.map((edu) => (
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
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">技能</h2>
          <div className="space-y-3">
            {Object.entries(RESUME.skills).map(([category, items]) => (
              <div key={category} className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm text-espresso-dim shrink-0">{category}：</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
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
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">实习经历</h2>
          <ExperienceReveal experience={RESUME.experience} />
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">项目经历</h2>
          <ProjectCategories projects={RESUME.projects} />
        </section>

        <section className="mt-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-espresso-dim mb-5">获奖情况</h2>
          <ul className="space-y-1.5 text-sm text-espresso-dim list-disc pl-4">
            {RESUME.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
