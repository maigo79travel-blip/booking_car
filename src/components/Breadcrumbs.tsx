"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t } = useLanguage();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maigo79.com";

  const resolvedItems = items.map((item) => {
    if (item.href === "/bai-viet" || item.name === "Cẩm nang" || item.name === "Bài viết") {
      return { ...item, name: t.nav.articles };
    }
    if (item.href === "/loai-xe" || item.name === "Loại xe") {
      return { ...item, name: t.nav.vehicles };
    }
    if (item.href === "/bang-gia" || item.name === "Bảng giá") {
      return { ...item, name: t.nav.pricing };
    }
    if (item.href === "/ve-chung-toi" || item.name === "Về chúng tôi") {
      return { ...item, name: t.nav.about };
    }
    if (item.href === "/chinh-sach" || item.name === "Chính sách") {
      return { ...item, name: t.nav.policies };
    }
    return item;
  });

  const allItems: BreadcrumbItem[] = [{ name: t.nav.home, href: "/" }, ...resolvedItems];

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.href ? { "item": `${siteUrl}${item.href.startsWith("/") ? item.href : `/${item.href}`}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 pb-2 text-sm text-gray-500"
      >
        <ol className="flex flex-wrap items-center gap-1 md:gap-2">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-1 md:gap-2">
                {index === 0 && <Home size={14} className="text-[#174978]" />}
                {isLast || !item.href ? (
                  <span className="font-semibold text-[#003366]" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#174978] font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight size={14} className="text-gray-400 shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
