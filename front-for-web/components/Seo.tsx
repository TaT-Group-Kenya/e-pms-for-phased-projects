import Head from 'next/head'
import React from 'react'

export type SeoProps = {
  title?: string
  description?: string
  keywords?: string[]
  url?: string
  ogImage?: string
  author?: string
  robots?: string
}

export default function Seo({
  title,
  description,
  keywords,
  url,
  ogImage,
  author,
  robots,
}: SeoProps) {
  const titleText = title || 'Trezo'
  const desc = description || 'Trezo — project and invoice management'

  return (
    <Head>
      <link rel="icon" href="/favicon.png" />
      <title>{titleText}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={desc} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content={robots || 'index,follow'} />
      {author && <meta name="author" content={author} />}

      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:site_name" content="Trezo" />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={titleText} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Head>
  )
}
