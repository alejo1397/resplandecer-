"use client";

import { useActionState } from "react";
import { guardarFaqAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Faq = {
  id: number;
  pregunta: string;
  respuesta: string;
  orden: number;
  estado: boolean;
};

const initialState: FormState = {};

export function FaqForm({ faq }: { faq?: Faq }) {
  const [state, action, pending] = useActionState(guardarFaqAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {faq ? <input type="hidden" name="id" value={faq.id} /> : null}

      <Field label="Pregunta">
        <TextInput name="pregunta" defaultValue={faq?.pregunta} required />
      </Field>

      <Field label="Respuesta">
        <TextArea name="respuesta" defaultValue={faq?.respuesta ?? ""} required />
      </Field>

      <Field label="Orden" hint="Menor número aparece primero.">
        <TextInput name="orden" type="number" defaultValue={faq?.orden ?? 0} />
      </Field>

      <Checkbox name="estado" label="Activa (visible en la web)" defaultChecked={faq?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/faqs" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
