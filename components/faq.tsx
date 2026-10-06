'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqItems } from '@/lib/site-content'
import { cn } from '@/lib/utils'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-16 bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="text-balance text-5xl font-extrabold leading-none sm:text-6xl"
        >
          Common questions
        </h2>
        <p className="speakable-summary mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Harry Visuals is Lincolnshire-based football photography for match
          days, portraits and club content. Fees are negotiable, travel may
          apply further afield, and every booking starts with a clear quote.
        </p>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {faqItems.map((item, index) => {
            const open = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`

            return (
              <li key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-bold tracking-wide transition-colors hover:text-primary"
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.question}
                    <ChevronDown
                      className={cn(
                        'size-5 shrink-0 transition-transform duration-300',
                        open && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="faq-answer pb-5 text-pretty leading-relaxed text-muted-foreground"
                >
                  {item.answer}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
