import { unstable_cache } from "next/cache";
import {
  getConfiguracionSitio,
  getRedesSocialesActivas,
  getCategoriasActivas,
  getProductosActivos,
  getProductosDestacados,
  getTestimoniosActivos,
  getProyectosActivos,
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
