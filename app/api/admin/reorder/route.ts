import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import {
  isCloudinaryConfigured,
  reorderGalleryImages,
} from '@/lib/cloudinary'

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured' },
      { status: 503 },
    )
  }

  const body = (await request.json().catch(() => null)) as {
    publicIds?: string[]
  } | null

  if (!body?.publicIds || !Array.isArray(body.publicIds)) {
    return NextResponse.json({ error: 'Missing publicIds' }, { status: 400 })
  }

  try {
    await reorderGalleryImages(body.publicIds)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Reorder failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
