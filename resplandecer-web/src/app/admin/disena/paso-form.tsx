"use client";

import { useActionState } from "react";
import { guardarPasoAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";
import { ImageUploader } from "../_components/image-uploader";

type Paso = {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function PasoForm({ paso }: { paso?: Paso }) {
  const [state, action, pending] = useActionState(guardarPasoAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {paso ? <input type="hidden" name="id" value={paso.id} /> : null}

      <Field label="Título" hint="Ej. Cuéntanos tu idea.">
        <TextInput name="titulo" defaultValue={paso?.titulo} required />
      </Field>

      <Field label="Descripción">
        <TextArea name="descripcion" defaultValue={paso?.descripcion ?? ""} />
      </Field>

      <ImageUploader
        fieldName="imagenUrl"
        carpeta="disena"
        defaultUrl={paso?.imagenUrl ?? ""}
        label="Imagen del paso (opcional)"
      />

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={paso?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={paso?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/disena" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
