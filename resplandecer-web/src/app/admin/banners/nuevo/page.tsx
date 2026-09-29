import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { BannerForm } from "../banner-form";

export default async function NuevoBannerPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nuevo banner" descripcion="Agrega un banner al inicio." />
      <BannerForm />
    </div>
  );
}
