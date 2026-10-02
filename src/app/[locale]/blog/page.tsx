import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { getAllPosts } from '@/data/blog';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = 'https://mudateargentina.com';
  const isEn = locale === 'en';
  return {
    title: isEn
      ? 'Real Estate Blog Argentina — Guides for Buying, Selling and Investing'
      : 'Blog Inmobiliario Argentina — Guías para Comprar, Vender e Invertir',
    description: isEn
      ? 'Guides, analysis and market insights for Argentine real estate. Cap rates, neighborhood prices, how to buy property in Argentina and more.'
      : 'Guías, análisis y consejos del mercado inmobiliario argentino. Cap rates, precios por barrio, cómo comprar una propiedad en Argentina y más.',
    openGraph: {
      title: isEn ? 'Real Estate Blog Argentina — Mudate' : 'Blog Inmobiliario Argentina — Mudate',
      description: isEn
        ? 'Guides, analysis and market insights for Argentine real estate.'
        : 'Guías y análisis del mercado inmobiliario argentino.',
      url: isEn ? `${base}/en/blog` : `${base}/blog`,
      type: 'website',
      images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630, alt: 'Blog Inmobiliario Mudate Argentina' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${base}/opengraph-image`],
    },
    alternates: {
      canonical: isEn ? `${base}/en/blog` : `${base}/blog`,
      languages: { es: `${base}/blog`, en: `${base}/en/blog`, 'x-default': `${base}/blog` },
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const posts = getAllPosts();
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

  const BASE = 'https://mudateargentina.com';
  const blogListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEn ? 'Argentine Real Estate Blog' : 'Blog Inmobiliario Argentina',
    description: isEn
      ? 'Guides and analysis for buying and investing in Argentine real estate'
      : 'Guías y análisis para comprar e invertir en inmuebles en Argentina',
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: isEn ? `${BASE}/en/blog/${p.slug}` : `${BASE}/blog/${p.slug}`,
      name: p.title[isEn ? 'en' : 'es'],
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: isEn ? 'Blog' : 'Blog', item: isEn ? `${BASE}/en/blog` : `${BASE}/blog` },
    ],
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #061610 0%, #0A2218 100%)' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-light mb-2" style={{ color: 'rgba(153,246,228,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mudate Blog</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            {isEn ? 'The Argentine Real Estate Market' : 'El mercado inmobiliario argentino'}
          </h1>
          <p className="text-white/70 mt-3 font-light max-w-xl mx-auto">
            {isEn
              ? 'Analysis, guides and real data to help you make the best decisions when buying or investing in Argentina.'
              : 'Análisis, guías y datos reales para que tomes las mejores decisiones al comprar o invertir en Argentina.'}
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
                fetchPriority="high"
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
                  loading="lazy"
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
