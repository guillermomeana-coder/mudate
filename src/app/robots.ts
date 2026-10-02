import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/admin-demo/'],
      },
      // AI crawlers — permitidos para GEO (Generative Engine Optimization)
      { userAgent: 'GPTBot', allow: ['/'] },
      { userAgent: 'OAI-SearchBot', allow: ['/'] },
      { userAgent: 'ChatGPT-User', allow: ['/'] },
      { userAgent: 'CCBot', allow: ['/'] },
      { userAgent: 'anthropic-ai', allow: ['/'] },
      { userAgent: 'ClaudeBot', allow: ['/'] },
      { userAgent: 'PerplexityBot', allow: ['/'] },
      { userAgent: 'Google-Extended', allow: ['/'] },
      { userAgent: 'Omgilibot', allow: ['/'] },
      { userAgent: 'FacebookBot', allow: ['/'] },
      { userAgent: 'Bytespider', allow: ['/'] },
      { userAgent: 'Applebot', allow: ['/'] },
      { userAgent: 'cohere-ai', allow: ['/'] },
    ],
    sitemap: 'https://mudateargentina.com/sitemap.xml',
    host: 'https://mudateargentina.com',
  };
}
