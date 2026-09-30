import Image from "next/image";
import { getPaginaPorSlug } from "@/lib/queries";

export const metadata = { title: "Nosotros | Resplandecer" };

/**
 * Página "Nosotros" con diseño editorial tipo revista.
 *
 * El contenido es administrable desde el panel: Páginas de contenido >
 * Nuestra historia (slug "nuestra-historia"). Cada sección corresponde a un
 * bloque de contenido (subtitulo = título, contenido = texto, imagenUrl =
 * imagen), en este orden:
 *   bloque 0 -> NUESTRO ESTUDIO (hero con imagen de fondo)
 *   bloque 1 -> CREAMOS DISEÑO (imagen izquierda, texto derecha)
 *   bloque 2 -> SEBASTIÁN ARISMENDY (texto izquierda, imagen derecha)
 *
 * Si algún bloque falta o el contenido está incompleto, se usan los textos e
 * imágenes base (fallback) para que la página nunca se rompa.
 */

const FALLBACK = {
  titulo: "Nosotros",
  estudio: {
    titulo: "Nuestro estudio",
    texto:
      "Somos un espacio creativo dedicado al interiorismo y a la fabricación de mobiliario, especializado en descubrir y definir el estilo personal de cada cliente para transformar sus espacios de manera funcional y estética. Nuestro propósito va más allá de diseñar espacios; buscamos crear ambientes que cuenten historias, generen experiencias y reflejen la esencia de quienes los habitan. Por ello, trabajamos para convertir las ideas, necesidades y sueños de cada persona en espacios únicos, donde el diseño se convierte en una forma de vivir y sentir.",
    imagen: "/col-cocina.jpg",
  },
  diseno: {
    titulo: "Creamos diseño",
    texto:
      "En Resplandecer nos mueve la pasión por el diseño, los detalles, las texturas y los materiales. Esta sensibilidad nos impulsa a crear piezas de lujo, simbólicas y estéticas. Cada pieza y cada proyecto que desarrollamos refleja la historia, los gustos y las necesidades de nuestros clientes. Por ello, cada creación es hecha por manos artesanas que se sumergen en cada detalle con compromiso y amor, transformando materiales en piezas únicas que conectan con las personas y cuentan una historia propia.",
    imagen: "/serv-sofas.jpg",
  },
  fundador: {
    titulo: "Sebastián Arismendy",
    texto:
      "Soy diseñador industrial, especializado en desarrollo de producto. Mi trabajo se basa en idear propuestas hasta materializarlas. Mi pasión por el diseño nació durante mi infancia. Crecí en una finca junto a mis abuelos, donde gran parte de mis juegos consistía en explorar mi entorno, encontrar objetos y materiales, y transformarlos en algo nuevo y funcional. Asimismo, cada vez que llegaba a un espacio, sentía la necesidad de reorganizarlo para generar una experiencia diferente. De esos juegos nace la pasión por crear espacios que cuenten una historia.",
    imagen: "/serv-carpinteria.jpg",
  },
};

export default async function NosotrosPage() {
  const pagina = await getPaginaPorSlug("nuestra-historia");
  const bloques = pagina?.bloques ?? [];

  const titulo = pagina?.titulo?.trim() || FALLBACK.titulo;

  // Mapea cada sección a su bloque administrable (por orden), con fallback.
  const estudio = {
    titulo: bloques[0]?.subtitulo?.trim() || FALLBACK.estudio.titulo,
    texto: bloques[0]?.contenido?.trim() || FALLBACK.estudio.texto,
    imagen: bloques[0]?.imagenUrl || FALLBACK.estudio.imagen,
  };
  const diseno = {
    titulo: bloques[1]?.subtitulo?.trim() || FALLBACK.diseno.titulo,
    texto: bloques[1]?.contenido?.trim() || FALLBACK.diseno.texto,
    imagen: bloques[1]?.imagenUrl || FALLBACK.diseno.imagen,
  };
  const fundador = {
    titulo: bloques[2]?.subtitulo?.trim() || FALLBACK.fundador.titulo,
    texto: bloques[2]?.contenido?.trim() || FALLBACK.fundador.texto,
    imagen: bloques[2]?.imagenUrl || FALLBACK.fundador.imagen,
  };

  return (
    <main className="bg-white text-ink">
      {/* ── Título principal en franja blanca ── */}
      <section className="bg-white px-6 py-[clamp(3.5rem,9vw,7.5rem)] text-center">
        <h1 className="font-serif uppercase text-[clamp(3rem,10vw,8rem)] font-normal leading-[0.9] tracking-[-0.04em] text-[#333]">
          {titulo}
        </h1>
      </section>

      {/* ── HERO: NUESTRO ESTUDIO ── */}
      <section
        aria-labelledby="nuestro-estudio-title"
        className="relative flex min-h-[clamp(520px,72vh,680px)] items-end overflow-hidden bg-ink"
      >
        <Image
          src={estudio.imagen}
          alt="Interior diseñado por Resplandecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/40 to-black/70"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-[clamp(3rem,7vw,6rem)] text-white">
          <h2
            id="nuestro-estudio-title"
            className="font-serif uppercase text-[clamp(2.4rem,7vw,6rem)] font-normal leading-[0.95]"
          >
            {estudio.titulo}
          </h2>
          <p className="ml-auto mt-[clamp(1.5rem,4vw,3rem)] max-w-xl whitespace-pre-line text-[clamp(0.95rem,1.3vw,1.1rem)] leading-relaxed text-white/90">
            {estudio.texto}
          </p>
        </div>
      </section>

      {/* ── CREAMOS DISEÑO: imagen izquierda, texto derecha ── */}
      <section
        aria-labelledby="creamos-diseno-title"
        className="grid grid-cols-1 bg-white md:grid-cols-2"
      >
        <div className="relative min-h-[clamp(340px,56vw,620px)] bg-[#f3f0eb] md:min-h-[560px]">
          <Image
            src={diseno.imagen}
            alt="Detalle de mobiliario artesanal de Resplandecer"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center px-[clamp(1.5rem,7vw,7rem)] py-[clamp(3rem,6vw,5rem)]">
          <h2
            id="creamos-diseno-title"
            className="font-serif uppercase text-[clamp(2.2rem,5vw,4.5rem)] font-normal leading-none text-[#3a3a3a]"
          >
            {diseno.titulo}
          </h2>
          <p className="mt-[clamp(1.75rem,4vw,3rem)] max-w-lg whitespace-pre-line text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-[#111]">
            {diseno.texto}
          </p>
        </div>
      </section>

      {/* ── SEBASTIÁN ARISMENDY: texto izquierda, imagen derecha ── */}
      <section
        aria-labelledby="fundador-title"
        className="grid grid-cols-1 bg-white md:grid-cols-2"
      >
        <div className="flex flex-col justify-center px-[clamp(1.5rem,7vw,7rem)] py-[clamp(3rem,6vw,5rem)] md:order-1">
          <h2
            id="fundador-title"
            className="font-serif uppercase text-[clamp(2.2rem,5vw,4.5rem)] font-normal leading-none text-[#3a3a3a]"
          >
            {fundador.titulo}
          </h2>
          <p className="mt-[clamp(1.75rem,4vw,3rem)] max-w-lg whitespace-pre-line text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed text-[#111]">
            {fundador.texto}
          </p>
        </div>
        <div className="relative min-h-[clamp(340px,56vw,620px)] bg-[#f3f0eb] md:order-2 md:min-h-[560px]">
          <Image
            src={fundador.imagen}
            alt="Sebastián Arismendy, diseñador de Resplandecer"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </section>
    </main>
  );
}
