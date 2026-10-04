import Image from 'next/image'

const services = [
  'Match day coverage',
  'Athlete portraits',
  'Social media content',
  'Brand and sponsor shoots',
]

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-16 border-y border-border bg-card py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
            <Image
              src="/harry-behind-lens.png"
              alt="Harry photographing outdoors with a camera"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-lg border border-primary"
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
            About
          </p>
          <h2
            id="about-heading"
            className="text-balance text-5xl font-extrabold leading-none sm:text-7xl"
          >
            Behind the lens
          </h2>
          <p className="speakable-summary mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            I&apos;m Harry, a football photographer based in Lincolnshire,
            passionate about capturing the action, emotion and atmosphere of
            the game for players, clubs and local match days.
          </p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            I currently photograph local football, including Grantham Town,
            while developing my skills and building my portfolio. My goal is
            to work with bigger clubs and continue growing as a sports
            photographer who delivers images ready for socials and club media.
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
            <time dateTime="2026-10-04">Updated 4 Oct 2026</time>
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:border-primary"
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-primary"
                />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
