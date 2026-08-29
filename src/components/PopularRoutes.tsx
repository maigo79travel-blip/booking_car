"use client";

import Link from "next/link";
import { ArrowRight, PlaneTakeoff, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Language = "vi" | "en" | "ko" | "ru" | "zh";

const routeCopy: Record<Language, { airport: [string, string][]; provinces: string[] }> = {
  vi: {
    airport: [
      ["Sân bay Cam Ranh → TP. Nha Trang", "Xe 5-7 chỗ đời mới đón tận nơi đường Trần Phú, Hòn Chồng..."],
      ["TP. Nha Trang → Sân bay Cam Ranh", "Đón tận khách sạn, đúng giờ, không lo trễ chuyến bay"],
      ["Hai chiều Cam Ranh ↔ Nha Trang", "Tiết kiệm tối đa khi đặt xe khứ hồi trọn gói"],
      ["Sân bay Cam Ranh ↔ Resort Bãi Dài", "Alma, Duyên Hà, Vinpearl, Radisson, Movenpick..."],
      ["Sân bay Cam Ranh ↔ Vinpearl Cảng Cầu Đá", "Đón trả tận ga cáp treo / bến tàu Vinpearl Harbour"],
      ["Sân bay Cam Ranh ↔ Biển Dốc Lết / Ninh Hòa", "Tuyến đường cao tốc ven biển thông thoáng, êm ái"],
    ],
    provinces: ["Nha Trang ↔ Đà Lạt", "Nha Trang ↔ Mũi Né (Phan Thiết)", "Nha Trang ↔ Tuy Hòa (Phú Yên)", "Nha Trang ↔ Quy Nhơn (Bình Định)", "Nha Trang ↔ Phan Rang (Ninh Thuận)", "Nha Trang ↔ Vịnh Vĩnh Hy / Hang Rái", "Nha Trang ↔ Đảo Điệp Sơn / Dốc Lết", "Nha Trang ↔ Buôn Ma Thuột (Đắk Lắk)"],
  },
  en: {
    airport: [["Cam Ranh Airport → Nha Trang City", "New 5–7 seat cars with door-to-door pickup in Tran Phu and Hon Chong."], ["Nha Trang City → Cam Ranh Airport", "Hotel pickup on time, so you never miss your flight."], ["Cam Ranh ↔ Nha Trang round trip", "Save more with an all-inclusive return transfer."], ["Cam Ranh Airport ↔ Bai Dai resorts", "Alma, Duyen Ha, Vinpearl, Radisson, Movenpick and more."], ["Cam Ranh Airport ↔ Vinpearl Cau Da Port", "Pickup and drop-off at the cable-car station or Vinpearl Harbour pier."], ["Cam Ranh Airport ↔ Doc Let Beach / Ninh Hoa", "A smooth, comfortable coastal expressway journey."]],
    provinces: ["Nha Trang ↔ Da Lat", "Nha Trang ↔ Mui Ne (Phan Thiet)", "Nha Trang ↔ Tuy Hoa (Phu Yen)", "Nha Trang ↔ Quy Nhon (Binh Dinh)", "Nha Trang ↔ Phan Rang (Ninh Thuan)", "Nha Trang ↔ Vinh Hy Bay / Hang Rai", "Nha Trang ↔ Diep Son Island / Doc Let", "Nha Trang ↔ Buon Ma Thuot (Dak Lak)"],
  },
  ko: {
    airport: [["깜라인 공항 → 나트랑 시내", "쩐푸·혼쫑 지역까지 신형 5~7인승 차량으로 편안하게 모십니다."], ["나트랑 시내 → 깜라인 공항", "호텔에서 정시에 픽업하여 비행기를 놓칠 걱정이 없습니다."], ["깜라인 ↔ 나트랑 왕복", "왕복 차량을 예약하면 더욱 알뜰한 고정 요금입니다."], ["깜라인 공항 ↔ 바이자이 리조트", "알마, 두옌하, 빈펄, 래디슨, 모벤픽 등."], ["깜라인 공항 ↔ 빈펄 꺼우다 항구", "케이블카역 또는 빈펄 하버 선착장에서 픽업·하차합니다."], ["깜라인 공항 ↔ 독렛 비치 / 닌호아", "편안하고 쾌적한 해안 고속도로 노선입니다."]],
    provinces: ["나트랑 ↔ 달랏", "나트랑 ↔ 무이네(판티엣)", "나트랑 ↔ 뚜이호아(푸옌)", "나트랑 ↔ 꾸이년(빈딘)", "나트랑 ↔ 판랑(닌투언)", "나트랑 ↔ 빈히 만 / 항라이", "나트랑 ↔ 디엡선 섬 / 독렛", "나트랑 ↔ 부온마투옷(닥락)"],
  },
  ru: {
    airport: [["Аэропорт Камрань → Нячанг", "Новые автомобили на 5–7 мест с подачей к вашему адресу."], ["Нячанг → аэропорт Камрань", "Заберём из отеля вовремя — без риска опоздать на рейс."], ["Камрань ↔ Нячанг, туда и обратно", "Экономьте с комплексным трансфером в обе стороны."], ["Аэропорт Камрань ↔ курорты Бай Дай", "Alma, Duyen Ha, Vinpearl, Radisson, Movenpick и другие."], ["Аэропорт Камрань ↔ порт Винперл Кау Да", "Встреча у канатной дороги или причала Vinpearl Harbour."], ["Аэропорт Камрань ↔ пляж Доклет / Ниньхоа", "Комфортная поездка по живописной прибрежной трассе."]],
    provinces: ["Нячанг ↔ Далат", "Нячанг ↔ Муйне (Фантьет)", "Нячанг ↔ Туихоа (Фуйен)", "Нячанг ↔ Куинён (Биньдинь)", "Нячанг ↔ Фанранг (Ниньтхуан)", "Нячанг ↔ бухта Виньхи / Ханграй", "Нячанг ↔ остров Дьепшон / Доклет", "Нячанг ↔ Буонметхуот (Даклак)"],
  },
  zh: {
    airport: [["金兰机场 → 芽庄市区", "新款5–7座车辆，上门接送至陈富街、鸿冲等区域。"], ["芽庄市区 → 金兰机场", "准时从酒店接您，无须担心误机。"], ["金兰 ↔ 芽庄往返", "预订全包往返接送可享更多优惠。"], ["金兰机场 ↔ 百汇度假村", "Alma、Duyen Ha、Vinpearl、Radisson、Movenpick 等。"], ["金兰机场 ↔ 珍珠岛桥港", "在缆车站或 Vinpearl Harbour 码头接送。"], ["金兰机场 ↔ 多乐海滩 / 宁和", "沿海高速路线顺畅舒适。"]],
    provinces: ["芽庄 ↔ 大叻", "芽庄 ↔ 美奈（潘切）", "芽庄 ↔ 绥和（富安）", "芽庄 ↔ 归仁（平定）", "芽庄 ↔ 潘朗（宁顺）", "芽庄 ↔ 永希湾 / 杭来", "芽庄 ↔ 迭山岛 / 多乐", "芽庄 ↔ 邦美蜀（得乐）"],
  },
};

export default function PopularRoutes() {
  const { t, language } = useLanguage();
  const localizedRoutes = routeCopy[language as Language] || routeCopy.vi;

  const airportRoutes = [
    ...localizedRoutes.airport.map(([name, note], index) => ({ name, note, price: `${t.common.fromPrice} ${["250.000", "250.000", "480.000", "180.000", "280.000", "550.000"][index]}${t.common.vnd}` })),
  ];

  const provinceRoutes = [
    ...localizedRoutes.provinces.map((name, index) => ({ name, distance: ["~135km", "~220km", "~120km", "~215km", "~100km", "~90km", "~50km", "~185km"][index], price: `${t.common.fromPrice} ${["1.200.000", "1.500.000", "1.100.000", "1.800.000", "950.000", "900.000", "500.000", "1.600.000"][index]}${t.common.vnd}` })),
  ];

  return (
    <section className="py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-5 md:mb-6">
          <span className="text-[#174978] font-semibold uppercase tracking-wider text-xs md:text-sm">
            {t.popularRoutes.tag}
          </span>
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 leading-snug">
            {t.popularRoutes.title}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mx-auto mb-2.5"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            {t.popularRoutes.subtitle}
          </p>
        </div>

        {/* Airport routes */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <PlaneTakeoff className="text-[#174978]" size={22} />
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-snug">
              {t.popularRoutes.airportSection}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {airportRoutes.map((route, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-sm hover:border-gray-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-[#003366] transition-colors leading-snug">
                      {route.name}
                    </h4>
                    <span className="font-semibold text-[#003366] whitespace-nowrap text-xs sm:text-sm bg-brand-light px-2.5 py-1 shrink-0">
                      {route.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3.5 font-medium leading-relaxed">{route.note}</p>
                </div>
                <Link
                  href="/#formbooking"
                  className="text-xs font-semibold text-[#174978] hover:text-[#003366] inline-flex items-center gap-1 transition-colors pt-2.5 border-t border-gray-100"
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
            <Navigation className="text-[#174978]" size={22} />
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-snug">
              {t.popularRoutes.provinceSection}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {provinceRoutes.map((prov, idx) => (
              <div
                key={idx}
                className="bg-white p-4 border border-gray-100 shadow-xs hover:border-gray-200 hover:shadow-sm transition-all text-center group"
              >
                <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[#003366] transition-colors">{prov.name}</p>
                <p className="text-xs text-gray-400 font-medium mb-2">{prov.distance}</p>
                <p className="font-semibold text-[#003366] text-sm">{prov.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
