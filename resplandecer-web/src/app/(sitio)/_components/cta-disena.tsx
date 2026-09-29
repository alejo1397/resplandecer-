import Image from "next/image";
import Link from "next/link";

/**
 * Sección CTA "Diseña tu espacio" para el home. Coherente visualmente con la
 * banda "Hecho a mano, pensado para durar". Imagen, título, descripción y CTA
 * administrables por configuración del sitio; enlaza a /disena-tu-espacio.
 */
export function CtaDisena({
  imagen,
  titulo,
  descripcion,
  cta,
}: {
  imagen?: string;
  titulo: string;
  descripcion: string;
  cta: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-ink text-paper">
        {imagen ? (
          <Image
            src={imagen}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/30" />

        <div className="relative flex flex-col gap-5 px-8 py-16 md:px-14 md:py-24">
          <h2 className="display max-w-2xl text-[clamp(1.8rem,5vw,3.5rem)] text-paper">
            {titulo}
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-paper/80">{descripcion}</p>
          <div>
            <Link href="/disena-tu-espacio" className="pill pill-light text-paper">
              <span className="pill-text">{cta}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
