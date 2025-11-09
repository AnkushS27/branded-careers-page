/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Suppress middleware deprecation warning until stable migration path is available
    middlewareWarnings: false,
  },
}

export default nextConfig
