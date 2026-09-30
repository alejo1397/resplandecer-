import Link from "next/link";
import Image from "next/image";

type Item = {
  id: number;
  titulo: string;
  activo?: boolean;
  imagenUrl?: string | null;
};

/**
 * Lista compacta del mismo módulo para navegar rápido entre registros desde la
 * pantalla de edición (RF-07). En desktop se muestra al lado del formulario;
 * en móvil/tablet debajo. Resalta el registro que se está editando.
 *
 * @param base     Ruta base del módulo (ej. "/admin/categorias").
 * @param items    Registros del módulo (id, título, estado, miniatura).
 * @param actualId Id del registro que se está editando.
 */
export function ListaCompacta({
  base,
  items,
  actualId,
  titulo = "Ir a otro registro",
}: {
  base: string;
  items: Item[];
  actualId: number;
  titulo?: string;
}) {
  if (items.length <= 1) return null;

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">{titulo}</p>
      <ul className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200 bg-white">
        {items.map((it) => {
          const activo = it.id === actualId;
          return (
            <li key={it.id}>
              <Link
                href={`${base}/${it.id}`}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition ${
                  activo ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={activo ? "true" : undefined}
              >
                {it.imagenUrl ? (
                  <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={it.imagenUrl} alt="" fill className="object-cover" unoptimized />
                  </span>
                ) : null}
                <span className="flex-1 truncate">{it.titulo}</span>
                {it.activo === false ? (
                  <span className={`text-xs ${activo ? "text-white/60" : "text-gray-400"}`}>Inactivo</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
