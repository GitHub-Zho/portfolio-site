// 来访者输入的展示前清洗：去 URL、控制字符，压缩空白，截断
export function sanitizeEcho(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return ''
  return raw
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}
