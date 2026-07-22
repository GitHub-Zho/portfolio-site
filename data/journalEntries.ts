export interface JournalEntry {
  date: string // YYYY.MM.DD — 用于排序，最新的自动排在最前
  light: string
  dark: string
  darkTier: 1 | 2 | 3 | 4 | 5
}

// 光界内容：真实日常记录。暗界内容：镜中世界视角，按叙事弧线递进
// （1=微小异常 → 5=第四面墙）。新增一条即可，展示时会按 date 自动倒序。
export const journalEntries: JournalEntry[] = [
  {
    date: '2026.07.08',
    light: '我的肉身只需要很少的粮食就能活，而我的精神需要的是山川、河流、自由。我怎么能一生忙碌，只是喂养一副终将衰老的躯体，而不珍惜与我相伴至死的灵魂？',
    dark: '今天我的身体照常吃饭、上班、回家。我在一旁看着它做完这一切。它不需要我。我不太确定，它有没有发现我还跟在后面。',
    darkTier: 4,
  },
]
