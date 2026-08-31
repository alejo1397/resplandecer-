-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('administrador');

-- CreateEnum
CREATE TYPE "TipoParametro" AS ENUM ('texto', 'imagen', 'numero', 'booleano');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'administrador',
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "ciudad" TEXT,
    "mensaje" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(12,2) NOT NULL,
    "precio_venta" DECIMAL(12,2),
    "categoria_id" BIGINT,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_catalogo" (
    "id" BIGSERIAL NOT NULL,
    "catalogo_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "texto_alternativo" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "imagenes_catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_testimonios" (
    "id" BIGSERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "texto_alternativo" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "imagenes_testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonios" (
    "id" BIGSERIAL NOT NULL,
    "nombre_cliente" TEXT NOT NULL,
    "cargo_o_ciudad" TEXT,
    "mensaje" TEXT NOT NULL,
    "calificacion" INTEGER,
    "imagen_id" BIGINT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redes_sociales" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icono" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_sitio" (
    "id" BIGSERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT,
    "tipo" "TipoParametro" NOT NULL DEFAULT 'texto',
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "configuracion_sitio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_slug_key" ON "catalogo"("slug");

-- CreateIndex
CREATE INDEX "catalogo_categoria_id_idx" ON "catalogo"("categoria_id");

-- CreateIndex
CREATE INDEX "imagenes_catalogo_catalogo_id_idx" ON "imagenes_catalogo"("catalogo_id");

-- CreateIndex
CREATE INDEX "testimonios_imagen_id_idx" ON "testimonios"("imagen_id");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_sitio_clave_key" ON "configuracion_sitio"("clave");

-- AddForeignKey
ALTER TABLE "catalogo" ADD CONSTRAINT "catalogo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_catalogo" ADD CONSTRAINT "imagenes_catalogo_catalogo_id_fkey" FOREIGN KEY ("catalogo_id") REFERENCES "catalogo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonios" ADD CONSTRAINT "testimonios_imagen_id_fkey" FOREIGN KEY ("imagen_id") REFERENCES "imagenes_testimonios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
