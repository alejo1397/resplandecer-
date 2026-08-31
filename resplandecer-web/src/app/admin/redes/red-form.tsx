"use client";

import { useActionState } from "react";
import { guardarRedAction, type FormState } from "./actions";
import { Field, TextInput, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Red = {
  id: number;
  nombre: string;
  url: string;
  icono: string | null;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function RedForm({ red }: { red?: Red }) {
  const [state, action, pending] = useActionState(guardarRedAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {red ? <input type="hidden" name="id" value={red.id} /> : null}

      <Field label="Nombre" hint="Ej. Instagram, Facebook, WhatsApp.">
        <TextInput name="nombre" defaultValue={red?.nombre} required />
      </Field>

      <Field label="URL">
        <TextInput name="url" type="url" defaultValue={red?.url} placeholder="https://..." required />
      </Field>

      <Field label="Icono" hint="Nombre del icono o URL (opcional).">
        <TextInput name="icono" defaultValue={red?.icono ?? ""} placeholder="ej. instagram" />
      </Field>

      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={red?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={red?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/redes" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
