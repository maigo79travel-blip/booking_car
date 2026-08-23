"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQSection() {
  const { t, language } = useLanguage();
  const { faq: dynamicFaq } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FAQItem[] =
    dynamicFaq && dynamicFaq.length > 0
      ? dynamicFaq.map((item) => ({
          q: item.q?.[language] || item.q?.vi || "",
          a: item.a?.[language] || item.a?.vi || "",
        }))
      : (t.faq.items as FAQItem[]);

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item: FAQItem) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
              <HelpCircle size={18} />
              <span>{t.faq.tag}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              {t.faq.title}
            </h2>
            <div className="w-24 h-1 bg-[#174978] mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-sm md:text-base">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl overflow-hidden transition-all shadow-none ${
                    isOpen ? "border-[#75A2BF]" : "border-gray-100"
                  }`}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full text-left p-4 md:p-5 bg-gray-50 hover:bg-[#EAF2F8]/60 flex justify-between items-center transition-colors gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-bold text-base md:text-lg transition-colors ${
                      isOpen ? "text-[#003366]" : "text-gray-800"
                    }`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#174978] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#003366]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 md:p-5 bg-white text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
