"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BookingForm from "./BookingForm";
import { fakeBookings } from "@/data/fakeBookings";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const HeroSection = () => {
  const { t } = useLanguage();
  const { hero } = useSiteContent();
  const images = hero.banners && hero.banners.length > 0 ? hero.banners : ["/images/Hero1.jpg", "/images/Hero2.jpg", "/images/Hero22.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleBookings, setVisibleBookings] = useState(
    fakeBookings.slice(0, 5)
  );

  useEffect(() => {
    // Auto-slide images every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Add new booking every 3 seconds
    let bookingIndex = 5;
    const bookingInterval = setInterval(() => {
      setVisibleBookings((prev) => {
        const newBooking = fakeBookings[bookingIndex % fakeBookings.length];
        const updated = [...prev.slice(1), newBooking]; // Remove first, add new at end
        bookingIndex++;
        return updated;
      });
    }, 3000);

    return () => clearInterval(bookingInterval);
  }, []);

  const bgImage = images[0] || "/images/Hero1.jpg";

  return (
    <section className="relative w-full bg-gray-100 min-h-150 flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 flex flex-col md:flex-row items-stretch gap-4 md:gap-8 py-6 md:py-10">
        {/* Left: Booking Form */}
        <div
          id="formbooking"
          className="w-full md:w-1/2 flex justify-center md:justify-start slide-in-left"
        >
          <BookingForm />
        </div>

        {/* Right: Split Column */}
        <div className="w-full md:w-1/2 hidden md:flex flex-col gap-4 h-full slide-in-right">
          {/* Top: Image Carousel (50%) */}
          <div className="rounded-2xl overflow-hidden shadow-xl relative flex-1 w-full min-h-60 bg-gray-200">
            {/* Images with Fade Transition */}
            {images.map((src, index) => (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt={t.hero.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Dots Indicators at bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                    index === currentIndex
                      ? "bg-[#75A2BF] w-6"
                      : "bg-white/70 w-2"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom: Live Bookings List (50%) - Slide Up Animation */}
          <div className="rounded-2xl overflow-hidden shadow-xl bg-linear-to-br from-white to-gray-50 flex-1 w-full min-h-70 border border-gray-200 flex flex-col relative">
            {/* Header */}
            <div className="bg-linear-to-r from-[#003366] via-[#174978] to-[#2F5F8A] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-white font-bold text-sm">
                  {t.hero.recentBookings}
                </span>
              </div>
              <div className="bg-white/20 rounded-full px-2.5 py-0.5">
                <span className="text-white text-xs font-bold tracking-wider">
                  {t.hero.live}
                </span>
              </div>
            </div>
            <style jsx>{`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .booking-item {
                animation: slideUp 0.5s ease-out;
              }
            `}</style>

            <div className="overflow-hidden flex-1 relative p-4 flex flex-col justify-end">
              {visibleBookings.map((booking, idx) => (
                <div
                  key={`${booking.name}-${idx}`}
                  className="booking-item flex items-center justify-between text-sm border-b border-dashed border-gray-200 pb-2.5 mb-2.5 last:border-0 last:pb-0 last:mb-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#174978] font-bold">●</span>
                    <div className="flex flex-col">
                      <div className="text-gray-700 text-xs font-medium">
                        {t.hero.customer}:{" "}
                        <span className="font-bold text-[#003366]">
                          {booking.name}
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {t.hero.booked} {booking.type}{" "}
                        <span className="text-gray-400">({booking.phone})</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#174978] text-xs whitespace-nowrap">
                    {booking.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
