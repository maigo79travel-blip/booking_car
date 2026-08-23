"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from "react";

export interface ContactConfig {
  brand_name: string;
  hotline: string;
  hotline_display: string;
  zalo: string;
  telegram: string;
  email: string;
  address: string;
  logo_url: string;
  working_hours: string;
}

export interface HeroConfig {
  title1: Record<string, string>;
  title2: Record<string, string>;
  subtitle: Record<string, string>;
  banners: string[];
  badgeText: Record<string, string>;
}

export interface VehicleConfig {
  id: string;
  type: string;
  name: string;
  models: string;
  seats: string;
  luggage: string;
  price: string;
  image: string;
  features: string[];
}

export interface TestimonialConfig {
  name: string;
  role: string;
  avatar: string;
  stars: number;
  route: string;
  comment: string;
}

export interface FAQConfig {
  q: Record<string, string>;
  a: Record<string, string>;
}

export interface SiteContentContextProps {
  content: Record<string, unknown>;
  contact: ContactConfig;
  hero: HeroConfig;
  vehicles: VehicleConfig[];
  testimonials: TestimonialConfig[];
  faq: FAQConfig[];
  reloadContent: () => Promise<void>;
}

const defaultContact: ContactConfig = {
  brand_name: "inoibai.vn",
  hotline: "0928015280",
  hotline_display: "0928.015.280",
  zalo: "0905876231",
  telegram: "https://t.me/inoibai_vn",
  email: "inoibai.vn@gmail.com",
  address: "Sảnh A1, T1 - Sân bay Quốc tế Nội Bài, Sóc Sơn, Hà Nội",
  logo_url: "/images/Brand.jpg",
  working_hours: "24/7 (Phục vụ cả ngày lễ & Tết)",
};

const defaultHero: HeroConfig = {
  title1: {
    vi: "ĐẶT XE TAXI SÂN BAY NỘI BÀI",
    en: "BOOK NOI BAI AIRPORT TAXI",
    ko: "노이바이 공항 택시 예약",
    ru: "ЗАКАЗ ТАКСИ В АЭРОПОРT НОЙБАЙ",
    zh: "预订内排机场出租车",
  },
  title2: {
    vi: "ĐÓN TIỄN ĐÚNG GIỜ • GIÁ RẺ TRỌN GÓI CHỈ TỪ 200K",
    en: "PUNCTUAL PICKUP • ALL-INCLUSIVE FIXED FARE FROM 200K",
    ko: "정시 픽업 • 올인클루시브 정액 요금 20만동부터",
    ru: "ПОДАЧА ВОВРЕМЯ • ФИКСИРОВАННАЯ ЦЕНА ОТ 200К",
    zh: "准时接送 • 全包一口价仅20万起",
  },
  subtitle: {
    vi: "Dịch vụ xe riêng 5 - 7 - 16 chỗ đời mới, đưa đón tận nơi 24/7 không lo phụ phí",
    en: "Private 5-7-16 seater modern cars, 24/7 door-to-door transfer with zero hidden fees",
    ko: "최신 5-7-16인승 프라이빗 차량, 숨겨진 추가 요금 없는 24시간 도어투도어 서비스",
    ru: "Новые авто 5-7-16 мест, круглосуточная доставка от двери до двери без скрытых доплат",
    zh: "全新5座、7座、16座专车，24小时门到门接送，无任何隐藏费用",
  },
  banners: ["/images/Hero1.jpg", "/images/Hero2.jpg", "/images/Hero22.jpg"],
  badgeText: {
    vi: "HỆ THỐNG TAXI SÂN BAY UY TÍN HÀNG ĐẦU HÀ NỘI",
    en: "HANOI'S LEADING AIRPORT TRANSFER SYSTEM",
    ko: "하노이 최고의 프리미엄 공항 택시",
    ru: "ВЕДУЩАЯ СЛУЖБА ТАКСИ В АЭРОПОРТ ХАНОЯ",
    zh: "河内顶尖河内内排机场专车接送系统",
  },
};

const defaultVehicles: VehicleConfig[] = [
  {
    id: "5-seater",
    type: "5",
    name: "Xe 5 Chỗ Sedan / Hatchback",
    models: "Vios, Accent, City, Cerato đời mới",
    seats: "4 hành khách",
    luggage: "2 vali lớn + 2 balo",
    price: "200.000đ",
    image: "/images/51.png",
    features: ["Điều hòa mát lạnh", "Ghế da êm ái", "Nước suối miễn phí", "Cốp rộng rãi"],
  },
  {
    id: "7-seater",
    type: "7",
    name: "Xe 7 Chỗ SUV / MPV",
    models: "Xpander, Innova, Veloz, Fortuner",
    seats: "6 hành khách",
    luggage: "4 vali lớn + 3 balo",
    price: "250.000đ",
    image: "/images/71.png",
    features: ["Không gian rộng rãi", "Gầm cao êm ái", "Phù hợp gia đình", "Wifi tốc độ cao"],
  },
  {
    id: "16-seater",
    type: "16",
    name: "Xe 16 Chỗ Du Lịch / Đoàn",
    models: "Ford Transit, Hyundai Solati",
    seats: "15 hành khách",
    luggage: "10-12 vali hành lý",
    price: "450.000đ",
    image: "/images/big1.png",
    features: ["Ghế ngả cao cấp", "Khoang hành lý siêu rộng", "Phù hợp đoàn du lịch & công tác"],
  },
];

const defaultTestimonials: TestimonialConfig[] = [
  {
    name: "Nguyễn Văn Hùng",
    role: "Doanh nhân (Hà Nội)",
    avatar: "/images/Hero1.jpg",
    stars: 5,
    route: "Hoàn Kiếm ↔ Sân bay Nội Bài",
    comment:
      "Dịch vụ rất tuyệt vời! Tài xế đón đúng giờ tại sảnh T1, xe Vios mới tinh thơm tho và chạy rất êm. Giá 200k trọn gói không phát sinh.",
  },
  {
    name: "Kim Min-ji",
    role: "Du khách Hàn Quốc",
    avatar: "/images/Hero2.jpg",
    stars: 5,
    route: "Nội Bài ↔ Khách sạn Lotte Liễu Giai",
    comment:
      "Very friendly driver, clean car and on-time pickup. The driver was waiting with my nameplate at Terminal 2. Highly recommended!",
  },
  {
    name: "Trần Mai Anh",
    role: "Gia đình du lịch (Đà Nẵng)",
    avatar: "/images/Hero22.jpg",
    stars: 5,
    route: "Nội Bài ↔ Cầu Giấy (Xe 7 chỗ Xpander)",
    comment:
      "Gia đình mình có con nhỏ và nhiều hành lý, đặt xe 7 chỗ rất rộng rãi. Bác tài hỗ trợ mang vác vali nhiệt tình, lái xe an toàn.",
  },
];

const defaultFAQ: FAQConfig[] = [
  {
    q: {
      vi: "Giá xe sân bay Nội Bài tại inoibai.vn đã bao gồm các chi phí cầu đường chưa?",
      en: "Does the price include all highway toll fees and airport surcharges?",
    },
    a: {
      vi: "Toàn bộ giá cước hiển thị trên website là giá TRỌN GÓI 100%, đã bao gồm vé vào sân bay, phí cầu đường cao tốc và tài xế chờ đón.",
      en: "All rates displayed on our website are 100% all-inclusive, covering airport parking fees, highway tolls, and driver waiting time.",
    },
  },
  {
    q: {
      vi: "Tôi cần đặt xe trước bao lâu để đảm bảo có xe đúng giờ?",
      en: "How far in advance should I book my airport transfer?",
    },
    a: {
      vi: "Để có xe phục vụ chu đáo nhất, bạn nên đặt trước từ 30 phút - 2 tiếng. Đối với các chuyến bay đêm hoặc sáng sớm, bạn nên đặt trước từ hôm trước.",
      en: "We recommend booking at least 30 minutes to 2 hours before your flight. For early morning or late night flights, booking a day ahead is ideal.",
    },
  },
  {
    q: {
      vi: "Nếu chuyến bay của tôi bị delay (hoãn chuyến) thì có bị tính thêm phí chờ không?",
      en: "If my flight is delayed, will I be charged extra waiting fees?",
    },
    a: {
      vi: "inoibai.vn MIỄN PHÍ 100% phí chờ khi chuyến bay bị hoãn. Tài xế sẽ theo dõi số hiệu chuyến bay của bạn và có mặt đón đúng lúc bạn hạ cánh.",
      en: "inoibai.vn provides 100% FREE waiting time for delayed flights. Our dispatchers track flight numbers and adjust pickup times accordingly.",
    },
  },
];

const SiteContentContext = createContext<SiteContentContextProps | undefined>(
  undefined
);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [, startTransition] = useTransition();

  const reloadContent = async () => {
    try {
      const res = await fetch("/api/site-content", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        startTransition(() => {
          setContent(data);
        });
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/site-content", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          startTransition(() => {
            setContent(data);
          });
        }
      } catch {
        // fallback
      }
    };
    fetchContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const contact: ContactConfig = {
    ...defaultContact,
    ...((content.contact_info as Partial<ContactConfig>) || {}),
  };

  const hero: HeroConfig = {
    ...defaultHero,
    ...((content.hero_section as Partial<HeroConfig>) || {}),
  };

  const vehicles: VehicleConfig[] =
    content.vehicles_fleet && Array.isArray(content.vehicles_fleet)
      ? (content.vehicles_fleet as VehicleConfig[])
      : defaultVehicles;

  const testimonials: TestimonialConfig[] =
    content.testimonials && Array.isArray(content.testimonials)
      ? (content.testimonials as TestimonialConfig[])
      : defaultTestimonials;

  const faq: FAQConfig[] =
    content.faq_list && Array.isArray(content.faq_list)
      ? (content.faq_list as FAQConfig[])
      : defaultFAQ;

  return (
    <SiteContentContext.Provider
      value={{
        content,
        contact,
        hero,
        vehicles,
        testimonials,
        faq,
        reloadContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextProps => {
  const context = useContext(SiteContentContext);
  if (!context) {
    return {
      content: {},
      contact: defaultContact,
      hero: defaultHero,
      vehicles: defaultVehicles,
      testimonials: defaultTestimonials,
      faq: defaultFAQ,
      reloadContent: async () => {},
    };
  }
  return context;
};
