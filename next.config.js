/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chakra-ui/react', '@chakra-ui/core'],
  swcMinify: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = false
    }
    // Add a rule to handle the syntax used in undici
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });

    return config
  },
}

module.exports = nextConfig