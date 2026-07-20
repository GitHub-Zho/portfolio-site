// Placeholder content — replace with real copy. See public/CONTENT_TODO.md.
// Adding a new Venture/Journey step is just adding an entry here — no layout changes needed.
// Journal posts live in content/journal/*.mdx (see lib/journal.ts), not here.

export const JOURNEY_STEPS = [
  { title: '滑雪滑到狂热', color: 'var(--color-rose)' },
  { title: '认定了自己会成为程序员', color: 'var(--color-sand)' },
  { title: '一个人背包上路，总能遇见有趣的人', color: 'var(--color-sage)' },
  { title: '仍在继续探索', color: 'var(--color-mauve)' },
]

// darkTitle：暗界（镜中世界）里同一入口的另一种诠释 — 占位文案，等用户替换
export const VENTURES = [
  { key: 'ski', title: '滑雪私教', darkTitle: '下坠，以及如何习惯它。', href: '/booking' },
  { key: 'travel', title: '旅行 · 文化分享', darkTitle: '离开过的地方都还记得你。', href: '/journal?tag=Travel' },
  { key: 'dev', title: '我的项目', darkTitle: '它们还在运行。', href: '/projects' },
  { key: 'more', title: '更多故事', darkTitle: '未归档。', href: '/journal' },
]

export const MOCK_PROJECTS = [
  { title: '项目名占位 01', desc: '一句话描述这个项目', stack: ['Next.js', 'TypeScript'], url: '#' },
  { title: '项目名占位 02', desc: '一句话描述这个项目', stack: ['React', 'Node.js'], url: '#' },
  { title: '项目名占位 03', desc: '一句话描述这个项目', stack: ['Python'], url: '#' },
]
