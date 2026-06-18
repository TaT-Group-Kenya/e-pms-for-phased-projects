const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

// Use environment variables directly - Next.js auto-loads .env.local at build time
const backendImages = process.env.NEXT_PUBLIC_EPMS_API_BASE || 'https://127.0.0.1:3001/images/logos/';
const internalImages = process.env.EPMS_API_BASE + '/images/logos/**';

module.exports = withMDX({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      new URL(backendImages),
      new URL(internalImages),
      new URL('https://cdn-icons-png.freepik.com/256/12225/**'),
    ],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
