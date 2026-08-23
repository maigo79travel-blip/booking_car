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
  const { t } = useLanguage();
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
    <section className="py-12 md:py-16 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <span className="text-[#174978] font-semibold uppercase tracking-wider text-xs md:text-sm">
            {t.testimonials.tag}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t.testimonials.title}
          </h2>
          <div className="w-24 h-1 bg-[#174978] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {currentTestimonials.map((testimonial, idx) => {
            const starsCount = testimonial.stars || testimonial.rating || 5;
            const locationText = testimonial.route || testimonial.location || "Cam Ranh ↔ Nha Trang";
            const dateText = testimonial.date || "Đã trải nghiệm";
            const avatarUrl = testimonial.avatar || "/images/Hero1.jpg";

            return (
              <div
                key={testimonial.id || `${testimonial.name}-${idx}`}
                className="bg-white shadow-xs hover:shadow-md p-6 md:p-8 transition-all border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-14 h-14 overflow-hidden border border-[#174978] shrink-0 bg-gray-100">
                      <Image
                        src={avatarUrl}
                        alt={`Khách hàng ${testimonial.name} đánh giá dịch vụ maigo79.com`}
                        fill
                        className="object-cover"
                        unoptimized={avatarUrl.startsWith("data:") || avatarUrl.startsWith("http")}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-400 mt-1">
                        {[...Array(starsCount)].map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base italic">
                    &ldquo;{testimonial.comment}&rdquo;
                  </p>
                </div>

                <div>
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin size={13} className="text-[#174978]" />
                      <span>{locationText}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{dateText}</span>
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div className="mt-3">
                    <span className="inline-block bg-brand-light text-[#003366] text-xs font-semibold px-3 py-1">
                      {testimonial.service || testimonial.role || "Dịch vụ đưa đón sân bay"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevPage}
            className="bg-[#174978] hover:bg-[#003366] text-white p-2 transition-colors cursor-pointer"
            aria-label="Xem đánh giá trước"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`h-2 transition-all cursor-pointer ${
                  idx === currentPage ? "bg-[#003366] w-6" : "bg-gray-300 w-2"
                }`}
                aria-label={`Trang ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            className="bg-[#174978] hover:bg-[#003366] text-white p-2 transition-colors cursor-pointer"
            aria-label="Xem đánh giá tiếp"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
