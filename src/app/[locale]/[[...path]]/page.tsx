import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { getPost, text } from "@/lib/server/content";
import { Language } from "@/lib/i18n/types";
import Home from "@/app/page";
import PricingPage from "@/app/bang-gia/page";
import VehiclesPage from "@/app/loai-xe/page";
import PostsPage from "@/app/bai-viet/page";
import PostPage from "@/app/bai-viet/[slug]/page";
import AboutPage from "@/app/ve-chung-toi/page";
import PolicyPage from "@/app/chinh-sach/page";
import PrivacyPolicyPage from "@/app/chinh-sach/bao-ve-quyen-rieng-tu/page";
import TransportPolicyPage from "@/app/chinh-sach/van-chuyen-hanh-khach/page";

const locales: Language[] = ["vi", "en", "ko", "ru", "zh"];
function titleFor(path: string[], locale: Language) {
  const names: Record<string, Record<Language, string>> = {
    "": { vi: "Đặt xe sân bay Cam Ranh", en: "Cam Ranh Airport Transfers", ko: "깜란 공항 픽업", ru: "Трансфер из аэропорта Камрань", zh: "金兰机场接送" },
    "bang-gia": { vi: "Bảng giá xe sân bay Cam Ranh", en: "Cam Ranh Airport Prices", ko: "깜란 공항 요금", ru: "Цены на трансфер", zh: "机场接送价格" },
    "loai-xe": { vi: "Các loại xe", en: "Vehicles", ko: "차량 안내", ru: "Автопарк", zh: "车型介绍" },
    "bai-viet": { vi: "Bài viết", en: "Articles", ko: "게시물", ru: "Статьи", zh: "文章" },
  };
  return names[path[0] || ""]?.[locale] || names[""][locale];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; path?: string[] }> }): Promise<Metadata> {
  const { locale: rawLocale, path = [] } = await params;
  const locale = locales.includes(rawLocale as Language) ? rawLocale as Language : "vi";
  const slug = path[0] === "bai-viet" && path[1];
  const post = slug ? await getPost(slug) : null;
  const title = post ? text(post.seo_title, locale) || text(post.title, locale) : titleFor(path, locale);
  const description = post ? text(post.seo_description, locale) || text(post.excerpt, locale) : `maigo79.com - ${title}`;
  const canonical = `/${locale}/${path.join("/")}`.replace(/\/$/, "") || `/${locale}`;
  return { title, description, alternates: { canonical, languages: Object.fromEntries(locales.map((item) => [item, canonical.replace(`/${locale}`, `/${item}`)]).concat([["x-default", canonical.replace(`/${locale}`, "")]])) } };
}

export default async function LocalizedPage({ params }: { params: Promise<{ locale: string; path?: string[] }> }) {
  const { locale: rawLocale, path = [] } = await params;
  if (!locales.includes(rawLocale as Language)) notFound();
  const locale = rawLocale as Language;
  let page: React.ReactNode;
  if (path.length === 0) page = <Home />;
  else if (path[0] === "bang-gia" && path.length === 1) page = <PricingPage />;
  else if (path[0] === "loai-xe" && path.length === 1) page = <VehiclesPage />;
  else if (path[0] === "bai-viet" && path.length === 1) page = <PostsPage />;
  else if (path[0] === "bai-viet" && path[1]) page = <PostPage params={Promise.resolve({ slug: path[1] })} />;
  else if (path[0] === "ve-chung-toi" && path.length === 1) page = <AboutPage />;
  else if (path[0] === "chinh-sach" && path.length === 1) page = <PolicyPage />;
  else if (path.join("/") === "chinh-sach/bao-ve-quyen-rieng-tu") page = <PrivacyPolicyPage />;
  else if (path.join("/") === "chinh-sach/van-chuyen-hanh-khach") page = <TransportPolicyPage />;
  else notFound();
  return <LanguageProvider initialLanguage={locale}>{page}</LanguageProvider>;
}
