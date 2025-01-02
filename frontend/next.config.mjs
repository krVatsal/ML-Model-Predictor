/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      
      {
        source: '/auth/:path*',
        destination: 'http://localhost:5217/:path*',
      },

    ]
  },
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages:["mongoose"],
    }
  }
  
  export default nextConfig;