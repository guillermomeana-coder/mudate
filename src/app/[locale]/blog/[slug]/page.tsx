import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

interface BlogPost {
  slug: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  content: { es: string; en: string };
  cluster: 'A' | 'B' | 'C';
  ciudad?: string;
  readTime: number;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  author: string;
}

const posts: BlogPost[] = [
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
    content: {
      es: `
## ¿Qué es el cap rate y por qué importa?

El **cap rate** (capitalización rate) es el indicador más usado para medir la rentabilidad de una inversión inmobiliaria. Se calcula dividiendo el ingreso anual neto por el precio de compra del inmueble.

Un cap rate del 6% significa que recuperás tu inversión en aproximadamente 16-17 años, suponiendo que el valor del inmueble no cambia. En la práctica, si el inmueble se valoriza, el retorno total es aún mayor.

## Cap rates en Córdoba Capital (2025)

| Barrio | Precio m² | Alquiler 2amb/mes | Cap rate estimado |
|--------|-----------|-------------------|-------------------|
| Nueva Córdoba | USD 1.400 | $350.000 ARS | 4.5% |
| Güemes | USD 1.100 | $280.000 ARS | 5.2% |
| General Paz | USD 1.200 | $300.000 ARS | 5.0% |
| Palermo Norte | USD 950 | $240.000 ARS | 5.5% |
| Alto Verde | USD 800 | $200.000 ARS | 6.0% |

*Nota: los alquileres se expresan en ARS. El cap rate se calcula convirtiendo a USD al tipo de cambio oficial + 15% de margen.*

## Villa María: la sorpresa del mercado interior

Villa María ofrece los mejores cap rates de la provincia para quienes buscan invertir en mercados emergentes:

- **Centro:** 6.5% cap rate — alta demanda universitaria (UNVM)
- **Norte:** 6.8% cap rate — zona familiar en expansión
- **Promedio ciudad:** 6.7% vs 5% de Córdoba Capital

La brecha se explica por precios más accesibles con alquileres que no bajan proporcionalmente, dada la fuerte demanda universitaria.

## Villa Carlos Paz: rentabilidad turística

El destino vacacional número 1 de Córdoba tiene su propia lógica:

- Alquiler anual: cap rate 5.5-6%
- Alquiler **temporal/turístico** (Airbnb/Booking): cap rate 7-9%
- La clave está en la gestión activa del alquiler vacacional

## Conclusión: dónde invertir según tu perfil

- **Inversor conservador (baja gestión):** Córdoba Capital, Nueva Córdoba — demanda permanente, sin vacancia
- **Inversor activo (mayor retorno):** Villa María Centro o Villa Carlos Paz — más gestión, más rentabilidad
- **Especulativo (valorización):** Güemes y Alberdi en Córdoba — zonas en plena gentrificación
      `,
      en: `
## What is the cap rate and why does it matter?

The **cap rate** (capitalization rate) is the most widely used metric for measuring real estate investment returns. It's calculated by dividing the annual net income by the purchase price of the property.

A cap rate of 6% means you recover your investment in approximately 16-17 years, assuming the property's value stays constant. In practice, if the property appreciates, the total return is even higher.

## Cap Rates in Córdoba Capital (2025)

| Neighborhood | Price/m² | 2-bed rent/month | Estimated cap rate |
|---|---|---|---|
| Nueva Córdoba | USD 1,400 | $350,000 ARS | 4.5% |
| Güemes | USD 1,100 | $280,000 ARS | 5.2% |
| General Paz | USD 1,200 | $300,000 ARS | 5.0% |
| Palermo Norte | USD 950 | $240,000 ARS | 5.5% |
| Alto Verde | USD 800 | $200,000 ARS | 6.0% |

*Note: rents are in ARS. Cap rate is calculated converting to USD at the official exchange rate + 15% margin.*

## Villa María: The Interior Market Surprise

Villa María offers the best cap rates in the province for investors looking at emerging markets:

- **Centro:** 6.5% cap rate — high university demand (UNVM)
- **Norte:** 6.8% cap rate — growing family residential area
- **City average:** 6.7% vs 5% in Córdoba Capital

The gap is explained by more accessible prices combined with rents that don't fall proportionally, driven by strong student demand.

## Villa Carlos Paz: Tourism-Driven Yields

Córdoba's top vacation destination follows its own logic:

- Annual rental: 5.5-6% cap rate
- **Vacation/tourist rental** (Airbnb/Booking): 7-9% cap rate
- The key is active short-term rental management

## Conclusion: Where to Invest Based on Your Profile

- **Conservative investor (low management):** Córdoba Capital, Nueva Córdoba — permanent demand, near-zero vacancy
- **Active investor (higher return):** Villa María Centro or Villa Carlos Paz — more management, more returns
- **Speculative (appreciation):** Güemes and Alberdi in Córdoba — neighborhoods undergoing gentrification
      `,
    },
    cluster: 'A',
    readTime: 7,
    publishedAt: '2025-09-01',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80',
    tags: ['inversión', 'cap rate', 'análisis'],
    author: 'Equipo Mudate',
  },
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
    content: {
      es: `
## Villa María: el mercado que el interior de Argentina no conoce

Villa María es la segunda ciudad de la provincia de Córdoba y el principal centro económico del centro-sur de Argentina. Con más de 100.000 habitantes y un polo universitario que suma más de 15.000 estudiantes (UNVM), la demanda de alquileres es estructuralmente alta.

## Precios actuales (Q3 2025)

| Tipo | Superficie | Precio USD |
|------|-----------|------------|
| Departamento 1 ambiente | 35-45 m² | USD 45.000-55.000 |
| Departamento 2 ambientes | 55-70 m² | USD 65.000-75.000 |
| Departamento 3 ambientes | 75-90 m² | USD 90.000-110.000 |
| Casa 3 dormitorios | 130-160 m² | USD 110.000-140.000 |
| Casa en barrio privado | 150-200 m² | USD 130.000-180.000 |

El promedio general de departamentos se ubica en **USD 90.721** según datos de ZonaProp (agosto 2025).

## Por qué Villa María supera las expectativas

### 1. Universidad Nacional de Villa María (UNVM)
La UNVM es un motor constante de demanda de alquileres. Con 15.000 estudiantes activos, muchos provenientes de ciudades vecinas (San Francisco, Bell Ville, Río Tercero), la vacancia en departamentos céntricos es prácticamente nula.

### 2. Conectividad estratégica
Villa María está ubicada en el cruce de la Ruta Nacional 158 y la Autopista Córdoba-Rosario. Esta conectividad favorece el crecimiento industrial y logístico que empuja la demanda de vivienda.

### 3. Precios 40% menores que Córdoba Capital
El mismo departamento que en Nueva Córdoba vale USD 120.000, en Villa María Centro cuesta USD 70.000. Esta brecha de precio no se refleja proporcionalmente en los alquileres, lo que genera mayor rentabilidad.

## Zonas recomendadas para invertir

- **Centro:** mayor demanda, mayor liquidez, menor vacancia
- **Barrio Palermo:** zona universitaria, alta rotación de inquilinos estudiantes
- **Norte:** desarrollo residencial para familias, valorización a largo plazo

## Proyección 2026

Se espera que los precios continúen su tendencia alcista, con un crecimiento estimado del 15-20% en USD para 2026, impulsado por el retorno del crédito hipotecario y la mayor demanda de sectores medios.
      `,
      en: `
## Villa María: The Interior Argentine Market Most Don't Know About

Villa María is the second city in Córdoba province and the main economic hub of central-southern Argentina. With over 100,000 residents and a university cluster of more than 15,000 students (UNVM), rental demand is structurally high.

## Current Prices (Q3 2025)

| Type | Size | USD Price |
|------|------|-----------|
| Studio apartment | 35-45 m² | USD 45,000-55,000 |
| 2-bedroom apartment | 55-70 m² | USD 65,000-75,000 |
| 3-bedroom apartment | 75-90 m² | USD 90,000-110,000 |
| 3-bedroom house | 130-160 m² | USD 110,000-140,000 |
| Gated community house | 150-200 m² | USD 130,000-180,000 |

The overall average for apartments sits at **USD 90,721** according to ZonaProp data (August 2025).

## Why Villa María Exceeds Expectations

### 1. National University of Villa María (UNVM)
The UNVM is a constant driver of rental demand. With 15,000 active students — many from neighboring cities (San Francisco, Bell Ville, Río Tercero) — vacancy in central apartments is practically zero.

### 2. Strategic Connectivity
Villa María sits at the intersection of National Route 158 and the Córdoba-Rosario Highway. This connectivity drives industrial and logistics growth that pushes housing demand higher.

### 3. Prices 40% Lower than Córdoba Capital
The same apartment that costs USD 120,000 in Nueva Córdoba can be found in Villa María Centro for USD 70,000. This price gap doesn't translate proportionally to rents, generating higher investment returns.

## Recommended Investment Areas

- **Centro:** highest demand, most liquidity, lowest vacancy
- **Barrio Palermo:** university zone, high student tenant turnover
- **Norte:** residential development for families, long-term appreciation potential

## 2026 Outlook

Prices are expected to continue their upward trend, with an estimated 15-20% USD growth for 2026, driven by the return of mortgage credit and growing demand from the middle class.
      `,
    },
    cluster: 'B',
    ciudad: 'Villa María',
    readTime: 7,
    publishedAt: '2025-09-03',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    tags: ['Villa María', 'mercado', '2025'],
    author: 'Equipo Mudate',
  },
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
    content: {
      es: `
## ¿Pueden los extranjeros comprar propiedades en Argentina?

Sí. Argentina permite a cualquier extranjero —residente o no residente— comprar propiedades inmuebles. No hay restricciones de nacionalidad ni de monto mínimo de inversión.

## Pasos para comprar como extranjero

### 1. Obtener el CUIT/CUIL
Todo comprador de inmuebles en Argentina debe tener CUIT (Clave Única de Identificación Tributaria) o CUIL. Como extranjero, podés obtenerlo en la AFIP (Administración Federal de Ingresos Públicos) con tu pasaporte.

### 2. Abrir una cuenta bancaria (opcional pero recomendado)
Aunque no es obligatorio, facilita las operaciones. Los bancos argentinos aceptan extranjeros con pasaporte y CUIL.

### 3. Encontrar la propiedad y firmar la reserva
- Reserva: depósito del 1-3% del valor para sacar la propiedad del mercado
- Boleto de compraventa: contrato con el 30% del precio
- Escritura: transferencia final del 70% restante ante escribano público

### 4. Pago en dólares
El mercado argentino opera mayoritariamente en USD billete (dólares físicos). Las operaciones se realizan:
- En efectivo (el método más común)
- Mediante transferencia SWIFT desde el exterior
- Con criptomonedas (cada vez más aceptado)

### 5. Escritura pública
La escritura la realiza un **escribano público** (notario) designado generalmente por el comprador. Los honorarios representan aproximadamente el 2% del valor de la propiedad.

## Gastos totales al comprar

| Concepto | Porcentaje | Quién paga |
|----------|-----------|------------|
| Comisión inmobiliaria | 4% | Comprador (2%) y vendedor (2%) |
| Honorarios escribano | ~2% | Comprador |
| Impuesto ITI | 1.5% (si el vendedor no es habitacional) | Vendedor |
| Sellado provincial | ~1.5% | Ambos |
| Registro de Propiedad | ~0.5% | Comprador |

**Total gastos del comprador:** aproximadamente **4-5% del precio de venta**.

## Repatriación de fondos

Al momento de vender, el extranjero puede repatriar los fondos con las ganancias. Las regulaciones cambiarias argentinas son variables, por lo que se recomienda asesoramiento legal actualizado al momento de la operación.

## ¿Es seguro invertir en Argentina?

El riesgo soberano de Argentina es real, pero el mercado inmobiliario opera en dólares físicos con respaldo real en metros cuadrados. Las propiedades han mantenido su valor en USD históricamente, incluso durante las crisis de 2001-2002 y 2018-2019.
      `,
      en: `
## Can Foreigners Buy Property in Argentina?

Yes. Argentina allows any foreigner — resident or non-resident — to purchase real estate. There are no nationality restrictions or minimum investment amounts.

## Steps to Buy as a Foreigner

### 1. Obtain a CUIT/CUIL
Every property buyer in Argentina must have a CUIT (tax ID) or CUIL (social security number). As a foreigner, you can obtain one at AFIP (Argentina's Federal Tax Authority) using your passport.

### 2. Open a Bank Account (optional but recommended)
While not mandatory, it simplifies transactions. Argentine banks accept foreigners with a passport and CUIL.

### 3. Find the Property and Sign the Reservation
- Reservation: 1-3% deposit to take the property off the market
- Purchase contract (boleto de compraventa): binding agreement covering 30% of the price
- Title deed (escritura): final transfer of the remaining 70% before a public notary

### 4. Payment in Dollars
The Argentine market operates primarily in USD cash (physical dollars). Transactions are carried out:
- In cash (the most common method)
- Via SWIFT transfer from abroad
- With cryptocurrencies (increasingly accepted)

### 5. Public Title Deed
The deed is executed by a **public notary** (escribano), typically chosen by the buyer. Fees are approximately 2% of the property value.

## Total Buyer Costs

| Item | Percentage | Who Pays |
|------|-----------|----------|
| Real estate commission | 4% | Buyer (2%) and seller (2%) |
| Notary fees | ~2% | Buyer |
| ITI transfer tax | 1.5% (if seller's non-primary residence) | Seller |
| Provincial stamp duty | ~1.5% | Both |
| Property Registry fee | ~0.5% | Buyer |

**Total buyer costs:** approximately **4-5% of the purchase price**.

## Repatriating Funds

When selling, the foreigner can repatriate funds along with any gains. Argentine foreign exchange regulations change over time, so up-to-date legal advice is recommended at the moment of the transaction.

## Is Investing in Argentina Safe?

Argentina's sovereign risk is real, but the real estate market operates in physical US dollars backed by tangible square meters. Properties have historically maintained their USD value, even during the 2001-2002 and 2018-2019 economic crises.
      `,
    },
    cluster: 'C',
    readTime: 12,
    publishedAt: '2025-09-05',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    tags: ['extranjeros', 'comprar', 'legal'],
    author: 'Equipo Mudate',
  },
];

const allSlugs = [
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

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = posts.find((p) => p.slug === slug);
  const isEn = locale === 'en';
  if (!post) return { title: isEn ? 'Article not found — Mudate' : 'Artículo no encontrado — Mudate' };
  return {
    title: `${post.title[isEn ? 'en' : 'es']} — Mudate Blog`,
    description: post.excerpt[isEn ? 'en' : 'es'],
    openGraph: {
      title: post.title[isEn ? 'en' : 'es'],
      description: post.excerpt[isEn ? 'en' : 'es'],
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
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

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

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
  const post = posts.find((p) => p.slug === slug);

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

  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <div className="relative h-72 md:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverImage} alt={post.title[isEn ? 'en' : 'es']} className="w-full h-full object-cover" />
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

      {/* JSON-LD BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title[isEn ? 'en' : 'es'],
            description: post.excerpt[isEn ? 'en' : 'es'],
            image: post.coverImage,
            author: { '@type': 'Organization', name: 'Mudate' },
            publisher: {
              '@type': 'Organization',
              name: 'Mudate',
              url: 'https://mudateargentina.com',
            },
            datePublished: post.publishedAt,
            url: `https://mudateargentina.com${isEn ? '/en' : ''}/blog/${post.slug}`,
            inLanguage: isEn ? 'en' : 'es-AR',
            keywords: post.tags.join(', '),
          }),
        }}
      />
    </div>
  );
}
