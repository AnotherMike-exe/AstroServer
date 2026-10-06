// Site-wide links, used by the site header, the footer and the docs header,
// so the three never disagree.

export const SITE_NAME = 'Plum Solutions';
export const GITHUB_URL = 'https://github.com/AnotherMike-exe';
export const SOURCE_URL = 'https://github.com/AnotherMike-exe/AstroServer';

export interface NavLink {
	label: string;
	href: string;
	// The path prefix that marks this link as the current section.
	section: string;
}

export const NAV_LINKS: NavLink[] = [
	{ label: 'Projects', href: '/#projects', section: '/projects' },
	{ label: 'Docs', href: '/docs/', section: '/docs' },
	{ label: 'Store', href: '/store/', section: '/store' },
];

export function isCurrent(link: NavLink, pathname: string): boolean {
	return pathname === link.section || pathname.startsWith(link.section + '/');
}
