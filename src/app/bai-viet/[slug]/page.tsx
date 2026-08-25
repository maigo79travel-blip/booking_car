import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { getPost, getPublishedPosts, text } from "@/lib/server/content";
import { Calendar, PhoneCall } from "lucide-react";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const pageTitle = text(post.seo_title) || text(post.title);
  const pageDesc = text(post.seo_description) || text(post.excerpt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maigo79.com";

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `/bai-viet/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: pageTitle,
      description: pageDesc,
      url: `${siteUrl}/bai-viet/${post.slug}`,
      publishedTime: post.published_at || undefined,
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              alt: text(post.title),
            },
          ]
        : [`${siteUrl}/images/logo-maigo79.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: post.cover_image ? [post.cover_image] : [`${siteUrl}/images/logo-maigo79.png`],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maigo79.com";
  const postTitle = text(post.title);
  const postDesc = text(post.excerpt);
  const postDate = post.published_at || new Date().toISOString();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postTitle,
    "description": postDesc,
    "image": post.cover_image || `${siteUrl}/images/logo-maigo79.png`,
    "datePublished": postDate,
    "dateModified": postDate,
    "author": {
      "@type": "Organization",
      "name": "maigo79.com",
      "url": siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "maigo79.com",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo-maigo79.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/bai-viet/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: "Cẩm nang", href: "/bai-viet" },
          { name: postTitle },
        ]}
      />

      <article className="container mx-auto px-4 md:px-12 lg:px-24 py-4 md:py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {postTitle}
          </h1>

          {post.published_at && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={15} className="text-[#174978]" />
              <time dateTime={post.published_at}>
                {new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "full",
                }).format(new Date(post.published_at))}
              </time>
            </div>
          )}
        </header>

        {post.cover_image && (
          <div className="relative h-64 md:h-105 rounded-none overflow-hidden shadow-xs mb-6 bg-gray-100">
            <Image
              src={post.cover_image}
              alt={`Hình ảnh bài viết: ${postTitle}`}
              fill
              priority
              className="object-cover rounded-none"
            />
          </div>
        )}

        {/* Content Body - No card wrapper */}
        <div className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap py-2">
          {text(post.body)}
        </div>

        {/* CTA Box */}
        <div className="mt-10 bg-linear-to-r from-[#003366] via-[#174978] to-brand-marine rounded-none p-6 md:p-8 text-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Cần Đặt Xe Sân Bay Cam Ranh – Nha Trang Đón Trả Tận Nơi?
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Xe 5 - 7 - 16 chỗ đón đúng giờ, giá trọn gói chỉ từ 250k. Phục vụ 24/7.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:0928015280"
              className="bg-white text-[#003366] font-extrabold px-5 py-3 rounded-none shadow-xs hover:bg-brand-light transition-colors inline-flex items-center gap-2 text-sm"
            >
              <PhoneCall size={18} className="text-[#174978]" />
              0928.015.280
            </a>
            <Link
              href="/#formbooking"
              className="bg-[#002244] hover:bg-[#00172e] text-white font-extrabold px-6 py-3 rounded-none transition-all text-sm shadow-xs"
            >
              Đặt xe ngay
            </Link>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingContacts />
    </main>
  );
}
