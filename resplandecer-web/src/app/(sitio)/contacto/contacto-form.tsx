"use client";

import { useActionState } from "react";
import { enviarContactoAction, type ContactoState } from "./actions";

const initialState: ContactoState = {};

const inputClass =
  "rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

export function ContactoForm() {
  const [state, action, pending] = useActionState(enviarContactoAction, initialState);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
        Gracias por escribirnos. Te contactaremos pronto.
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Nombre</span>
        <input name="nombre" required className={inputClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Correo</span>
          <input name="email" type="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Telefono</span>
          <input name="telefono" className={inputClass} />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Ciudad</span>
        <input name="ciudad" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Mensaje</span>
        <textarea name="mensaje" className={`${inputClass} min-h-28`} />
      </label>

      <p className="text-xs text-gray-400">Indica al menos un correo o un telefono de contacto.</p>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
        >
          {pending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
