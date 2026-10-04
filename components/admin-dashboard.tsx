'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  LogOut,
  Trash2,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Asset = {
  publicId: string
  src: string
  width: number
  height: number
  createdAt: string
  order: number
}

export function AdminDashboard({
  assets: initialAssets,
  cloudinaryReady,
}: {
  assets: Asset[]
  cloudinaryReady: boolean
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [assets, setAssets] = useState(initialAssets)
  const [uploading, setUploading] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  async function persistOrder(next: Asset[]) {
    setSavingOrder(true)
    setError('')
    try {
      const response = await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicIds: next.map((asset) => asset.publicId),
        }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Could not save order')
        router.refresh()
        return false
      }
      setAssets(next.map((asset, index) => ({ ...asset, order: index })))
      router.refresh()
      return true
    } catch {
      setError('Could not save order')
      return false
    } finally {
      setSavingOrder(false)
    }
  }

  async function moveAsset(publicId: string, toIndex: number) {
    const fromIndex = assets.findIndex((asset) => asset.publicId === publicId)
    if (fromIndex < 0 || toIndex < 0 || toIndex >= assets.length) return
    if (fromIndex === toIndex) return

    const next = [...assets]
    const [item] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, item)

    setBusyId(publicId)
    setAssets(next.map((asset, index) => ({ ...asset, order: index })))
    await persistOrder(next)
    setBusyId(null)
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = (await response.json().catch(() => null)) as {
        error?: string
        uploaded?: Array<{
          public_id: string
          width: number
          height: number
          secure_url: string
          order: number
        }>
      } | null

      if (!response.ok) {
        setError(data?.error ?? 'Upload failed')
        return
      }

      const uploaded = data?.uploaded ?? []
      setAssets((current) => [
        ...current,
        ...uploaded.map((item) => ({
          publicId: item.public_id,
          src: item.secure_url,
          width: item.width,
          height: item.height,
          createdAt: new Date().toISOString(),
          order: item.order,
        })),
      ])
      setMessage(
        `Uploaded ${uploaded.length} photo${uploaded.length === 1 ? '' : 's'} as WebP.`,
      )
      router.refresh()
    } catch {
      setError('Could not upload photos')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function onDelete(publicId: string) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setBusyId(publicId)
    setError('')

    try {
      const response = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Delete failed')
        return
      }

      setAssets((current) =>
        current
          .filter((asset) => asset.publicId !== publicId)
          .map((asset, index) => ({ ...asset, order: index })),
      )
      setMessage('Photo deleted')
      router.refresh()
    } catch {
      setError('Could not delete photo')
    } finally {
      setBusyId(null)
    }
  }

  const locked = uploading || savingOrder || busyId !== null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-16">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            Portfolio admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload, reorder and delete photos. Changes show on the site.
          </p>
          <p className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            Cloudinary account:{' '}
            <a
              href="https://console.cloudinary.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              harryvisuals@webfuzsion.co.uk
            </a>
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <a
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold transition-colors hover:border-primary hover:text-primary sm:h-10 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </a>
          <Button
            type="button"
            variant="outline"
            onClick={logout}
            className="h-12 w-full gap-2 sm:h-10 sm:w-auto"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </header>

      {!cloudinaryReady ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          Cloudinary env vars are missing. Add them to{' '}
          <code className="font-mono">.env.local</code>, then restart the
          server.
        </div>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wide">
              Upload
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              New photos are added to the end of the gallery as WebP.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => onUpload(event.target.files)}
          />
          <Button
            type="button"
            disabled={!cloudinaryReady || locked}
            onClick={() => inputRef.current?.click()}
            className="h-14 w-full gap-2 text-base font-bold uppercase tracking-wider"
          >
            <Upload className="size-5" />
            {uploading ? 'Uploading…' : 'Choose photos'}
          </Button>
        </div>
        {message ? (
          <p className="mt-4 text-sm text-primary" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {savingOrder ? (
          <p className="mt-4 text-sm text-muted-foreground" role="status">
            Saving order…
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold uppercase tracking-wide">
          Gallery ({assets.length})
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Use the arrows to reorder. Top of this list = first on the site.
        </p>
        {assets.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No photos yet. Upload above to populate the portfolio.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {assets.map((asset, index) => {
              const isBusy = busyId === asset.publicId
              return (
                <li
                  key={asset.publicId}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="flex gap-3 p-3">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md bg-muted sm:h-32 sm:w-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded bg-background/90 px-1.5 py-0.5 text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={locked || index === 0}
                          onClick={() => moveAsset(asset.publicId, 0)}
                          className="h-12"
                          aria-label="Move to top"
                        >
                          <ChevronsUp className="size-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={locked || index === 0}
                          onClick={() => moveAsset(asset.publicId, index - 1)}
                          className="h-12"
                          aria-label="Move up"
                        >
                          <ArrowUp className="size-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={locked || index === assets.length - 1}
                          onClick={() => moveAsset(asset.publicId, index + 1)}
                          className="h-12"
                          aria-label="Move down"
                        >
                          <ArrowDown className="size-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={locked || index === assets.length - 1}
                          onClick={() =>
                            moveAsset(asset.publicId, assets.length - 1)
                          }
                          className="h-12"
                          aria-label="Move to bottom"
                        >
                          <ChevronsDown className="size-5" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        disabled={locked}
                        onClick={() => onDelete(asset.publicId)}
                        className="h-12 w-full gap-2 text-base font-semibold"
                      >
                        <Trash2 className="size-4" />
                        {isBusy ? 'Working…' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
