import { NextResponse } from 'next/server'
import { isEmailConfigured, sendContactEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    console.error('[contact] missing SMTP env vars')
    return NextResponse.json(
      { error: 'Email is not configured' },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string
    email?: string
    shoot?: string
    message?: string
    company?: string
    website?: string
    hv_hp_one?: string
    hv_hp_two?: string
  } | null

  // Honeypot tripped - pretend success so bots don't retry
  const honeypotFilled = Boolean(
    body?.company?.trim() ||
      body?.website?.trim() ||
      body?.hv_hp_one?.trim() ||
      body?.hv_hp_two?.trim(),
  )
  if (honeypotFilled) {
    console.warn('[contact] honeypot tripped - dropping submission')
    return NextResponse.json({ ok: true })
  }

  const name = body?.name?.trim() ?? ''
  const email = body?.email?.trim() ?? ''
  const shoot = body?.shoot?.trim() ?? ''
  const message = body?.message?.trim() ?? ''

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email and message are required' },
      { status: 400 },
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    await sendContactEmail({ name, email, shoot, message })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[contact] send failed', error)
    const messageText =
      error instanceof Error ? error.message : 'Failed to send message'
    return NextResponse.json({ error: messageText }, { status: 500 })
  }
}
