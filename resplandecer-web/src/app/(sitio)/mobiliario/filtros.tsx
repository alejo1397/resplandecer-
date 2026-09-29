"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Categoria = { slug: string; nombre: string };

/**
 * Barra de filtros de mobiliario: búsqueda por nombre y filtro por categoría.
 * Sincroniza el estado con los query params de la URL (?categoria=&q=), de modo
 * que los filtros son compartibles y sobreviven a recargas. La búsqueda tiene
 * un pequeño debounce para no navegar en cada tecla.
 */
export function FiltrosMobiliario({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoriaActual = searchParams.get("categoria") ?? "";
  const qActual = searchParams.get("q") ?? "";

  const [q, setQ] = useState(qActual);

  function aplicar(next: { categoria?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    const categoria = next.categoria ?? categoriaActual;
    const busqueda = next.q ?? q;

    if (categoria) params.set("categoria", categoria);
    else params.delete("categoria");

    if (busqueda) params.set("q", busqueda);
    else params.delete("q");

    const query = params.toString();
    router.replace(query ? `/mobiliario?${query}` : "/mobiliario", { scroll: false });
  }

  // Debounce de la búsqueda.
  useEffect(() => {
    if (q === qActual) return;
    const t = setTimeout(() => aplicar({ q }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const hayFiltros = Boolean(categoriaActual || qActual);

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Categorías como chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          onClick={() => aplicar({ categoria: "" })}
          aria-pressed={!categoriaActual}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            !categoriaActual ? "border-ink bg-ink text-paper" : "hairline-light text-ink/70 hover:text-ink"
          }`}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => aplicar({ categoria: c.slug })}
            aria-pressed={categoriaActual === c.slug}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              categoriaActual === c.slug
                ? "border-ink bg-ink text-paper"
                : "hairline-light text-ink/70 hover:text-ink"
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-2">
        <label className="relative">
          <span className="sr-only">Buscar producto</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full rounded-full border hairline-light bg-transparent px-4 py-1.5 text-sm text-ink outline-none focus:border-ink sm:w-56"
          />
        </label>
        {hayFiltros ? (
          <button
            type="button"
            onClick={() => aplicar({ categoria: "", q: "" })}
            className="whitespace-nowrap text-sm text-ink/50 underline-offset-4 hover:text-ink hover:underline"
          >
            Limpiar
          </button>
        ) : null}
      </div>
    </div>
  );
}
