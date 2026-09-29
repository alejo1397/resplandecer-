"use client";

import { useState, useTransition } from "react";
import { subirMediaAction } from "./upload-action";

/**
 * Subida de imagen O video reutilizable (hero multimedia).
 *
 * Sube el archivo a Supabase Storage y guarda la URL y el tipo en inputs
 * ocultos (`urlField`, `tipoField`) para que el formulario contenedor los
 * envíe. Muestra una vista previa según el tipo.
 */
export function MediaUploader({
  urlField,
  tipoField,
  carpeta,
  defaultUrl = "",
  defaultTipo = "",
  label = "Imagen o video",
}: {
  urlField: string;
  tipoField: string;
  carpeta: string;
  defaultUrl?: string;
  defaultTipo?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [tipo, setTipo] = useState(defaultTipo);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const formData = new FormData();
    formData.set("archivo", file);
    formData.set("carpeta", carpeta);

    startTransition(async () => {
      const res = await subirMediaAction({}, formData);
      if (res.error) {
        setError(res.error);
      } else if (res.url) {
        setUrl(res.url);
        setTipo(res.tipo ?? "");
      }
    });
  }

  const esVideo = tipo === "video" || /\.(mp4|webm|ogv|ogg)(\?|$)/i.test(url);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      {url ? (
        esVideo ? (
          <video src={url} className="h-40 w-64 rounded-lg border border-gray-200 object-cover" muted controls />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Vista previa" className="h-40 w-64 rounded-lg border border-gray-200 object-cover" />
        )
      ) : null}

      <input type="hidden" name={urlField} value={url} readOnly />
      <input type="hidden" name={tipoField} value={tipo} readOnly />

      <input
        type="file"
        accept="image/*,video/mp4,video/webm,video/ogg"
        onChange={onFileChange}
        disabled={pending}
        className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700 disabled:opacity-50"
      />

      {pending ? <span className="text-xs text-gray-400">Subiendo... (los videos pueden tardar)</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
