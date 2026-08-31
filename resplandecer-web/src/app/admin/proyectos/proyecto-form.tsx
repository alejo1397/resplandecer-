"use client";

import { useActionState } from "react";
import { guardarProyectoAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Proyecto = {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string | null;
  ubicacion: string | null;
  fecha: string | null;
  destacado: boolean;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function ProyectoForm({ proyecto }: { proyecto?: Proyecto }) {
  const [state, action, pending] = useActionState(guardarProyectoAction, initialState);
  const fechaValue = proyecto?.fecha ? proyecto.fecha.slice(0, 10) : "";

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {proyecto ? <input type="hidden" name="id" value={proyecto.id} /> : null}

      <Field label="Titulo">
        <TextInput name="titulo" defaultValue={proyecto?.titulo} required />
      </Field>

      <Field label="Slug" hint="Se genera del titulo si lo dejas vacio.">
        <TextInput name="slug" defaultValue={proyecto?.slug} />
      </Field>

      <Field label="Descripcion">
        <TextArea name="descripcion" defaultValue={proyecto?.descripcion ?? ""} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ubicacion">
          <TextInput name="ubicacion" defaultValue={proyecto?.ubicacion ?? ""} placeholder="ej. Bogota" />
        </Field>
        <Field label="Fecha">
          <TextInput name="fecha" type="date" defaultValue={fechaValue} />
        </Field>
      </div>

      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={proyecto?.orden ?? 0} />
      </Field>

      <Checkbox name="destacado" label="Destacado (aparece en la portada)" defaultChecked={proyecto?.destacado ?? false} />
      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={proyecto?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/proyectos" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
