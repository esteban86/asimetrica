# Pagina Asimetrica

## Stack
- **Framework:** Astro 5 (output `static` / SSG) — HTML estático, JS mínimo
- **UI interactiva:** React 18 como *islands* (`@astrojs/react`) + shadcn/ui (Radix)
- **Estilos:** Tailwind CSS 3 (`@astrojs/tailwind`) + tokens HSL en `src/styles/global.css`
- **Fuentes:** Inter self-host (`@fontsource-variable/inter`) + Satoshi (Fontshare)
- **Iconos:** lucide-react (en islands) / SVG inline (en markup estático)
- **Animaciones:** CSS + IntersectionObserver (sin framer-motion)
- **Analítica:** Cloudflare Web Analytics (sin cookies) — activa con `PUBLIC_CF_BEACON_TOKEN`
- **Backend:** sin backend — formulario vía Web3Forms

> La página es una sola ruta (`src/pages/index.astro`). No hay router ni react-hook-form/zod.

## Estructura
```
apps/web/
  src/
    pages/index.astro        # La landing (markup estático + scripts cliente)
    layouts/Layout.astro     # <head>: meta/OG, fuentes, JSON-LD, analítica
    components/ContactModal.jsx   # Island (client:idle): modal de contacto + toasts
    components/ui/*          # shadcn/ui (Button, Card, Dialog, Input, Label, Sonner)
    styles/global.css        # Tokens de color, tipografía, utilidades
  public/                    # Imágenes (logo, prisma-*.webp...), CNAME, robots.txt
apps/pocketbase/             # Legado — ya no se usa
```

## Comandos
```bash
npm run dev        # Dev server (Astro) en localhost:3000
npm run build      # Build de producción → dist/apps/web
npm run preview    # Sirve el build de producción
npm run check      # astro check (type-check de .astro/.jsx)
npm run lint       # ESLint (.astro + .jsx)
```
(El root reenvía a `apps/web`; o usar `--prefix apps/web`.)

## Formulario de contacto
- Envío a **Web3Forms** (`https://api.web3forms.com/submit`)
- Key en `import.meta.env.PUBLIC_WEB3FORMS_KEY` (Astro solo expone vars `PUBLIC_*` al cliente)
- Archivo: `apps/web/src/components/ContactModal.jsx` (island)
- Los botones estáticos abren el modal disparando el evento `open-contact-modal`

## Variables de entorno
```
PUBLIC_WEB3FORMS_KEY=<key>     # API key de web3forms.com
PUBLIC_CF_BEACON_TOKEN=<token> # Cloudflare Web Analytics (opcional)
```
En GitHub Actions: `PUBLIC_WEB3FORMS_KEY` ← secret `VITE_WEB3FORMS_KEY` (reusado);
`PUBLIC_CF_BEACON_TOKEN` ← secret `CF_BEACON_TOKEN`.

## Hosting
- **Repo:** https://github.com/esteban86/asimetrica
- **Deploy:** GitHub Pages vía Actions (`.github/workflows/deploy.yml`) en cada push a `main`
- **CI:** `.github/workflows/ci.yml` en cada PR — lint + astro check + build + Lighthouse CI (`lighthouserc.json`)
- **Dominio:** `asimetrica.co` (custom domain; `CNAME` en `apps/web/public/`)
- El secret `VITE_WEB3FORMS_KEY` debe estar en Settings → Secrets → Actions

## Notas
- `astro.config.mjs`: `base: '/'`, `site: 'https://asimetrica.co'`, `outDir: '../../dist/apps/web'`
- Sitemap generado por `@astrojs/sitemap` (`/sitemap-index.xml`)
- Progressive enhancement: el contenido `.fade-in` es visible por defecto; solo se anima si hay JS (clase `.js` en `<html>`)
- `public/og-image.png` (1200×630) es la imagen de compartir (OG/Twitter)
- El `.env` local no se sube al repo (está en `.gitignore`)
