import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import {
  bustGalleryCache,
  isCloudinaryConfigured,
  listGalleryAssetsFresh,
  uploadGalleryImage,
} from '@/lib/cloudinary'

export const runtime = 'nodejs'

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

  const formData = await request.formData()
  const files = formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  try {
    const existing = await listGalleryAssetsFresh()
    let nextOrder = existing.length
    const uploaded = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `${file.name} is not an image` },
          { status: 400 },
        )
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadGalleryImage(buffer, file.name, nextOrder)
      nextOrder += 1
      uploaded.push(result)
    }

    bustGalleryCache()
    return NextResponse.json({ uploaded })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
