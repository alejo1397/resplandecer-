"use client";

import { useFormStatus } from "react-dom";
import Image from "next/image";

/**
 * Botón de envío que muestra estado de carga con el logo de Resplandecer y un
 * texto animado (RF-06). Se deshabilita mientras el formulario está enviando
 * para evitar doble envío. Debe usarse dentro de un <form>.
 */
export function SubmitConLogo({
  children,
  textoCargando = "Guardando...",
  variant = "primary",
}: {
  children: React.ReactNode;
  textoCargando?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-700"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <button type="submit" disabled={pending} className={`${base} ${styles}`}>
      {pending ? (
        <>
          <Image
            src="/logo_r.png"
            alt=""
            width={60}
            height={19}
            className="animate-pulse"
            style={{ height: "16px", width: "auto" }}
          />
          <span>{textoCargando}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
