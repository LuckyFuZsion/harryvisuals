import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Gallery } from '@/components/gallery'
import { Hero } from '@/components/hero'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
