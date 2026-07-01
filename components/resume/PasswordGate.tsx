'use client'

import { useActionState } from 'react'
import { verifyResumeAnswer } from '@/app/resume/actions'

export function PasswordGate() {
  const [state, action, pending] = useActionState(verifyResumeAnswer, undefined)

  return (
    <main className="min-h-screen bg-cream text-espresso flex items-center justify-center px-6">
      <form action={action} className="w-full max-w-sm text-center space-y-4">
        <p className="font-serif text-2xl italic text-terracotta mb-2">这是一份私密简历</p>
        <p className="text-sm text-espresso-dim mb-6">安全问题：我的中国手机号码是？</p>
        <input
          name="answer"
          type="text"
          inputMode="numeric"
          placeholder="请输入手机号码"
          required
          autoFocus
          className="w-full text-center rounded-lg border border-cream-dim bg-white/60 px-4 py-3 text-sm focus:outline-none focus:border-terracotta"
        />
        {state?.error && <p className="text-sm text-terracotta-dark">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {pending ? '验证中…' : '解锁简历'}
        </button>
      </form>
    </main>
  )
}
