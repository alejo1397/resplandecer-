# 🎛 PROMPT MAESTRO — Sitio premium tipo Awwwards (reutilizable para cualquier sector)

Este documento genera **el mismo sistema de diseño** (minimalismo editorial, oscuro
dominante, animaciones premium) para cualquier industria: moda, modelaje, software,
inmobiliaria, gastronomía, consultoría, etc.

**Cómo se usa en 3 pasos:**

1. Rellena el **BLOQUE A — PANEL DE CONTROL** (5 minutos).
2. Copia **BLOQUE A + BLOQUE B** completos y pégalos como prompt.
3. Para ajustar después, usa los **micro-prompts** del final.

> 💡 Todo lo que está entre `{{ }}` es lo único que debes cambiar.
> Lo demás define la calidad y conviene dejarlo tal cual.

---

# ▓▓ BLOQUE A — PANEL DE CONTROL ▓▓

*(Rellena, borra las opciones que no uses y pega tal cual junto al Bloque B)*

```yaml
# ── 1. IDENTIDAD ────────────────────────────────────────────────────
MARCA:            {{Resplandecer}}
SECTOR:           {{muebles de alta gama e interiorismo}}
IDIOMA:           {{español}}   # afecta textos, fechas y formato numérico
PROMESA (1 frase):{{Diseñamos, fabricamos e instalamos. Un solo responsable.}}
TITULAR HERO:     {{Del bosque / al salón.}}   # 2 líneas, máx. 4 palabras cada una
TONO:             {{sobrio, técnico, sin adjetivos vacíos}}

# ── 2. PALETA (5 colores controlan TODO, incluidos los canvas) ─────
# Elige un preset o define los tuyos en HEX.
PRESET: {{EDITORIAL}}   # EDITORIAL | MODA_PASTEL | ESTUDIO_CALIDO | TECH_NEON | LUJO_SOBRIO | CUSTOM

  ink:      {{#0c0c0c}}   # superficie oscura + texto sobre claro
  paper:    {{#fafafa}}   # superficie clara + texto sobre oscuro
  electric: {{#0016cb}}   # acento frío: halos, planos, cotas
  ember:    {{#ff5500}}   # acento cálido: estados activos, progreso, dots
  signal:   {{#ff1f2e}}   # resalte puntual: ubicación destacada, alertas

# REGLA: ink↔paper debe dar contraste ≥ 7:1. Si aclaras `ink` por encima
# de #3a3a3a, invierte el texto de secciones oscuras a un tono oscuro.

# ── 3. TIPOGRAFÍA ──────────────────────────────────────────────────
PRESET_TIPO: {{EDITORIAL}}   # EDITORIAL | MODA | TECH | LUJO | CUSTOM
  headings: {{Archivo}}        # grotesk condensada, 700, MAYÚSCULAS, tracking -0.035em
  body:     {{Inter}}          # 400/500
  mono:     {{IBM Plex Mono}}  # labels, números, botones

# ── 4. FIGURA DEL HERO (el "planeta" adaptado a tu sector) ─────────
# Canvas 2D interactivo, arrastrable, con rotación automática e inercia.
FIGURA_HERO: {{GLOBO_PUNTOS}}
  # Ver catálogo completo en el Bloque C
PUNTO_DESTACADO: {{Bogotá, Colombia}}   # se marca en `signal` con onda expansiva
NODOS: {{Madrid, Milán, Miami, CDMX, Bogotá, Londres, Berlín, Dubái, São Paulo, Tokio}}

# ── 5. SECUENCIA DE SCROLL (el "proceso de obra" adaptado) ─────────
# Sección sticky de ~360vh donde el scroll avanza y retrocede 60 fotogramas.
SECUENCIA: {{PASES_DE_RENDER}}
  # Ver catálogo completo en el Bloque D
FASES: {{Replanteo | Modelado | Texturizado | Render final}}   # exactamente 4
IMAGEN_BASE: {{fotografía real de cocina con isla de mármol}}
TELEMETRÍA: {{AOV, muestras (spp), tiempo, estado}}   # HUD de 4 métricas

# ── 6. PÁGINAS Y CIFRAS ────────────────────────────────────────────
PÁGINAS: {{Home, Servicios, Nosotros, Insights, Contacto, FAQ}}
SERVICIOS (6): {{Carpintería a medida, Cocinas de autor, Remodelaciones,
                 Sofás y tapicería, Interiorismo, Contract}}
STATS (4): {{2.500+ piezas/mes | 98,2% en fecha | 8+ años | 120 artesanos}}
CTA PRINCIPAL: {{Iniciar proyecto}}
```

---

# ▓▓ BLOQUE B — ESPECIFICACIÓN TÉCNICA (pegar sin cambios) ▓▓

Construye un sitio web corporativo premium para **{{MARCA}}**, del sector
**{{SECTOR}}**, con nivel de acabado tipo Awwwards: minimalista, editorial,
con animaciones premium. Todo el contenido en **{{IDIOMA}}**.

### 1. Stack

- React + Vite + TypeScript + Tailwind v4 (tokens con `@theme`).
- **GSAP 3 + ScrollTrigger** para scroll-driven animation.
- **Lenis** para smooth scroll, sincronizado con el ticker de GSAP.
- Router por hash con **transiciones de cortina de doble panel** (sin flash blanco).
- Sin librerías de UI. Las figuras se dibujan en **canvas 2D**, no WebGL:
  rinden igual, pesan una fracción y funcionan en cualquier móvil.
- Imágenes con `srcset` responsivo, `loading="lazy"` y **blur-up**.

### 2. Sistema de diseño

- **Tema dual**: secciones oscuras (`ink`) alternando con claras (`paper`).
- **Hairlines de 1px**: `#ffffff29` sobre oscuro, `#11111126` sobre claro.
- **Acentos con moderación**: `electric` en halos y planos, `ember` en estados
  activos y progreso, `signal` solo para el resalte puntual.
- **Tipografía protagonista**: títulos en `clamp()` hasta 10rem, MAYÚSCULAS,
  tracking negativo. Labels y números siempre en monoespaciada.
- **Botones pill** outline con relleno que sube desde abajo en hover.
- **Grid de 12 columnas** con `--pad` fluido y breakpoints 991 / 767 / 479 px.

> ⚠️ **PANEL DE CONTROL OBLIGATORIO**: agrupa los 5 colores, las 3 fuentes y el
> easing en **un único bloque comentado al inicio de `src/index.css`**, con
> 4 presets alternativos comentados listos para descomentar. Crea además
> `src/lib/palette.ts`, que lee esos custom properties y los expone como
> `"r,g,b"` para que **los canvas usen exactamente los mismos colores**.
> Cambiar un HEX debe repintar también el hero y la secuencia de scroll.

### 3. Estructura del Home

1. **Preloader**: mapa mundial de puntos dibujado progresivamente en canvas,
   contador mono 000→100, marquees infinitos, y **cortina que se levanta**
   montando la página debajo (sin parpadeo).
2. **Nav fija**: logo, links, botón pill, drawer de Insights con categorías y
   previews. Se oculta al bajar, reaparece al subir y **cambia de tema (claro/
   oscuro) según la sección** que tiene detrás.
3. **Hero**: label mono, titular gigante en 2 líneas, subtítulo, 2 botones y la
   **FIGURA_HERO interactiva**. En móvil se sustituye por imagen con blur.
4. **Intro editorial**: split-text, imagen full-bleed con parallax, fila de
   4 contadores animados.
5. **Contador scrubbed**: una cifra grande que sube ligada al scroll.
6. **Servicios**: 6 filas con **imagen flotante que sigue al cursor** en hover.
7. **SECUENCIA sticky** (ver Bloque D).
8. **FAQ** acordeón numerado + **Insights** con filtros por categoría.
9. **Footer**: marquee superior, columnas, sedes, legal.

### 4. Animaciones

- Smooth scroll Lenis ↔ ScrollTrigger.
- **Split-text por palabras** con máscara: suben con stagger al entrar.
- Reveals `fade + translateY` con easing expo; parallax sutil en imágenes.
- Marquees infinitos; contadores animados; barra de progreso de lectura.
- Cursor personalizado con `mix-blend-mode: difference` que crece en enlaces.
- **`prefers-reduced-motion`**: desactiva Lenis, cursor y scrubs; la secuencia
  salta directamente al fotograma final.

### 5. Calidad

- HTML semántico, meta OG/Twitter, **JSON-LD** (Organization + FAQPage +
  WebSite), `sitemap.xml`, `robots.txt`, favicon SVG.
- Accesibilidad: contraste AA, `:focus-visible`, `aria-expanded`/`aria-controls`
  en acordeones y drawers, skip-link, navegación completa por teclado.
- Contenido en **objetos JSON tipados** (`src/data/content.ts`), migrable a CMS.
- Canvas: `ResizeObserver` + `IntersectionObserver` (no dibujar fuera de vista),
  `devicePixelRatio` limitado a 2.

---

# ▓▓ BLOQUE C — CATÁLOGO DE FIGURAS DEL HERO ▓▓

*Todas: canvas 2D, arrastrables, con inercia, rotación automática que se pausa
al pasar el ratón, accesibles por teclado y con un nodo destacado en `signal`.*

| Clave | Figura | Ideal para | Qué representa |
|---|---|---|---|
| `GLOBO_PUNTOS` | Globo terráqueo de puntos con arcos entre sedes | Logística, grupos globales, consultoría | Presencia internacional |
| `TORSO_WIREFRAME` | Maniquí/torso en malla que rota, con puntos de medida | **Moda, modelaje, sastrería** | Ajuste y patronaje |
| `PRENDA_ORBITA` | Siluetas de prendas orbitando un eje, con estelas | Moda, e-commerce | Colección y variedad |
| `MOLECULA` | Grafo 3D de nodos conectados, con nodos que laten | Software, IA, biotech | Red, sistema, datos |
| `PLANTA_ORBITAL` | Plano arquitectónico que rota en perspectiva isométrica | Arquitectura, inmobiliaria | Espacio y proyecto |
| `DIAMANTE` | Poliedro facetado con destellos y refracción simulada | Joyería, lujo | Precisión y valor |
| `ESFERA_TIPO` | Esfera formada por letras/palabras del sector | Editorial, agencias, cultura | Lenguaje de marca |
| `PARTICULAS_PRODUCTO` | Nube de partículas que se agrupa formando tu producto | Producto, industria | Fabricación |
| `ONDA_AUDIO` | Superficie de onda 3D reactiva | Música, podcast, eventos | Sonido y ritmo |

**Prompt para cambiarla:**
> Sustituye la figura del hero por `{{CLAVE}}`. Mantén exactamente la misma
> interacción (arrastre con inercia, giro automático pausable, foco por teclado,
> nodo destacado en `signal` con onda expansiva y etiqueta con línea guía) y que
> siga leyendo los colores desde `src/lib/palette.ts`.

---

# ▓▓ BLOQUE D — CATÁLOGO DE SECUENCIAS DE SCROLL ▓▓

*Sección sticky de ~360vh. El scroll avanza **y retrocede** 60 fotogramas en
4 fases, con HUD de telemetría, barra de progreso y contador de frame.*

| Clave | Las 4 fases | Ideal para |
|---|---|---|
| `PASES_DE_RENDER` | Escaneo láser → Clay/AO → Texturizado PBR → Render con buckets | Arquitectura, interiorismo, 3D, producto |
| `ATELIER` | Patrón plano → Maniquí e hilvanado → Tejido y color → Editorial con luz | **Moda, sastrería, tapicería** |
| `SESION_FOTO` | Storyboard → Set e iluminación → Pose y encuadre → Retoque por capas | **Modelaje, fotografía, publicidad** |
| `LINEA_PRODUCCION` | Boceto CAD → Despiece → Ensamblaje → Control de calidad | Industria, manufactura |
| `BUILD_SOFTWARE` | Wireframe → Componentes → Datos en vivo → Producto final | SaaS, apps, producto digital |
| `OBRA_REAL` | Replanteo → Estructura → Instalaciones → Entrega | Construcción, reformas |
| `PLATO` | Ingredientes → Mise en place → Cocción → Emplatado | Gastronomía, hostelería |
| `EMBUDO_VENTAS` | Prospección → Cualificación → Propuesta → Cierre | Ventas, consultoría, B2B |

**Técnica común (mantener siempre):**
1. Parte de **una fotografía real** con CORS abierto (`crossOrigin="anonymous"`).
2. **Hornea las variantes una sola vez** en canvas fuera de pantalla (clay,
   albedo/plano, final, versión suave, bloom). Por fotograma solo `drawImage`
   con recorte → el scrub va fluido.
3. Revela cada fase con una **máscara distinta**: barrido vertical, barrido
   lateral con línea de avance, y **celdas tipo bucket** en recorrido serpenteante.
4. Cierra con **bloom aditivo, viñeta y grano**; en el frame 60 no debe quedar
   ningún sobreimpreso técnico: solo la imagen limpia.
5. Fallback si el navegador no soporta `ctx.filter` (Safari < 17): genera las
   variantes con modos de fusión (`saturation`, `multiply`).

**Prompt para cambiarla:**
> Cambia la secuencia de scroll a `{{CLAVE}}` con las fases {{F1 | F2 | F3 | F4}}.
> Usa como imagen base {{descripción}}. Mantén la técnica de horneado previo,
> los buckets en la última fase, el HUD de telemetría y el grano final.

---

# ▓▓ BLOQUE E — PRESETS DE COLOR LISTOS ▓▓

Todos verificados con contraste **AA** (texto blanco sobre `ink` ≥ 13:1).

| Preset | ink | paper | electric | ember | signal | Sector |
|---|---|---|---|---|---|---|
| **EDITORIAL** | `#0c0c0c` | `#fafafa` | `#0016cb` | `#ff5500` | `#ff1f2e` | Corporativo, industrial |
| **MODA_PASTEL** | `#2b2430` | `#faf4f0` | `#8fa9d6` | `#e8a598` | `#d4787f` | **Moda, belleza, lifestyle** |
| **ESTUDIO_CALIDO** | `#1a1613` | `#f7f3ec` | `#4a6b52` | `#c8763c` | `#b3423a` | Artesanía, interiorismo |
| **TECH_NEON** | `#08090c` | `#f4f6f8` | `#3d5afe` | `#00e5a0` | `#ff2e63` | Software, IA |
| **LUJO_SOBRIO** | `#0f0f10` | `#f5f3ee` | `#2e4a7d` | `#c2a24c` | `#9e2b2b` | Joyería, inmobiliaria prime |

### Cómo cambiar de paleta en 10 segundos

Abre `src/index.css`. Arriba del todo está el bloque
`██ PANEL DE CONTROL ██`. Solo sustituye estos 5 valores:

```css
@theme {
  --color-ink:      #2b2430;   /* ← superficie oscura   */
  --color-paper:    #faf4f0;   /* ← superficie clara    */
  --color-electric: #8fa9d6;   /* ← acento frío         */
  --color-ember:    #e8a598;   /* ← acento cálido       */
  --color-signal:   #d4787f;   /* ← resalte puntual     */
}
```

Eso repinta **todo**: secciones, botones, hover, el globo del hero, la
secuencia de render, el preloader y el footer.

### Consejos por tipo de paleta

- **Pasteles (moda)**: sube el peso visual con tipografía más fina y más aire.
  El `ink` debe seguir siendo oscuro (un ciruela/carbón tintado, no un beige)
  para que el texto blanco cumpla AA. Añade `--motion: 0.8` para un ritmo
  más suave y elegante.
- **Neón (tech)**: baja la opacidad de los halos al 60% o saturarán la pantalla.
- **Lujo**: usa `ember` dorado solo en hairlines y números, nunca en fondos
  grandes.
- **Monocromo**: pon `electric` y `ember` en dos grises distintos y deja
  `signal` como único color. Queda extremadamente elegante.

---

# ▓▓ BLOQUE F — MICRO-PROMPTS DE AJUSTE ▓▓

Para iterar después de la primera generación:

```
🎨 Cambia la paleta al preset MODA_PASTEL del panel de control.

🔤 Cambia headings a "Bodoni Moda" y body a "Jost", manteniendo la mono.

🌍 Sustituye la figura del hero por TORSO_WIREFRAME, con el punto
   destacado en {{ciudad}}.

🎬 Cambia la secuencia de scroll a ATELIER con las fases
   Patrón | Hilvanado | Tejido | Editorial.

🖼 Sustituye todas las fotos por {{tema}} manteniendo el blur-up y el srcset.

📄 Añade una página {{Portfolio}} con grid masonry filtrable, reutilizando
   PageHero y el sistema de reveals.

🐢 Baja la intensidad de las animaciones a la mitad (--motion: 0.5) y
   suaviza el scrub de la secuencia.

📱 Optimiza para móvil: sustituye el canvas del hero por imagen con blur
   y reduce la secuencia sticky a 200vh.
```

---

## Checklist de aceptación

- [ ] Al cargar: preloader con contador → cortina que sube → hero animado.
- [ ] La figura del hero **gira sola y se puede arrastrar** con inercia.
- [ ] La secuencia avanza **y retrocede** con el scroll, sin saltos.
- [ ] Cambiar 1 HEX en el panel repinta **también los canvas**.
- [ ] Navegación entre páginas **sin flash blanco**.
- [ ] Todo responsive; en móvil el canvas del hero es imagen con blur.
- [ ] `prefers-reduced-motion` desactiva scrubs y smooth scroll.
- [ ] Contraste AA, foco visible y navegación por teclado.
