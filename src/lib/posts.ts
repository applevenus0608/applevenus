import { getCollection, type CollectionEntry } from 'astro:content';
import { getAllMicroCMSBlogs, type MicroCMSBlog } from './microcms';

export interface UnifiedPost {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  source: 'markdown' | 'microcms';
  markdownEntry?: CollectionEntry<'blog'>;
  microcmsPost?: MicroCMSBlog;
}

function stripMarkdown(body: string, length = 90): string {
  const plain = body.replace(/[#*_>`[\]!]/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > length ? plain.slice(0, length) + '…' : plain;
}

function stripHtml(html: string, length = 90): string {
  const plain = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? plain.slice(0, length) + '…' : plain;
}

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * 公開済みの全記事(Markdown + microCMS)を、日付の新しい順で統合して返す。
 */
export async function getUnifiedPosts(): Promise<UnifiedPost[]> {
  const markdownEntries = await getCollection('blog', ({ data }) => data.status === 'publish');
  const microcmsBlogs = await getAllMicroCMSBlogs();

  const fromMarkdown: UnifiedPost[] = markdownEntries.map((entry) => ({
    slug: entry.data.slug,
    title: entry.data.title,
    date: entry.data.date,
    categories: entry.data.categories,
    tags: entry.data.tags,
    excerpt: stripMarkdown(entry.body ?? ''),
    source: 'markdown',
    markdownEntry: entry,
  }));

  const fromMicroCMS: UnifiedPost[] = microcmsBlogs.map((post) => ({
    slug: post.id,
    title: post.title,
    date: post.publishedAt,
    categories: (post.category ?? []).map((c) => c.name),
    tags: parseTags(post.tags),
    excerpt: stripHtml(post.content ?? ''),
    source: 'microcms',
    microcmsPost: post,
  }));

  return [...fromMarkdown, ...fromMicroCMS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getUnifiedPostBySlug(slug: string): Promise<UnifiedPost | null> {
  const posts = await getUnifiedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
