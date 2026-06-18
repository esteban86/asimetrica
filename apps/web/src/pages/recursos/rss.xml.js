import { seoPages } from '@/data/seoPages.js';

const SITE = 'https://asimetrica.co';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export function GET() {
  const recursos = seoPages.filter((p) => p.type === 'recurso');
  const items = recursos
    .map((p) => {
      const url = `${SITE}/recursos/${p.slug}`;
      const pub = p.datePublished || '2026-06-15';
      const pubDate = new Date(`${pub}T00:00:00Z`).toUTCString();
      return `    <item>
      <title>${esc(p.h1)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(p.metaDescription)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Recursos · Asimétrica</title>
    <link>${SITE}/recursos</link>
    <description>Guías de dirección financiera estratégica, FP&amp;A, flujo de caja y valoración para empresas colombianas.</description>
    <language>es-CO</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
