import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Mr. Jo",
    default: "Mr. Jo — 地球 Online 在线玩家",
  },
  description: "滑雪、写代码、到处走走看看，都只是开始——心之所向，是星辰大海。",
  openGraph: {
    title: "Mr. Jo — 地球 Online 在线玩家",
    description: "滑雪、写代码、到处走走看看，都只是开始——心之所向，是星辰大海。",
    type: "website",
    // TODO: add og-image once real photography exists, see public/CONTENT_TODO.md
  },
};

// Person schema for the site as a whole — this is a personal brand site, not a business.
// The LocalBusiness/Service schema for ski lessons lives on /booking instead, see that page.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mr. Jo",
  url: SITE_URL,
  description: "滑雪、写代码、到处走走看看 — 都是我喜欢的活法的一部分。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
