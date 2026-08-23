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
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-orange-500 font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.bookingSteps.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.bookingSteps.title}
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
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
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all relative flex flex-col items-center text-center"
              >
                <div className="absolute -top-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow uppercase">
                  {t.bookingSteps.stepBadge} {step.number}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 my-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">
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
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-orange-200 transition-all text-sm md:text-base"
          >
            {t.common.bookNow}
          </Link>
        </div>
      </div>
    </section>
  );
}
