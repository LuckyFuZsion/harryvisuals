import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin password is not configured' },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string
  } | null

  if (!body?.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(
    ADMIN_COOKIE,
    createAdminSessionToken(),
    adminCookieOptions(),
  )
  return response
}
