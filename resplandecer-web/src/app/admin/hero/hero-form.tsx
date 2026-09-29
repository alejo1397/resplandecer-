"use client";

import { useActionState } from "react";
import { guardarHeroAction, type FormState } from "./actions";
import { SubmitButton } from "../_components/ui";
import { MediaUploader } from "../_components/media-uploader";

const initialState: FormState = {};

export function HeroForm({
  mediaUrl,
  mediaTipo,
  posterUrl,
}: {
  mediaUrl: string;
  mediaTipo: string;
  posterUrl: string;
}) {
  const [state, action, pending] = useActionState(guardarHeroAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <MediaUploader
        urlField="hero_media_url"
        tipoField="hero_media_tipo"
        carpeta="hero"
        defaultUrl={mediaUrl}
        defaultTipo={mediaTipo}
        label="Fondo del hero (imagen o video)"
      />

      <p className="text-xs text-gray-500">
        Si subes un video, se reproduce en bucle, silenciado y automático. Si no configuras
        nada, el hero muestra el plano interactivo animado.
      </p>

      <input type="hidden" name="hero_poster_url" value={posterUrl} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-green-700">Guardado correctamente.</p> : null}

      <div>
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
      </div>
    </form>
  );
}
