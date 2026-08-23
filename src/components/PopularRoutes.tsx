"use client";

import Link from "next/link";
import { ArrowRight, PlaneTakeoff, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PopularRoutes() {
  const { t } = useLanguage();

  const airportRoutes = [
    { name: "Sân bay Cam Ranh → TP. Nha Trang", price: `${t.common.fromPrice} 250.000${t.common.vnd}`, note: "Xe 5-7 chỗ đời mới đón tận nơi đường Trần Phú, Hòn Chồng..." },
    { name: "TP. Nha Trang → Sân bay Cam Ranh", price: `${t.common.fromPrice} 250.000${t.common.vnd}`, note: "Đón tận khách sạn, đúng giờ, không lo trễ chuyến bay" },
    { name: "Hai chiều Cam Ranh ↔ Nha Trang", price: `${t.common.fromPrice} 480.000${t.common.vnd}`, note: "Tiết kiệm tối đa khi đặt xe khứ hồi trọn gói" },
    { name: "Sân bay Cam Ranh ↔ Resort Bãi Dài", price: `${t.common.fromPrice} 180.000${t.common.vnd}`, note: "Alma, Duyên Hà, Vinpearl, Radisson, Movenpick..." },
    { name: "Sân bay Cam Ranh ↔ Vinpearl Cảng Cầu Đá", price: `${t.common.fromPrice} 280.000${t.common.vnd}`, note: "Đón trả tận ga cáp treo / bến tàu Vinpearl Harbour" },
    { name: "Sân bay Cam Ranh ↔ Biển Dốc Lết / Ninh Hòa", price: `${t.common.fromPrice} 550.000${t.common.vnd}`, note: "Tuyến đường cao tốc ven biển thông thoáng, êm ái" },
  ];

  const provinceRoutes = [
    { name: "Nha Trang ↔ Đà Lạt", distance: "~135km", price: `${t.common.fromPrice} 1.200.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Mũi Né (Phan Thiết)", distance: "~220km", price: `${t.common.fromPrice} 1.500.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Tuy Hòa (Phú Yên)", distance: "~120km", price: `${t.common.fromPrice} 1.100.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Quy Nhơn (Bình Định)", distance: "~215km", price: `${t.common.fromPrice} 1.800.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Phan Rang (Ninh Thuận)", distance: "~100km", price: `${t.common.fromPrice} 950.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Vịnh Vĩnh Hy / Hang Rái", distance: "~90km", price: `${t.common.fromPrice} 900.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Đảo Điệp Sơn / Dốc Lết", distance: "~50km", price: `${t.common.fromPrice} 500.000${t.common.vnd}` },
    { name: "Nha Trang ↔ Buôn Ma Thuột (Đắk Lắk)", distance: "~185km", price: `${t.common.fromPrice} 1.600.000${t.common.vnd}` },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.popularRoutes.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.popularRoutes.title}
          </h2>
          <div className="w-24 h-1 bg-[#174978] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">
            {t.popularRoutes.subtitle}
          </p>
        </div>

        {/* Airport routes */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <PlaneTakeoff className="text-[#174978]" size={24} />
            <h3 className="text-xl font-bold text-gray-900">
              {t.popularRoutes.airportSection}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {airportRoutes.map((route, idx) => (
              <div
                key={idx}
                className="bg-white p-5 border border-gray-100 shadow-xs hover:shadow-sm hover:border-gray-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#003366] transition-colors">
                      {route.name}
                    </h4>
                    <span className="font-black text-[#003366] whitespace-nowrap text-sm bg-brand-light px-2.5 py-1">
                      {route.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">{route.note}</p>
                </div>
                <Link
                  href="/#formbooking"
                  className="text-xs font-bold text-[#174978] hover:text-[#003366] inline-flex items-center gap-1 transition-colors pt-2.5 border-t border-gray-100"
                >
                  {t.popularRoutes.bookRouteNow} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Inter-province routes */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Navigation className="text-[#174978]" size={24} />
            <h3 className="text-xl font-bold text-gray-900">
              {t.popularRoutes.provinceSection}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {provinceRoutes.map((prov, idx) => (
              <div
                key={idx}
                className="bg-white p-4 border border-gray-100 shadow-xs hover:border-gray-200 hover:shadow-sm transition-all text-center group"
              >
                <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#003366] transition-colors">{prov.name}</p>
                <p className="text-xs text-gray-400 font-medium mb-2">{prov.distance}</p>
                <p className="font-black text-[#003366] text-sm">{prov.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
