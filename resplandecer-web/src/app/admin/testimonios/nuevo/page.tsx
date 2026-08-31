import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { TestimonioForm } from "../testimonio-form";

export default async function NuevoTestimonioPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nuevo testimonio" descripcion="Agrega un testimonio de cliente." />
      <TestimonioForm />
    </div>
  );
}
