"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import PostCoverImage from "@/components/PostCoverImage";
import { useLanguage } from "@/context/LanguageContext";
import type { Post } from "@/lib/server/content";
import type { Language } from "@/lib/i18n/types";

const copy: Record<Language, { tag: string; title: string; description: string; readMore: string; empty: string; dateLocale: string }> = {
  vi: {
    tag: "Kinh nghiệm di chuyển",
    title: "Cẩm Nang & Bài Viết Hướng Dẫn Đi Sân Bay Cam Ranh – Nha Trang",
    description: "Cập nhật các thông tin hữu ích về giá vé, lộ trình, kinh nghiệm đón tiễn và các lưu ý quan trọng khi di chuyển tới sân bay Cam Ranh và các tour du lịch Nha Trang.",
    readMore: "Xem chi tiết",
    empty: "Hiện chưa có bài viết nào được đăng tải. Vui lòng quay lại sau!",
    dateLocale: "vi-VN",
  },
  en: {
    tag: "Travel guides",
    title: "Cam Ranh Airport & Nha Trang Travel Guides",
    description: "Useful fare, route and airport-transfer advice for travelling to Cam Ranh Airport and exploring Nha Trang.",
    readMore: "Read more",
    empty: "There are no published articles yet. Please check back soon.",
    dateLocale: "en-US",
  },
  ko: {
    tag: "여행 가이드",
    title: "깜란 공항 · 나트랑 여행 가이드",
    description: "깜란 공항 이동, 요금, 노선 및 나트랑 여행에 도움이 되는 실용적인 정보를 안내합니다.",
    readMore: "자세히 보기",
    empty: "게시된 글이 없습니다. 잠시 후 다시 확인해 주세요.",
    dateLocale: "ko-KR",
  },
  ru: {
    tag: "Путеводители",
    title: "Путеводители по аэропорту Камрань и Нячангу",
    description: "Полезная информация о тарифах, маршрутах и трансферах в аэропорт Камрань и по Нячангу.",
    readMore: "Подробнее",
    empty: "Пока нет опубликованных статей. Пожалуйста, зайдите позже.",
    dateLocale: "ru-RU",
  },
  zh: {
    tag: "出行指南",
    title: "金兰机场与芽庄出行指南",
    description: "提供金兰机场接送、价格、路线及芽庄旅行的实用资讯。",
    readMore: "查看详情",
    empty: "暂时没有已发布的文章，请稍后再来查看。",
    dateLocale: "zh-CN",
  },
};

function localizedText(value: Post["title"] | Post["excerpt"], language: Language) {
  return value?.[language] || value?.vi || "";
}

export default function PostsPageClient({ posts }: { posts: Post[] }) {
  const { language, t } = useLanguage();
  const page = copy[language];

  return (
    <main className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ name: t.nav.articles }]} />
      <section className="container mx-auto px-4 md:px-12 lg:px-24 py-4 md:py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
            <BookOpen size={18} />
            <span>{page.tag}</span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 leading-snug">{page.title}</h1>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mb-3" />
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-3xl">{page.description}</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const title = localizedText(post.title, language);
              const excerpt = localizedText(post.excerpt, language);
              const postHref = `/${language}/bai-viet/${post.slug}`;

              return (
                <article key={post.id} className="bg-white rounded-none overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="relative h-48 bg-gray-100 overflow-hidden rounded-none">
                      <PostCoverImage key={post.cover_image || post.id} src={post.cover_image} alt={title} />
                    </div>
                    <div className="p-5">
                      {post.published_at && (
                        <time className="text-xs text-gray-400 block mb-2" dateTime={post.published_at}>
                          {new Intl.DateTimeFormat(page.dateLocale, { dateStyle: "medium" }).format(new Date(post.published_at))}
                        </time>
                      )}
                      <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-snug group-hover:text-[#003366] transition-colors line-clamp-2">
                        <Link href={postHref}>{title}</Link>
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{excerpt}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link className="inline-flex items-center gap-1 text-sm font-bold text-[#174978] hover:text-[#003366] group-hover:translate-x-1 transition-transform" href={postHref}>
                      {page.readMore} <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-none p-8 text-center text-gray-500 shadow-xs">{page.empty}</div>
        )}
      </section>
      <Footer />
      <FloatingContacts />
    </main>
  );
}
