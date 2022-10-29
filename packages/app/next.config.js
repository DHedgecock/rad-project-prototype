/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/projects',
        destination: 'http://localhost:9001/api/v1/projects',
      },
      {
        source: '/api/v1/user',
        destination: 'http://localhost:9000/api/v1/user',
      },
    ]
  },
}

module.exports = nextConfig
