/**
 * Marquee infinito (cinta de texto en bucle). CSS puro, sin JavaScript.
 * El contenido se duplica para que el bucle sea continuo.
 */
export function Marquee({ items }: { items: string[] }) {
  // Duplicamos la lista para el loop sin cortes.
  const contenido = [...items, ...items];

  return (
    <div className="marquee border-y hairline-light bg-paper py-4">
      <div className="marquee__track">
        {contenido.map((texto, i) => (
          <span key={i} className="label-mono flex items-center text-ink/70">
            <span className="px-8">{texto}</span>
            <span aria-hidden className="text-ember">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
