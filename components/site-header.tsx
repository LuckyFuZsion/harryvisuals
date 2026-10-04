'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          aria-label="Harry Visuals, back to top"
          className="group flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span
            role="img"
            aria-label="Harry Visuals HV monogram"
            className="block h-10 w-16 shrink-0 rounded-md bg-white bg-no-repeat ring-2 ring-primary/70 transition group-hover:ring-primary"
            style={{
              backgroundImage: 'url(/harry-visuals-logo.png)',
              backgroundSize: '112px auto',
              backgroundPosition: '-25px -3.5px',
            }}
          />
          <span className="sr-only sm:not-sr-only sm:font-display sm:text-lg sm:font-bold sm:uppercase sm:tracking-wide">
            Harry Visuals
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100 focus-visible:text-foreground focus-visible:outline-none focus-visible:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-10 px-5 text-sm font-bold uppercase tracking-wider hover:bg-primary/85',
            )}
          >
            Book a Shoot
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-4 font-display text-2xl font-bold uppercase tracking-wide transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 w-full text-sm font-bold uppercase tracking-wider',
                )}
              >
                Book a Shoot
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
