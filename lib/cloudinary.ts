import { revalidateTag, unstable_cache } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'

export const GALLERY_FOLDER = 'harry-visuals/gallery'
export const GALLERY_CACHE_TAG = 'gallery'
const ORDER_CONTEXT_KEY = 'gallery_order'

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  )
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!.trim(),
    api_key: process.env.CLOUDINARY_API_KEY!.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET!.trim(),
    secure: true,
  })

  return cloudinary
}

/** Force WebP delivery with sensible quality + responsive width. */
export function toWebpUrl(
  publicId: string,
  options?: { width?: number },
): string {
  const cloud = configureCloudinary()
  return cloud.url(publicId, {
    secure: true,
    fetch_format: 'webp',
    quality: 'auto',
    width: options?.width ?? 1200,
    crop: 'limit',
  })
}

function parseOrder(context: unknown): number | null {
  if (!context || typeof context !== 'object') return null
  const custom = (context as { custom?: Record<string, string> }).custom
  const raw = custom?.[ORDER_CONTEXT_KEY]
  if (raw == null || raw === '') return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export type CloudinaryGalleryAsset = {
  publicId: string
  src: string
  width: number
  height: number
  createdAt: string
  order: number
}

type CloudinaryResource = {
  public_id: string
  width: number
  height: number
  created_at: string
  context?: unknown
}

function cloudinaryErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') return 'Cloudinary request failed'
  const withNested = error as {
    message?: string
    error?: { message?: string; http_code?: number }
  }
  return (
    withNested.error?.message ||
    withNested.message ||
    'Cloudinary request failed'
  )
}

async function fetchGalleryResources(): Promise<CloudinaryResource[]> {
  const cloud = configureCloudinary()
  try {
    const result = await cloud.api.resources({
      type: 'upload',
      prefix: `${GALLERY_FOLDER}/`,
      max_results: 100,
      resource_type: 'image',
      context: true,
    })
    return (result.resources ?? []) as CloudinaryResource[]
  } catch (error) {
    throw new Error(cloudinaryErrorMessage(error))
  }
}

async function writeOrders(publicIds: string[]) {
  const cloud = configureCloudinary()
  // Sequential updates avoid bursting the free-tier Admin API limit.
  for (const [index, publicId] of publicIds.entries()) {
    if (!publicId.startsWith(`${GALLERY_FOLDER}/`)) {
      throw new Error('Invalid gallery asset')
    }
    await cloud.api.update(publicId, {
      context: `${ORDER_CONTEXT_KEY}=${index}`,
    })
  }
}

/** Sort for display without writing back to Cloudinary on every page view. */
function toSortedAssets(
  resources: CloudinaryResource[],
): CloudinaryGalleryAsset[] {
  const mapped = resources.map((resource) => ({
    publicId: resource.public_id,
    src: toWebpUrl(resource.public_id),
    width: resource.width,
    height: resource.height,
    createdAt: resource.created_at,
    order:
      parseOrder(resource.context) ??
      new Date(resource.created_at).getTime(),
  }))

  return mapped.sort(
    (a, b) => a.order - b.order || a.publicId.localeCompare(b.publicId),
  )
}

async function listGalleryAssetsUncached(): Promise<CloudinaryGalleryAsset[]> {
  const resources = await fetchGalleryResources()
  return toSortedAssets(resources)
}

/** Fresh Admin API read for uploads / admin UI. */
export async function listGalleryAssetsFresh() {
  return listGalleryAssetsUncached()
}

/** Cached Admin API read - protects free-tier rate limits. */
export const listGalleryAssets = unstable_cache(
  listGalleryAssetsUncached,
  ['cloudinary-gallery-assets'],
  { revalidate: 120, tags: [GALLERY_CACHE_TAG] },
)

export function bustGalleryCache() {
  revalidateTag(GALLERY_CACHE_TAG, 'max')
}

export async function uploadGalleryImage(
  buffer: Buffer,
  filename: string,
  order?: number,
) {
  const cloud = configureCloudinary()
  const nextOrder =
    order ?? (await listGalleryAssetsUncached()).length

  return new Promise<{
    public_id: string
    width: number
    height: number
    secure_url: string
    order: number
  }>((resolve, reject) => {
    const stream = cloud.uploader.upload_stream(
      {
        folder: GALLERY_FOLDER,
        resource_type: 'image',
        format: 'webp',
        overwrite: false,
        use_filename: true,
        unique_filename: true,
        filename_override: filename.replace(/\.[^.]+$/, ''),
        context: `${ORDER_CONTEXT_KEY}=${nextOrder}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new Error(
              cloudinaryErrorMessage(error) || 'Upload failed',
            ),
          )
          return
        }
        resolve({
          public_id: result.public_id,
          width: result.width ?? 0,
          height: result.height ?? 0,
          secure_url: toWebpUrl(result.public_id),
          order: nextOrder,
        })
      },
    )
    stream.end(buffer)
  })
}

export async function deleteGalleryImage(publicId: string) {
  const cloud = configureCloudinary()

  if (!publicId.startsWith(`${GALLERY_FOLDER}/`)) {
    throw new Error('Invalid gallery asset')
  }

  await cloud.uploader.destroy(publicId, { resource_type: 'image' })

  const remaining = await listGalleryAssetsUncached()
  if (remaining.length > 0) {
    await writeOrders(remaining.map((asset) => asset.publicId))
  }
}

export async function reorderGalleryImages(publicIds: string[]) {
  if (publicIds.length === 0) return
  for (const publicId of publicIds) {
    if (!publicId.startsWith(`${GALLERY_FOLDER}/`)) {
      throw new Error('Invalid gallery asset')
    }
  }
  await writeOrders(publicIds)
}
