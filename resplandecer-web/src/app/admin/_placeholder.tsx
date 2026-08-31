/**
 * Componente reutilizable para las secciones del panel que aun no tienen su
 * CRUD completo (se desarrollan en la Fase 4). Muestra un encabezado y un aviso.
 */
export function SeccionEnConstruccion({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <p className="mt-1 text-sm text-gray-500">{descripcion}</p>
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
        Esta seccion estara disponible pronto (Fase 4: gestion de contenido).
      </div>
    </div>
  );
}
