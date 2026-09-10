"use client";

import { useEffect, useRef } from "react";

/**
 * Texto que se "arma" palabra por palabra (suben con mascara y stagger) al
 * entrar en vista. Ligero: IntersectionObserver nativo + CSS. Fallback seguro.
 */
export function SplitText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const palabras = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenos || !("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    // Salvaguarda
    const safety = window.setTimeout(() => el.classList.add("is-visible"), 1500);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return (
    <h2 ref={ref} className={`split ${className}`}>
      {palabras.map((palabra, i) => (
        <span key={i} className="split-word">
          <span style={{ transitionDelay: `${i * 0.08}s` }}>
            {palabra}
          </span>
          {i < palabras.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}
