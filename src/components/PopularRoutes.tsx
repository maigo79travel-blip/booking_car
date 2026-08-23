"use client";

import Link from "next/link";
import { ArrowRight, PlaneTakeoff, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PopularRoutes() {
  const { t } = useLanguage();

  const airportRoutes = [
    { name: "Hà Nội → Sân bay Nội Bài", price: `${t.common.fromPrice} 200.000${t.common.vnd}`, note: "Xe 5-7 chỗ đời mới đón tận nhà" },
    { name: "Sân bay Nội Bài → Hà Nội", price: `${t.common.fromPrice} 250.000${t.common.vnd}`, note: "Đón sảnh A1, A2, T1, T2 đúng giờ" },
    { name: "Hai chiều Hà Nội ↔ Nội Bài", price: `${t.common.fromPrice} 400.000${t.common.vnd}`, note: "Tiết kiệm tới 30% khi đặt khứ hồi" },
    { name: "Cầu Giấy ↔ Sân bay Nội Bài", price: `${t.common.fromPrice} 200.000${t.common.vnd}`, note: "Đón tại nhà 24/7 chỉ sau 15 phút" },
    { name: "Hoàn Kiếm ↔ Sân bay Nội Bài", price: `${t.common.fromPrice} 220.000${t.common.vnd}`, note: "Phố cổ, bờ hồ đón trả thuận tiện" },
    { name: "Hà Đông ↔ Sân bay Nội Bài", price: `${t.common.fromPrice} 260.000${t.common.vnd}`, note: "Tuyến đường vành đai 3 thông thoáng" },
  ];

  const provinceRoutes = [
    { name: "Nội Bài ↔ Bắc Ninh", distance: "~45km", price: `${t.common.fromPrice} 400.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Vĩnh Phúc", distance: "~40km", price: `${t.common.fromPrice} 380.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Thái Nguyên", distance: "~65km", price: `${t.common.fromPrice} 550.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Hải Dương", distance: "~85km", price: `${t.common.fromPrice} 750.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Hải Phòng", distance: "~135km", price: `${t.common.fromPrice} 1.100.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Quảng Ninh", distance: "~165km", price: `${t.common.fromPrice} 1.350.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Ninh Bình", distance: "~120km", price: `${t.common.fromPrice} 1.000.000${t.common.vnd}` },
    { name: "Nội Bài ↔ Phú Thọ", distance: "~75km", price: `${t.common.fromPrice} 650.000${t.common.vnd}` },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-orange-500 font-bold uppercase tracking-wider text-xs md:text-sm">
            {t.popularRoutes.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.popularRoutes.title}
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">
            {t.popularRoutes.subtitle}
          </p>
        </div>

        {/* Airport routes */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <PlaneTakeoff className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              {t.popularRoutes.airportSection}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {airportRoutes.map((route, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-base">
                      {route.name}
                    </h4>
                    <span className="font-bold text-orange-600 whitespace-nowrap text-sm bg-orange-50 px-2.5 py-1 rounded-md">
                      {route.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{route.note}</p>
                </div>
                <Link
                  href="/#formbooking"
                  className="text-xs font-semibold text-blue-900 hover:text-orange-500 inline-flex items-center gap-1 transition-colors pt-2 border-t border-gray-100"
                >
                  {t.popularRoutes.bookRouteNow} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Inter-province routes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="text-blue-900" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              {t.popularRoutes.provinceSection}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {provinceRoutes.map((prov, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-orange-300 transition-all text-center"
              >
                <p className="font-bold text-gray-800 text-sm mb-1">{prov.name}</p>
                <p className="text-xs text-gray-400 mb-2">{prov.distance}</p>
                <p className="font-bold text-orange-600 text-sm">{prov.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
