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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/mobiliario" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Mobiliario
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        {/* Galeria */}
        <div className="grid grid-cols-2 gap-3">
          {producto.imagenes.length === 0 ? (
            <div className="col-span-2 flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
              Sin imagen
            </div>
          ) : (
            producto.imagenes.map((img, i) => (
              <div
                key={img.id}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
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
        <div>
          {producto.categoria ? (
            <p className="text-sm text-gray-500">{producto.categoria.nombre}</p>
          ) : null}
          <h1 className="mt-1 text-3xl font-semibold">{producto.nombre}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900">{formatCOP(precioFinal)}</span>
            {tieneDescuento ? (
              <span className="text-gray-400 line-through">{formatCOP(producto.precio)}</span>
            ) : null}
          </div>

          {producto.descripcion ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {producto.descripcion}
            </p>
          ) : null}

          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center rounded-md bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600"
            >
              Consultar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
