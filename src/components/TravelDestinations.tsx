"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function TravelDestinations() {
  const { destinations } = useSiteContent();

  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-5 md:mb-6">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center">
            KHÁM PHÁ DU LỊCH NHA TRANG – CAM RANH
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-1 mb-2">
            Các Địa Điểm Du Lịch Nổi Tiếng
          </h2>
          <div className="w-20 md:w-24 h-1 bg-[#174978] mx-auto mb-2.5"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Dịch vụ xe riêng đưa đón tận nơi từ sân bay Cam Ranh và khách sạn Nha Trang đến các danh lam thắng cảnh đẹp nhất với giá cước niêm yết trọn gói.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-none border border-gray-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Destination Image with Tag & Distance */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100 rounded-none">
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-none"
                    unoptimized={dest.image.startsWith("http") || dest.image.startsWith("data:")}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Tag badge */}
                  {dest.tag && (
                    <span className="absolute top-2.5 left-2.5 z-10 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-blue-600 text-white shadow-xs">
                      {dest.tag}
                    </span>
                  )}

                  {/* Distance badge */}
                  {dest.distance && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center gap-1.5 text-xs text-white/95 font-medium">
                      <MapPin size={13} className="text-orange-400 shrink-0" />
                      <span className="truncate">{dest.distance}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {dest.title}
                  </h3>

                  {dest.subtitle && (
                    <p className="text-xs font-semibold text-blue-600">
                      {dest.subtitle}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-5 pt-0 mt-1">
                <Link
                  href="/#formbooking"
                  className="w-full min-h-10.5 py-2.5 px-4 rounded-none bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-semibold text-xs transition-all flex items-center justify-center border border-slate-200 hover:border-blue-600 text-center touch-manipulation"
                >
                  <span>Đặt Xe Đi {dest.title.split("&")[0].trim()}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
