import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Tipografia protagonista (titulos): grotesk, pesos fuertes.
const archivo = Archivo({
  variable: "--font-headings",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// Cuerpo de texto.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Monoespaciada para labels, numeros y precios.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Resplandecer | Diseno & Produccion de Mobiliario",
  description:
    "Diseno y produccion de mobiliario a la medida. Convertimos tus espacios en lo que suenas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
