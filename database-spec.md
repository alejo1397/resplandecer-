# Especificación de Base de Datos — Proyecto Resplandecer

> Documento de diseño de la base de datos para la página web de mobiliario.
> Motor previsto: **PostgreSQL** (Supabase o Neon).
> Complementa a `backend-spec.md`.

---

## 1. Principios de diseño

1. **Todo administrable desde tablas, no desde el HTML.**
   El contenido de la página web (textos, secciones, banners, redes sociales,
   testimonios, catálogo, etc.) se guarda en **tablas paramétricas administrables**.
   El administrador edita esas tablas y la web se actualiza sola, sin tocar código
   ni HTML.

2. **Estado activo / inactivo en todas las tablas.**
   Cada tabla incluye un campo de estado para decidir si el registro se muestra o no
   en la página. Así se puede ocultar contenido sin borrarlo.

3. **Trazabilidad.**
   Cada tabla incluye fechas de creación y actualización.

---

## 2. Convenciones comunes a todas las tablas

Todas las tablas comparten estas columnas base:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `bigint` / `uuid` (PK) | Identificador único |
| `estado` | `boolean` | `true` = activo (se muestra en la web), `false` = inactivo (oculto) |
| `creado_en` | `timestamptz` | Fecha de creación |
| `actualizado_en` | `timestamptz` | Fecha de última actualización |

> Convención: `estado = true` significa **Activo** (visible en la página web);
> `estado = false` significa **Inactivo** (no se muestra).

---

## 3. Tablas de la base de datos

### 3.1. `usuarios` — Acceso y roles
Almacena los usuarios que pueden ingresar al panel de administración.
Solo el rol **administrador** puede editar las tablas paramétricas administrables
que contienen la información de la página web.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador del usuario |
| `nombre` | text | Nombre completo |
| `email` | text (único) | Correo de ingreso |
| `password_hash` | text | Contraseña cifrada (nunca en texto plano) |
| `rol` | text / enum | Rol del usuario (`administrador`, y a futuro otros) |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

> Nota: si se usa Supabase, la autenticación puede apoyarse en Supabase Auth y esta
> tabla guardar el perfil/rol asociado.

---

### 3.2. `clientes` — Datos del cliente
Almacena la información de los clientes (contactos, interesados, compradores).

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador del cliente |
| `nombre` | text | Nombre del cliente |
| `email` | text | Correo del cliente |
| `telefono` | text | Teléfono / WhatsApp |
| `ciudad` | text | Ciudad (opcional) |
| `mensaje` | text | Mensaje o solicitud (opcional) |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.3. `categorias` — Categorías del catálogo (paramétrica administrable)
Categorías de los productos (ej. Comedores, Sillas, Barras).

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre de la categoría |
| `slug` | text (único) | Identificador para URL |
| `descripcion` | text | Descripción (opcional) |
| `orden` | int | Orden de aparición en la web |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.4. `catalogo` — Productos del catálogo (paramétrica administrable)
Cada producto/mueble del catálogo.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre del producto |
| `slug` | text (único) | Identificador para URL |
| `descripcion` | text | Descripción del producto |
| `precio` | numeric | Precio regular |
| `precio_venta` | numeric | Precio de venta / promoción (opcional) |
| `categoria_id` | bigint (FK → categorias.id) | Categoría a la que pertenece |
| `destacado` | boolean | Si aparece en la sección de destacados |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.5. `imagenes_catalogo` — Imágenes asociadas al catálogo
Imágenes que se asocian a cada producto del catálogo para mostrarlo (galería).
Un producto puede tener varias imágenes.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `catalogo_id` | bigint (FK → catalogo.id) | Producto al que pertenece la imagen |
| `url` | text | URL de la imagen (Supabase Storage / Cloudinary) |
| `texto_alternativo` | text | Texto alt para accesibilidad/SEO |
| `es_principal` | boolean | Si es la imagen principal del producto |
| `orden` | int | Orden dentro de la galería |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.6. `testimonios` — Testimonios (paramétrica administrable)
Testimonios de clientes que se muestran en la página.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre_cliente` | text | Nombre de quien da el testimonio |
| `cargo_o_ciudad` | text | Cargo, ciudad o referencia (opcional) |
| `mensaje` | text | Texto del testimonio |
| `calificacion` | int | Calificación 1–5 (opcional) |
| `imagen_id` | bigint (FK → imagenes_testimonios.id) | Foto asociada al testimonio |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.7. `imagenes_testimonios` — Imágenes de los testimonios
Fotos asociadas a los testimonios.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `url` | text | URL de la imagen |
| `texto_alternativo` | text | Texto alt |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

> Alternativa de diseño: la foto del testimonio también podría guardarse como un
> campo `url` directamente en `testimonios`. Se mantiene como tabla aparte según
> lo solicitado, para gestionar las imágenes de forma independiente.

---

### 3.8. `redes_sociales` — Redes sociales (paramétrica administrable)
Almacena las redes sociales de la empresa que se muestran en la web.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre de la red (Instagram, Facebook, WhatsApp, TikTok, etc.) |
| `url` | text | Enlace al perfil |
| `icono` | text | Nombre o URL del ícono a mostrar |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

### 3.9. `configuracion_sitio` — Parámetros generales de la web (paramétrica administrable)
Tabla clave para administrar textos y contenido general de la página web sin tocar
el HTML (nombre del sitio, textos del hero, banners, información de contacto, etc.).
Diseño tipo clave–valor para máxima flexibilidad.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `clave` | text (único) | Nombre del parámetro (ej. `titulo_hero`, `telefono_contacto`) |
| `valor` | text | Valor del parámetro |
| `tipo` | text | Tipo de dato (`texto`, `imagen`, `numero`, `booleano`) |
| `descripcion` | text | Descripción de para qué sirve el parámetro |
| `estado` | boolean | Activo / inactivo |
| `creado_en` | timestamptz | |
| `actualizado_en` | timestamptz | |

---

## 4. Relaciones entre tablas

- `catalogo.categoria_id` → `categorias.id` (una categoría tiene muchos productos)
- `imagenes_catalogo.catalogo_id` → `catalogo.id` (un producto tiene muchas imágenes)
- `testimonios.imagen_id` → `imagenes_testimonios.id` (un testimonio tiene una foto)
- `usuarios` administra todas las tablas paramétricas (relación lógica por permisos, no por FK)

```
categorias 1 ── N catalogo 1 ── N imagenes_catalogo
imagenes_testimonios 1 ── N testimonios
usuarios (rol admin) ──► administra ──► [categorias, catalogo, testimonios,
                                          redes_sociales, configuracion_sitio, ...]
```

---

## 5. Tablas paramétricas administrables (resumen)

Estas son las tablas que el administrador edita para controlar la página web
sin tocar el HTML:

- `categorias`
- `catalogo`
- `imagenes_catalogo`
- `testimonios`
- `imagenes_testimonios`
- `redes_sociales`
- `configuracion_sitio`

Las tablas `usuarios` y `clientes` son de gestión interna (no de contenido visible
editable como tal, aunque también respetan el estado activo/inactivo).

---

## 6. Regla de estado (activo / inactivo)

- Toda tabla incluye la columna `estado` (`boolean`).
- La página web **solo muestra** los registros con `estado = true`.
- Para ocultar contenido, el administrador cambia el estado a `false` sin borrar el dato.

---

## 7. Pendientes por definir

- [ ] Elegir tipo de PK: `bigint` autoincremental vs `uuid`
- [ ] Confirmar motor: Supabase vs Neon
- [ ] Definir si la autenticación usa Supabase Auth o tabla `usuarios` propia
- [ ] Definir catálogo de parámetros iniciales para `configuracion_sitio`
- [ ] Definir roles adicionales además de `administrador` (si aplica)
