import { supabaseRest } from "./supabase";

export type LocalizedText = Record<"vi" | "en" | "ko" | "ru" | "zh", string>;
export type Post = { id: string; slug: string; title: LocalizedText; excerpt: LocalizedText; body: LocalizedText; cover_image: string | null; published_at: string | null; seo_title: LocalizedText; seo_description: LocalizedText };

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    return await supabaseRest<Post[]>("posts?status=eq.published&order=published_at.desc&select=id,slug,title,excerpt,body,cover_image,published_at,seo_title,seo_description");
  } catch { return []; }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const posts = await supabaseRest<Post[]>(`posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=id,slug,title,excerpt,body,cover_image,published_at,seo_title,seo_description`);
    return posts[0] || null;
  } catch { return null; }
}

export function text(value: LocalizedText | null | undefined, locale = "vi") {
  return value?.[locale as keyof LocalizedText] || value?.vi || "";
}
