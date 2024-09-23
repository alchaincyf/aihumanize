/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/core'],
  swcMinify: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = false
    }
    return config
  },
}

module.exports = nextConfig