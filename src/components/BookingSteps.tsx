"use client";

import { MapPinCheck, PhoneCall, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function BookingSteps() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: MapPinCheck,
      title: t.bookingSteps.step1Title,
      description: t.bookingSteps.step1Desc,
    },
    {
      number: "02",
      icon: PhoneCall,
      title: t.bookingSteps.step2Title,
      description: t.bookingSteps.step2Desc,
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: t.bookingSteps.step3Title,
      description: t.bookingSteps.step3Desc,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.bookingSteps.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.bookingSteps.title}
          </h2>
          <div className="w-24 h-1 bg-[#174978] mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 text-sm md:text-base">
            {t.bookingSteps.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-xs hover:shadow-md transition-all relative flex flex-col items-center text-center group"
              >
                <div className="absolute -top-3.5 bg-linear-to-r from-[#003366] to-[#174978] text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {t.bookingSteps.stepBadge} {step.number}
                </div>
                <div className="w-12 h-12 rounded-lg bg-brand-light flex items-center justify-center text-[#174978] my-4 group-hover:scale-105 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 group-hover:text-[#003366] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/#formbooking"
            className="inline-block bg-linear-to-r from-[#003366] via-[#174978] to-brand-marine hover:from-[#002244] hover:to-[#174978] text-white font-extrabold px-8 py-3.5 rounded-lg shadow-xs hover:shadow-sm transition-all text-sm md:text-base"
          >
            {t.common.bookNow}
          </Link>
        </div>
      </div>
    </section>
  );
}
