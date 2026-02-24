/** Minimal Next.js config (keeps defaults) */
const internalImages = process.env.EPMS_API_BASE + '/images/logos/**';
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL(internalImages), new URL('https://cdn-icons-png.freepik.com/256/12225/**')],
  },
}