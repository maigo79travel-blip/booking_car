"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import { useLanguage } from "@/context/LanguageContext";

const descriptions = {
  vi: "Cam kết giá cước niêm yết công khai, đã bao gồm phí cầu đường và vé vào sân bay Cam Ranh. Không tăng giá vào giờ cao điểm, đêm muộn hay dịp lễ tết.",
  en: "Transparent published fares include tolls and Cam Ranh Airport fees. No surge pricing at peak times, late at night, or on public holidays.",
  ko: "공개된 정액 요금에는 통행료와 깜란 공항 이용료가 포함됩니다. 성수기, 심야 및 공휴일에도 추가 요금이 없습니다.",
  ru: "Прозрачные опубликованные тарифы включают дорожные и аэропортовые сборы. Без повышения цен в часы пик, ночью и в праздники.",
  zh: "公开透明的价格已包含过路费和金兰机场费用。高峰时段、深夜及节假日均不加价。",
};

export default function PricingPageIntro() {
  const { language, t } = useLanguage();

  return (
    <>
      <Breadcrumbs items={[{ name: t.nav.pricing }]} />
      <div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.priceTable.heading}</h1>
        <div className="w-24 h-1 bg-[#174978] mb-3" />
        <p className="text-gray-600 text-sm md:text-base max-w-3xl">{descriptions[language]}</p>
      </div>
    </>
  );
}
