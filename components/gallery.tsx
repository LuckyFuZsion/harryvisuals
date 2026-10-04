import Image from 'next/image'
import { getGalleryItems, type GalleryAspect } from '@/lib/gallery'
import { cn } from '@/lib/utils'

const aspectClass: Record<GalleryAspect, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
}

export async function Gallery() {
  const galleryItems = await getGalleryItems()

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="scroll-mt-16 bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
              Selected Work
            </p>
            <h2
              id="portfolio-heading"
              className="text-5xl font-extrabold leading-none sm:text-7xl"
            >
              The Portfolio
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
            Frozen moments from the touchline, the tunnel and the studio.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <li key={item.src}>
              <figure
                className={cn(
                  'group relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 hover:border-primary',
                  aspectClass[item.aspect],
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={index < 3}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
