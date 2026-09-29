import { unstable_cache } from "next/cache";
import {
  getConfiguracionSitio,
  getRedesSocialesActivas,
  getCategoriasActivas,
  getProductosActivos,
  getProductosDestacados,
  getTestimoniosActivos,
  getProyectosActivos,
  getFaqsActivas,
  getServiciosActivos,
  getMetricasActivas,
  getPasosDisenoActivos,
  getMarqueeItemsActivos,
  getHomeBannersActivos,
} from "@/lib/queries";

/**
 * Consultas publicas CACHEADAS.
 *
 * La web publica lee contenido que cambia poco. En lugar de consultar la base
 * de datos (que esta en Oregon) en cada navegacion, cacheamos los resultados y
 * los reutilizamos. El cache se invalida por "tag" cuando el admin edita algo
 * (ver revalidateTag en las server actions del panel).
 *
 * Tags:
 *  - "config"      -> configuracion del sitio
 *  - "redes"       -> redes sociales
 *  - "categorias"  -> categorias
 *  - "catalogo"    -> productos
 *  - "testimonios" -> testimonios
 *  - "proyectos"   -> proyectos
 */

export const CACHE_TAGS = {
  config: "config",
  redes: "redes",
  categorias: "categorias",
  catalogo: "catalogo",
  testimonios: "testimonios",
  proyectos: "proyectos",
  faqs: "faqs",
  servicios: "servicios",
  metricas: "metricas",
  pasosDiseno: "pasos-diseno",
  marquee: "marquee",
  banners: "banners",
} as const;

// Revalidacion de seguridad: aunque no se invalide por tag, se refresca cada 5 min.
const REVALIDATE_SECONDS = 300;

export const getConfiguracionSitioCached = unstable_cache(
  () => getConfiguracionSitio(),
  ["configuracion-sitio"],
  { tags: [CACHE_TAGS.config], revalidate: REVALIDATE_SECONDS },
);

export const getRedesSocialesCached = unstable_cache(
  () => getRedesSocialesActivas(),
  ["redes-sociales"],
  { tags: [CACHE_TAGS.redes], revalidate: REVALIDATE_SECONDS },
);

export const getCategoriasCached = unstable_cache(
  () => getCategoriasActivas(),
  ["categorias-activas"],
  { tags: [CACHE_TAGS.categorias], revalidate: REVALIDATE_SECONDS },
);

export const getProductosCached = unstable_cache(
  () => getProductosActivos(),
  ["productos-activos"],
  { tags: [CACHE_TAGS.catalogo], revalidate: REVALIDATE_SECONDS },
);

export const getProductosDestacadosCached = unstable_cache(
  () => getProductosDestacados(),
  ["productos-destacados"],
  { tags: [CACHE_TAGS.catalogo], revalidate: REVALIDATE_SECONDS },
);

export const getTestimoniosCached = unstable_cache(
  () => getTestimoniosActivos(),
  ["testimonios-activos"],
  { tags: [CACHE_TAGS.testimonios], revalidate: REVALIDATE_SECONDS },
);

export const getProyectosCached = unstable_cache(
  () => getProyectosActivos(),
  ["proyectos-activos"],
  { tags: [CACHE_TAGS.proyectos], revalidate: REVALIDATE_SECONDS },
);

export const getFaqsCached = unstable_cache(
  () => getFaqsActivas(),
  ["faqs-activas"],
  { tags: [CACHE_TAGS.faqs], revalidate: REVALIDATE_SECONDS },
);

export const getServiciosCached = unstable_cache(
  () => getServiciosActivos(),
  ["servicios-activos"],
  { tags: [CACHE_TAGS.servicios], revalidate: REVALIDATE_SECONDS },
);

export const getMetricasCached = unstable_cache(
  () => getMetricasActivas(),
  ["metricas-activas"],
  { tags: [CACHE_TAGS.metricas], revalidate: REVALIDATE_SECONDS },
);

export const getPasosDisenoCached = unstable_cache(
  () => getPasosDisenoActivos(),
  ["pasos-diseno-activos"],
  { tags: [CACHE_TAGS.pasosDiseno], revalidate: REVALIDATE_SECONDS },
);

export const getMarqueeItemsCached = unstable_cache(
  () => getMarqueeItemsActivos(),
  ["marquee-items-activos"],
  { tags: [CACHE_TAGS.marquee], revalidate: REVALIDATE_SECONDS },
);

export const getBannersMobiliarioCached = unstable_cache(
  () => getHomeBannersActivos("mobiliario"),
  ["home-banners-mobiliario"],
  { tags: [CACHE_TAGS.banners], revalidate: REVALIDATE_SECONDS },
);

export const getBannersColeccionesCached = unstable_cache(
  () => getHomeBannersActivos("colecciones"),
  ["home-banners-colecciones"],
  { tags: [CACHE_TAGS.banners], revalidate: REVALIDATE_SECONDS },
);
