import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/yonetici/', '/ebeveyn-portali/', '/ogretmen-portali/'],
    },
    sitemap: 'https://turkcocukakademisi.com/sitemap.xml',
  };
}
