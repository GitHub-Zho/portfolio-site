import type { Metadata } from 'next'
import Link from 'next/link'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: '预约滑雪私教',
  description: '在线选课、选时间，预约一对一滑雪私教课程。',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// LocalBusiness schema lives here (not in the root layout) — this page is the actual
// service offering; the rest of the site is a personal brand page, not a business.
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Mr. Jo 滑雪私教',
  description: '一对一滑雪私教课程，分初级/中级/高级，在线预约。',
  url: `${SITE_URL}/booking`,
  priceRange: '¥¥',
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-cream text-espresso px-6 sm:px-12 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Link href="/" className="text-sm text-espresso-dim hover:text-terracotta transition-colors">
        ← 回到首页
      </Link>
      <div className="mt-10">
        <BookingWizard />
      </div>
    </main>
  )
}
