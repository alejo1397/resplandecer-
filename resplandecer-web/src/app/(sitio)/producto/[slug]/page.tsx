import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductoPorSlug, getConfiguracionSitio } from "@/lib/queries";
import { formatCOP } from "@/lib/serializers";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [producto, config] = await Promise.all([
    getProductoPorSlug(slug),
    getConfiguracionSitio(),
  ]);
  if (!producto) notFound();

  const precioFinal = producto.precioVenta ?? producto.precio;
  const tieneDescuento = producto.precioVenta !== null && producto.precioVenta < producto.precio;

  const whatsapp = config["whatsapp_numero"];
  const mensaje = encodeURIComponent(`Hola, me interesa el producto "${producto.nombre}".`);
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${mensaje}` : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Link href="/mobiliario" className="label-mono text-ink/50 hover:text-ink">
        ← Mobiliario
      </Link>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        {/* Galeria */}
        <div className="grid grid-cols-2 gap-3">
          {producto.imagenes.length === 0 ? (
            <div className="col-span-2 flex aspect-square items-center justify-center rounded-xl bg-ink/5 text-sm text-ink/40">
              Sin imagen
            </div>
          ) : (
            producto.imagenes.map((img, i) => (
              <div
                key={img.id}
                className={`relative aspect-square overflow-hidden rounded-xl bg-ink/5 ${
                  i === 0 ? "col-span-2" : ""
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.textoAlternativo ?? producto.nombre}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-6">
          {producto.categoria ? (
            <p className="label-mono text-ink/50">{producto.categoria.nombre}</p>
          ) : null}
          <h1 className="display mt-3 text-[clamp(2rem,5vw,3.5rem)] text-ink">
            {producto.nombre}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="label-mono text-lg text-ink">{formatCOP(precioFinal)}</span>
            {tieneDescuento ? (
              <span className="label-mono text-ink/40 line-through">{formatCOP(producto.precio)}</span>
            ) : null}
          </div>

          {producto.descripcion ? (
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink/70">
              {producto.descripcion}
            </p>
          ) : null}

          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="pill pill-dark mt-10 text-ink"
            >
              <span className="pill-text">Consultar por WhatsApp</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
