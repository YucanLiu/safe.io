/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/safe.io',
  assetPrefix: '/safe.io/',
  images: {
    unoptimized: true,  // Required for static export
  },
}

module.exports = nextConfig 