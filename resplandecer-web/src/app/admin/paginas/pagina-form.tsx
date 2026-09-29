"use client";

import { useActionState } from "react";
import { guardarPaginaAction, type FormState } from "./actions";
import { Field, TextInput, Checkbox, SubmitButton } from "../_components/ui";

type Pagina = {
  id: number;
  titulo: string;
  subtitulo: string | null;
  estado: boolean;
};

const initialState: FormState = {};

export function PaginaForm({ pagina }: { pagina: Pagina }) {
  const [state, action, pending] = useActionState(guardarPaginaAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <input type="hidden" name="id" value={pagina.id} />

      <Field label="Título">
        <TextInput name="titulo" defaultValue={pagina.titulo} required />
      </Field>

      <Field label="Subtítulo (opcional)">
        <TextInput name="subtitulo" defaultValue={pagina.subtitulo ?? ""} />
      </Field>

      <Checkbox name="estado" label="Visible en la web" defaultChecked={pagina.estado} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
      </div>
    </form>
  );
}
