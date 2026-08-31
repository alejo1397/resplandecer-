# Especificación de Backend y Plan de Desarrollo — Proyecto Resplandecer

> Plan técnico para desarrollar, paso a paso, una página web de mobiliario
> inspirada en [lacarpinteria.co](https://www.lacarpinteria.co/), con arquitectura
> propia (no Shopify). El modelo de datos detallado está en `database-spec.md`.

---

## 1. Resumen del proyecto

**Qué se construye:** una página web de mobiliario donde **todo el contenido se
administra desde tablas de base de datos**, no editando el HTML. Un administrador
gestiona catálogo, categorías, testimonios, redes sociales y textos del sitio desde
un panel; la web pública lee esa información y solo muestra lo que esté en estado
**activo**.

**Modelo de negocio:** vitrina / catálogo + contacto por **WhatsApp**
(sin pagos en línea en esta etapa).

**Requisitos clave:** gratis para empezar, deploy automático (CI/CD), escalable
a futuro y ágil.

**Referencia analizada (lacarpinteria.co):** tienda Shopify con tema visual Beae,
Cloudflare como CDN, Swiper.js para carruseles y botón flotante de WhatsApp.
Componentes observados: header con navegación, hero/banner, grid de productos
destacados, colecciones por categoría, carrusel de productos, footer y WhatsApp.

---

## 2. Stack tecnológico (definido)

| Capa | Tecnología | Estado |
|---|---|---|
| Framework | **Next.js (React)** | Confirmado |
| Hosting / Deploy | **Vercel** (plan gratuito) | Confirmado |
| Base de datos | **Supabase** (PostgreSQL) | Confirmado |
| ORM | **Prisma** | Confirmado |
| Almacenamiento de imágenes | **Supabase Storage** | Confirmado |
| Autenticación admin | Supabase Auth o tabla `usuarios` propia | Por afinar en Fase 3 |
| CI/CD | Deploy automático desde Git a Vercel | Definido |

**Por qué este stack:** Vercel se integra de forma nativa con Next.js y ofrece
deploy automático en cada `git push`. Supabase concentra base de datos, almacenamiento
de imágenes y autenticación en un solo servicio gratuito y escalable. Prisma facilita
el trabajo con la base de datos con tipado y migraciones claras.

---

## 3. Arquitectura general

```
                    ┌─────────────────────────────┐
                    │        Navegador             │
                    └───────────────┬─────────────┘
                                    │
             ┌──────────────────────┴───────────────────────┐
             │              Next.js (Vercel)                 │
             │                                               │
             │   Web pública            Panel de administración
             │   (lee contenido)        (edita tablas paramétricas)
             │        │                         │             │
             │        └──────────┬──────────────┘             │
             │                   │ Prisma ORM                 │
             └───────────────────┼────────────────────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │        Supabase          │
                    │  PostgreSQL + Storage +  │
                    │        Auth              │
                    └──────────────────────────┘
```

- **Web pública:** renderiza catálogo, testimonios, redes y textos leyendo de la BD.
  Solo muestra registros con `estado = true`.
- **Panel admin:** protegido por login; permite al rol administrador crear/editar/ocultar
  registros de las tablas paramétricas.
- **Prisma:** capa de acceso a datos entre Next.js y PostgreSQL.
- **Supabase Storage:** guarda imágenes del catálogo y de testimonios.

---

## 4. Modelo de datos

El diseño completo de tablas está en **`database-spec.md`**. Resumen:

- **Contenido administrable:** `categorias`, `catalogo`, `imagenes_catalogo`,
  `testimonios`, `imagenes_testimonios`, `redes_sociales`, `configuracion_sitio`
- **Gestión interna:** `usuarios` (rol admin), `clientes`
- **Regla transversal:** toda tabla tiene `estado` (activo/inactivo) y fechas de
  creación/actualización. La web pública solo muestra `estado = true`.

---

## 5. Plan de desarrollo paso a paso

### Fase 0 — Preparación del entorno
- [x] Crear el proyecto Next.js dentro del workspace `Resplandecer` → carpeta `resplandecer-web/` (Next.js 16, TypeScript, Tailwind 4, App Router, ESLint)
- [x] Inicializar repositorio Git (repo único en la raíz, rama `main`, primer commit hecho)
- [ ] Crear cuenta y proyecto en Supabase (gratis) — **acción del usuario**
- [ ] Crear cuenta en Vercel y conectarla al repositorio — **acción del usuario**
- [ ] Configurar variables de entorno (`.env`) para la conexión a Supabase

> Nota: el proyecto vive en la subcarpeta `resplandecer-web/`. En Vercel, configurar
> el "Root Directory" como `resplandecer-web`. El repositorio Git está en la raíz e
> incluye las specs y el código.

### Fase 1 — Base de datos
- [x] Definir tipo de clave primaria → **uuid** para `usuarios`/`clientes`, **bigint autoincremental** para el contenido administrable
- [x] Crear el esquema Prisma (`schema.prisma`) según `database-spec.md` (9 modelos + 2 enums)
- [x] Crear script de seed con datos de ejemplo (`prisma/seed.ts`)
- [x] Ejecutar la primera migración y crear las tablas en Supabase (9 tablas creadas y datos de ejemplo cargados)

### Fase 2 — Conexión y ORM
- [x] Instalar y configurar Prisma (v6.19.3 estable)
- [x] Configurar el cliente de Prisma singleton para entorno serverless (`src/lib/prisma.ts`)
- [x] Verificar lectura/escritura contra la base de datos (verificado con lectura de productos + relaciones)

> Nota técnica: se usa **Prisma 6** (no 7) porque Prisma 7 introdujo cambios que
> requieren `prisma.config.ts` + driver adapter + ESM, añadiendo complejidad
> innecesaria para este proyecto. Prisma 6 es estable y compatible con Supabase.

### Fase 3 — Autenticación y panel admin (COMPLETADO)
- [x] Método de auth definido: **autenticación propia** con la tabla `usuarios` (JWT + cookie con `jose`)
- [x] Login para el rol administrador (`/admin/login`, verifica contra `usuarios`)
- [x] Proteger las rutas del panel admin (middleware en `/admin/:path*` + `requireAdmin`)
- [x] Layout base del panel de administración (sidebar, header con logout, dashboard con conteos)

> Credenciales del admin sembrado: `admin@resplandecer.co` / `cambiar-esta-clave`
> (cambiar esta contraseña antes de producción).
> Verificado: `/admin` sin sesión redirige a login; login valida contra la BD.

### Fase 4 — CRUD de tablas paramétricas (panel admin)
- [ ] Categorías (crear, listar, editar, activar/inactivar)
- [ ] Catálogo de productos + asociación de imágenes
- [ ] Testimonios + imágenes de testimonios
- [ ] Redes sociales
- [ ] Configuración del sitio (textos del hero, contacto, etc.)
- [ ] Gestión de clientes (lectura de contactos recibidos)

### Fase 5 — Web pública
- [ ] Header con navegación por categorías (leídas de la BD)
- [ ] Hero / banner (textos desde `configuracion_sitio`)
- [ ] Grid de productos destacados y por categoría (solo `estado = true`)
- [ ] Página de detalle de producto con galería de imágenes
- [ ] Sección de testimonios
- [ ] Footer con redes sociales
- [ ] Botón flotante de WhatsApp
- [ ] Formulario de contacto que guarda en la tabla `clientes`

### Fase 6 — Imágenes
- [ ] Configurar buckets en Supabase Storage
- [ ] Subida de imágenes desde el panel admin
- [ ] Optimización de imágenes con el componente de Next.js

### Fase 7 — Deploy y CI/CD
- [ ] Configurar variables de entorno en Vercel
- [ ] Primer despliegue en Vercel
- [ ] Verificar deploy automático en cada `git push`
- [ ] Revisar rendimiento y accesibilidad

---

## 6. Escenario futuro (escalabilidad)

Si más adelante se quiere **cobrar en línea** (tarjeta / PSE):
- Agregar tablas de `pedidos` y `pagos`
- Integrar una pasarela de pago (ej. Wompi/Mercado Pago para Colombia) o migrar a
  una solución como Medusa.js
- El stack actual (Next.js + Vercel + Supabase) soporta esta evolución sin rehacer todo.

---

## 7. Pendientes por definir

- [ ] Tipo de clave primaria: `bigint` autoincremental vs `uuid`
- [ ] Método de autenticación: Supabase Auth vs tabla `usuarios` propia
- [ ] Catálogo de parámetros iniciales para `configuracion_sitio`
- [ ] Roles adicionales además de `administrador` (si aplica)
