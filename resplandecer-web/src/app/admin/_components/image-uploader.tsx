"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { subirImagenAction } from "./upload-action";

/**
 * Subida de imagen reutilizable.
 *
 * Sube el archivo a Supabase Storage y guarda la URL resultante en un input
 * oculto con el nombre `fieldName`, para que el formulario contenedor la envie
 * como si fuera un campo de texto. Muestra una vista previa.
 *
 * @param fieldName  Nombre del campo (input) donde se guarda la URL.
 * @param carpeta    Subcarpeta en el bucket (ej. "catalogo", "proyectos").
 * @param defaultUrl URL inicial (para edicion).
 * @param label      Etiqueta visible.
 */
export function ImageUploader({
  fieldName,
  carpeta,
  defaultUrl,
  label = "Imagen",
}: {
  fieldName: string;
  carpeta: string;
  defaultUrl?: string;
  label?: string;
}) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");
  const [error, setError] = useState<string>("");
  const [pending, startTransition] = useTransition();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const formData = new FormData();
    formData.set("archivo", file);
    formData.set("carpeta", carpeta);

    startTransition(async () => {
      const res = await subirImagenAction({}, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.url) {
        setUrl(res.url);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {url ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <Image src={url} alt="Vista previa" fill className="object-cover" unoptimized />
        </div>
      ) : null}

      <input type="hidden" name={fieldName} value={url} readOnly />

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={pending}
        className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700 disabled:opacity-50"
      />

      {pending ? <span className="text-xs text-gray-400">Subiendo...</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
