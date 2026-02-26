import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const apiKey = process.env.OPENAI_API_KEY
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

  if (!apiKey) {
    return NextResponse.json({ content: '未配置 API Key。' }, { status: 500 })
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ content: `API 错误: ${err}` }, { status: 500 })
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? '无响应'
  return NextResponse.json({ content })
}
