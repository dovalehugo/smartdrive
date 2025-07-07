/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Railway specific configurations
  output: 'standalone',
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

