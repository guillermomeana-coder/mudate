import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import { Property } from '@/models/Property';
import { PROVINCE_SLUG_MAP, CITY_SLUG_MAP } from '@/lib/slugify';

const BASE_URL = 'https://mudateargentina.com';

const staticRoutes = [
  { url: '/', priority: 1.0, changeFrequency: 'daily' },
  { url: '/propiedades', priority: 0.9, changeFrequency: 'daily' },
  { url: '/invertir', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/campos', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/cordoba-capital', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/villa-maria', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/villa-carlos-paz', priority: 0.8, changeFrequency: 'weekly' },
] as const;

const blogSlugs = [
  'cap-rate-cordoba-2025',
  'invertir-departamentos-cordoba-vs-caba',
  'retorno-alquiler-villa-carlos-paz',
  'mejores-barrios-nueva-cordoba',
  'mercado-inmobiliario-villa-maria-2025',
  'comprar-departamento-villa-maria',
  'barrios-villa-maria-donde-invertir',
  'como-comprar-propiedad-argentina-2025',
  'escritura-inmueble-argentina',
  'dolar-propiedades-argentina',
  'hipotecas-creditos-procrear-cordoba',
  'gastos-compraventa-inmueble-cordoba',
];

const locales = ['es', 'en'] as const;

function withAlternates(path: string) {
  return {
    alternates: {
      languages: {
        'es': `${BASE_URL}${path}`,
        'en': `${BASE_URL}/en${path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Static pages — both locales
  const statics: MetadataRoute.Sitemap = [];
  for (const { url, priority, changeFrequency } of staticRoutes) {
    // ES (default, no prefix)
    statics.push({
      url: `${BASE_URL}${url}`,
      lastModified: now,
      changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
      priority,
      ...withAlternates(url),
    });
    // EN
    statics.push({
      url: `${BASE_URL}/en${url}`,
      lastModified: now,
      changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
      priority: priority * 0.9,
      ...withAlternates(url),
    });
  }

  // Blog
  const blogs: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es' ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/en/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...withAlternates(`/blog/${slug}`),
    }))
  );

  // Properties from MongoDB
  let propiedades: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const slugs = await Property.find({ published: true })
      .select('slug updatedAt')
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean();

    propiedades = slugs.flatMap((p) =>
      locales.map((loc) => ({
        url: loc === 'es'
          ? `${BASE_URL}/propiedades/${p.slug}`
          : `${BASE_URL}/en/propiedades/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
        ...withAlternates(`/propiedades/${p.slug}`),
      }))
    );
  } catch {
    // fallback — no properties in sitemap
  }

  // Province pages
  const provinceSlugs = Object.keys(PROVINCE_SLUG_MAP);
  const provinces: MetadataRoute.Sitemap = provinceSlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es'
        ? `${BASE_URL}/provincia/${slug}`
        : `${BASE_URL}/en/provincia/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...withAlternates(`/provincia/${slug}`),
    }))
  );

  // City pages
  const citySlugs = Object.keys(CITY_SLUG_MAP);
  const cities: MetadataRoute.Sitemap = citySlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es'
        ? `${BASE_URL}/ciudad/${slug}`
        : `${BASE_URL}/en/ciudad/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
      ...withAlternates(`/ciudad/${slug}`),
    }))
  );

  // Campos by province
  const camposProvinces: MetadataRoute.Sitemap = provinceSlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es'
        ? `${BASE_URL}/campos/${slug}`
        : `${BASE_URL}/en/campos/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...withAlternates(`/campos/${slug}`),
    }))
  );

  return [...statics, ...blogs, ...propiedades, ...provinces, ...cities, ...camposProvinces];
}
