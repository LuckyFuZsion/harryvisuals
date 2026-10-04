import { v2 as cloudinary } from 'cloudinary'

export const GALLERY_FOLDER = 'harry-visuals/gallery'
const ORDER_CONTEXT_KEY = 'gallery_order'

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

export function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

async function fetchGalleryResources(): Promise<CloudinaryResource[]> {
  const cloud = configureCloudinary()
  const result = await cloud.api.resources({
    type: 'upload',
    prefix: `${GALLERY_FOLDER}/`,
    max_results: 100,
    resource_type: 'image',
    context: true,
  })
  return (result.resources ?? []) as CloudinaryResource[]
}

async function writeOrders(publicIds: string[]) {
  const cloud = configureCloudinary()
  await Promise.all(
    publicIds.map((publicId, index) => {
      if (!publicId.startsWith(`${GALLERY_FOLDER}/`)) {
        throw new Error('Invalid gallery asset')
      }
      return cloud.api.update(publicId, {
        context: `${ORDER_CONTEXT_KEY}=${index}`,
      })
    }),
  )
}

/** Ensure every asset has a stable gallery_order; backfill if missing. */
async function withStableOrder(
  resources: CloudinaryResource[],
): Promise<CloudinaryGalleryAsset[]> {
  const dated = [...resources].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  const missing = dated.some((resource) => parseOrder(resource.context) == null)
  if (missing && dated.length > 0) {
    await writeOrders(dated.map((resource) => resource.public_id))
    return dated.map((resource, index) => ({
      publicId: resource.public_id,
      src: toWebpUrl(resource.public_id),
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at,
      order: index,
    }))
  }

  return dated
    .map((resource) => ({
      publicId: resource.public_id,
      src: toWebpUrl(resource.public_id),
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at,
      order: parseOrder(resource.context) ?? 0,
    }))
    .sort((a, b) => a.order - b.order || a.publicId.localeCompare(b.publicId))
}

export async function listGalleryAssets(): Promise<CloudinaryGalleryAsset[]> {
  const resources = await fetchGalleryResources()
  return withStableOrder(resources)
}

export async function uploadGalleryImage(
  buffer: Buffer,
  filename: string,
  order?: number,
) {
  const cloud = configureCloudinary()
  const nextOrder =
    order ??
    (await listGalleryAssets()).length

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
          reject(error ?? new Error('Upload failed'))
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

  const remaining = await listGalleryAssets()
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
