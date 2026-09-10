import Link from "next/link";
import {
  getConfiguracionSitioCached,
  getProductosDestacadosCached,
  getTestimoniosCached,
} from "@/lib/cache";
import { ProductoCard } from "./_components/producto-card";
import { HeroFigura } from "./_components/hero-figura";

export default async function InicioPage() {
  const [config, destacados, testimonios] = await Promise.all([
    getConfiguracionSitioCached(),
    getProductosDestacadosCached(),
    getTestimoniosCached(),
  ]);

  const titulo = config["titulo_hero"] || "Diseno & Produccion de Mobiliario";

  return (
    <div>
      {/* ── HERO (tema oscuro) ── */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink text-paper">
        <HeroFigura />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5">
          <p className="label-mono text-paper/60">Resplandecer — Mobiliario</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,9vw,7rem)] text-paper">
            {titulo}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70">
            {config["subtitulo_hero"] || "Convertimos tus espacios en lo que suenas."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/mobiliario" className="pill pill-light text-paper">
              <span className="pill-text">Ver mobiliario</span>
            </Link>
            <Link href="/disena-tu-espacio" className="pill pill-light text-paper/80">
              <span className="pill-text">Disena tu espacio</span>
            </Link>
          </div>
        </div>

        {/* hairline inferior con label mono */}
        <div className="absolute bottom-5 right-5 z-10 hidden md:block">
          <span className="label-mono text-paper/40">Arrastra el plano ↔</span>
        </div>
      </section>

      {/* ── INTRO EDITORIAL (tema claro) ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="reveal md:col-span-7">
            <h2 className="display text-[clamp(1.8rem,4vw,3.2rem)] text-ink">
              Del bosque al salon
            </h2>
          </div>
          <div className="reveal md:col-span-5">
            <p className="text-base leading-relaxed text-ink/70">
              Disenamos, fabricamos e instalamos mobiliario a la medida. Un solo
              responsable, del primer boceto a la ultima pieza en tu espacio.
            </p>
          </div>
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      {destacados.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-24">
          <div className="reveal mb-10 flex items-end justify-between border-b hairline-light pb-5">
            <h2 className="display text-[clamp(1.6rem,3.5vw,2.6rem)] text-ink">
              Destacados
            </h2>
            <Link href="/mobiliario" className="label-mono text-ink/60 hover:text-ink">
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((p) => (
              <div key={p.id} className="reveal">
                <ProductoCard producto={p} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── TESTIMONIOS (tema oscuro) ── */}
      {testimonios.length > 0 ? (
        <section className="bg-ink py-24 text-paper">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="reveal display mb-12 text-center text-[clamp(1.6rem,3.5vw,2.6rem)] text-paper">
              Lo que dicen nuestros clientes
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonios.map((t) => (
                <figure
                  key={t.id}
                  className="reveal rounded-2xl border hairline-dark p-7"
                >
                  <blockquote className="text-lg leading-relaxed text-paper/90">
                    &ldquo;{t.mensaje}&rdquo;
                  </blockquote>
                  <figcaption className="label-mono mt-5 text-paper/60">
                    {t.nombreCliente}
                    {t.cargoOCiudad ? ` — ${t.cargoOCiudad}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
