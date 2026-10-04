import { unstable_noStore as noStore } from 'next/cache'
import { isCloudinaryConfigured, listGalleryAssets } from '@/lib/cloudinary'

export type GalleryAspect = 'portrait' | 'landscape' | 'square'

export type GalleryItem = {
  src: string
  alt: string
  title: string
  category: string
  aspect: GalleryAspect
}

function aspectFromDims(width?: number, height?: number): GalleryAspect {
  if (!width || !height) return 'portrait'
  const ratio = width / height
  if (ratio < 0.85) return 'portrait'
  if (ratio > 1.15) return 'landscape'
  return 'square'
}

/**
 * Local fallback used when Cloudinary is empty / not configured.
 * Once Harry uploads via /admin, Cloudinary assets take over.
 */
export const localGalleryItems: GalleryItem[] = [
  {
    src: '/gallery/toWEBP%20(5)/1.webp',
    alt: 'Portfolio photograph 1',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/2.webp',
    alt: 'Portfolio photograph 2',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/3.webp',
    alt: 'Portfolio photograph 3',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/4.webp',
    alt: 'Portfolio photograph 4',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/5.webp',
    alt: 'Portfolio photograph 5',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/7.webp',
    alt: 'Portfolio photograph 7',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/8.webp',
    alt: 'Portfolio photograph 8',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/9.webp',
    alt: 'Portfolio photograph 9',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/10.webp',
    alt: 'Portfolio photograph 10',
    title: '',
    category: '',
    aspect: 'portrait',
  },
  {
    src: '/gallery/toWEBP%20(5)/11.webp',
    alt: 'Portfolio photograph 11',
    title: '',
    category: '',
    aspect: 'portrait',
  },
]

/** Prefer Cloudinary gallery; fall back to local shots. */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  noStore()

  if (!isCloudinaryConfigured()) return localGalleryItems

  try {
    const assets = await listGalleryAssets()
    if (assets.length === 0) return localGalleryItems

    return assets.map((asset, index) => ({
      src: asset.src,
      alt: `Portfolio photograph ${index + 1}`,
      title: '',
      category: '',
      aspect: aspectFromDims(asset.width, asset.height),
    }))
  } catch (error) {
    console.error(
      '[gallery] Cloudinary fetch failed, using local fallback',
      error,
    )
    return localGalleryItems
  }
}

/** @deprecated Use getGalleryItems() - kept for any static imports. */
export const galleryItems = localGalleryItems
