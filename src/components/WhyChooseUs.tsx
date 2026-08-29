"use client";

import {
  ShieldCheck,
  Clock,
  Car,
  Award,
  Headphones,
  Receipt,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ReasonItem {
  title: string;
  desc: string;
}

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const icons = [
    { icon: ShieldCheck, color: "bg-[#EAF2F8] text-[#003366]" },
    { icon: Clock, color: "bg-[#EAF2F8] text-[#174978]" },
    { icon: Car, color: "bg-[#EAF2F8] text-[#2F5F8A]" },
    { icon: Award, color: "bg-[#EAF2F8] text-[#46769B]" },
    { icon: Headphones, color: "bg-[#EAF2F8] text-[#5E8CAD]" },
    { icon: Receipt, color: "bg-[#EAF2F8] text-[#174978]" },
  ];

  const reasons = (t.whyChooseUs.reasons || []) as ReasonItem[];

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-5 md:mb-6">
          <span className="text-[#174978] font-semibold uppercase tracking-wider text-xs md:text-sm">
            {t.whyChooseUs.tag}
          </span>
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 leading-snug">
            {t.whyChooseUs.title}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mx-auto mb-2.5"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {reasons.map((item: ReasonItem, idx) => {
            const Icon = icons[idx]?.icon || ShieldCheck;
            const colorClass = icons[idx]?.color || "bg-[#EAF2F8] text-[#174978]";

            return (
              <div
                key={idx}
                className="bg-gray-50/70 hover:bg-white p-5 md:p-8 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                {/* Header: Icon + Title on 1 row on mobile, stacked on desktop */}
                <div className="flex items-center gap-3.5 md:block mb-3 md:mb-0">
                  <div
                    className={`w-11 h-11 md:w-12 md:h-12 shrink-0 flex items-center justify-center md:mb-5 ${colorClass} group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base md:text-xl font-bold text-[#174978] md:mb-3 group-hover:text-[#003366] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
