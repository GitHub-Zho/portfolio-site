'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function loginAction(_prevState: { error: string } | undefined, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: '邮箱或密码不对' }
    }
    throw err
  }
}
