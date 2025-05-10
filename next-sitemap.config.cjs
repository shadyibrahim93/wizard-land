module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wizardland.net',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  buildManifestFile: './build/build-manifest.json',
  exclude: ['/404', '/admin', '/account*', '/auth/**', '/api/**'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/admin', '/account*', '/auth/', '/api/']
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/*.jpg', '/*.png', '/*.webp']
      }
    ],
    additionalSitemaps: [
      `${
        process.env.NEXT_PUBLIC_SITE_URL || 'https://wizardland.net'
      }/sitemap.xml`
    ]
  },

  transform: (config, path) => ({
    loc: path, // URL path
    changefreq: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1.0 : 0.8,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined
  })
};
