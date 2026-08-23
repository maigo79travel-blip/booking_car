"use client";

import React, { useState } from "react";
import {
  Save,
  Sparkles,
  Phone,
  Car,
  MessageSquare,
  HelpCircle,
  Cloud,
  Code,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  Check,
} from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";

export interface SiteContentRow {
  id: string;
  content_key: string;
  content_type?: string;
  value: unknown;
}

interface VehicleItem {
  id?: string;
  type: string;
  name: string;
  models: string;
  seats: string;
  luggage: string;
  price: string;
  image: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  stars: number;
  route: string;
  comment: string;
}

interface FAQItem {
  q: Record<string, string>;
  a: Record<string, string>;
}

interface ContentManagerProps {
  content: SiteContentRow[];
  onSaveContent: (id: string, data: { value: unknown }) => Promise<void>;
}

type CMSTab =
  | "hero"
  | "brand"
  | "vehicles"
  | "why_us"
  | "steps"
  | "testimonials"
  | "faq"
  | "cloudinary"
  | "raw_json";

export default function ContentManager({
  content,
  onSaveContent,
}: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<CMSTab>("hero");
  const [selectedLang, setSelectedLang] = useState<Language>("vi");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Find or initialize content items by key
  const getContent = (
    key: string,
    defaultValue: Record<string, unknown> = {}
  ): Record<string, unknown> => {
    const item = content.find((c) => c.content_key === key);
    return item && typeof item.value === "object" && item.value !== null
      ? (item.value as Record<string, unknown>)
      : defaultValue;
  };

  const getContentArray = <T,>(key: string, defaultValue: T[]): T[] => {
    const item = content.find((c) => c.content_key === key);
    return (item && Array.isArray(item.value) ? item.value : defaultValue) as T[];
  };

  const getContentItem = (key: string) => {
    return content.find((c) => c.content_key === key);
  };

  // State for all CMS sections
  const [heroData, setHeroData] = useState(() => {
    const raw = getContent("hero_section", {});
    return {
      title1: (raw.title1 as Record<string, string>) || {
        vi: "ĐẶT XE TAXI SÂN BAY CAM RANH – NHA TRANG",
        en: "CAM RANH AIRPORT – NHA TRANG TAXI SERVICE",
        ko: "깜란 국제공항 – 나트랑 시내 프라이빗 픽업 & 샌딩",
        ru: "ТРАНСФЕР АЭРОПОРТ КАМРАНЬ – НЯЧАНГ ПОД КЛЮЧ",
        zh: "芽庄金兰国际机场 – 市区专车接送服务",
      },
      title2: (raw.title2 as Record<string, string>) || {
        vi: "ĐÓN TIỄN ĐÚNG GIỜ • GIÁ RẺ TRỌN GÓI CHỈ TỪ 250K",
        en: "PUNCTUAL PICKUP • ALL-INCLUSIVE FIXED FARE FROM 250K",
        ko: "정시 픽업 • 올인클루시브 정액 요금 25만동부터",
        ru: "ПОДАЧА ВОВРЕМЯ • ФИКСИРОВАННАЯ ЦЕНА ОТ 250К",
        zh: "准时接送 • 全包一口价仅25万起",
      },
      subtitle: (raw.subtitle as Record<string, string>) || {
        vi: "Dịch vụ xe riêng 5 - 7 - 16 chỗ đời mới, đưa đón tận nơi Sân bay Cam Ranh ⇄ TP. Nha Trang, Resort Bãi Dài, Đà Lạt 24/7 không lo phụ phí",
        en: "Private 5-7-16 seater modern cars, 24/7 door-to-door transfer Cam Ranh Airport ⇄ Nha Trang, Bai Dai Resorts, Da Lat with zero hidden fees",
        ko: "최신 5-7-16인승 프라이빗 차량, 깜란 공항 ↔ 나트랑 시내, 바이 다이 리조트, 달랏 24시간 도어투도어 서비스",
        ru: "Новые авто 5-7-16 мест, круглосуточная доставка от двери до двери Аэропорт Камрань ⇄ Нячанг, курорты Бай Дай, Далат без скрытых доплат",
        zh: "全新5座、7座、16座专车，24小时门到门金兰机场 ⇄ 芽庄市区、白代度假村、大叻接送，无任何隐藏费用",
      },
      banners: (raw.banners as string[]) || [
        "/images/Hero1.jpg",
        "/images/Hero2.jpg",
        "/images/Hero22.jpg",
      ],
      badgeText: (raw.badgeText as Record<string, string>) || {
        vi: "HỆ THỐNG XE SÂN BAY CAM RANH & TOUR NHA TRANG HÀNG ĐẦU",
        en: "CAM RANH AIRPORT & NHA TRANG'S LEADING TRANSFER SERVICE",
        ko: "나트랑 & 깜란 공항 최고의 프리미엄 픽업 서비스",
        ru: "ВЕДУЩАЯ СЛУЖБА ТРАНСФЕРА В АЭРОПОРТ КАМРАНЬ И НЯЧАНГ",
        zh: "芽庄金兰机场及芽庄周边旅游专车首选",
      },
    };
  });

  const [contactData, setContactData] = useState(() => {
    const raw = getContent("contact_info", {});
    return {
      brand_name: (raw.brand_name as string) || "maigo79.com",
      hotline: (raw.hotline as string) || "0928015280",
      hotline_display: (raw.hotline_display as string) || "0928.015.280",
      zalo: (raw.zalo as string) || "0905876231",
      telegram: (raw.telegram as string) || "https://t.me/maigo79_vn",
      email: (raw.email as string) || "contact@maigo79.com",
      address: (raw.address as string) || "Cột số 3 & 4 - Sảnh Đến Ga Quốc Nội & Quốc Tế, Sân bay Quốc tế Cam Ranh, Khánh Hòa",
      logo_url: (raw.logo_url as string) || "/images/logo-maigo79.png",
      working_hours: (raw.working_hours as string) || "24/7 (Phục vụ cả ngày lễ & Tết)",
    };
  });

  const [vehiclesData, setVehiclesData] = useState<VehicleItem[]>(() =>
    getContentArray<VehicleItem>("vehicles_fleet", [
      {
        id: "5-seater",
        type: "5",
        name: "Xe 5 Chỗ Sedan / Hatchback",
        models: "Vios, Accent, City, Cerato đời mới",
        seats: "4 hành khách",
        luggage: "2 vali lớn + 2 vali nhỏ",
        price: "250.000đ",
        image: "/images/51.png",
      },
      {
        id: "7-seater",
        type: "7",
        name: "Xe 7 Chỗ SUV / MPV",
        models: "Innova, Xpander, Fortuner, Veloz đời mới",
        seats: "6 hành khách",
        luggage: "4 vali lớn + 3 vali nhỏ",
        price: "350.000đ",
        image: "/images/71.png",
      },
      {
        id: "16-seater",
        type: "16",
        name: "Xe 16 Chỗ Du Lịch Cao Cấp",
        models: "Ford Transit, Hyundai Solati đời mới",
        seats: "15 hành khách",
        luggage: "8 - 10 vali các loại",
        price: "650.000đ",
        image: "/images/161.png",
      },
    ])
  );

  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>(() =>
    getContentArray<TestimonialItem>("testimonials", [
      {
        name: "Nguyễn Hoàng Nam",
        role: "Khách du lịch Hà Nội",
        avatar: "/images/Hero1.jpg",
        stars: 5,
        route: "Sân bay Cam Ranh → Khách sạn InterContinental Nha Trang",
        comment:
          "Dịch vụ đón tiễn Cam Ranh cực kỳ đúng giờ, tài xế hỗ trợ mang vác hành lý nhiệt tình. Giá rẻ hơn hẳn so với gọi taxi sân bay truyền thống.",
      },
      {
        name: "Trần Mai Anh",
        role: "Gia đình du lịch TP.HCM",
        avatar: "/images/Hero2.jpg",
        stars: 5,
        route: "Sân bay Cam Ranh → Resort Bãi Dài Cam Ranh",
        comment:
          "Xe 7 chỗ Xpander rất mới và sạch sẽ, có ghế trẻ em. Tài xế lái xe cẩn thận, êm ái, rất an tâm.",
      },
      {
        name: "Kim Min-soo",
        role: "Du khách Hàn Quốc (Korean Tourist)",
        avatar: "/images/Hero22.jpg",
        stars: 5,
        route: "Cam Ranh Airport Terminal 2 → Nha Trang Center",
        comment:
          "Great service! Driver was waiting with a sign right outside the international gate. Very polite and English speaking driver.",
      },
    ])
  );

  const [faqData, setFaqData] = useState<FAQItem[]>(() =>
    getContentArray<FAQItem>("faq_list", [
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
    ])
  );

  const [cloudinaryConfig, setCloudinaryConfig] = useState(() => {
    const raw = getContent("cloudinary_config", {});
    return {
      cloud_name: (raw.cloud_name as string) || "",
      api_key: (raw.api_key as string) || "",
      api_secret: (raw.api_secret as string) || "",
      upload_preset: (raw.upload_preset as string) || "",
    };
  });

  // Save specific section
  const handleSaveSection = async (key: string, value: unknown) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const existing = getContentItem(key);
      if (existing?.id) {
        await onSaveContent(existing.id, { value });
      } else {
        // Create new
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            table: "site_content",
            data: {
              content_key: key,
              content_type: typeof value === "object" ? "json" : "text",
              value,
            },
          }),
        });
        if (!res.ok) throw new Error("Không thể tạo cấu hình mới");
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      alert("Lỗi khi lưu: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Visual CMS System</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Quản Trị Nội Dung & Hình Ảnh Website
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Chỉnh sửa toàn bộ thông tin hiển thị, logo, hotline, banner và hình ảnh xe trực tiếp trên giao diện
          </p>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg">
          <Globe size={16} className="text-slate-500 ml-2" />
          <span className="text-xs font-extrabold text-slate-700 mr-1">Ngôn ngữ soạn thảo:</span>
          <div className="flex gap-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 rounded-md text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedLang === lang.code
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
        {[
          { id: "hero", label: "Hero & Banner", icon: Sparkles },
          { id: "brand", label: "Thương hiệu & Hotline", icon: Phone },
          { id: "vehicles", label: "Đội xe & Ảnh xe", icon: Car },
          { id: "testimonials", label: "Đánh giá khách hàng", icon: MessageSquare },
          { id: "faq", label: "Câu hỏi thường gặp FAQ", icon: HelpCircle },
          { id: "cloudinary", label: "Cấu hình Cloudinary", icon: Cloud },
          { id: "raw_json", label: "Dữ liệu thô (Raw JSON)", icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as CMSTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-extrabold ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-extrabold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <span>Đã lưu nội dung thành công và cập nhật ngay lên website!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: HERO & BANNERS */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Khối Hero Section & Banner Trình Chiếu ({selectedLang.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Khối tiêu đề chính và 3 hình ảnh banner chạy slide tự động ở trang chủ
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("hero_section", heroData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Khối Hero"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Title 1 */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Dòng Tiêu Đề 1 ({selectedLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={heroData.title1[selectedLang] || ""}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    title1: { ...heroData.title1, [selectedLang]: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Title 2 */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Dòng Tiêu Đề 2 (Màu cam nổi bật) ({selectedLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={heroData.title2[selectedLang] || ""}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    title2: { ...heroData.title2, [selectedLang]: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-orange-600 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Mô tả phụ Hero ({selectedLang.toUpperCase()})
              </label>
              <textarea
                rows={2}
                value={heroData.subtitle[selectedLang] || ""}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    subtitle: { ...heroData.subtitle, [selectedLang]: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Khẩu hiệu trên cùng (Top Badge) ({selectedLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={heroData.badgeText[selectedLang] || ""}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    badgeText: { ...heroData.badgeText, [selectedLang]: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* 3 Banner Images */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>🖼️ 3 Hình Ảnh Banner Trình Chiếu (Slide Show Hero)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ImageUploadField
                      label={`Banner ${idx + 1}`}
                      value={heroData.banners[idx] || ""}
                      onChange={(url) => {
                        const newBanners = [...heroData.banners];
                        newBanners[idx] = url;
                        setHeroData({ ...heroData, banners: newBanners });
                      }}
                      folder="inhatrang/banners"
                      placeholder={`/images/Hero${idx + 1}.jpg`}
                      helperText={`Ảnh hiển thị ở vị trí slide thứ ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BRAND & CONTACT */}
      {/* ========================================================================= */}
      {activeTab === "brand" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Thương Hiệu, Hotline & Thông Tin Liên Hệ Toàn Website
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Cấu hình logo, số điện thoại hotline, zalo, email và địa chỉ đón trả
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("contact_info", contactData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Thông Tin Liên Hệ"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <ImageUploadField
                label="Logo Thương Hiệu (Header & Footer)"
                value={contactData.logo_url}
                onChange={(url) => setContactData({ ...contactData, logo_url: url })}
                folder="inhatrang/branding"
                placeholder="/images/logo.png hoặc https://res.cloudinary.com/..."
                helperText="Ảnh logo hiển thị trên thanh điều hướng đầu trang và chân trang website"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Tên thương hiệu (Brand Name)
              </label>
              <input
                type="text"
                value={contactData.brand_name}
                onChange={(e) => setContactData({ ...contactData, brand_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Số Hotline (Quay số trực tiếp khi bấm gọi)
              </label>
              <input
                type="text"
                value={contactData.hotline}
                onChange={(e) => setContactData({ ...contactData, hotline: e.target.value })}
                placeholder="0928015280"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Số Hotline hiển thị trên giao diện
              </label>
              <input
                type="text"
                value={contactData.hotline_display}
                onChange={(e) =>
                  setContactData({ ...contactData, hotline_display: e.target.value })
                }
                placeholder="0928.015.280"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Số điện thoại Zalo hoặc Link Zalo
              </label>
              <input
                type="text"
                value={contactData.zalo}
                onChange={(e) => setContactData({ ...contactData, zalo: e.target.value })}
                placeholder="0905876231 hoặc https://zalo.me/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Link Telegram hỗ trợ
              </label>
              <input
                type="text"
                value={contactData.telegram}
                onChange={(e) => setContactData({ ...contactData, telegram: e.target.value })}
                placeholder="https://t.me/maigo79_vn"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Email liên hệ hỗ trợ
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="contact@maigo79.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Địa chỉ văn phòng / Sảnh đón Sân bay Cam Ranh
              </label>
              <input
                type="text"
                value={contactData.address}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VEHICLES & FLEET IMAGES */}
      {/* ========================================================================= */}
      {activeTab === "vehicles" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Đội Xe & Hình Ảnh Xe Đưa Đón (5 chỗ, 7 chỗ, 16 chỗ)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Thay đổi hình ảnh xe, tên dòng xe, số ghế ngồi, số vali và các tiện nghi đi kèm
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("vehicles_fleet", vehiclesData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Thông Tin Đội Xe"}</span>
            </button>
          </div>

          <div className="space-y-6">
            {vehiclesData.map((v: VehicleItem, index: number) => (
              <div
                key={v.id || index}
                className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-black">
                    Xe {v.type} Chỗ
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Giá từ: <span className="text-orange-600 font-extrabold">{v.price}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image Upload for vehicle */}
                  <div>
                    <ImageUploadField
                      label={`Hình ảnh xe ${v.type} chỗ`}
                      value={v.image}
                      onChange={(url) => {
                        const updated = [...vehiclesData];
                        updated[index].image = url;
                        setVehiclesData(updated);
                      }}
                      folder="inhatrang/vehicles"
                      placeholder={`/images/${v.type}1.png`}
                      helperText="Ảnh hiển thị trên trang danh sách loại xe và form chọn xe"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tên hiển thị
                        </label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...vehiclesData];
                            updated[index].name = e.target.value;
                            setVehiclesData(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Các dòng xe đại diện
                        </label>
                        <input
                          type="text"
                          value={v.models}
                          onChange={(e) => {
                            const updated = [...vehiclesData];
                            updated[index].models = e.target.value;
                            setVehiclesData(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Số lượng hành khách
                        </label>
                        <input
                          type="text"
                          value={v.seats}
                          onChange={(e) => {
                            const updated = [...vehiclesData];
                            updated[index].seats = e.target.value;
                            setVehiclesData(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sức chứa hành lý
                        </label>
                        <input
                          type="text"
                          value={v.luggage}
                          onChange={(e) => {
                            const updated = [...vehiclesData];
                            updated[index].luggage = e.target.value;
                            setVehiclesData(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Giá khởi điểm hiển thị
                        </label>
                        <input
                          type="text"
                          value={v.price}
                          onChange={(e) => {
                            const updated = [...vehiclesData];
                            updated[index].price = e.target.value;
                            setVehiclesData(updated);
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-bold text-orange-600 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TESTIMONIALS */}
      {/* ========================================================================= */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Đánh Giá Khách Hàng (Testimonials) ({testimonialsData.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Quản lý phản hồi, avatar, tên khách hàng và lời nhận xét hiển thị trang chủ
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setTestimonialsData([
                    ...testimonialsData,
                    {
                      name: "Khách hàng mới",
                      role: "Khách du lịch Nha Trang",
                      avatar: "/images/Hero1.jpg",
                      stars: 5,
                      route: "Sân bay Cam Ranh → TP. Nha Trang",
                      comment: "Dịch vụ đón đúng giờ, tài xế lịch sự, xe sạch sẽ!",
                    },
                  ])
                }
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Đánh Giá</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("testimonials", testimonialsData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Đánh Giá"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonialsData.map((item: TestimonialItem, idx: number) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-4 relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    const filtered = testimonialsData.filter((_: TestimonialItem, i: number) => i !== idx);
                    setTestimonialsData(filtered);
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Xóa đánh giá này"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...testimonialsData];
                        updated[idx].name = e.target.value;
                        setTestimonialsData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Chức danh / Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => {
                        const updated = [...testimonialsData];
                        updated[idx].role = e.target.value;
                        setTestimonialsData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Chặng đường đã đi
                    </label>
                    <input
                      type="text"
                      value={item.route}
                      onChange={(e) => {
                        const updated = [...testimonialsData];
                        updated[idx].route = e.target.value;
                        setTestimonialsData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Số sao (1 - 5 ⭐)
                    </label>
                    <select
                      value={item.stars || 5}
                      onChange={(e) => {
                        const updated = [...testimonialsData];
                        updated[idx].stars = Number(e.target.value);
                        setTestimonialsData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-amber-600 outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Xuất sắc)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 sao - Tốt)</option>
                      <option value={3}>⭐⭐⭐ (3 sao - Trung bình)</option>
                    </select>
                  </div>
                </div>

                <ImageUploadField
                  label="Avatar khách hàng"
                  value={item.avatar}
                  onChange={(url) => {
                    const updated = [...testimonialsData];
                    updated[idx].avatar = url;
                    setTestimonialsData(updated);
                  }}
                  folder="inhatrang/testimonials"
                  placeholder="/images/Hero1.jpg"
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Lời nhận xét của khách
                  </label>
                  <textarea
                    rows={3}
                    value={item.comment}
                    onChange={(e) => {
                      const updated = [...testimonialsData];
                      updated[idx].comment = e.target.value;
                      setTestimonialsData(updated);
                    }}
                    className="w-full p-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FAQ (CÂU HỎI THƯỜNG GẶP) */}
      {/* ========================================================================= */}
      {activeTab === "faq" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Câu Hỏi Thường Gặp (FAQ) ({selectedLang.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tối ưu SEO FAQPage Schema.org và giải đáp thắc mắc cho hành khách
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFaqData([
                    ...faqData,
                    {
                      q: { [selectedLang]: "Câu hỏi mới?" },
                      a: { [selectedLang]: "Câu trả lời chi tiết..." },
                    },
                  ])
                }
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Câu Hỏi</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("faq_list", faqData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Danh Sách FAQ"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {faqData.map((item: FAQItem, idx: number) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-3 relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    const filtered = faqData.filter((_: FAQItem, i: number) => i !== idx);
                    setFaqData(filtered);
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={16} />
                </button>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Câu hỏi #{idx + 1} ({selectedLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={item.q?.[selectedLang] || ""}
                    onChange={(e) => {
                      const updated = [...faqData];
                      updated[idx].q = {
                        ...updated[idx].q,
                        [selectedLang]: e.target.value,
                      };
                      setFaqData(updated);
                    }}
                    placeholder="Nhập câu hỏi..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Câu trả lời ({selectedLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={item.a?.[selectedLang] || ""}
                    onChange={(e) => {
                      const updated = [...faqData];
                      updated[idx].a = {
                        ...updated[idx].a,
                        [selectedLang]: e.target.value,
                      };
                      setFaqData(updated);
                    }}
                    placeholder="Nhập câu trả lời..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600 leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CLOUDINARY CONFIG */}
      {/* ========================================================================= */}
      {activeTab === "cloudinary" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Cloud className="text-blue-600" size={22} />
                <span>Cấu Hình Lưu Trữ Ảnh Đám Mây Cloudinary</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Kết nối tài khoản Cloudinary để toàn bộ ảnh tải lên tự động lưu trữ vĩnh viễn và tối ưu tốc độ CDN toàn cầu
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("cloudinary_config", cloudinaryConfig)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Cloudinary"}</span>
            </button>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium space-y-2">
            <p className="font-extrabold flex items-center gap-1.5 text-blue-700">
              <span>💡 Cách lấy thông tin Cloudinary (Miễn phí 100%):</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>
                Đăng ký tài khoản miễn phí tại{" "}
                <a
                  href="https://cloudinary.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-bold underline inline-flex items-center gap-0.5"
                >
                  cloudinary.com <ExternalLink size={12} />
                </a>
              </li>
              <li>Tại Dashboard chính, bạn sẽ thấy <b>Cloud Name</b>, <b>API Key</b> và <b>API Secret</b>.</li>
              <li>Dán các thông số vào 3 ô bên dưới và nhấn <b>Lưu Cấu Hình</b>.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Cloud Name *
              </label>
              <input
                type="text"
                value={cloudinaryConfig.cloud_name || ""}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, cloud_name: e.target.value })
                }
                placeholder="ví dụ: maigo79 hoặc dx9xyz..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Upload Preset (Tùy chọn - Unsigned)
              </label>
              <input
                type="text"
                value={cloudinaryConfig.upload_preset || ""}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, upload_preset: e.target.value })
                }
                placeholder="ví dụ: ml_default hoặc maigo79_preset"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                value={cloudinaryConfig.api_key || ""}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, api_key: e.target.value })
                }
                placeholder="ví dụ: 123456789012345"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                API Secret
              </label>
              <input
                type="password"
                value={cloudinaryConfig.api_secret || ""}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, api_secret: e.target.value })
                }
                placeholder="••••••••••••••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RAW JSON (ADVANCED) */}
      {/* ========================================================================= */}
      {activeTab === "raw_json" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Quản Trị Nâng Cao - Dữ Liệu Thô (Raw JSON Database)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Chỉnh sửa trực tiếp cấu trúc JSON của từng khóa dữ liệu trong bảng <code>site_content</code>
            </p>
          </div>

          <div className="space-y-4">
            {content.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-blue-600">
                    {item.content_key}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const el = document.getElementById(`textarea-${item.id}`) as HTMLTextAreaElement;
                        if (el) {
                          const parsed = JSON.parse(el.value);
                          await onSaveContent(item.id, { value: parsed });
                          alert("Đã lưu thành công khóa: " + item.content_key);
                        }
                      } catch (e: unknown) {
                        const msg = e instanceof Error ? e.message : "Lỗi không xác định";
                        alert("Lỗi cú pháp JSON: " + msg);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold cursor-pointer"
                  >
                    <Save size={12} />
                    <span>Lưu</span>
                  </button>
                </div>
                <textarea
                  id={`textarea-${item.id}`}
                  rows={6}
                  defaultValue={JSON.stringify(item.value, null, 2)}
                  className="w-full p-3 bg-white font-mono text-xs text-slate-800 rounded-md border border-slate-300 outline-none focus:border-blue-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
