'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Login failed')
        return
      }

      window.location.reload()
    } catch {
      setError('Could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-card p-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">
          Admin
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage portfolio photos.
        </p>
      </div>
      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-primary/30"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={loading}
        className="h-11 font-bold uppercase tracking-wider"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <a
        href="/"
        className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to site
      </a>
    </form>
  )
}
