"use client";

import { useActionState } from "react";
import { guardarServicioAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";
import { ImageUploader } from "../_components/image-uploader";

type Servicio = {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function ServicioForm({ servicio }: { servicio?: Servicio }) {
  const [state, action, pending] = useActionState(guardarServicioAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {servicio ? <input type="hidden" name="id" value={servicio.id} /> : null}

      <Field label="Título">
        <TextInput name="titulo" defaultValue={servicio?.titulo} required />
      </Field>

      <Field label="Descripción">
        <TextArea name="descripcion" defaultValue={servicio?.descripcion ?? ""} />
      </Field>

      <ImageUploader
        fieldName="imagenUrl"
        carpeta="servicios"
        defaultUrl={servicio?.imagenUrl ?? ""}
        label="Imagen del servicio (opcional)"
      />

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={servicio?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={servicio?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/servicios" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
