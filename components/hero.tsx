import Image from 'next/image'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-end overflow-hidden pt-16"
    >
      <Image
        src="/hero.png"
        alt="Two footballers battling for the ball on a sunlit pitch"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
          <span className="h-px w-10 bg-primary" aria-hidden="true" />
          Professional Sports Photography
        </p>
        <h1 className="max-w-4xl text-balance text-6xl font-extrabold leading-[0.9] sm:text-8xl lg:text-9xl">
          Harry <span className="text-primary">Visuals</span>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg">
          Match day action, athlete portraits and content that captures the
          intensity of the game. Built for footballers and athletes who want to
          be seen.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-14 gap-2 px-8 text-base font-bold uppercase tracking-wider shadow-[0_0_40px_-8px] shadow-primary hover:bg-primary/85',
            )}
          >
            Book a Shoot
            <ArrowRight className="size-5" />
          </a>
          <a
            href="#portfolio"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-14 px-8 text-base font-bold uppercase tracking-wider hover:border-primary hover:text-primary',
            )}
          >
            View Portfolio
          </a>
        </div>
      </div>

      <a
        href="#portfolio"
        aria-label="Scroll to portfolio"
        className="absolute bottom-6 right-6 hidden size-11 items-center justify-center rounded-full border border-border bg-background/50 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary sm:flex"
      >
        <ArrowDown className="size-5" />
      </a>
    </section>
  )
}
