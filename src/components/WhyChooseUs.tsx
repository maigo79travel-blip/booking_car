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
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.whyChooseUs.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.whyChooseUs.title}
          </h2>
          <div className="w-24 h-1 bg-[#174978] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((item: ReasonItem, idx) => {
            const Icon = icons[idx]?.icon || ShieldCheck;
            const colorClass = icons[idx]?.color || "bg-[#EAF2F8] text-[#174978]";

            return (
              <div
                key={idx}
                className="bg-gray-50/70 hover:bg-white p-6 md:p-8 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center mb-5 ${colorClass} group-hover:scale-105 transition-transform`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 group-hover:text-[#003366] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
