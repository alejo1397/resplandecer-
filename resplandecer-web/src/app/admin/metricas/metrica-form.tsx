"use client";

import { useActionState } from "react";
import { guardarMetricaAction, type FormState } from "./actions";
import { Field, TextInput, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Metrica = {
  id: number;
  valor: number;
  prefijo: string | null;
  sufijo: string | null;
  etiqueta: string;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function MetricaForm({ metrica }: { metrica?: Metrica }) {
  const [state, action, pending] = useActionState(guardarMetricaAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {metrica ? <input type="hidden" name="id" value={metrica.id} /> : null}

      <Field label="Valor" hint="Solo el número (ej. 2500).">
        <TextInput name="valor" type="number" defaultValue={metrica?.valor ?? 0} required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prefijo" hint="Antes del número (ej. +).">
          <TextInput name="prefijo" defaultValue={metrica?.prefijo ?? ""} placeholder="opcional" />
        </Field>
        <Field label="Sufijo" hint="Después del número (ej. + o %).">
          <TextInput name="sufijo" defaultValue={metrica?.sufijo ?? ""} placeholder="opcional" />
        </Field>
      </div>

      <Field label="Etiqueta" hint="Ej. Años de experiencia.">
        <TextInput name="etiqueta" defaultValue={metrica?.etiqueta} required />
      </Field>

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={metrica?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activa (visible en la web)" defaultChecked={metrica?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/metricas" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
