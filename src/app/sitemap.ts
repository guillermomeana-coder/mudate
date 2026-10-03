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
  { url: '/buenos-aires-capital', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/rosario', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/mendoza', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/bariloche', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/casas-en-venta', priority: 0.9, changeFrequency: 'daily' },
  { url: '/departamentos-en-venta', priority: 0.9, changeFrequency: 'daily' },
  { url: '/terrenos-en-venta', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/salta', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/neuquen', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/mar-del-plata', priority: 0.85, changeFrequency: 'weekly' },
  { url: '/tucuman', priority: 0.85, changeFrequency: 'weekly' },
  // Precio m² pages
  { url: '/villa-maria/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/salta/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/villa-carlos-paz/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/bariloche/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/neuquen/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/mendoza/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/rosario/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/cordoba-capital/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/buenos-aires-capital/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/mar-del-plata/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  { url: '/tucuman/precio-m2', priority: 0.82, changeFrequency: 'monthly' },
  // Legal & utility
  { url: '/tasacion', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/contacto', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/privacidad', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terminos', priority: 0.3, changeFrequency: 'yearly' },
] as const;

// Blog slugs mapped to their real publishedAt dates (avoids serving dynamic `now` to Googlebot)
const blogPosts: { slug: string; date: string }[] = [
  { slug: 'cap-rate-cordoba-2025', date: '2025-09-01' },
  { slug: 'invertir-departamentos-cordoba-vs-caba', date: '2025-08-20' },
  { slug: 'rentabilidad-villa-carlos-paz', date: '2025-08-10' },
  { slug: 'mejores-barrios-nueva-cordoba', date: '2025-07-28' },
  { slug: 'mercado-inmobiliario-villa-maria-2025', date: '2025-09-03' },
  { slug: 'comprar-departamento-villa-maria', date: '2025-08-15' },
  { slug: 'barrios-villa-maria-donde-invertir', date: '2025-08-05' },
  { slug: 'como-comprar-propiedad-argentina-2025', date: '2025-09-05' },
  { slug: 'escritura-inmueble-argentina', date: '2025-08-25' },
  { slug: 'dolar-propiedades-argentina', date: '2025-08-12' },
  { slug: 'hipotecas-creditos-procrear-cordoba', date: '2025-07-20' },
  { slug: 'gastos-compraventa-inmueble-cordoba', date: '2025-07-10' },
  { slug: 'mercado-inmobiliario-buenos-aires-2025', date: '2025-09-15' },
  { slug: 'invertir-bariloche-patagonia-rental-vacacional', date: '2025-09-20' },
  { slug: 'propiedades-mendoza-inversion-vino-andes', date: '2025-09-25' },
  { slug: 'mercado-inmobiliario-rosario-2025', date: '2025-10-01' },
  { slug: 'invertir-salta-noa-turismo-litio', date: '2025-10-08' },
  { slug: 'neuquen-vaca-muerta-propiedades-inversion', date: '2025-10-15' },
  { slug: 'propiedades-mar-del-plata-inversion-vacacional', date: '2025-11-01' },
  { slug: 'invertir-tucuman-argentina-mercado-universitario', date: '2025-11-10' },
  { slug: 'mejor-ciudad-para-invertir-argentina-2025', date: '2025-11-20' },
  { slug: 'como-comprar-propiedad-argentina-extranjeros', date: '2025-12-01' },
  { slug: 'vender-caba-comprar-interior-argentina', date: '2025-12-15' },
  { slug: 'rentabilidad-alquiler-temporal-argentina-2025', date: '2025-12-20' },
  { slug: 'primer-propiedad-argentina-guia-2026', date: '2026-01-05' },
  { slug: 'credito-hipotecario-uve-argentina-2025', date: '2026-02-10' },
  { slug: 'barrios-palermo-norte-cordoba-inversion', date: '2026-02-20' },
  { slug: 'expat-guide-buy-property-argentina-2026', date: '2026-03-01' },
  { slug: 'alquiler-temporario-airbnb-argentina-2026', date: '2026-03-15' },
  { slug: 'impuestos-propiedades-argentina-guia', date: '2026-04-02' },
  { slug: 'mejores-zonas-neuquen-vaca-muerta-2026', date: '2026-04-18' },
  { slug: 'departamento-pozo-cordoba-ventajas', date: '2026-05-05' },
  { slug: 'guia-expat-mudarse-argentina-2026', date: '2026-05-20' },
  { slug: 'mercado-inmobiliario-bariloche-2026', date: '2026-06-10' },
  { slug: 'como-tasar-propiedad-argentina', date: '2026-07-01' },
  { slug: 'invertir-terrenos-argentina-lotes', date: '2026-07-18' },
  { slug: 'fideicomiso-inmobiliario-argentina', date: '2026-08-05' },
  { slug: 'villa-maria-vs-cordoba-capital-inversion', date: '2026-09-01' },
  { slug: 'ciudadania-por-inversion-argentina-golden-visa-2026', date: '2026-10-03' },
  { slug: 'golden-visa-argentina-invertir-propiedades-2026', date: '2026-10-03' },
  { slug: 'pasaporte-argentino-mas-poderoso-latinoamerica-2026', date: '2026-10-03' },
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

  // Use current date for pages that are revalidated via ISR
  const today = new Date().toISOString().split('T')[0];
  const STATIC_LAST_MODIFIED = today;
  const PRECIO_M2_LAST_MODIFIED = today;

  // Static pages — both locales
  const statics: MetadataRoute.Sitemap = [];
  for (const { url, priority, changeFrequency } of staticRoutes) {
    const lastMod = url.includes('/precio-m2') ? PRECIO_M2_LAST_MODIFIED : STATIC_LAST_MODIFIED;
    // ES (default, no prefix)
    statics.push({
      url: `${BASE_URL}${url}`,
      lastModified: lastMod,
      changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
      priority,
      ...withAlternates(url),
    });
    // EN
    statics.push({
      url: `${BASE_URL}/en${url}`,
      lastModified: lastMod,
      changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
      priority: priority * 0.9,
      ...withAlternates(url),
    });
  }

  // Blog — use static publishedAt dates, not dynamic `now`, to keep sitemap stable for Googlebot
  const blogs: MetadataRoute.Sitemap = blogPosts.flatMap(({ slug, date }) =>
    locales.map((loc) => ({
      url: loc === 'es' ? `${BASE_URL}/blog/${slug}` : `${BASE_URL}/en/blog/${slug}`,
      lastModified: date,
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
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...withAlternates(`/provincia/${slug}`),
    }))
  );

  // City pages — only cities without their own top-level hub
  const hubCities = new Set([
    'cordoba-capital', 'buenos-aires-capital', 'rosario', 'mendoza',
    'bariloche', 'salta', 'neuquen', 'villa-carlos-paz', 'villa-maria',
    'mar-del-plata', 'tucuman',
  ]);
  const citySlugs = Object.keys(CITY_SLUG_MAP).filter((s) => !hubCities.has(s));
  const cities: MetadataRoute.Sitemap = citySlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es'
        ? `${BASE_URL}/ciudad/${slug}`
        : `${BASE_URL}/en/ciudad/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
      ...withAlternates(`/ciudad/${slug}`),
    }))
  );

  // Campos by province
  const camposProvinces: MetadataRoute.Sitemap = provinceSlugs.flatMap((slug) =>
    locales.map((loc) => ({
      url: loc === 'es'
        ? `${BASE_URL}/campos/${slug}`
        : `${BASE_URL}/en/campos/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...withAlternates(`/campos/${slug}`),
    }))
  );

  return [...statics, ...blogs, ...propiedades, ...provinces, ...cities, ...camposProvinces];
}
