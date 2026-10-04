import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'hv_admin_session'

function getPassword() {
  return process.env.ADMIN_PASSWORD ?? ''
}

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'dev-only-change-me'
  )
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function createAdminSessionToken() {
  const password = getPassword()
  if (!password) return ''
  return createHmac('sha256', getSecret())
    .update(`admin:${password}`)
    .digest('hex')
}

export function verifyAdminPassword(password: string) {
  const expected = getPassword()
  if (!expected || !password) return false
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false
  const expected = createAdminSessionToken()
  if (!expected) return false
  try {
    const a = Buffer.from(token)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function adminCookieOptions(maxAge = 60 * 60 * 24 * 14) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}
