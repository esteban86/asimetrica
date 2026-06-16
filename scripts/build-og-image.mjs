// Genera apps/web/public/og-image.png (1200x630) replicando el design system.
// Logo real compuesto desde public/logo.png; texto en SVG.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const logoPath = path.join(root, 'apps/web/public/logo.png');
const outPath = path.join(root, 'apps/web/public/og-image.png');

const W = 1200, H = 630;

// Colores del design system (HSL → hex aprox)
const NAVY_DARK = '#0E141D';
const NAVY_TEAL = '#1A2940';
const MINT = '#3DFFC8';
const VIOLET = '#7A5AFC';
const WHITE = '#FFFFFF';
const MUTED = '#9CA3B0';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY_DARK}"/>
      <stop offset="1" stop-color="${NAVY_TEAL}"/>
    </linearGradient>
    <radialGradient id="glowMint" cx="0.82" cy="0.12" r="0.5">
      <stop offset="0" stop-color="${MINT}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${MINT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.12" cy="0.92" r="0.5">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="divider" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${MINT}"/>
      <stop offset="1" stop-color="${VIOLET}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glowMint)"/>
  <rect width="${W}" height="${H}" fill="url(#glowViolet)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="20" fill="none" stroke="${WHITE}" stroke-opacity="0.06" stroke-width="2"/>

  <!-- el logo se compone con sharp; aquí solo el texto -->
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" text-anchor="middle">
    <text x="${W / 2}" y="352" fill="${WHITE}" font-size="44" font-weight="600" letter-spacing="0.2">Dirección Financiera Estratégica</text>
    <text x="${W / 2}" y="404" fill="${MUTED}" font-size="25" font-weight="500" letter-spacing="2.5">CFO Fraccional&#160;&#160;·&#160;&#160;Analítica&#160;&#160;·&#160;&#160;Finanzas Corporativas</text>

    <rect x="${W / 2 - 70}" y="446" width="140" height="4" rx="2" fill="url(#divider)"/>

    <text x="${W / 2}" y="512" fill="${MINT}" font-size="36" font-weight="700" letter-spacing="0.5">asimetrica.co</text>
    <text x="${W / 2}" y="556" fill="${MUTED}" font-size="25" font-weight="400" letter-spacing="1.5">Medellín, Colombia</text>
  </g>
</svg>`;

const base = await sharp(Buffer.from(svg)).png().toBuffer();

// Logo: ancho objetivo 460px, centrado, parte superior del bloque
const LOGO_W = 460;
const logo = await sharp(readFileSync(logoPath)).resize({ width: LOGO_W }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const left = Math.round((W - LOGO_W) / 2);
const top = Math.round(232 - logoMeta.height); // que el logo "descanse" sobre y≈232

await sharp(base)
  .composite([{ input: logo, top, left }])
  .png()
  .toFile(outPath);

console.log(`OK → ${outPath} (logo ${LOGO_W}x${logoMeta.height}, top ${top})`);
