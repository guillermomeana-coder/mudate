import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag, Calendar, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllSlugs, getPostBySlug, type BlogPost } from '@/data/blog';

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  const isEn = locale === 'en';
  if (!post) return { title: isEn ? 'Article not found — Mudate' : 'Artículo no encontrado — Mudate' };
  const base = 'https://mudateargentina.com';
  const path = `/blog/${slug}`;
  const canonicalOverrides: Record<string, string> = {
    'como-comprar-propiedad-argentina-2025': '/blog/como-comprar-propiedad-argentina-extranjeros',
  };
  const canonicalPath = canonicalOverrides[slug] ?? path;
  return {
    title: `${post.title[isEn ? 'en' : 'es']} — Mudate Blog`,
    description: post.excerpt[isEn ? 'en' : 'es'],
    openGraph: {
      title: post.title[isEn ? 'en' : 'es'],
      description: post.excerpt[isEn ? 'en' : 'es'],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title[isEn ? 'en' : 'es'] }],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      images: [post.coverImage],
    },
    alternates: {
      canonical: isEn ? `${base}/en${canonicalPath}` : `${base}${canonicalPath}`,
      languages: {
        es: `${base}${path}`,
        en: `${base}/en${path}`,
        'x-default': `${base}${path}`,
      },
    },
  };
}

const clusterLabelsEs: Record<string, { label: string; color: string }> = {
  A: { label: 'Inversión', color: '#0F766E' },
  B: { label: 'Villa María', color: '#0369A1' },
  C: { label: 'Comprar en Argentina', color: '#7C3AED' },
};

const clusterLabelsEn: Record<string, { label: string; color: string }> = {
  A: { label: 'Investment', color: '#0F766E' },
  B: { label: 'Villa María', color: '#0369A1' },
  C: { label: 'Buying in Argentina', color: '#7C3AED' },
};

// Render markdown-like content
function renderContent(content: string) {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      inTable = true;
      const cells = trimmed.split('|').filter(Boolean).map((c) => c.trim());
      if (!cells.every((c) => c.match(/^[-:]+$/))) {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      inTable = false;
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse" style={{ borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--primary)', color: 'white' }}>
                {tableRows[0].map((cell, j) => (
                  <th key={j} className="px-4 py-2 text-left font-semibold text-xs" style={{ fontFamily: 'Josefin Sans, sans-serif', letterSpacing: '0.05em' }}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : 'var(--muted)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 text-xs" style={{ color: 'var(--foreground)' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }

    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold mt-5 mb-2" style={{ fontFamily: 'Cinzel, serif', color: 'var(--primary)' }}>{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ')) {
      elements.push(<li key={i} className="ml-4 mb-1 text-sm font-light" style={{ color: 'var(--foreground)', listStyleType: 'disc' }}>{trimmed.slice(2)}</li>);
    } else if (trimmed.startsWith('*Nota:') || trimmed.startsWith('*Note:')) {
      elements.push(<p key={i} className="text-xs italic my-2" style={{ color: 'var(--muted-foreground)' }}>{trimmed.replace(/\*/g, '')}</p>);
    } else if (trimmed.length > 0 && !trimmed.startsWith('|')) {
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, pi) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pi} style={{ color: 'var(--foreground)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      elements.push(<p key={i} className="text-sm font-light leading-relaxed mb-3" style={{ color: 'var(--foreground)' }}>{rendered}</p>);
    }
  });

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  const isEn = locale === 'en';
  const clusterLabels = isEn ? clusterLabelsEn : clusterLabelsEs;
  const post = getPostBySlug(slug);
  const allSlugs = getAllSlugs();
  const posts = getAllPosts();

  if (!post) {
    if (!allSlugs.includes(slug)) notFound();

    return (
      <div style={{ background: 'var(--background)', minHeight: '60vh' }} className="flex items-center justify-center">
        <div className="text-center py-24">
          <p className="text-sm font-light" style={{ color: 'var(--muted-foreground)' }}>
            {isEn ? 'Article coming soon. Check back later.' : 'Artículo en preparación. Volvé pronto.'}
          </p>
          <Link href="/blog" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            <ArrowLeft size={16} /> {isEn ? 'Back to blog' : 'Volver al blog'}
          </Link>
        </div>
      </div>
    );
  }

  const related = posts.filter((p) => p.slug !== post.slug && p.cluster === post.cluster).slice(0, 2);

  const BASE = 'https://mudateargentina.com';
  const postUrl = isEn ? `${BASE}/en/blog/${post.slug}` : `${BASE}/blog/${post.slug}`;
  const clusterSection = (isEn ? clusterLabelsEn : clusterLabelsEs)[post.cluster]?.label ?? 'Real Estate';

  const howToSchemas: Record<string, object> = {
    'como-comprar-propiedad-argentina-2025': {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: isEn ? 'How to Buy Property in Argentina as a Foreigner in 2025' : 'Cómo comprar una propiedad en Argentina siendo extranjero en 2025',
      description: isEn
        ? 'Step-by-step guide for foreigners buying real estate in Argentina: CUIT/CUIL, reservation, title deed, and costs.'
        : 'Guía paso a paso para extranjeros que compran propiedades en Argentina: CUIT/CUIL, reserva, escritura y costos.',
      totalTime: 'P45D',
      step: [
        { '@type': 'HowToStep', position: 1, name: isEn ? 'Obtain CUIT/CUIL' : 'Obtener el CUIT/CUIL', text: isEn ? 'Any property buyer in Argentina must have a CUIT or CUIL tax ID. As a foreigner, you can obtain it at the AFIP office with your passport.' : 'Todo comprador de inmuebles en Argentina necesita CUIT o CUIL. Como extranjero, se obtiene en AFIP con pasaporte. El trámite es gratuito.' },
        { '@type': 'HowToStep', position: 2, name: isEn ? 'Find the property and sign reservation' : 'Encontrar la propiedad y firmar la reserva', text: isEn ? 'Pay a 1–3% reservation deposit to take the property off the market and lock in the price.' : 'Se abona una reserva del 1–3% del precio para sacar la propiedad del mercado y fijar el valor.' },
        { '@type': 'HowToStep', position: 3, name: isEn ? 'Sign the purchase contract (boleto)' : 'Firmar el boleto de compraventa', text: isEn ? 'Sign the private purchase contract and pay 30% of the price. The notary verifies the property title.' : 'Se firma el boleto de compraventa y se paga el 30% del precio. El escribano verifica el título de la propiedad.' },
        { '@type': 'HowToStep', position: 4, name: isEn ? 'Pay in USD' : 'Pago en dólares', text: isEn ? 'The Argentine market operates primarily in USD cash. Payment can be made in cash, SWIFT transfer, or cryptocurrency.' : 'El mercado opera en USD. El pago puede realizarse en efectivo, transferencia SWIFT desde el exterior o criptomonedas.' },
        { '@type': 'HowToStep', position: 5, name: isEn ? 'Sign the title deed (escritura)' : 'Firma de la escritura', text: isEn ? 'The notary drafts the public deed. The buyer pays the remaining 70% plus notary fees (~2%) and stamp duties.' : 'El escribano redacta la escritura pública. Se paga el saldo del 70% más honorarios (~2%) e impuestos de sellos.' },
        { '@type': 'HowToStep', position: 6, name: isEn ? 'Registration in the Property Registry' : 'Inscripción registral', text: isEn ? 'The deed is registered in the Property Registry within 15–30 days. The buyer is legally recognized as the new owner.' : 'La escritura se inscribe en el Registro de la Propiedad (15–30 días). El comprador queda como titular legal.' },
      ],
    },
    'como-comprar-propiedad-argentina-extranjeros': {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: isEn ? 'How to Buy Property in Argentina as a Foreigner: Step-by-Step Guide 2025' : 'Cómo comprar una propiedad en Argentina siendo extranjero: guía paso a paso 2025',
      description: isEn
        ? 'Complete process for non-residents buying real estate in Argentina: CDI, boleto, due diligence, title deed, and taxes.'
        : 'Proceso completo para no residentes que compran inmuebles en Argentina: CDI, boleto, due diligence, escritura e impuestos.',
      totalTime: 'P60D',
      step: [
        { '@type': 'HowToStep', position: 1, name: isEn ? 'Obtain the CDI' : 'Obtener el CDI', text: isEn ? 'The CDI (Clave de Identificación del Contribuyente) is mandatory for any property transaction. Apply at any AFIP office with a valid passport. The process is free and takes 1–2 business days.' : 'El CDI es obligatorio para cualquier operación inmobiliaria. Se tramita en AFIP con pasaporte vigente. El trámite es gratuito y tarda 1–2 días hábiles.' },
        { '@type': 'HowToStep', position: 2, name: isEn ? 'Open a bank account (optional)' : 'Abrir una cuenta bancaria (opcional)', text: isEn ? 'Not required, but it facilitates transfers. Argentine banks accept foreigners with passport and CDI.' : 'No es obligatorio pero facilita las transferencias. Los bancos argentinos aceptan extranjeros con pasaporte y CDI.' },
        { '@type': 'HowToStep', position: 3, name: isEn ? 'Sign the boleto and pay deposit' : 'Firmar el boleto y pagar la seña', text: isEn ? 'Sign the private purchase contract (boleto) and pay a 20–30% deposit in USD. The contract is binding for both parties.' : 'Se firma el boleto de compraventa y se paga una seña del 20–30% en USD. El contrato es vinculante para ambas partes.' },
        { '@type': 'HowToStep', position: 4, name: isEn ? 'Title due diligence' : 'Due diligence del título', text: isEn ? 'The notary verifies ownership, absence of mortgages or liens, and outstanding fees or taxes.' : 'El escribano verifica dominio, ausencia de hipotecas y embargos, y deudas de expensas e impuestos.' },
        { '@type': 'HowToStep', position: 5, name: isEn ? 'Sign the public deed (escritura)' : 'Firma de la escritura pública', text: isEn ? 'Sign before a notary. Pay the remaining balance in USD cash or bank transfer. The notary files the deed in the Property Registry.' : 'Se firma ante escribano. Se paga el saldo en USD cash o transferencia. El escribano inscribe la escritura en el Registro de la Propiedad.' },
        { '@type': 'HowToStep', position: 6, name: isEn ? 'Become the legal owner' : 'Quedar como titular legal', text: isEn ? 'Once registered (30–60 days total from boleto), the buyer is the legal owner. The full process costs approximately 4–5% in taxes and fees on top of the purchase price.' : 'Una vez inscripta (30–60 días desde el boleto), el comprador es titular legal. Los gastos totales representan aproximadamente el 4–5% del precio.' },
      ],
    },
    'primer-propiedad-argentina-guia-2026': {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: isEn ? 'How to Buy Your First Property in Argentina: Complete 2026 Guide' : 'Cómo comprar tu primera propiedad en Argentina: guía completa 2026',
      description: isEn
        ? 'From saving the initial capital to registering the title deed. Step-by-step guide for first-time buyers in Argentina in 2026.'
        : 'Desde ahorrar el capital hasta la escritura. Guía paso a paso para compradores primerizos en Argentina en 2026.',
      totalTime: 'P90D',
      step: [
        { '@type': 'HowToStep', position: 1, name: isEn ? 'Define your real budget' : 'Definir el presupuesto real', text: isEn ? 'Calculate 110–115% of the listing price: the property price plus real estate commission (3–4%), notary fees (1.5–2.5%), and an emergency reserve (5–10%).' : 'Calculá 110–115% del precio publicado: precio + comisión inmobiliaria (3–4%) + gastos de escritura (1,5–2,5%) + reserva de emergencia (5–10%).' },
        { '@type': 'HowToStep', position: 2, name: isEn ? 'Choose city and neighborhood' : 'Elegir ciudad y zona', text: isEn ? 'Define your goal: own home or investment. For investment, prioritize cap rate, structural rental demand (universities, industrial zones), and market liquidity.' : 'Definí el objetivo: vivienda propia o inversión. Para inversión, priorizá cap rate, demanda de alquiler estructural (universidades, polos industriales) y liquidez del mercado.' },
        { '@type': 'HowToStep', position: 3, name: isEn ? 'Pay the reservation' : 'Pagar la reserva', text: isEn ? 'Pay 1–3% of the asking price to take the property off the market and lock in the price. You will lose this amount if you back out.' : 'Se paga el 1–3% del precio para sacar la propiedad del mercado y fijar el valor. Si te arrepentís, perdés la reserva.' },
        { '@type': 'HowToStep', position: 4, name: isEn ? 'Sign the purchase contract (boleto)' : 'Firmar el boleto de compraventa', text: isEn ? 'Sign the private contract with a notary and pay 20–30% of the total price. The boleto is binding and protects both parties.' : 'Se firma el contrato privado ante escribano y se paga el 20–30% del precio total. El boleto es vinculante y protege a ambas partes.' },
        { '@type': 'HowToStep', position: 5, name: isEn ? 'Notarial due diligence' : 'Due diligence notarial', text: isEn ? 'The notary verifies the property title: clean ownership, no mortgages, no liens, no outstanding fees. This takes 2–4 weeks.' : 'El escribano verifica el título: propiedad limpia, sin hipotecas, embargos ni inhibiciones. Tarda 2–4 semanas.' },
        { '@type': 'HowToStep', position: 6, name: isEn ? 'Sign the title deed and register' : 'Firmar la escritura e inscribir', text: isEn ? 'Sign the public deed before the notary. Pay the remaining 70% plus fees. The deed is registered in the Property Registry within 15–30 days.' : 'Se firma la escritura pública ante el escribano. Se paga el saldo del 70% más gastos. La escritura se inscribe en el Registro de la Propiedad en 15–30 días.' },
      ],
    },
    'comprar-departamento-villa-maria': {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: isEn ? 'How to Buy an Apartment in Villa María: Step-by-Step Guide' : 'Cómo comprar un departamento en Villa María: guía paso a paso',
      description: isEn
        ? 'From setting a budget to signing the deed. Everything you need to know to buy an apartment in Villa María safely.'
        : 'Desde definir el presupuesto hasta firmar la escritura. Todo para comprar tu departamento en Villa María con seguridad.',
      totalTime: 'P60D',
      step: [
        { '@type': 'HowToStep', position: 1, name: isEn ? 'Define total budget' : 'Definir el presupuesto total', text: isEn ? 'Add 5–6% to the property price for real estate commission (3%), notary fees (1.5–2%), stamp duty (1.5%), and registry costs (0.3–0.5%).' : 'Sumá un 5–6% al precio de la propiedad: comisión (3%) + escribano (1,5–2%) + sellado provincial (1,5%) + inscripción registral (0,3–0,5%).' },
        { '@type': 'HowToStep', position: 2, name: isEn ? 'Search properties in Villa María' : 'Buscar la propiedad en Villa María', text: isEn ? 'Use ZonaProp, MercadoLibre, and local real estate agencies. Prioritize central and university neighborhoods (Palermo, UNVM area) for rental investment.' : 'Usá ZonaProp, MercadoLibre e inmobiliarias locales. Para inversión, priorizá el Centro y barrios universitarios (Palermo, zona UNVM).' },
        { '@type': 'HowToStep', position: 3, name: isEn ? 'Visit and negotiate' : 'Visita y negociación', text: isEn ? 'Inspect electrical installations, plumbing, humidity, and monthly maintenance fees. In Villa María, negotiating 3–8% off the asking price is normal.' : 'Revisá instalaciones eléctricas, cañerías, humedad y expensas. En Villa María es habitual negociar entre el 3% y el 8% sobre el precio de publicación.' },
        { '@type': 'HowToStep', position: 4, name: isEn ? 'Pay the reservation' : 'Pagar la reserva', text: isEn ? 'Pay a reservation of 1–3% of the price with a signed receipt from the real estate agency. Keep this receipt.' : 'Se paga la reserva del 1–3% del precio con recibo firmado por la inmobiliaria. Guardá siempre ese recibo.' },
        { '@type': 'HowToStep', position: 5, name: isEn ? 'Sign the boleto and conduct due diligence' : 'Firmar el boleto y hacer el due diligence', text: isEn ? 'Sign the purchase contract with 30% payment. The notary verifies title, liens, and outstanding fees before the final deed.' : 'Se firma el boleto con el 30% del precio. El escribano verifica título, inhibiciones y deudas de expensas antes de la escritura.' },
        { '@type': 'HowToStep', position: 6, name: isEn ? 'Sign the public deed' : 'Firma de la escritura pública', text: isEn ? 'Sign before the notary, pay the remaining balance in USD, and pay fees. Registration takes 15–30 days, after which you are the legal owner.' : 'Se firma ante el escribano, se paga el saldo en USD y los honorarios. La inscripción tarda 15–30 días, después sos el titular legal.' },
      ],
    },
    'escritura-inmueble-argentina': {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: isEn ? 'How Property Title Deeds Work in Argentina' : 'Cómo funciona la escritura de inmuebles en Argentina',
      description: isEn
        ? 'Step-by-step guide to the title deed process in Argentina: pre-deed preparations, costs for buyer and seller, signing, and registration.'
        : 'Guía paso a paso del proceso de escritura en Argentina: preparativos previos, costos del comprador y vendedor, firma e inscripción.',
      totalTime: 'P30D',
      step: [
        { '@type': 'HowToStep', position: 1, name: isEn ? 'Assign a notary' : 'Designar al escribano', text: isEn ? 'The buyer generally chooses the notary. The notary is responsible for the title study, drafting the deed, and filing it in the Property Registry.' : 'El comprador generalmente elige al escribano, quien se encarga del estudio de títulos, redacción e inscripción en el Registro de la Propiedad.' },
        { '@type': 'HowToStep', position: 2, name: isEn ? 'Pre-deed preparation (2–4 weeks)' : 'Pre-escritura (2–4 semanas)', text: isEn ? 'The notary requests certificates from the Property Registry, AFIP, and other agencies verifying ownership, debts, and liens on the property.' : 'El escribano solicita informes al Registro de la Propiedad, AFIP y otros organismos para verificar dominio, deudas e inhibiciones del inmueble.' },
        { '@type': 'HowToStep', position: 3, name: isEn ? 'Determine the declared value' : 'Determinar el valor escriturado', text: isEn ? 'The declared value determines the tax base for stamp duties and the ITI tax. The current recommendation is to declare the real sale price to avoid future tax issues.' : 'El valor escriturado determina la base imponible para sellos e ITI. La recomendación actual es escriturar al valor real para evitar problemas impositivos futuros.' },
        { '@type': 'HowToStep', position: 4, name: isEn ? 'Sign the deed' : 'Firma del acto de escritura', text: isEn ? 'Buyer and seller (or their authorized representatives) sign before the notary. The buyer pays the balance in USD. Fees and taxes are paid at this stage.' : 'Comprador y vendedor (o sus apoderados) firman ante el escribano. Se paga el saldo en USD y se abonan honorarios e impuestos en ese acto.' },
        { '@type': 'HowToStep', position: 5, name: isEn ? 'Pay buyer costs (~3.3–4% of price)' : 'Pagar los gastos del comprador (~3,3–4% del precio)', text: isEn ? 'Buyer pays: notary fees (1.5–2%), provincial stamp duty (1.5%), Property Registry inscription (0.3–0.5%), and certificates (USD 100–200 flat).' : 'El comprador paga: honorarios del escribano (1,5–2%), sellado provincial (1,5%), inscripción registral (0,3–0,5%) y certificados (USD 100–200 fijo).' },
        { '@type': 'HowToStep', position: 6, name: isEn ? 'Registry inscription and title transfer' : 'Inscripción registral y transferencia del dominio', text: isEn ? 'The notary files the deed in the Property Registry. Within 15–30 days the buyer is officially registered as the legal owner of the property.' : 'El escribano inscribe la escritura en el Registro de la Propiedad. En 15–30 días el comprador queda registrado oficialmente como nuevo titular del inmueble.' },
      ],
    },
  };

  const howToLd = howToSchemas[post.slug] ?? null;

  const blogPostingLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title[isEn ? 'en' : 'es'],
    description: post.excerpt[isEn ? 'en' : 'es'],
    image: post.coverImage,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Mudate', url: BASE },
    publisher: { '@type': 'Organization', name: 'Mudate', url: BASE, '@id': `${BASE}/#organization` },
    keywords: post.tags.join(', '),
    inLanguage: isEn ? 'en' : 'es-AR',
    wordCount: post.readTime * 200,
    articleSection: clusterSection,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title[isEn ? 'en' : 'es'], item: postUrl },
    ],
  };

  return (
    <div style={{ background: 'var(--background)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {howToLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        <Image src={post.coverImage} alt={post.title[isEn ? 'en' : 'es']} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(19,78,74,0.3) 0%, rgba(19,78,74,0.85) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-white transition-colors">{isEn ? 'Home' : 'Inicio'}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{post.title[isEn ? 'en' : 'es'].slice(0, 40)}…</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs px-2 py-1 rounded-full text-white font-medium" style={{ background: clusterLabels[post.cluster].color }}>
              {clusterLabels[post.cluster].label}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/70">
              <Clock size={12} /> {post.readTime} {isEn ? 'min read' : 'min de lectura'}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/70">
              <Calendar size={12} /> {formatDate(post.publishedAt, locale)}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
            {post.title[isEn ? 'en' : 'es']}
          </h1>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2">
            <Link href="/blog" className="inline-flex items-center gap-2 mb-6 text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              <ArrowLeft size={16} /> {isEn ? 'Back to blog' : 'Volver al blog'}
            </Link>
            <p className="text-base font-light leading-relaxed mb-6 text-lg" style={{ color: 'var(--muted-foreground)' }}>
              {post.excerpt[isEn ? 'en' : 'es']}
            </p>
            <div className="prose-custom">
              {renderContent(post.content[isEn ? 'en' : 'es'])}
            </div>
            {/* Ver también */}
            {related.length > 0 && (
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-xs font-light mb-4" style={{ color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {isEn ? 'See also' : 'Ver también'}
                </p>
                <div className="flex flex-col gap-3">
                  {related.slice(0, 3).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="flex items-start gap-3 rounded-xl p-4 hover:-translate-y-0.5 transition-all"
                      style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImage} alt={p.title[isEn ? 'en' : 'es']} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold leading-snug mb-1" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                          {p.title[isEn ? 'en' : 'es']}
                        </p>
                        <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                          {p.excerpt[isEn ? 'en' : 'es'].slice(0, 100)}…
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: 'var(--border)', color: 'var(--primary)' }}>
                  <Tag size={11} />{tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA */}
            <div className="glass rounded-2xl p-5 sticky top-24">
              <p className="text-xs font-light mb-1" style={{ color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {isEn ? 'Ready to invest?' : '¿Listo para invertir?'}
              </p>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                {isEn ? 'Browse our properties' : 'Consultá nuestras propiedades'}
              </h3>
              <p className="text-xs font-light mb-4" style={{ color: 'var(--muted-foreground)' }}>
                {isEn
                  ? 'Find the ideal property with real market data.'
                  : 'Encontrá la propiedad ideal con datos reales de mercado.'}
              </p>
              <Link href="/propiedades" className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white mb-2" style={{ background: 'var(--primary)' }}>
                {isEn ? 'View properties' : 'Ver propiedades'}
              </Link>
              <Link href="/invertir" className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                {isEn ? 'Investment analysis' : 'Análisis de inversión'}
              </Link>
            </div>

            {/* City hub link */}
            {post.ciudad && (
              <div className="rounded-2xl p-5" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  <p className="text-xs font-light" style={{ color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {isEn ? 'City hub' : 'Hub de ciudad'}
                  </p>
                </div>
                <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>
                  {isEn ? `Invest in ${post.ciudad}` : `Invertir en ${post.ciudad}`}
                </p>
                <Link
                  href={`/${post.ciudad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                  className="block w-full text-center py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  {isEn ? `View ${post.ciudad} hub` : `Ver hub ${post.ciudad}`}
                </Link>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div>
                <p className="text-xs font-light mb-3" style={{ color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {isEn ? 'Related articles' : 'Artículos relacionados'}
                </p>
                <div className="space-y-4">
                  {related.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all" style={{ background: 'white', boxShadow: 'var(--shadow-sm)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImage} alt={p.title[isEn ? 'en' : 'es']} className="w-full h-28 object-cover" />
                      <div className="p-3">
                        <p className="text-xs font-semibold leading-snug" style={{ fontFamily: 'Cinzel, serif', color: 'var(--foreground)' }}>{p.title[isEn ? 'en' : 'es']}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

    </div>
  );
}
