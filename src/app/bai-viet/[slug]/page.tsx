import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { getPost, getPublishedPosts, text } from "@/lib/server/content";
import PostCoverImage from "@/components/PostCoverImage";
import ArticleContent from "@/components/ArticleContent";
import { Language } from "@/lib/i18n/types";
import { translations } from "@/lib/i18n/translations";

export const revalidate = 60;
import { Calendar, PhoneCall } from "lucide-react";

const articleCta = {
  vi: {
    title: "Cần Đặt Xe Sân Bay Cam Ranh – Nha Trang Đón Trả Tận Nơi?",
    description: "Xe 5 - 7 - 16 chỗ đón đúng giờ, giá trọn gói chỉ từ 250k. Phục vụ 24/7.",
    booking: "Đặt xe ngay",
  },
  en: {
    title: "Need a Private Transfer from Cam Ranh Airport to Nha Trang?",
    description: "5, 7 and 16-seat cars with punctual pickup and fixed fares from 250,000 VND. Available 24/7.",
    booking: "Book now",
  },
  ko: {
    title: "깜란 공항에서 나트랑까지 차량이 필요하신가요?",
    description: "5·7·16인승 차량, 정시 픽업 및 250,000VND부터의 정액 요금. 24시간 운행합니다.",
    booking: "지금 예약하기",
  },
  ru: {
    title: "Нужен трансфер из аэропорта Камрань в Нячанг?",
    description: "Автомобили на 5, 7 и 16 мест, подача вовремя и фиксированная цена от 250 000 VND. Работаем 24/7.",
    booking: "Забронировать",
  },
  zh: {
    title: "需要从金兰机场前往芽庄的专车接送吗？",
    description: "提供5座、7座和16座车辆，准时接送，套餐价格250,000越南盾起，全天24小时服务。",
    booking: "立即预订",
  },
} satisfies Record<Language, { title: string; description: string; booking: string }>;

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
  locale = "vi",
}: {
  params: Promise<{ slug: string }>;
  locale?: Language;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maigo79.com";
  const postTitle = text(post.title, locale);
  const postDesc = text(post.excerpt, locale);
  const postDate = post.published_at || new Date().toISOString();
  const cta = articleCta[locale];

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
          { name: translations[locale]?.nav?.articles || "Bài viết", href: "/bai-viet" },
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
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "full",
                }).format(new Date(post.published_at))}
              </time>
            </div>
          )}
        </header>

        {post.cover_image && (
          <div className="relative h-64 md:h-105 rounded-none overflow-hidden shadow-xs mb-6 bg-gray-100">
            <PostCoverImage
              key={post.cover_image}
              src={post.cover_image}
              alt={`Hình ảnh bài viết: ${postTitle}`}
              priority
            />
          </div>
        )}

        {/* Content Body - No card wrapper */}
        <ArticleContent content={text(post.body, locale)} />

        {/* CTA Box */}
        <div className="mt-10 bg-linear-to-r from-[#003366] via-[#174978] to-brand-marine rounded-none p-6 md:p-8 text-white shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {cta.title}
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              {cta.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:0878458885"
              className="bg-white text-[#003366] font-extrabold px-5 py-3 rounded-none shadow-xs hover:bg-brand-light transition-colors inline-flex items-center gap-2 text-sm"
            >
              <PhoneCall size={18} className="text-[#174978]" />
              0878.458.885
            </a>
            <Link
              href={`/${locale}#formbooking`}
              className="bg-[#002244] hover:bg-[#00172e] text-white font-extrabold px-6 py-3 rounded-none transition-all text-sm shadow-xs"
            >
              {cta.booking}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
      <FloatingContacts />
    </main>
  );
}
