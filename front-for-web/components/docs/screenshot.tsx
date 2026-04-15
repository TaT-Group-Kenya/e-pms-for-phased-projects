import Image from 'next/image'

interface ScreenshotProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export default function Screenshot({ 
  src, 
  alt, 
  caption, 
  width = 800, 
  height = 450 
}: ScreenshotProps) {
  // Handle different path formats
  const getImagePath = (imageSrc: string): string => {
    // If already starts with /screenshots or /images, use as is
    if (imageSrc.startsWith('/screenshots') || imageSrc.startsWith('/images')) {
      return imageSrc
    }
    // If it has spaces or special chars, encode URI
    const encodedSrc = encodeURIComponent(imageSrc)
    return `/screenshots/${encodedSrc}`
  }

  return (
    <div className="my-8">
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
        <Image
          src={getImagePath(src)}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-500 text-center mt-2">{caption}</p>
      )}
    </div>
  )
}