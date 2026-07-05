import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { sanitizeEcho } from '@/lib/echoes'

// D3 的回答（identityAnswer）/ 最终验证通过（completed）
export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/echoes/[id]'>) {
  const { id } = await ctx.params
  const body = await request.json().catch(() => ({}))

  const data: { identityAnswer?: string; completed?: boolean } = {}
  const identityAnswer = sanitizeEcho(body.identityAnswer, 64)
  if (identityAnswer) data.identityAnswer = identityAnswer
  if (body.completed === true) data.completed = true

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: '什么都没有改变。' }, { status: 400 })
  }

  try {
    await prisma.echo.update({ where: { id }, data })
  } catch {
    return NextResponse.json({ error: '它不记得这个人。' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
