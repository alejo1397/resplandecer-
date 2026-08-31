import Image from "next/image";
import Link from "next/link";
import {
  getConfiguracionSitioCached,
  getProductosDestacadosCached,
  getTestimoniosCached,
} from "@/lib/cache";
import { ProductoCard } from "./_components/producto-card";

export default async function InicioPage() {
  const [config, destacados, testimonios] = await Promise.all([
    getConfiguracionSitioCached(),
    getProductosDestacadosCached(),
    getTestimoniosCached(),
  ]);

  const heroImagen = config["hero_imagen"];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {heroImagen ? (
          <Image src={heroImagen} alt="" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white">
          <h1 className="text-4xl font-semibold sm:text-5xl">
            {config["titulo_hero"] || "Diseno & Produccion de Mobiliario"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            {config["subtitulo_hero"] || "Convertimos tus espacios en lo que suenas."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/mobiliario"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
            >
              Ver mobiliario
            </Link>
            <Link
              href="/disena-tu-espacio"
              className="rounded-md border border-white px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Disena tu espacio
            </Link>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {destacados.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Destacados</h2>
            <Link href="/mobiliario" className="text-sm text-gray-600 hover:text-gray-900">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Testimonios */}
      {testimonios.length > 0 ? (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-8 text-center text-2xl font-semibold">Lo que dicen nuestros clientes</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonios.map((t) => (
                <figure key={t.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <blockquote className="text-sm text-gray-700">&ldquo;{t.mensaje}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm font-medium text-gray-900">
                    {t.nombreCliente}
                    {t.cargoOCiudad ? (
                      <span className="font-normal text-gray-500"> &middot; {t.cargoOCiudad}</span>
                    ) : null}
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
