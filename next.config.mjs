/** @type {import('next').NextConfig} */

const customDomain = 'wizardland.net'; // 🚨 Replace with your actual domain

const nextConfig = {
  images: {
    formats: ['image/webp'],
    unoptimized: true // Disables the built-in Image Optimization API
  },
  output: 'export',
  distDir: 'build',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    // Emit .webp files into .next/static/media with a content hash
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
