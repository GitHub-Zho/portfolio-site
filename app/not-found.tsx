import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream text-espresso flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif text-5xl italic text-terracotta mb-4">迷路了？</p>
        <p className="text-espresso-dim leading-relaxed">
          这条路好像走不通——但探索本来就常常这样。
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
