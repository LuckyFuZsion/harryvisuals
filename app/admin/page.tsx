import { AdminDashboard } from '@/components/admin-dashboard'
import { AdminLoginForm } from '@/components/admin-login-form'
import { isAdminConfigured } from '@/lib/admin-auth'
import { isAdminAuthenticated } from '@/lib/admin-session'
import {
  isCloudinaryConfigured,
  listGalleryAssetsFresh,
} from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const configured = isAdminConfigured()
  const authenticated = configured && (await isAdminAuthenticated())

  if (!configured) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
        <div className="max-w-md rounded-lg border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
          <h1 className="mb-2 text-2xl font-extrabold uppercase tracking-wide text-foreground">
            Admin not configured
          </h1>
          Set <code className="font-mono text-foreground">ADMIN_PASSWORD</code>{' '}
          in <code className="font-mono text-foreground">.env.local</code> and
          restart the server.
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-4 py-16">
        <AdminLoginForm />
      </main>
    )
  }

  const cloudinaryReady = isCloudinaryConfigured()
  let assets: Awaited<ReturnType<typeof listGalleryAssetsFresh>> = []

  if (cloudinaryReady) {
    try {
      assets = await listGalleryAssetsFresh()
    } catch {
      assets = []
    }
  }

  return (
    <main className="min-h-svh bg-background px-4 py-12 sm:px-6 lg:px-8">
      <AdminDashboard assets={assets} cloudinaryReady={cloudinaryReady} />
    </main>
  )
}
