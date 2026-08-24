import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/server/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maigo79.com";
  const posts = await getPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bang-gia`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/loai-xe`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bai-viet`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ve-chung-toi`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chinh-sach`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/chinh-sach/bao-ve-quyen-rieng-tu`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/chinh-sach/van-chuyen-hanh-khach`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/bai-viet/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const localizedRoutes: MetadataRoute.Sitemap = ["vi", "en", "ko", "ru", "zh"].flatMap((locale) =>
    staticRoutes.map((route) => ({
      ...route,
      url: `${baseUrl}/${locale}${new URL(route.url).pathname === "/" ? "" : new URL(route.url).pathname}`,
      priority: Math.max(0.4, (route.priority || 0.5) - 0.1),
    }))
  );
  const localizedPostRoutes: MetadataRoute.Sitemap = posts.flatMap((post) =>
    ["vi", "en", "ko", "ru", "zh"].map((locale) => ({
      url: `${baseUrl}/${locale}/bai-viet/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...postRoutes, ...localizedRoutes, ...localizedPostRoutes];
}
