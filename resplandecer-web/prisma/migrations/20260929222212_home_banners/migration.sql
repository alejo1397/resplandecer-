-- CreateTable
CREATE TABLE "home_banners" (
    "id" BIGSERIAL NOT NULL,
    "seccion" TEXT NOT NULL,
    "titulo" TEXT,
    "subtitulo" TEXT,
    "etiqueta" TEXT,
    "imagen_url" TEXT NOT NULL,
    "enlace_url" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "home_banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_banners_seccion_idx" ON "home_banners"("seccion");
