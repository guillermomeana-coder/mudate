export interface BlogPost {
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

import capRateCordoba2025 from './cap-rate-cordoba-2025.json';
import invertirDepartamentosCordobaVsCaba from './invertir-departamentos-cordoba-vs-caba.json';
import rentabilidadVillaCarlosPaz from './rentabilidad-villa-carlos-paz.json';
import mejoresBarriosNuevaCordoba from './mejores-barrios-nueva-cordoba.json';
import mercadoInmobiliarioVillaMaria2025 from './mercado-inmobiliario-villa-maria-2025.json';
import comprarDepartamentoVillaMaria from './comprar-departamento-villa-maria.json';
import barriosVillaMariaDondeInvertir from './barrios-villa-maria-donde-invertir.json';
import comoComprarPropiedadArgentina2025 from './como-comprar-propiedad-argentina-2025.json';
import escrituraInmuebleArgentina from './escritura-inmueble-argentina.json';
import dolarPropiedadesArgentina from './dolar-propiedades-argentina.json';
import hipotecasCreditosProcrearCordoba from './hipotecas-creditos-procrear-cordoba.json';
import gastosCompraventaInmuebleCordoba from './gastos-compraventa-inmueble-cordoba.json';
import mercadoInmobiliarioBuenosAires2025 from './mercado-inmobiliario-buenos-aires-2025.json';
import invertirBarilochePagoniaRentalVacacional from './invertir-bariloche-patagonia-rental-vacacional.json';
import propiedadesMendozaInversionVinoAndes from './propiedades-mendoza-inversion-vino-andes.json';
import mercadoInmobiliarioRosario2025 from './mercado-inmobiliario-rosario-2025.json';
import invertirSaltaNoaTurismoLitio from './invertir-salta-noa-turismo-litio.json';
import neuquenVacaMuertaPropiedadesInversion from './neuquen-vaca-muerta-propiedades-inversion.json';
import propiedadesMarDelPlataInversionVacacional from './propiedades-mar-del-plata-inversion-vacacional.json';
import invertirTucumanArgentinaMercadoUniversitario from './invertir-tucuman-argentina-mercado-universitario.json';
import mejorCiudadParaInvertirArgentina2025 from './mejor-ciudad-para-invertir-argentina-2025.json';
import comoComprarPropiedadArgentinaExtranjeros from './como-comprar-propiedad-argentina-extranjeros.json';
import venderCabaComprarInteriorArgentina from './vender-caba-comprar-interior-argentina.json';
import rentabilidadAlquilerTemporalArgentina2025 from './rentabilidad-alquiler-temporal-argentina-2025.json';
import primerPropiedadArgentinaGuia2026 from './primer-propiedad-argentina-guia-2026.json';
import creditoHipotecarioUveArgentina2025 from './credito-hipotecario-uve-argentina-2025.json';
import barriosPalermoNorteCordobaInversion from './barrios-palermo-norte-cordoba-inversion.json';
import expatGuideBuyPropertyArgentina2026 from './expat-guide-buy-property-argentina-2026.json';
import alquilerTemporarioAirbnbArgentina2026 from './alquiler-temporario-airbnb-argentina-2026.json';
import impuestosPropiedadesArgentinaGuia from './impuestos-propiedades-argentina-guia.json';
import mejoresZonasNeuquenVacaMuerta2026 from './mejores-zonas-neuquen-vaca-muerta-2026.json';
import departamentoPozoCordobaVentajas from './departamento-pozo-cordoba-ventajas.json';
import guiaExpatMudarseArgentina2026 from './guia-expat-mudarse-argentina-2026.json';
import mercadoInmobiliarioBariloche2026 from './mercado-inmobiliario-bariloche-2026.json';
import comoTasarPropiedadArgentina from './como-tasar-propiedad-argentina.json';
import invertirTerrenosArgentinaLotes from './invertir-terrenos-argentina-lotes.json';
import fideicomisoInmobiliarioArgentina from './fideicomiso-inmobiliario-argentina.json';
import villaMariaVsCordobaCapitalInversion from './villa-maria-vs-cordoba-capital-inversion.json';
import ciudadaniaPorInversionArgentinaGoldenVisa2026 from './ciudadania-por-inversion-argentina-golden-visa-2026.json';
import goldenVisaArgentinaInvertirPropiedades2026 from './golden-visa-argentina-invertir-propiedades-2026.json';
import pasaporteArgentinoMasPoderoso2026 from './pasaporte-argentino-mas-poderoso-latinoamerica-2026.json';

const allPosts: BlogPost[] = [
  capRateCordoba2025 as BlogPost,
  invertirDepartamentosCordobaVsCaba as BlogPost,
  rentabilidadVillaCarlosPaz as BlogPost,
  mejoresBarriosNuevaCordoba as BlogPost,
  mercadoInmobiliarioVillaMaria2025 as BlogPost,
  comprarDepartamentoVillaMaria as BlogPost,
  barriosVillaMariaDondeInvertir as BlogPost,
  comoComprarPropiedadArgentina2025 as BlogPost,
  escrituraInmuebleArgentina as BlogPost,
  dolarPropiedadesArgentina as BlogPost,
  hipotecasCreditosProcrearCordoba as BlogPost,
  gastosCompraventaInmuebleCordoba as BlogPost,
  mercadoInmobiliarioBuenosAires2025 as BlogPost,
  invertirBarilochePagoniaRentalVacacional as BlogPost,
  propiedadesMendozaInversionVinoAndes as BlogPost,
  mercadoInmobiliarioRosario2025 as BlogPost,
  invertirSaltaNoaTurismoLitio as BlogPost,
  neuquenVacaMuertaPropiedadesInversion as BlogPost,
  propiedadesMarDelPlataInversionVacacional as BlogPost,
  invertirTucumanArgentinaMercadoUniversitario as BlogPost,
  mejorCiudadParaInvertirArgentina2025 as BlogPost,
  comoComprarPropiedadArgentinaExtranjeros as BlogPost,
  venderCabaComprarInteriorArgentina as BlogPost,
  rentabilidadAlquilerTemporalArgentina2025 as BlogPost,
  primerPropiedadArgentinaGuia2026 as BlogPost,
  creditoHipotecarioUveArgentina2025 as BlogPost,
  barriosPalermoNorteCordobaInversion as BlogPost,
  expatGuideBuyPropertyArgentina2026 as BlogPost,
  alquilerTemporarioAirbnbArgentina2026 as BlogPost,
  impuestosPropiedadesArgentinaGuia as BlogPost,
  mejoresZonasNeuquenVacaMuerta2026 as BlogPost,
  departamentoPozoCordobaVentajas as BlogPost,
  guiaExpatMudarseArgentina2026 as BlogPost,
  mercadoInmobiliarioBariloche2026 as BlogPost,
  comoTasarPropiedadArgentina as BlogPost,
  invertirTerrenosArgentinaLotes as BlogPost,
  fideicomisoInmobiliarioArgentina as BlogPost,
  villaMariaVsCordobaCapitalInversion as BlogPost,
  ciudadaniaPorInversionArgentinaGoldenVisa2026 as BlogPost,
  goldenVisaArgentinaInvertirPropiedades2026 as BlogPost,
  pasaporteArgentinoMasPoderoso2026 as BlogPost,
];

/**
 * Get all blog posts sorted by publishedAt descending (newest first).
 */
export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single blog post by slug.
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/**
 * Get all blog posts that belong to a given cluster.
 */
export function getPostsByCluster(cluster: string): BlogPost[] {
  return allPosts
    .filter((p) => p.cluster === cluster)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Get all unique slugs (useful for generateStaticParams).
 */
export function getAllSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}
