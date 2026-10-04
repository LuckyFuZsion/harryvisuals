import { Mail, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { InstagramIcon, TikTokIcon } from '@/components/social-icons'

const details = [
  {
    icon: Mail,
    label: 'Email',
    value: 'Platts_harry@icloud.com',
    href: 'mailto:Platts_harry@icloud.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+44 7710 061217',
    href: 'tel:+447710061217',
  },
]

const socials = [
  {
    icon: InstagramIcon,
    label: 'Instagram',
    href: 'https://www.instagram.com/h.platts12',
  },
  {
    icon: TikTokIcon,
    label: 'TikTok',
    href: 'https://www.tiktok.com/@harry.visuals1',
  },
]

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 bg-background py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
        <div className="lg:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="text-balance text-5xl font-extrabold leading-none sm:text-7xl"
          >
            Book a shoot
          </h2>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Got a fixture, a campaign or a portrait session in mind? Drop me a
            message and let&apos;s make something that hits.
          </p>

          <ul className="mt-10 flex flex-col gap-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-card text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <a
                    href={href}
                    className="transition-colors hover:text-primary"
                  >
                    {value}
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Follow the work
            </p>
            <ul className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-12 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
