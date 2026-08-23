import "server-only";
import { query } from "./db";

export type LocalizedText = Record<"vi" | "en" | "ko" | "ru" | "zh", string>;
export type Post = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  cover_image: string | null;
  published_at: string | null;
  seo_title: LocalizedText;
  seo_description: LocalizedText;
};

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    return await query<Post>(
      `SELECT id, slug, title, excerpt, body, cover_image, published_at, seo_title, seo_description
       FROM public.posts
       WHERE status = 'published'
       ORDER BY published_at DESC NULLS LAST`
    );
  } catch (err) {
    console.error("Error fetching published posts:", err);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const posts = await query<Post>(
      `SELECT id, slug, title, excerpt, body, cover_image, published_at, seo_title, seo_description
       FROM public.posts
       WHERE slug = $1 AND status = 'published'
       LIMIT 1`,
      [slug]
    );
    return posts[0] || null;
  } catch (err) {
    console.error("Error fetching post:", err);
    return null;
  }
}

export function text(value: LocalizedText | null | undefined, locale = "vi") {
  return value?.[locale as keyof LocalizedText] || value?.vi || "";
}
