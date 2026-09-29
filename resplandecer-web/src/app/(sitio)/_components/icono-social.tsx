/**
 * Íconos de redes sociales como SVG inline (sin dependencias externas).
 *
 * Se resuelve el ícono a partir del campo `icono` de la red social o, si no
 * viene, a partir del `nombre`. Todos usan `currentColor`, de modo que el color
 * se controla desde la clase del contenedor (ej. texto blanco en el footer).
 * Si no se reconoce la red, se muestra un ícono genérico de enlace.
 */

type IconProps = { className?: string };

function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function Instagram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.44c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.45a5.95 5.95 0 1 1 0 11.9 5.95 5.95 0 0 1 0-11.9Zm0 1.44a4.51 4.51 0 1 0 0 9.02 4.51 4.51 0 0 0 0-9.02Zm6.19-.55a1.39 1.39 0 1 1-2.78 0 1.39 1.39 0 0 1 2.78 0Z" />
    </svg>
  );
}

function Facebook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function WhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.07-.8.38-.27.3-1.05 1.02-1.05 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.02 21.7h-.01a9.62 9.62 0 0 1-4.9-1.34l-.35-.21-3.64.95.97-3.55-.23-.36a9.6 9.6 0 0 1-1.47-5.11c0-5.31 4.32-9.63 9.64-9.63 2.57 0 4.99 1 6.81 2.82a9.57 9.57 0 0 1 2.82 6.82c0 5.31-4.32 9.63-9.64 9.63Zm8.2-17.83A11.03 11.03 0 0 0 12.02.99C5.96.99 1.03 5.92 1.02 11.98c0 1.94.51 3.84 1.48 5.51L.93 23.02l5.66-1.48a11 11 0 0 0 5.42 1.38h.01c6.05 0 10.98-4.93 10.99-10.99a10.93 10.93 0 0 0-3.19-7.75Z" />
    </svg>
  );
}

function TikTok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v13.2a2.43 2.43 0 1 1-2.43-2.43c.25 0 .5.04.72.11v-3.27a5.7 5.7 0 1 0 4.9 5.65V9.4a7.36 7.36 0 0 0 4.3 1.38V7.6a4.28 4.28 0 0 1-3.23-1.78Z" />
    </svg>
  );
}

function Youtube({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.8 12l-6.2 3.57Z" />
    </svg>
  );
}

function Enlace({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** Devuelve el ícono de la red según su nombre o clave de ícono. */
export function IconoSocial({
  nombre,
  icono,
  className = "h-5 w-5",
}: {
  nombre: string;
  icono?: string | null;
  className?: string;
}) {
  const clave = normaliza(icono || nombre);

  if (clave.includes("instagram")) return <Instagram className={className} />;
  if (clave.includes("facebook")) return <Facebook className={className} />;
  if (clave.includes("whatsapp") || clave.includes("wa")) return <WhatsApp className={className} />;
  if (clave.includes("tiktok")) return <TikTok className={className} />;
  if (clave.includes("youtube") || clave.includes("yt")) return <Youtube className={className} />;
  return <Enlace className={className} />;
}
