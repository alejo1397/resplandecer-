-- CreateTable
CREATE TABLE "paginas_contenido" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "paginas_contenido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloques_contenido" (
    "id" BIGSERIAL NOT NULL,
    "pagina_id" BIGINT NOT NULL,
    "subtitulo" TEXT,
    "contenido" TEXT NOT NULL,
    "imagen_url" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bloques_contenido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paginas_contenido_slug_key" ON "paginas_contenido"("slug");

-- CreateIndex
CREATE INDEX "bloques_contenido_pagina_id_idx" ON "bloques_contenido"("pagina_id");

-- AddForeignKey
ALTER TABLE "bloques_contenido" ADD CONSTRAINT "bloques_contenido_pagina_id_fkey" FOREIGN KEY ("pagina_id") REFERENCES "paginas_contenido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
