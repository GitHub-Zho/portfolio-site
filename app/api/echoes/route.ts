import { prisma } from '@/lib/prisma'
import { sanitizeEcho } from '@/lib/echoes'
import { NextRequest, NextResponse } from 'next/server'

// D1「你是谁？」提交 — 名字入库
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const name = sanitizeEcho(body.name, 24)

  if (!name) {
    return NextResponse.json({ error: '它在等一个名字。' }, { status: 400 })
  }

  const echo = await prisma.echo.create({ data: { name } })
  return NextResponse.json({ id: echo.id }, { status: 201 })
}

// 名字之湖：总数 + 随机抽样（只取通过最终验证的来访者）
export async function GET() {
  const count = await prisma.echo.count({ where: { completed: true } })
  const recent = await prisma.echo.findMany({
    where: { completed: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { name: true },
  })

  // Fisher–Yates 抽 48 条，展示前再清洗一遍（防旧数据）
  const pool = recent.map(e => sanitizeEcho(e.name, 24)).filter(Boolean)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return NextResponse.json({ count, names: pool.slice(0, 48) })
}
