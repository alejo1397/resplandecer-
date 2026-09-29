import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerFaq } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { FaqForm } from "../faq-form";

export default async function EditarFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const faq = await obtenerFaq(Number(id));
  if (!faq) notFound();

  return (
    <div>
      <PageHeader titulo="Editar pregunta" descripcion={faq.pregunta} />
      <FaqForm faq={faq} />
    </div>
  );
}
