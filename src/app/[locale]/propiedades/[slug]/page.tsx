import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { MapPin, Home, Bath, Maximize2, BedDouble, ArrowLeft, ChevronRight } from 'lucide-react';
import PropertyCard, { PropertyCardData } from '@/components/PropertyCard';
import LeadGate from '@/components/LeadGate';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { connectDB } from '@/lib/mongodb';
import { Property as PropertyModel } from '@/models/Property';
import { getFallbackImages } from '@/lib/fallbackImages';
import { notFound } from 'next/navigation';

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '5493512345678';

export const dynamic = 'force-dynamic';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property extends PropertyCardData {
  description: string;
  provincia?: string;
  superficie_total?: number;
  source_url?: string;
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

async function getProperty(slug: string): Promise<Property | null> {
  try {
    await connectDB();
    const doc = await PropertyModel.findOne({ slug, published: true }).lean();
    if (!doc) return null;
    return {
      slug: doc.slug,
      title: doc.title,
      description: doc.description || `Propiedad en ${doc.ciudad}. ${doc.superficie_cubierta ? doc.superficie_cubierta + ' m² cubiertos. ' : ''}${doc.dormitorios ? doc.dormitorios + ' dormitorios.' : ''}`,
      price: doc.price,
      currency: doc.currency as 'USD' | 'ARS',
      operation: doc.operation as 'venta' | 'alquiler',
      type: doc.type,
      ciudad: doc.ciudad,
      barrio: doc.barrio,
      ambientes: doc.ambientes,
      dormitorios: doc.dormitorios,
      banos: doc.banos,
      superficie_cubierta: doc.superficie_cubierta,
      superficie_total: doc.superficie_total,
      images: doc.images || [],
      provincia: doc.provincia,
      source_url: doc.source_url,
    };
  } catch { return null; }
}

async function getRelated(current: Property): Promise<Property[]> {
  try {
    await connectDB();
    const docs = await PropertyModel.find({
      published: true,
      slug: { $ne: current.slug },
      $or: [{ type: current.type }, { ciudad: current.ciudad }],
    }).limit(3).lean();
    return docs.map(doc => ({
      slug: doc.slug,
      title: doc.title,
      description: doc.description || '',
      price: doc.price,
      currency: doc.currency as 'USD' | 'ARS',
      operation: doc.operation as 'venta' | 'alquiler',
      type: doc.type,
      ciudad: doc.ciudad,
      barrio: doc.barrio,
      ambientes: doc.ambientes,
      dormitorios: doc.dormitorios,
      banos: doc.banos,
      superficie_cubierta: doc.superficie_cubierta,
      images: doc.images || [],
    }));
  } catch { return []; }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused: Property[] = [
  {
    slug: 'casa-nueva-cordoba-3-dormitorios',
    title: 'Casa moderna 3 dormitorios — Nueva Córdoba',
    price: 185000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 145,
    description:
      'Hermosa casa moderna con tres dormitorios en suite, living comedor amplio, cocina equipada y patio con parrilla. Ideal para familia. A metros del Parque Sarmiento.',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'],
  },
  {
    slug: 'departamento-villa-maria-2-ambientes',
    title: 'Departamento 2 ambientes — Centro Villa María',
    price: 68000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Villa María',
    barrio: 'Centro',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 58,
    description:
      'Departamento luminoso en el centro de Villa María. Segundo piso con balcón, cocina integrada, placard empotrado. Excelente estado. A pasos de la peatonal.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'],
  },
  {
    slug: 'casa-villa-carlos-paz-lago',
    title: 'Casa con vista al lago — Villa Carlos Paz',
    price: 250000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Villa Carlos Paz',
    barrio: 'Zona Centro',
    ambientes: 5,
    dormitorios: 4,
    banos: 3,
    superficie_cubierta: 220,
    description:
      'Espectacular casa con vista panorámica al lago San Roque. Cuatro dormitorios, tres baños, living con chimenea, terraza y galería. Piscina climatizada. El refugio perfecto en las sierras.',
    images: ['https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80'],
  },
  {
    slug: 'terreno-cordoba-noroeste',
    title: 'Terreno 600 m² — Corredor Noroeste',
    price: 45000,
    currency: 'USD',
    operation: 'venta',
    type: 'terreno',
    ciudad: 'Córdoba Capital',
    barrio: 'Noroeste',
    superficie_cubierta: 600,
    description:
      'Terreno en esquina de 600 m² en el corredor noroeste de Córdoba. Zona residencial consolidada, todos los servicios. Ideal para construcción de casa o duplex.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'],
  },
  {
    slug: 'departamento-alquiler-nueva-cordoba',
    title: 'Departamento en alquiler — Nueva Córdoba',
    price: 280000,
    currency: 'ARS',
    operation: 'alquiler',
    type: 'departamento',
    ciudad: 'Córdoba Capital',
    barrio: 'Nueva Córdoba',
    ambientes: 2,
    dormitorios: 1,
    banos: 1,
    superficie_cubierta: 48,
    description:
      'Monoambiente amplio en Nueva Córdoba, el barrio más vibrante de Córdoba. Totalmente amoblado, internet incluido. Ideal para estudiantes universitarios o profesionales.',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80'],
  },
  {
    slug: 'casa-villa-maria-barrio-privado',
    title: 'Casa en barrio privado — Villa María',
    price: 120000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Villa María',
    barrio: 'Barrio Privado Norte',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 165,
    description:
      'Casa en barrio privado con seguridad 24hs. Tres dormitorios en suite, living comedor con doble altura, cocina gourmet. Jardín con piscina y parrilla cubierta. Solo 2 años de antigüedad.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'],
  },
  {
    slug: 'campo-cordoba-sierras',
    title: 'Campo 5 hectáreas — Sierras de Córdoba',
    price: 320000,
    currency: 'USD',
    operation: 'venta',
    type: 'campo',
    ciudad: 'Córdoba Capital',
    barrio: 'Sierras',
    superficie_cubierta: 50000,
    description:
      'Campo de 5 hectáreas en las Sierras de Córdoba. Vista 360° a las montañas. Casa principal de 3 dormitorios, galpón, corral y pozo de agua. Acceso pavimentado.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80'],
  },
  {
    slug: 'departamento-3-ambientes-general-paz',
    title: 'Departamento 3 ambientes — General Paz',
    price: 95000,
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    ciudad: 'Córdoba Capital',
    barrio: 'General Paz',
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    superficie_cubierta: 78,
    description:
      'Departamento en planta baja con jardín privado en el barrio General Paz. Dos dormitorios, living comedor amplio, cocina y baño actualizados. Estacionamiento cubierto.',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'],
  },
  {
    slug: 'casa-rio-cuarto-3-dorm',
    title: 'Casa 3 dormitorios — Río Cuarto',
    price: 98000,
    currency: 'USD',
    operation: 'venta',
    type: 'casa',
    ciudad: 'Río Cuarto',
    barrio: 'Centro',
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    superficie_cubierta: 130,
    description:
      'Casa familiar en Río Cuarto, la cuarta ciudad de Argentina. Tres dormitorios, dos baños, living comedor con chimenea. Patio amplio con frutales. A metros del centro comercial.',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'],
  },
];

function formatPrice(price: number, currency: string): string {
  if (currency === 'ARS') return `$ ${price.toLocaleString('es-AR')}`;
  return `USD ${price.toLocaleString('es-AR')}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // Pre-render top properties for both locales
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const { Property: PropertyModel } = await import('@/models/Property');
    await connectDB();
    const top = await PropertyModel.find({ published: true })
      .select('slug')
      .sort({ featured: -1, createdAt: -1 })
      .limit(100)
      .lean();
    return top.flatMap((p) => [
      { locale: 'es', slug: p.slug },
      { locale: 'en', slug: p.slug },
    ]);
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const property = await getProperty(slug);
  const base = 'https://mudateargentina.com';

  if (!property) {
    return {
      title: locale === 'en' ? 'Property not found — Mudate' : 'Propiedad no encontrada — Mudate',
      description: locale === 'en' ? 'The property you are looking for does not exist or was removed.' : 'La propiedad que buscás no existe o fue removida.',
    };
  }

  return {
    title: `${property.title} | Mudate`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images[0] ? [{ url: property.images[0] }] : [],
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_AR',
    },
    alternates: {
      canonical: locale === 'en' ? `${base}/en/propiedades/${slug}` : `${base}/propiedades/${slug}`,
      languages: {
        'es': `${base}/propiedades/${slug}`,
        'en': `${base}/en/propiedades/${slug}`,
      },
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropiedadSlugPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) { notFound(); }

  if (!property) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: 'var(--background)' }}
      >
        <p
          className="text-2xl font-semibold"
          style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
        >
          Propiedad no encontrada
        </p>
        <Link
          href="/propiedades"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'var(--primary)' }}
        >
          <ArrowLeft size={16} />
          Volver a propiedades
        </Link>
      </div>
    );
  }

  const related = await getRelated(property);

  // Imágenes: reales si las tiene, fallback curadas por tipo si no
  const displayImages = property.images.length > 0
    ? property.images
    : getFallbackImages(property.slug, property.type);
  const heroImage = displayImages[0];
  const waText = encodeURIComponent(`Hola! Me interesa la propiedad: ${property.title} — ${property.ciudad}`);

  const BASE = 'https://mudateargentina.com';
  const pageUrl = `${BASE}/propiedades/${property.slug}`;

  // JSON-LD RealEstateListing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: pageUrl,
    ...(heroImage ? { image: heroImage } : {}),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Accommodation',
        name: property.title,
        ...(property.ambientes ? { numberOfRooms: property.ambientes } : {}),
        ...(property.superficie_cubierta ? { floorSize: { '@type': 'QuantitativeValue', value: property.superficie_cubierta, unitCode: 'MTK' } } : {}),
        accommodationCategory: property.type,
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.ciudad,
      ...(property.barrio ? { streetAddress: property.barrio } : {}),
      addressRegion: property.provincia || property.ciudad,
      addressCountry: 'AR',
    },
  };

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Propiedades', item: `${BASE}/propiedades` },
      { '@type': 'ListItem', position: 3, name: property.ciudad, item: `${BASE}/ciudad/${property.ciudad.toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 4, name: property.title, item: pageUrl },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <div className="relative w-full" style={{ height: '480px' }}>
          <Image
            src={heroImage}
            alt={property.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(19,78,74,0.45) 0%, rgba(19,78,74,0.15) 40%, rgba(19,78,74,0.7) 100%)',
            }}
          />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 px-4 sm:px-8">
            <nav
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                backdropFilter: 'blur(16px)',
                background: 'rgba(240,253,250,0.18)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight size={12} style={{ opacity: 0.6 }} />
              <Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link>
              <ChevronRight size={12} style={{ opacity: 0.6 }} />
              <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-xs">
                {property.title}
              </span>
            </nav>
          </div>

          {/* Back link */}
          <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Volver a propiedades
            </Link>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left panel (2/3) ── */}
            <div className="flex-1 min-w-0">

              {/* Badges + title + price */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ background: property.operation === 'venta' ? 'var(--primary)' : 'var(--accent)' }}
                  >
                    {capitalize(property.operation)}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{
                      background: 'rgba(15,118,110,0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(15,118,110,0.2)',
                    }}
                  >
                    {property.type}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ color: 'var(--muted-foreground)', background: 'rgba(0,0,0,0.04)' }}
                  >
                    <MapPin size={11} />
                    {property.barrio ? `${property.barrio}, ` : ''}{property.ciudad}
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-3"
                  style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
                >
                  {property.title}
                </h1>

                <p
                  className="text-3xl font-bold"
                  style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)' }}
                >
                  {formatPrice(property.price, property.currency)}
                  {property.operation === 'alquiler' && (
                    <span className="text-base font-normal ml-1" style={{ color: 'var(--muted-foreground)' }}>
                      / mes
                    </span>
                  )}
                </p>
              </div>

              {/* Image gallery */}
              <div className="mb-8">
                {displayImages.length === 1 ? (
                  <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '360px' }}>
                    <Image
                      src={displayImages[0]}
                      alt={`${property.title}`}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                    {/* Main image */}
                    <div className="relative rounded-2xl overflow-hidden" style={{ height: 380 }}>
                      <Image
                        src={displayImages[0]}
                        alt={`${property.title}`}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 44vw"
                      />
                    </div>
                    {/* Side images */}
                    <div style={{ display: 'grid', gridTemplateRows: displayImages.length >= 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10 }}>
                      {displayImages.slice(1, displayImages.length >= 3 ? 4 : 3).map((img, i) => (
                        <div
                          key={i}
                          className="relative rounded-2xl overflow-hidden"
                          style={{ minHeight: 0 }}
                        >
                          <Image
                            src={img}
                            alt={`${property.title} — foto ${i + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 22vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div
                className="glass rounded-2xl p-6 mb-6"
              >
                <h2
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
                >
                  Descripción
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif' }}
                >
                  {property.description}
                </p>
              </div>

              {/* Features grid */}
              {(property.ambientes || property.dormitorios || property.banos || property.superficie_cubierta) && (
                <div className="glass rounded-2xl p-6 mb-6">
                  <h2
                    className="text-lg font-semibold mb-5"
                    style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
                  >
                    Características
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {property.ambientes && (
                      <FeatureTile
                        icon={<Home size={22} />}
                        value={String(property.ambientes)}
                        label="Ambientes"
                      />
                    )}
                    {property.dormitorios && (
                      <FeatureTile
                        icon={<BedDouble size={22} />}
                        value={String(property.dormitorios)}
                        label="Dormitorios"
                      />
                    )}
                    {property.banos && (
                      <FeatureTile
                        icon={<Bath size={22} />}
                        value={String(property.banos)}
                        label="Baños"
                      />
                    )}
                    {property.superficie_cubierta && (
                      <FeatureTile
                        icon={<Maximize2 size={22} />}
                        value={`${property.superficie_cubierta.toLocaleString('es-AR')} m²`}
                        label="Superficie"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Map placeholder */}
              <div className="glass rounded-2xl p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
                >
                  Ubicación
                </h2>
                <div
                  className="w-full rounded-xl flex flex-col items-center justify-center gap-2"
                  style={{
                    height: '256px',
                    background: 'rgba(15,118,110,0.06)',
                    border: '1.5px dashed rgba(15,118,110,0.2)',
                  }}
                >
                  <MapPin size={28} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif' }}
                  >
                    Mapa próximamente
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
                  >
                    {property.barrio ? `${property.barrio}, ` : ''}{property.ciudad}, Córdoba
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right panel (1/3) ── */}
            <aside className="lg:w-80 xl:w-96 shrink-0">
              <div className="sticky top-24">
                <div
                  className="glass rounded-2xl p-6"
                  style={{ boxShadow: '0 8px 32px rgba(15,118,110,0.08)' }}
                >
                  {/* Price */}
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)' }}
                  >
                    {formatPrice(property.price, property.currency)}
                  </p>
                  {property.operation === 'alquiler' && (
                    <p
                      className="text-xs mb-4"
                      style={{ color: 'var(--muted-foreground)', fontFamily: 'Josefin Sans, sans-serif' }}
                    >
                      por mes
                    </p>
                  )}

                  <div
                    className="w-full mb-5"
                    style={{ height: '1px', background: 'rgba(15,118,110,0.1)' }}
                  />

                  {/* Quick info */}
                  <ul className="space-y-2.5 mb-6">
                    <QuickInfoRow label="Ciudad" value={property.ciudad} />
                    {property.barrio && <QuickInfoRow label="Barrio" value={property.barrio} />}
                    <QuickInfoRow label="Operación" value={capitalize(property.operation)} />
                    <QuickInfoRow label="Tipo" value={capitalize(property.type)} />
                    {property.superficie_cubierta && (
                      <QuickInfoRow
                        label="Superficie"
                        value={`${property.superficie_cubierta.toLocaleString('es-AR')} m²`}
                      />
                    )}
                  </ul>

                  {/* Lead Gate — formulario + desbloqueo de contacto */}
                  <LeadGate
                    propertySlug={property.slug}
                    propertyTitle={property.title}
                    ciudad={property.ciudad}
                    waNumber={WA_NUMBER}
                    waText={waText}
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* ── Related properties ── */}
          {related.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
                >
                  Propiedades relacionadas
                </h2>
                <Link
                  href="/propiedades"
                  className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: 'var(--primary)', fontFamily: 'Josefin Sans, sans-serif' }}
                >
                  Ver todas
                  <ChevronRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <PropertyCard key={p.slug} property={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* WhatsApp floating button */}
      <WhatsAppFloat waNumber={WA_NUMBER} waText={waText} />
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FeatureTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-xl py-5 px-3"
      style={{
        background: 'rgba(15,118,110,0.06)',
        border: '1px solid rgba(15,118,110,0.1)',
      }}
    >
      <span style={{ color: 'var(--primary)' }}>{icon}</span>
      <span
        className="text-lg font-bold"
        style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}
      >
        {value}
      </span>
      <span
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: 'var(--muted-foreground)', letterSpacing: '0.08em' }}
      >
        {label}
      </span>
    </div>
  );
}

function QuickInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <li
      className="flex items-center justify-between text-sm"
      style={{ fontFamily: 'Josefin Sans, sans-serif' }}
    >
      <span style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="font-medium" style={{ color: 'var(--foreground)' }}>
        {value}
      </span>
    </li>
  );
}
