import { requireAdmin } from "@/lib/auth/guard";
import { listarConfiguracion } from "@/lib/queries/admin/contenido";
import { PageHeader, Field, TextInput, SubmitButton } from "../_components/ui";
import { guardarParametroAction, crearParametroAction } from "./actions";

export default async function ConfiguracionPage() {
  await requireAdmin();
  const parametros = await listarConfiguracion();

  return (
    <div className="max-w-2xl">
      <PageHeader
        titulo="Configuracion del sitio"
        descripcion="Edita los textos y parametros de la web. Los cambios se reflejan en la pagina."
      />

      <div className="flex flex-col gap-3">
        {parametros.map((p) => (
          <form
            key={p.id}
            action={guardarParametroAction}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <input type="hidden" name="clave" value={p.clave} />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Field label={p.clave} hint={p.descripcion ?? undefined}>
                  <TextInput name="valor" defaultValue={p.valor ?? ""} />
                </Field>
              </div>
              <SubmitButton variant="secondary">Guardar</SubmitButton>
            </div>
          </form>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Agregar parametro</h2>
        <form action={crearParametroAction} className="mt-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4">
          <Field label="Clave" hint="Sin espacios, ej. titulo_hero">
            <TextInput name="clave" required />
          </Field>
          <Field label="Valor">
            <TextInput name="valor" />
          </Field>
          <Field label="Descripcion">
            <TextInput name="descripcion" />
          </Field>
          <div>
            <SubmitButton>Agregar</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
