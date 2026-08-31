"use client";

import { useActionState } from "react";
import { guardarCategoriaAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function CategoriaForm({ categoria }: { categoria?: Categoria }) {
  const [state, action, pending] = useActionState(guardarCategoriaAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {categoria ? <input type="hidden" name="id" value={categoria.id} /> : null}

      <Field label="Nombre">
        <TextInput name="nombre" defaultValue={categoria?.nombre} required />
      </Field>

      <Field label="Slug" hint="Se genera del nombre si lo dejas vacio.">
        <TextInput name="slug" defaultValue={categoria?.slug} placeholder="ej. comedores" />
      </Field>

      <Field label="Descripcion">
        <TextArea name="descripcion" defaultValue={categoria?.descripcion ?? ""} />
      </Field>

      <Field label="Orden" hint="Menor numero aparece primero.">
        <TextInput name="orden" type="number" defaultValue={categoria?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={categoria?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/categorias" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
