"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

/**
 * Botón de acción administrativa con:
 *  - Confirmación en modal antes de ejecutar (RF-05).
 *  - Overlay de loading con el logo de Resplandecer mientras se ejecuta (RF-06).
 *  - Botón deshabilitado durante la ejecución para evitar doble envío.
 *
 * Recibe una server action `(formData) => Promise<void>` y los campos ocultos
 * que necesita (por ejemplo id/estado), y los envía al confirmar.
 */
export function AccionConfirmable({
  action,
  campos,
  etiqueta,
  confirmacion,
  textoCargando = "Procesando...",
  variante = "peligro",
}: {
  action: (formData: FormData) => Promise<void>;
  campos: Record<string, string | number>;
  etiqueta: string;
  confirmacion: string;
  textoCargando?: string;
  variante?: "peligro" | "neutro";
}) {
  const [abierto, setAbierto] = useState(false);
  const [pending, startTransition] = useTransition();

  function ejecutar() {
    const formData = new FormData();
    for (const [k, v] of Object.entries(campos)) formData.set(k, String(v));
    startTransition(async () => {
      await action(formData);
      setAbierto(false);
    });
  }

  const claseBoton =
    variante === "peligro"
      ? "text-sm text-red-600 hover:underline"
      : "text-sm text-gray-500 hover:underline";

  return (
    <>
      <button type="button" onClick={() => setAbierto(true)} className={claseBoton}>
        {etiqueta}
      </button>

      {abierto ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar acción"
          onClick={() => (pending ? null : setAbierto(false))}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {pending ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <Image
                  src="/logo_r_black.png"
                  alt="Resplandecer"
                  width={120}
                  height={38}
                  className="animate-pulse"
                  style={{ height: "30px", width: "auto" }}
                />
                <p className="text-sm text-gray-600">{textoCargando}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-800">{confirmacion}</p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAbierto(false)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={ejecutar}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium text-white ${
                      variante === "peligro" ? "bg-red-600 hover:bg-red-700" : "bg-gray-900 hover:bg-gray-700"
                    }`}
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
