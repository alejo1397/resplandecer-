import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerFaq, listarFaqs } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { FaqForm } from "../faq-form";

export default async function EditarFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [faq, faqs] = await Promise.all([obtenerFaq(Number(id)), listarFaqs()]);
  if (!faq) notFound();

  return (
    <div>
      <PageHeader titulo="Editar pregunta" descripcion={faq.pregunta} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <FaqForm faq={faq} />
        </div>
        <ListaCompacta
          base="/admin/faqs"
          actualId={faq.id}
          titulo="Ir a otra pregunta"
          items={faqs.map((f) => ({ id: f.id, titulo: f.pregunta, activo: f.estado }))}
        />
      </div>
    </div>
  );
}
