import Image from "next/image";
import Link from "next/link";
import { formatCOP } from "@/lib/serializers";

type Producto = {
  slug: string;
  nombre: string;
  precio: number;
  precioVenta: number | null;
  imagenes: { url: string; textoAlternativo: string | null }[];
};

export function ProductoCard({ producto }: { producto: Producto }) {
  const imagen = producto.imagenes[0];
  const precioFinal = producto.precioVenta ?? producto.precio;
  const tieneDescuento = producto.precioVenta !== null && producto.precioVenta < producto.precio;

  return (
    <Link href={`/producto/${producto.slug}`} className="group flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-ink/5">
        {imagen ? (
          <Image
            src={imagen.url}
            alt={imagen.textoAlternativo ?? producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium text-ink">{producto.nombre}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="label-mono text-ink">{formatCOP(precioFinal)}</span>
        {tieneDescuento ? (
          <span className="label-mono text-ink/40 line-through">{formatCOP(producto.precio)}</span>
        ) : null}
      </div>
    </Link>
  );
}
