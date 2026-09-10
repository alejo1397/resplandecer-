"use client";

import { useState } from "react";

type Item = { pregunta: string; respuesta: string };

/**
 * FAQ acordeon numerado y accesible. Al hacer clic en una pregunta se despliega
 * su respuesta. Solo una abierta a la vez.
 */
export function Faq({ items }: { items: Item[] }) {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <p className="label-mono text-ink/50">Preguntas frecuentes</p>
      <h2 className="display mt-3 text-[clamp(1.6rem,3.5vw,2.6rem)] text-ink">FAQ</h2>

      <div className="mt-10 border-t hairline-light">
        {items.map((item, i) => {
          const activo = abierta === i;
          return (
            <div key={i} className="border-b hairline-light">
              <h3>
                <button
                  type="button"
                  onClick={() => setAbierta(activo ? null : i)}
                  aria-expanded={activo}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="label-mono text-ink/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-medium text-ink">{item.pregunta}</span>
                  </span>
                  <span
                    className={`shrink-0 text-2xl text-ember transition-transform duration-300 ${
                      activo ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: activo ? "1fr" : "0fr",
                  opacity: activo ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 pl-10 text-sm leading-relaxed text-ink/70">
                    {item.respuesta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
