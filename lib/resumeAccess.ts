import { SignJWT, jwtVerify } from 'jose'

// Security-question gate: "what's my Chinese phone number" — the answer is printed
// on the résumé itself, so anyone who already has a copy of it can unlock this page.
// Same trust model as the capability-link approach this replaced (whoever has the
// résumé gets in), just phrased as a question instead of an ugly token in a URL.
//
// The cookie issued on a correct answer is still a signed JWT (not a bare flag) so
// it can't be forged by just setting a cookie value by hand — only this server,
// holding RESUME_ACCESS_SECRET, can mint a valid one.

const COOKIE_NAME = 'resume_access'
const TOKEN_PURPOSE = 'resume'
const TOKEN_LIFETIME = '365d'

function getSecretKey(): Uint8Array {
  const secret = process.env.RESUME_ACCESS_SECRET
  if (!secret) throw new Error('RESUME_ACCESS_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function generateResumeToken(): Promise<string> {
  return new SignJWT({ purpose: TOKEN_PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_LIFETIME)
    .sign(getSecretKey())
}

export async function verifyResumeToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload.purpose === TOKEN_PURPOSE
  } catch {
    return false
  }
}

function normalizeDigits(input: string): string {
  return input.replace(/\D/g, '')
}

// Accepts the bare number, or the same number with a "+86"/"86" country code prefix,
// so "187 5022 0537", "187-5022-0537", and "+86 18750220537" all work.
export function verifyAnswer(input: string): boolean {
  const expected = process.env.RESUME_ACCESS_ANSWER
  if (!expected) return false
  const normalizedInput = normalizeDigits(input)
  const normalizedExpected = normalizeDigits(expected)
  if (!normalizedInput) return false
  return normalizedInput === normalizedExpected || normalizedInput === `86${normalizedExpected}`
}

export { COOKIE_NAME }
