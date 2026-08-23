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

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const icons = [
    { icon: ShieldCheck, color: "bg-orange-100 text-orange-600" },
    { icon: Clock, color: "bg-blue-100 text-blue-900" },
    { icon: Car, color: "bg-green-100 text-green-700" },
    { icon: Award, color: "bg-purple-100 text-purple-700" },
    { icon: Headphones, color: "bg-amber-100 text-amber-700" },
    { icon: Receipt, color: "bg-teal-100 text-teal-700" },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-orange-500 font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.whyChooseUs.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.whyChooseUs.title}
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {t.whyChooseUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t.whyChooseUs.reasons.map((item, idx) => {
            const Icon = icons[idx]?.icon || ShieldCheck;
            const colorClass = icons[idx]?.color || "bg-orange-100 text-orange-600";

            return (
              <div
                key={idx}
                className="bg-gray-50 hover:bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${colorClass} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={28} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
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
