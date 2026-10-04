import type { MetadataRoute } from 'next'

const SITE = 'https://www.harryvisuals.co.uk'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
