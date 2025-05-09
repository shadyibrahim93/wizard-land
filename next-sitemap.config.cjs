module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wizardland.net',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  buildManifestFile: './build/build-manifest.json',
  exclude: ['/server-sitemap.xml', '/404', '/admin', '/account*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/admin', '/account*']
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/*.jpg', '/*.png', '/*.webp']
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL}/server-sitemap.xml`
    ]
  },

  transform: async (config, path) => {
    console.log('Using build manifest at:', './build/build-manifest.json');

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs || []
    };
  }
};
