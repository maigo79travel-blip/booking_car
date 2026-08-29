"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const PriceTable = () => {
  const { t, language } = useLanguage();
  const { hero, priceTable } = useSiteContent();
  const hasCustomBg = !!hero?.pricing_bg_image;

  const rows = priceTable?.rows || [];
  const carTypeLabels = [t.priceTable.car5, t.priceTable.car7, t.priceTable.car16];

  // The CMS values predate the localized interface and are currently authored
  // in Vietnamese. Do not let those values override the selected locale.
  const localizedPrice = (value: string) =>
    language === "vi" ? value : value.replace(/^Từ\s*/i, `${t.common.fromPrice} `);

  return (
    <section
      className={`py-6 md:py-8 relative border-y border-gray-100 ${
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
        <div className="text-center mb-5 md:mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="bg-[#174978] p-2 text-white shadow-xs">
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
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-snug">
            {language === "vi" ? priceTable?.title || t.priceTable.heading : t.priceTable.heading}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mx-auto"></div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block md:hidden space-y-4">
          {rows.map((row, index) => (
            <div
              key={row.id || index}
              className="bg-white shadow-xs overflow-hidden border border-gray-100"
            >
              {/* Card Header */}
              <div className="bg-linear-to-r from-[#003366] to-[#174978] text-white text-center py-2.5 font-semibold text-base">
                {language === "vi" ? row.carType : carTypeLabels[index] || row.carType}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-gray-700 text-sm font-medium">
                    {t.priceTable.hanoiToAirportCol}
                  </span>
                  <span className="text-[#003366] font-semibold text-sm">
                    {localizedPrice(row.oneWayAirportToCity)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                  <span className="text-gray-700 text-sm font-medium">
                    {t.priceTable.airportToHanoiCol}
                  </span>
                  <span className="text-[#003366] font-semibold text-sm">
                    {localizedPrice(row.oneWayCityToAirport)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-gray-700 text-sm font-medium">
                    {t.priceTable.roundTripCol}
                  </span>
                  <span className="text-[#003366] font-semibold text-sm">
                    {localizedPrice(row.roundTrip)}
                  </span>
                </div>
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
                  <th className="px-6 py-4 text-left text-white font-semibold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.carTypeCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.hanoiToAirportCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-base lg:text-lg border-r border-white/10">
                    {t.priceTable.airportToHanoiCol}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-base lg:text-lg">
                    {t.priceTable.roundTripCol}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={`border-b border-gray-100 hover:bg-brand-light/60 transition-colors ${
                      idx % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <td className="px-6 py-4.5 font-semibold text-gray-800 text-base lg:text-lg border-r border-gray-100">
                      {language === "vi" ? row.carType : carTypeLabels[idx] || row.carType}
                    </td>
                    <td className="px-6 py-4.5 text-center font-bold text-[#003366] text-base lg:text-lg border-r border-gray-100">
                      {localizedPrice(row.oneWayAirportToCity)}
                    </td>
                    <td className="px-6 py-4.5 text-center font-bold text-[#003366] text-base lg:text-lg border-r border-gray-100">
                      {localizedPrice(row.oneWayCityToAirport)}
                    </td>
                    <td className="px-6 py-4.5 text-center font-bold text-[#003366] text-base lg:text-lg">
                      {localizedPrice(row.roundTrip)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Message */}
        <div className="mt-4 bg-white/90 backdrop-blur-xs p-3.5 md:p-4 shadow-xs border border-gray-100 space-y-1.5">
          <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
            ✓ {language === "vi" ? priceTable?.note1 || t.priceTable.note1 : t.priceTable.note1}
          </p>
          <p className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
            ✓ {language === "vi" ? priceTable?.note2 || t.priceTable.note2 : t.priceTable.note2}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PriceTable;
