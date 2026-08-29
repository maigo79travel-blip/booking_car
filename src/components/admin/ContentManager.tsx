"use client";

import React, { useState, useEffect } from "react";
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
  Send,
  Bell,
  Loader2,
  Compass,
  Search,
  Table,
} from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";
import { VehicleCategory, Vehicle } from "@/context/SiteContentContext";
import {
  FeaturedVehicle,
  TravelDestination,
  PriceTableConfig,
  PriceTableRow,
  defaultFeaturedVehicles,
  defaultDestinations,
} from "@/context/SiteContentContext";

export interface SiteContentRow {
  id: string;
  content_key: string;
  content_type?: string;
  value: unknown;
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
  | "price_table"
  | "featured_vehicles"
  | "destinations"
  | "vehicles"
  | "testimonials"
  | "faq"
  | "seo"
  | "translations"
  | "pages"
  | "cloudinary"
  | "telegram"
  | "raw_json";

export default function ContentManager({
  content,
  onSaveContent,
}: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<CMSTab>("hero");
  const [selectedLang, setSelectedLang] = useState<Language>("vi");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as CMSTab;
      if (
        tabParam &&
        [
          "hero",
          "brand",
          "price_table",
          "featured_vehicles",
          "destinations",
          "vehicles",
          "testimonials",
          "faq",
          "seo",
          "translations",
          "pages",
          "cloudinary",
          "telegram",
          "raw_json",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tab: CMSTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

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
      bg_image: (raw.bg_image as string) || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
      pricing_bg_image: (raw.pricing_bg_image as string) || "",
      banners: (raw.banners as string[]) || [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
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
      hotline: (raw.hotline as string) || "0878458885",
      hotline_display: (raw.hotline_display as string) || "0878.458.885",
      zalo: (raw.zalo as string) || "0878458885",
      whatsapp: (raw.whatsapp as string) || "0878458885",
      kakaotalk: (raw.kakaotalk as string) || "0878458885",
      facebook:
        (raw.facebook as string) ||
        "https://www.facebook.com/share/1BhL4Qut3u/?mibextid=wwXIfr",
      telegram: (raw.telegram as string) || "https://t.me/maigo79_vn",
      email: (raw.email as string) || "contact@maigo79.com",
      address: (raw.address as string) || "",
      logo_url: (raw.logo_url as string) || "/images/logo-maigo79.png",
      working_hours: (raw.working_hours as string) || "24/7 (Phục vụ cả ngày lễ & Tết)",
    };
  });

  const [priceTableData, setPriceTableData] = useState<PriceTableConfig>(() => {
    const raw = getContent("price_table", {});
    return {
      title: (raw.title as string) || "BẢNG GIÁ XE SÂN BAY CAM RANH – NHA TRANG",
      rows:
        Array.isArray(raw.rows) && raw.rows.length > 0
          ? (raw.rows as PriceTableRow[])
          : [
              {
                id: "5-seater",
                carType: "Xe 5 Chỗ",
                oneWayAirportToCity: "Từ 250.000đ",
                oneWayCityToAirport: "Từ 250.000đ",
                roundTrip: "Từ 480.000đ",
              },
              {
                id: "7-seater",
                carType: "Xe 7 Chỗ",
                oneWayAirportToCity: "Từ 300.000đ",
                oneWayCityToAirport: "Từ 300.000đ",
                roundTrip: "Từ 580.000đ",
              },
              {
                id: "16-seater",
                carType: "Xe 16 Chỗ",
                oneWayAirportToCity: "Từ 550.000đ",
                oneWayCityToAirport: "Từ 550.000đ",
                roundTrip: "Từ 1.050.000đ",
              },
            ],
      note1:
        (raw.note1 as string) ||
        "Giá TRỌN GÓI 100%, đã BAO GỒM vé vào sân bay Cam Ranh và cầu đường.",
      note2:
        (raw.note2 as string) ||
        "Giá cước tour du lịch Đà Lạt, Mũi Né, Ninh Thuận: Cam kết rẻ hơn 20% – 40% so với taxi truyền thống.",
    };
  });

  const [vehicleCategoriesData, setVehicleCategoriesData] = useState<VehicleCategory[]>(() => {
    return getContentArray<VehicleCategory>("vehicle_categories", []);
  });

  const [featuredVehiclesData, setFeaturedVehiclesData] = useState<FeaturedVehicle[]>(() => {
    const raw = getContentArray<FeaturedVehicle>("featured_vehicles", []);
    return raw && raw.length > 0 ? raw : defaultFeaturedVehicles;
  });

  const [destinationsData, setDestinationsData] = useState<TravelDestination[]>(() => {
    const raw = getContentArray<TravelDestination>("nha_trang_destinations", []);
    return raw && raw.length > 0 ? raw : defaultDestinations;
  });

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

  const [telegramConfig, setTelegramConfig] = useState(() => {
    const raw = getContent("telegram_config", {});
    return {
      is_enabled: raw.is_enabled !== undefined ? Boolean(raw.is_enabled) : true,
      bot_token: (raw.bot_token as string) || "",
      chat_id: (raw.chat_id as string) || "",
      topic_id: (raw.topic_id as string) || "",
    };
  });

  const [seoData, setSeoData] = useState(() => {
    const raw = getContent("site_seo", {});
    return {
      title: (raw.title as string) || "",
      description: (raw.description as string) || "",
      keywords: Array.isArray(raw.keywords) ? (raw.keywords as string[]).join(", ") : "",
      og_image: (raw.og_image as string) || "",
      site_name: (raw.site_name as string) || "",
    };
  });

  const [uiTranslationsData, setUiTranslationsData] = useState<Record<string, unknown>>(() =>
    getContent("ui_translations", {})
  );
  const [translationDraft, setTranslationDraft] = useState("");
  const [pageContentKey, setPageContentKey] = useState<"privacy_policy" | "transport_policy">("privacy_policy");
  const [pageContentDraft, setPageContentDraft] = useState("");

  useEffect(() => {
    setTranslationDraft(JSON.stringify(uiTranslationsData[selectedLang] || {}, null, 2));
  }, [selectedLang, uiTranslationsData]);

  useEffect(() => {
    const pageContent = content.find((item) => item.content_key === pageContentKey)?.value || {};
    setPageContentDraft(JSON.stringify(pageContent, null, 2));
  }, [content, pageContentKey]);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [testTelegramResult, setTestTelegramResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestTelegram = async () => {
    if (!telegramConfig.bot_token?.trim() || !telegramConfig.chat_id?.trim()) {
      alert("Vui lòng nhập Bot Token và Chat ID trước khi gửi tin nhắn thử nghiệm!");
      return;
    }
    setIsTestingTelegram(true);
    setTestTelegramResult(null);
    try {
      const res = await fetch("/api/admin/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramConfig),
      });
      const data = await res.json();
      setTestTelegramResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? "Gửi thành công!" : "Gửi thất bại!"),
      });
    } catch (err: unknown) {
      setTestTelegramResult({
        success: false,
        message: err instanceof Error ? err.message : "Lỗi kết nối",
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Visual CMS System</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Quản Trị Nội Dung & Hình Ảnh Website
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-normal mt-1">
            Chỉnh sửa toàn bộ thông tin hiển thị, logo, hotline, banner và hình ảnh xe trực tiếp trên giao diện
          </p>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg">
          <Globe size={16} className="text-slate-500 ml-2" />
          <span className="text-xs font-semibold text-slate-700 mr-1">Ngôn ngữ soạn thảo:</span>
          <div className="flex gap-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold scrollbar-none">
        {[
          { id: "hero", label: "Hero & Banner", icon: Sparkles },
          { id: "brand", label: "Thương hiệu & Hotline", icon: Phone },
          { id: "price_table", label: "Bảng giá xe sân bay (Trang chủ)", icon: Table },
          { id: "featured_vehicles", label: "Xe nổi bật (Trang chủ)", icon: Car },
          { id: "destinations", label: "Địa điểm du lịch Nha Trang", icon: Compass },
          { id: "vehicles", label: "Đội xe & Phân khúc (/loai-xe)", icon: Globe },
          { id: "testimonials", label: "Đánh giá khách hàng", icon: MessageSquare },
          { id: "faq", label: "Câu hỏi thường gặp FAQ", icon: HelpCircle },
          { id: "seo", label: "SEO toàn website", icon: Search },
          { id: "translations", label: "Nhãn giao diện 5 ngôn ngữ", icon: Globe },
          { id: "pages", label: "Nội dung chính sách", icon: Code },
          { id: "cloudinary", label: "Cấu hình Cloudinary", icon: Cloud },
          { id: "telegram", label: "Thông báo Telegram", icon: Send },
          { id: "raw_json", label: "Dữ liệu thô (Raw JSON)", icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id as CMSTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-semibold ${
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
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
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
              <h2 className="text-lg font-bold text-slate-900">
                Khối Hero Section & Banner Trình Chiếu ({selectedLang.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Khối tiêu đề chính và 3 hình ảnh banner chạy slide tự động ở trang chủ
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("hero_section", heroData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Khối Hero"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Title 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Title 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-orange-600 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Hero Main Background Image */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>🌄 Ảnh Nền Lớn Hero Section (Phía Sau Form Đặt Xe)</span>
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Ảnh nền chất lượng cao hiển thị mờ đằng sau form đặt xe và khu vực đầu trang chủ
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <ImageUploadField
                  label="Ảnh Nền Lớn Hero"
                  value={heroData.bg_image || ""}
                  onChange={(url) => setHeroData({ ...heroData, bg_image: url })}
                  folder="inhatrang/hero"
                  placeholder="https://images.unsplash.com/... hoặc link ảnh nền mới"
                  helperText="Ảnh hiển thị full màn hình phía sau toàn bộ khung đặt xe"
                />
              </div>
            </div>

            {/* 3 Banner Carousel Images */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>🖼️ 3 Hình Ảnh Slide Trình Chiếu (Carousel Bên Phải)</span>
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Ba ảnh chạy tự động luân phiên ở khung trình chiếu bên cạnh form đặt xe
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <ImageUploadField
                      label={`Slide Banner ${idx + 1}`}
                      value={heroData.banners[idx] || ""}
                      onChange={(url) => {
                        const newBanners = [...heroData.banners];
                        newBanners[idx] = url;
                        setHeroData({ ...heroData, banners: newBanners });
                      }}
                      folder="inhatrang/banners"
                      placeholder={`Slide ${idx + 1}`}
                      helperText={`Ảnh hiển thị ở vị trí slide thứ ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Table Background Image */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>📊 Ảnh Nền Khối Bảng Giá (Tùy Chọn)</span>
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Ảnh nền hiển thị đằng sau bảng giá niêm yết (để trống nếu muốn dùng nền gradient tối giản thanh lịch)
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <ImageUploadField
                  label="Ảnh Nền Bảng Giá"
                  value={heroData.pricing_bg_image || ""}
                  onChange={(url) => setHeroData({ ...heroData, pricing_bg_image: url })}
                  folder="inhatrang/pricing"
                  placeholder="Để trống nếu muốn dùng màu nền gradient sang trọng"
                  helperText="Ảnh nền phía sau bảng giá xe 5, 7, 16 chỗ"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* TAB 2: BRAND & CONTACT */}
      {/* ========================================================================= */}
      {activeTab === "brand" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Thương Hiệu, Hotline & Thông Tin Liên Hệ Toàn Website
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Cấu hình logo, số điện thoại hotline, zalo, email và địa chỉ đón trả
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("contact_info", contactData)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Thông Tin Liên Hệ"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="max-w-xs sm:max-w-sm">
                <ImageUploadField
                  label="Logo Thương Hiệu (Header & Footer)"
                  value={contactData.logo_url}
                  onChange={(url) => setContactData({ ...contactData, logo_url: url })}
                  folder="inhatrang/branding"
                  imageHeight="h-20 sm:h-24"
                  helperText="Ảnh logo hiển thị trên thanh điều hướng đầu trang và chân trang website"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Tên thương hiệu (Brand Name)
              </label>
              <input
                type="text"
                value={contactData.brand_name}
                onChange={(e) => setContactData({ ...contactData, brand_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Số Hotline (Quay số trực tiếp khi bấm gọi)
              </label>
              <input
                type="text"
                value={contactData.hotline}
                onChange={(e) => setContactData({ ...contactData, hotline: e.target.value })}
                placeholder="0878458885"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Số Hotline hiển thị trên giao diện
              </label>
              <input
                type="text"
                value={contactData.hotline_display}
                onChange={(e) =>
                  setContactData({ ...contactData, hotline_display: e.target.value })
                }
                placeholder="0878.458.885"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Số điện thoại Zalo hoặc Link Zalo
              </label>
              <input
                type="text"
                value={contactData.zalo}
                onChange={(e) => setContactData({ ...contactData, zalo: e.target.value })}
                placeholder="0878458885 hoặc https://zalo.me/0878458885"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Số điện thoại WhatsApp
              </label>
              <input
                type="text"
                value={contactData.whatsapp}
                onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                placeholder="0878458885 hoặc +84878458885"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Số / ID KakaoTalk
              </label>
              <input
                type="text"
                value={contactData.kakaotalk}
                onChange={(e) => setContactData({ ...contactData, kakaotalk: e.target.value })}
                placeholder="0878458885"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Link Facebook / Messenger
              </label>
              <input
                type="text"
                value={contactData.facebook}
                onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                placeholder="https://www.facebook.com/share/1BhL4Qut3u/?mibextid=wwXIfr"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Link Telegram hỗ trợ
              </label>
              <input
                type="text"
                value={contactData.telegram}
                onChange={(e) => setContactData({ ...contactData, telegram: e.target.value })}
                placeholder="https://t.me/maigo79_vn"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Email liên hệ hỗ trợ
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                placeholder="contact@maigo79.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Địa chỉ văn phòng / Sảnh đón Sân bay Cam Ranh
              </label>
              <input
                type="text"
                value={contactData.address}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: PRICE TABLE (BẢNG GIÁ XE SÂN BAY TRANG CHỦ & TRANG /BANG-GIA) */}
      {/* ========================================================================= */}
      {activeTab === "price_table" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Table size={20} className="text-blue-600" />
                Bảng Giá Xe Sân Bay Cam Ranh – Nha Trang
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Chỉnh sửa giá vé, các tuyến chiều đón tiễn sân bay và ghi chú hiển thị ở Bảng giá trang chủ và trang /bang-gia
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveSection("price_table", priceTableData)}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Lưu Bảng Giá</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Tiêu đề chính của bảng giá
              </label>
              <input
                type="text"
                value={priceTableData.title || ""}
                onChange={(e) =>
                  setPriceTableData({ ...priceTableData, title: e.target.value })
                }
                placeholder="BẢNG GIÁ XE SÂN BAY CAM RANH – NHA TRANG"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Danh Sách Các Loại Xe & Mức Giá Cước
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newRow: PriceTableRow = {
                      id: `car-${Date.now()}`,
                      carType: "Xe Mới",
                      oneWayAirportToCity: "Từ 250.000đ",
                      oneWayCityToAirport: "Từ 250.000đ",
                      roundTrip: "Từ 480.000đ",
                    };
                    setPriceTableData({
                      ...priceTableData,
                      rows: [...priceTableData.rows, newRow],
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Thêm Hàng Mới</span>
                </button>
              </div>

              <div className="p-4 space-y-4">
                {priceTableData.rows.map((row, idx) => (
                  <div
                    key={row.id || idx}
                    className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <span className="text-xs font-bold text-blue-900">
                        Hàng #{idx + 1}: {row.carType}
                      </span>
                      {priceTableData.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newRows = priceTableData.rows.filter((_, i) => i !== idx);
                            setPriceTableData({ ...priceTableData, rows: newRows });
                          }}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition-colors"
                          title="Xóa hàng này"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Tên loại xe (Cột 1)
                        </label>
                        <input
                          type="text"
                          value={row.carType}
                          onChange={(e) => {
                            const newRows = [...priceTableData.rows];
                            newRows[idx].carType = e.target.value;
                            setPriceTableData({ ...priceTableData, rows: newRows });
                          }}
                          placeholder="Ví dụ: Xe 5 Chỗ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Cam Ranh ➔ Nha Trang (Cột 2)
                        </label>
                        <input
                          type="text"
                          value={row.oneWayAirportToCity}
                          onChange={(e) => {
                            const newRows = [...priceTableData.rows];
                            newRows[idx].oneWayAirportToCity = e.target.value;
                            setPriceTableData({ ...priceTableData, rows: newRows });
                          }}
                          placeholder="Ví dụ: Từ 250.000đ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-blue-700 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Nha Trang ➔ Cam Ranh (Cột 3)
                        </label>
                        <input
                          type="text"
                          value={row.oneWayCityToAirport}
                          onChange={(e) => {
                            const newRows = [...priceTableData.rows];
                            newRows[idx].oneWayCityToAirport = e.target.value;
                            setPriceTableData({ ...priceTableData, rows: newRows });
                          }}
                          placeholder="Ví dụ: Từ 250.000đ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-blue-700 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Xe Đi 2 Chiều (Cột 4)
                        </label>
                        <input
                          type="text"
                          value={row.roundTrip}
                          onChange={(e) => {
                            const newRows = [...priceTableData.rows];
                            newRows[idx].roundTrip = e.target.value;
                            setPriceTableData({ ...priceTableData, rows: newRows });
                          }}
                          placeholder="Ví dụ: Từ 480.000đ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-blue-700 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Ghi chú 1 dưới bảng giá
                </label>
                <input
                  type="text"
                  value={priceTableData.note1 || ""}
                  onChange={(e) =>
                    setPriceTableData({ ...priceTableData, note1: e.target.value })
                  }
                  placeholder="Giá TRỌN GÓI 100%, đã BAO GỒM vé vào sân bay..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Ghi chú 2 dưới bảng giá
                </label>
                <input
                  type="text"
                  value={priceTableData.note2 || ""}
                  onChange={(e) =>
                    setPriceTableData({ ...priceTableData, note2: e.target.value })
                  }
                  placeholder="Giá cước tour du lịch Đà Lạt, Mũi Né..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: FEATURED VEHICLES (Trang Chủ) */}
      {/* ========================================================================= */}
      {activeTab === "featured_vehicles" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Car size={20} className="text-blue-600" />
                Các Loại Xe Nổi Bật (Hiển Thị Ở Trang Chủ)
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Quản lý danh sách các dòng xe hot trưng bày tại khối &quot;Đội Xe Phục Vụ Cao Cấp&quot; ở trang chủ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newCar: FeaturedVehicle = {
                    id: `v-${Date.now()}`,
                    name: "Dòng Xe Mới 2026",
                    seats: "7 chỗ (Tối đa 6 khách)",
                    type: "SUV 7 chỗ cao cấp",
                    image: "/images/71.png",
                    price: "Từ 350.000đ",
                    tag: "Mới nhất",
                    features: ["Nội thất sạch sẽ, êm ái", "Cốp rộng chứa đồ", "Nước suối & khăn lạnh"],
                  };
                  setFeaturedVehiclesData([...featuredVehiclesData, newCar]);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Xe Nổi Bật</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("featured_vehicles", featuredVehiclesData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Danh Sách Xe Nổi Bật"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {featuredVehiclesData.map((v, idx) => (
              <div
                key={v.id || idx}
                className="p-5 md:p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-xs space-y-4"
              >
                {/* Header of each car card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-xs font-bold shadow-2xs">
                      Xe #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {v.name || "Mẫu xe chưa đặt tên"}
                    </span>
                    {v.tag && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[11px] font-semibold">
                        {v.tag}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const confirm = window.confirm(`Bạn có chắc muốn xóa xe "${v.name}"?`);
                      if (!confirm) return;
                      setFeaturedVehiclesData(featuredVehiclesData.filter((_, i) => i !== idx));
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors cursor-pointer"
                    title="Xóa xe này"
                  >
                    <Trash2 size={14} />
                    <span>Xóa xe</span>
                  </button>
                </div>

                {/* Body: Left Image (4 cols) | Right Info (8 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-4">
                    <ImageUploadField
                      label="Hình ảnh xe"
                      value={v.image}
                      onChange={(url) => {
                        const updated = [...featuredVehiclesData];
                        updated[idx].image = url;
                        setFeaturedVehiclesData(updated);
                      }}
                      folder="inhatrang/featured-vehicles"
                      placeholder="/images/51.png"
                      helperText="Ảnh xe nền trắng hoặc ảnh xe thật hiển thị tại trang chủ"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tên dòng xe
                        </label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...featuredVehiclesData];
                            updated[idx].name = e.target.value;
                            setFeaturedVehiclesData(updated);
                          }}
                          placeholder="Ví dụ: Honda City / Toyota Vios"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Huy hiệu nổi bật (Tag)
                        </label>
                        <input
                          type="text"
                          value={v.tag || ""}
                          onChange={(e) => {
                            const updated = [...featuredVehiclesData];
                            updated[idx].tag = e.target.value;
                            setFeaturedVehiclesData(updated);
                          }}
                          placeholder="Ví dụ: Phổ biến nhất / VIP"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phân khúc / Loại xe
                        </label>
                        <input
                          type="text"
                          value={v.type}
                          onChange={(e) => {
                            const updated = [...featuredVehiclesData];
                            updated[idx].type = e.target.value;
                            setFeaturedVehiclesData(updated);
                          }}
                          placeholder="Sedan 5 chỗ đời mới"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Số chỗ & Khách hàng
                        </label>
                        <input
                          type="text"
                          value={v.seats}
                          onChange={(e) => {
                            const updated = [...featuredVehiclesData];
                            updated[idx].seats = e.target.value;
                            setFeaturedVehiclesData(updated);
                          }}
                          placeholder="5 chỗ (Tối đa 4 khách)"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Giá cước hiển thị
                        </label>
                        <input
                          type="text"
                          value={v.price}
                          onChange={(e) => {
                            const updated = [...featuredVehiclesData];
                            updated[idx].price = e.target.value;
                            setFeaturedVehiclesData(updated);
                          }}
                          placeholder="Từ 250.000đ"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-bold text-emerald-700 outline-none focus:border-blue-600"
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
      {/* TAB: DESTINATIONS (Địa Điểm Du Lịch Nha Trang) */}
      {/* ========================================================================= */}
      {activeTab === "destinations" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass size={20} className="text-blue-600" />
                Địa Điểm Du Lịch Nha Trang (Dạng Lưới Trang Chủ)
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Đăng ảnh, tiêu đề, khoảng cách và mô tả các danh thắng du lịch nổi tiếng ở Nha Trang – Cam Ranh
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newDest: TravelDestination = {
                    id: `dest-${Date.now()}`,
                    title: "Địa Điểm Du Lịch Mới",
                    subtitle: "Danh lam thắng cảnh nổi tiếng",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    distance: "Cách trung tâm ~10km",
                    description: "Mô tả ngắn gọn vẻ đẹp và các trải nghiệm thú vị tại điểm du lịch này.",
                    tag: "Khám phá",
                  };
                  setDestinationsData([...destinationsData, newDest]);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Địa Điểm Du Lịch</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("nha_trang_destinations", destinationsData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Danh Sách Địa Điểm"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationsData.map((dest, idx) => (
              <div
                key={dest.id || idx}
                className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Destination Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-md text-xs font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate max-w-42.5" title={dest.title}>
                        {dest.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const confirm = window.confirm(`Bạn có chắc muốn xóa địa điểm "${dest.title}"?`);
                        if (!confirm) return;
                        setDestinationsData(destinationsData.filter((_, i) => i !== idx));
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Xóa địa điểm này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Destination Image Upload */}
                  <div>
                    <ImageUploadField
                      label="Hình ảnh địa điểm du lịch"
                      value={dest.image}
                      onChange={(url) => {
                        const updated = [...destinationsData];
                        updated[idx].image = url;
                        setDestinationsData(updated);
                      }}
                      folder="inhatrang/destinations"
                      placeholder="https://images.unsplash.com/..."
                      helperText="Ảnh hiển thị dạng lưới ngoài trang chủ"
                    />
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tên địa điểm
                      </label>
                      <input
                        type="text"
                        value={dest.title}
                        onChange={(e) => {
                          const updated = [...destinationsData];
                          updated[idx].title = e.target.value;
                          setDestinationsData(updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Loại hình / Tag
                      </label>
                      <input
                        type="text"
                        value={dest.tag || ""}
                        onChange={(e) => {
                          const updated = [...destinationsData];
                          updated[idx].tag = e.target.value;
                          setDestinationsData(updated);
                        }}
                        placeholder="Biển đảo / Văn hóa"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phụ đề / Điểm nhấn
                      </label>
                      <input
                        type="text"
                        value={dest.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...destinationsData];
                          updated[idx].subtitle = e.target.value;
                          setDestinationsData(updated);
                        }}
                        placeholder="Thiên đường vui chơi..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Khoảng cách di chuyển
                      </label>
                      <input
                        type="text"
                        value={dest.distance || ""}
                        onChange={(e) => {
                          const updated = [...destinationsData];
                          updated[idx].distance = e.target.value;
                          setDestinationsData(updated);
                        }}
                        placeholder="Cách trung tâm ~5km"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mô tả ngắn gọn
                    </label>
                    <textarea
                      rows={2}
                      value={dest.description}
                      onChange={(e) => {
                        const updated = [...destinationsData];
                        updated[idx].description = e.target.value;
                        setDestinationsData(updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VEHICLES & FLEET IMAGES */}
      {/* ========================================================================= */}
      {activeTab === "vehicles" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Car size={20} className="text-blue-600" />
                Quản Lý Đội Xe & Toàn Bộ Hình Ảnh Mẫu Xe (5, 7, 16 Chỗ...)
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Thêm, sửa tên, thay đổi / tải lên hình ảnh từng mẫu xe (Honda City, Mazda 3, VF6, Fortuner, Xpander, Solati...)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newCategory: VehicleCategory = {
                    title: "PHÂN KHÚC XE MỚI",
                    seats: "",
                    luggage: "",
                    maxPassengers: "",
                    maxLuggage: "",
                    features: [],
                    vehicles: [],
                  };
                  setVehicleCategoriesData([...vehicleCategoriesData, newCategory]);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Phân Khúc Xe</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("vehicle_categories", vehicleCategoriesData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Save size={15} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Toàn Bộ Ảnh & Đội Xe"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {vehicleCategoriesData.map((cat: VehicleCategory, catIdx: number) => (
              <div
                key={catIdx}
                className="p-5 md:p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-xs space-y-6"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-lg text-sm font-bold shadow-xs">
                      {cat.title}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      ({cat.vehicles.length} mẫu xe hiển thị)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newVehicle: Vehicle = {
                          id: Date.now(),
                          name: "",
                          image: "",
                          category: "",
                        };
                        const updatedCats = [...vehicleCategoriesData];
                        updatedCats[catIdx].vehicles.push(newVehicle);
                        setVehicleCategoriesData(updatedCats);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-blue-200"
                    >
                      <Plus size={13} />
                      <span>Thêm Xe Vào {cat.title}</span>
                    </button>

                    {vehicleCategoriesData.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const confirm = window.confirm(`Bạn có chắc muốn xóa toàn bộ phân khúc "${cat.title}"?`);
                          if (!confirm) return;
                          const updatedCats = vehicleCategoriesData.filter((_, idx) => idx !== catIdx);
                          setVehicleCategoriesData(updatedCats);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Xóa phân khúc này"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Specs Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên phân khúc
                    </label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => {
                        const updated = [...vehicleCategoriesData];
                        updated[catIdx].title = e.target.value;
                        setVehicleCategoriesData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số lượng hành khách tối đa
                    </label>
                    <input
                      type="text"
                      value={cat.maxPassengers}
                      onChange={(e) => {
                        const updated = [...vehicleCategoriesData];
                        updated[catIdx].maxPassengers = e.target.value;
                        setVehicleCategoriesData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      placeholder="Tối đa 4 khách hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quy chuẩn hành lý
                    </label>
                    <input
                      type="text"
                      value={cat.seats || cat.luggage}
                      onChange={(e) => {
                        const updated = [...vehicleCategoriesData];
                        updated[catIdx].seats = e.target.value;
                        updated[catIdx].luggage = e.target.value;
                        setVehicleCategoriesData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                      placeholder="2 hàng lý trình + 1 hàng xách"
                    />
                  </div>
                </div>

                {/* Grid of Car Models in this Category */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Danh Sách Mẫu Xe & Hình Ảnh ({cat.title}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {cat.vehicles.map((car: Vehicle, carIdx: number) => (
                      <div
                        key={car.id || carIdx}
                        className="bg-white p-3 border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between relative group"
                      >
                        {/* Delete single car button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedCats = [...vehicleCategoriesData];
                            updatedCats[catIdx].vehicles = updatedCats[catIdx].vehicles.filter(
                              (_, idx) => idx !== carIdx
                            );
                            setVehicleCategoriesData(updatedCats);
                          }}
                          className="absolute top-1.5 right-1.5 z-10 p-1 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa mẫu xe này"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="space-y-2.5">
                          {/* Image upload preview */}
                          <ImageUploadField
                            label=""
                            value={car.image}
                            onChange={(url) => {
                              const updatedCats = [...vehicleCategoriesData];
                              updatedCats[catIdx].vehicles[carIdx].image = url;
                              setVehicleCategoriesData(updatedCats);
                            }}
                            folder="inhatrang/vehicles"
                            helperText=""
                          />

                          {/* Car Name */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Tên dòng xe:
                            </label>
                            <input
                              type="text"
                              value={car.name}
                              onChange={(e) => {
                                const updatedCats = [...vehicleCategoriesData];
                                updatedCats[catIdx].vehicles[carIdx].name = e.target.value.toUpperCase();
                                setVehicleCategoriesData(updatedCats);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                              placeholder="Ví dụ: HONDA CITY"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
              <h2 className="text-lg font-bold text-slate-900">
                Đánh Giá Khách Hàng (Testimonials) ({testimonialsData.length})
              </h2>
              <p className="text-xs text-slate-500 font-normal">
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
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
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
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
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
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
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
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số sao (1 - 5 ⭐)
                    </label>
                    <select
                      value={item.stars || 5}
                      onChange={(e) => {
                        const updated = [...testimonialsData];
                        updated[idx].stars = Number(e.target.value);
                        setTestimonialsData(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-amber-600 outline-none"
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
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
              <h2 className="text-lg font-bold text-slate-900">
                Câu Hỏi Thường Gặp (FAQ) ({selectedLang.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 font-normal">
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Thêm Câu Hỏi</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveSection("faq_list", faqData)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
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
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
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
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
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
      {/* TAB: GLOBAL SEO */}
      {/* ========================================================================= */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">SEO Toàn Website</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tiêu đề, mô tả, từ khóa và ảnh chia sẻ mặc định của toàn bộ website.</p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("site_seo", {
                ...seoData,
                keywords: seoData.keywords.split(",").map((item) => item.trim()).filter(Boolean),
              })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu SEO mặc định"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">Tên thương hiệu</label>
              <input value={seoData.site_name} onChange={(event) => setSeoData({ ...seoData, site_name: event.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:bg-white focus:border-blue-600" placeholder="maigo79.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">SEO title mặc định</label>
              <input value={seoData.title} onChange={(event) => setSeoData({ ...seoData, title: event.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:bg-white focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">SEO description mặc định</label>
              <textarea value={seoData.description} onChange={(event) => setSeoData({ ...seoData, description: event.target.value })} rows={4} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:bg-white focus:border-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">Từ khóa (cách nhau bằng dấu phẩy)</label>
              <textarea value={seoData.keywords} onChange={(event) => setSeoData({ ...seoData, keywords: event.target.value })} rows={3} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:bg-white focus:border-blue-600" />
            </div>
            <ImageUploadField label="Ảnh chia sẻ Facebook / Open Graph" value={seoData.og_image} onChange={(url) => setSeoData({ ...seoData, og_image: url })} folder="maigo79/seo" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: UI TRANSLATIONS */}
      {/* ========================================================================= */}
      {activeTab === "translations" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nhãn Giao Diện Đa Ngôn Ngữ</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sửa toàn bộ text hiển thị của website theo từng ngôn ngữ. Giữ nguyên cấu trúc JSON/key để các vị trí trên web tiếp tục hoạt động.</p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                try {
                  const parsed = JSON.parse(translationDraft);
                  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                    throw new Error("Nội dung phải là một đối tượng JSON");
                  }
                  const next = { ...uiTranslationsData, [selectedLang]: parsed };
                  setUiTranslationsData(next);
                  void handleSaveSection("ui_translations", next);
                } catch (error) {
                  alert(error instanceof Error ? `JSON không hợp lệ: ${error.message}` : "JSON không hợp lệ");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : `Lưu nhãn ${selectedLang.toUpperCase()}`}</span>
            </button>
          </div>
          <textarea
            value={translationDraft}
            onChange={(event) => setTranslationDraft(event.target.value)}
            rows={24}
            spellCheck={false}
            className="w-full p-4 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg text-xs font-mono leading-relaxed outline-none focus:border-blue-500"
            aria-label={`Dữ liệu nhãn giao diện ${selectedLang.toUpperCase()}`}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: LEGAL PAGES */}
      {/* ========================================================================= */}
      {activeTab === "pages" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nội Dung Trang Chính Sách</h2>
              <p className="text-xs text-slate-500 mt-0.5">Quản lý toàn bộ tiêu đề, đoạn nội dung và điều khoản hiển thị trên website.</p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                try {
                  const parsed = JSON.parse(pageContentDraft);
                  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Nội dung phải là một đối tượng JSON");
                  void handleSaveSection(pageContentKey, parsed);
                } catch (error) {
                  alert(error instanceof Error ? `JSON không hợp lệ: ${error.message}` : "JSON không hợp lệ");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu nội dung trang"}</span>
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Chọn trang</label>
            <select value={pageContentKey} onChange={(event) => setPageContentKey(event.target.value as "privacy_policy" | "transport_policy")} className="w-full sm:w-96 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm outline-none focus:bg-white focus:border-blue-600">
              <option value="privacy_policy">Chính sách bảo vệ quyền riêng tư</option>
              <option value="transport_policy">Quy định vận chuyển hành khách</option>
            </select>
          </div>
          <textarea value={pageContentDraft} onChange={(event) => setPageContentDraft(event.target.value)} rows={24} spellCheck={false} className="w-full p-4 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg text-xs font-mono leading-relaxed outline-none focus:border-blue-500" aria-label="Nội dung trang chính sách" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CLOUDINARY CONFIG */}
      {/* ========================================================================= */}
      {activeTab === "cloudinary" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="text-blue-600" size={22} />
                <span>Cấu Hình Lưu Trữ Ảnh Đám Mây Cloudinary</span>
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Kết nối tài khoản Cloudinary để toàn bộ ảnh tải lên tự động lưu trữ vĩnh viễn và tối ưu tốc độ CDN toàn cầu
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("cloudinary_config", cloudinaryConfig)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Cloudinary"}</span>
            </button>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium space-y-2">
            <p className="font-semibold flex items-center gap-1.5 text-blue-700">
              <span>💡 Cách lấy thông tin Cloudinary (Miễn phí 100%):</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>
                Đăng ký tài khoản miễn phí tại{" "}
                <a
                  href="https://cloudinary.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5"
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
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Cloud Name *
              </label>
              <input
                type="text"
                value={cloudinaryConfig.cloud_name || ""}
                onChange={(e) =>
                  setCloudinaryConfig({ ...cloudinaryConfig, cloud_name: e.target.value })
                }
                placeholder="ví dụ: maigo79 hoặc dx9xyz..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
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
      {/* TAB: TELEGRAM NOTIFICATIONS */}
      {/* ========================================================================= */}
      {activeTab === "telegram" && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="text-sky-500" size={22} />
                <span>Cấu Hình Thông Báo Đơn Đặt Xe Qua Telegram</span>
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Tự động gửi thông tin chi tiết của khách hàng và chuyến đi về điện thoại / máy tính qua Telegram Bot ngay khi khách bấm đặt xe
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveSection("telegram_config", telegramConfig)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{isSaving ? "Đang lưu..." : "Lưu Cấu Hình Telegram"}</span>
            </button>
          </div>

          {/* Guide Box */}
          <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-lg text-xs text-sky-950 font-medium space-y-2.5">
            <p className="font-semibold flex items-center gap-1.5 text-sky-800 text-sm">
              <span>💡 Hướng dẫn tạo Bot Telegram nhận thông báo (Chỉ mất 1 phút):</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
              <li>
                Mở Telegram, tìm kiếm <b>@BotFather</b> (có tích xanh) ➔ Gửi lệnh <code>/newbot</code> ➔ Đặt tên và username cho bot (kết thúc bằng <code>_bot</code>).
              </li>
              <li>
                BotFather sẽ gửi lại <b>HTTP API Token</b> (ví dụ: <code>7123456789:AAH...</code>) ➔ Dán vào ô <b>Bot Token</b> bên dưới.
              </li>
              <li>
                <b>Lấy Chat ID cá nhân:</b> Nhắn tin bất kỳ cho bot bạn vừa tạo, sau đó tìm kiếm <b>@userinfobot</b> trên Telegram ➔ Bot sẽ trả về số <code>Id</code> của bạn (ví dụ: <code>123456789</code>) ➔ Dán vào ô <b>Chat ID</b>.
              </li>
              <li>
                <b>Hoặc lấy Chat ID nhóm:</b> Thêm Bot vào Nhóm Telegram của bạn ➔ Gán quyền Admin cho bot ➔ Gửi 1 tin nhắn vào nhóm. Chat ID nhóm thường có dấu trừ ở đầu (ví dụ: <code>-1001234567890</code>).
              </li>
            </ol>
          </div>

          <div className="space-y-5">
            {/* Status Switch */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <p className="text-xs font-bold text-slate-900">Bật thông báo Telegram</p>
                <p className="text-[11px] text-slate-500 font-normal">
                  Cho phép hệ thống gửi tin nhắn tự động khi có khách đặt xe trên website
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramConfig.is_enabled}
                  onChange={(e) =>
                    setTelegramConfig({ ...telegramConfig, is_enabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Telegram Bot Token *
                </label>
                <input
                  type="text"
                  value={telegramConfig.bot_token || ""}
                  onChange={(e) =>
                    setTelegramConfig({ ...telegramConfig, bot_token: e.target.value })
                  }
                  placeholder="ví dụ: 7891234567:AAHxyz987abc_123456..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Chat ID (Cá nhân hoặc ID Nhóm) *
                </label>
                <input
                  type="text"
                  value={telegramConfig.chat_id || ""}
                  onChange={(e) =>
                    setTelegramConfig({ ...telegramConfig, chat_id: e.target.value })
                  }
                  placeholder="ví dụ: 123456789 (cá nhân) hoặc -1001234567890 (nhóm)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Topic ID / Thread ID (Tùy chọn - Dành cho nhóm có phân chia Topic)
              </label>
              <input
                type="text"
                value={telegramConfig.topic_id || ""}
                onChange={(e) =>
                  setTelegramConfig({ ...telegramConfig, topic_id: e.target.value })
                }
                placeholder="ví dụ: 2 (để trống nếu không dùng Topic)"
                className="w-full md:w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm font-mono text-slate-900 outline-none focus:bg-white focus:border-blue-600"
              />
            </div>

            {/* Test Button & Result Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="button"
                disabled={isTestingTelegram}
                onClick={handleTestTelegram}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isTestingTelegram ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-sky-400" />
                    <span>Đang gửi tin nhắn thử...</span>
                  </>
                ) : (
                  <>
                    <Bell size={15} className="text-sky-400" />
                    <span>Gửi tin nhắn thử nghiệm (Test Message)</span>
                  </>
                )}
              </button>

              {testTelegramResult && (
                <div
                  className={`text-xs font-semibold px-3 py-2 rounded-md ${
                    testTelegramResult.success
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {testTelegramResult.success ? "✅ " : "❌ "}
                  {testTelegramResult.message}
                </div>
              )}
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
            <h2 className="text-lg font-bold text-slate-900">
              Quản Trị Nâng Cao - Dữ Liệu Thô (Raw JSON Database)
            </h2>
            <p className="text-xs text-slate-500 font-normal">
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
                  <span className="font-mono text-xs font-semibold text-blue-600">
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
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold cursor-pointer"
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
