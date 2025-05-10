/** @type {import('next').NextConfig} */

const customDomain = 'wizardland.net';

const nextConfig = {
  images: {
    formats: ['image/webp'],
    unoptimized: true
  },
  output: 'export',
  distDir: 'build',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.webp$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_SITE_URL: `https://${customDomain}`
  }
};

export default nextConfig;
