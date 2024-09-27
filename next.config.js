/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // ... 保持其他环境变量不变
  },
  images: {
    domains: ['humanize-ai.top'],
  },
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: true
  },
};

export default nextConfig;