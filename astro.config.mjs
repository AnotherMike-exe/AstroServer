// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// SITE_URL is the public address, e.g. https://example.com. The image build passes it
// in as a build argument. Astro needs it for the sitemap and canonical links. Without
// it the site still builds and serves; only those two features are skipped.
const siteUrl = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	integrations: [
		starlight({
			title: 'Plum Solutions',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/AnotherMike-exe' }],
			sidebar: [
				{
					label: 'Projects',
					items: [{ autogenerate: { directory: 'projects' } }],
				},
				{
					label: 'Documentation',
					items: [{ autogenerate: { directory: 'docs' } }],
				},
			],
		}),
	],
});
