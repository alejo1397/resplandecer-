"use client";

import { useActionState } from "react";
import { guardarColeccionAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, LinkButton } from "../_components/ui";
import { SubmitConLogo } from "../_components/submit-con-logo";
import { ImageUploader } from "../_components/image-uploader";

type Coleccion = {
  id: number;
  titulo: string;
  slug: string;
  resumen: string | null;
  descripcion: string | null;
  imagenUrl: string | null;
  imagenAlt: string | null;
  whatsappTexto: string | null;
  whatsappMensaje: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function ColeccionForm({ coleccion }: { coleccion?: Coleccion }) {
  const [state, action] = useActionState(guardarColeccionAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {coleccion ? <input type="hidden" name="id" value={coleccion.id} /> : null}

      <Field label="Título">
        <TextInput name="titulo" defaultValue={coleccion?.titulo} required />
      </Field>

      <Field label="Slug" hint="Se genera del título si lo dejas vacío.">
        <TextInput name="slug" defaultValue={coleccion?.slug} placeholder="ej. coleccion-zafiro" />
      </Field>

      <Field label="Resumen" hint="Texto corto que se muestra en la tarjeta.">
        <TextInput name="resumen" defaultValue={coleccion?.resumen ?? ""} />
      </Field>

      <Field label="Descripción">
        <TextArea name="descripcion" defaultValue={coleccion?.descripcion ?? ""} />
      </Field>

      {/* RF-08: la imagen de portada se puede cargar desde la creación */}
      <ImageUploader
        fieldName="imagenUrl"
        carpeta="colecciones"
        defaultUrl={coleccion?.imagenUrl ?? ""}
        label="Imagen de portada"
      />

      <Field label="Texto alternativo de la portada">
        <TextInput name="imagenAlt" defaultValue={coleccion?.imagenAlt ?? ""} />
      </Field>

      <Field label="Texto del botón de WhatsApp" hint="Ej. Pregunta por la colección.">
        <TextInput name="whatsappTexto" defaultValue={coleccion?.whatsappTexto ?? ""} placeholder="Pregunta por la colección" />
      </Field>

      <Field label="Mensaje de WhatsApp">
        <TextArea name="whatsappMensaje" defaultValue={coleccion?.whatsappMensaje ?? ""} placeholder="Hola, quiero información sobre la colección..." />
      </Field>

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={coleccion?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activa (visible en la web)" defaultChecked={coleccion?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitConLogo textoCargando={coleccion ? "Actualizando..." : "Creando..."}>
          {coleccion ? "Guardar" : "Crear"}
        </SubmitConLogo>
        <LinkButton href="/admin/colecciones" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
