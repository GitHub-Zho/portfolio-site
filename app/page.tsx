import { getAllPosts } from '@/lib/journal'
import { Hero } from '@/components/sections/Hero'
import { JourneyAndLog } from '@/components/sections/JourneyAndLog'
import { Journal } from '@/components/sections/Journal'
import { Ventures } from '@/components/sections/Ventures'
import { ClosingInvite } from '@/components/sections/ClosingInvite'
import { DarkModeProvider } from '@/context/DarkModeContext'
import { DarkPageShell } from '@/components/dark/DarkPageShell'
import { ScrollRestorer } from '@/components/ui/ScrollRestorer'

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3)

  return (
    <DarkModeProvider>
      <DarkPageShell>
        <ScrollRestorer />
        <Hero />
        <JourneyAndLog />
        <Journal posts={latestPosts} />
        <Ventures />
        <ClosingInvite />
      </DarkPageShell>
    </DarkModeProvider>
  )
}
