"use client";

import { useActionState } from "react";
import { guardarTestimonioAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";
import { ImageUploader } from "../_components/image-uploader";

type Testimonio = {
  id: number;
  nombreCliente: string;
  cargoOCiudad: string | null;
  mensaje: string;
  calificacion: number | null;
  orden: number;
  estado: boolean;
  imagen: { url: string } | null;
};

const initialState: FormState = {};

export function TestimonioForm({ testimonio }: { testimonio?: Testimonio }) {
  const [state, action, pending] = useActionState(guardarTestimonioAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {testimonio ? <input type="hidden" name="id" value={testimonio.id} /> : null}
      <input type="hidden" name="imagenUrlActual" value={testimonio?.imagen?.url ?? ""} />

      <Field label="Nombre del cliente">
        <TextInput name="nombreCliente" defaultValue={testimonio?.nombreCliente} required />
      </Field>

      <Field label="Cargo o ciudad">
        <TextInput name="cargoOCiudad" defaultValue={testimonio?.cargoOCiudad ?? ""} placeholder="ej. Bogota" />
      </Field>

      <Field label="Mensaje">
        <TextArea name="mensaje" defaultValue={testimonio?.mensaje} required />
      </Field>

      <Field label="Calificacion" hint="Numero entre 1 y 5 (opcional).">
        <TextInput name="calificacion" type="number" min={1} max={5} defaultValue={testimonio?.calificacion ?? ""} />
      </Field>

      <ImageUploader
        fieldName="imagenUrl"
        carpeta="testimonios"
        defaultUrl={testimonio?.imagen?.url}
        label={testimonio?.imagen ? "Foto (sube una nueva para reemplazar)" : "Foto del cliente (opcional)"}
      />

      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={testimonio?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={testimonio?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/testimonios" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
