import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { verifyResumeToken, COOKIE_NAME } from '@/lib/resumeAccess'
import { RESUME, RESUME_EN, RESUME_UI } from '@/lib/resumeContent'
import { PasswordGate } from '@/components/resume/PasswordGate'
import { ResumeView } from '@/components/resume/ResumeView'

export const metadata: Metadata = {
  title: '简历',
  robots: { index: false, follow: false },
}

export default async function ResumePage() {
  const cookieStore = await cookies()
  const authorized = await verifyResumeToken(cookieStore.get(COOKIE_NAME)?.value)

  if (!authorized) return <PasswordGate />

  return <ResumeView zh={RESUME} en={RESUME_EN} ui={RESUME_UI} />
}
