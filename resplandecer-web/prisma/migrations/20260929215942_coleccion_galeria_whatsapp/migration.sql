-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "whatsapp_mensaje" TEXT,
ADD COLUMN     "whatsapp_texto" TEXT;

-- CreateTable
CREATE TABLE "imagenes_categoria" (
    "id" BIGSERIAL NOT NULL,
    "categoria_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "texto_alternativo" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "imagenes_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "imagenes_categoria_categoria_id_idx" ON "imagenes_categoria"("categoria_id");

-- AddForeignKey
ALTER TABLE "imagenes_categoria" ADD CONSTRAINT "imagenes_categoria_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
