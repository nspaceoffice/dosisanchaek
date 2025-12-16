import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind(), sitemap()],
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://dosisanchaek.vercel.app',
});
