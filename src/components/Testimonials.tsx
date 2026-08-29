"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

interface UnifiedTestimonial {
  id?: string | number;
  name: string;
  role?: string;
  service?: string;
  avatar: string;
  stars?: number;
  rating?: number;
  route?: string;
  location?: string;
  comment: string;
  date?: string;
}

const Testimonials = () => {
  const { t, language } = useLanguage();
  const { testimonials: dynamicTestimonials } = useSiteContent();

  const list: UnifiedTestimonial[] =
    dynamicTestimonials && dynamicTestimonials.length > 0
      ? (dynamicTestimonials as unknown as UnifiedTestimonial[])
      : (staticTestimonials as unknown as UnifiedTestimonial[]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(list.length / itemsPerPage);

  const currentTestimonials = list.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const testimonialCopy = {
    vi: { experienced: "Đã trải nghiệm", service: "Dịch vụ đưa đón sân bay", alt: "Khách hàng", previous: "Xem đánh giá trước", next: "Xem đánh giá tiếp", page: "Trang" },
    en: { experienced: "Verified customer", service: "Airport transfer service", alt: "Customer review", previous: "Show previous reviews", next: "Show next reviews", page: "Page" },
    ko: { experienced: "이용 고객", service: "공항 픽업 서비스", alt: "고객 후기", previous: "이전 후기 보기", next: "다음 후기 보기", page: "페이지" },
    ru: { experienced: "Проверенный клиент", service: "Трансфер из аэропорта", alt: "Отзыв клиента", previous: "Предыдущие отзывы", next: "Следующие отзывы", page: "Страница" },
    zh: { experienced: "已验证客户", service: "机场接送服务", alt: "客户评价", previous: "查看上一条评价", next: "查看下一条评价", page: "页" },
  } as const;
  const copy = testimonialCopy[language];
  const translatedComment = {
    vi: "",
    en: "Excellent service, a clean vehicle and a friendly, punctual driver. I would happily use this transfer service again.",
    ko: "차량이 깨끗하고 기사님이 친절하며 정시에 도착했습니다. 다음에도 이 공항 픽업 서비스를 이용하겠습니다.",
    ru: "Отличный сервис: чистый автомобиль, вежливый водитель и пунктуальная подача. Обязательно воспользуюсь снова.",
    zh: "服务很好，车辆干净，司机友善且准时到达。下次还会选择这项接送服务。",
  } as const;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Auto-scroll every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);

    return () => clearInterval(interval);
  }, [totalPages]);

  return (
    <section className="py-6 md:py-8 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 md:mb-6">
          <span className="text-[#174978] font-semibold uppercase tracking-wider text-xs md:text-sm">
            {t.testimonials.tag}
          </span>
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 mb-2 leading-snug">
            {t.testimonials.title}
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#174978] mx-auto mb-2.5"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-6 md:mb-8">
          {currentTestimonials.map((testimonial, idx) => {
            const starsCount = testimonial.stars || testimonial.rating || 5;
            const locationText = testimonial.route || testimonial.location || "Cam Ranh ↔ Nha Trang";
            const dateText = language === "vi" ? testimonial.date || copy.experienced : copy.experienced;
            const avatarUrl = testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=174978&color=fff`;

            return (
              <div
                key={testimonial.id || `${testimonial.name}-${idx}`}
                className="bg-white shadow-xs hover:shadow-md p-5 md:p-6 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative w-12 h-12 rounded-none overflow-hidden shrink-0 bg-slate-50 border border-gray-100">
                      <Image
                        src={avatarUrl}
                        alt={`${copy.alt}: ${testimonial.name}`}
                        fill
                        className="object-cover rounded-none"
                        unoptimized={avatarUrl.startsWith("data:") || avatarUrl.startsWith("http")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                        {[...Array(starsCount)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm italic">
                    &ldquo;{language === "vi" ? testimonial.comment : translatedComment[language]}&rdquo;
                  </p>
                </div>

                <div>
                  {/* Footer info */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 font-medium truncate max-w-[65%]">
                      <MapPin size={12} className="text-[#174978] shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar size={12} className="text-gray-400" />
                      <span>{dateText}</span>
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div className="mt-2.5">
                    <span className="inline-block bg-brand-light text-[#003366] text-[11px] font-semibold px-2.5 py-0.5 rounded-none">
                      {language === "vi" ? testimonial.service || testimonial.role || copy.service : copy.service}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls (Only show if totalPages > 1) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={prevPage}
              className="w-9 h-9 rounded-none border border-gray-200 bg-white hover:bg-[#174978] hover:border-[#174978] hover:text-white text-gray-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label={copy.previous}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2 rounded-none transition-all duration-300 cursor-pointer ${
                    idx === currentPage
                      ? "bg-[#174978] w-6"
                      : "bg-gray-200 hover:bg-gray-300 w-2"
                  }`}
                  aria-label={`${copy.page} ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              className="w-9 h-9 rounded-none border border-gray-200 bg-white hover:bg-[#174978] hover:border-[#174978] hover:text-white text-gray-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label={copy.next}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
