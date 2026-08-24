"use client";

import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

type LocalizedValue = string | Partial<Record<"vi" | "en" | "ko" | "ru" | "zh", string>>;
type CmsSection = { title?: LocalizedValue; paragraphs?: LocalizedValue[]; bullets?: LocalizedValue[] };
type CmsPage = { title?: LocalizedValue; breadcrumb?: LocalizedValue; intro?: LocalizedValue[]; sections?: CmsSection[]; contact_title?: LocalizedValue; contact_text?: LocalizedValue };

function valueOf(value: LocalizedValue | undefined, language: "vi" | "en" | "ko" | "ru" | "zh") {
  if (typeof value === "string") return value;
  return value?.[language] || value?.vi || "";
}

export default function CmsTextPage({ contentKey, initialPage }: { contentKey: string; initialPage?: unknown }) {
  const { content, contact } = useSiteContent();
  const { language } = useLanguage();
  const page = (content[contentKey] || initialPage || {}) as CmsPage;
  const title = valueOf(page.title, language);
  const breadcrumb = valueOf(page.breadcrumb, language) || title;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs items={[{ name: breadcrumb }]} />
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="w-24 h-1 bg-[#174978] rounded-full" />
      </div>
      <div className="container mx-auto px-4 md:px-12 lg:px-24 py-6 md:py-10">
        {page.intro?.length ? <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100 space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">{page.intro.map((paragraph, index) => <p key={index}>{valueOf(paragraph, language)}</p>)}</div> : null}
        {page.sections?.map((section, index) => <div key={index} className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-gray-100"><>{section.title ? <h2 className="text-xl md:text-2xl font-bold text-[#003366] mb-4">{valueOf(section.title, language)}</h2> : null}</><div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">{section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{valueOf(paragraph, language)}</p>)}{section.bullets?.length ? <ul className="list-disc list-inside space-y-2 ml-4">{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{valueOf(bullet, language)}</li>)}</ul> : null}</div></div>)}
        {page.contact_text ? <div className="bg-linear-to-r from-[#003366] via-[#174978] to-brand-marine rounded-2xl p-6 md:p-8 text-white shadow-md">{page.contact_title ? <h2 className="text-xl md:text-2xl font-bold mb-3">{valueOf(page.contact_title, language)}</h2> : null}<p className="text-sm md:text-base leading-relaxed">{valueOf(page.contact_text, language).replace("{hotline}", contact.hotline_display).replace("{email}", contact.email)}</p></div> : null}
      </div>
      <Footer />
      <FloatingContacts />
    </main>
  );
}
