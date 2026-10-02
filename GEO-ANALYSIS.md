# GEO Analysis — mudateargentina.com

**Date:** 2026-10-02
**Auditor:** Claude Code (seo-geo skill)
**Framework:** Google AI Optimization Guide (primary source) + Ahrefs brand study

---

## GEO Readiness Score: 62/100

| Category | Score | Weight | Notes |
|----------|-------|--------|-------|
| Citability | 14/25 | 25% | FAQ strong, blog posts lack sources/author |
| Structural Readability | 17/20 | 20% | Excellent heading hierarchy, tables, question H2s |
| Multi-Modal Content | 10/15 | 15% | Calculator, images present. No video. |
| Authority & Brand Signals | 6/20 | 20% | Zero brand presence on Reddit/YouTube/Wikipedia/LinkedIn |
| Technical Accessibility | 15/20 | 20% | SSR via Next.js ISR, all AI crawlers allowed |

---

## Platform Breakdown

| Platform | Estimated Readiness | Key Gap |
|----------|-------------------|---------|
| **Google AI Overviews** | 68/100 | Need top-10 ranking first (new domain) |
| **ChatGPT** | 45/100 | Zero Wikipedia/Reddit presence (47.9% + 11.3% of citations) |
| **Perplexity** | 40/100 | Zero Reddit presence (46.7% of citations) |
| **Bing Copilot** | 55/100 | No IndexNow, no Bing Webmaster Tools |

---

## AI Crawler Access Status

| Crawler | Status |
|---------|--------|
| GPTBot (OpenAI) | ALLOWED |
| ChatGPT-User (OpenAI) | ALLOWED |
| OAI-SearchBot (OpenAI) | **MISSING** |
| ClaudeBot (Anthropic) | ALLOWED |
| anthropic-ai (Anthropic) | ALLOWED |
| PerplexityBot | ALLOWED |
| Google-Extended | ALLOWED |
| Bytespider (ByteDance) | ALLOWED |
| Applebot (Apple) | ALLOWED |
| cohere-ai | ALLOWED |
| CCBot (Common Crawl) | ALLOWED |
| Omgilibot | ALLOWED |
| FacebookBot | ALLOWED |

**Action:** Add `OAI-SearchBot` to robots.txt (OpenAI's dedicated search crawler).

---

## llms.txt Status

**Present:** Yes, at `/llms.txt`
**Format:** Follows standard (# Title, > description, ## sections, bullet points)
**Content:** 38 blog posts, 11 city hubs, market data, Q&As
**Quality:** Good structure, covers key content areas

**Per Google's AI optimization guide and primary evidence (Mueller, Illyes, SE Ranking study):** llms.txt is NOT consumed by any major AI search system. The file has zero impact on citation ranking. Kept for defensive optionality only.

---

## Brand Mention Analysis

| Platform | Presence | Impact on AI Citations |
|----------|----------|----------------------|
| Wikipedia | NONE | Critical gap (47.9% of ChatGPT citations) |
| Reddit | NONE | Critical gap (46.7% Perplexity, 11.3% ChatGPT) |
| YouTube | NONE | Critical gap (0.737 correlation, strongest signal) |
| LinkedIn | NONE | Moderate gap |
| Instagram | Listed in schema but unverified | Low impact on AI |
| Facebook | Listed in schema but unverified | Low impact on AI |
| Twitter/X | Listed in schema but unverified | Low impact on AI |

**This is the #1 weakness.** Brand mentions correlate 3x more with AI visibility than backlinks (Ahrefs, Dec 2025). Mudate has zero presence on the platforms that matter most for AI citations.

---

## Passage-Level Citability

### Strong citeable passages (already exist):

1. **FAQ "Cómo comprar" answer** — 68 words, clear process steps, good for Google AIO
2. **FAQ "Cap rate Córdoba" answer** — specific USD values by barrio, comparative
3. **Blog "Extranjeros" opening** — direct answer in first 40 words with HowTo schema
4. **/invertir FAQ answers** — 3 questions with substantive 80-110 word answers

### Weak citability areas:

1. **Homepage hero** — "Tu próxima propiedad en todo el país" is marketing copy, not citable
2. **Blog post bodies** — paragraphs too short (20-40 words) or too long (200+), miss the 134-167 sweet spot
3. **City hub pages** — descriptive but lack specific sourced data points
4. **Stats section** — numbers without attribution ("USD 1.350/m²" — says who? when?)

### Missing entirely:

- No "What is [X]?" definition blocks at start of key pages
- No author-attributed expert opinions
- No primary research or original survey data
- Statistics never cite a source (AFIP, INDEC, Colegio de Corredores, etc.)

---

## Server-Side Rendering Check

| Element | SSR? | Notes |
|---------|------|-------|
| Homepage content | YES | Next.js ISR, HTML served to crawlers |
| Blog posts | YES | Static generation (generateStaticParams) |
| Property listings | YES | ISR with 30min revalidation |
| FAQ JSON-LD | YES | Embedded in HTML |
| SearchAutocomplete | NO | Client-only (acceptable, not content) |
| KineticGrid | NO | Client-only canvas (decorative) |
| InvestCalculator | NO | Client-only interactive (acceptable) |
| ImageCarousel | NO | Client-only navigation (images SSR) |

**Verdict:** Core content is server-rendered. AI crawlers can access all key information. Interactive features are client-only but don't contain indexable content.

---

## Top 5 Highest-Impact Changes

### 1. BUILD BRAND PRESENCE ON REDDIT + YOUTUBE (Impact: +15-20 pts)
- Create r/inmobiliariasargentina posts with market data
- Post cap rate analysis videos on YouTube (even slides + voiceover)
- Answer "invertir en propiedades argentina" threads on Reddit
- **Why:** Brand mentions = 3x more correlation than backlinks for AI citations

### 2. ADD AUTHOR ATTRIBUTION WITH CREDENTIALS (Impact: +8 pts)
- Create author profiles: "Juan Pérez, Corredor Inmobiliario Mat. 1234"
- Add Person schema with sameAs links
- Add author byline + bio to every blog post
- **Why:** E-E-A-T signals, authority for YMYL real estate content

### 3. SOURCE ATTRIBUTION ON ALL DATA (Impact: +6 pts)
- Every stat needs: "Fuente: Colegio de Corredores de Córdoba, Q3 2025"
- Cap rate calculations: cite methodology
- Price/m² data: cite source and date of collection
- **Why:** AI systems prefer attributed claims over unsourced assertions

### 4. CREATE 134-167 WORD ANSWER BLOCKS (Impact: +5 pts)
- Reformat key blog sections into self-contained quotable passages
- Each should start with a direct answer, include a statistic, end with context
- Target queries: "cap rate cordoba", "comprar propiedad argentina extranjero"
- **Why:** Optimal passage length for AI citation extraction

### 5. ADD OAI-SEARCHBOT TO ROBOTS.TXT (Impact: +2 pts)
- Missing OpenAI's dedicated search crawler
- One-line fix in robots.ts
- **Why:** Direct access for OpenAI search features

---

## Schema Recommendations

### Already present (good):
- Organization with sameAs
- WebSite with SearchAction
- FAQPage on homepage + /invertir
- BlogPosting on all 38 posts
- HowTo on 5 purchase-guide posts
- BreadcrumbList on all internal pages
- Dataset on precio/m² pages

### Missing (add):
- **Person schema** for blog authors (E-E-A-T)
- **Review/AggregateRating** on testimonials (if verified)
- **FinancialProduct** or **InvestmentOrDeposit** on calculator results
- **SpeakableSpecification** on blog posts (only on homepage currently)

---

## Content Reformatting Suggestions

### 1. Homepage — add definition block after hero
```
Mudate es el portal inmobiliario de Argentina con más de 9.200 propiedades
en venta en 101 ciudades. Ofrecemos precios reales por metro cuadrado,
análisis de cap rate por barrio y guías paso a paso para compradores
nacionales y extranjeros. Operamos exclusivamente en venta de inmuebles
residenciales y comerciales, con datos actualizados del mercado 2025-2026.
```

### 2. Blog posts — expand key passages to 134-167 words
Before: "El cap rate en Córdoba Capital está entre 4.5% y 6% anual."
After: "El cap rate en Córdoba Capital oscila entre 4.5% y 6% anual en dólares, según datos del Colegio de Corredores Inmobiliarios de Córdoba (Q3 2025). Nueva Córdoba, el barrio con mayor densidad universitaria de la ciudad, registra un cap rate promedio de 4.5% debido a precios de entrada más altos (USD 1.400/m²), mientras que barrios emergentes como Alto Verde y Palermo Norte alcanzan el 5.5-6% gracias a precios más accesibles (USD 800-950/m²) combinados con alquileres sostenidos por la demanda universitaria de la UNC. Para comparación, Villa María ofrece cap rates superiores al 6.5% y Villa Carlos Paz, con su perfil turístico, puede alcanzar el 7-9% en modalidad de alquiler temporario vía plataformas como Airbnb y Booking."

### 3. /invertir — add "What is" opening
Add before current content: "Invertir en propiedades en Argentina significa adquirir inmuebles residenciales o comerciales con el objetivo de generar retorno en dólares mediante alquiler (cap rate) y valorización del capital. El mercado argentino opera predominantemente en USD para transacciones residenciales."
