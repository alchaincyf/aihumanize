/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // ... 保持其他环境变量不变
  },
  images: {
    domains: ['humanize-ai.top'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  output: 'standalone',
};

module.exports = nextConfig;