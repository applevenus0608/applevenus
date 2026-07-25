import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    slug: z.string(),
    status: z.enum(['publish', 'draft']),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    legacy_id: z.string(),
  }),
});

export const collections = { blog };
