"use client";

import { useActionState } from "react";
import { guardarProductoAction, type FormState } from "./actions";
import { Field, TextInput, TextArea, Select, Checkbox, SubmitButton, LinkButton } from "../_components/ui";

type Producto = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  precioVenta: number | null;
  categoriaId: number | null;
  destacado: boolean;
  orden: number;
  estado: boolean;
};

type CategoriaOpcion = { id: number; nombre: string };

const initialState: FormState = {};

export function ProductoForm({
  producto,
  categorias,
}: {
  producto?: Producto;
  categorias: CategoriaOpcion[];
}) {
  const [state, action, pending] = useActionState(guardarProductoAction, initialState);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {producto ? <input type="hidden" name="id" value={producto.id} /> : null}

      <Field label="Nombre">
        <TextInput name="nombre" defaultValue={producto?.nombre} required />
      </Field>

      <Field label="Slug" hint="Se genera del nombre si lo dejas vacio.">
        <TextInput name="slug" defaultValue={producto?.slug} />
      </Field>

      <Field label="Descripcion">
        <TextArea name="descripcion" defaultValue={producto?.descripcion ?? ""} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio">
          <TextInput name="precio" type="number" min={0} step="1" defaultValue={producto?.precio ?? 0} required />
        </Field>
        <Field label="Precio de venta" hint="Opcional.">
          <TextInput name="precioVenta" type="number" min={0} step="1" defaultValue={producto?.precioVenta ?? ""} />
        </Field>
      </div>

      <Field label="Categoria">
        <Select name="categoriaId" defaultValue={producto?.categoriaId ?? ""}>
          <option value="">Sin categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Orden">
        <TextInput name="orden" type="number" defaultValue={producto?.orden ?? 0} />
      </Field>

      <Checkbox name="destacado" label="Destacado (aparece en la portada)" defaultChecked={producto?.destacado ?? false} />
      <Checkbox name="estado" label="Activo (visible en la web)" defaultChecked={producto?.estado ?? true} />

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="mt-2 flex items-center gap-3">
        <SubmitButton>{pending ? "Guardando..." : "Guardar"}</SubmitButton>
        <LinkButton href="/admin/catalogo" variant="secondary">
          Cancelar
        </LinkButton>
      </div>
    </form>
  );
}
