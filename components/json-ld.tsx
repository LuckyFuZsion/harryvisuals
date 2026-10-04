import {
  faqItems,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/site-content'

export function JsonLd() {
  const published = '2026-10-04'
  const modified = new Date().toISOString().slice(0, 10)

  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#harry`,
    name: 'Harry Platts',
    alternateName: 'Harry Visuals',
    url: SITE_URL,
    image: `${SITE_URL}/harry-behind-lens.png`,
    jobTitle: 'Football Photographer',
    description:
      'Football photographer based in Lincolnshire, capturing match-day action, athlete portraits and sports content.',
    email: 'mailto:Platts_harry@icloud.com',
    telephone: '+447710061217',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Lincolnshire',
      addressCountry: 'GB',
    },
    sameAs: [
      'https://www.instagram.com/h.platts12',
      'https://www.tiktok.com/@harry.visuals1',
    ],
    worksFor: { '@id': `${SITE_URL}/#organization` },
  }

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Harry Visuals',
    url: SITE_URL,
    logo: `${SITE_URL}/harry-visuals-logo.png`,
    image: `${SITE_URL}/opengraph.jpg`,
    email: 'Platts_harry@icloud.com',
    telephone: '+447710061217',
    foundingDate: '2024',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Lincolnshire, United Kingdom',
    },
    sameAs: [
      'https://www.instagram.com/h.platts12',
      'https://www.tiktok.com/@harry.visuals1',
    ],
    founder: { '@id': `${SITE_URL}/#harry` },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'Platts_harry@icloud.com',
      telephone: '+447710061217',
      areaServed: 'GB',
      availableLanguage: ['English'],
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Harry Visuals',
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-GB',
    datePublished: published,
    dateModified: modified,
  }

  const webpage = {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SITE_TITLE,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#harry` },
    primaryImageOfPage: `${SITE_URL}/opengraph.jpg`,
    description: SITE_DESCRIPTION,
    datePublished: published,
    dateModified: modified,
    inLanguage: 'en-GB',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.speakable-summary', '#faq .faq-answer'],
    },
  }

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq-schema`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [person, organization, website, webpage, faqPage],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
