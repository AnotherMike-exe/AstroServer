import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// One Markdown file per project in src/content/projects/. The file name is the URL:
// plum-audio.md becomes /projects/plum-audio/. The body is the project page.
const projects = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		// One sentence, shown in the project list and as the page description.
		summary: z.string(),
		// Available: you can install or build it today.
		// In development: being built, not ready to use.
		// Design phase: research and design, nothing to use yet.
		status: z.enum(['Available', 'In development', 'Design phase']),
		kind: z.string(),
		platform: z.string(),
		// Public source repositories only. Leave it out for a private repository.
		repo: z.url().optional(),
		// Path of the project's documentation, e.g. /docs/plum-audio/.
		docs: z.string().optional(),
		// Position in the project list, lowest first.
		order: z.number(),
	}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	projects,
};
