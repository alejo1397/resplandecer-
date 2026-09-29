"use client";

import { useActionState } from "react";
import { guardarMarqueeAction, type FormState } from "./actions";
import { Field, TextInput, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Item = {
  id: number;
  texto: string;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function MarqueeForm({ item }: { item?: Item }) {
  const [state, action, pending] = useActionState(guardarMarqueeAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <Field label="Texto" hint="Ej. Diseño, Fabricación, Instalación.">
        <TextInput name="texto" defaultValue={item?.texto} required />
      </Field>

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={item?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={item?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/marquee" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
