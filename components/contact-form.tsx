'use client'

import { useEffect, useId, useState } from 'react'
import { CheckCircle2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fieldClass =
  'w-full rounded-md border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/30'

const labelClass =
  'mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground'

export function ContactForm() {
  const titleId = useId()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    if (!successOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSuccessOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [successOpen])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    // Clear any autofilled honeypot values before checking
    const hpOne = String(formData.get('hv_hp_one') ?? '')
    const hpTwo = String(formData.get('hv_hp_two') ?? '')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          shoot: formData.get('shoot'),
          message: formData.get('message'),
          hv_hp_one: hpOne,
          hv_hp_two: hpTwo,
        }),
      })

      const data = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        setError(data?.error ?? 'Could not send your message. Please try again.')
        return
      }

      form.reset()
      setSuccessOpen(true)
    } catch {
      setError('Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <form
        className="relative flex flex-col gap-5 rounded-lg border border-border bg-card p-6 sm:p-8"
        onSubmit={onSubmit}
      >
        {/* Honeypot fields - obscure names avoid browser autofill */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="hv_hp_one">Leave blank</label>
          <input
            id="hv_hp_one"
            name="hv_hp_one"
            type="text"
            tabIndex={-1}
            autoComplete="new-password"
            defaultValue=""
          />
          <label htmlFor="hv_hp_two">Leave blank</label>
          <input
            id="hv_hp_two"
            name="hv_hp_two"
            type="text"
            tabIndex={-1}
            autoComplete="new-password"
            defaultValue=""
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="shoot" className={labelClass}>
            Shoot type
          </label>
          <select
            id="shoot"
            name="shoot"
            defaultValue="match-day"
            className={fieldClass}
          >
            <option value="match-day">Match day coverage</option>
            <option value="portrait">Athlete portraits</option>
            <option value="content">Social media content</option>
            <option value="brand">Brand or sponsor shoot</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell me about the shoot, date and location"
            className={`${fieldClass} resize-y`}
          />
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          size="lg"
          disabled={sending}
          className="h-14 gap-2 text-base font-bold uppercase tracking-wider hover:bg-primary/85"
        >
          {sending ? 'Sending…' : 'Send message'}
          <Send className="size-4" />
        </Button>
      </form>

      {successOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md rounded-lg border border-primary bg-card p-8 text-center shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSuccessOpen(false)}
              className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h3 id={titleId} className="mt-4 text-3xl font-bold">
              Message sent
            </h3>
            <p className="mt-3 text-pretty text-muted-foreground">
              Thanks for getting in touch. Harry will reply as soon as possible.
            </p>
            <Button
              type="button"
              className="mt-6 h-12 w-full font-bold uppercase tracking-wider"
              onClick={() => setSuccessOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
