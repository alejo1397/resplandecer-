import Link from "next/link";
import {
  getConfiguracionSitioCached,
  getProductosDestacadosCached,
  getTestimoniosCached,
} from "@/lib/cache";
import { ProductoCard } from "./_components/producto-card";
import { HeroFigura } from "./_components/hero-figura";
import { Marquee } from "./_components/marquee";
import { Stats } from "./_components/stats";
import { SplitText } from "./_components/split-text";
import { Servicios } from "./_components/servicios";
import { Preloader } from "./_components/preloader";
import { BandaParallax } from "./_components/banda-parallax";
import { ContadorScroll } from "./_components/contador-scroll";
import { Faq } from "./_components/faq";
import { SecuenciaProcesoLazy } from "./_components/secuencia-proceso-lazy";
import { ProgresoLectura } from "./_components/progreso-lectura";
import { CursorPersonalizado } from "./_components/cursor-personalizado";

export default async function InicioPage() {
  const [config, destacados, testimonios] = await Promise.all([
    getConfiguracionSitioCached(),
    getProductosDestacadosCached(),
    getTestimoniosCached(),
  ]);

  const titulo = config["titulo_hero"] || "Diseno & Produccion de Mobiliario";
  const bandaImagen = config["banda_imagen"] || config["hero_imagen"] || "https://placehold.co/1600x900?text=Resplandecer";
  const procesoImagen = config["proceso_imagen"] || config["hero_imagen"] || "https://placehold.co/1600x900?text=Proceso";

  return (
    <div>
      <Preloader />
      <ProgresoLectura />
      <CursorPersonalizado />

      {/* ── HERO (tema oscuro) ── */}
      <section data-theme="dark" className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink text-paper">
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

      {/* ── MARQUEE ── */}
      <Marquee
        items={["Diseno", "Fabricacion", "Instalacion", "A la medida", "Interiorismo"]}
      />

      {/* ── INTRO EDITORIAL (tema claro) ── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SplitText
              text="Del bosque al salon"
              className="display text-[clamp(1.8rem,4vw,3.2rem)] text-ink"
            />
          </div>
          <div className="reveal md:col-span-5">
            <p className="text-base leading-relaxed text-ink/70">
              Disenamos, fabricamos e instalamos mobiliario a la medida. Un solo
              responsable, del primer boceto a la ultima pieza en tu espacio.
            </p>
          </div>
        </div>
      </section>

      {/* ── BANDA CON PARALLAX ── */}
      <BandaParallax src={bandaImagen} alt="Mobiliario Resplandecer" titulo="Hecho a mano, pensado para durar" />

      {/* ── STATS (contadores animados) ── */}
      <Stats
        items={[
          { valor: 8, sufijo: "+", etiqueta: "Anos de experiencia" },
          { valor: 120, etiqueta: "Artesanos" },
          { valor: 2500, sufijo: "+", etiqueta: "Piezas al ano" },
          { valor: 98, sufijo: "%", etiqueta: "Entregas a tiempo" },
        ]}
      />

      {/* ── SERVICIOS ── */}
      <Servicios
        items={[
          { nombre: "Carpinteria a medida", descripcion: "Piezas unicas disenadas para tu espacio.", imagen: "https://placehold.co/400x500?text=Carpinteria" },
          { nombre: "Cocinas de autor", descripcion: "Cocinas integrales con acabados premium.", imagen: "https://placehold.co/400x500?text=Cocinas" },
          { nombre: "Remodelaciones", descripcion: "Transformamos espacios por completo.", imagen: "https://placehold.co/400x500?text=Remodelaciones" },
          { nombre: "Sofas y tapiceria", descripcion: "Comodidad y diseno en cada detalle.", imagen: "https://placehold.co/400x500?text=Tapiceria" },
          { nombre: "Interiorismo", descripcion: "Asesoria integral de diseno interior.", imagen: "https://placehold.co/400x500?text=Interiorismo" },
          { nombre: "Contract", descripcion: "Proyectos para empresas y hoteleria.", imagen: "https://placehold.co/400x500?text=Contract" },
        ]}
      />

      {/* ── CONTADOR SCRUBBED ── */}
      <ContadorScroll valor={2500} sufijo="+" etiqueta="Piezas fabricadas a la medida" />

      {/* ── SECUENCIA CINEMATOGRAFICA (proceso) ── */}
      <SecuenciaProcesoLazy imagen={procesoImagen} />

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
        <section data-theme="dark" className="bg-ink py-24 text-paper">
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

      {/* ── FAQ ── */}
      <Faq
        items={[
          {
            pregunta: "Hacen muebles a la medida?",
            respuesta:
              "Si. Disenamos y fabricamos cada pieza segun tu espacio, estilo y necesidades. Cuentanos tu idea y la hacemos realidad.",
          },
          {
            pregunta: "Cuanto tarda un pedido a la medida?",
            respuesta:
              "El tiempo depende del proyecto y su complejidad. Al cotizar te damos un plazo estimado de fabricacion y entrega.",
          },
          {
            pregunta: "Tienen garantia?",
            respuesta:
              "Si, nuestros muebles cuentan con garantia. Te informamos las condiciones especificas al momento de la compra.",
          },
          {
            pregunta: "Hacen envios e instalacion?",
            respuesta:
              "Si, realizamos entrega e instalacion. Escribenos para confirmar cobertura en tu ciudad o zona.",
          },
          {
            pregunta: "Como pido una cotizacion?",
            respuesta:
              "Escribenos por WhatsApp con tu idea o referencia y te asesoramos sin compromiso.",
          },
        ]}
      />
    </div>
  );
}
