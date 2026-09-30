import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerMarqueeItem, listarMarqueeItems } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { MarqueeForm } from "../marquee-form";

export default async function EditarMarqueePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [item, items] = await Promise.all([
    obtenerMarqueeItem(Number(id)),
    listarMarqueeItems(),
  ]);
  if (!item) notFound();

  return (
    <div>
      <PageHeader titulo="Editar texto" descripcion={item.texto} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <MarqueeForm item={item} />
        </div>
        <ListaCompacta
          base="/admin/marquee"
          actualId={item.id}
          titulo="Ir a otro texto"
          items={items.map((m) => ({ id: m.id, titulo: m.texto, activo: m.estado }))}
        />
      </div>
    </div>
  );
}
