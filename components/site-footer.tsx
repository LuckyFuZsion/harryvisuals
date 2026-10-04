import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#top"
            aria-label="Harry Visuals, back to top"
            className="block overflow-hidden rounded-md bg-white outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Image
              src="/harry-visuals-logo.png"
              alt="Harry Visuals logo"
              width={160}
              height={84}
              className="h-auto w-40"
            />
          </a>
          <p>
            &copy; {new Date().getFullYear()} Harry Visuals. All rights
            reserved.
          </p>
        </div>
        <a
          href="#top"
          className="font-semibold uppercase tracking-widest transition-colors hover:text-primary"
        >
          Back to top
        </a>
      </div>
    </footer>
  )
}
