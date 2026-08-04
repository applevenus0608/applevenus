// microCMSからブログ記事・カテゴリを取得するための関数群

const SERVICE_DOMAIN = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = import.meta.env.MICROCMS_API_KEY;

export interface MicroCMSCategory {
  id: string;
  name: string;
}

export interface MicroCMSBlog {
  id: string;
  title: string;
  content: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category?: MicroCMSCategory[];
  tags?: string;
  publishedAt: string;
  revisedAt: string;
}

interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * microCMSの環境変数(サービスドメイン・APIキー)が設定されているかどうか。
 * 未設定の場合、microCMS連携をまるごとスキップして既存のMarkdown記事のみで動作させる。
 */
export function isMicroCMSConfigured(): boolean {
  return Boolean(SERVICE_DOMAIN && API_KEY);
}

async function microcmsFetch<T>(endpoint: string, queryString = ''): Promise<T | null> {
  if (!isMicroCMSConfigured()) return null;

  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY as string },
    });
    if (!res.ok) {
      console.error(`[microCMS] fetch failed: ${res.status} ${endpoint}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[microCMS] fetch error: ${endpoint}`, err);
    return null;
  }
}

/**
 * 公開済みの全ブログ記事を取得する(100件を超える場合は自動でページングして全件取得)。
 */
export async function getAllMicroCMSBlogs(): Promise<MicroCMSBlog[]> {
  if (!isMicroCMSConfigured()) return [];

  const limit = 100;
  let offset = 0;
  const all: MicroCMSBlog[] = [];

  while (true) {
    const data = await microcmsFetch<MicroCMSListResponse<MicroCMSBlog>>(
      'blogs',
      `limit=${limit}&offset=${offset}`
    );
    if (!data) break;
    all.push(...data.contents);
    if (all.length >= data.totalCount || data.contents.length === 0) break;
    offset += limit;
  }

  return all;
}

export async function getMicroCMSBlogById(id: string): Promise<MicroCMSBlog | null> {
  return microcmsFetch<MicroCMSBlog>(`blogs/${id}`);
}
