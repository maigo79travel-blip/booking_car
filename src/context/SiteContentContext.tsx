"use client";

import React, { createContext, useContext, useState, useEffect, useTransition } from "react";
export interface Vehicle {
  id: number;
  name: string;
  image: string;
  category: string;
}

export interface VehicleCategory {
  title: string;
  seats: string;
  luggage: string;
  maxPassengers: string;
  maxLuggage: string;
  features: string[];
  vehicles: Vehicle[];
}

export interface ContactConfig {
  brand_name: string;
  hotline: string;
  hotline_display: string;
  zalo: string;
  whatsapp?: string;
  kakaotalk?: string;
  facebook?: string;
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
  bg_image?: string;
  pricing_bg_image?: string;
  banners: string[];
  badgeText: Record<string, string>;
}

export interface VehicleConfig {
  id: string;
  type: string;
  name: string;
  models?: string;
  seats?: string;
  capacity?: string;
  luggage?: string;
  price: string;
  image: string;
  features?: string[];
}

export interface RouteConfig {
  from: string;
  to: string;
  price: string;
  time: string;
}

export interface ReasonConfig {
  icon: string;
  title: string;
  description: string;
}

export interface StepConfig {
  step: string;
  title: string;
  description: string;
}

export interface FeaturedVehicle {
  id: string;
  name: string;
  seats: string;
  type: string;
  image: string;
  price: string;
  tag?: string;
  features: string[];
}

export interface TravelDestination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  distance?: string;
  description: string;
  tag?: string;
}

export interface TestimonialConfig {
  name: string;
  role: string;
  route?: string;
  stars: number;
  avatar: string;
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
  vehicleCategories: VehicleCategory[];
  featuredVehicles: FeaturedVehicle[];
  destinations: TravelDestination[];
  testimonials: TestimonialConfig[];
  faq: FAQConfig[];
  reloadContent: () => Promise<void>;
}

const defaultContact: ContactConfig = {
  brand_name: "maigo79.com",
  hotline: "0878458885",
  hotline_display: "0878.458.885",
  zalo: "0878458885",
  whatsapp: "0878458885",
  kakaotalk: "0878458885",
  facebook: "https://www.facebook.com/share/1BhL4Qut3u/?mibextid=wwXIfr",
  telegram: "https://t.me/maigo79_vn",
  email: "contact@maigo79.com",
  address: "",
  logo_url: "/images/logo-maigo79.png",
  working_hours: "24/7 (Phục vụ cả ngày lễ & Tết)",
};

const defaultHero: HeroConfig = {
  title1: {
    vi: "ĐẶT XE TAXI SÂN BAY CAM RANH – NHA TRANG",
    en: "CAM RANH AIRPORT – NHA TRANG TAXI SERVICE",
    ko: "깜란 국제공항 – 나트랑 시내 프라이빗 픽업 & 샌딩",
    ru: "ТРАНСФЕР АЭРОПОРТ КАМРАНЬ – НЯЧАНГ ПОД КЛЮЧ",
    zh: "芽庄金兰国际机场 – 市区专车接送服务",
  },
  title2: {
    vi: "ĐÓN TIỄN ĐÚNG GIỜ • GIÁ RẺ TRỌN GÓI CHỈ TỪ 250K",
    en: "PUNCTUAL PICKUP • ALL-INCLUSIVE FIXED FARE FROM 250K",
    ko: "정시 픽업 • 올인클루시브 정액 요금 25만동부터",
    ru: "ПОДАЧА ВОВРЕМЯ • ФИКСИРОВАННАЯ ЦЕНА ОТ 250К",
    zh: "准时接送 • 全包一口价仅25万起",
  },
  subtitle: {
    vi: "Dịch vụ xe riêng 5 - 7 - 16 chỗ đời mới, đưa đón tận nơi Sân bay Cam Ranh ⇄ TP. Nha Trang, Resort Bãi Dài, Đà Lạt 24/7 không lo phụ phí",
    en: "Private 5-7-16 seater modern cars, 24/7 door-to-door transfer Cam Ranh Airport ⇄ Nha Trang, Bai Dai Resorts, Da Lat with zero hidden fees",
    ko: "최신 5-7-16인승 프라이빗 차량, 깜란 공항 ↔ 나트랑 시내, 바이 다이 리조트, 달랏 24시간 도어투도어 서비스",
    ru: "Новые авто 5-7-16 мест, круглосуточная доставка от двери до двери Аэропорт Камрань ⇄ Нячанг, курорты Бай Дай, Далат без скрытых доплат",
    zh: "全新5座、7座、16座专车，24小时门到门金兰机场 ⇄ 芽庄市区、白代度假村、大叻接送，无任何隐藏费用",
  },
  bg_image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
  pricing_bg_image: "",
  banners: [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  ],
  badgeText: {
    vi: "HỆ THỐNG XE SÂN BAY CAM RANH & TOUR NHA TRANG HÀNG ĐẦU",
    en: "CAM RANH AIRPORT & NHA TRANG'S LEADING TRANSFER SERVICE",
    ko: "나트랑 & 깜란 공항 최고의 프리미엄 픽업 서비스",
    ru: "ВЕДУЩАЯ СЛУЖБА ТРАНСФЕРА В АЭРОПОРТ КАМРАНЬ И НЯЧАНГ",
    zh: "芽庄金兰机场及芽庄周边旅游专车首选",
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
    price: "250.000đ",
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
    price: "300.000đ",
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
    price: "550.000đ",
    image: "/images/big1.png",
    features: ["Ghế ngả cao cấp", "Khoang hành lý siêu rộng", "Phù hợp đoàn du lịch & công tác"],
  },
];

const defaultTestimonials: TestimonialConfig[] = [
  {
    name: "Nguyễn Hoàng Nam",
    role: "Khách du lịch (Hà Nội)",
    avatar: "/images/Hero1.jpg",
    stars: 5,
    route: "Sân bay Cam Ranh ↔ Khách sạn Sheraton Trần Phú",
    comment:
      "Dịch vụ rất tuyệt vời! Tài xế đón đúng giờ tại sảnh Ga Quốc Nội sân bay Cam Ranh, xe mới tinh thơm tho và chạy rất êm. Giá 250k trọn gói không phát sinh.",
  },
  {
    name: "Park Ji-hoon",
    role: "Du khách Hàn Quốc (Seoul)",
    avatar: "/images/Hero2.jpg",
    stars: 5,
    route: "Cam Ranh Airport ↔ Alma Resort Bãi Dài",
    comment:
      "Very friendly driver, clean car and on-time pickup. The driver was waiting with my nameplate at Cam Ranh Terminal 2. Highly recommended for family trips in Nha Trang!",
  },
  {
    name: "Trần Thu Hà",
    role: "Gia đình du lịch (TP.HCM)",
    avatar: "/images/Hero22.jpg",
    stars: 5,
    route: "Nha Trang ↔ Đà Lạt (Xe 7 chỗ Xpander)",
    comment:
      "Gia đình mình đi tour Nha Trang lên Đà Lạt qua đèo Khánh Lê, bác tài lái rất cẩn thận, êm ái không bị say xe. Xe sạch sẽ và nhiệt tình giới thiệu các điểm ăn uống.",
  },
];

const defaultFAQ: FAQConfig[] = [
  {
    q: {
      vi: "Giá xe sân bay Cam Ranh tại maigo79.com đã bao gồm các chi phí cầu đường và vé sân bay chưa?",
      en: "Does the price include all highway toll fees and Cam Ranh airport surcharges?",
    },
    a: {
      vi: "Toàn bộ giá cước hiển thị trên website là giá TRỌN GÓI 100%, đã bao gồm vé vào sân bay Cam Ranh, phí đường bộ và tài xế chờ đón tận sảnh.",
      en: "All rates displayed on our website are 100% all-inclusive, covering Cam Ranh airport parking fees, tolls, and driver waiting time.",
    },
  },
  {
    q: {
      vi: "Tôi cần đặt xe trước bao lâu để đảm bảo có xe đón tại sân bay Cam Ranh?",
      en: "How far in advance should I book my airport transfer?",
    },
    a: {
      vi: "Để có xe phục vụ chu đáo nhất, bạn nên đặt trước từ 30 phút - 2 tiếng. Đối với các chuyến bay đêm hoặc sáng sớm, bạn nên đặt trước từ hôm trước.",
      en: "We recommend booking at least 30 minutes to 2 hours before your flight. For early morning or late night flights, booking a day ahead is ideal.",
    },
  },
  {
    q: {
      vi: "Nếu chuyến bay đến Cam Ranh bị hoãn (delay) thì có bị tính thêm phí chờ không?",
      en: "If my flight to Cam Ranh is delayed, will I be charged extra waiting fees?",
    },
    a: {
      vi: "maigo79.com MIỄN PHÍ 100% phí chờ khi chuyến bay bị hoãn. Tài xế sẽ theo dõi số hiệu chuyến bay của bạn và có mặt đón đúng lúc bạn hạ cánh.",
      en: "maigo79.com provides 100% FREE waiting time for delayed flights. Our dispatchers track flight numbers and adjust pickup times accordingly.",
    },
  },
];

export const defaultFeaturedVehicles: FeaturedVehicle[] = [
  {
    id: "v-5",
    name: "Honda City / Toyota Vios",
    seats: "5 chỗ (Tối đa 4 khách)",
    type: "Sedan 5 chỗ đời mới",
    image: "/images/51.png",
    price: "Từ 250.000đ",
    tag: "Phổ biến nhất",
    features: ["Cốp rộng để 2-3 vali", "Máy lạnh mát rượi, nội thất sạch sẽ", "Phù hợp gia đình nhỏ & công tác"],
  },
  {
    id: "v-7",
    name: "Mitsubishi Xpander / Fortuner",
    seats: "7 chỗ (Tối đa 6 khách)",
    type: "SUV / MPV 7 chỗ gia đình",
    image: "/images/71.png",
    price: "Từ 300.000đ",
    tag: "Gia đình yêu thích",
    features: ["Không gian rộng rãi, êm ái", "Chứa được 4-5 vali lớn", "Động cơ mạnh mẽ, vượt đèo êm ái"],
  },
  {
    id: "v-16",
    name: "Hyundai Solati / Ford Transit",
    seats: "16 chỗ (Tối đa 15 khách)",
    type: "Xe 16 chỗ du lịch cao cấp",
    image: "/images/big5.jpg",
    price: "Từ 550.000đ",
    tag: "Đoàn đông người",
    features: ["Ghế ngả cao cấp, trần cao thoáng", "Khoang hành lý siêu rộng", "Phù hợp đoàn du lịch, công ty"],
  },
  {
    id: "v-vip",
    name: "Kia Carnival / Limousine VIP",
    seats: "7 chỗ VIP Thương gia",
    type: "Xe VIP sang trọng 2024 - 2026",
    image: "/images/73.png",
    price: "Từ 650.000đ",
    tag: "VIP Đẳng cấp",
    features: ["Ghế massage hạng thương gia", "Màn hình giải trí & sạc điện thoại", "Dành cho chuyên gia, khách VIP"],
  },
];

export const defaultDestinations: TravelDestination[] = [
  {
    id: "dest-1",
    title: "Vinpearl Harbour & Đảo Hòn Tre",
    subtitle: "Thiên đường vui chơi & Cáp treo vượt biển",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    distance: "Cách trung tâm Nha Trang ~5km",
    description: "Tổ hợp mua sắm, ẩm thực 24/7 và bến cáp treo vượt vịnh biển Nha Trang tuyệt đẹp.",
    tag: "Vui chơi giải trí",
  },
  {
    id: "dest-2",
    title: "Tháp Bà Ponagar Nha Trang",
    subtitle: "Di tích lịch sử văn hóa Chăm Pa cổ kính",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    distance: "Cách trung tâm TP ~3km",
    description: "Quần thể đền tháp Chăm Pa nghìn năm tuổi linh thiêng nằm bên bờ sông Cái êm đềm.",
    tag: "Văn hóa tâm linh",
  },
  {
    id: "dest-3",
    title: "Resort & Bãi Dài Cam Ranh",
    subtitle: "Bờ biển cát trắng mịn & Thiên đường nghỉ dưỡng",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    distance: "Cách sân bay Cam Ranh ~5-10km",
    description: "Quy tụ hàng loạt resort 5 sao quốc tế như Alma, Duyên Hà, Movenpick, Radisson Blu.",
    tag: "Nghỉ dưỡng cao cấp",
  },
  {
    id: "dest-4",
    title: "Viện Hải Dương Học Nha Trang",
    subtitle: "Bảo tàng sinh vật biển lớn nhất Đông Nam Á",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    distance: "Gần cảng Cầu Đá (~6km từ trung tâm)",
    description: "Nơi lưu giữ hơn 20.000 mẫu vật sinh vật biển và bộ xương cá voi khổng lồ dài 26m.",
    tag: "Khám phá đại dương",
  },
  {
    id: "dest-5",
    title: "Đảo Điệp Sơn & Biển Dốc Lết",
    subtitle: "Con đường đi bộ giữa biển độc nhất vô nhị",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    distance: "Cách Nha Trang ~55km về phía Bắc",
    description: "Trải nghiệm dạo bước trên dải cát trắng nối liền 3 hòn đảo nhỏ giữa đại dương xanh biếc.",
    tag: "Biển đảo độc lạ",
  },
  {
    id: "dest-6",
    title: "Vịnh Vĩnh Hy & Hang Rái",
    subtitle: "Tuyệt tác thiên nhiên & Rạn san hô cổ",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    distance: "Cách Nha Trang ~90km theo đường biển",
    description: "Một trong bốn vịnh biển đẹp nhất Việt Nam với công viên đá Hang Rái kỳ vĩ.",
    tag: "Tour trong ngày",
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
    // Migrate the previous bundled logo automatically when old CMS content
    // still points at Brand.jpg. Admin can still replace this with Cloudinary.
    logo_url:
      (content.contact_info as Partial<ContactConfig>)?.logo_url === "/images/Brand.jpg"
        ? defaultContact.logo_url
        : ((content.contact_info as Partial<ContactConfig>)?.logo_url || defaultContact.logo_url),
  };

  const hero: HeroConfig = {
    ...defaultHero,
    ...((content.hero_section as Partial<HeroConfig>) || {}),
  };

  const vehicles: VehicleConfig[] =
    content.vehicles_fleet && Array.isArray(content.vehicles_fleet)
      ? (content.vehicles_fleet as VehicleConfig[])
      : defaultVehicles;

  const vehicleCategories: VehicleCategory[] =
    content.vehicle_categories && Array.isArray(content.vehicle_categories)
      ? (content.vehicle_categories as VehicleCategory[])
      : [];

  const featuredVehicles: FeaturedVehicle[] =
    content.featured_vehicles && Array.isArray(content.featured_vehicles)
      ? (content.featured_vehicles as FeaturedVehicle[])
      : defaultFeaturedVehicles;

  const destinations: TravelDestination[] =
    content.nha_trang_destinations && Array.isArray(content.nha_trang_destinations)
      ? (content.nha_trang_destinations as TravelDestination[])
      : defaultDestinations;

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
        vehicleCategories,
        featuredVehicles,
        destinations,
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
      vehicleCategories: [],
      featuredVehicles: defaultFeaturedVehicles,
      destinations: defaultDestinations,
      testimonials: defaultTestimonials,
      faq: defaultFAQ,
      reloadContent: async () => {},
    };
  }
  return context;
};
