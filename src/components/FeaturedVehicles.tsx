"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Users, Check, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
  vi: { tag: "ĐỘI XE PHỤC VỤ CAO CẤP", title: "Các Dòng Xe Đưa Đón Nổi Bật", description: "100% xe đời mới 2022 - 2026, nội thất sạch sẽ, êm ái, đầy đủ nước suối khăn lạnh và tài xế lịch sự, tận tâm.", fare: "Giá trọn gói", book: "Đặt xe" },
  en: { tag: "PREMIUM FLEET", title: "Featured Transfer Vehicles", description: "Modern 2022 - 2026 vehicles with clean, comfortable interiors and courteous, professional drivers.", fare: "All-inclusive fare", book: "Book now" },
  ko: { tag: "프리미엄 차량", title: "추천 공항 픽업 차량", description: "깨끗하고 편안한 최신 차량과 친절한 전문 기사로 안전한 이동을 제공합니다.", fare: "정액 요금", book: "예약하기" },
  ru: { tag: "ПРЕМИАЛЬНЫЙ АВТОПАРК", title: "Популярные автомобили для трансфера", description: "Современные автомобили 2022–2026 годов с чистым салоном и профессиональными водителями.", fare: "Фиксированная цена", book: "Забронировать" },
  zh: { tag: "高端车队", title: "热门接送车型", description: "提供2022–2026年现代车型、整洁舒适的内饰及专业贴心的司机服务。", fare: "全包价格", book: "立即预订" },
};

export default function FeaturedVehicles() {
  const { featuredVehicles } = useSiteContent();
  const { language, t } = useLanguage();
  const text = copy[language];

  const localizedVehicle = (id: string) => {
    const translations = {
      vi: {
        "v-5": ["Phổ biến nhất", "Sedan 5 chỗ đời mới", "5 chỗ (Tối đa 4 khách)"],
        "v-7": ["Gia đình yêu thích", "SUV / MPV 7 chỗ gia đình", "7 chỗ (Tối đa 6 khách)"],
        "v-16": ["Đoàn đông người", "Xe 16 chỗ du lịch cao cấp", "16 chỗ (Tối đa 15 khách)"],
        "v-vip": ["VIP Đẳng cấp", "Xe VIP sang trọng 2024 - 2026", "7 chỗ VIP Thương gia"],
      },
      en: {
        "v-5": ["Most popular", "Modern 5-seater sedan", "5 seats (up to 4 passengers)"],
        "v-7": ["Family favourite", "Family 7-seater SUV / MPV", "7 seats (up to 6 passengers)"],
        "v-16": ["For groups", "Premium 16-seater tourist van", "16 seats (up to 15 passengers)"],
        "v-vip": ["VIP class", "Luxury VIP vehicle 2024 - 2026", "Business-class VIP 7-seater"],
      },
      ko: {
        "v-5": ["가장 인기", "최신형 5인승 세단", "5인승 (최대 4명)"],
        "v-7": ["가족 추천", "가족용 7인승 SUV / MPV", "7인승 (최대 6명)"],
        "v-16": ["단체 추천", "프리미엄 16인승 관광 밴", "16인승 (최대 15명)"],
        "v-vip": ["VIP 클래스", "럭셔리 VIP 차량 2024 - 2026", "비즈니스 VIP 7인승"],
      },
      ru: {
        "v-5": ["Самый популярный", "Современный седан на 5 мест", "5 мест (до 4 пассажиров)"],
        "v-7": ["Для семьи", "Семейный SUV / MPV на 7 мест", "7 мест (до 6 пассажиров)"],
        "v-16": ["Для группы", "Премиум-микроавтобус на 16 мест", "16 мест (до 15 пассажиров)"],
        "v-vip": ["VIP-класс", "Роскошный VIP-автомобиль 2024 - 2026", "VIP на 7 мест бизнес-класса"],
      },
      zh: {
        "v-5": ["最受欢迎", "现代5座轿车", "5座（最多4位乘客）"],
        "v-7": ["家庭首选", "家庭7座SUV / MPV", "7座（最多6位乘客）"],
        "v-16": ["团队出行", "高端16座旅游车", "16座（最多15位乘客）"],
        "v-vip": ["尊享VIP", "豪华VIP车型 2024 - 2026", "商务VIP 7座"],
      },
    };
    return translations[language][id as keyof typeof translations[typeof language]];
  };

  if (!featuredVehicles || featuredVehicles.length === 0) return null;

  return (
    <section className="py-6 md:py-8 bg-linear-to-b from-white to-gray-50/70">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 md:mb-6">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center">
            {text.tag}
          </span>
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 leading-snug">
            {text.title}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mx-auto mb-2.5"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {text.description}
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredVehicles.map((vehicle) => {
            const localized = localizedVehicle(vehicle.id);
            const [tag, type, seats] = localized || [vehicle.tag || "", vehicle.type, vehicle.seats];
            const price = language === "vi" ? vehicle.price : vehicle.price.replace(/^Từ\s*/i, `${t.common.fromPrice} `);
            return (
            <div
              key={vehicle.id}
              className="bg-white rounded-none border border-gray-200/90 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Vehicle Image with Tag */}
                <div className="relative w-full h-40 sm:h-44 bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-gray-100 rounded-none">
                  {vehicle.tag && (
                    <span className="absolute top-2.5 left-2.5 z-10 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-xs">
                      {tag}
                    </span>
                  )}
                  <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain rounded-none"
                      unoptimized={vehicle.image.startsWith("http") || vehicle.image.startsWith("data:")}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                      <Car size={13} />
                      {type}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1.5 rounded-none">
                    <Users size={14} className="text-slate-600 shrink-0" />
                    <span>{seats}</span>
                  </div>

                  {/* Features List */}
                  {vehicle.features && vehicle.features.length > 0 && (
                    <ul className="space-y-1.5 pt-0.5">
                      {vehicle.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 sm:p-5 pt-0 mt-1">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block">{text.fare}</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-700">
                      {price}
                    </span>
                  </div>

                  <Link
                    href="/#formbooking"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all touch-manipulation"
                  >
                    <span>{text.book}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          );})}
        </div>
      </div>
    </section>
  );
}
