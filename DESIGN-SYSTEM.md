# Asimétrica — Design System

Resumen del sistema de diseño de la web de Asimétrica (CFO Fraccional · finanzas
estratégicas, Medellín). Pensado como brief para diseñar en Claude o cualquier
herramienta de diseño. **Fuente de verdad:** `apps/web/src/styles/global.css`
(tokens HSL) + Tailwind. Los HEX aquí son aproximaciones para herramientas que
piden HEX; el valor canónico es HSL.

> Tema: **dark-first**. Fondo navy profundo, acentos mint/coral/violeta,
> tipografía sobria. Tono: pro, sobrio, "restraint + jerarquía", nada estridente.

---

## 1. Color (tokens HSL → HEX aprox.)

Todos los colores se definen como variables HSL y se usan con opacidad variable
(`hsl(var(--x) / 0.08)`, etc.).

| Token | HSL | HEX aprox. | Uso |
|---|---|---|---|
| `--background` | `217 33% 11%` | `#131A25` | Fondo principal (navy muy oscuro) |
| `--card` / `--popover` | `225 28% 14%` | `#1A1F2E` | Superficies, tarjetas, modales |
| `--foreground` | `0 0% 100%` | `#FFFFFF` | Texto principal |
| `--primary` (mint) | `163 100% 62%` | `#3DFFC8` | Acento de marca, CTAs, links, datos "buenos" |
| `--primary-foreground` | `213 28% 7%` | `#0D1117` | Texto sobre mint |
| `--secondary` (coral) | `4 92% 69%` | `#F97167` | Alertas, datos "malos"/negativos, riesgo |
| `--accent` (violeta) | `252 96% 67%` | `#7A5AFC` | Acento secundario (patrimonio, glows) |
| `--muted-foreground` | `220 13% 65%` | `#9CA3B0` | Texto secundario / apagado |
| `--destructive` | `0 84% 60%` | `#EF4444` | Destructivo (poco usado) |
| `--border` / `--input` | `0 0% 100%` | `#FFFFFF` | Bordes (siempre con baja opacidad: 0.06–0.12) |
| `--ring` | `163 100% 62%` | `#3DFFC8` | Focus ring (mint) |

**Reglas de color:**
- Los bordes nunca son blanco sólido: siempre `border-border/[0.06–0.12]`.
- Mint = positivo / acción / marca. Coral = negativo / alerta. Violeta = acento puntual.
- En visualizaciones EEFF: favorable = mint, desfavorable = coral, patrimonio = violeta.
- `radius` base: `--radius: 0.5rem` (8px). Tarjetas grandes: `0.875rem` (14px).

---

## 2. Tipografía

| Familia | Uso | Pesos |
|---|---|---|
| **Satoshi** (Fontshare) | Titulares (`heading-*`) | 400, 500, 600, 700 |
| **Inter Variable** (self-host) | Cuerpo, UI, labels | 400, 500, 600 |

Clases:
- `.heading-primary` / `.heading-secondary` → Satoshi 700
- `.heading-tertiary` → Satoshi 600
- `.heading-section` → Satoshi 500
- `.body-text` / `.body-secondary` / `.description` → Inter 400

Escala (fluida, `clamp`):
- `h1`: `clamp(2rem, 5vw, 3.5rem)` · line-height 1.1 · letter-spacing `-0.02em`
- `h2`: `clamp(1.75rem, 4vw, 2.5rem)` · line-height 1.2
- `h4`: `clamp(1.25rem, 2.5vw, 1.5rem)` · line-height 1.4
- `p`: line-height 1.625 · **`max-width: 65ch`** (cap de legibilidad)
- Titulares con `text-wrap: balance`.
- `.tnum` → `font-variant-numeric: tabular-nums` (cifras alineadas en tablas/datos).

---

## 3. Espaciado y layout

- Contenedor ancho: `max-w-7xl` (80rem) · contenido de lectura: `max-w-3xl` (48rem).
- Padding lateral: `px-4 sm:px-6 lg:px-8`.
- Ritmo vertical de secciones: `py-12 md:py-20`.
- Breakpoints Tailwind estándar: `sm 640 · md 768 · lg 1024 · xl 1280`.
- **Párrafos centrados**: por el cap `max-width: 65ch`, en bloques `.text-center`
  se centra el bloque con `.text-center > p { margin-inline: auto }`.

---

## 4. Componentes / utilidades de marca

| Clase | Qué es |
|---|---|
| `.eyebrow` | Kicker en mayúsculas + línea mint a la izquierda; sobre cada sección |
| `.card-surface` | Superficie de tarjeta: `--card` + borde 0.08 + top-highlight (luz desde arriba), radius 14px |
| `.card-hover` | Hover: `-translate-y-1` + sombra mint suave |
| `.gradient-text-primary` | Texto con degradado mint→cian (clip:text) |
| `.gradient-separator` | Hairline con degradado coral→mint→violeta (acento ocasional) |
| `.section-divider` | Hairline sutil (norma para separar secciones) |
| `.glass` | Superficie translúcida (chips sobre dashboards) |
| `.float-chip` | Chip flotante de dato (glass) sobre mockups |
| `.aurora-glow` (`.turquesa` / `.purpura`) | Glows difusos animados de fondo (blur 120px, opacity 0.15) |
| `.grain` | Textura de grano sutil sobre el fondo |
| `.link-underline` | Subrayado que crece desde la izquierda en hover/focus |
| `.dfn` / `.dfn-note` | Sidenote de jerga estilo distill (definición en hover/focus/tap) |
| `.folio-outline` | Números grandes tipo "folio" en coral (sección Problema) |
| `.brand-aster` / `.aster-watermark` | Asterisco de marca / marca de agua |
| `.product-shot`, `.dash-tilt`, `.hero-grid` | Mockups de dashboard inclinados + grid del hero |
| `.reveal-lines .rl`, `.focus-word` | Reveal de líneas (clip-path) y palabra enfocada en el H1 |

---

## 5. Motion (sutil, respeta `prefers-reduced-motion`)

- **Progressive enhancement:** el contenido es visible por defecto; solo se anima
  si hay JS (clase `.js` en `<html>`). `.fade-in` → opacity+translateY 20px,
  easing `cubic-bezier(0.22, 1, 0.36, 1)`, 0.7s, disparado por IntersectionObserver.
- Header se condensa al hacer scroll (`#site-header.scrolled`).
- Líneas/círculos del Proceso se "dibujan"/"encienden" al revelar.
- Sparklines con `stroke-dashoffset` (draw-on-reveal).
- `::selection` en mint. Scrollbar fina on-brand (solo punteros finos).
- Todo el motion se neutraliza bajo `prefers-reduced-motion: reduce`.

---

## 6. Inventario de páginas (qué diseñar)

**Home** (`/`) — una sola ruta larga:
Hero (H1 con palabra enfocada "retrovisor" + mockup dashboard inclinado) ·
Problema (números folio coral) · Solución + Visión · Proceso (timeline) ·
Pilares · Herramientas · Prisma (producto) · Planes (3 niveles + ancla de precio +
garantía) · FAQ (acordeón) · CTA final · Footer 5 columnas.

**Servicios** (`/servicios/[slug]`): `cfo-fraccional`, `direccion-financiera-estrategica`,
`valoracion-de-empresas`, `preparacion-para-inversion`, `fpa-presupuesto-forecast`.

**Recursos** (`/recursos/[slug]`): `optimizar-capital-de-trabajo`,
`flujo-de-caja-13-semanas`, `modelo-financiero-tres-estados`,
`arbol-de-rentabilidad`, `como-valorar-una-empresa-en-colombia`.

Las páginas de servicio/recurso comparten plantilla (`ContentPage.astro`):
hero + breadcrumb · tira de cifras clave · índice · secciones con visuales
intercaladas · **explorables interactivos** (sliders → recálculo en vivo, estilo
distill: capital de trabajo, DCF, flujo 13 semanas, waterfall de resultados,
balance apilado, bridge de caja, árbol DuPont, variance bridge) · FAQ · enlaces
internos · CTA · footer.

---

## 7. Principios (para mantener coherencia al rediseñar)

1. **Restraint + jerarquía.** Mucho aire, hairlines como norma, el degradado es
   acento *ocasional* — no decoración constante.
2. **El dato es el héroe.** Cifras en tabular-nums, mint = bueno / coral = malo,
   visualizaciones honestas (sin inventar números — es contenido financiero/YMYL).
3. **Dark-first, navy + mint.** No cambiar la paleta núcleo.
4. **Accesible.** Focus ring mint, `prefers-reduced-motion`, contraste, skip-link.
5. **Estática y rápida.** HTML estático (Astro), JS mínimo (islands), sin frameworks
   de animación pesados.
