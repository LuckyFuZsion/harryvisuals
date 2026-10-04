import Image from 'next/image'
import { InstagramIcon, TikTokIcon } from '@/components/social-icons'

const footerLinks = [
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col items-start gap-4">
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
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Football photography by Harry Platts in Lincolnshire - match days,
            portraits and content for players and clubs.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Harry Visuals. All rights
            reserved.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Explore
          </p>
          <ul className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-widest transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Connect
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:Platts_harry@icloud.com"
                className="transition-colors hover:text-primary"
              >
                Platts_harry@icloud.com
              </a>
            </li>
            <li>
              <a
                href="tel:+447710061217"
                className="transition-colors hover:text-primary"
              >
                +44 7710 061217
              </a>
            </li>
          </ul>
          <ul className="mt-5 flex gap-3">
            <li>
              <a
                href="https://www.instagram.com/h.platts12"
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Instagram"
                className="flex size-11 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <InstagramIcon className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@harry.visuals1"
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="TikTok"
                className="flex size-11 items-center justify-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <TikTokIcon className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
