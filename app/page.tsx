import { getAllPosts } from '@/lib/journal'
import { Hero } from '@/components/sections/Hero'
import { Journey } from '@/components/sections/Journey'
import { Journal } from '@/components/sections/Journal'
import { JournalTimeline } from '@/components/sections/JournalTimeline'
import { Ventures } from '@/components/sections/Ventures'
import { ClosingInvite } from '@/components/sections/ClosingInvite'
import { DarkModeProvider } from '@/context/DarkModeContext'
import { DarkPageShell } from '@/components/dark/DarkPageShell'

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <DarkModeProvider>
      <DarkPageShell>
        <Hero />
        <Journey />
        <JournalTimeline />
        <Journal posts={latestPosts} />
        <Ventures />
        <ClosingInvite />
      </DarkPageShell>
    </DarkModeProvider>
  )
}
