# Guía de idioma: Español de Latinoamérica

## Propósito
Asegurar que todas las traducciones, interfaces de usuario, textos, etiquetas, componentes de internacionalización, metadatos SEO y contenidos generados para Resplandecer utilicen estrictamente español de Latinoamérica, con tono cercano, claro, profesional y coherente con una marca de diseño y fabricación de mobiliario a la medida.

## Reglas obligatorias

1. Usar español de Latinoamérica en todo el producto.
2. Mantener ortografía correcta con tildes, signos de apertura y cierre, y mayúsculas según corresponda.
3. Evitar regionalismos de España o expresiones ajenas al público latinoamericano.
4. No usar textos sin acentos en la interfaz, salvo slugs, URLs, nombres técnicos, variables o limitaciones estrictas del sistema.
5. Mantener los slugs de rutas sin tildes para compatibilidad, por ejemplo: `/disena-tu-espacio`, pero mostrar en UI: `Diseña tu espacio`.
6. Todo texto nuevo administrable debe tener valores iniciales en español latinoamericano.
7. Si existe i18n, usar locale base `es-419` o `es-CO` según la arquitectura existente. No introducir otro locale sin necesidad.
8. No mezclar inglés en textos visibles al usuario final, salvo nombres de marca, términos técnicos inevitables o enlaces externos.
9. Los textos del panel administrativo también deben estar en español latinoamericano.
10. Validar que metadatos, títulos, botones, placeholders, mensajes de error, estados vacíos y textos alternativos de imágenes estén en español latinoamericano.

## Preferencias de vocabulario

Usar:
- Computador, no ordenador.
- Celular, no móvil, cuando se hable de teléfono.
- Carrito, no cesta.
- Cotización, no presupuesto, salvo que el contexto ya use presupuesto como término comercial válido.
- Escríbenos, contáctanos, agenda tu asesoría.
- Diseño, fabricación, instalación, mobiliario, colecciones, categorías, productos.

Evitar:
- Vosotros, vuestro, os.
- Vale como confirmación principal.
- Ordenador, escaparate, formulario de contacto con expresiones españolas si no corresponden.

## Correcciones frecuentes en Resplandecer

- `Resplandcer` debe corregirse a `Resplandecer`.
- `Diseno` debe mostrarse como `Diseño`.
- `Produccion` debe mostrarse como `Producción`.
- `Que hacemos` debe mostrarse como `Qué hacemos` o `¿Qué hacemos?` según diseño.
- `Delbosquealsalón` debe mostrarse como `Del bosque al salón`.
- `Del diseno a tu espacio` debe mostrarse como `Del diseño a tu espacio`.
- `Maria Gomez — Bogota` debe mostrarse como `María Gómez — Bogotá`.
- `Escribenos` debe mostrarse como `Escríbenos`.
- `terminos y condiciones` debe mostrarse como `Términos y condiciones`.

## Tono de marca

El tono debe transmitir:
- Calidez artesanal.
- Diseño contemporáneo.
- Confianza y acompañamiento.
- Calidad, durabilidad y detalle.

Ejemplos de tono correcto:
- `Convertimos tus espacios en lo que sueñas.`
- `Muebles hechos a medida para vivirlos todos los días.`
- `Cuéntanos tu idea y la transformamos en un espacio funcional, bello y duradero.`

## Revisión antes de entregar

Antes de finalizar cualquier cambio, ejecutar una búsqueda global para detectar textos sin tildes o no latinoamericanos en archivos de UI, configuración, datos semilla, metadatos y panel administrativo. Corregirlos sin modificar nombres técnicos, rutas, variables o identificadores internos que puedan romper la aplicación.
