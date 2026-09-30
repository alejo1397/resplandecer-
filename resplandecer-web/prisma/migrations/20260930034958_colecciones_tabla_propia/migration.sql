-- CreateTable
CREATE TABLE "colecciones" (
    "id" BIGSERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resumen" TEXT,
    "descripcion" TEXT,
    "imagen_url" TEXT,
    "imagen_alt" TEXT,
    "whatsapp_texto" TEXT,
    "whatsapp_mensaje" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "colecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_coleccion" (
    "id" BIGSERIAL NOT NULL,
    "coleccion_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "texto_alternativo" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "imagenes_coleccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colecciones_slug_key" ON "colecciones"("slug");

-- CreateIndex
CREATE INDEX "imagenes_coleccion_coleccion_id_idx" ON "imagenes_coleccion"("coleccion_id");

-- AddForeignKey
ALTER TABLE "imagenes_coleccion" ADD CONSTRAINT "imagenes_coleccion_coleccion_id_fkey" FOREIGN KEY ("coleccion_id") REFERENCES "colecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
