'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined)

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <form action={action} className="w-full max-w-sm space-y-4">
        <h1 className="font-serif text-2xl font-medium text-espresso mb-2">管理员登录</h1>
        <input
          name="email"
          type="email"
          placeholder="邮箱"
          required
          className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
        />
        <input
          name="password"
          type="password"
          placeholder="密码"
          required
          className="w-full rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
        />
        {state?.error && <p className="text-sm text-terracotta-dark">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {pending ? '登录中…' : '登录'}
        </button>
      </form>
    </main>
  )
}
