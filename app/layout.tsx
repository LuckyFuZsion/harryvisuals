import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import './globals.css'

const heading = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.harryvisuals.co.uk'),
  title: 'Harry Visuals | Professional Sports Photography',
  description:
    'Premium football and athlete photography by Harry Visuals. Match day action, portraits and content for players, clubs and brands.',
  generator: 'v0.app',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Harry Visuals | Professional Sports Photography',
    description:
      'Premium football and athlete photography by Harry Visuals. Match day action, portraits and content for players, clubs and brands.',
    url: 'https://www.harryvisuals.co.uk',
    siteName: 'Harry Visuals',
    images: [
      {
        url: '/opengraph.jpg',
        width: 2848,
        height: 1504,
        alt: 'Harry Visuals sports photography',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harry Visuals | Professional Sports Photography',
    description:
      'Premium football and athlete photography by Harry Visuals. Match day action, portraits and content for players, clubs and brands.',
    images: ['/opengraph.jpg'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f1013',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      className={`${heading.variable} ${body.variable} dark bg-background`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
