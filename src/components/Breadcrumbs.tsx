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

  const allItems: BreadcrumbItem[] = [{ name: t.nav.home, href: "/" }, ...items];

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
