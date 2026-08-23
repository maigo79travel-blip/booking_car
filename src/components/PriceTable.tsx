"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const PriceTable = () => {
  const { t } = useLanguage();
  const { hero } = useSiteContent();
  const hasCustomBg = !!hero?.pricing_bg_image;

  const priceData = [
    {
      title: t.priceTable.car5,
      routes: [
        { from: t.priceTable.hanoiToAirportCol, price: `${t.common.fromPrice} 250.000${t.common.vnd}` },
        { from: t.priceTable.airportToHanoiCol, price: `${t.common.fromPrice} 250.000${t.common.vnd}` },
        { from: t.priceTable.roundTripCol, price: `${t.common.fromPrice} 480.000${t.common.vnd}` },
      ],
    },
    {
      title: t.priceTable.car7,
      routes: [
        { from: t.priceTable.hanoiToAirportCol, price: `${t.common.fromPrice} 300.000${t.common.vnd}` },
        { from: t.priceTable.airportToHanoiCol, price: `${t.common.fromPrice} 300.000${t.common.vnd}` },
        { from: t.priceTable.roundTripCol, price: `${t.common.fromPrice} 580.000${t.common.vnd}` },
      ],
    },
    {
      title: t.priceTable.car16,
      routes: [
        { from: t.priceTable.hanoiToAirportCol, price: `${t.common.fromPrice} 550.000${t.common.vnd}` },
        { from: t.priceTable.airportToHanoiCol, price: `${t.common.fromPrice} 550.000${t.common.vnd}` },
        { from: t.priceTable.roundTripCol, price: `${t.common.fromPrice} 1.050.000${t.common.vnd}` },
      ],
    },
  ];

  return (
    <section
      className={`py-12 md:py-16 relative border-y border-gray-100 ${
        hasCustomBg ? "" : "bg-linear-to-b from-slate-50 via-blue-50/20 to-white"
      }`}
      style={
        hasCustomBg
          ? {
              backgroundImage: `url(${hero.pricing_bg_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {hasCustomBg && <div className="absolute inset-0 bg-white/90"></div>}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="bg-[#174978] p-2.5 text-white shadow-xs">
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            {t.priceTable.heading}
          </h2>
          <div className="w-24 h-1 bg-[#174978] mx-auto"></div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block md:hidden space-y-4">
          {priceData.map((vehicle, index) => (
            <div
              key={index}
              className="bg-white shadow-xs overflow-hidden border border-gray-100"
            >
              {/* Card Header */}
              <div className="bg-linear-to-r from-[#003366] to-[#174978] text-white text-center py-2.5 font-bold text-base">
                {vehicle.title}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                {vehicle.routes.map((route, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700 text-sm font-medium">{route.from}</span>
                    <span className="text-[#003366] font-black text-sm">
                      {route.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block bg-white shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-[#003366] via-[#174978] to-brand-marine">
                  <th className="px-6 py-4 text-left text-white font-bold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.carTypeCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.hanoiToAirportCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.airportToHanoiCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-bold text-base lg:text-lg">
                    {t.priceTable.roundTripCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Xe 5 chỗ */}
                <tr className="border-b border-gray-100 hover:bg-brand-light/60 transition-colors">
                  <td className="px-6 py-4.5 font-bold text-gray-800 text-base lg:text-lg border-r border-gray-100">
                    {t.priceTable.car5}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 250.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 250.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg">
                    {t.common.fromPrice} 480.000{t.common.vnd}
                  </td>
                </tr>

                {/* Xe 7 chỗ */}
                <tr className="border-b border-gray-100 hover:bg-brand-light/60 transition-colors">
                  <td className="px-6 py-4.5 font-bold text-gray-800 text-base lg:text-lg border-r border-gray-100">
                    {t.priceTable.car7}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 300.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 300.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg">
                    {t.common.fromPrice} 580.000{t.common.vnd}
                  </td>
                </tr>

                {/* Xe 16 chỗ */}
                <tr className="hover:bg-brand-light/60 transition-colors bg-gray-50/50">
                  <td className="px-6 py-4.5 font-bold text-gray-800 text-base lg:text-lg border-r border-gray-100">
                    {t.priceTable.car16}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 550.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg border-r border-gray-100">
                    {t.common.fromPrice} 550.000{t.common.vnd}
                  </td>
                  <td className="px-6 py-4.5 text-center font-black text-[#003366] text-base lg:text-lg">
                    {t.common.fromPrice} 1.050.000{t.common.vnd}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Message */}
        <div className="mt-6 bg-white/90 backdrop-blur-xs p-5 md:p-6 shadow-xs border border-gray-100 space-y-2">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed font-medium">
            ✓ {t.priceTable.note1}
          </p>
          <p className="text-gray-800 text-sm md:text-base leading-relaxed font-medium">
            ✓ {t.priceTable.note2}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceTable;
