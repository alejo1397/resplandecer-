"use client";

import { useActionState } from "react";
import { guardarBannerAction, type FormState } from "./actions";
import { Field, TextInput, Select, Checkbox, SubmitButton, LinkButton } from "../_components/ui";
import { ImageUploader } from "../_components/image-uploader";

type Banner = {
  id: number;
  seccion: string;
  titulo: string | null;
  subtitulo: string | null;
  etiqueta: string | null;
  imagenUrl: string;
  enlaceUrl: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function BannerForm({ banner }: { banner?: Banner }) {
  const [state, action, pending] = useActionState(guardarBannerAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}

      <Field label="Sección">
        <Select name="seccion" defaultValue={banner?.seccion ?? "mobiliario"}>
          <option value="mobiliario">Mobiliario</option>
          <option value="colecciones">Colecciones</option>
        </Select>
      </Field>

      <Field
        label="Etiqueta"
        hint="Texto sobre la imagen. Mobiliario: «Producto - Categoría». Colecciones: «Colección Zafiro»."
      >
        <TextInput name="etiqueta" defaultValue={banner?.etiqueta ?? ""} />
      </Field>

      <ImageUploader
        fieldName="imagenUrl"
        carpeta="banners"
        defaultUrl={banner?.imagenUrl ?? ""}
        label="Imagen del banner"
      />

      <Field label="Enlace (opcional)" hint="Ej. /mobiliario o /colecciones/salas.">
        <TextInput name="enlaceUrl" defaultValue={banner?.enlaceUrl ?? ""} placeholder="/colecciones/salas" />
      </Field>

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={banner?.orden ?? 0} />
      </Field>

      {/* Campos opcionales de título/subtítulo por banner (no siempre usados) */}
      <input type="hidden" name="titulo" value={banner?.titulo ?? ""} />
      <input type="hidden" name="subtitulo" value={banner?.subtitulo ?? ""} />

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={banner?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/banners" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
