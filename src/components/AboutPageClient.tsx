"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
  vi: { title: "Về Chúng Tôi - maigo79.com", heading: "Dịch Vụ Xe Sân Bay Cam Ranh & Tour Nha Trang", paragraphs: ["Thành lập từ năm 2020, maigo79.com cung cấp dịch vụ xe đưa đón tại Sân bay Quốc tế Cam Ranh, khu nghỉ dưỡng Bãi Dài, trung tâm Nha Trang và các tuyến liên tỉnh.", "Với nền tảng điều xe thông minh và đội ngũ chuyên nghiệp, chúng tôi mang đến trải nghiệm đặt xe tiện lợi, an toàn và tiết kiệm.", "Chúng tôi sẵn sàng phục vụ khách trong nước, quốc tế và các đối tác lữ hành với chính sách giá minh bạch, hỗ trợ 24/7."], values: ["An toàn tuyệt đối", "Đón đúng giờ", "Tài xế chuyên nghiệp", "Hỗ trợ tận tâm 24/7"] },
  en: { title: "About maigo79.com", heading: "Cam Ranh Airport & Nha Trang Transfer Service", paragraphs: ["Established in 2020, maigo79.com provides private transfers from Cam Ranh International Airport, Bai Dai resorts, Nha Trang city and interprovincial destinations.", "Our smart dispatch platform and professional team make booking convenient, safe and cost-effective.", "We serve domestic and international travellers as well as travel partners with transparent rates and 24/7 support."], values: ["Safety first", "Always on time", "Professional drivers", "Dedicated 24/7 support"] },
  ko: { title: "maigo79.com 소개", heading: "깜란 공항 · 나트랑 전문 차량 서비스", paragraphs: ["maigo79.com은 2020년 설립 이후 깜란 국제공항, 바이자이 리조트, 나트랑 시내 및 근교 이동을 위한 전용 차량 서비스를 제공하고 있습니다.", "스마트 배차 시스템과 전문 팀을 통해 편리하고 안전하며 합리적인 예약 경험을 제공합니다.", "국내외 여행객과 여행 파트너에게 투명한 요금과 24시간 지원을 제공합니다."], values: ["안전 최우선", "정시 픽업", "전문 기사", "24시간 친절한 지원"] },
  ru: { title: "О maigo79.com", heading: "Трансферы из аэропорта Камрань и по Нячангу", paragraphs: ["С 2020 года maigo79.com предоставляет частные трансферы из международного аэропорта Камрань, курортов Байзай, центра Нячанга и в другие города.", "Умная система распределения автомобилей и профессиональная команда делают бронирование удобным, безопасным и выгодным.", "Мы обслуживаем местных и международных гостей с прозрачными тарифами и поддержкой 24/7."], values: ["Безопасность", "Точно вовремя", "Профессиональные водители", "Поддержка 24/7"] },
  zh: { title: "关于 maigo79.com", heading: "金兰机场与芽庄专业接送服务", paragraphs: ["maigo79.com 成立于2020年，提供金兰国际机场、金兰湾长滩度假区、芽庄市区及跨省目的地的专车接送服务。", "凭借智能调度系统和专业团队，我们带来便捷、安全且高性价比的预约体验。", "我们为本地及国际旅客和旅行合作伙伴提供透明价格及全天候支持。"], values: ["安全第一", "准时接送", "专业司机", "24小时贴心支持"] },
} as const;

export default function AboutPageClient() {
  const { language, t } = useLanguage(); const text = copy[language];
  return <main className="min-h-screen bg-white"><Breadcrumbs items={[{ name: t.nav.about }]} /><div className="container mx-auto px-4 md:px-12 lg:px-24 pt-4 md:pt-6 pb-2"><h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{text.title}</h1><div className="w-24 h-1 bg-[#174978]" /></div><div className="container mx-auto px-4 md:px-12 lg:px-24 py-4 md:py-6"><h2 className="text-xl md:text-2xl font-bold text-[#003366] mb-4">{text.heading}</h2><div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">{text.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">{text.values.map((value) => <div key={value} className="bg-slate-50 p-5 text-center text-[#003366] font-bold">{value}</div>)}</div></div><Footer /><FloatingContacts /></main>;
}
