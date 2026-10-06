// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Public address of the site, used for the sitemap and canonical links. The image
// build can override it with the SITE_URL build argument, e.g. for a staging host.
const siteUrl = process.env.SITE_URL || 'https://www.plumsolutions.net';

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	integrations: [
		starlight({
			title: 'Plum Solutions',
			description: 'Documentation for Plum Solutions projects.',
			logo: {
				light: './src/assets/brand/LogoWide.svg',
				dark: './src/assets/brand/LogoWideDark.svg',
				alt: 'Plum Solutions',
				replacesTitle: true,
			},
			favicon: '/favicon.svg',
			customCss: ['./src/styles/Starlight.css'],
			components: {
				SocialIcons: './src/components/DocsSocialIcons.astro',
			},
			// The site has its own branded 404 page in src/pages/404.astro.
			disable404Route: true,
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/AnotherMike-exe' }],
			// Each project's docs stand alone, so "next page" would jump between projects.
			pagination: false,
			editLink: {
				baseUrl: 'https://github.com/AnotherMike-exe/AstroServer/edit/main/',
			},
			sidebar: [
				{ label: 'Overview', link: '/docs/' },
				{ label: 'Plum Audio', items: [{ autogenerate: { directory: 'docs/plum-audio' } }] },
				{ label: 'Anilist Link', items: [{ autogenerate: { directory: 'docs/anilist-link' } }] },
				{ label: 'Plum Remotes', items: [{ autogenerate: { directory: 'docs/plum-remotes' } }] },
				{ label: 'WiFi Serial Bridge', items: [{ autogenerate: { directory: 'docs/wifi-serial-bridge' } }] },
			],
		}),
	],
});
