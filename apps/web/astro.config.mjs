import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build
export default defineConfig({
	site: 'https://asimetrica.co',
	base: '/',
	trailingSlash: 'ignore',
	outDir: '../../dist/apps/web',
	integrations: [
		react(),
		// applyBaseStyles: false — base styles live in src/styles/global.css
		tailwind({ applyBaseStyles: false }),
		sitemap(),
	],
	server: { port: 3000, host: true },
	vite: {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	},
});
