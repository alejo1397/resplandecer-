# Especificación de Base de Datos y Plan de Implementación — Proyecto Resplandecer

> Diseño de la base de datos y plan paso a paso para implementarla.
> Motor: **PostgreSQL (Supabase)**. ORM: **Prisma 6**. Complementa a `backend-spec.md`.

---

## 1. Principios de diseño

1. **Todo administrable desde tablas, no desde el HTML.** El contenido de la web
   (textos, banners, redes sociales, testimonios, catálogo) vive en **tablas
   paramétricas administrables**. El administrador las edita y la web se actualiza
   sola, sin tocar código.
2. **Estado activo / inactivo en todas las tablas.** Cada tabla tiene un campo
   `estado` para mostrar u ocultar el registro sin borrarlo.
3. **Trazabilidad.** Cada tabla incluye fechas de creación y actualización.

---

## 2. Decisiones cerradas

| Decisión | Valor definido |
|---|---|
| Motor de base de datos | **Supabase** (PostgreSQL) |
| ORM | **Prisma 6** (estable) |
| Tipo de PK — `usuarios`, `clientes` | **uuid** (datos sensibles / compatible con auth) |
| Tipo de PK — contenido administrable | **bigint** autoincremental (simple y legible) |
| Estado | `boolean`: `true` = activo (visible), `false` = inactivo (oculto) |
| Timestamps | `creado_en`, `actualizado_en` (`timestamptz`) en todas las tablas |

---

## 3. Convenciones comunes a todas las tablas

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `bigint` o `uuid` (PK) | Identificador único (ver decisión en sección 2) |
| `estado` | `boolean` | `true` = activo (visible en la web), `false` = inactivo |
| `creado_en` | `timestamptz` | Fecha de creación |
| `actualizado_en` | `timestamptz` | Fecha de última actualización |

---

## 4. Diseño de tablas

### 4.1. `usuarios` — Acceso y roles (uuid)
Usuarios que ingresan al panel de administración. Solo el rol **administrador**
puede editar las tablas paramétricas.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador del usuario |
| `nombre` | text | Nombre completo |
| `email` | text (único) | Correo de ingreso |
| `password_hash` | text | Contraseña cifrada (nunca en texto plano) |
| `rol` | enum | Rol (`administrador`) |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.2. `clientes` — Datos del cliente (uuid)
Contactos e interesados recibidos desde la web.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid (PK) | Identificador del cliente |
| `nombre` | text | Nombre del cliente |
| `email` | text | Correo (opcional) |
| `telefono` | text | Teléfono / WhatsApp (opcional) |
| `ciudad` | text | Ciudad (opcional) |
| `mensaje` | text | Mensaje o solicitud (opcional) |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.3. `categorias` — Categorías del catálogo (bigint, administrable)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre de la categoría |
| `slug` | text (único) | Identificador para URL |
| `descripcion` | text | Descripción (opcional) |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.4. `catalogo` — Productos (bigint, administrable)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre del producto |
| `slug` | text (único) | Identificador para URL |
| `descripcion` | text | Descripción |
| `precio` | numeric(12,2) | Precio regular |
| `precio_venta` | numeric(12,2) | Precio de promoción (opcional) |
| `categoria_id` | bigint (FK → categorias.id) | Categoría |
| `destacado` | boolean | Si aparece en destacados |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.5. `imagenes_catalogo` — Galería de productos (bigint)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `catalogo_id` | bigint (FK → catalogo.id) | Producto asociado |
| `url` | text | URL de la imagen (Supabase Storage) |
| `texto_alternativo` | text | Texto alt (accesibilidad/SEO) |
| `es_principal` | boolean | Imagen principal del producto |
| `orden` | int | Orden en la galería |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.6. `testimonios` — Testimonios (bigint, administrable)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre_cliente` | text | Nombre de quien da el testimonio |
| `cargo_o_ciudad` | text | Cargo, ciudad o referencia (opcional) |
| `mensaje` | text | Texto del testimonio |
| `calificacion` | int | Calificación 1–5 (opcional) |
| `imagen_id` | bigint (FK → imagenes_testimonios.id) | Foto asociada |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.7. `imagenes_testimonios` — Fotos de testimonios (bigint)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `url` | text | URL de la imagen |
| `texto_alternativo` | text | Texto alt |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.8. `redes_sociales` — Redes sociales (bigint, administrable)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `nombre` | text | Nombre de la red (Instagram, Facebook, WhatsApp, TikTok) |
| `url` | text | Enlace al perfil |
| `icono` | text | Nombre o URL del ícono |
| `orden` | int | Orden de aparición |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

### 4.9. `configuracion_sitio` — Parámetros generales (bigint, administrable)
Tabla clave–valor para administrar textos y contenido de la web sin tocar el HTML.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | bigint (PK) | Identificador |
| `clave` | text (único) | Nombre del parámetro (ej. `titulo_hero`) |
| `valor` | text | Valor del parámetro |
| `tipo` | enum | Tipo (`texto`, `imagen`, `numero`, `booleano`) |
| `descripcion` | text | Para qué sirve el parámetro |
| `estado` | boolean | Activo / inactivo |
| `creado_en` / `actualizado_en` | timestamptz | Trazabilidad |

---

## 5. Relaciones

```
categorias 1 ── N catalogo 1 ── N imagenes_catalogo
imagenes_testimonios 1 ── N testimonios
usuarios (rol admin) ──► administra ──► [categorias, catalogo, testimonios,
                                          redes_sociales, configuracion_sitio, ...]
```

- `catalogo.categoria_id` → `categorias.id` (onDelete: SetNull)
- `imagenes_catalogo.catalogo_id` → `catalogo.id` (onDelete: Cascade)
- `testimonios.imagen_id` → `imagenes_testimonios.id` (onDelete: SetNull)
- `usuarios` administra las tablas paramétricas (relación lógica por permisos)

**Tablas paramétricas administrables:** `categorias`, `catalogo`, `imagenes_catalogo`,
`testimonios`, `imagenes_testimonios`, `redes_sociales`, `configuracion_sitio`.
**Gestión interna:** `usuarios`, `clientes`.

---

## 6. Regla de estado (activo / inactivo)

- Toda tabla incluye `estado` (`boolean`).
- La web pública **solo muestra** registros con `estado = true`.
- Para ocultar contenido, el admin cambia el estado a `false` sin borrar el dato.

---

## 7. Plan de implementación paso a paso

### Fase D0 — Modelado (COMPLETADO)
- [x] Definir tipo de PK (uuid para usuarios/clientes, bigint para el resto)
- [x] Traducir el diseño a esquema Prisma (`resplandecer-web/prisma/schema.prisma`)
- [x] Definir enums (`RolUsuario`, `TipoParametro`)
- [x] Definir relaciones y reglas onDelete
- [x] Crear script de seed con datos de ejemplo (`prisma/seed.ts`)

> El esquema Prisma ya refleja las 9 tablas de este documento. Nombres de columnas
> mapeados a snake_case en la BD (`@map`) y modelos en PascalCase en el código.

### Fase D1 — Conexión a Supabase (COMPLETADO)
- [x] Crear proyecto en Supabase y obtener las cadenas de conexión
- [x] Configurar `DATABASE_URL` (pooling, 6543) y `DIRECT_URL` (sesión, 5432) en `.env`
- [x] Probar conexión (exitosa)

### Fase D2 — Migración y datos (COMPLETADO)
- [x] Ejecutar la primera migración (`prisma migrate dev --name init`) → 9 tablas creadas
- [x] Ejecutar el seed (`prisma db seed`) → datos de ejemplo cargados
- [x] Verificar tablas y datos (1 admin, 3 categorías, 5 productos con imagen, 1 testimonio, 3 redes, 5 parámetros de config; relaciones OK)

### Fase D3 — Seguridad de datos (PENDIENTE)
- [ ] Revisar/activar Row Level Security (RLS) en Supabase para las tablas
- [ ] Definir políticas: lectura pública solo de registros con `estado = true`;
      escritura solo para el rol administrador
- [ ] Asegurar que la `service_role key` solo se use en el servidor

### Fase D4 — Capa de acceso a datos (PENDIENTE)
- [ ] Crear funciones/consultas reutilizables por tabla (queries de lectura para la
      web pública filtrando por `estado = true` y `orden`)
- [ ] Crear consultas de administración (CRUD) para el panel
- [ ] Tipar los resultados con los tipos generados por Prisma

### Fase D5 — Mantenimiento y evolución (FUTURO)
- [ ] Estrategia de migraciones para producción (`prisma migrate deploy`)
- [ ] Respaldos (backups de Supabase)
- [ ] Índices adicionales según el uso real (rendimiento)
- [ ] Tablas futuras si se habilita cobro en línea (`pedidos`, `pagos`)

---

## 8. Parámetros iniciales de `configuracion_sitio`

Definidos en el seed (ajustables desde el panel admin):

| Clave | Ejemplo de valor | Uso |
|---|---|---|
| `titulo_hero` | Diseño & Producción de Mobiliario | Título principal del hero |
| `subtitulo_hero` | Convertimos tus espacios en lo que sueñas. | Subtítulo del hero |
| `telefono_contacto` | +57 300 000 0000 | Teléfono de contacto |
| `whatsapp_numero` | 573000000000 | Número de WhatsApp (formato internacional sin +) |
| `email_contacto` | contacto@resplandecer.co | Correo de contacto |

---

## 9. Pendientes por definir

- [ ] Método de autenticación: Supabase Auth vs tabla `usuarios` propia (se decide en Fase 3 del backend)
- [ ] Políticas RLS concretas por tabla (Fase D3)
- [ ] Roles adicionales además de `administrador` (si aplica)
