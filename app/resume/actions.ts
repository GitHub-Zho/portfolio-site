'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAnswer, generateResumeToken, COOKIE_NAME } from '@/lib/resumeAccess'

// Deliberate delay on every attempt (success or failure) — the answer is an 11-digit
// phone number, low enough entropy that an unthrottled endpoint could be brute-forced.
// ~1.5s per guess makes that impractical without needing a database-backed rate limiter,
// which would be overkill for a personal résumé gate.
const THROTTLE_MS = 1500

export async function verifyResumeAnswer(_prevState: { error: string } | undefined, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS))

  const answer = formData.get('answer')
  if (typeof answer !== 'string' || !verifyAnswer(answer)) {
    return { error: '不对哦，再想想？' }
  }

  const token = await generateResumeToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/resume',
  })

  redirect('/resume')
}
