import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-3xl mb-4">🎿</p>
        <h1 className="font-serif text-2xl font-medium">预约已经收到啦</h1>
        <p className="text-espresso-dim mt-3 leading-relaxed">
          确认邮件已经发到你的邮箱了，我会尽快联系你确认细节。
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          回到首页
        </Link>
      </div>
    </main>
  )
}
