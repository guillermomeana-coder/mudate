import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  cluster: 'A' | 'B' | 'C';
  ciudad?: string;
  readTime: number;
  publishedAt: string;
  coverImage: string;
  tags: string[];
}

const posts: BlogPost[] = [
  // Cluster A — Inversión / Investment
  {
    slug: 'cap-rate-cordoba-2025',
    title: {
      es: 'Cap Rate en Córdoba 2025: análisis por barrio y ciudad',
      en: 'Cap Rate in Córdoba 2025: Analysis by Neighborhood and City',
    },
    excerpt: {
      es: 'Calculamos el retorno real en dólares para los principales barrios de Córdoba. Nueva Córdoba, General Paz, Villa María y más.',
      en: 'We calculated the real dollar returns for the main neighborhoods in Córdoba. Nueva Córdoba, General Paz, Villa María and more.',
    },
    cluster: 'A',
    readTime: 7,
    publishedAt: '2025-09-01',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    tags: ['inversión', 'cap rate', 'análisis'],
  },
  {
    slug: 'invertir-departamentos-cordoba-vs-caba',
    title: {
      es: 'Invertir en departamentos: Córdoba vs CABA — quién gana en 2025',
      en: 'Investing in Apartments: Córdoba vs Buenos Aires — Who Wins in 2025',
    },
    excerpt: {
      es: 'Comparamos precio del m², rentabilidades y perspectivas de valorización entre Córdoba Capital y Buenos Aires. Los números hablan.',
      en: 'We compare price per m², rental yields and appreciation prospects between Córdoba and Buenos Aires. The numbers speak for themselves.',
    },
    cluster: 'A',
    readTime: 9,
    publishedAt: '2025-08-20',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    tags: ['inversión', 'comparativa', 'CABA'],
  },
  {
    slug: 'retorno-alquiler-villa-carlos-paz',
    title: {
      es: 'Alquiler vacacional en Villa Carlos Paz: ¿cuánto se puede ganar?',
      en: 'Vacation Rental in Villa Carlos Paz: How Much Can You Earn?',
    },
    excerpt: {
      es: 'Con 3 millones de turistas por año y precios aún accesibles, Villa Carlos Paz ofrece cap rates de 7-8% USD para quien sabe dónde comprar.',
      en: 'With 3 million tourists per year and still accessible prices, Villa Carlos Paz offers 7-8% USD cap rates for those who know where to buy.',
    },
    cluster: 'A',
    readTime: 6,
    publishedAt: '2025-08-10',
    coverImage: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80',
    tags: ['inversión', 'turismo', 'Villa Carlos Paz'],
  },
  {
    slug: 'mejores-barrios-nueva-cordoba',
    title: {
      es: 'Los mejores barrios para invertir en Córdoba Capital en 2025',
      en: 'Best Neighborhoods to Invest in Córdoba Capital in 2025',
    },
    excerpt: {
      es: 'Nueva Córdoba, Güemes, General Paz, Palermo Norte: analizamos cada zona con datos reales de precio, demanda y rentabilidad.',
      en: 'Nueva Córdoba, Güemes, General Paz, Palermo Norte: we analyze each area with real price, demand and return data.',
    },
    cluster: 'A',
    readTime: 8,
    publishedAt: '2025-07-28',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    tags: ['inversión', 'barrios', 'Córdoba Capital'],
  },
  // Cluster B — Villa María
  {
    slug: 'mercado-inmobiliario-villa-maria-2025',
    title: {
      es: 'Mercado inmobiliario Villa María 2025: precios, tendencias y oportunidades',
      en: 'Villa María Real Estate Market 2025: Prices, Trends and Opportunities',
    },
    excerpt: {
      es: 'Villa María consolida su posición como el mejor mercado alternativo a Córdoba Capital. Departamento promedio USD 90.721 y cap rates sobre el 6%.',
      en: 'Villa María consolidates its position as the best alternative market to Córdoba Capital. Average apartment at USD 90,721 with cap rates above 6%.',
    },
    cluster: 'B',
    ciudad: 'Villa María',
    readTime: 7,
    publishedAt: '2025-09-03',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    tags: ['Villa María', 'mercado', '2025'],
  },
  {
    slug: 'comprar-departamento-villa-maria',
    title: {
      es: 'Cómo comprar un departamento en Villa María: guía paso a paso',
      en: 'How to Buy an Apartment in Villa María: Step-by-Step Guide',
    },
    excerpt: {
      es: 'Desde la búsqueda hasta la escritura. Todo lo que tenés que saber para comprar tu primer departamento en Villa María con seguridad.',
      en: 'From search to title deed. Everything you need to know to safely buy your first apartment in Villa María.',
    },
    cluster: 'B',
    ciudad: 'Villa María',
    readTime: 10,
    publishedAt: '2025-08-15',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    tags: ['Villa María', 'comprar', 'guía'],
  },
  {
    slug: 'barrios-villa-maria-donde-invertir',
    title: {
      es: 'Barrios de Villa María: ¿dónde conviene invertir según tu perfil?',
      en: 'Neighborhoods in Villa María: Where to Invest Based on Your Profile?',
    },
    excerpt: {
      es: 'Centro vs Barrio Nuevo vs Palermo vs Residencial Norte. Cada zona tiene su perfil de riesgo y retorno. Te ayudamos a elegir.',
      en: 'Centro vs Barrio Nuevo vs Palermo vs Residencial Norte. Each area has its own risk and return profile. We help you choose.',
    },
    cluster: 'B',
    ciudad: 'Villa María',
    readTime: 6,
    publishedAt: '2025-08-05',
    coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    tags: ['Villa María', 'barrios', 'inversión'],
  },
  // Cluster C — Comprar en Argentina / Buying in Argentina
  {
    slug: 'como-comprar-propiedad-argentina-2025',
    title: {
      es: 'Cómo comprar una propiedad en Argentina siendo extranjero en 2025',
      en: 'How to Buy Property in Argentina as a Foreigner in 2025',
    },
    excerpt: {
      es: 'CUIT/CUIL para extranjeros, escritura en dólares, blanqueo de capitales. La guía completa para no residentes que quieren invertir en el mercado argentino.',
      en: 'CUIT/CUIL for foreigners, title deeds in dollars, capital repatriation. The complete guide for non-residents looking to invest in the Argentine market.',
    },
    cluster: 'C',
    readTime: 12,
    publishedAt: '2025-09-05',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    tags: ['extranjeros', 'comprar', 'legal'],
  },
  {
    slug: 'escritura-inmueble-argentina',
    title: {
      es: 'Escritura de inmuebles en Argentina: todo lo que necesitás saber',
      en: 'Property Title Deeds in Argentina: Everything You Need to Know',
    },
    excerpt: {
      es: 'Gastos de escritura, impuestos, sellados, honorarios notariales. Qué paga el comprador y qué paga el vendedor según la provincia de Córdoba.',
      en: 'Title deed costs, taxes, stamp duties, notarial fees. What the buyer pays and what the seller pays in Córdoba province.',
    },
    cluster: 'C',
    readTime: 8,
    publishedAt: '2025-08-25',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    tags: ['escritura', 'legal', 'impuestos'],
  },
  {
    slug: 'dolar-propiedades-argentina',
    title: {
      es: 'Propiedades en dólares en Argentina: ¿cómo funciona la operación?',
      en: 'Dollar-Denominated Properties in Argentina: How Do Transactions Work?',
    },
    excerpt: {
      es: 'El mercado inmobiliario argentino opera mayoritariamente en USD. Explicamos cómo se manejan los pagos, el blanqueo y la seguridad jurídica.',
      en: 'The Argentine real estate market operates mostly in USD. We explain how payments work, capital laundering regulations and legal security.',
    },
    cluster: 'C',
    readTime: 7,
    publishedAt: '2025-08-12',
    coverImage: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=800&q=80',
    tags: ['dólares', 'pago', 'legal'],
  },
  {
    slug: 'hipotecas-creditos-procrear-cordoba',
    title: {
      es: 'Créditos hipotecarios en Córdoba 2025: Procrear y bancarios',
      en: 'Mortgage Loans in Córdoba 2025: Procrear and Bank Options',
    },
    excerpt: {
      es: 'Con la vuelta del crédito hipotecario a Argentina, analizamos las opciones disponibles para comprar tu propiedad en Córdoba con financiación.',
      en: 'With the return of mortgage lending to Argentina, we analyze the available options for buying your property in Córdoba with financing.',
    },
    cluster: 'C',
    readTime: 9,
    publishedAt: '2025-07-20',
    coverImage: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&q=80',
    tags: ['crédito', 'hipoteca', 'financiación'],
  },
  {
    slug: 'gastos-compraventa-inmueble-cordoba',
    title: {
      es: 'Gastos de compraventa en Córdoba: la guía completa 2025',
      en: 'Property Transaction Costs in Córdoba: The Complete 2025 Guide',
    },
    excerpt: {
      es: 'Comisiones inmobiliarias, ITI, gastos de escritura, sellados provinciales. Calculá exactamente cuánto vas a pagar además del precio de la propiedad.',
      en: 'Real estate commissions, ITI tax, title deed costs, provincial stamp duties. Calculate exactly how much you\'ll pay on top of the property price.',
    },
    cluster: 'C',
    readTime: 8,
    publishedAt: '2025-07-10',
    coverImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
    tags: ['gastos', 'impuestos', 'compraventa'],
  },
];

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'en') {
    return {
      title: 'Real Estate Blog Argentina — Guides for Buying, Selling and Investing',
      description: 'Guides, analysis and market insights for Argentine real estate. Cap rates, neighborhood prices, how to buy property in Argentina and more.',
    };
  }
  return {
    title: 'Blog Inmobiliario Córdoba — Guías para Comprar, Vender e Invertir',
    description: 'Guías, análisis y consejos del mercado inmobiliario de Córdoba Argentina. Cap rates, precios por barrio, cómo comprar un departamento en Argentina y más.',
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const featured = posts[0];
  const rest = posts.slice(1);

  const clusterLabels: Record<string, { label: string; color: string }> = isEn
    ? {
        A: { label: 'Investment', color: '#0F766E' },
        B: { label: 'Villa María', color: '#0369A1' },
        C: { label: 'Buying in Argentina', color: '#7C3AED' },
      }
    : {
        A: { label: 'Inversión', color: '#0F766E' },
        B: { label: 'Villa María', color: '#0369A1' },
        C: { label: 'Comprar en Argentina', color: '#7C3AED' },
      };

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #134E4A 0%, #0F766E 100%)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-light mb-2" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mudate Blog</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            {isEn ? 'The Argentine Real Estate Market' : 'El mercado inmobiliario cordobés'}
          </h1>
          <p className="text-white/70 mt-3 font-light max-w-xl mx-auto">
            {isEn
              ? 'Analysis, guides and real data to help you make the best decisions when buying or investing in Argentina.'
              : 'Análisis, guías y datos reales para que tomes las mejores decisiones al comprar o invertir en Córdoba.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured post */}
        <div className="mb-12">
          <p className="text-xs font-light mb-4" style={{ color: 'var(--primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {isEn ? 'Featured article' : 'Artículo destacado'}
          </p>
          <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-6 rounded-2xl overflow-hidden cursor-pointer" style={{ background: 'white', boxShadow: 'var(--shadow-lg)' }}>
            <div className="relative h-64 md:h-auto overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.coverImage}
                alt={featured.title[isEn ? 'en' : 'es']}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2 py-1 rounded-full text-white font-medium" style={{ background: clusterLabels[featured.cluster].color }}>
                  {clusterLabels[featured.cluster].label}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <Clock size={12} /> {featured.readTime} {isEn ? 'min read' : 'min de lectura'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-teal-700 transition-colors" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                {featured.title[isEn ? 'en' : 'es']}
              </h2>
              <p className="text-sm font-light mb-4" style={{ color: 'var(--muted-foreground)' }}>{featured.excerpt[isEn ? 'en' : 'es']}</p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                {isEn ? 'Read article' : 'Leer artículo'} <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>

        {/* Clusters filter pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(clusterLabels).map(([key, val]) => (
            <span key={key} className="text-xs px-3 py-1.5 rounded-full cursor-pointer border font-medium transition-all" style={{ borderColor: val.color, color: val.color }}>
              {val.label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-200" style={{ background: 'white', boxShadow: 'var(--shadow-md)' }}>
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title[isEn ? 'en' : 'es']}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: clusterLabels[post.cluster].color }}>
                    {clusterLabels[post.cluster].label}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <Clock size={11} /> {post.readTime} min
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-2 group-hover:text-teal-700 transition-colors leading-snug" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                  {post.title[isEn ? 'en' : 'es']}
                </h3>
                <p className="text-xs font-light line-clamp-2 mb-3" style={{ color: 'var(--muted-foreground)' }}>{post.excerpt[isEn ? 'en' : 'es']}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--primary)' }}>
                      <Tag size={10} />{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
