import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { FaqForm } from "../faq-form";

export default async function NuevaFaqPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nueva pregunta" descripcion="Agrega una pregunta frecuente." />
      <FaqForm />
    </div>
  );
}
