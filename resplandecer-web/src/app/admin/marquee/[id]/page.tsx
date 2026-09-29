import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerMarqueeItem } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { MarqueeForm } from "../marquee-form";

export default async function EditarMarqueePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const item = await obtenerMarqueeItem(Number(id));
  if (!item) notFound();

  return (
    <div>
      <PageHeader titulo="Editar texto" descripcion={item.texto} />
      <MarqueeForm item={item} />
    </div>
  );
}
