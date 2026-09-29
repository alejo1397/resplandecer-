import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { MarqueeForm } from "../marquee-form";

export default async function NuevoMarqueePage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nuevo texto" descripcion="Agrega un texto al marquee." />
      <MarqueeForm />
    </div>
  );
}
