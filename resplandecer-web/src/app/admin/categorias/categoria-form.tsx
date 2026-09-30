"use client";

import { useActionState } from "react";
import { guardarCategoriaAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, LinkButton } from "../_components/ui";
import { SubmitConLogo } from "../_components/submit-con-logo";
import { ImageUploader } from "../_components/image-uploader";

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagenUrl: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

/**
 * Las categorías funcionan como AGRUPADORES/FILTROS de productos (mobiliario).
 * No son colecciones: las colecciones tienen su propio módulo (/admin/colecciones).
 */
export function CategoriaForm({ categoria }: { categoria?: Categoria }) {
  const [state, action] = useActionState(guardarCategoriaAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {categoria ? <input type="hidden" name="id" value={categoria.id} /> : null}

      <Field label="Nombre">
        <TextInput name="nombre" defaultValue={categoria?.nombre} required />
      </Field>

      <Field label="Slug" hint="Se genera del nombre si lo dejas vacío.">
        <TextInput name="slug" defaultValue={categoria?.slug} placeholder="ej. comedores" />
      </Field>

      <Field label="Descripción">
        <TextArea name="descripcion" defaultValue={categoria?.descripcion ?? ""} />
      </Field>

      <ImageUploader
        fieldName="imagenUrl"
        carpeta="categorias"
        defaultUrl={categoria?.imagenUrl ?? ""}
        label="Imagen de la categoría (opcional)"
      />

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={categoria?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activa (visible como filtro)" defaultChecked={categoria?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitConLogo textoCargando={categoria ? "Actualizando..." : "Creando..."}>
          {categoria ? "Guardar" : "Crear"}
        </SubmitConLogo>
        <LinkButton href="/admin/categorias" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
