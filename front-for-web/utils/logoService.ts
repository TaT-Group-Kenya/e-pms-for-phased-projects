/**
 * Get the URL for a logo image
 * @param filename - The filename of the logo
 * @returns The relative URL to fetch the logo
 */
export const getLogoUrl = (filename: string | null | undefined): string | null => {
  if (!filename) return null
  return `/api/images/logo?filename=${encodeURIComponent(filename)}`
}

/**
 * Fetch a logo image as a blob
 * @param filename - The filename of the logo
 * @returns Promise resolving to the image blob
 */
export const fetchLogoBlob = async (filename: string): Promise<Blob> => {
  const url = getLogoUrl(filename)
  if (!url) throw new Error('Invalid filename')

  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Failed to fetch logo: ${resp.statusText}`)
  return resp.blob()
}

/**
 * Get a logo as a data URL (useful for thumbnails or preview)
 * @param filename - The filename of the logo
 * @returns Promise resolving to a data URL string
 */
export const getLogoDataUrl = async (filename: string): Promise<string> => {
  const blob = await fetchLogoBlob(filename)
  return URL.createObjectURL(blob)
}
