const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

const internalImages = process.env.EPMS_API_BASE + '/images/logos/**';

module.exports = withMDX({
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL(internalImages), new URL('https://cdn-icons-png.freepik.com/256/12225/**')],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});