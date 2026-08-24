"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Car, Users, Check, ArrowRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

export default function FeaturedVehicles() {
  const { featuredVehicles } = useSiteContent();

  if (!featuredVehicles || featuredVehicles.length === 0) return null;

  return (
    <section className="py-8 md:py-14 bg-linear-to-b from-white to-gray-50/70">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <span className="text-[#174978] font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center">
            ĐỘI XE PHỤC VỤ CAO CẤP
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-1.5 mb-2.5">
            Các Dòng Xe Đưa Đón Nổi Bật
          </h2>
          <div className="w-20 md:w-24 h-1 bg-[#174978] mx-auto mb-3 md:mb-4 rounded-full"></div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
            100% xe đời mới 2022 - 2026, nội thất sạch sẽ, êm ái, đầy đủ nước suối khăn lạnh và tài xế lịch sự, tận tâm.
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl border border-gray-200/90 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Vehicle Image with Tag */}
                <div className="relative w-full h-40 sm:h-44 bg-slate-50 overflow-hidden flex items-center justify-center p-3 border-b border-gray-100">
                  {vehicle.tag && (
                    <span className="absolute top-2.5 left-2.5 z-10 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-xs">
                      {vehicle.tag}
                    </span>
                  )}
                  <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain"
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
                      {vehicle.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1.5 rounded-md">
                    <Users size={14} className="text-slate-600 shrink-0" />
                    <span>{vehicle.seats}</span>
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
                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block">Giá trọn gói</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-700">
                      {vehicle.price}
                    </span>
                  </div>

                  <Link
                    href="/#formbooking"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all touch-manipulation"
                  >
                    <span>Đặt Xe</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
