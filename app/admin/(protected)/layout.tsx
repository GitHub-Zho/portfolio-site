import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { logoutAction } from './actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <nav className="flex justify-between items-center px-6 sm:px-12 py-6 border-b border-cream-dim">
        <div className="flex gap-6 text-sm">
          <Link href="/admin" className="hover:text-terracotta transition-colors">预约</Link>
          <Link href="/admin/courses" className="hover:text-terracotta transition-colors">课程</Link>
          <Link href="/admin/timeslots" className="hover:text-terracotta transition-colors">时间段</Link>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-espresso-dim hover:text-terracotta transition-colors">
            退出登录
          </button>
        </form>
      </nav>
      <main className="px-6 sm:px-12 py-10">{children}</main>
    </div>
  )
}
