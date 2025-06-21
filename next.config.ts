/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Turn off ESLint during build for now
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig