import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import {
  bustGalleryCache,
  deleteGalleryImage,
  isCloudinaryConfigured,
} from '@/lib/cloudinary'

export async function DELETE(request: Request) {
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
    publicId?: string
  } | null

  if (!body?.publicId) {
    return NextResponse.json({ error: 'Missing publicId' }, { status: 400 })
  }

  try {
    await deleteGalleryImage(body.publicId)
    bustGalleryCache()
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
